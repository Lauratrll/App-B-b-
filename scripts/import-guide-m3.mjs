// scripts/import-guide-m3.mjs
// ===========================================================================
// Import CIBLÉ du module "guide" pour le mois 3 uniquement.
// Reprend la logique de decomposeGuide() de import-content.mjs.
// Idempotent : supprime module='guide' du mois 3, puis réinsère.
// Ne touche PAS aux autres modules.
//
// Lancement :  node scripts/import-guide-m3.mjs
// ===========================================================================

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

config({ path: ".env.local" });
config({ path: ".env" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "ERREUR : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env.local",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CONTENT_DIR = join(process.cwd(), "content");
const MOIS = 3;

function decomposeGuide(json, mois) {
  const rows = [];
  const { protocoles, categories, ...rest } = json;

  const normalizedCategories = Array.isArray(categories)
    ? categories.map((c) => ({
        id: c.id,
        nom: c.nom,
        icone: c.icone ?? c.emoji ?? "",
        sous_titre: c.sous_titre ?? c.description ?? "",
      }))
    : [];

  const meta = {
    ...rest,
    titre_rubrique: rest.titre_rubrique ?? rest.titre,
    categories: normalizedCategories,
  };
  rows.push({
    mois,
    module: "guide",
    categorie: "_meta",
    situation: null,
    ordre: 0,
    data: meta,
  });

  if (Array.isArray(protocoles)) {
    protocoles.forEach((p, i) => {
      rows.push({
        mois,
        module: "guide",
        categorie: p.categorie ?? null,
        situation: p.situation ?? null,
        ordre: i,
        data: p,
      });
    });
  } else if (
    Array.isArray(categories) &&
    categories.some((c) => Array.isArray(c.protocoles))
  ) {
    let ordre = 0;
    categories.forEach((c) => {
      (c.protocoles || []).forEach((p) => {
        const situation = p.situation ?? p.titre;
        const normalized = {
          ...p,
          categorie: c.id,
          situation,
          principe: p.principe ?? p.a_retenir,
        };
        rows.push({
          mois,
          module: "guide",
          categorie: c.id,
          situation,
          ordre: ordre++,
          data: normalized,
        });
      });
    });
  }
  return rows;
}

async function main() {
  const m = String(MOIS).padStart(2, "0");
  const path = join(CONTENT_DIR, `mois-${m}`, "01-guide.json");
  console.log(`Import ciblé du module "guide" — mois ${m}\n`);

  if (!existsSync(path)) {
    console.error(`  ✗ ${path} introuvable.`);
    process.exit(1);
  }

  let json;
  try {
    json = JSON.parse(readFileSync(path, "utf-8"));
  } catch (err) {
    console.error(`  ✗ JSON invalide → ${err.message}`);
    process.exit(1);
  }

  const rows = decomposeGuide(json, MOIS);

  const delErr = await supabase
    .from("content")
    .delete()
    .eq("mois", MOIS)
    .eq("module", "guide");
  if (delErr.error) {
    console.error(`  ✗ DELETE guide mois ${m} → ${delErr.error.message}`);
    process.exit(1);
  }

  const { error: insErr } = await supabase.from("content").insert(rows);
  if (insErr) {
    console.error(`  ✗ erreur INSERT → ${insErr.message}`);
    process.exit(1);
  }

  const protos = rows.filter((r) => r.categorie !== "_meta").length;
  console.log(`  ✓ mois-${m} : ${rows.length} ligne(s) (1 _meta + ${protos} protocole(s))`);

  const revalidateUrl = process.env.REVALIDATE_URL;
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  if (revalidateUrl && revalidateSecret) {
    try {
      const res = await fetch(revalidateUrl, {
        method: "POST",
        headers: { "x-revalidate-secret": revalidateSecret },
      });
      console.log(
        res.ok
          ? `\n✅ Cache invalidé (${revalidateUrl})`
          : `\n⚠️  Revalidation échouée (${res.status})`,
      );
    } catch (err) {
      console.warn(`\n⚠️  Impossible de joindre ${revalidateUrl} : ${err.message}`);
    }
  } else {
    console.log(
      "\nℹ️  Cache non invalidé (REVALIDATE_URL/REVALIDATE_SECRET non définis). TTL max 1h.",
    );
  }

  console.log("\n✅ Terminé.");
}

main().catch((err) => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});

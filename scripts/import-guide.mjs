// scripts/import-guide.mjs
// ===========================================================================
// Import SURGICAL du module « guide » pour UN mois, au format « un fichier par
// catégorie » : M{mois}_guide_moi_N{slot}_{categorie}.json
//
//   node scripts/import-guide.mjs 23
//
// Agrège tous les fichiers catégorie du mois (helper partagé avec
// import-content.mjs), supprime UNIQUEMENT le module guide de ce mois, puis
// réinsère. Idempotent. Ne touche à aucun autre module ni aux autres mois.
//
// Permet de publier les catégories au fur et à mesure : un mois partiel
// (3 fichiers sur 8) fonctionne — la page 1 n'affiche que les catégories prêtes.
// ===========================================================================

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { decomposeGuideCategories } from "./lib/guide-decompose.mjs";

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

const MOIS = Number.parseInt(process.argv[2], 10);
if (Number.isNaN(MOIS) || MOIS < 0 || MOIS > 24) {
  console.error("Usage : node scripts/import-guide.mjs <mois 0-24>");
  console.error("Ex.   : node scripts/import-guide.mjs 23");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Motif des fichiers catégorie DU mois demandé. Groupe 1 = slot d'affichage.
const MONTH_CAT_RE = new RegExp(
  `^M${MOIS}_guide_moi_N(\\d+)_[a-z0-9_]+\\.json$`,
  "i",
);

async function main() {
  const m = String(MOIS).padStart(2, "0");
  const dir = join(process.cwd(), "content", `mois-${m}`);
  console.log(`Import surgical du module « guide » — mois ${MOIS}\n`);

  if (!existsSync(dir)) {
    console.error(`  ✗ Dossier introuvable : ${dir}`);
    process.exit(1);
  }

  // Collecte + tri par slot des fichiers catégorie.
  const parsed = [];
  for (const f of readdirSync(dir)) {
    const match = f.match(MONTH_CAT_RE);
    if (!match) continue;
    try {
      const json = JSON.parse(readFileSync(join(dir, f), "utf-8"));
      parsed.push({ file: f, slot: parseInt(match[1], 10), json });
    } catch (err) {
      console.error(`  ✗ ${f} : JSON invalide → ${err.message}`);
      process.exit(1);
    }
  }

  if (parsed.length === 0) {
    console.error(
      `  ✗ Aucun fichier M${MOIS}_guide_moi_N{slot}_*.json trouvé dans ${dir}.`,
    );
    process.exit(1);
  }

  const rows = decomposeGuideCategories(parsed, MOIS);

  const delRes = await supabase
    .from("content")
    .delete()
    .eq("mois", MOIS)
    .eq("module", "guide");
  if (delRes.error) {
    console.error(`  ✗ DELETE guide mois ${m} → ${delRes.error.message}`);
    process.exit(1);
  }

  const { error: insErr } = await supabase.from("content").insert(rows);
  if (insErr) {
    console.error(`  ✗ INSERT → ${insErr.message}`);
    process.exit(1);
  }

  const meta = rows.find((r) => r.categorie === "_meta");
  const cats = meta?.data.categories ?? [];
  console.log(
    `  ✓ ${cats.length} catégorie(s) publiée(s) : ${cats.map((c) => c.id).join(", ")}`,
  );
  cats.forEach((c) => {
    const n = rows.filter(
      (r) => r.categorie === c.id && r.categorie !== "_meta",
    ).length;
    console.log(`      • ${c.id} : ${n} situation(s)`);
  });
  const protos = rows.length - 1;
  console.log(
    `  ✓ ${rows.length} ligne(s) insérée(s) (1 _meta + ${protos} protocole(s))`,
  );

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

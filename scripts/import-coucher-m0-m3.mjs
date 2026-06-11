// scripts/import-coucher-m0-m3.mjs
// ===========================================================================
// Import CIBLÉ du module "coucher" pour les mois 0 à 3 uniquement.
// Reprend la logique de decomposeCoucher() de import-content.mjs :
//   - 1 ligne module='coucher' categorie='_full'
//   - 1 ligne module='reflexo' categorie='coucher' (si reflexologie_du_coucher)
// Idempotent : supprime ces lignes-là pour chaque mois, puis réinsère.
// Ne touche PAS aux autres modules (guide, soin, saison, audio, jeux).
//
// Lancement :  node scripts/import-coucher-m0-m3.mjs
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
const MOIS = [0, 1, 2, 3];

function decomposeCoucher(json, mois) {
  const rows = [
    {
      mois,
      module: "coucher",
      categorie: "_full",
      situation: null,
      ordre: 0,
      data: json,
    },
  ];
  if (json.reflexologie_du_coucher) {
    rows.push({
      mois,
      module: "reflexo",
      categorie: "coucher",
      situation: null,
      ordre: 0,
      data: json.reflexologie_du_coucher,
    });
  }
  return rows;
}

async function importCoucher(mois) {
  const m = String(mois).padStart(2, "0");
  const path = join(CONTENT_DIR, `mois-${m}`, "02-coucher.json");
  if (!existsSync(path)) {
    console.warn(`  ⚠️  mois-${m}/02-coucher.json introuvable, ignoré.`);
    return;
  }

  let json;
  try {
    json = JSON.parse(readFileSync(path, "utf-8"));
  } catch (err) {
    console.error(`  ✗ mois-${m} : JSON invalide → ${err.message}`);
    return;
  }

  const rows = decomposeCoucher(json, mois);

  // Suppression ciblée : module='coucher' + module='reflexo'/categorie='coucher'
  const delCoucher = await supabase
    .from("content")
    .delete()
    .eq("mois", mois)
    .eq("module", "coucher");
  if (delCoucher.error) {
    console.error(`  ✗ DELETE coucher mois ${m} → ${delCoucher.error.message}`);
    return;
  }
  const delReflexo = await supabase
    .from("content")
    .delete()
    .eq("mois", mois)
    .eq("module", "reflexo")
    .eq("categorie", "coucher");
  if (delReflexo.error) {
    console.error(`  ✗ DELETE reflexo/coucher mois ${m} → ${delReflexo.error.message}`);
    return;
  }

  const { error: insErr } = await supabase.from("content").insert(rows);
  if (insErr) {
    console.error(`  ✗ mois-${m} : erreur INSERT → ${insErr.message}`);
    return;
  }

  const counts = rows.reduce((acc, r) => {
    acc[r.module] = (acc[r.module] ?? 0) + 1;
    return acc;
  }, {});
  const detail = Object.entries(counts)
    .map(([k, n]) => `${k}=${n}`)
    .join(", ");
  console.log(`  ✓ mois-${m} : ${rows.length} ligne(s) (${detail})`);
}

async function main() {
  console.log(`Import ciblé du module "coucher" — mois ${MOIS.join(", ")}\n`);
  for (const mois of MOIS) {
    await importCoucher(mois);
  }

  // Invalider le cache si configuré
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

// scripts/import-coucher-all.mjs
// ===========================================================================
// Import CIBLÉ du module "coucher" pour TOUS les mois ayant un 02-coucher.json.
// Reprend decomposeCoucher() de import-content.mjs :
//   - 1 ligne module='coucher' categorie='_full' (data = JSON complet, donc
//     variantes_developpementales / focus_par_theme / passage_par_theme inclus)
//   - 1 ligne module='reflexo' categorie='coucher' (si reflexologie_du_coucher)
// Idempotent : supprime ces lignes-là pour chaque mois, puis réinsère.
// Ne touche PAS aux autres modules.
//
// Lancement :  node scripts/import-coucher-all.mjs
// ===========================================================================

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync, readdirSync } from "node:fs";
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

function decomposeCoucher(json, mois) {
  const rows = [
    { mois, module: "coucher", categorie: "_full", situation: null, ordre: 0, data: json },
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
  if (!existsSync(path)) return false;

  let json;
  try {
    json = JSON.parse(readFileSync(path, "utf-8"));
  } catch (err) {
    console.error(`  ✗ mois-${m} : JSON invalide → ${err.message}`);
    return false;
  }

  const rows = decomposeCoucher(json, mois);

  const delCoucher = await supabase
    .from("content")
    .delete()
    .eq("mois", mois)
    .eq("module", "coucher");
  if (delCoucher.error) {
    console.error(`  ✗ DELETE coucher mois ${m} → ${delCoucher.error.message}`);
    return false;
  }
  const delReflexo = await supabase
    .from("content")
    .delete()
    .eq("mois", mois)
    .eq("module", "reflexo")
    .eq("categorie", "coucher");
  if (delReflexo.error) {
    console.error(`  ✗ DELETE reflexo/coucher mois ${m} → ${delReflexo.error.message}`);
    return false;
  }

  const { error: insErr } = await supabase.from("content").insert(rows);
  if (insErr) {
    console.error(`  ✗ mois-${m} : erreur INSERT → ${insErr.message}`);
    return false;
  }

  const extras = [];
  if (json.variantes_developpementales) extras.push("variantes");
  const detail = rows.length + " ligne(s)" + (extras.length ? " · " + extras.join(", ") : "");
  console.log(`  ✓ mois-${m} : ${detail}`);
  return true;
}

async function main() {
  const mois = readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^mois-\d+$/.test(d.name))
    .map((d) => parseInt(d.name.replace("mois-", ""), 10))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b);

  console.log(`Import ciblé du module "coucher" — mois disponibles\n`);
  let n = 0;
  for (const m of mois) {
    if (await importCoucher(m)) n++;
  }
  console.log(`\n${n} mois importé(s).`);

  const revalidateUrl = process.env.REVALIDATE_URL;
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  if (revalidateUrl && revalidateSecret) {
    try {
      const res = await fetch(revalidateUrl, {
        method: "POST",
        headers: { "x-revalidate-secret": revalidateSecret },
      });
      console.log(res.ok ? `✅ Cache invalidé (${revalidateUrl})` : `⚠️  Revalidation échouée (${res.status})`);
    } catch (err) {
      console.warn(`⚠️  Impossible de joindre ${revalidateUrl} : ${err.message}`);
    }
  } else {
    console.log("ℹ️  Cache non invalidé (REVALIDATE_URL/REVALIDATE_SECRET non définis). TTL max 1h.");
  }

  console.log("✅ Terminé.");
}

main().catch((err) => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});

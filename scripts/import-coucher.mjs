// scripts/import-coucher.mjs
// ===========================================================================
// Import CHIRURGICAL du seul module « Coucher » dans la table Supabase
// `content`, sans toucher aux autres modules (guide/soin/saison/audio/jeux).
//
// Pour chaque mois ayant un fichier 02-coucher.json :
//   1. DELETE des lignes  module='coucher'                       (mois X)
//   2. DELETE des lignes  module='reflexo' AND categorie='coucher' (mois X)
//   3. INSERT  → 1 ligne coucher (_full) + 1 ligne reflexo/coucher
//      (cette dernière uniquement si `reflexologie_du_coucher` est présent ;
//       absente en M0, donc aucune ligne reflexo/coucher pour M0).
//
// Contrairement à import-content.mjs, ce script NE purge PAS tout le mois :
// il ne supprime QUE les lignes du Coucher. Sûr pour les mois dont seuls
// certains modules existent sur disque.
//
// Lancement :  node scripts/import-coucher.mjs
// ===========================================================================

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, existsSync } from "node:fs";
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

// Décomposeur Coucher (identique à import-content.mjs).
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

async function importMois(mois, dir) {
  const path = join(dir, "02-coucher.json");
  if (!existsSync(path)) return null;

  let json;
  try {
    json = JSON.parse(readFileSync(path, "utf-8"));
  } catch (err) {
    console.error(`  ✗ mois ${mois} : JSON invalide → ${err.message}`);
    return null;
  }

  // 1) Suppression chirurgicale des lignes Coucher du mois.
  const delCoucher = await supabase
    .from("content")
    .delete()
    .eq("mois", mois)
    .eq("module", "coucher");
  if (delCoucher.error) {
    console.error(`  ✗ mois ${mois} : DELETE coucher → ${delCoucher.error.message}`);
    return null;
  }
  const delReflexo = await supabase
    .from("content")
    .delete()
    .eq("mois", mois)
    .eq("module", "reflexo")
    .eq("categorie", "coucher");
  if (delReflexo.error) {
    console.error(`  ✗ mois ${mois} : DELETE reflexo/coucher → ${delReflexo.error.message}`);
    return null;
  }

  // 2) Ré-insertion.
  const rows = decomposeCoucher(json, mois);
  const { error: insErr } = await supabase.from("content").insert(rows);
  if (insErr) {
    console.error(`  ✗ mois ${mois} : INSERT → ${insErr.message}`);
    return null;
  }

  const hasReflexo = rows.some((r) => r.module === "reflexo");
  console.log(
    `  ✓ mois ${String(mois).padStart(2, "0")} : ${rows.length} ligne(s) (coucher=1${
      hasReflexo ? ", reflexo/coucher=1" : ", pas de réflexo"
    })`,
  );
  return rows.length;
}

async function main() {
  if (!existsSync(CONTENT_DIR)) {
    console.error(`Dossier /content introuvable : ${CONTENT_DIR}`);
    process.exit(1);
  }

  const dirs = readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("mois-"))
    .map((d) => d.name)
    .sort();

  console.log(`Import Coucher (chirurgical) — ${dirs.length} mois\n`);

  let total = 0;
  let months = 0;
  for (const d of dirs) {
    const mois = parseInt(d.replace("mois-", ""), 10);
    if (Number.isNaN(mois)) continue;
    const n = await importMois(mois, join(CONTENT_DIR, d));
    if (n != null) {
      total += n;
      months += 1;
    }
  }

  console.log(`\n✅ Import Coucher terminé : ${months} mois, ${total} ligne(s).`);

  // Vérification : compte des lignes coucher en base.
  const { count } = await supabase
    .from("content")
    .select("*", { count: "exact", head: true })
    .eq("module", "coucher");
  console.log(`   Lignes module='coucher' en base : ${count ?? "?"}`);

  // Invalidation du cache (revalidation) si configurée.
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
          ? `✅ Cache invalidé (${revalidateUrl})`
          : `⚠️  Revalidation échouée (${res.status})`,
      );
    } catch (err) {
      console.warn(`⚠️  Impossible de joindre ${revalidateUrl} : ${err.message}`);
    }
  } else {
    console.log(
      "ℹ️  Cache non invalidé (REVALIDATE_URL/REVALIDATE_SECRET non définis) — visible sous max 1h.",
    );
  }
}

main().catch((err) => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});

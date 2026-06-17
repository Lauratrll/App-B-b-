// scripts/import-soin.mjs
// ===========================================================================
// Import CHIRURGICAL du seul module « Prendre soin de moi » dans la table
// Supabase `content`, sans toucher aux autres modules.
//
// Pour chaque mois ayant un fichier 03-soin.json :
//   1. DELETE des lignes  module='soin'                          (mois X)
//   2. DELETE des lignes  module='reflexo' AND categorie='soin'  (mois X)
//   3. INSERT :
//      - 1 ligne soin/_meta (json sans `conseils`)
//      - 1 ligne soin/conseil par conseil (situation=id, ordre=numero, data=c)
//      - 1 ligne reflexo/soin pour chaque conseil dont l'id contient "reflex"
//
// Contrairement à import-content.mjs, ce script NE purge PAS tout le mois :
// il ne supprime QUE les lignes du module Soin.
//
// Lancement :  node scripts/import-soin.mjs
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

// Décomposeur Soin (identique à import-content.mjs).
function decomposeSoin(json, mois) {
  const rows = [];
  const { conseils, ...meta } = json;
  rows.push({
    mois,
    module: "soin",
    categorie: "_meta",
    situation: null,
    ordre: 0,
    data: meta,
  });
  (conseils || []).forEach((c) => {
    rows.push({
      mois,
      module: "soin",
      categorie: "conseil",
      situation: c.id ?? null,
      ordre: c.numero ?? 0,
      data: c,
    });
    const isReflexo =
      typeof c.id === "string" && c.id.toLowerCase().includes("reflex");
    if (isReflexo) {
      rows.push({
        mois,
        module: "reflexo",
        categorie: "soin",
        situation: c.id,
        ordre: c.numero ?? 0,
        data: c,
      });
    }
  });
  return rows;
}

async function importMois(mois, dir) {
  const path = join(dir, "03-soin.json");
  if (!existsSync(path)) return null;

  let json;
  try {
    json = JSON.parse(readFileSync(path, "utf-8"));
  } catch (err) {
    console.error(`  ✗ mois ${mois} : JSON invalide → ${err.message}`);
    return null;
  }

  // 1) Suppression chirurgicale des lignes Soin du mois.
  const delSoin = await supabase
    .from("content")
    .delete()
    .eq("mois", mois)
    .eq("module", "soin");
  if (delSoin.error) {
    console.error(`  ✗ mois ${mois} : DELETE soin → ${delSoin.error.message}`);
    return null;
  }
  const delReflexo = await supabase
    .from("content")
    .delete()
    .eq("mois", mois)
    .eq("module", "reflexo")
    .eq("categorie", "soin");
  if (delReflexo.error) {
    console.error(`  ✗ mois ${mois} : DELETE reflexo/soin → ${delReflexo.error.message}`);
    return null;
  }

  // 2) Ré-insertion.
  const rows = decomposeSoin(json, mois);
  const { error: insErr } = await supabase.from("content").insert(rows);
  if (insErr) {
    console.error(`  ✗ mois ${mois} : INSERT → ${insErr.message}`);
    return null;
  }

  const conseils = rows.filter((r) => r.module === "soin" && r.categorie === "conseil").length;
  const reflexo = rows.filter((r) => r.module === "reflexo").length;
  console.log(
    `  ✓ mois ${String(mois).padStart(2, "0")} : ${conseils} conseil(s)${reflexo ? `, ${reflexo} reflexo/soin` : ""}`,
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

  console.log(`Import Soin (chirurgical) — ${dirs.length} mois\n`);

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

  console.log(`\n✅ Import Soin terminé : ${months} mois, ${total} ligne(s).`);

  const { count } = await supabase
    .from("content")
    .select("*", { count: "exact", head: true })
    .eq("module", "soin")
    .eq("categorie", "conseil");
  console.log(`   Lignes soin/conseil en base : ${count ?? "?"}`);

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

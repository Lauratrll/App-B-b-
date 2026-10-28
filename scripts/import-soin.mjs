// scripts/import-soin.mjs
// ===========================================================================
// Import CHIRURGICAL du seul module « Prendre soin de moi » dans la table
// Supabase `content`, sans toucher aux autres modules.
//
// Source (depuis le 26/10/2026) : content/prendre-soin/M{n}_soin.json
//
// Pour chaque mois, lignes attendues :
//   - 1 ligne soin/_meta (json sans `conseils`)
//   - 1 ligne soin/conseil par conseil (situation=id, ordre=numero, data=c)
//   - 1 ligne reflexo/soin pour chaque conseil dont l'id contient "reflex"
//
// Mise à jour EN PLACE (28/10) : une ligne qui existe déjà (même mois, module,
// catégorie, situation) est modifiée, pas supprimée, pour garder les
// épingles des parents. Les lignes nouvelles sont ajoutées ; celles qui ne
// sont plus dans le fichier sont supprimées (leurs épingles avec).
//
// Lancement :  node scripts/import-soin.mjs          (tous les mois)
//              node scripts/import-soin.mjs 0 3 9    (seulement ces mois)
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

const SOIN_DIR = join(process.cwd(), "content", "prendre-soin");
const FILE_RE = /^M(\d+)_soin\.json$/;

// Décomposeur Soin (identique à import-content.mjs).
function decomposeSoin(json, mois) {
  const rows = [];
  const { conseils, ...meta } = json;
  rows.push({ mois, module: "soin", categorie: "_meta", situation: null, ordre: 0, data: meta });
  (conseils || []).forEach((c) => {
    rows.push({
      mois,
      module: "soin",
      categorie: "conseil",
      situation: c.id ?? null,
      ordre: c.numero ?? 0,
      data: c,
    });
    const isReflexo = typeof c.id === "string" && c.id.toLowerCase().includes("reflex");
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

const cle = (r) => `${r.module}|${r.categorie}|${r.situation ?? ""}`;

async function importMois(mois, path) {
  let json;
  try {
    json = JSON.parse(readFileSync(path, "utf-8"));
  } catch (err) {
    console.error(`  ✗ mois ${mois} : JSON invalide → ${err.message}`);
    return null;
  }
  const rows = decomposeSoin(json, mois);

  // Lignes déjà en base pour ce mois (soin + reflexo/soin).
  const { data: existants, error: selErr } = await supabase
    .from("content")
    .select("id, module, categorie, situation")
    .eq("mois", mois)
    .or("module.eq.soin,and(module.eq.reflexo,categorie.eq.soin)");
  if (selErr) {
    console.error(`  ✗ mois ${mois} : lecture → ${selErr.message}`);
    return null;
  }
  const parCle = new Map();
  const doublons = [];
  for (const e of existants) {
    const k = cle(e);
    if (parCle.has(k)) doublons.push(e.id);
    else parCle.set(k, e.id);
  }

  let maj = 0;
  let ajouts = 0;
  for (const r of rows) {
    const id = parCle.get(cle(r));
    if (id) {
      const { error } = await supabase
        .from("content")
        .update({ data: r.data, ordre: r.ordre, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) {
        console.error(`  ✗ mois ${mois} : mise à jour ${cle(r)} → ${error.message}`);
        return null;
      }
      parCle.delete(cle(r));
      maj += 1;
    } else {
      const { error } = await supabase.from("content").insert(r);
      if (error) {
        console.error(`  ✗ mois ${mois} : ajout ${cle(r)} → ${error.message}`);
        return null;
      }
      ajouts += 1;
    }
  }

  // Lignes qui ne sont plus dans le fichier (et doublons éventuels).
  const aSupprimer = [...parCle.values(), ...doublons];
  if (aSupprimer.length > 0) {
    const { error } = await supabase.from("content").delete().in("id", aSupprimer);
    if (error) {
      console.error(`  ✗ mois ${mois} : suppression → ${error.message}`);
      return null;
    }
    console.log(`    mois ${mois} : ${aSupprimer.length} ligne(s) retirée(s) : ${[...parCle.keys()].join(", ")}`);
  }

  console.log(
    `  ✓ mois ${String(mois).padStart(2, "0")} : ${maj} mise(s) à jour, ${ajouts} ajout(s)`,
  );
  return rows.length;
}

async function main() {
  if (!existsSync(SOIN_DIR)) {
    console.error(`Dossier introuvable : ${SOIN_DIR}`);
    process.exit(1);
  }
  const demandes = process.argv.slice(2).map(Number).filter((n) => !Number.isNaN(n));

  const fichiers = readdirSync(SOIN_DIR)
    .map((f) => f.match(FILE_RE))
    .filter(Boolean)
    .map((m) => ({ mois: Number(m[1]), path: join(SOIN_DIR, m[0]) }))
    .filter((f) => demandes.length === 0 || demandes.includes(f.mois))
    .sort((a, b) => a.mois - b.mois);

  console.log(`Import Soin (en place) — ${fichiers.length} mois\n`);

  let total = 0;
  let months = 0;
  for (const f of fichiers) {
    const n = await importMois(f.mois, f.path);
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
        res.ok ? `✅ Cache invalidé (${revalidateUrl})` : `⚠️  Revalidation échouée (${res.status})`,
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

// scripts/import-content.mjs
// ===========================================================================
// Importe le contenu des fichiers JSON de /content/mois-XX/ dans la table
// Supabase `content`, en décomposant chaque module selon sa structure :
//
//   guide    → 1 ligne par protocole + 1 ligne metadata (categorie='_meta')
//   soin     → 1 ligne par conseil   + 1 ligne metadata
//   saison   → 1 ligne par version (printemps/ete/automne/hiver) + meta
//   audio    → 1 ligne par script    + 1 ligne metadata
//   jeux     → 1 ligne par activité  + 1 ligne metadata
//   coucher  → 1 ligne unique (bloc cohérent : rituel + réflexo + audio)
//
// Idempotent : DELETE puis INSERT pour chaque (mois, module).
//
// Lancement :  npm run import-content
// ===========================================================================

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

// Charger .env.local (et fallback .env)
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

// ----- Décomposeurs par module --------------------------------------------

function decomposeGuide(json, mois) {
  const rows = [];
  const { protocoles, ...meta } = json;
  rows.push({
    mois,
    module: "guide",
    categorie: "_meta",
    situation: null,
    ordre: 0,
    data: meta,
  });
  (protocoles || []).forEach((p, i) => {
    rows.push({
      mois,
      module: "guide",
      categorie: p.categorie ?? null,
      situation: p.situation ?? null,
      ordre: i,
      data: p,
    });
  });
  return rows;
}

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
  });
  return rows;
}

function decomposeSaison(json, mois) {
  const rows = [];
  const { versions, ...meta } = json;
  rows.push({
    mois,
    module: "saison",
    categorie: "_meta",
    situation: null,
    ordre: 0,
    data: meta,
  });
  const ORDER = ["printemps", "ete", "automne", "hiver"];
  ORDER.forEach((s, i) => {
    if (versions && versions[s]) {
      rows.push({
        mois,
        module: "saison",
        categorie: "saison",
        situation: s,
        ordre: i,
        data: versions[s],
      });
    }
  });
  return rows;
}

function decomposeAudio(json, mois) {
  const rows = [];
  const { scripts, ...meta } = json;
  rows.push({
    mois,
    module: "audio",
    categorie: "_meta",
    situation: null,
    ordre: 0,
    data: meta,
  });
  (scripts || []).forEach((s, i) => {
    rows.push({
      mois,
      module: "audio",
      categorie: "script",
      situation: s.id ?? null,
      ordre: i,
      data: s,
    });
  });
  return rows;
}

function decomposeJeux(json, mois) {
  const rows = [];
  const { activites, ...meta } = json;
  rows.push({
    mois,
    module: "jeux",
    categorie: "_meta",
    situation: null,
    ordre: 0,
    data: meta,
  });
  (activites || []).forEach((a) => {
    rows.push({
      mois,
      module: "jeux",
      categorie: "activite",
      situation: a.id ?? null,
      ordre: a.numero ?? 0,
      data: a,
    });
  });
  return rows;
}

function decomposeCoucher(json, mois) {
  return [
    {
      mois,
      module: "coucher",
      categorie: "_full",
      situation: null,
      ordre: 0,
      data: json,
    },
  ];
}

// Mapping fichier → (module, decomposer)
const FILE_HANDLERS = {
  "01-guide.json": { module: "guide", fn: decomposeGuide },
  "02-coucher.json": { module: "coucher", fn: decomposeCoucher },
  "03-soin.json": { module: "soin", fn: decomposeSoin },
  "04-saison.json": { module: "saison", fn: decomposeSaison },
  "05-audio.json": { module: "audio", fn: decomposeAudio },
  "06-jeux.json": { module: "jeux", fn: decomposeJeux },
};

// ----- Import par mois ----------------------------------------------------

async function importMois(mois, dir) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  for (const f of files) {
    const handler = FILE_HANDLERS[f];
    if (!handler) {
      console.log(`  - ${f} : aucun handler, skip`);
      continue;
    }
    const path = join(dir, f);
    let json;
    try {
      json = JSON.parse(readFileSync(path, "utf-8"));
    } catch (err) {
      console.error(`  ✗ ${f} : JSON invalide → ${err.message}`);
      continue;
    }
    const rows = handler.fn(json, mois);

    // Idempotence : on supprime avant d'insérer
    const { error: delErr } = await supabase
      .from("content")
      .delete()
      .eq("mois", mois)
      .eq("module", handler.module);
    if (delErr) {
      console.error(
        `  ✗ ${f} : erreur DELETE → ${delErr.message}`,
      );
      continue;
    }

    // Insertion en lot
    const { error: insErr } = await supabase.from("content").insert(rows);
    if (insErr) {
      console.error(
        `  ✗ ${f} : erreur INSERT → ${insErr.message}`,
      );
      continue;
    }
    console.log(
      `  ✓ ${f} (module=${handler.module}) : ${rows.length} lignes insérées`,
    );
  }
}

// ----- Main ---------------------------------------------------------------

async function main() {
  if (!existsSync(CONTENT_DIR)) {
    console.error(`Dossier /content introuvable : ${CONTENT_DIR}`);
    process.exit(1);
  }

  const dirs = readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("mois-"))
    .map((d) => d.name)
    .sort();

  if (dirs.length === 0) {
    console.error("Aucun dossier mois-XX trouvé dans /content/");
    process.exit(1);
  }

  console.log(`Import de ${dirs.length} mois : ${dirs.join(", ")}\n`);

  for (const d of dirs) {
    const mois = parseInt(d.replace("mois-", ""), 10);
    if (Number.isNaN(mois)) continue;
    console.log(`=== Mois ${String(mois).padStart(2, "0")} ===`);
    await importMois(mois, join(CONTENT_DIR, d));
    console.log("");
  }

  // Récap
  const { count } = await supabase
    .from("content")
    .select("*", { count: "exact", head: true });
  console.log(`✅ Import terminé. Lignes totales dans content : ${count ?? "?"}`);
}

main().catch((err) => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});

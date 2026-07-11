// scripts/import-guide.mjs
// ===========================================================================
// Import INCRÉMENTAL du module "guide" pour un mois donné.
//
//   node scripts/import-guide.mjs 23
//
// Sources acceptées dans content/mois-XX/ (les deux formes peuvent coexister) :
//   1) M{n}_guide_moi.json        → fichier complet   { categories: [ { …, protocoles: [] } ] }
//   2) M{n}_guide_moi_<cat>.json  → un fichier / catégorie   { categorie: {…}, protocoles: [] }
//
// Principe : à chaque lancement, on SUPPRIME tout le guide du mois puis on
// réinsère TOUT ce qui est présent. Un mois partiel (ex. 1 catégorie sur 8)
// fonctionne : la page d'accueil du guide n'affiche que les catégories prêtes.
// Relancer après avoir ajouté une catégorie republie l'ensemble. Idempotent.
// Ne touche à aucun autre module.
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

// --- Mois passé en argument -------------------------------------------------
const MOIS = Number.parseInt(process.argv[2], 10);
if (Number.isNaN(MOIS) || MOIS < 0 || MOIS > 24) {
  console.error("Usage : node scripts/import-guide.mjs <mois 0-24>");
  console.error("Ex.   : node scripts/import-guide.mjs 23");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CONTENT_DIR = join(process.cwd(), "content");

// Ordre canonique des catégories (repris de M0). Une catégorie inconnue est
// placée après, dans l'ordre de découverte. Un champ `ordre` explicite sur la
// catégorie prime sur cet ordre canonique.
const CANONICAL_ORDER = [
  "pleurs",
  "alim",
  "sommeil",
  "corps",
  "sante",
  "stimu",
  "sepa",
  "parent",
];

function normalizeCategorie(c) {
  return {
    id: c.id,
    nom: c.nom,
    icone: c.icone ?? c.emoji ?? "",
    sous_titre: c.sous_titre ?? c.description ?? "",
  };
}

function normalizeProtocole(p, catId) {
  const situation = p.situation ?? p.titre;
  return {
    ...p,
    categorie: catId,
    situation,
    principe: p.principe ?? p.a_retenir,
  };
}

// Rassemble toutes les catégories du mois depuis les fichiers présents.
// Retourne { meta, categories: [ { cat, protocoles } ] } déjà ordonné.
function collectCategories(dir) {
  const files = readdirSync(dir);
  const collected = []; // { cat (normalisée), protocoles, ordreHint }
  const seen = new Set();
  let meta = {};

  const pushCategory = (rawCat, protocoles, source) => {
    const cat = normalizeCategorie(rawCat);
    if (!cat.id) {
      console.warn(`  ⚠️  ${source} : catégorie sans id — ignorée.`);
      return;
    }
    if (seen.has(cat.id)) {
      console.warn(
        `  ⚠️  catégorie « ${cat.id} » déjà définie — ${source} ignoré (doublon).`,
      );
      return;
    }
    seen.add(cat.id);
    const ordreExplicite =
      typeof rawCat.ordre === "number" ? rawCat.ordre : undefined;
    const idxCanon = CANONICAL_ORDER.indexOf(cat.id);
    const ordreHint =
      ordreExplicite ?? (idxCanon === -1 ? 100 + collected.length : idxCanon);
    collected.push({
      cat,
      protocoles: Array.isArray(protocoles) ? protocoles : [],
      ordreHint,
    });
  };

  // 1) Fichier complet éventuel : M{n}_guide_moi.json
  const fullName = `M${MOIS}_guide_moi.json`;
  if (files.includes(fullName)) {
    const json = JSON.parse(readFileSync(join(dir, fullName), "utf-8"));
    const { protocoles, categories, categorie, ...rest } = json;
    meta = { ...rest };
    if (Array.isArray(categories)) {
      categories.forEach((c) => pushCategory(c, c.protocoles, fullName));
    } else if (categorie) {
      pushCategory(categorie, protocoles, fullName);
    }
  }

  // 2) Fichiers par catégorie : M{n}_guide_moi_<cat>.json
  const prefix = `M${MOIS}_guide_moi_`;
  const catFiles = files
    .filter((f) => f.startsWith(prefix) && f.endsWith(".json"))
    .sort();
  for (const f of catFiles) {
    const json = JSON.parse(readFileSync(join(dir, f), "utf-8"));
    const { categorie, protocoles } = json;
    if (!categorie) {
      console.warn(`  ⚠️  ${f} : pas de champ « categorie » — ignoré.`);
      continue;
    }
    // Métadonnées de rubrique communes (tranche_age…) reprises du 1er fichier.
    if (json.tranche_age && !meta.tranche_age)
      meta.tranche_age = json.tranche_age;
    pushCategory(categorie, protocoles, f);
  }

  collected.sort((a, b) => a.ordreHint - b.ordreHint);
  return { meta, categories: collected };
}

function buildRows(meta, categories) {
  const rows = [];

  const metaData = {
    mois: MOIS,
    tranche_age: meta.tranche_age,
    rubrique: meta.rubrique ?? "guide-moi",
    titre_rubrique: meta.titre_rubrique ?? meta.titre ?? "Guide-moi !",
    sous_titre: meta.sous_titre,
    categories: categories.map((c) => c.cat),
  };
  rows.push({
    mois: MOIS,
    module: "guide",
    categorie: "_meta",
    situation: null,
    ordre: 0,
    data: metaData,
  });

  let ordre = 0;
  for (const { cat, protocoles } of categories) {
    for (const p of protocoles) {
      const normalized = normalizeProtocole(p, cat.id);
      rows.push({
        mois: MOIS,
        module: "guide",
        categorie: cat.id,
        situation: normalized.situation,
        ordre: ordre++,
        data: normalized,
      });
    }
  }
  return rows;
}

async function main() {
  const m = String(MOIS).padStart(2, "0");
  const dir = join(CONTENT_DIR, `mois-${m}`);
  console.log(`Import incrémental du module "guide" — mois ${MOIS}\n`);

  if (!existsSync(dir)) {
    console.error(`  ✗ Dossier introuvable : ${dir}`);
    process.exit(1);
  }

  let meta, categories;
  try {
    ({ meta, categories } = collectCategories(dir));
  } catch (err) {
    console.error(`  ✗ Lecture/JSON invalide → ${err.message}`);
    process.exit(1);
  }

  if (categories.length === 0) {
    console.error(
      `  ✗ Aucune catégorie trouvée (ni M${MOIS}_guide_moi.json ni M${MOIS}_guide_moi_*.json).`,
    );
    process.exit(1);
  }

  const rows = buildRows(meta, categories);

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

  console.log(
    `  ✓ ${categories.length} catégorie(s) publiée(s) : ${categories
      .map((c) => c.cat.id)
      .join(", ")}`,
  );
  categories.forEach(({ cat, protocoles }) =>
    console.log(`      • ${cat.id} : ${protocoles.length} situation(s)`),
  );
  const protos = rows.length - 1;
  console.log(`  ✓ ${rows.length} ligne(s) insérée(s) (1 _meta + ${protos} protocole(s))`);

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

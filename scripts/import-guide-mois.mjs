// scripts/import-guide-mois.mjs
// ===========================================================================
// Import CIBLÉ du module "guide" pour UN mois, quand son contenu est réparti
// en plusieurs fichiers `M<mois>_guide_moi_N<rang>_<clé>.json`, un par
// catégorie — la forme retenue depuis le mois 0 et le mois 12, là où les mois
// plus anciens ont encore un `01-guide.json` unique (voir import-guide-m3.mjs).
//
// Le script rassemble les fichiers, reconstruit la ligne `_meta` (dont la
// liste ordonnée des catégories) et insère un protocole par ligne.
//
// ⚠️ L'ORDRE DES FICHIERS COMPTE : le rang `N1`, `N2`… du nom de fichier fixe
// l'ordre des catégories à l'écran, et donc leur COULEUR — Guide-moi attribue
// ses teintes par position (`slotFor(i)`), pas par identifiant. Renommer un
// fichier change sa couleur.
//
// Les sous-dossiers (ex. `M12_guide_moi_anciens/`) sont ignorés : ce sont des
// brouillons remplacés, ils ne doivent jamais partir en base.
//
// Idempotent : supprime module='guide' du mois visé, puis réinsère.
// Ne touche PAS aux autres modules ni aux autres mois.
//
//   node scripts/import-guide-mois.mjs 12 --dry   → montre ce qui serait fait
//   node scripts/import-guide-mois.mjs 12         → écrit en base
// ===========================================================================

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

const DRY = process.argv.includes("--dry");
const MOIS = Number(process.argv.slice(2).find((a) => /^\d+$/.test(a)));

if (!Number.isInteger(MOIS) || MOIS < 0 || MOIS > 24) {
  console.error("Usage : node scripts/import-guide-mois.mjs <mois 0-24> [--dry]");
  process.exit(1);
}

const DOSSIER = join(process.cwd(), "content", `mois-${String(MOIS).padStart(2, "0")}`);
const MOTIF = new RegExp(`^M${MOIS}_guide_moi_N(\\d+)_.+\\.json$`);

/** Les fichiers de catégories du mois, triés par leur rang N1, N2… */
function lireCategories() {
  if (!existsSync(DOSSIER)) throw new Error(`${DOSSIER} introuvable`);

  const vus = new Map();
  const lus = readdirSync(DOSSIER, { withFileTypes: true })
    .filter((e) => e.isFile() && MOTIF.test(e.name))
    .map((e) => e.name)
    .sort()
    .map((nom) => {
      const rang = Number(nom.match(MOTIF)[1]);
      let json;
      try {
        json = JSON.parse(readFileSync(join(DOSSIER, nom), "utf-8"));
      } catch (err) {
        throw new Error(`${nom} : JSON invalide → ${err.message}`);
      }
      if (!json.categorie?.id) throw new Error(`${nom} : pas de categorie.id`);
      if (!Array.isArray(json.protocoles) || json.protocoles.length === 0) {
        throw new Error(`${nom} : aucun protocole`);
      }
      // Deux fichiers sur le même rang = deux jeux qui se marchent dessus.
      // On refuse plutôt que de choisir à la place de Laura.
      if (vus.has(rang)) {
        throw new Error(
          `rang N${rang} occupé deux fois : ${vus.get(rang)} et ${nom}. ` +
            `Déplacer le fichier périmé dans un sous-dossier *_anciens/.`,
        );
      }
      vus.set(rang, nom);
      return { rang, nom, json };
    });

  if (lus.length === 0) {
    throw new Error(
      `aucun fichier M${MOIS}_guide_moi_N*.json dans ${DOSSIER}.\n` +
        `  (les mois à fichier unique s'importent avec import-guide-m3.mjs)`,
    );
  }
  return lus.sort((a, b) => a.rang - b.rang);
}

function construireLignes(categories) {
  const rows = [
    {
      mois: MOIS,
      module: "guide",
      categorie: "_meta",
      situation: null,
      ordre: 0,
      data: {
        mois: MOIS,
        tranche_age: categories[0].json.tranche_age ?? `${MOIS} mois`,
        rubrique: "guide_moi",
        titre_rubrique: "Guide-moi !",
        sous_titre: "Que se passe-t-il ? On t'accompagne pas à pas",
        categories: categories.map(({ json }) => ({
          id: json.categorie.id,
          nom: json.categorie.nom,
          icone: json.categorie.icone ?? json.categorie.emoji ?? "",
          sous_titre: json.categorie.sous_titre ?? json.categorie.description ?? "",
        })),
      },
    },
  ];

  let ordre = 0;
  for (const { json } of categories) {
    for (const p of json.protocoles) {
      rows.push({
        mois: MOIS,
        module: "guide",
        categorie: p.categorie ?? json.categorie.id,
        situation: p.situation ?? p.titre ?? null,
        ordre: ordre++,
        data: { ...p, categorie: p.categorie ?? json.categorie.id },
      });
    }
  }
  return rows;
}

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "\nERREUR : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env.local",
    );
    process.exit(1);
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function main() {
  console.log(`Import du module « guide » — mois ${MOIS}${DRY ? "  (SIMULATION)" : ""}\n`);

  const categories = lireCategories();
  const rows = construireLignes(categories);

  let cadratins = 0;
  for (const { rang, json, nom } of categories) {
    const sansFormat = json.protocoles.filter((p) => !(p.situation ?? "").includes(" / "));
    cadratins += (JSON.stringify(json).match(/—/g) ?? []).length;
    console.log(
      `  N${rang}  ${json.categorie.id.padEnd(16)} ${String(json.protocoles.length).padStart(2)} protocole(s)` +
        `  « ${json.categorie.nom} »` +
        (sansFormat.length ? `   ⚠️  ${sansFormat.length} situation(s) sans « / » (${nom})` : ""),
    );
  }
  const protos = rows.length - 1;
  console.log(`\n  → ${rows.length} ligne(s) : 1 _meta + ${protos} protocole(s)`);
  if (cadratins) {
    console.log(`  ⚠️  ${cadratins} tiret(s) cadratin(s) dans les fichiers — interdits (cf. SKILL_contenu).`);
  }

  const supabase = client();
  const { data: avant } = await supabase
    .from("content")
    .select("data")
    .eq("mois", MOIS)
    .eq("module", "guide");
  const cadratinsBase = (avant ?? []).reduce(
    (n, r) => n + (JSON.stringify(r.data).match(/—/g) ?? []).length,
    0,
  );
  console.log(
    `\n  base : ${avant?.length ?? 0} ligne(s) existante(s)` +
      (cadratinsBase ? `, dont ${cadratinsBase} tiret(s) cadratin(s) que cet import va corriger` : ""),
  );

  if (DRY) {
    console.log("\nSimulation : rien n'a été écrit. Relancer sans --dry pour importer.");
    return;
  }

  const del = await supabase.from("content").delete().eq("mois", MOIS).eq("module", "guide");
  if (del.error) {
    console.error(`  ✗ DELETE → ${del.error.message}`);
    process.exit(1);
  }

  const { error } = await supabase.from("content").insert(rows);
  if (error) {
    console.error(`  ✗ INSERT → ${error.message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${rows.length} ligne(s) insérée(s)`);

  const revalidateUrl = process.env.REVALIDATE_URL;
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  if (revalidateUrl && revalidateSecret) {
    try {
      const res = await fetch(revalidateUrl, {
        method: "POST",
        headers: { "x-revalidate-secret": revalidateSecret },
      });
      console.log(res.ok ? `\n✅ Cache invalidé` : `\n⚠️  Revalidation échouée (${res.status})`);
    } catch (err) {
      console.warn(`\n⚠️  Impossible de joindre ${revalidateUrl} : ${err.message}`);
    }
  } else {
    console.log("\nℹ️  Cache non invalidé (REVALIDATE_URL/REVALIDATE_SECRET absents). TTL max 1 h.");
  }

  console.log("\n✅ Terminé.");
}

main().catch((err) => {
  console.error(`\nErreur : ${err.message}`);
  process.exit(1);
});

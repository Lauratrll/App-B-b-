// scripts/import-guide-m12.mjs
// ===========================================================================
// Import CIBLÉ du module "guide" pour le mois 12 uniquement.
//
// Particularité du mois 12 : le contenu n'est pas dans un `01-guide.json`
// unique comme les autres mois, mais réparti en HUIT fichiers
// `M12_guide_moi_N<rang>_<clé>.json`, un par catégorie. Ce script les
// rassemble, reconstruit la ligne `_meta` (dont la liste ordonnée des
// catégories) et insère un protocole par ligne.
//
// ⚠️ L'ORDRE DES FICHIERS COMPTE : le rang `N1`…`N8` du nom de fichier fixe
// l'ordre des catégories à l'écran, et donc leur COULEUR — Guide-moi attribue
// ses teintes par position (`slotFor(i)`), pas par identifiant. Renommer un
// fichier change sa couleur.
//
// Les sous-dossiers (ex. `M12_guide_moi_anciens/`) sont ignorés : ce sont des
// brouillons remplacés, ils ne doivent jamais partir en base.
//
// Idempotent : supprime module='guide' du mois 12, puis réinsère.
// Ne touche PAS aux autres modules ni aux autres mois.
//
//   node scripts/import-guide-m12.mjs --dry   → montre ce qui serait fait
//   node scripts/import-guide-m12.mjs         → écrit en base
// ===========================================================================

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

config({ path: ".env.local" });
config({ path: ".env" });

const MOIS = 12;
const DOSSIER = join(process.cwd(), "content", `mois-${String(MOIS).padStart(2, "0")}`);
const DRY = process.argv.includes("--dry");

/** Les 8 fichiers de catégories, triés par leur rang N1…N8. */
function lireCategories() {
  const fichiers = readdirSync(DOSSIER, { withFileTypes: true })
    .filter((e) => e.isFile() && /^M12_guide_moi_N\d_.+\.json$/.test(e.name))
    .map((e) => e.name)
    .sort();

  const vus = new Map();
  const lus = fichiers.map((nom) => {
    const rang = Number(nom.match(/_N(\d)_/)[1]);
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
    // Deux fichiers sur le même rang = deux jeux qui se marchent dessus. C'est
    // exactement le piège rencontré le 25/08 : on refuse plutôt que de choisir.
    if (vus.has(rang)) {
      throw new Error(
        `rang N${rang} occupé deux fois : ${vus.get(rang)} et ${nom}. ` +
          `Déplacer le fichier périmé dans M12_guide_moi_anciens/.`,
      );
    }
    vus.set(rang, nom);
    return { rang, nom, json };
  });

  if (lus.length === 0) throw new Error(`aucun fichier M12_guide_moi_N*.json dans ${DOSSIER}`);
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

async function main() {
  console.log(`Import ciblé du module « guide » — mois ${MOIS}${DRY ? "  (SIMULATION)" : ""}\n`);

  const categories = lireCategories();
  const rows = construireLignes(categories);

  for (const { rang, json, nom } of categories) {
    const sansFormat = json.protocoles.filter((p) => !(p.situation ?? "").includes(" / "));
    console.log(
      `  N${rang}  ${json.categorie.id.padEnd(10)} ${String(json.protocoles.length).padStart(2)} protocole(s)` +
        `  « ${json.categorie.nom} »` +
        (sansFormat.length ? `   ⚠️  ${sansFormat.length} situation(s) sans « / » (${nom})` : ""),
    );
  }
  const protos = rows.length - 1;
  console.log(`\n  → ${rows.length} ligne(s) : 1 _meta + ${protos} protocole(s)`);

  if (DRY) {
    console.log("\nSimulation : rien n'a été écrit. Relancer sans --dry pour importer.");
    return;
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error(
      "\nERREUR : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env.local",
    );
    process.exit(1);
  }
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { count: avant } = await supabase
    .from("content")
    .select("*", { count: "exact", head: true })
    .eq("mois", MOIS)
    .eq("module", "guide");
  console.log(`\n  base : ${avant ?? 0} ligne(s) existante(s) pour ce mois`);

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

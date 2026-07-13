// scripts/lib/guide-decompose.mjs
// ===========================================================================
// Logique PARTAGÉE d'agrégation du module « guide » au nouveau format
// « un fichier par catégorie » :
//
//     M{mois}_guide_moi_N{slot}_{categorie}.json
//
// Utilisée par :
//   - scripts/import-content.mjs  (import complet de tous les mois)
//   - scripts/import-guide.mjs    (import surgical d'un seul mois)
//
// Objectif : un mois est éclaté en 7–8 fichiers de catégorie ; il faut les
// AGRÉGER avant d'écrire en base :
//   • 1 seule ligne `_meta` (categorie='_meta', ordre=0) dont `data.categories`
//     est la liste TRIÉE PAR SLOT croissant — c'est elle qui pilote l'ordre
//     d'affichage de la page 1.
//   • 1 ligne par protocole : ordre = index INTRA-catégorie (0-based), car les
//     routes de l'app lisent le couple (categorie, ordre) — cf. lib/content.ts.
// ===========================================================================

// Motif d'un fichier guide « par catégorie ». Groupe 1 = slot d'affichage (1..8).
export const GUIDE_CAT_FILE_RE = /^M\d+_guide_moi_N(\d+)_[a-z0-9_]+\.json$/i;

// Normalise l'entrée de catégorie exposée à la page 1 : { id, nom, sous_titre, icone }.
// Tolère les anciens noms de champs (emoji/description).
function normalizeCategorie(c = {}) {
  return {
    id: c.id,
    nom: c.nom,
    sous_titre: c.sous_titre ?? c.description ?? "",
    icone: c.icone ?? c.emoji ?? "",
  };
}

// parsed : [{ file, slot, json }] — TOUS les fichiers catégorie d'UN mois.
// Retourne les lignes `content` prêtes à insérer (1 _meta + 1 par protocole).
export function decomposeGuideCategories(parsed, mois) {
  // Tri par slot croissant : pilote l'ordre des catégories (page 1) ET
  // l'ordre des lignes protocole.
  const sorted = [...parsed].sort((a, b) => a.slot - b.slot);

  const categories = [];
  let metaMois = mois;
  let trancheAge;
  let titreRubrique;

  for (const { json } of sorted) {
    categories.push(normalizeCategorie(json.categorie));
    // `mois` et `tranche_age` repris des fichiers (identiques d'un fichier à l'autre).
    if (typeof json.mois === "number") metaMois = json.mois;
    if (trancheAge == null && json.tranche_age) trancheAge = json.tranche_age;
    if (titreRubrique == null && (json.titre_rubrique ?? json.titre)) {
      titreRubrique = json.titre_rubrique ?? json.titre;
    }
  }

  const rows = [
    {
      mois,
      module: "guide",
      categorie: "_meta",
      situation: null,
      ordre: 0,
      data: {
        mois: metaMois,
        tranche_age: trancheAge,
        titre_rubrique: titreRubrique ?? "Guide-moi !",
        categories,
      },
    },
  ];

  for (const { json } of sorted) {
    const catId = json.categorie?.id ?? null;
    // Nombre de protocoles VARIABLE (4, 5 ou 6) — on itère sans rien coder en dur.
    (json.protocoles ?? []).forEach((p, i) => {
      rows.push({
        mois,
        module: "guide",
        categorie: catId,
        situation: p.situation ?? p.titre ?? null, // libellé bouton (page 2)
        ordre: i, // index INTRA-catégorie, 0-based
        data: p, // protocole complet — champ `source` (optionnel) conservé tel quel
      });
    });
  }

  return rows;
}

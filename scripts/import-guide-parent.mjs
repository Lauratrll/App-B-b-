// scripts/import-guide-parent.mjs
// ===========================================================================
// Import CHIRURGICAL de la seule catégorie « parent » (Parents submergés) du
// module Guide-moi, pour un mois ou pour tous.
//
// Pourquoi un script à part : `import-guide-mois.mjs` remplace TOUT le module
// guide d'un mois et refuse de tourner si une catégorie présente en base n'a
// plus de fichier sur le disque. Or « Parents submergés » est écrit pour les
// 24 mois alors que les autres thèmes de M13 à M22 ne le sont pas encore.
// Ce script permet donc de publier ce slot seul, sans attendre le reste.
//
// Ce qu'il fait, mois par mois :
//   1. lit le fichier M<mois>_guide_moi_N*_(parents_submerges|parent).json
//   2. DELETE des lignes  module='guide' AND categorie='parent'  (ce mois)
//   3. INSERT d'une ligne par protocole
//   4. _meta : ajoute la catégorie « parent » à la fin de la liste si elle en
//      est absente, ou crée la ligne _meta si le mois n'a encore rien en base
//
// Il ne touche à AUCUNE autre catégorie, ni à aucun autre module.
// Relançable sans risque : les lignes « parent » sont refaites à l'identique.
//
//   node scripts/import-guide-parent.mjs --dry        → simulation, 24 mois
//   node scripts/import-guide-parent.mjs              → écrit les 24 mois
//   node scripts/import-guide-parent.mjs 15           → un seul mois
// ===========================================================================

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

const DRY = process.argv.includes("--dry");
const MOIS_ARG = process.argv.slice(2).find((a) => /^\d+$/.test(a));
const MOIS_LISTE = MOIS_ARG
  ? [Number(MOIS_ARG)]
  : Array.from({ length: 24 }, (_, i) => i);

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

const CATEGORIE = "parent";

/** Le fichier « Parents submergés » du mois, quel que soit son rang N. */
function fichierParent(mois) {
  const dossier = join(process.cwd(), "content", `mois-${String(mois).padStart(2, "0")}`);
  if (!existsSync(dossier)) return null;
  const motif = new RegExp(`^M${mois}_guide_moi_N\\d+_(parents_submerges|parent)\\.json$`);
  const noms = readdirSync(dossier, { withFileTypes: true })
    .filter((e) => e.isFile() && motif.test(e.name))
    .map((e) => e.name);
  if (noms.length === 0) return null;
  if (noms.length > 1) {
    throw new Error(
      `mois ${mois} : ${noms.length} fichiers « parent » (${noms.join(", ")}). ` +
        `Déplacer le périmé dans un sous-dossier *_anciens/.`,
    );
  }
  const chemin = join(dossier, noms[0]);
  const json = JSON.parse(readFileSync(chemin, "utf-8"));
  if (json.categorie?.id !== CATEGORIE) {
    throw new Error(`${noms[0]} : categorie.id vaut « ${json.categorie?.id} », attendu « parent »`);
  }
  if (!Array.isArray(json.protocoles) || json.protocoles.length === 0) {
    throw new Error(`${noms[0]} : aucun protocole`);
  }
  return { nom: noms[0], json };
}

async function importMois(mois) {
  const fichier = fichierParent(mois);
  if (!fichier) {
    console.log(`M${String(mois).padStart(2, "0")} : aucun fichier « parent » — ignoré`);
    return { ecrit: 0 };
  }
  const { nom, json } = fichier;

  // --- état de la base pour ce mois ---------------------------------------
  const { data: avant, error: erreurLecture } = await supabase
    .from("content")
    .select("id, categorie, ordre, data")
    .eq("mois", mois)
    .eq("module", "guide");
  // Une lecture qui échoue n'est jamais traitée comme un mois vide : sans
  // réseau, on croirait avoir tout à créer et on écraserait le _meta existant.
  if (erreurLecture) {
    throw new Error(`mois ${mois} : lecture de la base impossible → ${erreurLecture.message}`);
  }

  const metaRow = avant.find((r) => r.categorie === "_meta");
  const dejaParent = avant.filter((r) => r.categorie === CATEGORIE);
  const autres = avant.filter((r) => r.categorie !== "_meta" && r.categorie !== CATEGORIE);

  // Ordres : uniques dans la catégorie (l'URL d'un protocole est son `ordre`).
  // On prolonge le compteur du mois pour ne pas empiéter sur les autres.
  const ordreMax = autres.reduce((n, r) => Math.max(n, r.ordre ?? 0), -1);
  const depart = autres.length ? ordreMax + 1 : 0;

  const lignes = json.protocoles.map((p, i) => ({
    mois,
    module: "guide",
    categorie: CATEGORIE,
    situation: p.situation ?? p.titre ?? null,
    ordre: depart + i,
    data: { ...p, categorie: CATEGORIE },
  }));

  // --- _meta : la catégorie doit figurer dans la liste, sinon pas de case ---
  const entree = {
    id: CATEGORIE,
    nom: json.categorie.nom,
    icone: json.categorie.icone ?? json.categorie.emoji ?? "",
  };
  let metaAction = "inchangé";
  let metaData = metaRow?.data ?? null;
  if (!metaRow) {
    metaAction = "créé";
    metaData = {
      mois,
      tranche_age: json.tranche_age ?? `${mois} mois`,
      rubrique: "guide_moi",
      titre_rubrique: "Guide-moi !",
      sous_titre: "Que se passe-t-il ? On t'accompagne pas à pas",
      categories: [entree],
    };
  } else {
    const cats = Array.isArray(metaData.categories) ? [...metaData.categories] : [];
    const idx = cats.findIndex((c) => c.id === CATEGORIE);
    if (idx === -1) {
      cats.push(entree); // « Parents submergés » ferme toujours la liste
      metaAction = "catégorie ajoutée";
    } else if (cats[idx].nom !== entree.nom || cats[idx].icone !== entree.icone) {
      cats[idx] = { ...cats[idx], ...entree };
      metaAction = "libellé mis à jour";
    }
    metaData = { ...metaData, categories: cats };
  }

  // Rien à faire si la base porte déjà exactement ce contenu. On évite ainsi
  // un DELETE/INSERT inutile : les lignes changeraient d'id, et les épingles
  // des utilisateurs (pinned.content_id, ON DELETE CASCADE) seraient perdues.
  const memeContenu =
    dejaParent.length === lignes.length &&
    metaAction === "inchangé" &&
    [...dejaParent]
      .sort((a, b) => a.ordre - b.ordre)
      .every((r, i) => JSON.stringify(r.data) === JSON.stringify(lignes[i].data));
  if (memeContenu) {
    console.log(
      `M${String(mois).padStart(2, "0")} : déjà en base à l'identique (${lignes.length} protocoles) — rien à faire`,
    );
    return { ecrit: 0 };
  }

  const cadratins = (JSON.stringify(json).match(/—/g) ?? []).length;
  console.log(
    `M${String(mois).padStart(2, "0")} : ${lignes.length} protocole(s) (${nom})` +
      `  ordres ${depart}-${depart + lignes.length - 1}` +
      `  | base avant : ${dejaParent.length} ligne(s) parent, ${autres.length} autre(s)` +
      `  | _meta ${metaAction}` +
      (cadratins ? `  ⚠️  ${cadratins} tiret(s) cadratin(s)` : ""),
  );

  if (DRY) return { ecrit: 0 };

  const del = await supabase
    .from("content")
    .delete()
    .eq("mois", mois)
    .eq("module", "guide")
    .eq("categorie", CATEGORIE);
  if (del.error) throw new Error(`mois ${mois} : DELETE → ${del.error.message}`);

  const ins = await supabase.from("content").insert(lignes);
  if (ins.error) throw new Error(`mois ${mois} : INSERT → ${ins.error.message}`);

  if (metaAction !== "inchangé") {
    if (metaRow) {
      const up = await supabase
        .from("content")
        .update({ data: metaData })
        .eq("id", metaRow.id);
      if (up.error) throw new Error(`mois ${mois} : UPDATE _meta → ${up.error.message}`);
    } else {
      const insMeta = await supabase.from("content").insert([
        { mois, module: "guide", categorie: "_meta", situation: null, ordre: 0, data: metaData },
      ]);
      if (insMeta.error) throw new Error(`mois ${mois} : INSERT _meta → ${insMeta.error.message}`);
    }
  }
  return { ecrit: lignes.length };
}

async function main() {
  console.log(
    `Import de la catégorie « Parents submergés » — ${MOIS_LISTE.length} mois${DRY ? "  (SIMULATION)" : ""}\n`,
  );

  let total = 0;
  for (const mois of MOIS_LISTE) {
    const { ecrit } = await importMois(mois);
    total += ecrit;
  }

  console.log(
    DRY
      ? `\nSimulation : rien n'a été écrit. Relancer sans --dry pour importer.`
      : `\n✅ ${total} protocole(s) « parent » en base.`,
  );
  if (DRY) return;

  const revalidateUrl = process.env.REVALIDATE_URL;
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  if (revalidateUrl && revalidateSecret) {
    try {
      const res = await fetch(revalidateUrl, {
        method: "POST",
        headers: { "x-revalidate-secret": revalidateSecret },
      });
      console.log(res.ok ? `✅ Cache invalidé` : `⚠️  Revalidation échouée (${res.status})`);
    } catch (err) {
      console.warn(`⚠️  Impossible de joindre ${revalidateUrl} : ${err.message}`);
    }
  } else {
    console.log("ℹ️  Cache non invalidé (REVALIDATE_URL/REVALIDATE_SECRET absents) — visible sous max 1h.");
  }
}

main().catch((err) => {
  console.error("Erreur fatale :", err.message);
  process.exit(1);
});

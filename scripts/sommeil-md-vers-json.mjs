// scripts/sommeil-md-vers-json.mjs
// ===========================================================================
// Convertit les fichiers de travail de la rubrique Sommeil
//   content/sommeil/M{n}_sommeil.md
// en un seul fichier de données lu par l'app (import statique, pas Supabase) :
//   content/sommeil/sommeil.json   →  { "3": {...}, "9": {...}, "20": {...} }
//
//   node scripts/sommeil-md-vers-json.mjs
//
// Lancé automatiquement par `npm run dev` et `npm run build`.
//
// Ce qui n'entre JAMAIS dans l'app (règle 29/08 : rien d'interne) :
//   - les commentaires <!-- … -->
//   - tout ce qui précède le premier « ## » (titre, note de structure),
//     sauf la phrase d'exergue
//   - les lignes entièrement en italique simple (*Sélecteur : …*) : notes
//   - les passages marqués `[Mx-My]` qui ne concernent pas le mois
//
// Structure du .md : « ## » = partie, « ### » = section, « #### » = volet.
// Une ligne seule en gras sans ponctuation finale (« **Ses repères, à 3 mois** »)
// ouvre aussi un volet. `source` : … = sources de la partie (ou de la section
// dans « Toujours accessible »).
// ===========================================================================

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "content", "sommeil");
const OUT = join(DIR, "sommeil.json");
const FILE_RE = /^M(\d+)_sommeil\.md$/;
// Tranches d'âge (28/10) : T{n}_M{a}-M{b}_sommeil.md → T{n}_M{a}-M{b}_sommeil.json
const TRANCHE_RE = /^(T\d+_M(\d+)-M(\d+)_sommeil)\.md$/;

// Garde, dans une ligne, les passages `[Mx-My]` qui concernent ce mois.
// Le texte avant le premier marqueur est toujours gardé.
function filtrerAge(ligne, mois) {
  const parts = ligne.split(/`\[M(\d+)-M(\d+)\]`\s*/);
  if (parts.length === 1) return ligne;
  let out = parts[0];
  for (let i = 1; i < parts.length; i += 3) {
    const min = Number(parts[i]);
    const max = Number(parts[i + 1]);
    if (mois >= min && mois <= max) out += parts[i + 2];
  }
  return out.trim();
}

const estTitreGras = (l) => /^\*\*[^*]+\*\*$/.test(l) && !/[.!?:]\*\*$/.test(l);
const estNoteItalique = (l) => /^\*[^*].*[^*]\*$/.test(l);

function slug(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function convertir(md, mois) {
  const brut = md.replace(/<!--[\s\S]*?-->/g, "").split(/\r?\n/);

  // Exergue : la ligne qui suit « **Exergue… ** », avant le premier « ## ».
  let exergue = null;
  const premierePartie = brut.findIndex((l) => l.startsWith("## "));
  for (let i = 0; i < premierePartie; i++) {
    if (/^\*\*Exergue/.test(brut[i].trim())) {
      exergue = (brut[i + 1] ?? "").trim() || null;
    }
  }

  const parties = [];
  let partie = null;
  let section = null;
  let volet = null;

  const nouveauVolet = (titre) => {
    if (!section) return;
    volet = { titre, blocs: [] };
    section.volets.push(volet);
  };
  const ajouterBloc = (bloc) => {
    if (!section) return;
    if (!volet) nouveauVolet(null);
    const dernier = volet.blocs[volet.blocs.length - 1];
    if (bloc.type === "liste" && dernier?.type === "liste") {
      dernier.items.push(...bloc.items);
    } else {
      volet.blocs.push(bloc);
    }
  };

  for (const ligneBrute of brut.slice(premierePartie)) {
    const l = ligneBrute.trim();
    if (!l || l === "---") continue;

    if (l.startsWith("## ")) {
      const majuscules = l.slice(3).replace(/^\d+\s*·\s*/, "").trim();
      // « COMPRENDRE SON SOMMEIL » → « Comprendre son sommeil »
      const bas = majuscules.toLocaleLowerCase("fr");
      const titre = bas.charAt(0).toLocaleUpperCase("fr") + bas.slice(1);
      partie = { id: slug(titre), titre, sections: [], sources: null };
      parties.push(partie);
      section = null;
      volet = null;
      continue;
    }
    if (l.startsWith("### ")) {
      const titre = l.slice(4).trim();
      section = { id: slug(titre), titre, chapeau: null, volets: [], sources: null };
      partie?.sections.push(section);
      volet = null;
      continue;
    }
    if (l.startsWith("#### ")) {
      nouveauVolet(l.slice(5).trim());
      continue;
    }
    if (estNoteItalique(l)) continue;

    if (/^`source`\s*:/.test(l)) {
      const texte = l.replace(/^`source`\s*:\s*/, "");
      const cible = partie?.id === "toujours-accessible" ? section : partie;
      if (cible) cible.sources = texte;
      continue;
    }

    // Repères d'écriture du bloc co-parent : « **Texte.** … », « **Actions.** ».
    if (l === "**Actions.**") continue;
    const texte = filtrerAge(l.replace(/^\*\*Texte\.\*\*\s*/, ""), mois);
    if (!texte) continue;

    if (texte.startsWith("> ")) {
      const citation = texte.slice(2).trim();
      // Citation juste sous le titre de section, avant tout volet : chapeau.
      if (section && section.volets.length === 0) section.chapeau = citation;
      else ajouterBloc({ type: "citation", texte: citation });
      continue;
    }
    if (texte.startsWith("- ")) {
      ajouterBloc({ type: "liste", items: [texte.slice(2).trim()] });
      continue;
    }
    if (estTitreGras(texte)) {
      nouveauVolet(texte.slice(2, -2).trim());
      continue;
    }
    ajouterBloc({ type: "p", texte });
  }

  // Volets vides (titre seul, ex. « Les 15 minutes » pas encore écrites) : on
  // les retire ; la section garde sa place et l'app affiche « bientôt ».
  for (const p of parties) {
    for (const s of p.sections) {
      s.volets = s.volets.filter((v) => v.blocs.length > 0);
    }
  }

  return { mois, exergue, parties };
}

const resultat = {};
const fichiers = readdirSync(DIR)
  .map((f) => f.match(FILE_RE))
  .filter(Boolean)
  .sort((a, b) => Number(a[1]) - Number(b[1]));

for (const m of fichiers) {
  const mois = Number(m[1]);
  const md = readFileSync(join(DIR, m[0]), "utf-8");
  resultat[String(mois)] = convertir(md, mois);
}

// sommeil.json n'est réécrit que s'il y a des M{n}_sommeil.md : sans eux
// (déplacés en _sauvegardes le 28/10), le fichier existant est conservé.
if (fichiers.length > 0) {
  writeFileSync(OUT, JSON.stringify(resultat, null, 2) + "\n", "utf-8");
  console.log(
    `Sommeil : ${fichiers.length} mois convertis (${Object.keys(resultat).join(", ")}) → content/sommeil/sommeil.json`,
  );
} else {
  console.log("Sommeil : aucun M{n}_sommeil.md, sommeil.json conservé tel quel.");
}

// Une tranche d'âge = un fichier JSON : { tranche: {debut, fin}, mois, exergue, parties }.
const tranches = readdirSync(DIR)
  .map((f) => f.match(TRANCHE_RE))
  .filter(Boolean)
  .sort((a, b) => Number(a[2]) - Number(b[2]));
for (const t of tranches) {
  const debut = Number(t[2]);
  const fin = Number(t[3]);
  const md = readFileSync(join(DIR, t[0]), "utf-8");
  const { mois, ...reste } = convertir(md, debut);
  // « Sommeil de 9 à 11 mois » garde l'id « comprendre-son-sommeil » (thème et onglet).
  // Seulement pour l'ancienne structure en deux parties (« Sommeil de X à Y mois ») :
  // une tranche réécrite en slots garde l'id calculé depuis chaque titre de slot.
  if (reste.parties[0] && /^Sommeil de /.test(reste.parties[0].titre)) reste.parties[0].id = "comprendre-son-sommeil";
  const sortie = { tranche: { debut, fin }, ...reste };
  writeFileSync(join(DIR, `${t[1]}.json`), JSON.stringify(sortie, null, 2) + "\n", "utf-8");
}
if (tranches.length > 0) {
  console.log(`Sommeil : ${tranches.length} tranches converties (${tranches.map((t) => `M${t[2]}-M${t[3]}`).join(", ")}).`);
}

// Tranche en dossier (28/10) : content/sommeil/T{n}_M{a}-M{b}/ = 00_entete.md + un fichier par slot
// (01_…, 02_…). Les fichiers sont assemblés dans l'ordre, écrits dans _tranche_complete.md (relecture),
// puis convertis en T{n}_M{a}-M{b}_sommeil.json.
const DOSSIER_RE = /^(T\d+_M(\d+)-M(\d+))$/;
const dossiers = readdirSync(DIR)
  .map((f) => f.match(DOSSIER_RE))
  .filter((m) => m && statSync(join(DIR, m[0])).isDirectory())
  .sort((a, b) => Number(a[2]) - Number(b[2]));
for (const t of dossiers) {
  const dossier = join(DIR, t[0]);
  const morceaux = readdirSync(dossier)
    .filter((f) => /^\d\d_.+\.md$/.test(f))
    .sort()
    .map((f) => readFileSync(join(dossier, f), "utf-8").trim());
  const md = morceaux.join("\n\n---\n\n") + "\n";
  writeFileSync(join(dossier, "_tranche_complete.md"), md, "utf-8");
  const debut = Number(t[2]);
  const fin = Number(t[3]);
  const { mois, ...reste } = convertir(md, debut);
  const sortie = { tranche: { debut, fin }, ...reste };
  writeFileSync(join(DIR, `${t[1]}_sommeil.json`), JSON.stringify(sortie, null, 2) + "\n", "utf-8");
}
if (dossiers.length > 0) {
  console.log(`Sommeil : ${dossiers.length} tranche(s) en dossier (${dossiers.map((t) => t[0]).join(", ")}).`);
}

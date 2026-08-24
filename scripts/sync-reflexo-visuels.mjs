// scripts/sync-reflexo-visuels.mjs
// ===========================================================================
// Copie les cartes récapitulatives des protocoles de Réflexologie depuis la
// source de vérité (reflexologie/visuels-protocoles/) vers le dossier servi
// par Next.js (public/reflexologie/visuels/).
//
//   node scripts/sync-reflexo-visuels.mjs
//
// À relancer chaque fois que les PNG de reflexologie/visuels-protocoles/ sont
// ajoutés ou modifiés (le dossier reflexologie/ est édité en parallèle). Les
// noms de fichiers sont conservés tels quels (espaces/accents) ; l'app les
// encode pour l'URL via visuelUrl() dans lib/reflexologie.ts.
// ===========================================================================

import {
  readdirSync,
  mkdirSync,
  copyFileSync,
  existsSync,
  rmSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const REFLEXO = join(process.cwd(), "reflexologie");
const SRC = join(REFLEXO, "visuels-protocoles");
const DEST_VISUELS = join(process.cwd(), "public", "reflexologie", "visuels");
const DEST_REFLEXO = join(process.cwd(), "public", "reflexologie");

if (!existsSync(SRC)) {
  console.error(`✗ Dossier source introuvable : ${SRC}`);
  process.exit(1);
}

mkdirSync(DEST_VISUELS, { recursive: true });

const pngs = readdirSync(SRC).filter((f) => f.toLowerCase().endsWith(".png"));
for (const f of pngs) {
  copyFileSync(join(SRC, f), join(DEST_VISUELS, f));
}
console.log(`✓ ${pngs.length} visuel(s) copié(s) vers public/reflexologie/visuels/`);

// Un visuel renommé côté source laissait sinon son ancienne version traîner ici
// (public/reflexologie/ est .gitignore : Vercel repart de zéro, pas la machine
// de Laura). On aligne donc la destination sur la source.
const attendus = new Set(pngs);
for (const f of readdirSync(DEST_VISUELS)) {
  if (f.toLowerCase().endsWith(".png") && !attendus.has(f)) {
    rmSync(join(DEST_VISUELS, f));
    console.log(`  – ${f} (retiré : absent de la source)`);
  }
}

// L'illustration des pieds (avec tous les id de zones) est injectée par le
// lecteur animé — elle doit être servable depuis /public.
const SVG = "pieds_bebe_zones_reflexes.svg";
if (existsSync(join(REFLEXO, SVG))) {
  copyFileSync(join(REFLEXO, SVG), join(DEST_REFLEXO, SVG));
  console.log(`✓ ${SVG} copié vers public/reflexologie/`);
} else {
  console.warn(`⚠️  ${SVG} introuvable — le lecteur animé n'aura pas l'illustration.`);
}

// Géométrie validée des mouvements, chargée par le lecteur animé.
for (const GEOM of ["mouvements-glisse.json", "mouvements-trace.json"]) {
  if (existsSync(join(REFLEXO, GEOM))) {
    copyFileSync(join(REFLEXO, GEOM), join(DEST_REFLEXO, GEOM));
    console.log(`✓ ${GEOM} copié vers public/reflexologie/`);
  }
}

// ---------------------------------------------------------------------------
// Icônes de protocole : reflexologie/visuels-icones/icone-<id>.svg
//
// Laura les dessine dans Illustrator, un fichier par protocole, nommé d'après
// l'id du protocole. On en extrait les seuls tracés vers un JSON importé
// statiquement par l'app (même voie que les protocoles : un import statique est
// la façon fiable de faire embarquer un fichier par Vercel).
//
// L'export Illustrator n'écrit AUCUNE couleur (Laura dessine en noir pur) :
// c'est ce qui permet à l'app de colorer l'icône via `fill: currentColor`.
// Si une couleur apparaît un jour dans un fichier, on le signale ici plutôt
// que de la laisser se figer dans l'app.
// ---------------------------------------------------------------------------
const ICONES_SRC = join(REFLEXO, "visuels-icones");
const ICONES_JSON = join(REFLEXO, "icones-protocoles.json");

if (existsSync(ICONES_SRC)) {
  const icones = {};
  const avertissements = [];
  for (const f of readdirSync(ICONES_SRC).filter((f) => f.toLowerCase().endsWith(".svg"))) {
    const brut = readFileSync(join(ICONES_SRC, f), "utf8");
    const id = f.replace(/^icone-/, "").replace(/\.svg$/i, "");
    const viewBox = (brut.match(/viewBox="([^"]+)"/) ?? [])[1];
    const traces = [...brut.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
    if (!viewBox || traces.length === 0) {
      avertissements.push(`${f} : ni viewBox ni tracé exploitable — ignorée`);
      continue;
    }
    const couleurs = [...brut.matchAll(/(?:fill|stroke)="([^"]+)"/g)].map((m) => m[1]);
    if (couleurs.length) avertissements.push(`${f} : couleur en dur (${couleurs.join(", ")}) — l'icône ne suivra pas la couleur du texte`);
    const autres = [...new Set((brut.match(/<(circle|rect|ellipse|polygon|polyline|line|text|image)\b/g) ?? []))];
    if (autres.length) avertissements.push(`${f} : formes non converties en tracé (${autres.join(", ")}) — à vectoriser dans Illustrator`);
    icones[id] = { viewBox, traces };
  }
  writeFileSync(
    ICONES_JSON,
    `${JSON.stringify(
      {
        _note: "GÉNÉRÉ par scripts/sync-reflexo-visuels.mjs depuis reflexologie/visuels-icones/. Ne pas éditer à la main : modifier le SVG et relancer `npm run sync-visuels`.",
        icones,
      },
      null,
      2,
    )}\n`,
  );
  console.log(`✓ ${Object.keys(icones).length} icône(s) de protocole extraite(s) vers icones-protocoles.json`);
  for (const a of avertissements) console.warn(`⚠️  ${a}`);
} else {
  console.warn(`⚠️  ${ICONES_SRC} introuvable — les protocoles garderont le picto générique.`);
}

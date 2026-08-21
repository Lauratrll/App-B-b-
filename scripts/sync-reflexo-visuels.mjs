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

import { readdirSync, mkdirSync, copyFileSync, existsSync, rmSync } from "node:fs";
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

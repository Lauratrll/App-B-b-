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

import { readdirSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SRC = join(process.cwd(), "reflexologie", "visuels-protocoles");
const DEST = join(process.cwd(), "public", "reflexologie", "visuels");

if (!existsSync(SRC)) {
  console.error(`✗ Dossier source introuvable : ${SRC}`);
  process.exit(1);
}

mkdirSync(DEST, { recursive: true });

const pngs = readdirSync(SRC).filter((f) => f.toLowerCase().endsWith(".png"));
for (const f of pngs) {
  copyFileSync(join(SRC, f), join(DEST, f));
}

console.log(`✓ ${pngs.length} visuel(s) copié(s) vers public/reflexologie/visuels/`);

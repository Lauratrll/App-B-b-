// scripts/extract-glisse-geometrie.mjs
// ===========================================================================
// Extrait la géométrie VALIDÉE du mouvement « pression glissée » depuis le
// prototype reflexologie/mouvement-pression-glissee.html (les lignes médianes
// `pts` bakées, la source de vérité) vers un JSON exploitable par le lecteur :
//
//     reflexologie/mouvements-glisse.json
//
//   node scripts/extract-glisse-geometrie.mjs
//
// Sortie : { "<id SVG de zone>": { pts:[[x,y],…], epMax, passages, enchaine } }
// Les `pts` sont la MÉDIANE de la zone (le trait que suit le doigt), pas le
// contour. Pour les zones multi-éléments (orteils), les éléments sont
// concaténés par pied dans l'ordre du geste.
// ===========================================================================

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = join(process.cwd(), "reflexologie", "mouvement-pression-glissee.html");
const OUT = join(process.cwd(), "reflexologie", "mouvements-glisse.json");

const html = readFileSync(SRC, "utf-8");

// Extrait le littéral tableau qui suit `const ZONES=` par équilibrage de crochets
// (en ignorant crochets/accolades à l'intérieur des chaînes).
function extraireTableau(source, ancre) {
  const start = source.indexOf(ancre);
  if (start === -1) throw new Error(`Ancre introuvable : ${ancre}`);
  let i = source.indexOf("[", start);
  const debut = i;
  let prof = 0;
  let dansChaine = false;
  let quote = "";
  for (; i < source.length; i++) {
    const c = source[i];
    if (dansChaine) {
      if (c === "\\") i++;
      else if (c === quote) dansChaine = false;
      continue;
    }
    if (c === '"' || c === "'") {
      dansChaine = true;
      quote = c;
    } else if (c === "[") prof++;
    else if (c === "]") {
      prof--;
      if (prof === 0) return source.slice(debut, i + 1);
    }
  }
  throw new Error("Tableau non terminé");
}

const ZONES = JSON.parse(extraireTableau(html, "const ZONES="));

const sortie = {};
let nbZones = 0;
let nbPts = 0;

for (const z of ZONES) {
  // ids : ["zone-<nom>-d", "zone-<nom>-g"] → on rattache le pied d/g.
  const parPied = { d: [], g: [] };
  let epMax = 0;
  for (const el of z.elements ?? []) {
    for (const f of ["d", "g"]) {
      const seg = el[f];
      if (!seg || !Array.isArray(seg.pts)) continue;
      // pts = [[x, y, épaisseur], …] → on ne garde que [x, y].
      for (const p of seg.pts) parPied[f].push([p[0], p[1]]);
      if (typeof seg.ep_max === "number") epMax = Math.max(epMax, seg.ep_max);
    }
  }
  for (const id of z.ids ?? []) {
    const f = id.endsWith("-d") ? "d" : id.endsWith("-g") ? "g" : null;
    if (!f || parPied[f].length === 0) continue;
    sortie[id] = {
      pts: parPied[f],
      epMax: Math.round(epMax * 10) / 10,
      passages: z.passages ?? 3,
      enchaine: z.enchaine === true,
    };
    nbZones++;
    nbPts += parPied[f].length;
  }
}

writeFileSync(OUT, JSON.stringify(sortie));
console.log(
  `✓ ${nbZones} zone(s) glissée extraite(s) (${nbPts} points de médiane) → ${OUT}`,
);

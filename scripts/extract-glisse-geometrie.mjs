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

// Complément : zones non bakées dans le prototype (ajoutées après). La médiane
// est calculée depuis la forme réelle du SVG (centerline échantillonnée) et se
// joue en pression glissée, comme la colonne vertébrale (consignes §14bis).
//   sacrum-lombaire : bande ~verticale, glissé du HAUT vers le BAS, 3 passages.
const COMPLEMENT = {
  "zone-sacrum-lombaire-d": {
    pts: [[490.3,449.3],[489.1,460],[487.8,470.7],[486.7,481.4],[485.9,492.1],[485.9,502.8],[486.4,513.5],[487.5,524.2],[489.1,534.9],[491,545.6],[493.3,556.3],[496.8,567],[500.7,577.7],[504.3,588.4],[507.6,599],[510,609.7],[511.7,620.4],[512.3,631.1],[511.3,641.8],[509.3,652.5],[506.1,663.2],[501.4,673.9],[495,684.6],[485.6,695.3],[473.2,706],[465.9,716.7]],
    epMax: 26, passages: 3, enchaine: false,
  },
  "zone-sacrum-lombaire-g": {
    pts: [[774.2,449.3],[775.3,460],[776.7,470.7],[777.8,481.4],[778.5,492.1],[778.6,502.8],[778,513.5],[777,524.2],[775.4,534.9],[773.4,545.6],[771.1,556.3],[767.7,567],[763.8,577.7],[760.1,588.4],[756.8,599],[754.5,609.7],[752.7,620.4],[752.1,631.1],[753.1,641.8],[755.1,652.5],[758.3,663.2],[763,673.9],[769.5,684.6],[778.9,695.3],[791.2,706],[798.5,716.7]],
    epMax: 26, passages: 3, enchaine: false,
  },
};

// Normalise le complément : chaque point porte une épaisseur locale (3ᵉ valeur).
// Les médianes générées (sacrum) n'en ont pas → on prend une demi-largeur
// constante ≈ epMax/2 pour que le doigt épouse la bande.
const sortie = {};
for (const [id, z] of Object.entries(COMPLEMENT)) {
  const epDef = Math.round((z.epMax ?? 24) * 0.5);
  sortie[id] = {
    ...z,
    pts: z.pts.map((p) => [p[0], p[1], p.length > 2 ? p[2] : epDef]),
  };
}
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
      // pts = [[x, y, épaisseur_locale], …] : on GARDE l'épaisseur (le doigt
      // épouse la largeur du trait, consignes §6).
      for (const p of seg.pts) {
        parPied[f].push([p[0], p[1], typeof p[2] === "number" ? p[2] : 0]);
      }
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

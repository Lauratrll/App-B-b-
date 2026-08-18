// scripts/extract-mouvements-trace.mjs
// ===========================================================================
// Extrait la géométrie VALIDÉE des 4 mouvements « tracé » restants depuis leurs
// prototypes (les tracés bakés `tr-<…>`, source de vérité) vers un JSON que le
// lecteur fait suivre au doigt (moteur de traînée) :
//
//     reflexologie/mouvements-trace.json
//
//   node scripts/extract-mouvements-trace.mjs
//
// Mouvements couverts :
//   • spirale centripète  (bassin, intestin grêle)      — mouvement-spirale-centripete.html
//   • boucles progressives (poumon, pancréas, estomac)  — mouvement-boucles-progressives.html
//   • pression circulaire (tête = 5 orteils)            — mouvement-zone-tete.html
//   • composite           (zone digestive : trait+surface) — mouvement-zone-digestive.html
//
// Sortie par zone : { d, brush, passages, duree, traineeOp }
//   - d        : le tracé baké (M/L), plusieurs sous-tracés concaténés en
//                CONSERVANT les « M » (pas de trait parasite entre orteils).
//   - brush    : largeur du trait (stroke-width validé).
//   - traineeOp: opacité de la traînée (0.60 en circulaire, 0.75 ailleurs, §3).
// ===========================================================================

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const R = (f) => join(process.cwd(), "reflexologie", f);
const OUT = R("mouvements-trace.json");

// Récupère tous les tracés tr- d'un prototype : id → { d, sw, op }.
function lireTraces(fichier) {
  const html = readFileSync(R(fichier), "utf-8");
  const map = {};
  const re = /<path\b[^>]*\bid="(tr-[^"]+)"[^>]*>/g;
  let m;
  while ((m = re.exec(html))) {
    const el = m[0];
    const d = (el.match(/\bd="([^"]+)"/) || [])[1];
    if (!d) continue;
    const sw = parseFloat((el.match(/stroke-width="([\d.]+)"/) || [])[1] || "40");
    const op = parseFloat((el.match(/stroke-opacity="([\d.]+)"/) || [])[1] || "0.75");
    map[m[1]] = { d: d.trim(), sw, op };
  }
  return map;
}

// Config : pour chaque zone SVG, les tracés tr- (dans l'ordre) + réglages.
const CONFIG = [];
// Spirale : 1 tracé par pied. RÉSERVÉE AU BASSIN (l'intestin grêle n'est PAS une
// spirale mais des « cercles avancés » — voir plus bas, généré depuis RAILS_zones.json,
// cf. CONSIGNES §14 quinquies + PARAMS overrides_par_zone.intestin-grele).
for (const [nom, duree] of [["bassin", 6000]]) {
  for (const f of ["d", "g"]) {
    CONFIG.push({
      zone: `zone-${nom}-${f}`,
      file: "mouvement-spirale-centripete.html",
      trs: [`tr-${nom}-${f}`],
      passages: 3,
      duree,
    });
  }
}
// Boucles : 1 tracé par pied.
for (const [nom, duree] of [["poumon", 8600], ["pancreas", 5000], ["estomac", 5000]]) {
  for (const f of ["d", "g"]) {
    CONFIG.push({
      zone: `zone-${nom}-${f}`,
      file: "mouvement-boucles-progressives.html",
      trs: [`tr-${nom}-${f}`],
      passages: 3,
      duree,
    });
  }
}
// Circulaire (tête) : 5 orteils par pied, joués dans l'ordre (tr-<f>-0..4).
for (const f of ["d", "g"]) {
  CONFIG.push({
    zone: `zone-tete-${f}`,
    file: "mouvement-zone-tete.html",
    trs: [0, 1, 2, 3, 4].map((i) => `tr-${f}-${i}`),
    passages: 1,
    duree: 9000, // sweep des 5 orteils (compromis pacing lecteur)
  });
}
// Composite (zone digestive) : le trait puis la surface.
for (const f of ["d", "g"]) {
  CONFIG.push({
    zone: `zone-digestive-${f}`,
    file: "mouvement-zone-digestive.html",
    trs: [`tr-trait-${f}`, `tr-surf-${f}`],
    passages: 1,
    duree: 11600, // trait (~2.6 s) + surface (~9 s)
  });
}

const cache = {};
const sortie = {};
let nb = 0;
for (const c of CONFIG) {
  const traces = (cache[c.file] ||= lireTraces(c.file));
  const parts = c.trs.map((id) => traces[id]).filter(Boolean);
  if (parts.length === 0) {
    console.warn(`  ⚠️  ${c.zone} : aucun tracé (${c.trs.join(", ")})`);
    continue;
  }
  // Concaténation en conservant les « M » de chaque sous-tracé.
  const d = parts.map((p) => p.d).join(" ");
  const brush = Math.max(...parts.map((p) => p.sw));
  const traineeOp = Math.min(...parts.map((p) => p.op));
  sortie[c.zone] = {
    d,
    brush: Math.round(brush * 10) / 10,
    passages: c.passages,
    duree: c.duree,
    traineeOp,
  };
  nb++;
}

// --- Compléments : zones sans tracé baké (générés) -------------------------
// Certaines zones n'ont pas de tracé baké dans les prototypes. On les GÉNÈRE en
// mappant un tracé validé existant sur leur forme (bbox mesurées sur le SVG).
// Reproductible à chaque run.

// Mappe le `d` d'une zone source (bbox src) vers une bbox dest ; option inverse.
function mapperD(srcD, srcBB, dstBB, reverse) {
  const subs = srcD
    .trim()
    .split(/(?=M)/)
    .map((s) => s.replace(/^M/, "").trim().split(/L/).map((t) => t.trim().split(/[ ,]+/).map(Number)));
  const mapped = subs.map((sub) =>
    sub.map(([x, y]) => [
      Math.round((dstBB[0] + ((x - srcBB[0]) / srcBB[2]) * dstBB[2]) * 10) / 10,
      Math.round((dstBB[1] + ((y - srcBB[1]) / srcBB[3]) * dstBB[3]) * 10) / 10,
    ]),
  );
  const arr = reverse ? mapped.map((s) => s.slice().reverse()).reverse() : mapped;
  return arr.map((s) => "M " + s.map((p) => p.join(" ")).join(" L ")).join(" ");
}

// bbox mesurées sur le SVG.
const BB = {
  poumonD: [249.9, 249.1, 253.7, 122.3],
  poumonG: [761.2, 249.1, 253.7, 122.3],
  foieD: [240.8, 431.4, 125.5, 77.6],
  rateG: [943.8, 428.9, 78.2, 79.3],
  teteD: [196, 115.7, 321.5, 171.2],
  teteG: [746.9, 115.7, 321.5, 171.2],
  sinusD: [183.2, 100.7, 334.3, 174.9],
  sinusG: [746.7, 100.7, 334.3, 174.9],
};

// FOIE : mouvement du poumon (boucles), de l'EXTÉRIEUR vers l'INTÉRIEUR (Laura).
if (sortie["zone-poumon-d"]) {
  const src = sortie["zone-poumon-d"];
  const scale = Math.min(BB.foieD[2] / BB.poumonD[2], BB.foieD[3] / BB.poumonD[3]);
  sortie["zone-foie-d"] = {
    d: mapperD(src.d, BB.poumonD, BB.foieD, true),
    brush: Math.round(src.brush * scale * 10) / 10,
    passages: 3, duree: 8600, traineeOp: 0.75,
  };
  nb++;
}

// RATE : symétrique du foie (pied gauche) — mouvement du poumon, ext → int.
if (sortie["zone-poumon-g"]) {
  const src = sortie["zone-poumon-g"];
  const scale = Math.min(BB.rateG[2] / BB.poumonG[2], BB.rateG[3] / BB.poumonG[3]);
  sortie["zone-rate-g"] = {
    d: mapperD(src.d, BB.poumonG, BB.rateG, true),
    brush: Math.round(src.brush * scale * 10) / 10,
    passages: 3, duree: 8600, traineeOp: 0.75,
  };
  nb++;
}

// SINUS : pression GLISSÉE (demande Laura), orteil par orteil (5 sous-zones).
// Un petit glissé le long de chaque sous-zone (généré depuis la forme du SVG).
const SINUS = {
  "zone-sinus-d":
    "M 183.2 254 L 232 254 M 225.9 196.7 L 280.4 196.7 M 283.2 155.3 L 337.9 155.3 M 344.5 127.3 L 413.3 127.3 M 424 118.2 L 517.5 118.2",
  "zone-sinus-g":
    "M 1032.3 254 L 1081.1 254 M 983.9 196.7 L 1038.3 196.7 M 926.3 155.3 L 981.1 155.3 M 851 127.3 L 919.8 127.3 M 746.7 118.2 L 840.3 118.2",
};
for (const [id, d] of Object.entries(SINUS)) {
  sortie[id] = { d, brush: 35, passages: 2, duree: 3200, traineeOp: 0.75 };
  nb++;
}

// SYSTÈME URINAIRE : trajet de la vessie vers le rein (§14quater). Simplifié en
// un glissé du bas (vessie) vers le haut (rein) le long des 2 points.
const SU = {
  "zone-systeme-urinaire-d": { vessie: [507.2, 556.4], rein: [378.1, 513.5] },
  "zone-systeme-urinaire-g": { vessie: [758.5, 556.4], rein: [887.5, 513.5] },
};
for (const [id, p] of Object.entries(SU)) {
  sortie[id] = {
    d: `M ${p.vessie[0]} ${p.vessie[1]} L ${p.rein[0]} ${p.rein[1]}`,
    brush: 38, passages: 3, duree: 2900, traineeOp: 0.75,
  };
  nb++;
}

// INTESTIN GRÊLE : « cercles avancés » (boucles-progressives), PAS une spirale
// (la spirale est réservée au bassin — CONSIGNES §14 quinquies). Le rail des
// petits cercles qui avancent est PRÉCALCULÉ et validé dans RAILS_zones.json
// (bord extérieur → intérieur, par pied, zone NON miroir). On le suit tel quel :
// ne JAMAIS re-squelettiser (source n°1 de divergence de forme, cf. INTEGRATION).
// Les DEUX pieds terminent en même temps : on donne la MÊME durée aux deux
// (fraction u = t/durée commune ; chaque pied dévoile u × sa propre longueur).
const rails = JSON.parse(readFileSync(R("RAILS_zones.json"), "utf-8")).zones;

// INTESTIN GRÊLE — « cercles avancés » (boucles-progressives). RÈGLE GÉNÉRALE
// des boucles : le mouvement COMMENCE par le BORD de la forme (passe verticale
// bas → haut le long du bord de départ) AVANT de dérouler les boucles qui
// avancent. Le rail fourni démarrait au milieu → on régénère le tracé.
// Les deux pieds partent du bord BAS-GAUCHE de leur forme et avancent vers +x :
//   • pied droit  : départ côté petit orteil (bord extérieur) → avance vers le
//                   gros orteil (sens CONSERVÉ) ;
//   • pied gauche : départ côté gros orteil (bord intérieur) → avance vers le
//                   petit orteil (sens INVERSÉ, demande Laura).
// bbox des zones mesurées sur le SVG.
// bbox + contours RÉELS de la zone (échantillonnés sur le SVG). Les boucles
// ÉPOUSENT le contour (§7) : l'amplitude verticale = hauteur locale de la forme,
// donc les cercles se resserrent au DÉBUT et à la FIN (là où la zone s'arrondit),
// et la bordure de départ suit le BORD (arc), pas une droite. (demandes Laura)
//   left/right : x mini/maxi par tranche de y (bords gauche/droit)
//   prof       : [x, y_haut, y_bas] par tranche de x (profil vertical)
const BB_GRELE = { d: [348, 569, 126, 111], g: [788, 568, 104, 87] };
const GRELE_CONTOUR = {
  d: {
    left: [[385,573],[371,581],[362,589],[356,597],[352,605],[349,613],[349,621],[348,629],[349,637],[350,645],[354,653],[360,660],[368,668],[381,676]],
    right: [[450,573],[460,581],[466,589],[470,597],[473,605],[474,613],[475,621],[475,629],[474,637],[472,645],[469,653],[464,660],[457,668],[444,676]],
    prof: [[352,600,652],[360,591,661],[368,584,668],[376,580,672],[384,576,675],[392,573,678],[400,571,680],[408,570,680],[415,569,680],[423,569,680],[431,570,679],[439,571,677],[447,574,673],[455,578,669],[463,584,662],[471,593,653]],
  },
  g: {
    left: [[813,571],[803,577],[797,584],[792,590],[790,596],[788,602],[788,608],[788,615],[788,621],[789,627],[790,633],[793,639],[797,645],[804,652]],
    right: [[873,571],[883,577],[888,584],[891,590],[891,596],[891,602],[889,608],[887,615],[883,621],[879,627],[874,633],[868,639],[862,645],[853,652]],
    prof: [[791,590,638],[797,583,646],[804,578,650],[810,574,653],[817,571,654],[823,570,655],[830,569,655],[836,568,655],[843,568,654],[849,568,652],[856,569,649],[862,570,645],[868,572,639],[875,574,633],[881,577,625],[888,582,615]],
  },
};
const GRELE_BRUSH = 44;
// Interpolation d'une colonne d'une table triée par sa colonne 0.
function interpCol(table, key, col) {
  const n = table.length;
  if (key <= table[0][0]) return table[0][col];
  if (key >= table[n - 1][0]) return table[n - 1][col];
  for (let i = 1; i < n; i++) {
    if (key <= table[i][0]) {
      const t = (key - table[i - 1][0]) / (table[i][0] - table[i - 1][0] || 1);
      return table[i - 1][col] + (table[i][col] - table[i - 1][col]) * t;
    }
  }
  return table[n - 1][col];
}
// x du bord à l'ordonnée y (contour trié par y).
function interpByY(contour, y) {
  const n = contour.length;
  if (y <= contour[0][1]) return contour[0][0];
  if (y >= contour[n - 1][1]) return contour[n - 1][0];
  for (let i = 1; i < n; i++) {
    if (y <= contour[i][1]) {
      const t = (y - contour[i - 1][1]) / (contour[i][1] - contour[i - 1][1] || 1);
      return contour[i - 1][0] + (contour[i][0] - contour[i - 1][0]) * t;
    }
  }
  return contour[n - 1][0];
}
function bouclesRail(f, inverse) {
  const [x0, , w] = BB_GRELE[f];
  const C = GRELE_CONTOUR[f];
  const fingerR = GRELE_BRUSH * 0.42;
  const mIn = fingerR * 0.6; // le centre du doigt reste ~à l'intérieur du bord
  const mX = 8;
  const xL = x0 + mX, xR = x0 + w - mX;
  const ycAt = (x) => (interpCol(C.prof, x, 1) + interpCol(C.prof, x, 2)) / 2;
  const RyAt = (x) => Math.max(5, (interpCol(C.prof, x, 2) - interpCol(C.prof, x, 1)) / 2 - mIn);
  const loops = Math.max(4, Math.round((xR - xL) / 26));
  const a = (xR - xL) / (2 * Math.PI * loops);
  const Rh = 4 * a; // bx = 4·a → boucles qui se croisent (§7)
  const steps = loops * 30;
  const pts = [];
  const nB = 12;
  if (!inverse) {
    // Bordure : suit le bord GAUCHE (arc), bas → haut.
    const yc0 = ycAt(xL), Ry0 = RyAt(xL);
    for (let i = 0; i <= nB; i++) {
      const y = yc0 + Ry0 * Math.cos(Math.PI * (i / nB)); // bas → haut
      pts.push([interpByY(C.left, y) + mIn, y]);
    }
    // Boucles vers +x, amplitude ÉPOUSANT le contour.
    for (let i = 1; i <= steps; i++) {
      const th = (i / steps) * (2 * Math.PI * loops);
      const x = xL + a * th + Rh * Math.sin(th);
      pts.push([x, ycAt(x) - RyAt(x) * Math.cos(th)]);
    }
  } else {
    // Bordure : suit le bord DROIT (arc), haut → bas ; boucles vers -x depuis le bas.
    const yc0 = ycAt(xR), Ry0 = RyAt(xR);
    for (let i = 0; i <= nB; i++) {
      const y = yc0 - Ry0 * Math.cos(Math.PI * (i / nB)); // haut → bas
      pts.push([interpByY(C.right, y) - mIn, y]);
    }
    for (let i = 1; i <= steps; i++) {
      const th = (i / steps) * (2 * Math.PI * loops);
      const x = xR - a * th - Rh * Math.sin(th);
      pts.push([x, ycAt(x) + RyAt(x) * Math.cos(th)]);
    }
  }
  return pts.map((p) => [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10]);
}
for (const f of ["d", "g"]) {
  const base = { brush: GRELE_BRUSH, passages: 3, duree: 5000, traineeOp: 0.75 };
  const toD = (pts) => "M " + pts.map((p) => `${p[0]} ${p[1]}`).join(" L ");
  sortie[`zone-intestin-grele-${f}`] = { d: toD(bouclesRail(f, false)), ...base };
  // Variante Diarrhée : rail « inverse » dédié (joué à l'endroit, pas en reverse).
  sortie[`zone-intestin-grele-${f}-inverse`] = { d: toD(bouclesRail(f, true)), ...base };
  nb += 2;
}

// Longueur d'un polyligne [[x,y],…].
const lenPoly = (pts) => {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return l;
};
const dDepuisPoly = (pts) => "M " + pts.map((p) => `${p[0]} ${p[1]}`).join(" L ");
// Durée à vitesse glissée constante (0.105 px/ms), bornée 2000–7000 ms (§6).
const dureeGlisse = (L) => Math.round(Math.max(2000, Math.min(7000, L / 0.105)));

// NEZ : pression glissée en CROIX sur le gros orteil (§14 quinquies + overrides).
// Une passe = la barre VERTICALE (haut→bas) PUIS l'HORIZONTALE (du bord vers les
// orteils), ×3. Deux sous-tracés « M … L … M … L … » → aucun trait parasite
// entre les deux barres (le doigt saute de la fin du vertical au début de l'horizontal).
if (rails.nez) {
  for (const f of ["d", "g"]) {
    const c = rails.nez[f];
    if (!c || !c.vertical_haut_bas || !c.horizontal_bord_orteils) continue;
    const v = c.vertical_haut_bas, h = c.horizontal_bord_orteils;
    sortie[`zone-nez-${f}`] = {
      d: `${dDepuisPoly(v)} ${dDepuisPoly(h)}`,
      brush: 34, // barres fines de la croix
      passages: 3,
      duree: 2600,
      traineeOp: 0.75,
    };
    nb++;
  }
} else console.warn("  ⚠️  nez absent de RAILS_zones.json");

// COLONNE + NERF VAGUE : version ALLONGÉE de la colonne (un seul geste glissé),
// utilisée À LA PLACE de la colonne dans Prématurité et Mal des transports.
// Rail précalculé (44 pts) → même mécanique que la colonne.
if (rails["colonne-vertebrale-nerf-vague"]) {
  for (const f of ["d", "g"]) {
    const pts = rails["colonne-vertebrale-nerf-vague"][f];
    if (!Array.isArray(pts) || pts.length < 2) continue;
    sortie[`zone-colonne-vertebrale-nerf-vague-${f}`] = {
      d: dDepuisPoly(pts),
      brush: 46, // largeur du ruban de la colonne
      passages: 3,
      duree: dureeGlisse(lenPoly(pts)),
      traineeOp: 0.75,
    };
    nb++;
  }
} else console.warn("  ⚠️  colonne-vertebrale-nerf-vague absent de RAILS_zones.json");

writeFileSync(OUT, JSON.stringify(sortie));
console.log(`✓ ${nb} zone(s) « tracé » extraite(s) → ${OUT}`);

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
// Spirale : 1 tracé par pied.
for (const [nom, duree] of [["bassin", 6000], ["intestin-grele", 5000]]) {
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

// --- Complément FOIE (demande Laura) ---------------------------------------
// Le foie n'a pas de tracé baké. « Même mouvement que le poumon (boucles), mais
// en partant de l'extérieur du pied vers l'intérieur. » On mappe donc le tracé
// VALIDÉ du poumon (déjà extrait) sur la forme du foie (bbox mesurées sur le
// SVG) et on l'inverse (extérieur → intérieur). Reproductible à chaque run.
const FOIE_BB = [240.8, 431.4, 125.5, 77.6]; // x, y, w, h
const POUMON_BB = [249.9, 249.1, 253.7, 122.3];
if (sortie["zone-poumon-d"]) {
  const src = sortie["zone-poumon-d"];
  const subs = src.d
    .trim()
    .split(/(?=M)/)
    .map((s) => s.replace(/^M/, "").trim().split(/L/).map((t) => t.trim().split(/[ ,]+/).map(Number)));
  const mapped = subs.map((sub) =>
    sub.map(([x, y]) => [
      Math.round((FOIE_BB[0] + ((x - POUMON_BB[0]) / POUMON_BB[2]) * FOIE_BB[2]) * 10) / 10,
      Math.round((FOIE_BB[1] + ((y - POUMON_BB[1]) / POUMON_BB[3]) * FOIE_BB[3]) * 10) / 10,
    ]),
  );
  // Inverse : sous-tracés et points renversés → extérieur vers intérieur.
  const rev = mapped.map((s) => s.slice().reverse()).reverse();
  const d = rev.map((s) => "M " + s.map((p) => p.join(" ")).join(" L ")).join(" ");
  const scale = Math.min(FOIE_BB[2] / POUMON_BB[2], FOIE_BB[3] / POUMON_BB[3]);
  sortie["zone-foie-d"] = {
    d,
    brush: Math.round(src.brush * scale * 10) / 10,
    passages: 3,
    duree: 8600,
    traineeOp: 0.75,
  };
  nb++;
}

writeFileSync(OUT, JSON.stringify(sortie));
console.log(`✓ ${nb} zone(s) « tracé » extraite(s) → ${OUT}`);

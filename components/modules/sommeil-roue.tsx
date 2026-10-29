// ----------------------------------------------------------------------------
// Roue du sommeil sur 24 h (slot « Repères clés », pilote M2-M5, 28/10).
// Forme figée, sans heures écrites et sans calcul affiché : une infographie,
// pas un outil. Vraie horloge : minuit en haut, midi en bas, sens des
// aiguilles d'une montre. Nuit et siestes en deux couleurs, l'éveil est ce
// qui reste entre deux sommeils.
//
// Journées types reprises telles quelles des roues validées par Laura le
// 27/10 (docs/sommeil-schemas/sommeil_24h.html, SRC.refs « 2m » à « 5m »).
// Le bouton « Construire ma roue » viendra plus tard, ailleurs.
// ----------------------------------------------------------------------------

import type React from "react";

type Journee = { coucher: string; sommeils: [string, string][] };

const JOURNEES: Record<number, Journee> = {
  2: {
    coucher: "20:45",
    sommeils: [
      ["20:45", "00:30"],
      ["01:15", "04:15"],
      ["04:55", "06:30"],
      ["07:45", "10:00"],
      ["11:15", "13:15"],
      ["14:30", "16:15"],
      ["17:30", "19:00"],
    ],
  },
  3: {
    coucher: "19:45",
    sommeils: [
      ["19:45", "00:45"],
      ["01:20", "06:30"],
      ["08:30", "10:30"],
      ["13:00", "15:00"],
      ["16:15", "17:30"],
    ],
  },
  4: {
    coucher: "19:45",
    sommeils: [
      ["19:45", "00:45"],
      ["01:20", "06:45"],
      ["08:45", "10:45"],
      ["13:00", "15:00"],
      ["16:30", "17:25"],
    ],
  },
  5: {
    coucher: "19:45",
    sommeils: [
      ["19:45", "00:30"],
      ["01:05", "07:00"],
      ["09:00", "11:00"],
      ["13:00", "15:00"],
      ["16:45", "17:20"],
    ],
  },
};

export const COULEURS_ROUE = {
  nuit: "#3E6F89",
  sieste: "#8FB4BC",
  eveil: "#F3E1D3",
  coucher: "#D4604A",
};

const HEURE: React.CSSProperties = { fontSize: 10.5, fontWeight: 600, fill: "#5C7480" };

const minutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// Sommeil de nuit : commence le soir (dès 19 h) ou avant 7 h du matin.
const estNuit = (debut: number) => debut >= 19 * 60 || debut < 7 * 60;

function point(cx: number, cy: number, r: number, f: number): [number, number] {
  const a = f * 2 * Math.PI;
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
}

function arc(cx: number, cy: number, ro: number, ri: number, f0: number, f1: number) {
  const span = f1 - f0;
  const big = span > 0.5 ? 1 : 0;
  const a = point(cx, cy, ro, f0);
  const b = point(cx, cy, ro, f1);
  const c = point(cx, cy, ri, f1);
  const d = point(cx, cy, ri, f0);
  return `M${a} A${ro},${ro} 0 ${big} 1 ${b} L${c} A${ri},${ri} 0 ${big} 0 ${d} Z`;
}

export function aUneRoue(mois: number) {
  return Boolean(JOURNEES[mois]);
}

export function RoueSommeil({ mois }: { mois: number }) {
  const j = JOURNEES[mois];
  if (!j) return null;
  const cx = 130;
  const cy = 138;
  const ro = 88;
  const ri = 54;

  return (
    <svg
      viewBox="0 32 260 222"
      role="img"
      aria-label={`Roue du sommeil sur 24 heures, journée type à ${mois} mois : la nuit et les siestes en bleu, l'éveil en clair.`}
      style={{ display: "block", width: "100%", maxWidth: 215, height: "auto", margin: "0 auto" }}
    >
      {/* Anneau d'éveil : ce qui reste entre deux sommeils. */}
      <circle
        cx={cx}
        cy={cy}
        r={(ro + ri) / 2}
        fill="none"
        stroke={COULEURS_ROUE.eveil}
        strokeWidth={ro - ri}
      />
      {j.sommeils.map(([a, b], i) => {
        const d = minutes(a);
        let f = minutes(b);
        if (f <= d) f += 1440;
        return (
          <path
            key={i}
            d={arc(cx, cy, ro, ri, d / 1440, f / 1440)}
            fill={estNuit(d) ? COULEURS_ROUE.nuit : COULEURS_ROUE.sieste}
            stroke={estNuit(d) ? COULEURS_ROUE.nuit : COULEURS_ROUE.sieste}
            strokeWidth={0.4}
          />
        );
      })}
      {/* Repères d'heure (29/10) : 0 h en haut, 12 h en bas, pour valider la compréhension. */}
      {/* 29/10 : lune et soleil retirés, les 4 repères d'heure suffisent. */}
      <text x={cx} y={cy - ro - 7} textAnchor="middle" style={HEURE}>0h</text>
      <text x={cx + ro + 8} y={cy + 3.5} textAnchor="start" style={HEURE}>6h</text>
      <text x={cx} y={cy + ro + 17} textAnchor="middle" style={HEURE}>12h</text>
      <text x={cx - ro - 8} y={cy + 3.5} textAnchor="end" style={HEURE}>18h</text>
      {/* 29/10 : le titre du schéma au centre (le mois est déjà dans le grand titre). */}
      <text
        x={cx}
        y={cy - 3}
        textAnchor="middle"
        style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".06em", fill: "#3A3228", textTransform: "uppercase" }}
      >
        <tspan x={cx}>Éveil / Sommeil</tspan>
        <tspan x={cx} dy={14}>sur 24h</tspan>
      </text>
    </svg>
  );
}

export function LegendeRoue() {
  const items: [string, string][] = [
    ["Nuit", COULEURS_ROUE.nuit],
    ["Siestes", COULEURS_ROUE.sieste],
    ["Éveil", COULEURS_ROUE.eveil],
  ];
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "6px 14px",
        margin: "10px 0 4px",
        fontSize: 10.5,
        color: "#3A3228",
      }}
    >
      {items.map(([nom, c]) => (
        <span key={nom} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span
            aria-hidden
            style={{
              width: 11,
              height: 11,
              borderRadius: 3,
              background: c,
            }}
          />
          {nom}
        </span>
      ))}
    </div>
  );
}

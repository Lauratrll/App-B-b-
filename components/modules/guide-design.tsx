import React from "react";

// ----------------------------------------------------------------------------
// Design partagé Guide-moi ! — pages 1 (catégories) et 2 (situations)
// Specs de référence :
//   skills/CONSIGNES_CLAUDE_CODE_guide_moi_page1.md  (V10)
//   skills/CONSIGNES_CLAUDE_CODE_guide_moi_page2.md   (V2)
//
// Adaptation « catégories variables » (validée par la fondatrice) :
//   Les consignes figent 8 clés (pleurs, alim, …). Or les catégories changent
//   selon l'âge (motricite, dents, colere, langage…). Pour rester fidèle à
//   l'ordre chromatique chaud→frais des consignes SANS inventer de couleur, on
//   attribue couleur + camaïeu PAR POSITION (slot 0→7), pas par clé. Les pictos
//   restent associés à la clé ; pour une clé sans picto défini, on retombe sur
//   l'emoji du JSON.
// ----------------------------------------------------------------------------

export const GUIDE_TEXT = "#3A3228";
export const GUIDE_MUTED = "#8A9E98";
export const GUIDE_CREAM = "#F2EDE8";

export type SlotStyle = {
  /** Couleur de fond de la case (page 1) + couleur du picto 32px (page 2). */
  bg: string;
  /** Couleur du cercle qui contient le picto (page 1). */
  avatarBg: string;
  /** Nuances pour les situations (page 2), dans l'ordre du JSON.
   *  4 par défaut ; une 5e est fournie pour les catégories étendues à 5
   *  situations (cf. CLAUDE.md — le nombre peut varier selon les mois). */
  camaieu: [string, string, string, string, string];
};

// Ordre chromatique figé (chaud → frais). Slot i appliqué à la i-ème catégorie
// du mois, quel que soit son identifiant.
export const GUIDE_SLOTS: SlotStyle[] = [
  { bg: "#F0B8A8", avatarBg: "rgba(255,255,255,.40)", camaieu: ["#E4A894", "#F1D5CB", "#DB9C86", "#F0B8A8", "#E9C2B0"] },
  { bg: "#F5D0C8", avatarBg: "rgba(255,255,255,.50)", camaieu: ["#EABDB1", "#F3DFD9", "#E3AFA0", "#F5D0C8", "#EFCDC2"] },
  { bg: "#F8DBC9", avatarBg: "rgba(255,255,255,.55)", camaieu: ["#EEC7B0", "#F4E4DA", "#E7B99F", "#F8DBC9", "#F2D4C2"] },
  { bg: "#EDE0D4", avatarBg: "rgba(255,255,255,.55)", camaieu: ["#E0CFBE", "#EFE7DF", "#D7C3AE", "#EDE0D4", "#E5D6C5"] },
  { bg: "#BCD0A0", avatarBg: "rgba(255,255,255,.45)", camaieu: ["#A6C088", "#D9DFC7", "#96B477", "#BCD0A0", "#CAD8B2"] },
  { bg: "#B0C0AC", avatarBg: "rgba(255,255,255,.45)", camaieu: ["#9CB098", "#D4D8CD", "#8EA48A", "#B0C0AC", "#BFCCBC"] },
  { bg: "#C8D8DC", avatarBg: "rgba(255,255,255,.50)", camaieu: ["#B2C6CC", "#DFE3E2", "#A2B9C0", "#C8D8DC", "#D4E0E3"] },
  { bg: "#E8F0F2", avatarBg: "rgba(255,255,255,.60)", camaieu: ["#D0DEE1", "#EDEEEC", "#BFD1D5", "#E8F0F2", "#DCE8EB"] },
];

export function slotFor(index: number): SlotStyle {
  return GUIDE_SLOTS[((index % GUIDE_SLOTS.length) + GUIDE_SLOTS.length) % GUIDE_SLOTS.length];
}

// ----------------------------------------------------------------------------
// Pictos SVG par clé de catégorie. fill="currentColor" + stroke pilotés par la
// prop `color` (style.color). 8 clés des consignes + clés ajoutées (même style)
// pour les thèmes des mois plus grands (motricité, dents, langage, corpo,
// émotions, propreté…).
// ----------------------------------------------------------------------------

const ICON_PATHS: Record<string, React.ReactNode> = {
  pleurs: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 16c1-1.5 2.5-2.2 4-2.2s3 .7 4 2.2" />
      <circle cx="9" cy="10" r=".9" fill="currentColor" />
      <circle cx="15" cy="10" r=".9" fill="currentColor" />
      <path d="M9 17.5l-.3 1.5M15 17.5l.3 1.5" />
    </>
  ),
  alim: (
    <>
      <path d="M10 4c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v1.5c.8.3 1.5.9 1.5 1.8H8.5c0-.9.7-1.5 1.5-1.8V4z" />
      <path d="M8.5 7.3v1.4h7V7.3" />
      <path d="M8.5 8.7c-.2.6-.5 1.2-.5 1.8v8c0 1.4 1.1 2.5 2.5 2.5h3c1.4 0 2.5-1.1 2.5-2.5v-8c0-.6-.3-1.2-.5-1.8" />
      <path d="M9 13h2M9 16h2" />
    </>
  ),
  sommeil: <path d="M17 13a6 6 0 11-7-7 4.5 4.5 0 007 7z" />,
  corps: (
    <>
      <path d="M7.5 13.5L5.5 12c-.6-.5-1.5-.2-1.5.7v.3c0 .6.3 1.2.8 1.6L7 16" />
      <path d="M8.2 13V5.2c0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2V12" />
      <path d="M10.6 12V4c0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2v8" />
      <path d="M13 12V4.5c0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2V12" />
      <path d="M15.4 12V6c0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2v7" />
      <path d="M7.5 13.5c0 4 2.5 7.5 6 7.5h0c2.5 0 4.3-1.8 4.3-4.3V13" />
    </>
  ),
  stimu: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </>
  ),
  sepa: <path d="M12 20s-7-4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 6-7 10-7 10z" />,
  sante: (
    <>
      <path d="M12 8v8M8 12h8" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  parent: <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" />,
  // --- Clés ajoutées pour les mois plus grands (même style trait) ----------
  // motricité & corps : silhouette en mouvement
  motricite: (
    <>
      <circle cx="14" cy="5" r="1.6" />
      <path d="M13 8l-2 4 3 1 1.5 4" />
      <path d="M11 12l-4 1.5" />
      <path d="M14 13l3-1 2.5 2" />
    </>
  ),
  // poussées dentaires : dent
  dents: (
    <path d="M8 5c-1.6 0-2.6 1.2-2.6 2.9 0 1.3.3 2.6.8 4.5.5 2.4.8 4.6 1.7 4.6.9 0 1-1.7 1.4-3.3.2-1 .4-1.7 1.2-1.7s1 .7 1.2 1.7c.4 1.6.5 3.3 1.4 3.3.9 0 1.2-2.2 1.7-4.6.5-1.9.8-3.2.8-4.5C18.6 6.2 17.6 5 16 5c-1.3 0-2.1.6-4 .6S9.3 5 8 5z" />
  ),
  // colères & frustration : tourbillon
  colere: <path d="M5 6h14M6 9.5h12M8 13h8M10 16.5h4M12 20h1.5" />,
  // langage & communication : bulle
  langage: (
    <>
      <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2h-7l-4 3v-3H6a2 2 0 01-2-2z" />
      <path d="M8 8.5h8M8 11h5" />
    </>
  ),
  // corps & motricité : enfant qui court (silhouette penchée, foulée)
  corpo: (
    <>
      <circle cx="16" cy="4.8" r="1.9" />
      <path d="M15.3 6.8l-3.5 5" />
      <path d="M11.8 11.8l3 1-.3 4.3" />
      <path d="M11.8 11.8l-3.1 1.4-1.8 2.9" />
      <path d="M14.6 7.8l2.3.7-.7 2.1" />
      <path d="M14.6 7.8l-3.2-.9" />
    </>
  ),
  // émotions : visage expressif (sourcils + bouche ondulée)
  emotion: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 10l2.2.8M16 10l-2.2.8" />
      <circle cx="9.6" cy="12.4" r=".9" fill="currentColor" />
      <circle cx="14.4" cy="12.4" r=".9" fill="currentColor" />
      <path d="M9.5 16.2c.8-.8 1.5.6 2.5.6s1.7-1.4 2.5-.6" />
    </>
  ),
  // propreté : le pot de bébé — dossier (paroi arrière), vague avant, corps, base
  proprete: (
    <>
      <path d="M6.6 8.6C7.4 4.7 9.4 3.2 12 3.2s4.6 1.5 5.4 5.4" />
      <ellipse cx="12" cy="9.4" rx="6.4" ry="2.5" />
      <path d="M7.8 10.1c1.1-1.1 2.4-1.1 3.6-.4 1.2.7 2.5.6 3.7-.4" />
      <path d="M5.7 9.9c0 3.3.9 6.5 3.3 7.8 1.9 1 4.3 1 6.2-.1 2.3-1.3 3.1-4.4 3.1-7.6" />
      <path d="M7.6 17.9c2.5.9 6.5.9 9-.1" />
    </>
  ),
};

export function CategoryIcon({
  categoryKey,
  color,
  size = 16,
  emoji,
}: {
  categoryKey: string;
  color: string;
  size?: number;
  emoji?: string;
}) {
  const paths = ICON_PATHS[categoryKey];
  if (!paths) {
    // Repli : emoji du JSON pour une catégorie sans picto SVG dédié.
    return (
      <span aria-hidden style={{ fontSize: Math.round(size * 0.95), lineHeight: 1 }}>
        {emoji ?? "•"}
      </span>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color, display: "block" }}
      aria-hidden
    >
      {paths}
    </svg>
  );
}

// ----------------------------------------------------------------------------
// Parsing du libellé `situation` : « MAJUSCULES / complément en minuscules ».
// ----------------------------------------------------------------------------

export function parseSituation(situation: string): {
  firstPart: string;
  secondPart: string;
} {
  const parts = situation.split(" / ");
  if (parts.length >= 2) {
    return {
      firstPart: parts[0].trim(),
      secondPart: parts.slice(1).join(" / ").trim(),
    };
  }
  return { firstPart: situation, secondPart: "" };
}

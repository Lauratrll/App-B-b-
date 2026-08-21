import type { ReactNode } from "react";

// Jetons de design de l'onglet « Réflexologie plantaire ».
// Alignés sur SKILL_ui.md et sur le traitement déjà en place dans Guide-moi :
// titre en Playfair noir #3A3228, sous-titre en capitales Eucalyptus #8A9E98.

export const PLAYFAIR = "var(--font-playfair), Georgia, serif";

/** Noir éditorial — titres et texte fort. */
export const REFLEXO_TEXT = "#3A3228";
/** Eucalyptus — sous-titres, mentions, texte secondaire. */
export const REFLEXO_MUTED = "#8A9E98";

/** Fonds des blocs de contenu (registre doux, cohérent avec les autres modules). */
export const REFLEXO_BG_DOUX = "#E8F0EE";
export const REFLEXO_BG_ACCENT = "#DCE8E4";
/** Cadre de sécurité / disclaimer — registre sable, jamais alarmiste. */
export const REFLEXO_BG_CADRE = "#F2EDE4";

// Alternance de fonds pour la liste, même principe que les slots de Guide-moi :
// deux teintes qui se relaient pour aérer la liste sans la rendre bariolée.
const SLOTS = [
  { bg: "#E8F0EE", avatarBg: "#CFE0DA" },
  { bg: "#EFEAE1", avatarBg: "#DFD4C4" },
] as const;

export function slotReflexo(i: number) {
  return SLOTS[i % SLOTS.length];
}

/**
 * Rend les passages en gras d'un texte de contenu : `**comme ceci**` devient
 * `<strong>`. Laura écrit ses textes en markdown léger dans les JSON de
 * /reflexologie (le champ `presentation` de l'accueil, notamment) — sans ça,
 * les astérisques s'affichent tels quels au parent.
 *
 * Volontairement limité au gras : c'est la seule marque utilisée dans les
 * contenus, et on ne veut pas d'un moteur markdown (ni de `dangerouslySetInnerHTML`)
 * pour du texte affiché à des parents.
 */
export function texteGras(texte: string): ReactNode {
  // Découpe en alternant : hors-gras, gras, hors-gras… (les captures du split
  // atterrissent aux index impairs).
  const morceaux = texte.split(/\*\*(.+?)\*\*/g);
  if (morceaux.length === 1) return texte;
  return morceaux.map((m, i) =>
    i % 2 === 1 ? (
      <strong key={i} style={{ fontWeight: 600 }}>
        {m}
      </strong>
    ) : (
      m
    ),
  );
}

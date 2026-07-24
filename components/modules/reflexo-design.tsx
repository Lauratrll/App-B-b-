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

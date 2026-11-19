// Couleurs du Métronome du souffle (page Cohérence cardiaque).
// 19/11/2026 (Laura) : la page et l'animation passent au vert sauge de la case
// « Gestes d'apaisement » de l'accueil, comme le rond cœur de la barre du bas.
// (Avant : la lavande de la carte « Parents submergés » de Guide-moi.)
// Fichier à part (sans "use client") pour être lu aussi par la page serveur
// app/(app)/coherence/page.tsx : une page serveur ne peut pas lire une valeur
// exportée par un fichier client.
export const SAUGE = {
  /** Fond de la page = la case Gestes d'apaisement de l'accueil. */
  fond: "#DFE7D5",
  clair: "#E8EEE0",
  moyen: "#CCD7B9",
  /** Écho large de la vague (auréole soutenue de la case Apaisement). */
  soutenu: "#BECEA9",
  /** Trait de la vague et rythme choisi (texte blanc dessus : contraste 5,5). */
  profond: "#5E7546",
  /** La bulle : le vert tendre de la Réflexologie et de la page Apaisement, en aplat. */
  bulle: "#526528",
  /** Textes, et fond du bouton Commencer (texte blanc dessus). */
  texte: "#3E5230",
} as const;

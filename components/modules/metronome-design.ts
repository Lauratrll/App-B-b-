// Couleurs du Métronome du souffle : la lavande de la carte « Parents submergés »
// de Guide-moi (GUIDE_SLOT_PARENT, guide-design.tsx) + un violet plus profond.
// Fichier à part (sans "use client") pour être lu aussi par la page serveur
// app/(app)/coherence/page.tsx : une page serveur ne peut pas lire une valeur
// exportée par un fichier client.
export const LAVANDE = {
  fond: "#DBD7EA",
  clair: "#E4E1ED",
  moyen: "#CFC9E1",
  soutenu: "#BBB4D1",
  profond: "#8F86B0",
  /** La bulle : le violet le plus foncé de la gamme, en aplat (06/11). */
  bulle: "#766C9E",
  texte: "#46405A",
} as const;

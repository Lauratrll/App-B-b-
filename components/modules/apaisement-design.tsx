import type { ReactNode } from "react";

// Jetons de design de la rubrique « Gestes d'apaisement ».
//
// Une seule famille : la SAUGE POUDRÉE de la case de l'accueil (#E5EBDD), pour
// que la liste et les fiches prolongent la case sur laquelle le parent a tapé.
// Le `profond` est celui de la sauge de la Réflexologie (#526528, le vert tendre
// validé par Laura le 28/08, et non le kaki qui agressait l'œil) : 5,3 de
// contraste sur le fond de ligne, 6,5 en blanc sur lui (pastilles, onglet actif).
// Le cadre de sécurité garde le code de toute l'app (SKILL_ui, rubrique 8).

export const PLAYFAIR = "var(--font-playfair), Georgia, serif";

export const APAISEMENT = {
  /** Noir éditorial — titres et texte. */
  texte: "#3A3228",
  /** Eucalyptus — mentions posées sur le fond Cream, jamais sur la sauge. */
  muted: "#8A9E98",
  /** Fond d'une ligne de la liste = fond de la case de l'accueil. */
  bg: "#E5EBDD",
  /** Le rond qui porte le picto. */
  avatarBg: "#CCD8C1",
  /** Fond du bloc « Gestes pas à pas ». */
  doux: "#E5EBDD",
  /** Intitulés, pastilles numérotées, onglet actif. */
  profond: "#526528",
} as const;

export const CADRE_SECURITE = {
  bg: "#EDE9E4",
  bord: "#D4604A",
  label: "#8A3020",
  texte: "#5A4A40",
} as const;

/** Intitulé de section : capitales espacées, comme partout dans l'app. */
export const styleIntitule = (couleur: string) =>
  ({
    fontSize: 10,
    color: couleur,
    letterSpacing: ".13em",
    textTransform: "uppercase",
    fontWeight: 700,
    margin: "0 0 9px 0",
  }) as const;

/**
 * Le gras et l'italique du tableau arrivent en markdown : `**gras**` et
 * `*italique*` (brief §3). On les rend, on n'affiche jamais les astérisques.
 */
export function texteRiche(texte: string): ReactNode {
  const morceaux = texte.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g);
  if (morceaux.length === 1) return texte;
  return morceaux.map((m, i) => {
    if (i % 2 === 0) return m;
    if (m.startsWith("**")) {
      return (
        <strong key={i} style={{ fontWeight: 600 }}>
          {m.slice(2, -2)}
        </strong>
      );
    }
    return <em key={i}>{m.slice(1, -1)}</em>;
  });
}

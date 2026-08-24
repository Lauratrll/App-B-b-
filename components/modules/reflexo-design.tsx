import type { ReactNode } from "react";

// Jetons de design de l'onglet « Réflexologie plantaire ».
// Titre en Playfair noir #3A3228, comme partout ailleurs dans l'app.
//
// ---------------------------------------------------------------------------
// LA GAMME — arrêtée par Laura le 24/08/2026, ne pas la re-dériver.
//
// Cinq familles qui descendent le cercle chromatique sans revenir en arrière :
// violet bleuté 282° → violet lilas 312° → bleu ciel 240° → turquoise vert 168°
// → sauge 132°. Le terracotta clair 42° vit à part : il est réservé au bloc
// d'introduction, pour le détacher des protocoles.
//
// Construite en OKLCH : à l'intérieur d'un même rôle, les cinq familles
// partagent la même clarté et la même intensité, seule la teinte change — c'est
// ce qui les fait tenir ensemble. Chaque famille porte en plus un correcteur
// d'intensité (un turquoise crie plus qu'un violet à réglage égal).
//
// Laura aime le camaïeu : les paires serrées (les deux violets à 2,8, turquoise
// et sauge à 2,9) sont VOULUES. Ne pas les « corriger ».
// ---------------------------------------------------------------------------

export const PLAYFAIR = "var(--font-playfair), Georgia, serif";

/** Noir éditorial — titres et texte fort. */
export const REFLEXO_TEXT = "#3A3228";
/**
 * Eucalyptus — mentions hors gamme (fil d'Ariane, sous-titre de l'onglet).
 * ⚠️ Ne PAS l'utiliser sur un fond de la gamme : le contraste y tombe à 2,2.
 * Sur un fond coloré, c'est le `profond` de la famille qui prend le relais.
 */
export const REFLEXO_MUTED = "#8A9E98";

/** Les cinq rôles d'une famille de couleurs. */
export type ReflexoFamille = {
  nom: string;
  /** Fond d'un protocole dans la liste. */
  bg: string;
  /** Le rond qui porte l'icône du protocole. */
  avatarBg: string;
  /** Fond des blocs de texte d'une fiche. */
  doux: string;
  /** Fond des blocs mis en avant. */
  accent: string;
  /** Intitulés de section et texte fort — remplace l'eucalyptus sur ces fonds. */
  profond: string;
};

export const REFLEXO_GAMME: ReflexoFamille[] = [
  { nom: "Violet bleuté", bg: "#D8DBFF", avatarBg: "#BBBEFA", doux: "#E9EBFF", accent: "#E2E4FF", profond: "#545587" },
  { nom: "Violet lilas", bg: "#EAD4F9", avatarBg: "#D6B6EA", doux: "#F4E7FC", accent: "#F1DEFD", profond: "#694E7A" },
  { nom: "Bleu ciel", bg: "#BFE4FE", avatarBg: "#92CCF5", doux: "#DCF0FF", accent: "#CFEBFF", profond: "#2B6083" },
  { nom: "Turquoise vert", bg: "#C1E8D8", avatarBg: "#9AD3BC", doux: "#DDF3E9", accent: "#CFEFE1", profond: "#336654" },
  { nom: "Sauge", bg: "#D4E5C7", avatarBg: "#B5CDA3", doux: "#E7F1E0", accent: "#DDECD3", profond: "#4D633C" },
];

/**
 * Terracotta clair — HORS rotation. Réservé au bloc « Introduction » de
 * l'accueil, qui n'est pas un protocole et doit se distinguer de la liste.
 */
export const REFLEXO_TERRACOTTA: ReflexoFamille = {
  nom: "Terracotta clair",
  bg: "#FED3C3",
  avatarBg: "#F2B49C",
  doux: "#FFE7DE",
  accent: "#FFDED2",
  profond: "#7F4C38",
};

/**
 * La famille d'une ligne de la liste, **par position**.
 *
 * ⚠️ Volontairement indexé sur le RANG et non sur l'id du protocole : l'ordre
 * des protocoles changera (décision Laura), et c'est la SUITE DE COULEURS qui
 * est validée, pas l'association d'une couleur à un protocole donné. La 1re
 * ligne sera toujours violet bleuté, quel que soit le protocole qui l'occupe.
 */
export function slotReflexo(i: number): ReflexoFamille {
  const n = REFLEXO_GAMME.length;
  return REFLEXO_GAMME[((i % n) + n) % n];
}

// --- Compatibilité ---------------------------------------------------------
// Fonds « neutres » historiques, redéfinis dans la gamme pour que les écrans
// pas encore repris ne jurent pas. Les blocs qui ont un sens éditorial doivent
// désormais piocher explicitement dans REFLEXO_GAMME ou REFLEXO_TERRACOTTA.

/** Fond de bloc doux par défaut — turquoise vert, la couleur de l'onglet. */
export const REFLEXO_BG_DOUX = REFLEXO_GAMME[3].doux;
/** Fond de bloc mis en avant par défaut. */
export const REFLEXO_BG_ACCENT = REFLEXO_GAMME[3].accent;
/** Cadre de sécurité / disclaimer — terracotta, registre attention non alarmiste. */
export const REFLEXO_BG_CADRE = REFLEXO_TERRACOTTA.accent;

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

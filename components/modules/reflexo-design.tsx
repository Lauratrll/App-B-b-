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
// DOSAGE calé sur Guide-moi, en deux temps.
//
// 1. La CLARTÉ : les 8 cases de Guide-moi sont en moyenne à 0,868, les fonds de
//    ligne d'ici à 0,878. C'était juste dès la première fois, et ça n'a pas
//    bougé. Une version à 0,900 / 0,049 avait été jugée « trop fluo » par Laura :
//    très clair ET soutenu, c'est la recette exacte du néon.
//
// 2. L'INTENSITÉ, corrigée le 28/08/2026 — les fonds paraissaient encore
//    « lumineux » à Laura. La moyenne de Guide-moi (0,037) est un leurre : elle
//    cache un écart énorme entre ses CHAUDS, qui montent à 0,069, et ses FROIDS,
//    qui tombent à 0,018–0,020. Guide-moi s'autorise d'être colorée dans le
//    chaud et devient presque grise dans le froid. Or les cinq familles d'ici
//    sont TOUTES froides : à 0,038 elles étaient au double de ce que la
//    référence se permet dans cette zone. L'intensité des fonds est donc passée
//    de 0,038 à 0,029 (−25 %), les autres rôles ont suivi dans la même
//    proportion. Teintes, clarté et ordre inchangés — rien de ce que Laura a
//    validé le 24/08 ne bouge, et aucune couleur de TEXTE n'a été touchée.
//
// ⚠️ Ne remonter ni la clarté ni l'intensité. Et pour toute nouvelle couleur :
// c'est le registre FROID de Guide-moi (≈ 0,020) qui sert de plafond, pas sa
// moyenne — la moyenne autoriserait un pastel froid que l'œil lit comme du néon.
//
// Laura aime le camaïeu : les paires serrées (les deux violets, turquoise et
// sauge) sont VOULUES. Ne pas les « corriger ». La baisse d'intensité du 28/08
// les a encore rapprochées d'un quart — c'est assumé, et c'est ce qui borne la
// marge de manœuvre si on voulait poudrer davantage.
//
// UNE EXCEPTION à la règle « intensité commune par rôle » : le `profond` de la
// sauge (voir son commentaire). La sauge est donc la plus vive des cinq sur ce
// seul rôle — et c'est le seul rôle que la baisse d'intensité n'a pas touché.
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
  { nom: "Violet bleuté", bg: "#D3D5EA", avatarBg: "#B8BBDC", doux: "#E6E7F7", accent: "#DFE0F3", profond: "#545584" },
  { nom: "Violet lilas", bg: "#DDD2E4", avatarBg: "#C7B6D3", doux: "#EDE5F2", accent: "#E7DEEE", profond: "#684F78" },
  { nom: "Bleu ciel", bg: "#C6DAE8", avatarBg: "#A3C2D9", doux: "#DDEBF5", accent: "#D3E5F2", profond: "#2F6081" },
  { nom: "Turquoise vert", bg: "#C9DCD4", avatarBg: "#A7C6B9", doux: "#DEECE6", accent: "#D6E7DF", profond: "#366654" },
  // Le `profond` de la sauge SORT de la règle « intensité commune par rôle » :
  // OKLCH L 0.478 C 0.090 H 124 au lieu de L 0.470 C 0.056 H 132. Le kaki
  // d'origine (#4E623E) agressait l'œil de Laura (28/08) — c'était l'olive, pas
  // la profondeur. On ne pouvait pas l'éclaircir : ce ton porte l'accroche de
  // 11,5 px sur le fond de ligne, où le contraste n'a plus aucune marge : 4,50
  // pour un seuil de 4,50, depuis que l'intensité des fonds a baissé le 28/08.
  // Ce vert tendre garde donc la même densité (5,32 sur `doux`, 6,46 en blanc
  // sur lui) et gagne en franchise. C'est la sauge qui fixe désormais le
  // plancher de la gamme : pour des fonds encore plus poudrés, il faudrait
  // d'abord donner à cette accroche sa propre teinte foncée.
  { nom: "Sauge", bg: "#D2DACB", avatarBg: "#B5C3AC", doux: "#E5EBE0", accent: "#DDE5D8", profond: "#526528" },
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
 * Le fond du lecteur animé et des cartes de protocole — la couleur « vidéo ».
 * Source unique : `reflexo-lecteur.tsx` l'importe d'ici plutôt que d'en garder
 * une copie, pour que la cohérence soit structurelle et pas un hasard de deux
 * codes hexadécimaux identiques.
 *
 * L'introduction de l'accueil la reprend (choix Laura, 25/08/2026) : plus
 * foncée que les fonds de la gamme, elle rattache visuellement le bloc à ce
 * que le parent verra en lançant une animation.
 */
export const REFLEXO_FOND_LECTEUR = "#DFBEB0";

/**
 * Le ton des mentions posées SUR ce fond. Le `profond` du terracotta (#7F4C38)
 * n'y tient que 4,05 de contraste, sous le seuil des 9 px en capitales : on
 * descend d'un cran dans la même famille pour repasser à 5,2.
 */
export const REFLEXO_FOND_LECTEUR_TEXTE = "#6B3D2B";

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
  // Découpe en gardant les marqueurs : **gras** et _italique_ (les captures du
  // split atterrissent aux index impairs, on relit alors le marqueur). Le gras
  // est rendu récursivement, ce qui permet **_gras italique_** — la mise en
  // forme des phrases d'accueil de l'émotion, en fin d'intro.
  const morceaux = texte.split(/(\*\*[^*]+\*\*|_[^_\n]+_)/g);
  if (morceaux.length === 1) return texte;
  return morceaux.map((m, i) => {
    if (i % 2 === 0) return m;
    if (m.startsWith("**")) {
      return (
        <strong key={i} style={{ fontWeight: 600 }}>
          {texteGras(m.slice(2, -2))}
        </strong>
      );
    }
    return (
      <em key={i} style={{ fontStyle: "italic" }}>
        {m.slice(1, -1)}
      </em>
    );
  });
}

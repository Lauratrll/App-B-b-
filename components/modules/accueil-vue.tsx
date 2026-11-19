import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppMenu } from "@/components/ui/app-menu";
import { AideInstallationAccueil } from "@/components/ui/installer-app";
import { ThemeDuMois, type ThemeDuMoisData } from "@/components/modules/theme-du-mois";
import themesDuMois from "@/content/Compétences bébé/themes_du_mois.json";

// Accueil à cases de tailles différentes (« B2 »), Laura, 18/11/2026 :
//   Sommeil & Endormissement (toute la largeur)
//   Guide-moi ! (case haute) | Gestes d'apaisement, puis Réflexologie plantaire
//   Prendre soin de moi | Vivre la saison
// Deux camaïeux : chaud pour Guide-moi (rosé), Prendre soin (pêche) et Saison
// (abricot doré adouci) ; frais pour Apaisement (sauge), Réflexologie (turquoise
// vert) et Sommeil (bleu ciel, comme le rond du rythme). Chaque case porte deux
// auréoles, deux tons PLUS SOUTENUS de son camaïeu (jamais plus clairs, jamais de
// blanc), et une ombre douce (relief). Pas de picto, titres centrés en Playfair,
// sous-titre en capitales non grasses. Pas de saison en haut.
//
// PAGE FIGÉE (18/11) : l'accueil ne défile pas. Il occupe exactement la hauteur de
// l'écran (classe `accueil-fige`, règles dans globals.css) ; le bloc des cases prend
// la place qui reste et ses rangées se partagent la hauteur dans les proportions
// de la maquette (Sommeil 108 · Guide-moi 208 · rangée du bas 98), plafonnées à ces
// tailles sur les grands écrans, réduites ensemble sur les petits.

// ESSAI PHOTO (19/11/2026) : photo en haut de l'accueil, bandeau posé dessus, case
// Sommeil qui la chevauche. Laura n'a pas encore décidé de la garder.
// → Pour revenir à l'accueil d'avant (sans photo), remplacer tout l'objet par `null`.
// Photos essayées le 19/11, dans images/photos accueil/ : « peau à peau » (premier
// essai, avec fondu blanc refusé), « lumineux » (cheveux sombres à droite),
// « lumineux - recentré » (retenue pour l'essai, zoomée pour cacher l'œil du haut).
const PHOTO_ACCUEIL: {
  src: string;
  cadrage: CSSProperties;
  /** De combien (px) la case Sommeil remonte sur la photo. */
  chevauchement: number;
} | null = {
  src: "/images/accueil/peau-a-peau-recentre.jpg",
  cadrage: { objectPosition: "70% 30%", transform: "scale(1.15)", transformOrigin: "50% 100%" },
  chevauchement: 30,
};

const FOND_ACCUEIL = "#FAEEE9";
const TEXTE = "#3A3228";
const BRUN = "#8A4030"; // sous-titres des cases chaudes (labels de Prendre soin de moi)

type Case = {
  href: string;
  title: string;
  fond: string;
  /** Ton soutenu (auréole principale) puis ton intermédiaire (auréole secondaire). */
  aureoles: [string, string];
  /** Origine de chaque auréole, en position CSS. */
  directions: [string, string];
  sousTitre: string;
};

const CASES = {
  sommeil: { href: "/coucher", title: "Sommeil & Endormissement", fond: "#C6DAE8", aureoles: ["#A3C2D9", "#B9D2E6"], directions: ["100% 100%", "0% 0%"], sousTitre: "#285470" },
  guide: { href: "/guide", title: "Guide-moi !", fond: "#F5D0C8", aureoles: ["#E3AFA0", "#EABDB1"], directions: ["0% 0%", "100% 100%"], sousTitre: BRUN },
  // Un tout petit peu moins clair, auréole moins blanche (Laura, 18/11 ; avant #E5EBDD / #CCD7B9).
  apaisement: { href: "/apaisement", title: "Gestes d'apaisement", fond: "#DFE7D5", aureoles: ["#BECEA9", "#C9D5B6"], directions: ["100% 0%", "0% 100%"], sousTitre: "#435530" },
  // Turquoise vert éclairci (Laura, 18/11 : « un peu plus clair, un peu plus vert-bleu »).
  reflexo: { href: "/reflexologie", title: "Réflexologie plantaire", fond: "#D2E4DC", aureoles: ["#AFCBBF", "#C0D8CD"], directions: ["0% 100%", "100% 0%"], sousTitre: "#2F5A4A" },
  // Prend la pêche qu'avait Vivre la saison (Laura, 18/11 ; avant rosé #EABDB1).
  soin: { href: "/soin", title: "Prendre soin de moi", fond: "#F8DBC9", aureoles: ["#E7B99F", "#EEC7B0"], directions: ["50% 125%", "50% -25%"], sousTitre: BRUN },
  // Abricot doré, chaud mais éclairci et adouci (Laura, 18/11).
  saison: { href: "/saison", title: "Vivre la saison", fond: "#F9E3C8", aureoles: ["#F0CB9E", "#F5D8B6"], directions: ["125% 50%", "-25% 50%"], sousTitre: "#7E4E22" },
} satisfies Record<string, Case>;

const SEASON_LABELS: Record<string, string> = {
  printemps: "Printemps",
  ete: "Été",
  automne: "Automne",
  hiver: "Hiver",
};

function CaseAccueil({ c, subtitle, grand = false }: { c: Case; subtitle: string; grand?: boolean }) {
  const [a, b] = c.aureoles;
  const [pa, pb] = c.directions;
  return (
    <Link
      prefetch
      href={c.href}
      // La case remplit la place que lui donne sa rangée (page figée).
      className="flex h-full min-h-0 flex-col items-center justify-center gap-[7px] overflow-hidden rounded-[24px] px-3 text-center transition-transform active:scale-[0.97]"
      style={{
        backgroundColor: c.fond,
        // Hex à 8 chiffres (alpha) plutôt que transparent/color-mix : rendu sûr sur tous les Safari.
        backgroundImage: `radial-gradient(circle at ${pa}, ${a} 0, ${a}00 78%), radial-gradient(circle at ${pb}, ${b}D9 0, ${b}00 62%)`,
        // Relief : ombre douce sous la case.
        boxShadow: "0 8px 18px -8px rgba(110,60,45,.30), 0 2px 4px rgba(110,60,45,.06)",
      }}
    >
      <p
        className="font-display font-semibold"
        style={{ color: TEXTE, fontSize: grand ? 22 : 17, lineHeight: 1.15, letterSpacing: "-0.01em", textWrap: "balance" }}
      >
        {c.title}
      </p>
      <p className="text-[9.5px] font-normal uppercase" style={{ color: c.sousTitre, letterSpacing: "0.15em" }}>
        {subtitle}
      </p>
    </Link>
  );
}

/** Thème du mois de bébé (0 à 23), ou null si hors bornes ou sans donnée. */
function themeDuMois(mois: number): ThemeDuMoisData | null {
  if (!Number.isInteger(mois) || mois < 0 || mois > 23) return null;
  const m = themesDuMois.mois?.find((x) => x.mois === mois);
  if (!m?.mot || !m?.texte) return null;
  return {
    mot: m.mot,
    texte: m.texte,
    introCourte: themesDuMois.introduction?.version_courte ?? "",
  };
}

// Proportions des trois rangées (hauteurs de la maquette, en px sur un téléphone courant).
const RANG = { sommeil: 108, milieu: 208, bas: 98 } as const;
const ECARTS = 2 * 12;
const HAUTEUR_MAX = RANG.sommeil + RANG.milieu + RANG.bas + ECARTS;

/** Accueil, sans la lecture des données (testable seul). */
export function AccueilVue({ prenom, mois, saison }: { prenom: string; mois: number; saison: string }) {
  const initiale = prenom.trim().charAt(0).toUpperCase();
  const theme = themeDuMois(mois);

  // Le bandeau : thème du mois (initiale), « Bonjour ! », prénom et âge, menu.
  const bandeau = (
    <>
      {/* L'encart de l'initiale ouvre le « Thème du mois » (19/11) ; sans donnée, il reste un simple encart. */}
      {theme ? (
        <ThemeDuMois initiale={initiale} theme={theme} />
      ) : (
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-[22px] font-semibold"
          style={{ background: CASES.guide.fond, color: BRUN }}
        >
          {initiale}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold" style={{ color: BRUN }}>Bonjour !</p>
        <h1 className="font-display text-2xl font-semibold leading-tight text-charcoal">
          {prenom}, {mois} mois
        </h1>
      </div>
      <AppMenu />
    </>
  );

  // pb : le tiers des boutons ronds de la barre du bas dépasse au-dessus.
  return (
    <section
      className={`accueil-fige centre-vertical flex min-h-0 flex-1 flex-col pb-[26px] ${PHOTO_ACCUEIL ? "justify-start" : "justify-center"}`}
    >
      {/* Fond coloré de l'accueil, sur tout l'écran (derrière la barre du bas, translucide ici). */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ background: FOND_ACCUEIL }} />
      <AideInstallationAccueil />

      {PHOTO_ACCUEIL ? (
        // Photo en haut, bord à bord (annule les marges du <main>), bandeau posé dessus.
        // Pas de fondu ni de voile blanc, en haut comme en bas (Laura, 19/11).
        <div className="relative -mx-5 -mt-6 shrink-0 overflow-hidden" style={{ height: "clamp(190px, 36dvh, 310px)" }}>
          <Image
            src={PHOTO_ACCUEIL.src}
            alt=""
            fill
            priority
            sizes="(max-width: 430px) 100vw, 430px"
            className="object-cover"
            style={PHOTO_ACCUEIL.cadrage}
          />
          <header className="relative flex items-center gap-3 px-5 pt-6">{bandeau}</header>
        </div>
      ) : (
        // Accueil sans photo (réglages d'avant le 19/11). Marge sous le prénom : 48 px sur
        // un téléphone courant (Laura, 18/11), moins sur les petits écrans.
        <header className="flex shrink-0 items-center gap-3" style={{ marginBottom: "clamp(16px, 5.5dvh, 48px)" }}>
          {bandeau}
        </header>
      )}

      {/* Avec la photo, la case Sommeil remonte un peu dessus (moins de rupture). */}
      <div
        className="relative flex min-h-0 flex-1 flex-col gap-3"
        style={{ maxHeight: HAUTEUR_MAX, marginTop: PHOTO_ACCUEIL ? -PHOTO_ACCUEIL.chevauchement : 0 }}
      >
        <div className="min-h-0" style={{ flex: `${RANG.sommeil} 1 0px` }}>
          <CaseAccueil c={CASES.sommeil} subtitle="Rythmes et rituels" grand />
        </div>
        <div className="grid min-h-0 grid-cols-2 gap-3" style={{ flex: `${RANG.milieu} 1 0px` }}>
          {/* Guide-moi prend la hauteur des deux cases de droite. */}
          <CaseAccueil c={CASES.guide} subtitle="Protocoles" grand />
          <div className="flex min-h-0 flex-col gap-3">
            <div className="min-h-0 flex-1"><CaseAccueil c={CASES.apaisement} subtitle="Boîte à outils" /></div>
            <div className="min-h-0 flex-1"><CaseAccueil c={CASES.reflexo} subtitle="Apaiser bébé" /></div>
          </div>
        </div>
        <div className="grid min-h-0 grid-cols-2 gap-3" style={{ flex: `${RANG.bas} 1 0px` }}>
          <CaseAccueil c={CASES.soin} subtitle="Post-partum" />
          {/* « Vivre la saison » : le sous-titre suit la saison en cours. */}
          <CaseAccueil c={CASES.saison} subtitle={SEASON_LABELS[saison]} />
        </div>
      </div>
    </section>
  );
}

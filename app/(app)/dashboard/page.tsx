import Link from "next/link";
import { getCurrentSeason, requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { AppMenu } from "@/components/ui/app-menu";
import { AideInstallationAccueil } from "@/components/ui/installer-app";

// Accueil à cases de tailles différentes (« B2 »), remis par Laura le 18/11/2026
// après comparaison avec la grille de 6 cases égales, avec deux ajouts : le relief
// (ombre douce sous les cases) et la Réflexologie en turquoise vert clair.
//   Sommeil & Endormissement (toute la largeur)
//   Guide-moi ! (case haute) | Gestes d'apaisement, puis Réflexologie plantaire
//   Prendre soin de moi | Vivre la saison
// Deux camaïeux : chaud (Guide-moi / Prendre soin de moi) pour Guide-moi, Prendre
// soin et Saison ; frais pour Apaisement (sauge), Réflexologie (turquoise vert) et
// Sommeil (bleu ciel, comme le rond du rythme). Chaque case porte deux auréoles,
// deux tons PLUS SOUTENUS de son camaïeu (jamais plus clairs, jamais de blanc),
// dans une direction propre à la case. Pas de picto, titres centrés en Playfair,
// sous-titre en capitales non grasses. Pas de saison en haut : elle est le
// sous-titre de « Vivre la saison ».

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
  apaisement: { href: "/apaisement", title: "Gestes d'apaisement", fond: "#E5EBDD", aureoles: ["#BECEA9", "#CCD7B9"], directions: ["100% 0%", "0% 100%"], sousTitre: "#435530" },
  // Turquoise vert éclairci (Laura, 18/11 : « un peu plus clair, un peu plus vert-bleu »).
  reflexo: { href: "/reflexologie", title: "Réflexologie plantaire", fond: "#D2E4DC", aureoles: ["#AFCBBF", "#C0D8CD"], directions: ["0% 100%", "100% 0%"], sousTitre: "#2F5A4A" },
  soin: { href: "/soin", title: "Prendre soin de moi", fond: "#EABDB1", aureoles: ["#DB9C86", "#E4A894"], directions: ["50% 125%", "50% -25%"], sousTitre: BRUN },
  saison: { href: "/saison", title: "Vivre la saison", fond: "#F8DBC9", aureoles: ["#E7B99F", "#EEC7B0"], directions: ["125% 50%", "-25% 50%"], sousTitre: BRUN },
} satisfies Record<string, Case>;

const SEASON_LABELS: Record<string, string> = {
  printemps: "Printemps",
  ete: "Été",
  automne: "Automne",
  hiver: "Hiver",
};

// Hauteurs de la maquette comparée par Laura (140 / 98 px ; Guide-moi = 2 petites
// cases + l'espace), un peu moins sur les petits écrans.
const H_GRANDE = "clamp(112px, 17dvh, 140px)";
const H_PETITE = "clamp(80px, 12dvh, 98px)";

function CaseAccueil({ c, subtitle, hauteur, grand = false }: { c: Case; subtitle: string; hauteur?: string; grand?: boolean }) {
  const [a, b] = c.aureoles;
  const [pa, pb] = c.directions;
  return (
    <Link
      prefetch
      href={c.href}
      className="flex h-full flex-col items-center justify-center gap-[7px] rounded-[24px] px-3 text-center transition-transform active:scale-[0.97]"
      style={{
        height: hauteur,
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

export default async function DashboardPage() {
  const [{ profile }, season] = await Promise.all([
    requireProfile(),
    getCurrentSeason(),
  ]);
  const babyMonth = getBabyMonth(new Date(profile.birthdate));
  const initiale = profile.baby_name.trim().charAt(0).toUpperCase();

  // pb : le tiers des boutons ronds de la barre du bas dépasse au-dessus.
  return (
    <section className="centre-vertical flex flex-1 flex-col justify-center gap-5 pb-[26px]">
      {/* Fond coloré de l'accueil, sur tout l'écran (derrière la barre du bas, translucide ici). */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ background: FOND_ACCUEIL }} />
      <AideInstallationAccueil />

      <header className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-[22px] font-semibold"
          style={{ background: CASES.guide.fond, color: BRUN }}
        >
          {initiale}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold" style={{ color: BRUN }}>Bonjour !</p>
          <h1 className="font-display text-2xl font-semibold leading-tight text-charcoal">
            {profile.baby_name}, {babyMonth} mois
          </h1>
        </div>
        <AppMenu />
      </header>

      <div className="flex flex-col gap-3">
        <CaseAccueil c={CASES.sommeil} subtitle="Rythme et rituels" hauteur={H_GRANDE} grand />
        <div className="grid grid-cols-2 gap-3">
          {/* Guide-moi prend la hauteur des deux cases de droite. */}
          <CaseAccueil c={CASES.guide} subtitle="Protocoles" grand />
          <div className="flex flex-col gap-3">
            <CaseAccueil c={CASES.apaisement} subtitle="Boîte à outils" hauteur={H_PETITE} />
            <CaseAccueil c={CASES.reflexo} subtitle="Apaiser bébé" hauteur={H_PETITE} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <CaseAccueil c={CASES.soin} subtitle="Post-partum" hauteur={H_PETITE} />
          {/* « Vivre la saison » : le sous-titre suit la saison en cours. */}
          <CaseAccueil c={CASES.saison} subtitle={SEASON_LABELS[season]} hauteur={H_PETITE} />
        </div>
      </div>
    </section>
  );
}

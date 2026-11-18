import Link from "next/link";
import { getCurrentSeason, requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { AppMenu } from "@/components/ui/app-menu";
import { AideInstallationAccueil } from "@/components/ui/installer-app";

// Accueil « B · une rangée apaiser bébé, avec relief », choisi par Laura le 18/11/2026
// (🔁 remplace la disposition B2 du même jour, jugée plus complexe à lire).
// 6 cases égales sur 2 colonnes, une rangée par thème :
//   Sommeil & Endormissement · Guide-moi !
//   Gestes d'apaisement · Réflexologie plantaire   (toujours côte à côte)
//   Prendre soin de moi · Vivre la saison
// Couleurs B2 : chaud (Guide-moi / Prendre soin de moi) pour Guide-moi, Prendre
// soin et Saison ; sauge pour Apaisement ; turquoise vert clair (gamme
// Réflexologie) pour Réflexologie ; bleu ciel pour Sommeil, comme le rond du rythme.
// Chaque case porte deux auréoles, deux tons PLUS SOUTENUS de son camaïeu (jamais
// plus clairs, jamais de blanc), dans une direction propre à sa place, et une
// ombre douce (relief). Pas de picto, titres centrés en Playfair, sous-titre en
// capitales non grasses. La saison n'est plus en haut : elle est le sous-titre de
// « Vivre la saison ».

const FOND_ACCUEIL = "#FAEEE9";
const TEXTE = "#3A3228";
const BRUN = "#8A4030"; // sous-titres des cases chaudes (labels de Prendre soin de moi)

type Case = {
  href: string;
  title: string;
  subtitle?: string;
  fond: string;
  /** Ton soutenu (auréole principale) puis ton intermédiaire (auréole secondaire). */
  aureoles: [string, string];
  /** Origine de chaque auréole, en position CSS : elle change avec la place de la case. */
  directions: [string, string];
  sousTitre: string;
};

// Dans l'ordre d'affichage, ligne par ligne.
const CASES: Case[] = [
  { href: "/coucher", title: "Sommeil & Endormissement", subtitle: "Rythme et rituels", fond: "#C6DAE8", aureoles: ["#A3C2D9", "#B9D2E6"], directions: ["0% 0%", "100% 100%"], sousTitre: "#285470" },
  { href: "/guide", title: "Guide-moi !", subtitle: "Protocoles", fond: "#F5D0C8", aureoles: ["#E3AFA0", "#EABDB1"], directions: ["100% 0%", "0% 100%"], sousTitre: BRUN },
  { href: "/apaisement", title: "Gestes d'apaisement", subtitle: "Boîte à outils", fond: "#E5EBDD", aureoles: ["#BECEA9", "#CCD7B9"], directions: ["100% 50%", "0% 50%"], sousTitre: "#435530" },
  // Turquoise vert éclairci (Laura, 18/11 : « un peu plus clair, un peu plus vert-bleu »).
  { href: "/reflexologie", title: "Réflexologie plantaire", subtitle: "Apaiser bébé", fond: "#D2E4DC", aureoles: ["#AFCBBF", "#C0D8CD"], directions: ["0% 50%", "100% 50%"], sousTitre: "#2F5A4A" },
  { href: "/soin", title: "Prendre soin de moi", subtitle: "Post-partum", fond: "#EABDB1", aureoles: ["#DB9C86", "#E4A894"], directions: ["0% 100%", "100% 0%"], sousTitre: BRUN },
  // Sans sous-titre fixe : il suit la saison en cours.
  { href: "/saison", title: "Vivre la saison", fond: "#F8DBC9", aureoles: ["#E7B99F", "#EEC7B0"], directions: ["100% 100%", "0% 0%"], sousTitre: BRUN },
];

const SEASON_LABELS: Record<string, string> = {
  printemps: "Printemps",
  ete: "Été",
  automne: "Automne",
  hiver: "Hiver",
};

function CaseAccueil({ c, subtitle }: { c: Case; subtitle: string }) {
  const [a, b] = c.aureoles;
  const [pa, pb] = c.directions;
  return (
    <Link
      prefetch
      href={c.href}
      // 130 px sur un téléphone courant, un peu moins sur les petits écrans.
      className="flex h-[clamp(104px,16dvh,130px)] flex-col items-center justify-center gap-[7px] rounded-[24px] px-3 text-center transition-transform active:scale-[0.97]"
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
        style={{ color: TEXTE, fontSize: 17, lineHeight: 1.15, letterSpacing: "-0.01em", textWrap: "balance" }}
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
          style={{ background: "#F5D0C8", color: BRUN }}
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

      <ul className="grid grid-cols-2 gap-3">
        {CASES.map((c) => (
          <li key={c.href}>
            <CaseAccueil c={c} subtitle={c.subtitle ?? SEASON_LABELS[season]} />
          </li>
        ))}
      </ul>
    </section>
  );
}

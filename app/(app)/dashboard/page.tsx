import Link from "next/link";
import { getCurrentSeason, requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { AppMenu } from "@/components/ui/app-menu";

// Couleurs conformes au SKILL_ui.md (section "Cases modules — validé").
// Ordre de la grille arrêté par Laura le 20/10/2026, ligne par ligne :
//   Préparer le coucher · Guide-moi !
//   Gestes d'apaisement · Prendre soin de moi
//   Réflexologie plantaire · Vivre la saison
// S.O.S n'est plus une case : il a son bouton rond dans la barre du bas.
const MODULES = [
  { href: "/coucher", title: "Préparer le coucher", subtitle: "Rituel du soir", bg: "#E4EEF0" },
  { href: "/guide", title: "Guide-moi !", subtitle: "Protocoles", bg: "#EDE0D4" },
  // Boîte à outils, contenu à construire (20/10). Sauge poudrée, entre le bleu
  // du coucher et le rose de « Prendre soin de moi ».
  { href: "/apaisement", title: "Gestes d'apaisement", subtitle: "Boîte à outils", bg: "#E5EBDD" },
  { href: "/soin", title: "Prendre soin\nde moi", subtitle: "Post-partum", bg: "#F5E4DE" },
  { href: "/reflexologie", title: "Réflexologie plantaire", subtitle: "Apaiser bébé", bg: "#EDE4D4" },
  { href: "/saison", title: "Vivre la saison", subtitle: "Adapté au mois", bg: "#DCE8E4" },
] as const;

const SEASON_LABELS: Record<string, string> = {
  printemps: "Printemps",
  ete: "Été",
  automne: "Automne",
  hiver: "Hiver",
};

export default async function DashboardPage() {
  const [{ profile }, season] = await Promise.all([
    requireProfile(),
    getCurrentSeason(),
  ]);
  const babyMonth = getBabyMonth(new Date(profile.birthdate));

  // pb-4 : le tiers des boutons ronds de la barre du bas dépasse au-dessus.
  return (
    <section className="space-y-5 pb-4">
      <header className="space-y-1">
        {/* Prénom et âge, et à droite le menu « 3 traits » des réglages (20/10). */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-charcoal">
            {profile.baby_name}, {babyMonth} mois
          </h1>
          <AppMenu />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-eucal">
          {SEASON_LABELS[season]}
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-3">
        {MODULES.map((m) => {
          // « Vivre la saison » : le sous-titre suit la saison en cours.
          const subtitle =
            m.href === "/saison" ? SEASON_LABELS[season] : m.subtitle;
          return (
            <li key={m.href}>
              <Link prefetch
                href={m.href}
                className="flex h-[130px] flex-col items-center justify-center gap-1.5 rounded-[14px] border border-black/[0.07] px-3 py-3 text-center transition-transform active:scale-[0.97]"
                style={{ backgroundColor: m.bg }}
              >
                <p
                  className="whitespace-pre-line font-display font-semibold leading-[1.15] text-charcoal"
                  style={{ fontSize: 17, letterSpacing: "-0.01em" }}
                >
                  {m.title}
                </p>
                <p
                  className="text-[9px] font-semibold uppercase text-eucal"
                  style={{ letterSpacing: "0.15em" }}
                >
                  {subtitle}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

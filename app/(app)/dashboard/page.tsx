import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth, getSeason } from "@/lib/utils";

// Couleurs conformes au SKILL_ui.md (section "Cases modules — validé")
const MODULES = [
  { href: "/guide", title: "Guide-moi !", subtitle: "Protocoles", bg: "#EDE0D4" },
  { href: "/coucher", title: "Préparer le coucher", subtitle: "Rituel du soir", bg: "#E4EEF0" },
  { href: "/soin", title: "Prendre soin de moi", subtitle: "Gestes parentaux", bg: "#F5E4DE" },
  { href: "/saison", title: "Conseil de saison", subtitle: "Adapté au mois", bg: "#DCE8E4" },
  { href: "/audio", title: "Partager & rassurer", subtitle: "Scripts audio", bg: "#E8EEF2" },
  { href: "/jeux", title: "Jeux & stimulation", subtitle: "Activités du mois", bg: "#EDE4D4" },
] as const;

const SEASON_LABELS: Record<string, string> = {
  printemps: "Printemps",
  ete: "Été",
  automne: "Automne",
  hiver: "Hiver",
};

export default async function DashboardPage() {
  const { profile } = await requireProfile();
  const babyMonth = getBabyMonth(new Date(profile.birthdate));
  const season = getSeason(new Date());

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <p className="text-sm text-eucal">Bonjour 👋</p>
        <h1 className="font-display text-2xl font-semibold text-charcoal">
          {profile.baby_name}, {babyMonth} mois
        </h1>
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-eucal">
          {SEASON_LABELS[season]}
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-3">
        {MODULES.map((m) => (
          <li key={m.href}>
            <Link
              href={m.href}
              className="flex h-[130px] flex-col items-center justify-center gap-1.5 rounded-[14px] border border-black/[0.07] px-3 py-3 text-center transition-transform active:scale-[0.97]"
              style={{ backgroundColor: m.bg }}
            >
              <p
                className="font-display font-semibold leading-[1.15] text-charcoal"
                style={{ fontSize: 17, letterSpacing: "-0.01em" }}
              >
                {m.title}
              </p>
              <p
                className="text-[9px] font-semibold uppercase text-eucal"
                style={{ letterSpacing: "0.15em" }}
              >
                {m.subtitle}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

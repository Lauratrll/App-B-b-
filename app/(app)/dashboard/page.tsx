import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth, getSeason } from "@/lib/utils";

const MODULES = [
  {
    href: "/guide",
    title: "Guide-​moi !",
    subtitle: "Protocoles",
    bg: "#F1E2CF",
    text: "#5C4636",
  },
  {
    href: "/coucher",
    title: "Préparer le coucher",
    subtitle: "Rituel du soir",
    bg: "#D9E4E8",
    text: "#3D4E58",
  },
  {
    href: "/soin",
    title: "Prendre soin de moi",
    subtitle: "Gestes parentaux",
    bg: "#F0D6CE",
    text: "#6E3F3F",
  },
  {
    href: "/saison",
    title: "Conseil de saison",
    subtitle: "Adapté au mois",
    bg: "#D5E2CE",
    text: "#3F5639",
  },
  {
    href: "/audio",
    title: "Partager & rassurer",
    subtitle: "Scripts audio",
    bg: "#D5D8E8",
    text: "#3F4366",
  },
  {
    href: "/jeux",
    title: "Jeux & stimulation",
    subtitle: "Activités du mois",
    bg: "#E9DBC4",
    text: "#5C4936",
  },
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
        <p className="text-sm text-neutral-500">Bonjour 👋</p>
        <h1 className="font-serif text-2xl font-semibold">
          {profile.baby_name}, {babyMonth} mois
        </h1>
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          {SEASON_LABELS[season]}
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-3">
        {MODULES.map((m) => (
          <li key={m.href}>
            <Link
              href={m.href}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center transition-transform active:scale-95"
              style={{ backgroundColor: m.bg, color: m.text }}
            >
              <p className="font-serif text-lg font-semibold leading-tight">
                {m.title}
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] opacity-70">
                {m.subtitle}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

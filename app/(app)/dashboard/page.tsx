import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth, getSeason } from "@/lib/utils";

const MODULES = [
  { href: "/guide", emoji: "🧭", title: "Guide-moi !", desc: "32 protocoles différenciés" },
  { href: "/soin", emoji: "🌸", title: "Prends soin de toi", desc: "6 gestes parentaux" },
  { href: "/saison", emoji: "🌿", title: "Conseil de saison", desc: "2 conseils adaptés" },
  { href: "/coucher", emoji: "🌙", title: "Préparer le coucher", desc: "Rituel personnalisé" },
  { href: "/audio", emoji: "💜", title: "Partager & rassurer", desc: "Scripts audio" },
  { href: "/jeux", emoji: "🎯", title: "Jeux & stimulation", desc: "Activités adaptées" },
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
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm text-neutral-500">Bonjour 👋</p>
        <h1 className="text-2xl font-semibold">
          {profile.baby_name}, {babyMonth} mois
        </h1>
        <p className="text-sm text-neutral-600">{SEASON_LABELS[season]}</p>
      </header>

      <ul className="grid gap-3">
        {MODULES.map((m) => (
          <li key={m.href}>
            <Link
              href={m.href}
              className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-4"
            >
              <span aria-hidden className="text-2xl">
                {m.emoji}
              </span>
              <div className="flex-1">
                <p className="font-medium">{m.title}</p>
                <p className="text-xs text-neutral-500">{m.desc}</p>
              </div>
              <span aria-hidden className="text-neutral-400">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

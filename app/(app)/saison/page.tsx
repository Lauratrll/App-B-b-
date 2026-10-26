import Link from "next/link";
import { requireProfile, isCurrentUserAdmin } from "@/lib/auth";
import { getBabyMonth, getSeason } from "@/lib/utils";
import { getSaisonMeta, getSaisonVersion, type SaisonKey } from "@/lib/content";
import { SaisonView } from "@/components/modules/saison-view";

const SAISONS: { key: SaisonKey; emoji: string; label: string }[] = [
  { key: "printemps", emoji: "🌱", label: "Printemps" },
  { key: "ete", emoji: "☀️", label: "Été" },
  { key: "automne", emoji: "🍂", label: "Automne" },
  { key: "hiver", emoji: "❄️", label: "Hiver" },
];

export default async function SaisonPage({
  searchParams,
}: {
  searchParams: { s?: string };
}) {
  const [{ profile }, isAdmin] = await Promise.all([
    requireProfile(),
    isCurrentUserAdmin(),
  ]);
  const mois = getBabyMonth(new Date(profile.birthdate));
  const saisonCourante = getSeason(new Date());
  // Parents : toujours la saison du moment (le paramètre ?s= est ignoré).
  // Admins : les 4 saisons au choix, pour relire tous les contenus.
  const saisonChoisie = isAdmin
    ? SAISONS.find((s) => s.key === searchParams.s)?.key ?? saisonCourante
    : saisonCourante;
  // Libellé affiché dans le titre : « Vivre la saison — Printemps/Été/… ».
  const saisonLabel =
    SAISONS.find((s) => s.key === saisonChoisie)?.label ?? "";

  const meta = await getSaisonMeta(mois);
  const version = await getSaisonVersion(mois, saisonChoisie);

  if (!meta || !version) {
    return (
      <section className="space-y-5">
        <header className="space-y-1">
          <p className="text-2xl" aria-hidden>🌿</p>
          <h1 className="text-2xl font-semibold">Vivre la saison&nbsp;: {saisonLabel}</h1>
        </header>
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Le conseil de saison du mois {mois} n&apos;est pas encore disponible.
          Mois disponibles : 0, 3, 6 et 9.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <p className="text-2xl" aria-hidden>🌿</p>
        <h1 className="text-2xl font-semibold leading-tight">
          Vivre la saison&nbsp;: {saisonLabel}
        </h1>
        {meta.sous_titre ? (
          <p className="text-sm text-neutral-600">{meta.sous_titre}</p>
        ) : null}
      </header>

      {isAdmin ? (
      <nav className="grid grid-cols-4 gap-2">
        {SAISONS.map((s) => {
          const isActive = s.key === saisonChoisie;
          return (
            <Link prefetch
              key={s.key}
              href={`/saison?s=${s.key}`}
              className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-[10px] ${
                isActive
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-600"
              }`}
            >
              <span aria-hidden className="text-lg">
                {s.emoji}
              </span>
              <span>{s.label}</span>
            </Link>
          );
        })}
      </nav>
      ) : null}

      {isAdmin && saisonChoisie !== saisonCourante ? (
        <p className="rounded-xl bg-neutral-50 p-3 text-xs italic text-neutral-600">
          Aperçu admin : ce n&apos;est pas la saison du moment. Les parents ne
          voient que la saison en cours.
        </p>
      ) : null}

      <SaisonView version={version} />
    </section>
  );
}

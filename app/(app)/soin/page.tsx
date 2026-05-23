import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getSoinConseils, getSoinMeta } from "@/lib/content";

export default async function SoinPage() {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const meta = await getSoinMeta(mois);
  const conseils = await getSoinConseils(mois);

  if (conseils.length === 0) {
    return (
      <section className="space-y-5">
        <header className="space-y-1">
          <p className="text-2xl" aria-hidden>🌸</p>
          <h1 className="text-2xl font-semibold">Prends soin de toi</h1>
        </header>
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Les conseils du mois {mois} ne sont pas encore disponibles.
          Mois disponibles : 0, 3, 6, 9 et 14.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <p className="text-2xl" aria-hidden>🌸</p>
        <h1 className="text-2xl font-semibold leading-tight">
          {meta?.titre_rubrique ?? "Prends soin de toi"}
        </h1>
        {meta?.sous_titre ? (
          <p className="text-sm text-neutral-600">{meta.sous_titre}</p>
        ) : null}
      </header>

      {meta?.description ? (
        <p className="text-sm leading-relaxed text-neutral-700">
          {meta.description}
        </p>
      ) : null}

      <ul className="grid gap-3">
        {conseils.map((c) => (
          <li key={c.id}>
            <Link
              href={`/soin/${c.id}`}
              className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
            >
              {c.icone ? (
                <span aria-hidden className="text-2xl">
                  {c.icone}
                </span>
              ) : null}
              <div className="flex-1">
                <p className="font-medium leading-tight">{c.titre}</p>
                {c.sous_titre ? (
                  <p className="text-xs text-neutral-500">{c.sous_titre}</p>
                ) : null}
              </div>
              <span aria-hidden className="text-neutral-400">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getJeuxActivite } from "@/lib/content";

export default async function ActivitePage({
  params,
}: {
  params: { id: string };
}) {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const activite = await getJeuxActivite(mois, params.id);
  if (!activite) notFound();

  return (
    <section className="space-y-5">
      <Link
        href="/jeux"
        className="inline-flex items-center gap-1 text-xs text-neutral-500"
      >
        ← Toutes les activités
      </Link>

      <article className="space-y-5">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold leading-tight">
            {activite.titre}
          </h1>
          <div className="flex flex-wrap gap-1.5 text-xs text-neutral-500">
            {activite.duree ? <span>⏱ {activite.duree}</span> : null}
            {activite.frequence ? (
              <>
                <span>·</span>
                <span>{activite.frequence}</span>
              </>
            ) : null}
          </div>
          {activite.developpe && activite.developpe.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activite.developpe.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-medium text-amber-900"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {activite.description ? (
          <p className="text-sm leading-relaxed text-neutral-700">
            {activite.description}
          </p>
        ) : null}

        {activite.materiel && activite.materiel.length > 0 ? (
          <section className="space-y-2 rounded-2xl bg-neutral-50 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
              Matériel
            </h2>
            <ul className="space-y-1 text-sm leading-relaxed text-neutral-800">
              {activite.materiel.map((m, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden>·</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {activite.comment_jouer && activite.comment_jouer.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Comment jouer
            </h2>
            <ol className="space-y-2">
              {activite.comment_jouer.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-2xl border border-neutral-200 p-3"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-neutral-800">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </article>
    </section>
  );
}

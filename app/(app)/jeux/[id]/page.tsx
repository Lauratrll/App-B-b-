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

  const titre = activite.titre ?? activite.nom ?? "Activité";
  const etapes = activite.comment_jouer ?? activite.comment_faire ?? [];

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
          <h1 className="text-2xl font-semibold leading-tight">{titre}</h1>
          <div className="flex flex-wrap gap-1.5 text-xs text-neutral-500">
            {activite.duree ? <span>⏱ {activite.duree}</span> : null}
            {activite.frequence ? (
              <>
                {activite.duree ? <span>·</span> : null}
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

        {/* Pourquoi (mois 0) */}
        {typeof activite.pourquoi === "string" ? (
          <section className="space-y-2 rounded-2xl bg-amber-50 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-900">
              Pourquoi
            </h2>
            <p className="text-sm leading-relaxed text-amber-950">
              {activite.pourquoi}
            </p>
          </section>
        ) : null}

        {/* Description (standard) */}
        {typeof activite.description === "string" ? (
          <p className="text-sm leading-relaxed text-neutral-700">
            {activite.description}
          </p>
        ) : null}

        {/* Matériel */}
        {Array.isArray(activite.materiel) && activite.materiel.length > 0 ? (
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

        {/* Étapes (comment_jouer ou comment_faire) */}
        {etapes.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Comment faire
            </h2>
            <ol className="space-y-2">
              {etapes.map((step, i) => (
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

        {/* Zones spéciales (mois 0 — massage bébé) */}
        {Array.isArray(activite.zones_speciales) &&
        activite.zones_speciales.length > 0 ? (
          <section className="space-y-2 rounded-2xl bg-emerald-50 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
              Zones spéciales
            </h2>
            <ul className="space-y-1.5 text-sm leading-relaxed text-emerald-950">
              {activite.zones_speciales.map((z, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden>·</span>
                  <span>{z}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Pour le co-parent (mois 0) */}
        {typeof activite.pour_le_co_parent === "string" ? (
          <section className="space-y-2 rounded-2xl bg-sky-50 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-sky-900">
              Pour le co-parent
            </h2>
            <p className="text-sm leading-relaxed text-sky-950">
              {activite.pour_le_co_parent}
            </p>
          </section>
        ) : null}

        {/* Variante */}
        {typeof activite.variante === "string" ? (
          <section className="space-y-2 rounded-xl bg-neutral-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
              Variante
            </h3>
            <p className="text-sm leading-relaxed text-neutral-800">
              {activite.variante}
            </p>
          </section>
        ) : null}

        {/* Ce qui marche le mieux */}
        {typeof activite.ce_qui_marche_le_mieux === "string" ? (
          <section className="space-y-2 rounded-xl bg-neutral-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
              Ce qui marche le mieux
            </h3>
            <p className="text-sm leading-relaxed text-neutral-800">
              {activite.ce_qui_marche_le_mieux}
            </p>
          </section>
        ) : null}

        {/* Alternative s'il déteste */}
        {typeof activite.alternative_si_il_deteste === "string" ? (
          <section className="space-y-2 rounded-xl bg-neutral-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
              Alternative s&apos;il n&apos;aime pas
            </h3>
            <p className="text-sm leading-relaxed text-neutral-800">
              {activite.alternative_si_il_deteste}
            </p>
          </section>
        ) : null}

        {/* Principe Pikler (mois 0 — motricité libre) */}
        {typeof activite.principe_pikler === "string" ? (
          <section className="space-y-2 rounded-xl bg-amber-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-900">
              Principe Pikler
            </h3>
            <p className="text-sm italic leading-relaxed text-amber-950">
              {activite.principe_pikler}
            </p>
          </section>
        ) : null}
      </article>
    </section>
  );
}

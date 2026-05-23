import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getJeuxActivites, getJeuxMeta } from "@/lib/content";

export default async function JeuxPage() {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const meta = await getJeuxMeta(mois);
  const activites = await getJeuxActivites(mois);

  if (!meta || activites.length === 0) {
    return (
      <section className="space-y-5">
        <header className="space-y-1">
          <p className="text-2xl" aria-hidden>🎯</p>
          <h1 className="text-2xl font-semibold">Jeux &amp; stimulation</h1>
        </header>
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Les jeux du mois {mois} ne sont pas encore disponibles.
          Mois disponibles : 3, 6, 9 et 14.
        </p>
      </section>
    );
  }

  return (
    <article className="space-y-6 pb-4">
      <header className="space-y-1">
        <p className="text-2xl" aria-hidden>🎯</p>
        <h1 className="text-2xl font-semibold leading-tight">
          {meta.titre_rubrique ?? "Jeux & stimulation"}
        </h1>
        {meta.sous_titre ? (
          <p className="text-sm text-neutral-600">{meta.sous_titre}</p>
        ) : null}
      </header>

      {meta.adjectif_du_mois ? (
        <section className="space-y-2 rounded-2xl bg-amber-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
            Le mois de l&apos;{meta.adjectif_du_mois.toLowerCase()}
          </p>
          {meta.qualification_du_mois ? (
            <p className="text-sm leading-relaxed text-amber-950">
              {meta.qualification_du_mois}
            </p>
          ) : null}
        </section>
      ) : null}

      {meta.principes_cles && meta.principes_cles.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Principes clés
          </h2>
          <ul className="space-y-1.5 text-sm leading-relaxed text-neutral-800">
            {meta.principes_cles.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="text-neutral-400">·</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Activités du mois
        </h2>
        <ul className="grid gap-3">
          {activites.map((a) => (
            <li key={a.id}>
              <Link
                href={`/jeux/${a.id}`}
                className="block rounded-2xl border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
              >
                <p className="font-medium leading-tight">{a.titre}</p>
                <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-neutral-500">
                  {a.duree ? <span>{a.duree}</span> : null}
                  {a.developpe && a.developpe.length > 0 ? (
                    <>
                      <span>·</span>
                      <span>{a.developpe.join(", ")}</span>
                    </>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {meta.geste_reflexo_du_mois ? (
        <section className="space-y-3 rounded-2xl bg-emerald-50 p-5">
          <header className="space-y-1">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">
              Geste réflexo du mois — {meta.geste_reflexo_du_mois.titre}
            </h2>
            <p className="text-xs text-emerald-800">
              {[
                meta.geste_reflexo_du_mois.duree,
                meta.geste_reflexo_du_mois.moment,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </header>
          {meta.geste_reflexo_du_mois.intro ? (
            <p className="text-sm leading-relaxed text-emerald-950">
              {meta.geste_reflexo_du_mois.intro}
            </p>
          ) : null}
          <ol className="space-y-1.5 text-sm leading-relaxed text-emerald-950">
            {meta.geste_reflexo_du_mois.etapes.map((e, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-semibold">{i + 1}.</span>
                <span>{e}</span>
              </li>
            ))}
          </ol>
          {meta.geste_reflexo_du_mois.ce_que_ca_fait ? (
            <p className="rounded-xl bg-white p-3 text-xs italic leading-relaxed text-emerald-900">
              {meta.geste_reflexo_du_mois.ce_que_ca_fait}
            </p>
          ) : null}
        </section>
      ) : null}

      {meta.rythme_journee_type ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            {meta.rythme_journee_type.titre ?? "Rythme d'une journée type"}
          </h2>
          {meta.rythme_journee_type.intro ? (
            <p className="text-xs italic text-neutral-500">
              {meta.rythme_journee_type.intro}
            </p>
          ) : null}
          <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 overflow-hidden">
            {meta.rythme_journee_type.creneaux.map((c, i) => (
              <li key={i} className="flex gap-3 p-3 text-sm">
                <span className="w-20 shrink-0 font-mono text-xs text-neutral-500">
                  {c.horaire}
                </span>
                <span className="flex-1 text-neutral-800">{c.activite}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

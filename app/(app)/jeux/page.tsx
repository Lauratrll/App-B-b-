import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import {
  getJeuxActivites,
  getJeuxMeta,
  type ActiviteListItem,
} from "@/lib/content";

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
        </p>
      </section>
    );
  }

  const socles = activites.filter((a) => a.type === "socle");
  const complementaires = activites.filter((a) => a.type === "complementaire");
  const standards = activites.filter((a) => a.type === "standard");

  // Fallbacks entre les deux structures
  const gesteReflexo = meta.geste_reflexo_du_mois ?? null;
  const gesteReflexoMois0 = meta.geste_reflexologie_du_mois ?? null;
  const rythme = meta.rythme_journee_type ?? null;
  const rythmeMois0 = meta.rythme_d_une_journee_d_eveil_type ?? null;

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

      {meta.description ? (
        <p className="text-sm leading-relaxed text-neutral-700">
          {meta.description}
        </p>
      ) : null}

      {/* Header du mois — variantes */}
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
      ) : meta.ancrage ? (
        <blockquote className="rounded-2xl border-l-4 border-amber-300 bg-amber-50 p-4 text-sm italic leading-relaxed text-amber-900">
          {meta.ancrage}
        </blockquote>
      ) : null}

      {/* Principes — variantes */}
      {meta.principes_fondamentaux && meta.principes_fondamentaux.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Principes fondamentaux
          </h2>
          <ul className="space-y-2">
            {meta.principes_fondamentaux.map((p, i) => (
              <li
                key={i}
                className="rounded-2xl border border-neutral-200 p-4"
              >
                <p className="font-medium leading-tight">{p.titre}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                  {p.texte}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : meta.principes_cles && meta.principes_cles.length > 0 ? (
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

      {/* Fenêtre éveil calme (mois 0) */}
      {meta.reperer_phase_eveil_calme ? (
        <section className="space-y-3 rounded-2xl bg-sky-50 p-5">
          <header className="space-y-1">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-900">
              {meta.reperer_phase_eveil_calme.titre}
            </h2>
            {meta.reperer_phase_eveil_calme.intro ? (
              <p className="text-xs italic text-sky-800">
                {meta.reperer_phase_eveil_calme.intro}
              </p>
            ) : null}
          </header>
          {meta.reperer_phase_eveil_calme.signes_phase_propice &&
          meta.reperer_phase_eveil_calme.signes_phase_propice.length > 0 ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-sky-900">
                ✓ Bébé est dans la bonne phase
              </p>
              <ul className="space-y-1 text-sm leading-relaxed text-sky-950">
                {meta.reperer_phase_eveil_calme.signes_phase_propice.map(
                  (s, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden>·</span>
                      <span>{s}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ) : null}
          {meta.reperer_phase_eveil_calme.signes_phase_a_eviter &&
          meta.reperer_phase_eveil_calme.signes_phase_a_eviter.length > 0 ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-sky-900">
                ✗ À éviter (signaux de fatigue/surcharge)
              </p>
              <ul className="space-y-1 text-sm leading-relaxed text-sky-950">
                {meta.reperer_phase_eveil_calme.signes_phase_a_eviter.map(
                  (s, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden>·</span>
                      <span>{s}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ) : null}
          {meta.reperer_phase_eveil_calme.duree_eveil_max ? (
            <p className="rounded-xl bg-white p-3 text-xs italic leading-relaxed text-sky-900">
              {meta.reperer_phase_eveil_calme.duree_eveil_max}
            </p>
          ) : null}
        </section>
      ) : null}

      {/* Activités */}
      <ActivitesSection
        titre="Activités du mois"
        items={standards}
      />
      <ActivitesSection
        titre="Activités-socle"
        items={socles}
      />
      <ActivitesSection
        titre="Activités complémentaires"
        items={complementaires}
      />

      {/* Geste réflexo — variantes */}
      {gesteReflexo ? (
        <section className="space-y-3 rounded-2xl bg-emerald-50 p-5">
          <header className="space-y-1">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">
              Geste réflexo du mois — {gesteReflexo.titre}
            </h2>
            <p className="text-xs text-emerald-800">
              {[gesteReflexo.duree, gesteReflexo.moment]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </header>
          {gesteReflexo.intro ? (
            <p className="text-sm leading-relaxed text-emerald-950">
              {gesteReflexo.intro}
            </p>
          ) : null}
          <ol className="space-y-1.5 text-sm leading-relaxed text-emerald-950">
            {gesteReflexo.etapes.map((e, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-semibold">{i + 1}.</span>
                <span>{e}</span>
              </li>
            ))}
          </ol>
          {gesteReflexo.ce_que_ca_fait ? (
            <p className="rounded-xl bg-white p-3 text-xs italic leading-relaxed text-emerald-900">
              {gesteReflexo.ce_que_ca_fait}
            </p>
          ) : null}
        </section>
      ) : gesteReflexoMois0 ? (
        <section className="space-y-3 rounded-2xl bg-emerald-50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">
            {gesteReflexoMois0.titre}
          </h2>
          {gesteReflexoMois0.intro ? (
            <p className="text-sm leading-relaxed text-emerald-950">
              {gesteReflexoMois0.intro}
            </p>
          ) : null}
          <ol className="space-y-1.5 text-sm leading-relaxed text-emerald-950">
            {gesteReflexoMois0.comment_faire.map((e, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-semibold">{i + 1}.</span>
                <span>{e}</span>
              </li>
            ))}
          </ol>
          {gesteReflexoMois0.ce_qu_il_fait ? (
            <p className="rounded-xl bg-white p-3 text-xs italic leading-relaxed text-emerald-900">
              {gesteReflexoMois0.ce_qu_il_fait}
            </p>
          ) : null}
        </section>
      ) : null}

      {/* Rythme journée — variantes */}
      {rythme ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            {rythme.titre ?? "Rythme d'une journée type"}
          </h2>
          {rythme.intro ? (
            <p className="text-xs italic text-neutral-500">{rythme.intro}</p>
          ) : null}
          <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 overflow-hidden">
            {rythme.creneaux.map((c, i) => (
              <li key={i} className="flex gap-3 p-3 text-sm">
                <span className="w-20 shrink-0 font-mono text-xs text-neutral-500">
                  {c.horaire}
                </span>
                <span className="flex-1 text-neutral-800">{c.activite}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : rythmeMois0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            {rythmeMois0.titre}
          </h2>
          {rythmeMois0.intro ? (
            <p className="text-xs italic text-neutral-500">
              {rythmeMois0.intro}
            </p>
          ) : null}
          <ul className="space-y-1.5 rounded-2xl border border-neutral-200 p-4 text-sm leading-relaxed text-neutral-800">
            {rythmeMois0.exemple.map((e, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="text-neutral-400">·</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Ce qui n'est pas recommandé (mois 0) */}
      {meta.ce_qui_n_est_pas_recommande_a_cet_age ? (
        <section className="space-y-3 rounded-2xl bg-red-50 p-5">
          <header className="space-y-1">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-red-900">
              {meta.ce_qui_n_est_pas_recommande_a_cet_age.titre}
            </h2>
            {meta.ce_qui_n_est_pas_recommande_a_cet_age.intro ? (
              <p className="text-xs italic text-red-800">
                {meta.ce_qui_n_est_pas_recommande_a_cet_age.intro}
              </p>
            ) : null}
          </header>
          <ul className="space-y-3">
            {meta.ce_qui_n_est_pas_recommande_a_cet_age.elements.map(
              (el, i) => (
                <li key={i} className="rounded-xl bg-white p-3 text-sm">
                  <p className="font-medium text-red-900">✗ {el.element}</p>
                  <p className="mt-1 text-neutral-700">{el.raison}</p>
                  {el.alternative ? (
                    <p className="mt-1 text-xs italic text-emerald-700">
                      → Alternative : {el.alternative}
                    </p>
                  ) : null}
                </li>
              ),
            )}
          </ul>
        </section>
      ) : null}

      {/* Erreurs à éviter (uniquement mois 0 dans jeux) */}
      {meta.erreurs_a_eviter && meta.erreurs_a_eviter.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Erreurs à éviter
          </h2>
          <ul className="space-y-2 text-sm leading-relaxed text-neutral-800">
            {meta.erreurs_a_eviter.map((e, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="text-red-500">✗</span>
                {typeof e === "string" ? (
                  <span>{e}</span>
                ) : (
                  <span>
                    <strong>{e.erreur}</strong>
                    <span className="text-neutral-600"> — {e.consequence}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Phrases d'ancrage (mois 0) */}
      {meta.phrases_ancrage && meta.phrases_ancrage.length > 0 ? (
        <section className="space-y-2 rounded-2xl bg-violet-50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-900">
            À se rappeler
          </h2>
          <ul className="space-y-2 text-sm italic leading-relaxed text-violet-950">
            {meta.phrases_ancrage.map((p, i) => (
              <li key={i}>&laquo; {p} &raquo;</li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Consulter si (mois 0 dans jeux) */}
      {meta.consulter_si ? (
        <section className="space-y-2 rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-red-900">
            ⚠ Cadre de sécurité — consulter si
          </h2>
          <p className="text-sm leading-relaxed text-red-950">
            {meta.consulter_si}
          </p>
        </section>
      ) : null}
    </article>
  );
}

function ActivitesSection({
  titre,
  items,
}: {
  titre: string;
  items: ActiviteListItem[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {titre}
      </h2>
      <ul className="grid gap-3">
        {items.map((a) => (
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
  );
}

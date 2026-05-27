import type { SaisonVersion } from "@/lib/content";

function ListSection({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  if (!items || items.length === 0) return null;
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h3>
      <ul className="space-y-1.5 text-sm leading-relaxed text-neutral-800">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="text-neutral-400">·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SaisonView({ version }: { version: SaisonVersion }) {
  const fond = version.couleur_theme ?? "#F5F5F4";
  const accent = version.couleur_accent ?? "#525252";

  return (
    <article className="space-y-6">
      <header
        className="space-y-2 rounded-3xl p-6"
        style={{ backgroundColor: fond, color: accent }}
      >
        <p className="text-4xl" aria-hidden>
          {version.emoji}
        </p>
        {version.titre ? (
          <h2 className="text-2xl font-semibold leading-tight">
            {version.titre}
          </h2>
        ) : null}
        {version.ambiance ? (
          <p className="text-sm font-medium">{version.ambiance}</p>
        ) : null}
        {version.ancrage ? (
          <p className="mt-3 text-sm leading-relaxed">{version.ancrage}</p>
        ) : null}
      </header>

      {/* Nouveau schéma : à savoir cette saison */}
      {version.a_savoir_cette_saison ? (
        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            À savoir cette saison
          </h3>
          <p className="rounded-2xl bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-800">
            {version.a_savoir_cette_saison}
          </p>
        </section>
      ) : null}

      {/* Nouveau schéma : idées du moment */}
      {version.idees_du_moment && version.idees_du_moment.length > 0 ? (
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Idées du moment
          </h3>
          <ul className="space-y-3">
            {version.idees_du_moment.map((idee, i) => (
              <li
                key={i}
                className="space-y-2 rounded-2xl border border-neutral-200 p-4"
              >
                <p className="font-medium leading-tight text-neutral-900">
                  {idee.titre}
                </p>
                {/* Nouveau schéma : un seul champ "texte" */}
                {idee.texte ? (
                  <p className="text-sm leading-relaxed text-neutral-700">
                    {idee.texte}
                  </p>
                ) : null}
                {/* Fallback anciens champs */}
                {!idee.texte && idee.ce_que_ca_apporte ? (
                  <p className="text-sm leading-relaxed text-neutral-700">
                    <span className="font-medium">Ce que ça apporte —</span>{" "}
                    {idee.ce_que_ca_apporte}
                  </p>
                ) : null}
                {!idee.texte && idee.comment ? (
                  <p className="text-sm italic leading-relaxed text-neutral-600">
                    <span className="font-medium not-italic">Comment —</span>{" "}
                    {idee.comment}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {version.principes && version.principes.length > 0 ? (
        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Principes du mois
          </h3>
          <ul className="space-y-2 text-sm leading-relaxed text-neutral-800">
            {version.principes.map((p, i) => (
              <li key={i} className="rounded-xl border border-neutral-200 p-3">
                {p}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {version.habillage ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Habillage
          </h3>
          {version.habillage.principe ? (
            <p className="rounded-xl bg-neutral-50 p-3 text-sm italic leading-relaxed text-neutral-700">
              {version.habillage.principe}
            </p>
          ) : null}
          {version.habillage.guide_temperature &&
          version.habillage.guide_temperature.length > 0 ? (
            <ul className="space-y-2">
              {version.habillage.guide_temperature.map((t, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-neutral-200 p-3"
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: accent }}
                  >
                    {t.temperature}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-800">
                    {t.tenue}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {version.sorties ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Sorties
          </h3>
          {version.sorties.frequence_conseillee ? (
            <p className="rounded-xl bg-neutral-50 p-3 text-sm text-neutral-700">
              <strong>Fréquence :</strong>{" "}
              {version.sorties.frequence_conseillee}
            </p>
          ) : null}
          <ListSection
            title="Moments idéaux"
            items={version.sorties.moments_ideaux}
          />
          <ListSection
            title="Lieux recommandés"
            items={version.sorties.lieux_recommandes}
          />
          <ListSection
            title="Équipement"
            items={version.sorties.equipement}
          />
        </section>
      ) : null}

      {version.diversification_de_saison ? (
        <section className="space-y-3 rounded-2xl bg-lime-50 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-lime-900">
            {version.diversification_de_saison.titre ?? "Diversification"}
          </h3>
          {version.diversification_de_saison.intro ? (
            <p className="text-sm leading-relaxed text-lime-950">
              {version.diversification_de_saison.intro}
            </p>
          ) : null}
          <ListSection
            title="Légumes prioritaires"
            items={version.diversification_de_saison.legumes_prioritaires}
          />
          <ListSection
            title="Fruits prioritaires"
            items={version.diversification_de_saison.fruits_prioritaires}
          />
          {version.diversification_de_saison.vigilance_allergies ? (
            <p className="rounded-xl bg-white p-3 text-xs italic leading-relaxed text-lime-900">
              ⚠ {version.diversification_de_saison.vigilance_allergies}
            </p>
          ) : null}
        </section>
      ) : null}

      {version.particularites_sante ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Santé du mois
          </h3>
          <ListSection
            title="Points de vigilance"
            items={version.particularites_sante.vigilance as string[] | undefined}
          />
          <ListSection
            title="Signes pour consulter"
            items={
              version.particularites_sante.signes_consultation as
                | string[]
                | undefined
            }
          />
          {version.particularites_sante.vitamine_d ? (
            <p className="rounded-xl bg-yellow-50 p-3 text-sm leading-relaxed text-yellow-900">
              <strong>Vitamine D :</strong>{" "}
              {String(version.particularites_sante.vitamine_d)}
            </p>
          ) : null}
        </section>
      ) : null}

      {version.alimentation_maman ? (
        <section className="space-y-2 rounded-2xl bg-rose-50 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-rose-900">
            {version.alimentation_maman.titre ??
              "Soutenir le post-partum cette saison"}
          </h3>
          <ul className="space-y-1.5 text-sm leading-relaxed text-rose-950">
            {(version.alimentation_maman.elements ?? []).map((e, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden>·</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

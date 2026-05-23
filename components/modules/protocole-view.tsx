import type { ProtocoleGuide, BlocActionne } from "@/lib/content";

function BlocColore({ bloc }: { bloc: BlocActionne }) {
  return (
    <section
      className="space-y-3 rounded-2xl p-5"
      style={{ backgroundColor: bloc.couleur_fond, color: bloc.couleur_texte }}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide">
        {bloc.titre}
      </h2>
      <ol className="space-y-2 text-sm leading-relaxed">
        {bloc.etapes.map((etape, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
              style={{
                backgroundColor: bloc.couleur_texte,
                color: bloc.couleur_fond,
              }}
            >
              {i + 1}
            </span>
            <span>{etape}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ProtocoleView({ protocole }: { protocole: ProtocoleGuide }) {
  return (
    <article className="space-y-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold leading-tight">
          {protocole.titre}
        </h1>
        {protocole.situation && protocole.situation !== protocole.titre ? (
          <p className="text-sm italic text-neutral-500">
            {protocole.situation}
          </p>
        ) : null}
      </header>

      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Ce qui se passe
        </h2>
        <p className="text-sm leading-relaxed text-neutral-800">
          {protocole.explication}
        </p>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Pour toi, parent
        </h2>
        <p className="text-sm leading-relaxed text-neutral-800">
          {protocole.ancrage}
        </p>
      </section>

      <BlocColore bloc={protocole.action_immediate} />
      <BlocColore bloc={protocole.geste_doux} />

      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Pour aller plus loin
        </h2>
        <ul className="space-y-1.5 text-sm leading-relaxed text-neutral-800">
          {protocole.pour_aller_plus_loin.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden className="text-neutral-400">
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 rounded-2xl bg-amber-50 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-900">
          Le principe à retenir
        </h2>
        <p className="text-sm leading-relaxed text-amber-950">
          {protocole.principe}
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Erreurs à éviter
        </h2>
        <ul className="space-y-2 text-sm leading-relaxed text-neutral-800">
          {protocole.erreurs_a_eviter.map((err, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden className="text-red-500">
                ✗
              </span>
              <span>{err}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 rounded-2xl border border-red-200 bg-red-50 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-red-900">
          ⚠ Cadre de sécurité — consulter si
        </h2>
        <p className="text-sm leading-relaxed text-red-950">
          {protocole.consulter_si}
        </p>
      </section>
    </article>
  );
}

// Affiche un encart réflexologie isolé (épinglé), peu importe sa source
// d'origine (coucher / soin / jeux). Le format JSON varie selon la source,
// donc on affiche conditionnellement les champs présents.

type ReflexoData = Record<string, unknown>;

// Sous-formats observés :
type EtapeCoucher = {
  zone: string;
  duree: string;
  geste: string;
  ce_que_cest?: string;
};
type PointSoin = { zone: string; geste: string; effet?: string };

function SectionList({
  title,
  items,
  bullet = "·",
}: {
  title: string;
  items: string[];
  bullet?: string;
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
        {title}
      </h3>
      <ul className="space-y-1.5 text-sm leading-relaxed text-emerald-950">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden>{bullet}</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ReflexoView({ data }: { data: ReflexoData }) {
  const titre = (data.titre as string) ?? "Réflexologie";
  const intro = data.intro as string | undefined;
  const duree = (data.duree ?? data.duree_totale) as string | undefined;
  const moment = data.moment as string | undefined;
  const pression = data.pression as string | undefined;
  const cloture = data.cloture as string | undefined;
  const ce_que_ca_fait = data.ce_que_ca_fait as string | undefined;
  const ce_qu_il_fait = data.ce_qu_il_fait as string | undefined;
  const effet_final = ce_que_ca_fait ?? ce_qu_il_fait;

  return (
    <article className="space-y-4 rounded-2xl bg-emerald-50 p-5">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold leading-tight text-emerald-900">
          {titre}
        </h2>
        <p className="text-xs text-emerald-800">
          {[duree, moment, pression].filter(Boolean).join(" · ")}
        </p>
      </header>

      {intro ? (
        <p className="text-sm leading-relaxed text-emerald-950">{intro}</p>
      ) : null}

      {/* Format coucher : etapes avec {zone, duree, geste, ce_que_cest} */}
      {Array.isArray(data.etapes) &&
      data.etapes.length > 0 &&
      typeof data.etapes[0] === "object" &&
      data.etapes[0] !== null ? (
        <ol className="space-y-2.5">
          {(data.etapes as EtapeCoucher[]).map((e, i) => (
            <li key={i} className="rounded-xl bg-white p-3">
              <p className="text-sm font-medium text-emerald-900">
                {i + 1}. {e.zone}{" "}
                {e.duree ? (
                  <span className="font-normal text-emerald-700">
                    · {e.duree}
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                {e.geste}
              </p>
              {e.ce_que_cest ? (
                <p className="mt-1 text-xs italic text-neutral-500">
                  {e.ce_que_cest}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}

      {/* Format jeux : etapes = string[] */}
      {Array.isArray(data.etapes) &&
      data.etapes.length > 0 &&
      typeof data.etapes[0] === "string" ? (
        <ol className="space-y-1.5 text-sm leading-relaxed text-emerald-950">
          {(data.etapes as string[]).map((e, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-semibold">{i + 1}.</span>
              <span>{e}</span>
            </li>
          ))}
        </ol>
      ) : null}

      {/* Format soin : points[{zone, geste, effet}] */}
      {Array.isArray(data.points) && data.points.length > 0 ? (
        <ol className="space-y-2.5">
          {(data.points as PointSoin[]).map((p, i) => (
            <li key={i} className="rounded-xl bg-white p-3">
              <p className="font-medium text-emerald-900">{p.zone}</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-700">
                {p.geste}
              </p>
              {p.effet ? (
                <p className="mt-1 text-xs italic text-neutral-500">
                  {p.effet}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}

      {/* Format mois 0 (jeux) : comment_faire = string[] */}
      {Array.isArray(data.comment_faire) && data.comment_faire.length > 0 ? (
        <ol className="space-y-1.5 text-sm leading-relaxed text-emerald-950">
          {(data.comment_faire as string[]).map((e, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-semibold">{i + 1}.</span>
              <span>{e}</span>
            </li>
          ))}
        </ol>
      ) : null}

      {/* Format soin : indications */}
      {Array.isArray(data.indications) && data.indications.length > 0 ? (
        <SectionList
          title="Indications"
          items={data.indications as string[]}
        />
      ) : null}

      {cloture ? (
        <p className="rounded-xl bg-white p-3 text-sm italic leading-relaxed text-emerald-800">
          {cloture}
        </p>
      ) : null}

      {effet_final ? (
        <p className="rounded-xl bg-white p-3 text-xs italic leading-relaxed text-emerald-900">
          {effet_final}
        </p>
      ) : null}
    </article>
  );
}

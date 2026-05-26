import type { ConseilSoin } from "@/lib/content";
import { VoiceRecorder } from "./voice-recorder";
import { ChallengeDone } from "./challenge-done";

// Type helpers pour les structures imbriquées variables
type Point = { zone: string; geste: string; effet?: string };
type BlocTexte = { titre?: string; contenu: string };
type Challenge = { nom: string; deroule: string };

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
      <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h2>
      <ul className="space-y-1.5 text-sm leading-relaxed text-neutral-800">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="text-neutral-400">
              {bullet}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ConseilView({ conseil }: { conseil: ConseilSoin }) {
  return (
    <article className="space-y-5">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          {conseil.icone ? (
            <span aria-hidden className="text-3xl">
              {conseil.icone}
            </span>
          ) : null}
          <div>
            <h1 className="text-2xl font-semibold leading-tight">
              {conseil.titre}
            </h1>
            {conseil.sous_titre ? (
              <p className="text-sm text-neutral-600">{conseil.sous_titre}</p>
            ) : null}
          </div>
        </div>
        {conseil.duree || conseil.frequence_conseillee ? (
          <p className="text-xs text-neutral-500">
            {[conseil.duree, conseil.frequence_conseillee]
              .filter(Boolean)
              .map(String)
              .join(" · ")}
          </p>
        ) : null}
      </header>

      {typeof conseil.intro === "string" ? (
        <p className="text-sm leading-relaxed text-neutral-700">
          {conseil.intro}
        </p>
      ) : null}

      {Array.isArray(conseil.indications) ? (
        <SectionList
          title="Indications"
          items={conseil.indications as string[]}
        />
      ) : null}

      {Array.isArray(conseil.points) ? (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Points à activer
          </h2>
          <ol className="space-y-2.5">
            {(conseil.points as Point[]).map((p, i) => (
              <li key={i} className="rounded-2xl border border-neutral-200 p-4">
                <p className="font-medium leading-tight text-neutral-900">
                  {p.zone}
                </p>
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
        </section>
      ) : null}

      {typeof conseil.cloture === "string" ? (
        <p className="rounded-xl bg-neutral-50 p-4 text-sm italic text-neutral-700">
          {conseil.cloture}
        </p>
      ) : null}

      {typeof conseil.comment_faire === "string" ? (
        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Comment faire
          </h2>
          <p className="text-sm leading-relaxed text-neutral-800">
            {conseil.comment_faire}
          </p>
        </section>
      ) : null}

      {typeof conseil.texte_meditation === "string" ? (
        <section className="space-y-2 rounded-2xl bg-violet-50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-violet-900">
            Méditation
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-violet-950">
            {conseil.texte_meditation}
          </p>
        </section>
      ) : null}

      {Array.isArray(conseil.exemples) ? (
        <SectionList title="Exemples" items={conseil.exemples as string[]} />
      ) : null}

      {typeof conseil.consigne === "string" ? (
        <section className="space-y-2 rounded-2xl bg-rose-50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-rose-900">
            Consigne
          </h2>
          <p className="text-sm leading-relaxed text-rose-950">
            {conseil.consigne}
          </p>
        </section>
      ) : null}

      {Array.isArray(conseil.amorces_si_blocage) ? (
        <SectionList
          title="Amorces si tu bloques"
          items={conseil.amorces_si_blocage as string[]}
        />
      ) : null}

      {conseil.format_propose === "vocal_audio" ||
      conseil.espace_pour_enregistrement === true ? (
        <VoiceRecorder filename={conseil.id} />
      ) : null}

      {typeof conseil.pour_la_maman === "object" && conseil.pour_la_maman ? (
        <section className="space-y-2 rounded-2xl bg-pink-50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-pink-900">
            {(conseil.pour_la_maman as BlocTexte).titre ?? "Côté maman"}
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-pink-950">
            {(conseil.pour_la_maman as BlocTexte).contenu}
          </p>
        </section>
      ) : null}

      {typeof conseil.pour_le_papa_co_parent === "object" &&
      conseil.pour_le_papa_co_parent ? (
        <section className="space-y-2 rounded-2xl bg-sky-50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-sky-900">
            {(conseil.pour_le_papa_co_parent as BlocTexte).titre ??
              "Côté papa / co-parent"}
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-sky-950">
            {(conseil.pour_le_papa_co_parent as BlocTexte).contenu}
          </p>
        </section>
      ) : null}

      {Array.isArray(conseil.signaux_a_ne_pas_negliger) ? (
        <SectionList
          title="Signaux à ne pas négliger"
          items={conseil.signaux_a_ne_pas_negliger as string[]}
          bullet="!"
        />
      ) : null}

      {typeof conseil.urgence === "string" ? (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium leading-relaxed text-red-950">
            ⚠ {conseil.urgence}
          </p>
        </section>
      ) : null}

      {Array.isArray(conseil.qui_consulter) ? (
        <SectionList
          title="Qui consulter"
          items={conseil.qui_consulter as string[]}
        />
      ) : null}

      {typeof conseil.challenge_du_mois === "object" &&
      conseil.challenge_du_mois ? (
        <section className="space-y-3 rounded-2xl bg-amber-50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-900">
            Challenge du mois — {(conseil.challenge_du_mois as Challenge).nom}
          </h2>
          <p className="text-sm leading-relaxed text-amber-950">
            {(conseil.challenge_du_mois as Challenge).deroule}
          </p>
          <ChallengeDone id={conseil.id} />
        </section>
      ) : null}

      {typeof conseil.pourquoi_ca_marche === "string" ? (
        <p className="rounded-xl bg-neutral-50 p-4 text-sm italic text-neutral-700">
          {conseil.pourquoi_ca_marche}
        </p>
      ) : null}

      {typeof conseil.principe === "string" ? (
        <p className="rounded-xl bg-neutral-50 p-4 text-sm italic text-neutral-700">
          {conseil.principe}
        </p>
      ) : null}
    </article>
  );
}

import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getCoucher } from "@/lib/content";

function personaliser(texte: string, prenom: string): string {
  return texte.replaceAll("[Prénom]", prenom).replaceAll("[prénom]", prenom);
}

export default async function CoucherPage() {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const coucher = await getCoucher(mois);

  if (!coucher) {
    return (
      <section className="space-y-5">
        <header className="space-y-1">
          <p className="text-2xl" aria-hidden>🌙</p>
          <h1 className="text-2xl font-semibold">Préparer le coucher</h1>
        </header>
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Le rituel du coucher du mois {mois} n&apos;est pas encore disponible.
          Mois disponibles : 0, 3, 6, 9 et 14.
        </p>
      </section>
    );
  }

  return (
    <article className="space-y-7 pb-4">
      <header className="space-y-1">
        <p className="text-2xl" aria-hidden>🌙</p>
        <h1 className="text-2xl font-semibold leading-tight">
          {coucher.titre_rubrique ?? "Préparer le coucher"}
        </h1>
        {coucher.sous_titre ? (
          <p className="text-sm text-neutral-600">{coucher.sous_titre}</p>
        ) : null}
      </header>

      {coucher.description ? (
        <p className="text-sm leading-relaxed text-neutral-700">
          {coucher.description}
        </p>
      ) : null}

      {coucher.reperes_cles && coucher.reperes_cles.length > 0 ? (
        <section className="space-y-2 rounded-2xl bg-indigo-50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-indigo-900">
            Repères clés
          </h2>
          <ul className="space-y-1.5 text-sm leading-relaxed text-indigo-950">
            {coucher.reperes_cles.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden>•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {coucher.rituel_etapes && coucher.rituel_etapes.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Rituel pas à pas
          </h2>
          <ol className="space-y-3">
            {coucher.rituel_etapes.map((etape) => (
              <li
                key={etape.etape}
                className="rounded-2xl border border-neutral-200 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                    {etape.etape}
                  </span>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium leading-tight">{etape.titre}</p>
                    {etape.horaire || etape.duree ? (
                      <p className="text-xs text-neutral-500">
                        {[etape.horaire, etape.duree].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                    <p className="text-sm leading-relaxed text-neutral-700">
                      {personaliser(etape.description, profile.baby_name)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {coucher.reflexologie_du_coucher ? (
        <section className="space-y-3 rounded-2xl bg-emerald-50 p-5">
          <header className="space-y-1">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">
              {coucher.reflexologie_du_coucher.titre}
            </h2>
            <p className="text-xs text-emerald-800">
              {[
                coucher.reflexologie_du_coucher.duree_totale,
                coucher.reflexologie_du_coucher.pression,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </header>
          {coucher.reflexologie_du_coucher.intro ? (
            <p className="text-sm leading-relaxed text-emerald-950">
              {coucher.reflexologie_du_coucher.intro}
            </p>
          ) : null}
          <ol className="space-y-2.5">
            {coucher.reflexologie_du_coucher.etapes.map((e, i) => (
              <li key={i} className="rounded-xl bg-white p-3">
                <p className="text-sm font-medium text-emerald-900">
                  {i + 1}. {e.zone}{" "}
                  <span className="font-normal text-emerald-700">
                    · {e.duree}
                  </span>
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
        </section>
      ) : null}

      {coucher.script_audio_du_soir ? (
        <section className="space-y-3 rounded-2xl bg-violet-50 p-5">
          <header className="space-y-1">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-900">
              {coucher.script_audio_du_soir.titre}
            </h2>
            {coucher.script_audio_du_soir.duree ? (
              <p className="text-xs text-violet-700">
                {coucher.script_audio_du_soir.duree}
              </p>
            ) : null}
          </header>
          {coucher.script_audio_du_soir.instruction ? (
            <p className="text-xs italic text-violet-800">
              {coucher.script_audio_du_soir.instruction}
            </p>
          ) : null}
          <p className="whitespace-pre-line text-sm leading-relaxed text-violet-950">
            {personaliser(coucher.script_audio_du_soir.texte, profile.baby_name)}
          </p>
        </section>
      ) : null}

      {coucher.signaux_de_fatigue && coucher.signaux_de_fatigue.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Signaux de fatigue
          </h2>
          <ul className="space-y-1.5 text-sm leading-relaxed text-neutral-800">
            {coucher.signaux_de_fatigue.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden>·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {coucher.erreurs_a_eviter && coucher.erreurs_a_eviter.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Erreurs à éviter
          </h2>
          <ul className="space-y-2 text-sm leading-relaxed text-neutral-800">
            {coucher.erreurs_a_eviter.map((e, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="text-red-500">
                  ✗
                </span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {coucher.consulter_si ? (
        <section className="space-y-2 rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-red-900">
            ⚠ Cadre de sécurité — consulter si
          </h2>
          <p className="text-sm leading-relaxed text-red-950">
            {coucher.consulter_si}
          </p>
        </section>
      ) : null}
    </article>
  );
}

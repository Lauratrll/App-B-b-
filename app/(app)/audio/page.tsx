import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getAudioMeta, getAudioScripts } from "@/lib/content";

export default async function AudioPage() {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const meta = await getAudioMeta(mois);
  const scripts = await getAudioScripts(mois);

  if (scripts.length === 0) {
    return (
      <section className="space-y-5">
        <header className="space-y-1">
          <p className="text-2xl" aria-hidden>💜</p>
          <h1 className="text-2xl font-semibold">Partager &amp; rassurer</h1>
        </header>
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Les scripts audio du mois {mois} ne sont pas encore disponibles.
          Mois disponibles : 0, 3, 6, 9 et 14.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <p className="text-2xl" aria-hidden>💜</p>
        <h1 className="text-2xl font-semibold leading-tight">
          {meta?.titre_rubrique ?? "Partager & rassurer"}
        </h1>
        {meta?.sous_titre ? (
          <p className="text-sm text-neutral-600">{meta.sous_titre}</p>
        ) : null}
      </header>

      {meta?.ancrage ? (
        <blockquote className="rounded-2xl border-l-4 border-violet-300 bg-violet-50 p-4 text-sm italic leading-relaxed text-violet-900">
          {meta.ancrage}
        </blockquote>
      ) : null}

      {meta?.comment_utiliser && meta.comment_utiliser.length > 0 ? (
        <section className="space-y-2 rounded-2xl bg-neutral-50 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
            Comment utiliser ces scripts
          </h2>
          <ul className="space-y-1 text-xs leading-relaxed text-neutral-700">
            {meta.comment_utiliser.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden>·</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ul className="grid gap-3">
        {scripts.map((s) => {
          const fond = s.couleur ?? "#EEEDFE";
          const accent = s.couleur_texte ?? "#3C3489";
          return (
            <li key={s.id}>
              <Link
                href={`/audio/${s.id}`}
                className="block rounded-2xl p-5"
                style={{ backgroundColor: fond, color: accent }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide opacity-75">
                  {[s.duree_estimee, s.theme].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-1 text-base font-semibold leading-tight">
                  {s.titre}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getAudioScript } from "@/lib/content";

function personaliser(texte: string, prenom: string): string {
  return texte.replaceAll("[Prénom]", prenom).replaceAll("[prénom]", prenom);
}

export default async function ScriptPage({
  params,
}: {
  params: { id: string };
}) {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const script = await getAudioScript(mois, params.id);
  if (!script) notFound();

  const fond = script.couleur ?? "#EEEDFE";
  const accent = script.couleur_texte ?? "#3C3489";

  return (
    <section className="space-y-5">
      <Link
        href="/audio"
        className="inline-flex items-center gap-1 text-xs text-neutral-500"
      >
        ← Tous les scripts
      </Link>

      <article className="space-y-5">
        <header
          className="space-y-2 rounded-3xl p-6"
          style={{ backgroundColor: fond, color: accent }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide opacity-75">
            {[script.duree_estimee, script.theme].filter(Boolean).join(" · ")}
          </p>
          <h1 className="text-2xl font-semibold leading-tight">
            {script.titre}
          </h1>
          {script.contexte_ideal ? (
            <p className="text-sm">{script.contexte_ideal}</p>
          ) : null}
        </header>

        {script.intention ? (
          <section className="rounded-xl bg-neutral-50 p-4 text-sm italic leading-relaxed text-neutral-700">
            <strong className="not-italic">Intention :</strong> {script.intention}
          </section>
        ) : null}

        {script.preparation_parent ? (
          <section className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Préparation
            </h2>
            <p className="text-sm leading-relaxed text-neutral-700">
              {script.preparation_parent}
            </p>
          </section>
        ) : null}

        <section
          className="space-y-2 rounded-2xl p-5"
          style={{ backgroundColor: fond, color: accent }}
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide opacity-75">
            Texte à lire
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed">
            {personaliser(script.texte, profile.baby_name)}
          </p>
        </section>
      </article>
    </section>
  );
}

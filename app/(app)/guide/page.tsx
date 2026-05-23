import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getGuideMeta } from "@/lib/content";

export default async function GuidePage() {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const meta = await getGuideMeta(mois);

  if (!meta || !meta.categories || meta.categories.length === 0) {
    return (
      <section className="space-y-5">
        <header className="space-y-1">
          <p className="text-2xl" aria-hidden>🧭</p>
          <h1 className="text-2xl font-semibold">Guide-moi !</h1>
          <p className="text-sm text-neutral-600">
            {profile.baby_name} a {mois} mois.
          </p>
        </header>
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Les protocoles du mois {mois} ne sont pas encore disponibles.
          Mois disponibles actuellement : 3, 6, 9 et 14.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <p className="text-2xl" aria-hidden>🧭</p>
        <h1 className="text-2xl font-semibold">
          {meta.titre_rubrique ?? "Guide-moi !"}
        </h1>
        {meta.sous_titre ? (
          <p className="text-sm text-neutral-600">{meta.sous_titre}</p>
        ) : null}
      </header>

      {meta.ancrage ? (
        <blockquote className="rounded-2xl border-l-4 border-neutral-300 bg-neutral-50 p-4 text-sm italic leading-relaxed text-neutral-700">
          {meta.ancrage}
        </blockquote>
      ) : null}

      <ul className="grid gap-3">
        {meta.categories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/guide/${cat.id}`}
              className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
            >
              <span aria-hidden className="text-3xl">
                {cat.icone}
              </span>
              <div className="flex-1">
                <p className="font-medium leading-tight">{cat.nom}</p>
                <p className="text-xs text-neutral-500">{cat.sous_titre}</p>
              </div>
              <span aria-hidden className="text-neutral-400">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

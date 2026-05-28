import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getGuideMeta, getGuideSituations } from "@/lib/content";

export default async function CategoriePage({
  params,
}: {
  params: { categorie: string };
}) {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));

  const meta = await getGuideMeta(mois);
  const categorie = meta?.categories.find((c) => c.id === params.categorie);
  if (!categorie) notFound();

  const situations = await getGuideSituations(mois, params.categorie);

  return (
    <section className="space-y-5">
      <Link
        href="/guide"
        className="inline-flex items-center gap-1 text-xs text-neutral-500"
      >
        ← Catégories
      </Link>

      <header className="space-y-1">
        <p className="text-3xl" aria-hidden>{categorie.icone}</p>
        <h1 className="text-2xl font-semibold leading-tight">
          {categorie.nom}
        </h1>
        <p className="text-sm text-neutral-600">{categorie.sous_titre}</p>
      </header>

      {situations.length === 0 ? (
        <p className="rounded-xl bg-neutral-100 p-4 text-sm text-neutral-700">
          Aucune situation disponible pour cette catégorie.
        </p>
      ) : (
        <ul className="space-y-3">
          {situations.map((s) => (
            <li key={s.id}>
              <Link
                href={`/guide/${categorie.id}/${s.ordre}`}
                className="block rounded-2xl border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
              >
                <p className="font-medium leading-tight">{s.titre}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

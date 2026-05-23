import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getGuideMeta, getGuideProtocole } from "@/lib/content";
import { ProtocoleView } from "@/components/modules/protocole-view";

export default async function ProtocolePage({
  params,
}: {
  params: { categorie: string; ordre: string };
}) {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const ordre = parseInt(params.ordre, 10);
  if (Number.isNaN(ordre)) notFound();

  const meta = await getGuideMeta(mois);
  const categorie = meta?.categories.find((c) => c.id === params.categorie);
  if (!categorie) notFound();

  const protocole = await getGuideProtocole(mois, params.categorie, ordre);
  if (!protocole) notFound();

  return (
    <section className="space-y-5">
      <Link
        href={`/guide/${params.categorie}`}
        className="inline-flex items-center gap-1 text-xs text-neutral-500"
      >
        ← {categorie.icone} {categorie.nom}
      </Link>

      <ProtocoleView protocole={protocole} />

      <div className="pt-4 text-center">
        <Link
          href={`/guide/${params.categorie}`}
          className="text-sm text-neutral-500 underline"
        >
          Voir les autres situations de cette catégorie
        </Link>
      </div>
    </section>
  );
}

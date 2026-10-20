import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getGuideMeta, getGuideProtocole } from "@/lib/content";
import { isPinned } from "@/lib/pinned";
import { ProtocoleView } from "@/components/modules/protocole-view";
import { NavBack, NavPin } from "@/components/ui/nav-context";

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

  const result = await getGuideProtocole(mois, params.categorie, ordre);
  if (!result) notFound();
  const { contentId, protocole } = result;

  const pinned = await isPinned(contentId);
  const returnUrl = `/guide/${params.categorie}/${ordre}`;

  return (
    <section className="space-y-5">
      {/* Retour et « épingler » : dans la barre du bas (20/10). */}
      <NavBack href={`/guide/${params.categorie}`} label={categorie.nom} />
      <NavPin contentId={contentId} isPinned={pinned} returnUrl={returnUrl} />

      <ProtocoleView protocole={protocole} />

      <div className="pt-4 text-center">
        <Link prefetch
          href={`/guide/${params.categorie}`}
          className="text-xs text-neutral-500 underline"
        >
          Voir les autres situations de cette catégorie
        </Link>
      </div>
    </section>
  );
}

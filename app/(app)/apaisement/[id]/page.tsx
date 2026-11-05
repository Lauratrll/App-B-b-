import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getGeste, getGestesAvecFiche } from "@/lib/apaisement";
import { getApaisementContentId } from "@/lib/content";
import { isPinned } from "@/lib/pinned";
import { NavPin } from "@/components/ui/nav-context";
import { GesteFiche } from "@/components/modules/apaisement-fiche";

// Page d'un geste d'apaisement (la fiche : components/modules/apaisement-fiche.tsx).
// La fiche ne dépend pas du mois : un geste épinglé reste lisible après son
// mois de fin (brief §4.5). La liste, elle, ne montre que les gestes du mois.

export function generateStaticParams() {
  return getGestesAvecFiche().map((g) => ({ id: g.id }));
}

export default async function GestePage({ params }: { params: { id: string } }) {
  await requireProfile();
  const geste = getGeste(params.id);
  if (!geste) notFound();

  const contentId = await getApaisementContentId(geste.id);
  const pinned = contentId ? await isPinned(contentId) : false;

  return (
    <>
      {contentId ? (
        <NavPin contentId={contentId} isPinned={pinned} returnUrl={`/apaisement/${geste.id}`} />
      ) : null}
      <GesteFiche geste={geste} />
    </>
  );
}

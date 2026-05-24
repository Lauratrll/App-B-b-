import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getReflexoFromSoin, getSoinConseil } from "@/lib/content";
import { isPinned } from "@/lib/pinned";
import { ConseilView } from "@/components/modules/conseil-view";
import { PinButton } from "@/components/modules/pin-button";

export default async function ConseilPage({
  params,
}: {
  params: { id: string };
}) {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const conseil = await getSoinConseil(mois, params.id);
  if (!conseil) notFound();

  // Si le conseil est un protocole réflexo, on récupère la ligne 'reflexo'
  // correspondante pour afficher un bouton Épingler dédié.
  const isReflexo =
    typeof conseil.id === "string" && conseil.id.toLowerCase().includes("reflex");
  const reflexo = isReflexo ? await getReflexoFromSoin(mois, conseil.id) : null;
  const reflexoPinned = reflexo ? await isPinned(reflexo.contentId) : false;
  const returnUrl = `/soin/${params.id}`;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <Link
          href="/soin"
          className="inline-flex items-center gap-1 text-xs text-neutral-500"
        >
          ← Tous les conseils
        </Link>
        {reflexo ? (
          <PinButton
            contentId={reflexo.contentId}
            isPinned={reflexoPinned}
            returnUrl={returnUrl}
          />
        ) : null}
      </div>
      <ConseilView conseil={conseil} />
    </section>
  );
}

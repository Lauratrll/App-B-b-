import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import {
  getContentById,
  type ProtocoleGuide,
  type CoucherModule,
} from "@/lib/content";
import { isPinned } from "@/lib/pinned";
import { PinButton } from "@/components/modules/pin-button";
import { ProtocoleView } from "@/components/modules/protocole-view";
import { CoucherView } from "@/components/modules/coucher-view";
import { ReflexoView } from "@/components/modules/reflexo-view";

export default async function EpingleViewPage({
  params,
}: {
  params: { id: string };
}) {
  const { profile } = await requireProfile();
  const moisActuel = getBabyMonth(new Date(profile.birthdate));
  const content = await getContentById(params.id);
  if (!content) notFound();

  const pinned = await isPinned(content.id);
  const returnUrl = `/epingle/${content.id}`;
  const moisDepasse = content.mois !== moisActuel;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <Link
          href="/epingles"
          className="inline-flex items-center gap-1 text-xs text-neutral-500"
        >
          ← Mes épingles
        </Link>
        <PinButton
          contentId={content.id}
          isPinned={pinned}
          returnUrl={returnUrl}
        />
      </div>

      {moisDepasse ? (
        <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
          Ce contenu a été créé pour un bébé de {content.mois} mois.
          {" "}{profile.baby_name} a maintenant {moisActuel} mois.
        </p>
      ) : null}

      {content.module === "guide" ? (
        <ProtocoleView protocole={content.data as unknown as ProtocoleGuide} />
      ) : content.module === "coucher" ? (
        <CoucherView
          coucher={content.data as unknown as CoucherModule}
          babyName={profile.baby_name}
        />
      ) : content.module === "reflexo" ? (
        <ReflexoView data={content.data} />
      ) : (
        <p className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-700">
          Aperçu non disponible pour ce type de contenu.
        </p>
      )}
    </section>
  );
}

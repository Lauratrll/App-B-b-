import { notFound, redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import {
  getContentById,
  type ProtocoleGuide,
  type CoucherModule,
} from "@/lib/content";
import { isPinned } from "@/lib/pinned";
import { NavPin } from "@/components/ui/nav-context";
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
  // Fiche de Réflexologie plantaire : elle s'ouvre dans son onglet (20/10).
  if (content.module === "reflexo" && content.categorie === "plantaire" && content.situation) {
    redirect(`/reflexologie/${content.situation}`);
  }

  const pinned = await isPinned(content.id);
  const returnUrl = `/epingle/${content.id}`;
  const moisDepasse = content.mois !== moisActuel;

  return (
    <section className="space-y-5">
      {/* Retour et « épingler » : dans la barre du bas (20/10). */}
      <NavPin contentId={content.id} isPinned={pinned} returnUrl={returnUrl} />

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
          genre={profile.genre}
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

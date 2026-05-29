import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getGuideMeta, getGuideSituations } from "@/lib/content";
import { SituationsView } from "@/components/modules/situations-view";

export default async function CategoriePage({
  params,
}: {
  params: { categorie: string };
}) {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));

  const meta = await getGuideMeta(mois);
  const slotIndex =
    meta?.categories.findIndex((c) => c.id === params.categorie) ?? -1;
  const categorie = slotIndex >= 0 ? meta!.categories[slotIndex] : undefined;
  if (!categorie) notFound();

  const situations = await getGuideSituations(mois, params.categorie);

  return (
    <SituationsView
      categorie={categorie}
      slotIndex={slotIndex}
      situations={situations}
    />
  );
}

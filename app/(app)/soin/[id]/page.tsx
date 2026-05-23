import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getSoinConseil } from "@/lib/content";
import { ConseilView } from "@/components/modules/conseil-view";

export default async function ConseilPage({
  params,
}: {
  params: { id: string };
}) {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const conseil = await getSoinConseil(mois, params.id);
  if (!conseil) notFound();

  return (
    <section className="space-y-5">
      <Link
        href="/soin"
        className="inline-flex items-center gap-1 text-xs text-neutral-500"
      >
        ← Tous les conseils
      </Link>
      <ConseilView conseil={conseil} />
    </section>
  );
}

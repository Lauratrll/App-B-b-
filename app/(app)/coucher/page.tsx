import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getCoucher } from "@/lib/content";
import { CoucherView } from "@/components/modules/coucher-view";

export default async function CoucherPage() {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const result = await getCoucher(mois);

  if (!result) {
    return (
      <section className="space-y-5">
        <header className="space-y-1">
          <p className="text-2xl" aria-hidden>🌙</p>
          <h1 className="text-2xl font-semibold">Préparer le coucher</h1>
        </header>
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Le rituel du coucher du mois {mois} n&apos;est pas encore disponible.
          Mois disponibles : 0, 3, 6, 9 et 14.
        </p>
      </section>
    );
  }

  const { coucher } = result;

  return (
    <section>
      <CoucherView coucher={coucher} babyName={profile.baby_name} />
    </section>
  );
}

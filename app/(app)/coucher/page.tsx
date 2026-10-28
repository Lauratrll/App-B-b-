import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getCoucher } from "@/lib/content";
import { getSommeil } from "@/lib/sommeil";
import { CoucherView } from "@/components/modules/coucher-view";
import { SommeilView } from "@/components/modules/sommeil-view";

export default async function CoucherPage() {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const result = await getCoucher(mois);

  // Nouvelle structure Sommeil (tranches M0 à M23) : ouverte à tous les
  // parents depuis le 28/10 (avant : admins seulement).
  const sommeil = getSommeil(mois);
  if (sommeil) {
    return (
      <section>
        <SommeilView
          sommeil={sommeil}
          coucher={result?.coucher ?? null}
          babyName={profile.baby_name}
          genre={profile.genre}
        />
      </section>
    );
  }

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
      <CoucherView
        coucher={coucher}
        babyName={profile.baby_name}
        genre={profile.genre}
      />
    </section>
  );
}

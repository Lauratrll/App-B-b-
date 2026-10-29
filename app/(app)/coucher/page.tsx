import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getCoucher } from "@/lib/content";
import { getSommeil } from "@/lib/sommeil";
import { CoucherView } from "@/components/modules/coucher-view";
import { SommeilView } from "@/components/modules/sommeil-view";
import { SommeilSlots } from "@/components/modules/sommeil-slots";

// Page « Sommeil & Endormissement · Rythme et Rituels » (28/10).
// ?slot=… : slot ouvert (tranche en slots, pilote M2-M5).
export default async function CoucherPage({
  searchParams,
}: {
  searchParams?: { slot?: string };
}) {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const result = await getCoucher(mois);

  // Nouvelle structure Sommeil (tranches M0 à M23) : ouverte à tous les
  // parents depuis le 28/10 (avant : admins seulement).
  const sommeil = getSommeil(mois);
  if (sommeil?.forme === "slots") {
    // 29/10 : sur la grille (pas de slot ouvert) et sur Repères clés, la page prend toute la
    // hauteur de l'écran pour se centrer.
    const grille = !searchParams?.slot || searchParams.slot === "reperes-cles";
    return (
      <section
        className={grille ? "centre-vertical" : undefined}
        style={grille ? { display: "flex", flexDirection: "column", flex: 1 } : undefined}
      >
        <SommeilSlots
          sommeil={sommeil}
          slot={searchParams?.slot ?? null}
          babyName={profile.baby_name}
          genre={profile.genre}
        />
      </section>
    );
  }
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
          <h1 className="text-2xl font-semibold">Sommeil & Endormissement</h1>
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

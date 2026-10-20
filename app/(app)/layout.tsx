import { Suspense } from "react";
import { getApercu, getCurrentProfile, requireUser } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { PinToast } from "@/components/modules/pin-toast";
import { ApercuAdminBar } from "@/components/modules/apercu-admin-bar";
import { AppMenu } from "@/components/ui/app-menu";
import { BottomNav } from "@/components/ui/bottom-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  const profile = await getCurrentProfile();
  const babyMonth = profile ? getBabyMonth(new Date(profile.birthdate)) : null;
  const apercu = await getApercu();

  return (
    <div className="flex min-h-dvh flex-col">
      <Suspense fallback={null}>
        <PinToast />
      </Suspense>
      {/* En-tête : menu « 3 traits » (réglages) à gauche, bébé au centre.
          Hauteur 45 px, reprise par la page SOS. */}
      <header className="grid h-[45px] grid-cols-[44px_1fr_44px] items-center border-b border-neutral-200 px-3">
        <AppMenu />
        <div className="text-center text-sm">
          {profile ? (
            <>
              <span className="font-medium text-neutral-900">
                {profile.baby_name}
              </span>{" "}
              <span className="text-neutral-500">· {babyMonth} mois</span>
            </>
          ) : (
            <span className="text-neutral-500">Bienvenue</span>
          )}
        </div>
        <span aria-hidden />
      </header>
      {apercu && profile && babyMonth !== null ? (
        <ApercuAdminBar
          key={`${babyMonth}-${profile.genre}`}
          mois={babyMonth}
          genre={profile.genre}
        />
      ) : null}

      {/* pb-8 : le tiers des boutons ronds qui dépasse au-dessus de la barre. */}
      <main className="flex-1 px-5 pt-6 pb-8">{children}</main>

      <BottomNav />
    </div>
  );
}

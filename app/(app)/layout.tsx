import { Suspense } from "react";
import { getApercu, getCurrentProfile, requireUser } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { PinToast } from "@/components/modules/pin-toast";
import { ApercuAdminBar } from "@/components/modules/apercu-admin-bar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { NavProvider } from "@/components/ui/nav-context";

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
    <NavProvider>
    <div className="flex min-h-dvh flex-col">
      <Suspense fallback={null}>
        <PinToast />
      </Suspense>
      {/* Plus de bandeau en haut (Laura, 20/10) : le menu « 3 traits » est sur
          l'accueil, à droite du prénom et de l'âge (app/(app)/dashboard). */}
      {apercu && profile && babyMonth !== null ? (
        <ApercuAdminBar
          key={`${babyMonth}-${profile.genre}`}
          mois={babyMonth}
          genre={profile.genre}
        />
      ) : null}

      <main className="flex-1 px-5 pt-6 pb-4">{children}</main>

      <BottomNav />
    </div>
    </NavProvider>
  );
}

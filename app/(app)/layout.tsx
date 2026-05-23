import Link from "next/link";
import { Suspense } from "react";
import { getCurrentProfile, requireUser } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { PinToast } from "@/components/modules/pin-toast";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  const profile = await getCurrentProfile();
  const babyMonth = profile ? getBabyMonth(new Date(profile.birthdate)) : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <Suspense fallback={null}>
        <PinToast />
      </Suspense>
      <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
        <div className="text-sm">
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
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-xs text-neutral-500 underline underline-offset-2"
          >
            Se déconnecter
          </button>
        </form>
      </header>

      <main className="flex-1 px-5 py-6">{children}</main>

      <nav className="sticky bottom-0 grid grid-cols-5 border-t border-neutral-200 bg-white text-[10px]">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 py-2">
          <span aria-hidden>🏠</span>
          <span>Accueil</span>
        </Link>
        <Link href="/guide" className="flex flex-col items-center gap-1 py-2">
          <span aria-hidden>🧭</span>
          <span>Guide-moi</span>
        </Link>
        <Link href="/epingles" className="flex flex-col items-center gap-1 py-2">
          <span aria-hidden>📌</span>
          <span>Épinglés</span>
        </Link>
        <Link href="/soin" className="flex flex-col items-center gap-1 py-2">
          <span aria-hidden>🌸</span>
          <span>Moi</span>
        </Link>
        <Link href="/profil" className="flex flex-col items-center gap-1 py-2">
          <span aria-hidden>👶</span>
          <span>Bébé</span>
        </Link>
      </nav>
    </div>
  );
}

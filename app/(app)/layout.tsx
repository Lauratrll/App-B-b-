import Link from "next/link";

// TODO: vérifier la session Supabase et l'abonnement actif ici
// (cf. règle CLAUDE.md : "Vérifier l'abonnement actif avant d'afficher tout contenu protégé")

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
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

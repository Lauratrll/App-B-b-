import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

// Plus de page d'accueil publique (Laura, 18/11/2026) : connecté → l'app,
// sinon → « Bon retour », qui mène aussi à « Créer un compte ». Le lien à
// partager aux nouveaux parents est /register. Ancienne page sauvegardée
// dans _sauvegardes/2026-11-18/.
export default async function HomePage({
  searchParams,
}: {
  searchParams: { token_hash?: string; type?: string };
}) {
  // Lien d'email arrivé ici (si l'adresse de retour n'est pas autorisée
  // chez Supabase, il y renvoie) : on le transmet.
  if (searchParams.token_hash) {
    const q = new URLSearchParams({
      token_hash: searchParams.token_hash,
      type: searchParams.type ?? "email",
    });
    redirect(`/auth/confirm?${q}`);
  }

  const user = await getCurrentUser();
  redirect(user ? "/dashboard" : "/login");
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { registerAction } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  champs_manquants: "Merci de remplir tous les champs.",
  mot_de_passe_court: "Le mot de passe doit contenir au moins 8 caractères.",
  mots_de_passe_differents: "Les deux mots de passe ne correspondent pas.",
  email_deja_utilise: "Un compte existe déjà pour cet email.",
  inscription_echouee: "L'inscription a échoué. Réessayez dans un instant.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const errorMsg = searchParams.error
    ? (ERROR_MESSAGES[searchParams.error] ?? "Une erreur est survenue.")
    : null;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Créer un compte</h1>
        <p className="text-sm text-neutral-600">
          Vous renseignerez les infos de votre bébé juste après.
        </p>
      </header>

      {errorMsg ? (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-900">
          {errorMsg}
        </p>
      ) : null}

      <form action={registerAction} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-base"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">
            Mot de passe
          </span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-base"
          />
          <span className="block text-xs text-neutral-500">
            8 caractères minimum.
          </span>
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">
            Confirmer le mot de passe
          </span>
          <input
            type="password"
            name="confirm"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-base"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-2xl bg-neutral-900 px-6 py-4 text-base font-medium text-white"
        >
          Créer mon compte
        </button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        Déjà un compte ?{" "}
        <Link href="/login" className="font-medium text-neutral-900 underline">
          Se connecter
        </Link>
      </p>
    </section>
  );
}

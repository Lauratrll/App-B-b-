import Link from "next/link";
import { loginAction } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  champs_manquants: "Merci de remplir tous les champs.",
  identifiants_invalides: "Email ou mot de passe incorrect.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; registered?: string; reset?: string };
}) {
  const errorMsg = searchParams.error
    ? (ERROR_MESSAGES[searchParams.error] ?? "Une erreur est survenue.")
    : null;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Bon retour</h1>
        <p className="text-sm text-neutral-600">
          Connectez-vous pour retrouver le contenu adapté à votre bébé.
        </p>
      </header>

      {searchParams.registered === "1" ? (
        <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
          Votre compte a été créé. Un email de confirmation vous a été envoyé.
        </p>
      ) : null}
      {searchParams.reset === "sent" ? (
        <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
          Si un compte existe pour cet email, un lien de réinitialisation a été
          envoyé.
        </p>
      ) : null}
      {errorMsg ? (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-900">
          {errorMsg}
        </p>
      ) : null}

      <form action={loginAction} className="space-y-4">
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
            autoComplete="current-password"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-base"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-2xl bg-neutral-900 px-6 py-4 text-base font-medium text-white"
        >
          Se connecter
        </button>
      </form>

      <div className="flex flex-col gap-2 text-center text-sm">
        <Link href="/reset" className="text-neutral-600 underline">
          Mot de passe oublié ?
        </Link>
        <Link href="/register" className="text-neutral-600">
          Pas encore de compte ?{" "}
          <span className="font-medium text-neutral-900 underline">
            Créer un compte
          </span>
        </Link>
      </div>
    </section>
  );
}

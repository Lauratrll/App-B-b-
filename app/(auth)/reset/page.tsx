import Link from "next/link";
import { resetAction } from "./actions";

export default function ResetPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMsg = searchParams.error === "email_manquant"
    ? "Merci de renseigner votre email."
    : null;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Mot de passe oublié</h1>
        <p className="text-sm text-neutral-600">
          Indiquez votre email pour recevoir un lien de réinitialisation.
        </p>
      </header>

      {errorMsg ? (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-900">
          {errorMsg}
        </p>
      ) : null}

      <form action={resetAction} className="space-y-4">
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
        <button
          type="submit"
          className="w-full rounded-2xl bg-neutral-900 px-6 py-4 text-base font-medium text-white"
        >
          Envoyer le lien
        </button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        <Link href="/login" className="underline">
          Retour à la connexion
        </Link>
      </p>
    </section>
  );
}

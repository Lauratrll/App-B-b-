import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 py-12 text-center">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          BeSerene
        </p>
        <h1 className="text-3xl font-semibold leading-tight text-neutral-900">
          Parentalité consciente,
          <br />
          de 0 à 24 mois.
        </h1>
        <p className="text-base text-neutral-600">
          Réflexologie émotionnelle bébé, régulation parentale et bien-être au
          naturel.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Link
          href="/register"
          className="rounded-2xl bg-neutral-900 px-6 py-4 text-base font-medium text-white"
        >
          Créer mon compte
        </Link>
        <Link
          href="/login"
          className="rounded-2xl border border-neutral-300 px-6 py-4 text-base font-medium text-neutral-900"
        >
          J&apos;ai déjà un compte
        </Link>
      </div>

      <p className="text-xs text-neutral-400">
        5,90 €/mois ou 50,90 €/an — sans publicité.
      </p>
    </main>
  );
}

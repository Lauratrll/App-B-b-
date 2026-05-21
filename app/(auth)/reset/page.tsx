export default function ResetPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Mot de passe oublié</h1>
        <p className="text-sm text-neutral-600">
          Indiquez votre email pour recevoir un lien de réinitialisation.
        </p>
      </header>
      <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
        Réinitialisation en cours d&apos;intégration avec Supabase Auth.
      </p>
    </section>
  );
}

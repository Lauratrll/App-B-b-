export default function AbonnementPage() {
  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Mon abonnement</h1>
        <p className="text-sm text-neutral-600">
          Gestion via Stripe.
        </p>
      </header>
      <div className="space-y-3 rounded-xl border border-neutral-200 p-4">
        <p className="text-sm font-medium">Formules</p>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li>Mensuel — 5,90 €/mois</li>
          <li>Annuel — 50,90 €/an (4,24 €/mois)</li>
        </ul>
      </div>
      <p className="rounded-xl bg-neutral-100 p-4 text-sm text-neutral-700">
        Paiement Stripe en cours d&apos;intégration.
      </p>
    </section>
  );
}

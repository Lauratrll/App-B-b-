export default function EpinglesPage() {
  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <p className="text-2xl" aria-hidden>📌</p>
        <h1 className="text-2xl font-semibold">Protocoles épinglés</h1>
        <p className="text-sm text-neutral-600">
          Vos protocoles favoris, accessibles en un geste.
        </p>
      </header>
      <p className="rounded-xl bg-neutral-100 p-4 text-sm text-neutral-700">
        Liste vide pour le moment.
      </p>
    </section>
  );
}

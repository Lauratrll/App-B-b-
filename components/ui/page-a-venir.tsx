import Link from "next/link";

// Page d'attente d'une rubrique dont le contenu reste à écrire.
export function PageAVenir({
  surtitre,
  titre,
  texte,
}: {
  surtitre: string;
  titre: string;
  texte: string;
}) {
  return (
    <section className="space-y-4">
      <Link href="/dashboard" className="text-xs text-eucal">
        ← Accueil
      </Link>
      <header className="space-y-1">
        <p
          className="text-[10px] font-semibold uppercase text-eucal"
          style={{ letterSpacing: "0.15em" }}
        >
          {surtitre}
        </p>
        <h1 className="font-display text-2xl font-semibold text-charcoal">
          {titre}
        </h1>
      </header>
      <p className="rounded-[14px] border border-black/[0.07] bg-white/50 p-5 text-sm text-charcoal">
        {texte}
      </p>
    </section>
  );
}

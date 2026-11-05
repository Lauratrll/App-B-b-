// Pictos de la rubrique « Gestes d'apaisement » : un par famille, au trait,
// dans l'esprit des pictos des slots (SVG outline, jamais d'emoji). Un geste
// prend le picto de sa PREMIÈRE famille. La couleur vient de `currentColor`.

const TRACES: Record<string, React.ReactNode> = {
  // Stop pleurs : une larme qu'une main recueille.
  stop_pleurs: (
    <>
      <path d="M12 3.5c-2.4 3-3.8 5.2-3.8 7a3.8 3.8 0 0 0 7.6 0c0-1.8-1.4-4-3.8-7Z" />
      <path d="M4.5 15.5c1.6 3 4.3 4.8 7.5 4.8s5.9-1.8 7.5-4.8" />
    </>
  ),
  // In-utéro : un cocon qui enveloppe un petit rond.
  in_utero: (
    <>
      <path d="M12 3.8c4.6 0 7.6 3.6 7.6 8.2 0 4.4-3.3 8.2-7.6 8.2S4.4 16.4 4.4 12" />
      <path d="M4.4 12c0-2.2.7-4.1 1.9-5.5" />
      <circle cx="12.6" cy="12.4" r="3" />
    </>
  ),
  // Zones de détente : une feuille souple et sa nervure.
  zones_detente: (
    <>
      <path d="M5 19c0-8 5.2-13.5 14-14-.4 8.8-6 14-14 14Z" />
      <path d="M5 19c3.2-3.6 6.2-6.5 9.4-9" />
    </>
  ),
  // Mal de ventre, gaz : la spirale du massage dans le sens du transit.
  ventre_gaz: (
    <path d="M12 12.2c0-.9.7-1.4 1.4-1.2 1 .3 1.3 1.6.7 2.5-.9 1.3-2.9 1.4-4 .3-1.5-1.4-1.3-3.9.3-5.1 2-1.6 5-1.1 6.4 1 1.7 2.5.9 6-1.7 7.5-3 1.8-7.1.8-8.7-2.3" />
  ),
  // Limites du corps : deux mains en arc qui contiennent.
  limites_corps: (
    <>
      <path d="M7 5.5C4.8 7 3.6 9.4 3.6 12s1.2 5 3.4 6.5" />
      <path d="M17 5.5c2.2 1.5 3.4 3.9 3.4 6.5s-1.2 5-3.4 6.5" />
      <circle cx="12" cy="12" r="3.4" />
    </>
  ),
  // La voix : une note et une onde.
  voix: (
    <>
      <path d="M9.5 17.5V6.2l8-1.7v10.8" />
      <circle cx="7.6" cy="17.6" r="2" />
      <circle cx="15.6" cy="15.4" r="2" />
    </>
  ),
  // Guide : un œil qui observe.
  guide: (
    <>
      <path d="M2.8 12s3.4-6 9.2-6 9.2 6 9.2 6-3.4 6-9.2 6-9.2-6-9.2-6Z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  // Cohérence cardiaque : le cœur traversé d'une onde (comme la barre du bas).
  coherence: (
    <>
      <path d="M12 19.5s-7.5-4.4-7.5-9.6A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 2.3c0 5.2-7.5 9.6-7.5 9.6Z" />
      <path d="M6.2 12.6h2.6l1.4-2.4 2 4.2 1.5-2.6h4.1" />
    </>
  ),
};

export function ApaisementIcone({ famille, taille = 18 }: { famille: string; taille?: number }) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {TRACES[famille] ?? TRACES.zones_detente}
    </svg>
  );
}

/** Le picto d'un geste : celui de sa première famille. */
export function familleDuPicto(g: { familles: string[]; type?: string }): string {
  if (g.type === "lien_coherence_cardiaque") return "coherence";
  return g.familles[0] ?? "zones_detente";
}

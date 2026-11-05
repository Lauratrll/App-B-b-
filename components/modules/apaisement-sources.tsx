"use client";

// Sources d'un geste : le déroulant « Sources » de la rubrique Sommeil
// (petit lien souligné, liste repliée), pour que toutes les catégories
// se ressemblent (choix Laura, 05/11/2026).

import { Sources } from "./sommeil-view";

const sansChangement = (t?: string) => t ?? "";

export function ApaisementSources({ sources }: { sources: string[] }) {
  return <Sources texte={sources.join(" ; ")} p={sansChangement} />;
}

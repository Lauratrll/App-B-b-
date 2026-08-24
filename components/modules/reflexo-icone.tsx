// Icône d'un protocole de Réflexologie.
//
// Source de vérité : les SVG dessinés par Laura dans reflexologie/visuels-icones/
// (un fichier `icone-<id>.svg` par protocole, en noir pur). Le script de synchro
// en extrait les tracés vers `icones-protocoles.json`, importé statiquement par
// lib/reflexologie.ts.
//
// L'icône n'a AUCUNE couleur propre : elle prend celle du texte qui l'entoure
// (`fill: currentColor`). C'est ce qui permet de la poser en noir éditorial dans
// la liste, en eucalyptus ailleurs, ou en clair sur fond foncé.

import { getIconeProtocole } from "@/lib/reflexologie";
import { REFLEXO_TEXT } from "./reflexo-design";

/**
 * L'icône du protocole `id`, à la taille demandée.
 * Un protocole sans icône dessinée retombe sur l'empreinte de pied générique,
 * plutôt que de laisser un trou dans la liste.
 */
export function ReflexoIcone({
  id,
  taille = 16,
}: {
  id: string;
  taille?: number;
}) {
  const icone = getIconeProtocole(id);
  if (!icone) return <PictoPied taille={taille} />;
  return (
    <svg
      width={taille}
      height={taille}
      viewBox={icone.viewBox}
      fill="currentColor"
      aria-hidden
      style={{ display: "block", flexShrink: 0 }}
    >
      {icone.traces.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** Empreinte de pied — le picto générique d'avant les icônes par protocole. */
function PictoPied({ taille }: { taille: number }) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke={REFLEXO_TEXT}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ display: "block", flexShrink: 0 }}
    >
      <path d="M9.2 20.5c-1.9 0-3-1.3-3-3.1 0-1.6.8-2.5.8-4.2 0-1.3-.6-2.2-.6-3.7 0-2.7 1.8-4.6 4-4.6s3.8 1.9 3.8 4.4c0 2-.9 3.1-.9 4.6 0 1.9 1 2.7 1 4.3 0 1.5-1.2 2.3-2.6 2.3z" />
      <circle cx="16.4" cy="6.6" r="1.25" />
      <circle cx="17.6" cy="10.1" r="1.05" />
    </svg>
  );
}

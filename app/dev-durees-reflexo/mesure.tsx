"use client";

// Balayage de mesure : on monte le lecteur sur un protocole, il renvoie la durée
// totale calculée par son propre moteur, on passe au suivant. Un seul lecteur à
// la fois (les SVG sont lourds), rendu invisible mais bien présent dans le DOM :
// `visibility: hidden` conserve les styles calculés et `getTotalLength()`, que
// `display: none` supprimerait.

import { useCallback, useState } from "react";
import { ReflexoLecteur } from "@/components/modules/reflexo-lecteur";
import type { ReflexoAnimStep } from "@/lib/reflexologie";

type Cas = { cle: string; titre: string; steps: ReflexoAnimStep[]; noteFin?: string };

export function MesureDurees({ cas }: { cas: Cas[] }) {
  const [i, setI] = useState(0);
  const [mesures, setMesures] = useState<Record<string, number>>({});

  const courant = cas[i];

  const enregistrer = useCallback(
    (ms: number) => {
      setMesures((m) => ({ ...m, [courant.cle]: Math.round(ms) }));
      setI((v) => v + 1);
    },
    [courant],
  );

  const fini = i >= cas.length;

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", color: "#3A3228" }}>
      <h1 style={{ fontSize: 20, margin: "0 0 6px" }}>Durées des lectures animées</h1>
      <p style={{ fontSize: 13, color: "#7A6E62", margin: "0 0 16px" }}>
        {fini
          ? `${cas.length} cas mesurés. Copier le bloc ci-dessous dans reflexologie/durees-protocoles.json.`
          : `Mesure ${i + 1} / ${cas.length} — ${courant.titre}…`}
      </p>

      {fini ? (
        <pre
          style={{
            background: "#F6F1EC",
            borderRadius: 10,
            padding: 14,
            fontSize: 12,
            lineHeight: 1.5,
            overflowX: "auto",
          }}
        >
          {JSON.stringify(
            {
              _comment:
                "Durées totales des lectures animées, en millisecondes, MESURÉES par le moteur du lecteur (page /dev-durees-reflexo). Ne pas éditer à la main : régénérer après toute modification des constantes de temps de reflexo-lecteur.tsx.",
              durees: Object.fromEntries(cas.map((c) => [c.cle, mesures[c.cle] ?? 0])),
            },
            null,
            2,
          )}
        </pre>
      ) : null}

      {!fini && courant ? (
        <div
          key={courant.cle}
          style={{ visibility: "hidden", position: "fixed", inset: 0, pointerEvents: "none" }}
        >
          <ReflexoLecteur
            steps={courant.steps}
            titre={courant.titre}
            noteFin={courant.noteFin}
            onClose={() => undefined}
            onMesure={enregistrer}
          />
        </div>
      ) : null}
    </main>
  );
}

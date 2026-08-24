// Liste des protocoles de « Réflexologie ».
// Pas de barre de recherche (choix Laura) : l'ordre est éditorial — celui de
// `protocoles-index.json` — et la liste se parcourt des yeux, ce qui vaut mieux
// que de deviner le bon mot-clé. Aucun état : composant serveur.

import Link from "next/link";
import type { ReflexoListItem } from "@/lib/reflexologie";
import { REFLEXO_MUTED, REFLEXO_TEXT, PLAYFAIR, slotReflexo } from "./reflexo-design";
import { ReflexoIcone } from "./reflexo-icone";

export function ReflexoListe({ protocoles }: { protocoles: ReflexoListItem[] }) {
  return (
    <ul style={{ display: "grid", gap: 9, listStyle: "none", margin: 0, padding: 0 }}>
      {protocoles.map((p, i) => {
        const slot = slotReflexo(i);
        return (
          <li key={p.id}>
            <Link
              href={`/reflexologie/${p.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: slot.bg,
                borderRadius: 12,
                padding: "12px 14px",
                textDecoration: "none",
              }}
            >
              {/* L'icône propre au protocole (dessinée par Laura). Elle hérite
                  de la couleur du texte, d'où le `color` posé ici. */}
              <span
                aria-hidden
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: slot.avatarBg,
                  color: REFLEXO_TEXT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ReflexoIcone id={p.id} taille={17} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: PLAYFAIR,
                    fontWeight: 600,
                    fontSize: 15,
                    color: REFLEXO_TEXT,
                    letterSpacing: "-.01em",
                    lineHeight: 1.2,
                  }}
                >
                  {p.titre}
                </span>
                <span
                  style={{
                    display: "block",
                    marginTop: 3,
                    fontSize: 11.5,
                    color: REFLEXO_MUTED,
                    lineHeight: 1.35,
                  }}
                >
                  {p.accroche}
                </span>
              </span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke={REFLEXO_TEXT}
                strokeWidth="1.7"
                strokeLinecap="round"
                aria-hidden
                style={{ flexShrink: 0 }}
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

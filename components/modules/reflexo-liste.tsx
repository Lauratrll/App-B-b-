"use client";

// Liste des protocoles de « Réflexologie » avec recherche par situation.
// Le parent cherche par PROBLÈME (« mon bébé ne dort pas », « coliques »),
// jamais par zone ou par organe — la recherche porte donc sur le titre,
// l'accroche et la catégorie Guide-moi associée.

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReflexoListItem } from "@/lib/reflexologie";
import { REFLEXO_MUTED, REFLEXO_TEXT, PLAYFAIR, slotReflexo } from "./reflexo-design";

// Retire les accents pour une recherche tolérante. Le RegExp est construit à
// partir d'une chaîne échappée (̀–ͯ = diacritiques combinants) afin
// d'éviter le flag Unicode `u`, indisponible sans cible ES6.
const DIACRITIQUES = new RegExp("[\\u0300-\\u036f]", "g");

function normaliser(s: string): string {
  return s.normalize("NFD").replace(DIACRITIQUES, "").toLowerCase();
}

export function ReflexoListe({ protocoles }: { protocoles: ReflexoListItem[] }) {
  const [recherche, setRecherche] = useState("");

  const resultats = useMemo(() => {
    const q = normaliser(recherche.trim());
    if (!q) return protocoles;
    // Chaque mot doit être trouvé quelque part : « bebe dort » matche Sommeil.
    const mots = q.split(/\s+/);
    return protocoles.filter((p) => {
      const foin = normaliser(
        [p.titre, p.accroche, p.categorie_guide_moi ?? ""].join(" "),
      );
      return mots.every((m) => foin.includes(m));
    });
  }, [protocoles, recherche]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label htmlFor="reflexo-recherche" className="sr-only">
          Rechercher une situation
        </label>
        <input
          id="reflexo-recherche"
          type="search"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher une situation…"
          autoComplete="off"
          style={{
            width: "100%",
            borderRadius: 11,
            border: "1px solid rgba(58,50,40,.14)",
            background: "#fff",
            padding: "10px 13px",
            fontSize: 14,
            color: REFLEXO_TEXT,
            outline: "none",
          }}
        />
      </div>

      {resultats.length === 0 ? (
        <p
          style={{
            fontSize: 13,
            color: REFLEXO_MUTED,
            fontStyle: "italic",
            lineHeight: 1.5,
            padding: "6px 2px",
          }}
        >
          Aucun protocole ne correspond à cette recherche. Essaie un mot plus
          simple : « sommeil », « coliques », « dents »…
        </p>
      ) : (
        <ul style={{ display: "grid", gap: 9, listStyle: "none", margin: 0, padding: 0 }}>
          {resultats.map((p, i) => {
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
                  <span
                    aria-hidden
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: slot.avatarBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={REFLEXO_TEXT}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {/* Empreinte de pied : plante + orteils */}
                      <path d="M9.2 20.5c-1.9 0-3-1.3-3-3.1 0-1.6.8-2.5.8-4.2 0-1.3-.6-2.2-.6-3.7 0-2.7 1.8-4.6 4-4.6s3.8 1.9 3.8 4.4c0 2-.9 3.1-.9 4.6 0 1.9 1 2.7 1 4.3 0 1.5-1.2 2.3-2.6 2.3z" />
                      <circle cx="16.4" cy="6.6" r="1.25" />
                      <circle cx="17.6" cy="10.1" r="1.05" />
                    </svg>
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
      )}
    </div>
  );
}

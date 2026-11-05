"use client";

// Onglets de familles + liste des gestes de la rubrique « Gestes d'apaisement ».
// Les onglets passent à la ligne (jamais de défilement horizontal, SKILL_ui).
// Le dernier onglet consulté est gardé dans un cookie (lu côté serveur à
// l'ouverture suivante, donc sans clignotement) ; la page retombe sur « Tous »
// s'il est masqué ce mois-ci (brief §4.3).

import Link from "next/link";
import { useState } from "react";
import type { Geste, Onglet } from "@/lib/apaisement";
import { APAISEMENT, PLAYFAIR } from "./apaisement-design";
import { ApaisementIcone, familleDuPicto } from "./apaisement-icone";

const UN_AN = 60 * 60 * 24 * 365;

export function ApaisementOnglets({
  onglets,
  gestes,
  ongletInitial,
  cookie,
}: {
  onglets: Onglet[];
  gestes: Geste[];
  ongletInitial: string;
  cookie: string;
}) {
  const [actif, setActif] = useState(ongletInitial);

  function choisir(id: string) {
    setActif(id);
    try {
      document.cookie = `${cookie}=${encodeURIComponent(id)}; path=/; max-age=${UN_AN}; samesite=lax`;
    } catch {
      // Cookies bloqués : l'onglet est seulement oublié à la prochaine visite.
    }
  }

  const affiches = actif === "tous" ? gestes : gestes.filter((g) => g.familles.includes(actif));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div role="tablist" aria-label="Familles de gestes" style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {onglets.map((o) => {
          const estActif = o.id === actif;
          return (
            <button
              key={o.id}
              type="button"
              role="tab"
              aria-selected={estActif}
              onClick={() => choisir(o.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                minHeight: 36,
                padding: "0 13px",
                borderRadius: 999,
                border: estActif ? `1px solid ${APAISEMENT.profond}` : "1px solid rgba(0,0,0,.07)",
                background: estActif ? APAISEMENT.profond : "rgba(255,255,255,.55)",
                color: estActif ? "#FFFFFF" : APAISEMENT.texte,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background .15s, color .15s",
              }}
            >
              {o.label}
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  opacity: estActif ? 0.85 : 0.55,
                }}
              >
                {o.nombre}
              </span>
            </button>
          );
        })}
      </div>

      <ul role="tabpanel" style={{ display: "grid", gap: 9, listStyle: "none", margin: 0, padding: 0 }}>
        {affiches.map((g) => (
          <li key={g.id}>
            <LigneGeste geste={g} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function LigneGeste({ geste }: { geste: Geste }) {
  const coherence = geste.type === "lien_coherence_cardiaque";
  const href = coherence ? "/coherence" : `/apaisement/${geste.id}`;
  // Accroche : l'objectif du geste, sans libellé (brief §4.4). La cohérence
  // cardiaque n'en a pas encore (ses textes restent à écrire).
  const accroche = coherence ? null : geste.objectif;

  return (
    <Link
      prefetch
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: APAISEMENT.bg,
        borderRadius: 12,
        padding: "12px 14px",
        textDecoration: "none",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: APAISEMENT.avatarBg,
          color: APAISEMENT.texte,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ApaisementIcone famille={familleDuPicto(geste)} taille={17} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontFamily: PLAYFAIR,
            fontWeight: 600,
            fontSize: 15,
            color: APAISEMENT.texte,
            letterSpacing: "-.01em",
            lineHeight: 1.2,
          }}
        >
          {geste.titre}
        </span>
        {accroche ? (
          <span
            style={{
              display: "block",
              marginTop: 3,
              fontSize: 11.5,
              color: APAISEMENT.profond,
              lineHeight: 1.35,
            }}
          >
            {accroche.replace(/\*+/g, "")}
          </span>
        ) : null}
      </span>
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke={APAISEMENT.texte}
        strokeWidth="1.7"
        strokeLinecap="round"
        aria-hidden
        style={{ flexShrink: 0 }}
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

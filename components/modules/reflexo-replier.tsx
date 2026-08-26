"use client";

// Le repli de bas de bloc : une flèche discrète à la fin de l'introduction,
// pour la refermer sans avoir à remonter tout le texte jusqu'au titre.
//
// Pourquoi un composant client alors que la brique est un `<details>` natif :
// seul le PREMIER `<summary>` d'un `<details>` bascule l'ouverture, on ne peut
// donc pas en poser un second en bas. Ces quelques lignes sont le prix à payer
// pour un dépliable qui se referme par les deux bouts.

import { REFLEXO_FOND_LECTEUR_TEXTE } from "./reflexo-design";

export function ReflexoReplier({ libelle = "Replier" }: { libelle?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        const bloc = e.currentTarget.closest("details");
        if (!bloc) return;
        bloc.open = false;
        // Une fois replié, le bloc remonte : on le ramène sous les yeux du
        // parent, sinon il se retrouve à regarder la liste sans savoir d'où
        // elle sort.
        bloc.scrollIntoView({ block: "nearest" });
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        width: "100%",
        // 44 px de haut : la cible tactile recommandée, même si la flèche est petite.
        minHeight: 44,
        marginTop: 14,
        padding: 0,
        border: "none",
        background: "transparent",
        color: REFLEXO_FOND_LECTEUR_TEXTE,
        fontSize: 9,
        letterSpacing: ".13em",
        textTransform: "uppercase",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {libelle}
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke={REFLEXO_FOND_LECTEUR_TEXTE}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 15l6-6 6 6" />
      </svg>
    </button>
  );
}

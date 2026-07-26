import { requireProfile } from "@/lib/auth";
import { accueilReflexo, getProtocolesPublies } from "@/lib/reflexologie";
import { ReflexoListe } from "@/components/modules/reflexo-liste";
import {
  PLAYFAIR,
  REFLEXO_BG_CADRE,
  REFLEXO_BG_DOUX,
  REFLEXO_MUTED,
  REFLEXO_TEXT,
} from "@/components/modules/reflexo-design";

// Onglet « Réflexologie plantaire » — remplace l'onglet « Jeux ».
// Consignes : reflexologie/CONSIGNES_CLAUDE_CODE_onglet_reflexologie.md
// Le bloc « Bienvenue » est toujours en 1re position, avant la liste.

export default async function ReflexologiePage() {
  await requireProfile();
  const protocoles = getProtocolesPublies();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* En-tête : titre Playfair + sous-titre capitales Eucalyptus */}
      <header style={{ textAlign: "center", padding: "4px 0 2px" }}>
        <h1
          style={{
            fontFamily: PLAYFAIR,
            fontWeight: 700,
            fontSize: 26,
            color: REFLEXO_TEXT,
            letterSpacing: "-.015em",
            lineHeight: 1.1,
            margin: "0 0 8px 0",
          }}
        >
          Réflexologie plantaire
        </h1>
        <p
          style={{
            fontSize: 9,
            color: REFLEXO_MUTED,
            letterSpacing: ".15em",
            textTransform: "uppercase",
            fontWeight: 600,
            margin: 0,
          }}
        >
          Apaiser bébé
        </p>
      </header>

      {/* Introduction — PREMIÈRE BRIQUE de la catégorie, à OUVRIR (fermée par
          défaut). Pas un protocole : présentation + précautions, à lire une fois.
          <details>/<summary> natif → dépliable sans JS (composant serveur). */}
      {/* Masque le marqueur natif (dont ::-webkit-details-marker pour iOS) et
          fait pivoter le chevron à l'ouverture — impossible en style inline. */}
      <style>{`
        details.reflexo-intro > summary { list-style: none; }
        details.reflexo-intro > summary::-webkit-details-marker { display: none; }
        details.reflexo-intro[open] .reflexo-chevron { transform: rotate(180deg); }
      `}</style>
      <details
        className="reflexo-intro"
        style={{
          background: REFLEXO_BG_DOUX,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <summary
          style={{
            listStyle: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
          }}
        >
          <span style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                display: "block",
                fontFamily: PLAYFAIR,
                fontWeight: 700,
                fontSize: 18,
                color: REFLEXO_TEXT,
                lineHeight: 1.2,
              }}
            >
              {accueilReflexo.titre}
            </span>
            <span
              style={{
                display: "block",
                marginTop: 3,
                fontSize: 9,
                color: REFLEXO_MUTED,
                letterSpacing: ".13em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {accueilReflexo.sous_titre}
            </span>
          </span>
          {/* Chevron — pivote quand la brique est ouverte (details[open]). */}
          <svg
            className="reflexo-chevron"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke={REFLEXO_TEXT}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            style={{ flexShrink: 0, transition: "transform .2s" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </summary>

        <div style={{ padding: "0 16px 18px" }}>
          {accueilReflexo.presentation.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: 13.5,
                lineHeight: 1.6,
                color: REFLEXO_TEXT,
                margin: i === 0 ? 0 : "10px 0 0 0",
              }}
            >
              {p}
            </p>
          ))}

          <h3
            style={{
              fontSize: 10,
              color: REFLEXO_MUTED,
              letterSpacing: ".13em",
              textTransform: "uppercase",
              fontWeight: 700,
              margin: "18px 0 9px 0",
            }}
          >
            {accueilReflexo.precautions_titre}
          </h3>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 9 }}>
            {accueilReflexo.precautions.map((p) => (
              <li
                key={p.cle}
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: REFLEXO_TEXT,
                    margin: "0 0 3px 0",
                    lineHeight: 1.3,
                  }}
                >
                  {p.cle}
                </p>
                <p
                  style={{
                    fontSize: 12.5,
                    lineHeight: 1.55,
                    color: REFLEXO_TEXT,
                    opacity: 0.85,
                    margin: 0,
                  }}
                >
                  {p.texte}
                </p>
              </li>
            ))}
          </ul>

          {accueilReflexo.note_fin ? (
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: REFLEXO_TEXT,
                fontStyle: "italic",
                margin: "14px 0 0 0",
              }}
            >
              {accueilReflexo.note_fin}
            </p>
          ) : null}
        </div>
      </details>

      {/* Liste des protocoles publiés + recherche par situation */}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2
          style={{
            fontSize: 10,
            color: REFLEXO_MUTED,
            letterSpacing: ".13em",
            textTransform: "uppercase",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Les protocoles
        </h2>
        {protocoles.length === 0 ? (
          <p style={{ fontSize: 13, color: REFLEXO_MUTED, fontStyle: "italic" }}>
            Aucun protocole n&apos;est publié pour le moment.
          </p>
        ) : (
          <ReflexoListe protocoles={protocoles} />
        )}
      </section>

      {/* Disclaimer — toujours affiché */}
      <p
        style={{
          background: REFLEXO_BG_CADRE,
          borderRadius: 11,
          padding: "11px 13px",
          fontSize: 11,
          lineHeight: 1.5,
          color: REFLEXO_TEXT,
          opacity: 0.9,
          fontStyle: "italic",
          margin: 0,
        }}
      >
        {accueilReflexo.disclaimer}
      </p>
    </div>
  );
}

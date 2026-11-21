import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { accueilReflexo, getProtocolesPublies } from "@/lib/reflexologie";
import { ReflexoListe } from "@/components/modules/reflexo-liste";
import { ReflexoReplier } from "@/components/modules/reflexo-replier";
import {
  ReflexoHautFixe,
  ReflexoPhoto,
  REFLEXO_PHOTO_CHEVAUCHEMENT,
} from "@/components/modules/reflexo-photo";
import {
  PLAYFAIR,
  REFLEXO_MUTED,
  REFLEXO_TEXT,
  REFLEXO_FOND_LECTEUR,
  REFLEXO_FOND_LECTEUR_TEXTE,
  texteGras,
} from "@/components/modules/reflexo-design";

// Onglet « Réflexologie plantaire » — remplace l'onglet « Jeux ».
// Consignes : content/reflexologie/CONSIGNES_CLAUDE_CODE_onglet_reflexologie.md
// Le bloc « Bienvenue » est toujours en 1re position, avant la liste.

export default async function ReflexologiePage() {
  const { profile } = await requireProfile();
  // Seulement les protocoles de la tranche d'âge de bébé (30/10/2026).
  const protocoles = getProtocolesPublies(getBabyMonth(new Date(profile.birthdate)));

  return (
    // 8 px de marge latérale sur TOUTE la page : l'introduction, le titre
    // « Les séquences » et les cases sont ferrés sur la même ligne.
    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "0 8px" }}>
      {/* Haut de page fixe : les séquences défilent sous « Les séquences ». */}
      <ReflexoHautFixe>
      {/* En-tête : photo bord à bord, titre et sous-titre posés dessus */}
      <ReflexoPhoto />

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
      {/* L'introduction n'est PAS un protocole : elle reprend le fond du
          lecteur animé (choix Laura, 25/08). Plus foncée que les fonds de la
          gamme, elle se détache de la liste ET annonce ce que le parent verra
          en lançant une animation. */}
      <details
        className="reflexo-intro"
        style={{
          position: "relative",
          // 14 px = l'écart du haut de page, à annuler pour chevaucher vraiment la photo.
          marginTop: -(14 + REFLEXO_PHOTO_CHEVAUCHEMENT),
          background: REFLEXO_FOND_LECTEUR,
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
                color: REFLEXO_FOND_LECTEUR_TEXTE,
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
              {texteGras(p)}
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
                  {texteGras(p.texte)}
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
              {texteGras(accueilReflexo.note_fin)}
            </p>
          ) : null}

          {/* Repli de bas de bloc : l'introduction est longue, on doit pouvoir
              la refermer là où on finit de la lire, sans remonter au titre. */}
          <ReflexoReplier />
        </div>
      </details>

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
          Les séquences
        </h2>
      </ReflexoHautFixe>

      {/* Liste des séquences publiées, dans l'ordre éditorial de l'index */}
      <section style={{ display: "flex", flexDirection: "column" }}>
        {protocoles.length === 0 ? (
          <p style={{ fontSize: 13, color: REFLEXO_MUTED, fontStyle: "italic" }}>
            Aucune séquence n&apos;est publiée pour le moment.
          </p>
        ) : (
          <ReflexoListe protocoles={protocoles} />
        )}
      </section>

      {/* Disclaimer — note discrète, POSÉE SUR LE FOND, sans encart (choix
          Laura) : c'est une mention légale, pas un bloc de contenu. */}
      <p
        style={{
          padding: "0 2px",
          fontSize: 11,
          lineHeight: 1.5,
          color: REFLEXO_TEXT,
          opacity: 0.7,
          fontStyle: "italic",
          // 28 px en bas : les boutons ronds de la barre dépassent au-dessus d'elle.
          margin: "18px 0 28px",
        }}
      >
        {accueilReflexo.disclaimer}
      </p>
    </div>
  );
}

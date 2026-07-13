import React from "react";
import type { ProtocoleGuide } from "@/lib/content";

// ----------------------------------------------------------------------------
// Composant d'affichage d'un protocole Guide-moi !
// Spec de référence : skills/CONSIGNES_CLAUDE_CODE_guide-moi.md
//
// Règles imposées par le spec :
//  - 8 blocs colorés, ordre figé
//  - Amorce avant le premier ":" en gras
//  - On NE réaffiche PAS `situation` (déjà servi comme libellé de bouton)
//  - Les `couleur_fond` / `couleur_texte` du JSON sont IGNORÉS — couleurs
//    pilotées par ce composant.
// ----------------------------------------------------------------------------

const C = {
  text: "#3A3228",
  cequisepasse: { bg: "#E8F0F2", accent: "#8FB4BC", label: "#3A5A64" },
  pourtoiparent: { bg: "#F8E0D8", accent: "#E0A48E", label: "#8A4030" },
  actionimm: { bg: "#F5D0C8", accent: "#D4604A", label: "#8A3020" },
  pourallerplus: { bg: "#F8DBC8", accent: "#DB936B", label: "#9A4F2A" },
  gestedoux: { bg: "#DCE9CF", accent: "#82A56A", label: "#3F5C2E" },
  principe: { bg: "#E8F0F2", accent: "#8A9E98", label: "#384E48" },
  erreurs: {
    bg: "#E4DDD6",
    accent: "#B4A89C",
    label: "#5A4A40",
    croix: "#D4604A",
  },
  cadre: {
    bg: "#EDE9E4",
    accent: "#D4604A",
    label: "#8A3020",
    textBody: "#5A4A40",
  },
};

/* Met en gras la partie avant le premier séparateur d'amorce.
 * Séparateurs reconnus : ":" et tiret cadratin "—" (le premier qui apparaît).
 * Le séparateur d'origine est conservé tel quel après l'amorce en gras. */
function LigneAvecAmorce({ texte }: { texte: string }) {
  const iColon = texte.indexOf(":");
  const iDash = texte.indexOf("—");
  const candidats = [iColon, iDash].filter((i) => i !== -1);
  if (candidats.length === 0) return <>{texte}</>;
  const i = Math.min(...candidats);
  const sep = texte[i];
  return (
    <>
      <strong style={{ fontWeight: 700 }}>
        {texte.slice(0, i).trim()} {sep}
      </strong>
      {texte.slice(i + 1)}
    </>
  );
}

const labelStyle = (color: string): React.CSSProperties => ({
  fontSize: 9,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: ".07em",
  color,
  marginBottom: 6,
});

function EncartSimple({
  label,
  color,
  accent,
  bg,
  italic,
  children,
}: {
  label: string;
  color: string;
  accent: string;
  bg: string;
  italic?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: bg,
        borderLeft: `3px solid ${accent}`,
        borderRadius: "0 12px 12px 0",
        padding: "11px 13px",
        marginBottom: 8,
      }}
    >
      <div style={labelStyle(color)}>{label}</div>
      <div
        style={{
          fontSize: 11,
          color,
          lineHeight: 1.55,
          fontStyle: italic ? "italic" : "normal",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function EncartEtapes({
  titre,
  etapes,
  theme,
}: {
  titre: string;
  etapes: string[];
  theme: { bg: string; accent: string; label: string };
}) {
  return (
    <div
      style={{
        background: theme.bg,
        borderLeft: `3px solid ${theme.accent}`,
        borderRadius: "0 12px 12px 0",
        padding: "11px 13px",
        marginBottom: 8,
      }}
    >
      <div style={{ ...labelStyle(theme.label), marginBottom: 7 }}>{titre}</div>
      {etapes.map((step, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 6,
            alignItems: "flex-start",
            marginBottom: 5,
          }}
        >
          <div
            style={{
              width: 17,
              height: 17,
              borderRadius: "50%",
              fontSize: 9,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
              background: theme.accent,
              color: "#FFFFFF",
            }}
          >
            {i + 1}
          </div>
          <div style={{ fontSize: 11, color: C.text, lineHeight: 1.5 }}>
            <LigneAvecAmorce texte={step} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProtocoleView({ protocole }: { protocole: ProtocoleGuide }) {
  const p = protocole;
  return (
    <div style={{ padding: "14px 16px 80px" }}>
      {/* Titre seul — NE PAS afficher p.situation ici (doublon) */}
      <h1
        style={{
          fontSize: 17,
          fontWeight: 600,
          color: C.text,
          lineHeight: 1.25,
          margin: "0 0 14px",
          fontFamily: "Georgia, serif",
        }}
      >
        {p.titre}
      </h1>

      {/* 1. Ce qui se passe */}
      <EncartSimple
        label="Ce qui se passe"
        color={C.cequisepasse.label}
        bg={C.cequisepasse.bg}
        accent={C.cequisepasse.accent}
      >
        {p.explication}
      </EncartSimple>

      {/* 2. Pour toi, parent */}
      <EncartSimple
        label="Pour toi, parent"
        color={C.pourtoiparent.label}
        bg={C.pourtoiparent.bg}
        accent={C.pourtoiparent.accent}
        italic
      >
        {p.ancrage}
      </EncartSimple>

      {/* 3. Action immédiate */}
      <EncartEtapes
        titre={p.action_immediate.titre}
        etapes={p.action_immediate.etapes}
        theme={C.actionimm}
      />

      {/* 4. Pour aller plus loin */}
      <div
        style={{
          background: C.pourallerplus.bg,
          borderLeft: `3px solid ${C.pourallerplus.accent}`,
          borderRadius: "0 12px 12px 0",
          padding: "11px 13px",
          marginBottom: 8,
        }}
      >
        <div style={{ ...labelStyle(C.pourallerplus.label), marginBottom: 7 }}>
          Pour aller plus loin
        </div>
        {p.pour_aller_plus_loin.map((pt, i) => (
          <div
            key={i}
            style={{
              fontSize: 11,
              color: C.text,
              lineHeight: 1.5,
              marginBottom: 5,
            }}
          >
            <LigneAvecAmorce texte={pt} />
          </div>
        ))}
      </div>

      {/* 5. Geste doux */}
      <EncartEtapes
        titre={p.geste_doux.titre}
        etapes={p.geste_doux.etapes}
        theme={C.gestedoux}
      />

      {/* 6. Principe à retenir */}
      <EncartSimple
        label="Principe à retenir"
        color={C.principe.label}
        bg={C.principe.bg}
        accent={C.principe.accent}
      >
        {p.principe}
      </EncartSimple>

      {/* 7. Erreurs à éviter — croix rouges */}
      <div
        style={{
          background: C.erreurs.bg,
          borderLeft: `3px solid ${C.erreurs.accent}`,
          borderRadius: "0 12px 12px 0",
          padding: "11px 13px",
          marginBottom: 8,
        }}
      >
        <div style={{ ...labelStyle(C.erreurs.label), marginBottom: 7 }}>
          Erreurs à éviter
        </div>
        {p.erreurs_a_eviter.map((err, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 7,
              alignItems: "flex-start",
              marginBottom: 5,
            }}
          >
            <span
              style={{
                color: C.erreurs.croix,
                fontWeight: 700,
                fontSize: 12,
                lineHeight: 1.4,
                flexShrink: 0,
              }}
            >
              ✕
            </span>
            <div
              style={{
                fontSize: 11,
                color: C.erreurs.label,
                lineHeight: 1.5,
              }}
            >
              {err}
            </div>
          </div>
        ))}
      </div>

      {/* 8. Cadre de sécurité — cadre rouge complet */}
      <div
        style={{
          background: C.cadre.bg,
          border: `1px solid ${C.cadre.accent}`,
          borderRadius: 10,
          padding: "11px 13px",
          marginBottom: 0,
        }}
      >
        <div style={labelStyle(C.cadre.label)}>Cadre de sécurité</div>
        <div
          style={{
            fontSize: 11,
            color: C.cadre.textBody,
            lineHeight: 1.55,
          }}
        >
          {p.consulter_si}
        </div>
      </div>

      {/* 9. Source — ligne discrete, optionnelle, hors encart */}
      {p.source && (
        <div
          style={{
            marginTop: 10,
            paddingTop: 8,
            borderTop: "0.5px solid #E4DDD6",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 400,
              fontStyle: "italic",
              color: "#8A9E98",
              lineHeight: 1.4,
            }}
          >
            {p.source}
          </div>
        </div>
      )}
    </div>
  );
}

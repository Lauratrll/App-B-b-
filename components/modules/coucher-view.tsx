"use client";

import React, { useState } from "react";
import type { CoucherModule } from "@/lib/content";

// ----------------------------------------------------------------------------
// Composant d'affichage du module « Préparer le coucher »
// Spec de référence : skills/SKILL_rubriques.md §4.2 (e — rendu visuel).
//
// Reprend le système des protocoles Guide-moi (cf. protocole-view.tsx) :
//  - encarts à bordure gauche 3px, borderRadius '0 12px 12px 0'
//  - labels 9px capitales, letter-spacing .07em
//  - titre Georgia serif
//  - pastilles numérotées pleines (chiffre blanc)
//
// 9 blocs dans l'ordre IMPOSÉ (ne jamais réordonner) :
//  1 Ce qui se passe · 2 Repères clés · 3 Signaux de fatigue · 4 Rituel pas à
//  pas · 5 Réflexologie · 6 Berceuse Rituel · 7 La place du co-parent ·
//  8 Erreurs à éviter · 9 Cadre de sécurité / consulter si
//
// Les blocs longs (Réflexologie, Berceuse) sont des fenêtres déroulables,
// fermées par défaut, pour faciliter l'aperçu rapide des autres sections.
// ----------------------------------------------------------------------------

const C = {
  text: "#3A3228",
  cequisepasse: { bg: "#E8F0F2", accent: "#8FB4BC", label: "#3A5A64" },
  reperes: { bg: "#EDE0D4", accent: "#C89878", label: "#7A5038" },
  signaux: { bg: "#F8DBC8", accent: "#DB936B", label: "#9A4F2A" },
  reflexo: { bg: "#DCE9CF", accent: "#82A56A", label: "#3F5C2E" },
  berceuse: { bg: "#F8E0D8", accent: "#E0A48E", label: "#8A4030" },
  coparent: { bg: "#D4E0DC", accent: "#8A9E98", label: "#384E48" },
  erreurs: { bg: "#E4DDD6", accent: "#B4A89C", label: "#5A4A40", croix: "#D4604A" },
  cadre: { bg: "#EDE9E4", accent: "#D4604A", label: "#8A3020", textBody: "#5A4A40" },
};

// Rituel pas à pas — camaïeu bleu progressif (jour → nuit, étapes 1 → 6).
const RITUEL = [
  { bg: "#ECF2F5", accent: "#6E97A6" },
  { bg: "#E0EAEF", accent: "#628D9E" },
  { bg: "#D3E1E8", accent: "#568397" },
  { bg: "#C6D8E1", accent: "#4A7990" },
  { bg: "#B7CEDB", accent: "#3E6F89" },
  { bg: "#A8C3D4", accent: "#326582" },
];

function personaliser(texte: string, prenom: string): string {
  return texte.replaceAll("[Prénom]", prenom).replaceAll("[prénom]", prenom);
}

const labelStyle = (color: string): React.CSSProperties => ({
  fontSize: 9,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: ".07em",
  color,
  marginBottom: 6,
});

const encartBase = (accent: string, bg: string): React.CSSProperties => ({
  background: bg,
  borderLeft: `3px solid ${accent}`,
  borderRadius: "0 12px 12px 0",
  padding: "11px 13px",
  marginBottom: 8,
});

const sousTitreStyle = (color: string): React.CSSProperties => ({
  fontSize: 9,
  color,
  fontWeight: 600,
});

/* Encart de texte simple (un paragraphe). */
function EncartTexte({
  label,
  theme,
  italic,
  children,
}: {
  label: string;
  theme: { bg: string; accent: string; label: string };
  italic?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={encartBase(theme.accent, theme.bg)}>
      <div style={labelStyle(theme.label)}>{label}</div>
      <div
        style={{
          fontSize: 11,
          color: theme.label,
          lineHeight: 1.55,
          fontStyle: italic ? "italic" : "normal",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* Encart contenant une liste à puces (Repères clés, Signaux de fatigue). */
function EncartListe({
  label,
  theme,
  items,
}: {
  label: string;
  theme: { bg: string; accent: string; label: string };
  items: string[];
}) {
  return (
    <div style={encartBase(theme.accent, theme.bg)}>
      <div style={{ ...labelStyle(theme.label), marginBottom: 7 }}>{label}</div>
      {items.map((it, i) => (
        <Puce key={i} accent={theme.accent} color={theme.label} texte={it} />
      ))}
    </div>
  );
}

function Puce({
  accent,
  color,
  texte,
}: {
  accent: string;
  color: string;
  texte: string;
}) {
  return (
    <div style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 5 }}>
      <span style={{ color: accent, fontWeight: 700, lineHeight: 1.5, flexShrink: 0 }}>
        •
      </span>
      <div style={{ fontSize: 11, color, lineHeight: 1.5 }}>{texte}</div>
    </div>
  );
}

/* Encart déroulable : l'en-tête (label + sous-titre + chevron) reste visible,
 * le contenu s'ouvre/se ferme au clic. Fermé par défaut. */
function EncartDeroulant({
  label,
  sousTitre,
  theme,
  defaultOpen = false,
  children,
}: {
  label: string;
  sousTitre?: string;
  theme: { bg: string; accent: string; label: string };
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={encartBase(theme.accent, theme.bg)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          all: "unset",
          boxSizing: "border-box",
          display: "flex",
          width: "100%",
          gap: 8,
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <span>
          <span style={{ ...labelStyle(theme.label), marginBottom: 0, display: "block" }}>
            {label}
          </span>
          {sousTitre ? (
            <span style={{ ...sousTitreStyle(theme.accent), display: "block", marginTop: 2 }}>
              {sousTitre}
            </span>
          ) : null}
        </span>
        <span
          aria-hidden
          style={{
            color: theme.accent,
            fontSize: 12,
            lineHeight: 1,
            transition: "transform .2s ease",
            transform: open ? "rotate(180deg)" : "none",
            flexShrink: 0,
          }}
        >
          ▾
        </span>
      </button>
      {open ? <div style={{ marginTop: 10 }}>{children}</div> : null}
    </div>
  );
}

/* Picto en-tête : lune croissant + petite étoile. */
function LuneEtoile() {
  return (
    <svg
      width={36}
      height={36}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ display: "block", margin: "0 auto" }}
    >
      <path
        d="M17.5 14.2A6.2 6.2 0 1 1 10.4 6.6a4.8 4.8 0 0 0 7.1 7.6z"
        stroke="#4A7990"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <path
        d="M17.8 4.6l.62 1.42 1.42.62-1.42.62-.62 1.42-.62-1.42-1.42-.62 1.42-.62z"
        fill="#7BA6B6"
      />
    </svg>
  );
}

export function CoucherView({
  coucher,
  babyName,
}: {
  coucher: CoucherModule;
  babyName: string;
}) {
  const reflexo = coucher.reflexologie_du_coucher;
  const berceuse = coucher.script_audio_du_soir;

  return (
    <div style={{ padding: "4px 16px 80px" }}>
      {/* En-tête : picto lune + étoile centré, titre Georgia, kicker */}
      <header style={{ textAlign: "center", marginBottom: 18 }}>
        <LuneEtoile />
        <h1
          style={{
            fontSize: 19,
            fontWeight: 600,
            color: C.text,
            lineHeight: 1.25,
            margin: "8px 0 4px",
            fontFamily: "Georgia, serif",
          }}
        >
          {coucher.titre_rubrique ?? "Préparer le coucher"}
        </h1>
        {coucher.sous_titre ? (
          <p
            style={{
              fontSize: 9,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".07em",
              color: C.reflexo.accent,
              margin: 0,
            }}
          >
            {coucher.sous_titre}
          </p>
        ) : null}
      </header>

      {/* 1. Ce qui se passe */}
      {coucher.description ? (
        <EncartTexte label="Ce qui se passe" theme={C.cequisepasse}>
          {coucher.description}
        </EncartTexte>
      ) : null}

      {/* 2. Repères clés */}
      {coucher.reperes_cles && coucher.reperes_cles.length > 0 ? (
        <EncartListe label="Repères clés" theme={C.reperes} items={coucher.reperes_cles} />
      ) : null}

      {/* 3. Signaux de fatigue */}
      {coucher.signaux_de_fatigue && coucher.signaux_de_fatigue.length > 0 ? (
        <EncartListe
          label="Signaux de fatigue"
          theme={C.signaux}
          items={coucher.signaux_de_fatigue}
        />
      ) : null}

      {/* 4. Rituel pas à pas — camaïeu bleu progressif */}
      {coucher.rituel_etapes && coucher.rituel_etapes.length > 0 ? (
        <div style={{ marginBottom: 8 }}>
          <div style={{ ...labelStyle(C.cequisepasse.label), marginBottom: 7, paddingLeft: 2 }}>
            Rituel pas à pas
          </div>
          {coucher.rituel_etapes.map((etape, i) => {
            const t = RITUEL[i % RITUEL.length];
            return (
              <div key={etape.etape ?? i} style={encartBase(t.accent, t.bg)}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 19,
                      height: 19,
                      borderRadius: "50%",
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                      background: t.accent,
                      color: "#FFFFFF",
                    }}
                  >
                    {etape.etape ?? i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>
                      {etape.titre}
                    </div>
                    {etape.horaire || etape.duree ? (
                      <div style={{ ...sousTitreStyle(t.accent), marginTop: 2 }}>
                        {[etape.horaire, etape.duree].filter(Boolean).join(" · ")}
                      </div>
                    ) : null}
                    <div style={{ fontSize: 11, color: C.text, lineHeight: 1.5, marginTop: 4 }}>
                      {personaliser(etape.description, babyName)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* 5. Réflexologie — déroulable */}
      {reflexo ? (
        <EncartDeroulant
          label={reflexo.titre}
          sousTitre={[reflexo.duree_totale, reflexo.pression].filter(Boolean).join(" · ") || undefined}
          theme={C.reflexo}
        >
          {reflexo.intro ? (
            <div
              style={{
                fontSize: 11,
                color: C.reflexo.label,
                lineHeight: 1.55,
                marginBottom: 8,
              }}
            >
              {reflexo.intro}
            </div>
          ) : null}
          {reflexo.etapes.map((e, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,.5)",
                borderRadius: 8,
                padding: "8px 10px",
                marginBottom: 6,
              }}
            >
              <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
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
                    background: C.reflexo.accent,
                    color: "#FFFFFF",
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.reflexo.label }}>
                    {e.zone}
                    {e.duree ? (
                      <span style={{ fontWeight: 400, color: C.reflexo.accent }}> · {e.duree}</span>
                    ) : null}
                  </div>
                  <div style={{ fontSize: 11, color: C.text, lineHeight: 1.5, marginTop: 2 }}>
                    {e.geste}
                  </div>
                  {e.ce_que_cest ? (
                    <div
                      style={{ fontSize: 10, fontStyle: "italic", color: "#6E7B72", marginTop: 2 }}
                    >
                      {e.ce_que_cest}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </EncartDeroulant>
      ) : null}

      {/* 6. Berceuse Rituel — déroulable */}
      {berceuse ? (
        <EncartDeroulant label={berceuse.titre} sousTitre={berceuse.duree} theme={C.berceuse}>
          {berceuse.instruction ? (
            <div
              style={{
                fontSize: 10,
                fontStyle: "italic",
                color: C.berceuse.label,
                lineHeight: 1.5,
                marginBottom: 8,
              }}
            >
              {berceuse.instruction}
            </div>
          ) : null}
          <div
            style={{
              fontSize: 11,
              color: C.berceuse.label,
              lineHeight: 1.7,
              whiteSpace: "pre-line",
            }}
          >
            {personaliser(berceuse.texte, babyName)}
          </div>
        </EncartDeroulant>
      ) : null}

      {/* 7. La place du co-parent */}
      {coucher.co_parent ? (
        <div style={encartBase(C.coparent.accent, C.coparent.bg)}>
          <div style={labelStyle(C.coparent.label)}>
            {coucher.co_parent.titre ?? "La place du co-parent"}
          </div>
          {coucher.co_parent.texte ? (
            <div
              style={{
                fontSize: 11,
                color: C.coparent.label,
                lineHeight: 1.55,
                marginBottom: 8,
              }}
            >
              {coucher.co_parent.texte}
            </div>
          ) : null}
          {coucher.co_parent.actions?.map((a, i) => (
            <Puce key={i} accent={C.coparent.accent} color={C.coparent.label} texte={a} />
          ))}
        </div>
      ) : null}

      {/* 8. Erreurs à éviter — croix rouges */}
      {coucher.erreurs_a_eviter && coucher.erreurs_a_eviter.length > 0 ? (
        <div style={encartBase(C.erreurs.accent, C.erreurs.bg)}>
          <div style={{ ...labelStyle(C.erreurs.label), marginBottom: 7 }}>
            Erreurs à éviter
          </div>
          {coucher.erreurs_a_eviter.map((err, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 5 }}
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
              <div style={{ fontSize: 11, color: C.erreurs.label, lineHeight: 1.5 }}>{err}</div>
            </div>
          ))}
        </div>
      ) : null}

      {/* 9. Cadre de sécurité / consulter si — cadre rouge complet */}
      {coucher.consulter_si ? (
        <div
          style={{
            background: C.cadre.bg,
            border: `1px solid ${C.cadre.accent}`,
            borderRadius: 10,
            padding: "11px 13px",
            marginBottom: 0,
          }}
        >
          <div style={labelStyle(C.cadre.label)}>Cadre de sécurité / consulter si</div>
          <div style={{ fontSize: 11, color: C.cadre.textBody, lineHeight: 1.55 }}>
            {coucher.consulter_si}
          </div>
        </div>
      ) : null}
    </div>
  );
}

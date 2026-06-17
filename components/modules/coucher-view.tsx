"use client";

import React, { useState } from "react";
import type { CoucherModule } from "@/lib/content";
import type { Genre } from "@/lib/auth";

// ----------------------------------------------------------------------------
// Écran « Préparer le coucher »
// Spec de référence : skills/CONSIGNES_CLAUDE_CODE_coucher.md (10 sections).
//
// Ordre des blocs : Ce qui se passe · Repères clés · Signaux de fatigue ·
// [Sélecteur de variante M12+] · Rituel (toujours ouvert) · Réflexologie
// (déroulant) · Berceuse (déroulant) · [Co-parent] · [Cadre de sécurité M0–M3] ·
// Erreurs à éviter. (Plus de bloc « Consulter si » dans le Coucher.)
// ----------------------------------------------------------------------------

const TEXT = "#3A3228";
const SUBTITLE = "#8A9E98"; // sous-titre de page (gris Eucalyptus) §9
const FOCUS_BORDER = "#1F4456"; // filet de l'étape de focus §4

// §5 — couleurs des blocs (Coucher uniquement)
const C = {
  cequisepasse: { bg: "#F8E0D8", accent: "#E0A48E", label: "#8A4030" },
  reperes: { bg: "#EDE0D4", accent: "#C89878", label: "#7A5038" },
  signaux: { bg: "#F8DBC8", accent: "#DB936B", label: "#9A4F2A" },
  variante: { bg: "#DCE9CF", border: "#B8CDA8" },
  reflexo: { bg: "#DCE9CF", accent: "#82A56A", label: "#3F5C2E" },
  berceuse: { bg: "#F8E0D8", accent: "#E0A48E", label: "#8A4030" },
  coparent: { bg: "#D4E0DC", accent: "#8A9E98", label: "#384E48" },
  erreurs: { bg: "#E4DDD6", accent: "#B4A89C", label: "#5A4A40", croix: "#D4604A" },
};

// §4 — rituel pas à pas, camaïeu bleu clair → foncé (jusqu'à 7 crans).
const RITUEL = [
  { bg: "#ECF2F5", accent: "#6E97A6" },
  { bg: "#E0EAEF", accent: "#628D9E" },
  { bg: "#D3E1E8", accent: "#568397" },
  { bg: "#C6D8E1", accent: "#4A7990" },
  { bg: "#B7CEDB", accent: "#3E6F89" },
  { bg: "#A8C3D4", accent: "#326582" },
  { bg: "#98B4C9", accent: "#2A5673" },
];

const TEASER_REFLEXO = "Six points sur ses pieds pour relâcher tout son petit corps.";
const TEASER_BERCEUSE = "Quelques mots à murmurer pour refermer la journée.";

// ----------------------------------------------------------------------------
// Personnalisation : prénom + genre.
// Format genré du JSON : [masculin/féminin] (masculin en premier).
//   genre === 'fille'  → 2e forme ; sinon (garçon ou non renseigné) → 1re.
// [prénom] / [Prénom] → babyName.
// ----------------------------------------------------------------------------
function personaliser(
  texte: string | undefined,
  prenom: string,
  genre: Genre | null,
): string {
  if (!texte) return "";
  return texte
    .replaceAll("[Prénom]", prenom)
    .replaceAll("[prénom]", prenom)
    .replace(/\[([^\]/]+)\/([^\]]*)\]/g, genre === "fille" ? "$2" : "$1");
}

// §9 — amorce en gras : coupe sur le premier « : » ou « — ».
function LigneAvecAmorce({ texte }: { texte: string }) {
  const m = texte.match(/^(.*?)(\s*[:—])(\s*)([\s\S]*)$/);
  if (!m) return <>{texte}</>;
  return (
    <>
      <strong style={{ fontWeight: 700 }}>{m[1]}</strong>
      {m[2]}
      {m[3]}
      {m[4]}
    </>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: ".07em",
};

const encartBase = (accent: string, bg: string): React.CSSProperties => ({
  background: bg,
  borderLeft: `3px solid ${accent}`,
  borderRadius: "0 12px 12px 0",
  padding: "11px 13px",
  marginBottom: 8,
});

// ----------------------------------------------------------------------------
// Pictos au trait (§6). Pas d'emoji.
// ----------------------------------------------------------------------------
function LineIcon({
  stroke,
  size = 15,
  children,
}: {
  stroke: string;
  size?: number;
  children: React.ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ display: "block", flexShrink: 0 }}
    >
      {children}
    </svg>
  );
}

const PictoInfo = () => (
  <LineIcon stroke={C.cequisepasse.accent}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <circle cx="12" cy="7.6" r=".7" fill={C.cequisepasse.accent} stroke="none" />
  </LineIcon>
);
const PictoStar = () => (
  <LineIcon stroke={C.reperes.accent}>
    <path d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1 1 5.8L12 16.9l-5.2 2.75 1-5.8-4.2-4.1 5.8-.85z" />
  </LineIcon>
);
const PictoOndes = () => (
  <LineIcon stroke={C.signaux.accent}>
    <path d="M3.5 8c1.4-1.7 2.8-1.7 4.2 0s2.8 1.7 4.2 0 2.8-1.7 4.2 0 2.8 1.7 4.2 0" />
    <path d="M3.5 13c1.4-1.7 2.8-1.7 4.2 0s2.8 1.7 4.2 0 2.8-1.7 4.2 0 2.8 1.7 4.2 0" />
    <path d="M3.5 18c1.4-1.7 2.8-1.7 4.2 0s2.8 1.7 4.2 0 2.8-1.7 4.2 0 2.8 1.7 4.2 0" />
  </LineIcon>
);
const PictoHorloge = () => (
  <LineIcon stroke="#4A7990">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </LineIcon>
);
const PictoPied = () => (
  <LineIcon stroke={C.reflexo.accent}>
    {/* Semelle : coussinet, cambrure (arche), talon. */}
    <path d="M12 9C14.8 9 16.4 10.6 16.4 12.8C16.4 14.1 15.7 14.8 15.5 16C15.3 17.2 15.8 18 15.8 19.2C15.8 21 14.2 22 12 22C9.8 22 8.2 21 8.2 19.2C8.2 18 8.7 17.2 8.5 16C8.3 14.8 7.6 14.1 7.6 12.8C7.6 10.6 9.2 9 12 9Z" />
    {/* 5 orteils en arc, du gros (gauche) au petit (droite). */}
    <circle cx="9.6" cy="7" r="1.25" fill={C.reflexo.accent} stroke="none" />
    <circle cx="11.8" cy="5.8" r="1.05" fill={C.reflexo.accent} stroke="none" />
    <circle cx="13.8" cy="5.8" r=".9" fill={C.reflexo.accent} stroke="none" />
    <circle cx="15.4" cy="6.6" r=".78" fill={C.reflexo.accent} stroke="none" />
    <circle cx="16.7" cy="7.9" r=".64" fill={C.reflexo.accent} stroke="none" />
  </LineIcon>
);
const PictoNote = () => (
  <LineIcon stroke={C.berceuse.accent}>
    <path d="M9 17V6l9-2v9" />
    <circle cx="6.8" cy="17.2" r="2.1" />
    <circle cx="15.8" cy="14.4" r="2.1" />
  </LineIcon>
);
const PictoDuo = () => (
  <LineIcon stroke={C.coparent.accent}>
    <circle cx="8.6" cy="8" r="2.6" />
    <circle cx="16" cy="9" r="2.1" />
    <path d="M4.2 19c0-2.7 2-4.4 4.4-4.4S13 16.3 13 19" />
    <path d="M13.7 19c.2-2.3 1.7-3.7 3.7-3.7 1.7 0 3.1 1 3.6 2.7" />
  </LineIcon>
);

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

// En-tête de bloc : picto + label en capitales.
function BlocHeader({
  picto,
  label,
  color,
}: {
  picto: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 7 }}>
      {picto}
      <span style={{ ...labelStyle, color }}>{label}</span>
    </div>
  );
}

// Puce de liste.
function Puce({
  accent,
  color,
  children,
}: {
  accent: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 5 }}>
      <span style={{ color: accent, fontWeight: 700, lineHeight: 1.5, flexShrink: 0 }}>•</span>
      <div style={{ fontSize: 11, color, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

// §2 — bloc déroulant (Réflexologie + Berceuse). Fermé par défaut.
function Deroulant({
  theme,
  picto,
  titre,
  teaser,
  teaserColor,
  children,
}: {
  theme: { bg: string; accent: string; label: string };
  picto: React.ReactNode;
  titre: string;
  teaser: string;
  teaserColor: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
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
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <span style={{ flex: 1 }}>
          <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {picto}
            <span style={{ ...labelStyle, color: theme.label }}>{titre}</span>
          </span>
          <span
            style={{
              display: "block",
              fontSize: 10.5,
              fontStyle: "italic",
              color: teaserColor,
              marginTop: 3,
              lineHeight: 1.3,
            }}
          >
            {teaser}
          </span>
        </span>
        {/* §2 — flèche seule : cercle 25px, chevron qui pivote. Aucun texte. */}
        <span
          aria-hidden
          style={{
            width: 25,
            height: 25,
            borderRadius: "50%",
            border: `1.6px solid ${theme.accent}`,
            background: "rgba(255,255,255,.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: theme.accent,
            fontSize: 11,
            lineHeight: 1,
            transition: "transform .2s ease",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          ▾
        </span>
      </button>
      {open ? <div style={{ marginTop: 11 }}>{children}</div> : null}
    </div>
  );
}

export function CoucherView({
  coucher,
  babyName,
  genre,
}: {
  coucher: CoucherModule;
  babyName: string;
  genre: Genre | null;
}) {
  const variantes = coucher.variantes_developpementales;
  const [activeTheme, setActiveTheme] = useState<string | null>(
    variantes?.themes?.[0]?.id ?? null,
  );
  const themeObj = variantes?.themes?.find((t) => t.id === activeTheme) ?? null;

  const reflexo = coucher.reflexologie_du_coucher;
  const berceuse = coucher.script_audio_du_soir;
  const p = (t?: string) => personaliser(t, babyName, genre);

  return (
    <div style={{ padding: "4px 16px 80px" }}>
      {/* En-tête de page */}
      <header style={{ textAlign: "center", marginBottom: 18 }}>
        <LuneEtoile />
        <h1
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: 20,
            fontWeight: 600,
            color: TEXT,
            lineHeight: 1.2,
            margin: "8px 0 5px",
          }}
        >
          {coucher.titre_rubrique ?? "Préparer le coucher"}
        </h1>
        {coucher.sous_titre ? (
          <p
            style={{
              fontSize: 9,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: ".07em",
              color: SUBTITLE,
              margin: 0,
            }}
          >
            {coucher.sous_titre}
          </p>
        ) : null}
      </header>

      {/* 1. Ce qui se passe (pêche) */}
      {coucher.description ? (
        <div style={encartBase(C.cequisepasse.accent, C.cequisepasse.bg)}>
          <BlocHeader picto={<PictoInfo />} label="Ce qui se passe" color={C.cequisepasse.label} />
          <div style={{ fontSize: 11, color: C.cequisepasse.label, lineHeight: 1.55 }}>
            {p(coucher.description)}
          </div>
        </div>
      ) : null}

      {/* 2. Repères clés (amorce en gras) */}
      {coucher.reperes_cles && coucher.reperes_cles.length > 0 ? (
        <div style={encartBase(C.reperes.accent, C.reperes.bg)}>
          <BlocHeader picto={<PictoStar />} label="Repères clés" color={C.reperes.label} />
          {coucher.reperes_cles.map((r, i) => (
            <Puce key={i} accent={C.reperes.accent} color={C.reperes.label}>
              <LigneAvecAmorce texte={p(r)} />
            </Puce>
          ))}
        </div>
      ) : null}

      {/* 3. Signaux de fatigue (sans amorce) */}
      {coucher.signaux_de_fatigue && coucher.signaux_de_fatigue.length > 0 ? (
        <div style={encartBase(C.signaux.accent, C.signaux.bg)}>
          <BlocHeader picto={<PictoOndes />} label="Signaux de fatigue" color={C.signaux.label} />
          {coucher.signaux_de_fatigue.map((s, i) => (
            <Puce key={i} accent={C.signaux.accent} color={C.signaux.label}>
              {p(s)}
            </Puce>
          ))}
        </div>
      ) : null}

      {/* 4. Sélecteur de variante (M12+) */}
      {variantes && variantes.themes?.length ? (
        <div
          style={{
            background: C.variante.bg,
            border: `1px solid ${C.variante.border}`,
            borderRadius: 13,
            padding: "13px 14px",
            marginBottom: 8,
          }}
        >
          {variantes.intro ? (
            <>
              <div style={{ fontSize: 12, color: "#33452C", lineHeight: 1.5 }}>
                {p(variantes.intro)}
              </div>
              <div style={{ height: 1, background: "#C3D6B0", margin: "11px 0" }} />
            </>
          ) : null}
          {variantes.question_selecteur ? (
            <div
              style={{
                textAlign: "center",
                textTransform: "uppercase",
                color: "#2F4A2A",
                fontSize: 10.5,
                letterSpacing: ".03em",
                fontWeight: 700,
                lineHeight: 1.4,
                marginBottom: 11,
              }}
            >
              {p(variantes.question_selecteur)}
            </div>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            {variantes.themes.map((t) => {
              const selected = t.id === activeTheme;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTheme(t.id)}
                  aria-pressed={selected}
                  style={{
                    all: "unset",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    width: "78%",
                    display: "flex",
                    gap: 9,
                    alignItems: "center",
                    padding: "9px 12px",
                    borderRadius: 11,
                    background: selected ? "rgba(255,255,255,.92)" : "rgba(255,255,255,.5)",
                    border: selected
                      ? "1.5px solid #5E7A48"
                      : "1px solid rgba(255,255,255,.55)",
                  }}
                >
                  <LineIcon stroke="#5E7A48" size={18}>
                    <circle cx="12" cy="12" r="3.2" />
                    <path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2" />
                  </LineIcon>
                  <span style={{ flex: 1 }}>
                    <span
                      style={{
                        display: "block",
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontWeight: 600,
                        fontSize: 17,
                        color: "#3A3228",
                        lineHeight: 1.15,
                      }}
                    >
                      {t.titre}
                    </span>
                    {t.sous_titre ? (
                      <span
                        style={{
                          display: "block",
                          fontSize: 9.5,
                          color: "#5E6A52",
                          lineHeight: 1.25,
                          marginTop: 1,
                        }}
                      >
                        {p(t.sous_titre)}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* 5. Rituel pas à pas — toujours ouvert */}
      {coucher.rituel_etapes && coucher.rituel_etapes.length > 0 ? (
        <div style={{ marginBottom: 8 }}>
          <BlocHeader picto={<PictoHorloge />} label="Rituel pas à pas" color="#3A5A64" />
          {coucher.rituel_etapes.map((etape, i) => {
            const t = RITUEL[i % RITUEL.length];
            const isFocus = !!etape.focus_theme && !!themeObj;
            const titre = isFocus ? themeObj!.etape_rituel.titre : etape.titre;
            const note = isFocus
              ? themeObj!.etape_rituel.duree
              : [etape.horaire, etape.duree].filter(Boolean).join(" · ");
            const desc = isFocus ? themeObj!.etape_rituel.description : etape.description;
            return (
              <div
                key={etape.etape ?? i}
                style={{
                  ...encartBase(t.accent, t.bg),
                  ...(isFocus
                    ? { border: `2px solid ${FOCUS_BORDER}`, borderRadius: 11 }
                    : {}),
                }}
              >
                {isFocus ? (
                  <div
                    style={{
                      display: "inline-block",
                      background: FOCUS_BORDER,
                      color: "#FFFFFF",
                      fontSize: 8.5,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                      padding: "2px 7px",
                      borderRadius: 6,
                      marginBottom: 7,
                    }}
                  >
                    Focus du soir · {themeObj!.titre}
                  </div>
                ) : null}
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
                      background: isFocus ? FOCUS_BORDER : t.accent,
                      color: "#FFFFFF",
                    }}
                  >
                    {etape.etape ?? i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, lineHeight: 1.3 }}>
                      {p(titre)}
                    </div>
                    {note ? (
                      <div style={{ fontSize: 9, color: t.accent, fontWeight: 600, marginTop: 2 }}>
                        {note}
                      </div>
                    ) : null}
                    {desc ? (
                      <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.5, marginTop: 4 }}>
                        {p(desc)}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* 6. Réflexologie du soir — déroulant */}
      {reflexo ? (
        <Deroulant
          theme={C.reflexo}
          picto={<PictoPied />}
          titre={reflexo.titre}
          teaser={TEASER_REFLEXO}
          teaserColor="#5E7A48"
        >
          {/* §8 — note de consentement en tête */}
          {reflexo.consentement ? (
            <div
              style={{
                background: "#E8F0DF",
                border: "1px dashed #82A56A",
                borderRadius: 9,
                padding: "9px 11px",
                fontSize: 10.5,
                fontStyle: "italic",
                color: "#3F5C2E",
                lineHeight: 1.5,
                marginBottom: 10,
              }}
            >
              {p(reflexo.consentement)}
            </div>
          ) : null}

          {/* Focus réflexo piloté par le thème actif (M12+) */}
          {themeObj && reflexo.focus_par_theme?.[themeObj.id] ? (
            <div
              style={{
                background: "rgba(255,255,255,.55)",
                borderLeft: `3px solid ${FOCUS_BORDER}`,
                borderRadius: "0 8px 8px 0",
                padding: "8px 10px",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  ...labelStyle,
                  fontSize: 8.5,
                  color: FOCUS_BORDER,
                  marginBottom: 3,
                }}
              >
                Focus du soir · {themeObj.titre}
              </div>
              <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.5 }}>
                {p(reflexo.focus_par_theme[themeObj.id])}
              </div>
            </div>
          ) : null}

          {reflexo.duree_totale || reflexo.pression ? (
            <div style={{ fontSize: 9, color: C.reflexo.accent, fontWeight: 600, marginBottom: 7 }}>
              {[reflexo.duree_totale, reflexo.pression].filter(Boolean).join(" · ")}
            </div>
          ) : null}
          {reflexo.intro ? (
            <div style={{ fontSize: 11, color: C.reflexo.label, lineHeight: 1.55, marginBottom: 9 }}>
              {p(reflexo.intro)}
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
                  <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.5, marginTop: 2 }}>
                    {p(e.geste)}
                  </div>
                  {e.ce_que_cest ? (
                    <div style={{ fontSize: 10, fontStyle: "italic", color: "#6E7B72", marginTop: 2 }}>
                      {p(e.ce_que_cest)}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </Deroulant>
      ) : null}

      {/* 7. Berceuse-rituel — déroulant, Nunito italique, paragraphes */}
      {berceuse ? (
        <Deroulant
          theme={C.berceuse}
          picto={<PictoNote />}
          titre={berceuse.titre}
          teaser={TEASER_BERCEUSE}
          teaserColor="#9A5A48"
        >
          {/* §7 — le champ `instruction` n'est PAS rendu (métadonnée d'auteur). */}
          {p(berceuse.texte)
            .split(/\n\n+/)
            .map((strophe, si) => {
              const passage =
                themeObj && berceuse.passage_par_theme?.[themeObj.id]
                  ? p(berceuse.passage_par_theme[themeObj.id])
                  : "";
              const segments = strophe.split("[passage_theme]");
              return (
                <p
                  key={si}
                  style={{
                    fontFamily: "var(--font-nunito), system-ui, sans-serif",
                    fontStyle: "italic",
                    fontSize: 12.5,
                    lineHeight: 1.3,
                    // §7 — texte de la berceuse en noir chaud (pas en pêche).
                    color: TEXT,
                    margin: "0 0 6px",
                  }}
                >
                  {segments.map((seg, gi) => (
                    <React.Fragment key={gi}>
                      {seg}
                      {gi < segments.length - 1 ? (
                        <span style={{ color: "#8A4030" }}>{passage}</span>
                      ) : null}
                    </React.Fragment>
                  ))}
                </p>
              );
            })}
        </Deroulant>
      ) : null}

      {/* 8. La place du co-parent (amorce en gras) */}
      {coucher.co_parent ? (
        <div style={encartBase(C.coparent.accent, C.coparent.bg)}>
          <BlocHeader
            picto={<PictoDuo />}
            label={coucher.co_parent.titre ?? "La place du co-parent"}
            color={C.coparent.label}
          />
          {coucher.co_parent.texte ? (
            <div
              style={{
                fontSize: 11,
                color: C.coparent.label,
                lineHeight: 1.55,
                marginBottom: 8,
              }}
            >
              {p(coucher.co_parent.texte)}
            </div>
          ) : null}
          {coucher.co_parent.actions?.map((a, i) => (
            <Puce key={i} accent={C.coparent.accent} color={C.coparent.label}>
              <LigneAvecAmorce texte={p(a)} />
            </Puce>
          ))}
        </div>
      ) : null}

      {/* 8bis. Cadre de sécurité (M0–M3) — design « cadre de sécurité » du
          protocole Guide-moi : encadré complet rouge, regles[] amorce en gras. */}
      {coucher.cadre_de_securite ? (
        <div
          style={{
            background: "#EDE9E4",
            border: "1px solid #D4604A",
            borderRadius: 10,
            padding: "11px 13px",
            marginBottom: 8,
          }}
        >
          <div style={{ ...labelStyle, color: "#8A3020", marginBottom: 6 }}>
            {coucher.cadre_de_securite.titre}
          </div>
          {coucher.cadre_de_securite.intro ? (
            <div
              style={{
                fontSize: 11,
                color: "#5A4A40",
                lineHeight: 1.55,
                marginBottom: 8,
              }}
            >
              {p(coucher.cadre_de_securite.intro)}
            </div>
          ) : null}
          {coucher.cadre_de_securite.regles.map((r, i) => (
            <Puce key={i} accent="#D4604A" color="#5A4A40">
              <LigneAvecAmorce texte={p(r)} />
            </Puce>
          ))}
        </div>
      ) : null}

      {/* 9. Erreurs à éviter — croix rouges */}
      {coucher.erreurs_a_eviter && coucher.erreurs_a_eviter.length > 0 ? (
        <div style={encartBase(C.erreurs.accent, C.erreurs.bg)}>
          <div style={{ ...labelStyle, color: C.erreurs.label, marginBottom: 7 }}>
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
              <div style={{ fontSize: 11, color: C.erreurs.label, lineHeight: 1.5 }}>{p(err)}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

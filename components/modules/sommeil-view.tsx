"use client";

import React, { useState } from "react";
import type { CoucherModule } from "@/lib/content";
import type { Genre } from "@/lib/auth";
import type {
  SommeilBloc,
  SommeilMois,
  SommeilPartie,
  SommeilSection,
  SommeilVolet,
} from "@/lib/sommeil";
import {
  BerceuseDuSoir,
  C,
  LuneEtoile,
  RITUEL,
  ReflexoDuSoir,
  TEXT,
  encartBase,
  labelStyle,
  personaliser,
} from "@/components/modules/coucher-view";

// ----------------------------------------------------------------------------
// Écran « Sommeil », nouvelle structure (DECISIONS.md §3, 06/10).
// Onglets : Comprendre son sommeil · Son rythme · La boîte à outils.
// Chaque sous-titre est un volet replié : visibles d'emblée, le sous-titre et
// la première phrase en gras. Sous les onglets, toujours accessibles :
// La sécurité · Il se réveille plus que d'habitude ? (repliés en entier).
// Réflexologie et berceuse : reprises de l'ancien Coucher, inchangées.
// ----------------------------------------------------------------------------

const BOITE = "la-boite-a-outils";
const TOUJOURS = "toujours-accessible";

export type ThemeVolet = { bg: string; accent: string; label: string };

// Couleurs des volets par partie (onglet ou slot).
// Slots (pilote M2-M5, 28/10) : une couleur par groupe de deux slots, la même
// que la carte de la grille (sommeil-slots.tsx).
export const THEME_PARTIE: Record<string, ThemeVolet> = {
  "comprendre-son-sommeil": C.cequisepasse,
  "son-rythme": C.reperes,
};
// Slots : la tranche en slots a aussi « comprendre-son-sommeil », mais en bleu.
// 29/10 : pastels, trois familles. Soleil levant jaune-orangé (repères, comprendre), dégradé de bleu du ciel à la nuit
// (journée → réveils nocturnes), soleil couchant rouge-violet (mon rituel, thème du mois). Même couleurs que les cartes.
const T = (bg: string, accent: string, label: string): ThemeVolet => ({ bg, accent, label });
export const THEME_SLOT: Record<string, ThemeVolet> = {
  "reperes-cles": T("#F1F1E4", "#DCDDBB", "#4A4E2A"),
  "comprendre-son-sommeil": T("#E9F3EA", "#C7E1CA", "#2F4D3A"),
  "journee-et-siestes": T("#EBF4F6", "#CEE4E8", "#1F4650"),
  "fin-de-journee": T("#E2EFF1", "#B6D6DD", "#1F4650"),
  endormissement: T("#D8E9ED", "#9EC9D1", "#1F4650"),
  "reveils-nocturnes": T("#D0E5E9", "#89BDC8", "#1F4650"),
  "mon-rituel": T("#EBE7EF", "#CDC2D6", "#46405A"),
  "theme-du-mois": T("#F0E7ED", "#DAC3D3", "#5E3A52"),
};
export const THEME_DEFAUT = C.cequisepasse;
const SECURITE = { bg: "#EDE9E4", accent: "#D4604A", label: "#8A3020" };
const REVEILS = { bg: "#E4DDD6", accent: "#B4A89C", label: "#5A4A40" };

// Gras **…** et italique *…* (italique réservé aux titres d'études).
export function Inline({ texte }: { texte: string }) {
  const morceaux = texte.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {morceaux.map((m, i) => {
        if (m.startsWith("**") && m.endsWith("**")) {
          return (
            <strong key={i} style={{ fontWeight: 700 }}>
              {m.slice(2, -2)}
            </strong>
          );
        }
        if (m.startsWith("*") && m.endsWith("*") && m.length > 2) {
          return <em key={i}>{m.slice(1, -1)}</em>;
        }
        return <React.Fragment key={i}>{m}</React.Fragment>;
      })}
    </>
  );
}

// (20/10) Plus de phrase d'aperçu sous les titres : les volets sont tous ouverts.

// Volet « sélecteur » : une citation (la question) suivie d'une liste de choix
// « **Titre, angle** : texte » (M20 : Le moment à son image).
function estSelecteur(volet: SommeilVolet) {
  return (
    volet.blocs.some((b) => b.type === "citation") &&
    volet.blocs.some((b) => b.type === "liste")
  );
}

function slugChoix(item: string) {
  const m = item.match(/^\*\*([^*,]+)/);
  return (m?.[1] ?? item)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function Chevron({ open, accent }: { open: boolean; accent: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        border: `1.5px solid ${accent}`,
        background: "rgba(255,255,255,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: accent,
        fontSize: 10,
        lineHeight: 1,
        transition: "transform .2s ease",
        transform: open ? "rotate(180deg)" : "none",
      }}
    >
      ▾
    </span>
  );
}

export function Blocs({
  blocs,
  p,
  color,
  accent,
}: {
  blocs: SommeilBloc[];
  p: (t?: string) => string;
  color: string;
  accent: string;
}) {
  return (
    <>
      {blocs.map((b, i) => {
        if (b.type === "liste") {
          return (
            <div key={i} style={{ margin: "2px 0 6px" }}>
              {b.items.map((it, j) => (
                <div
                  key={j}
                  style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 5 }}
                >
                  <span style={{ color: accent, fontWeight: 700, lineHeight: 1.5, flexShrink: 0 }}>
                    •
                  </span>
                  <div style={{ fontSize: 11, color, lineHeight: 1.55 }}>
                    <Inline texte={p(it)} />
                  </div>
                </div>
              ))}
            </div>
          );
        }
        if (b.type === "citation") {
          return (
            <div
              key={i}
              style={{ fontSize: 11, fontStyle: "italic", color, lineHeight: 1.55, margin: "0 0 6px" }}
            >
              <Inline texte={p(b.texte)} />
            </div>
          );
        }
        return (
          <p key={i} style={{ fontSize: 11, color, lineHeight: 1.55, margin: "0 0 6px" }}>
            <Inline texte={p(b.texte)} />
          </p>
        );
      })}
    </>
  );
}

function Selecteur({
  volet,
  p,
  choix,
  setChoix,
  theme,
}: {
  volet: SommeilVolet;
  p: (t?: string) => string;
  choix: string | null;
  setChoix: (id: string) => void;
  theme: { bg: string; accent: string; label: string };
}) {
  const question = volet.blocs.find((b) => b.type === "citation");
  const items = volet.blocs.flatMap((b) => (b.type === "liste" ? b.items : []));
  const actif = items.find((it) => slugChoix(it) === choix) ?? items[0];
  return (
    <div>
      {question && question.type === "citation" ? (
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: theme.label,
            lineHeight: 1.5,
            marginBottom: 9,
          }}
        >
          <Inline texte={p(question.texte).replace(/\*\*/g, "")} />
        </div>
      ) : null}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 9 }}>
        {items.map((it) => {
          const id = slugChoix(it);
          const libelle = it.match(/^\*\*([^*,]+)/)?.[1] ?? it;
          const selected = it === actif;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setChoix(id)}
              aria-pressed={selected}
              style={{
                all: "unset",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                padding: "6px 11px",
                borderRadius: 999,
                color: selected ? "#FFFFFF" : theme.label,
                background: selected ? theme.accent : "rgba(255,255,255,.6)",
                border: `1px solid ${theme.accent}`,
              }}
            >
              {libelle}
            </button>
          );
        })}
      </div>
      {actif ? (
        <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.55 }}>
          <Inline texte={p(actif)} />
        </div>
      ) : null}
    </div>
  );
}

export function Volet({
  volet,
  p,
  theme,
  numero,
  selecteur,
  majuscules,
}: {
  majuscules?: boolean;
  volet: SommeilVolet;
  p: (t?: string) => string;
  theme: { bg: string; accent: string; label: string };
  numero?: number;
  selecteur?: { choix: string | null; setChoix: (id: string) => void };
}) {
  // 20/10 (Laura) : tous les volets sont ouverts, sans déroulé ni fermeture.
  const open = true;
  const sel = estSelecteur(volet) && selecteur;
  const apercu: string | null = null;
  const titre = volet.titre ? p(volet.titre).replace(/^\d+\.\s*/, "") : null;

  // Volet sans titre (texte d'introduction) : toujours ouvert.
  if (!titre) {
    return (
      <div style={encartBase(theme.accent, theme.bg)}>
        <Blocs blocs={volet.blocs} p={p} color={theme.label} accent={theme.accent} />
      </div>
    );
  }

  return (
    <div style={encartBase(theme.accent, theme.bg)}>
      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          width: "100%",
          gap: 9,
          alignItems: "flex-start",
        }}
      >
        {numero ? (
          <span
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
              background: theme.accent,
              color: "#FFFFFF",
            }}
          >
            {numero}
          </span>
        ) : null}
        <span style={{ flex: 1 }}>
          <span
            style={
              majuscules
                ? {
                    display: "block",
                    fontSize: 10,
                    fontWeight: 700,
                    color: TEXT,
                    lineHeight: 1.35,
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                  }
                : { display: "block", fontSize: 12, fontWeight: 700, color: TEXT, lineHeight: 1.3 }
            }
          >
            {titre}
          </span>
          {apercu && !open ? (
            <span
              style={{
                display: "block",
                fontSize: 11,
                color: theme.label,
                lineHeight: 1.45,
                marginTop: 3,
              }}
            >
              <Inline texte={p(apercu)} />
            </span>
          ) : null}
        </span>
      </div>
      {open ? (
        <div style={{ marginTop: 9 }}>
          {sel ? (
            <Selecteur
              volet={volet}
              p={p}
              choix={selecteur.choix}
              setChoix={selecteur.setChoix}
              theme={theme}
            />
          ) : (
            <Blocs blocs={volet.blocs} p={p} color={TEXT} accent={theme.accent} />
          )}
        </div>
      ) : null}
    </div>
  );
}

export function Sources({ texte, p }: { texte: string; p: (t?: string) => string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ margin: "4px 0 10px" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          all: "unset",
          cursor: "pointer",
          fontSize: 10,
          fontWeight: 600,
          color: "#8A9E98",
          textDecoration: "underline",
        }}
      >
        {open ? "Masquer les sources" : "Sources"}
      </button>
      {open ? (
        <div style={{ fontSize: 10, color: "#6E7B72", lineHeight: 1.5, marginTop: 5 }}>
          {texte.split(/\s;\s/).map((s, i) => (
            <div key={i} style={{ marginBottom: 3 }}>
              <Inline texte={p(s)} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function TitreSection({ titre, color, grand }: { titre: string; color: string; grand?: boolean }) {
  return (
    <div style={{ ...labelStyle, ...(grand ? { fontSize: 12 } : {}), color, margin: "14px 0 7px" }}>{titre}</div>
  );
}

function Bientot({ titre, items, p }: { titre: string; items: string[]; p: (t?: string) => string }) {
  return (
    <div
      style={{
        border: "1px dashed #B4C6CE",
        borderRadius: 12,
        padding: "11px 13px",
        marginBottom: 8,
        background: "#F6F9FA",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#5C7480" }}>{titre}</span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".05em",
            color: "#FFFFFF",
            background: "#CDDDE1",
            borderRadius: 6,
            padding: "2px 7px",
            flexShrink: 0,
          }}
        >
          Bientôt
        </span>
      </div>
      {items.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 9 }}>
          {items.map((it, i) => (
            <span
              key={i}
              style={{
                fontSize: 10.5,
                color: "#5C7480",
                background: "#FFFFFF",
                border: "1px solid #D3E1E8",
                borderRadius: 999,
                padding: "3px 9px",
              }}
            >
              <Inline texte={p(it)} />
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BoiteAOutils({
  partie,
  coucher,
  p,
  choix,
}: {
  partie: SommeilPartie;
  coucher: CoucherModule | null;
  p: (t?: string) => string;
  choix: string | null;
}) {
  return (
    <>
      {partie.sections.map((s) => {
        if (s.id.startsWith("le-rituel")) {
          return (
            <div key={s.id}>
              <TitreSection titre={s.titre} color="#3A5A64" />
              {s.volets.map((v, i) => (
                <Volet
                  key={i}
                  volet={v}
                  p={p}
                  numero={i + 1}
                  theme={{ ...RITUEL[i % RITUEL.length], label: "#3A5A64" }}
                />
              ))}
              {/* Réflexologie et berceuse : reprises de l'ancien Coucher. */}
              {coucher?.reflexologie_du_coucher ? (
                <ReflexoDuSoir reflexo={coucher.reflexologie_du_coucher} p={p} themeObj={null} />
              ) : null}
              {coucher?.script_audio_du_soir ? (
                <BerceuseDuSoir
                  berceuse={coucher.script_audio_du_soir}
                  p={p}
                  themeObj={choix ? { id: choix } : null}
                />
              ) : null}
            </div>
          );
        }
        const contenu = s.volets.flatMap((v) => v.blocs);
        const aTexte = contenu.some((b) => b.type !== "liste");
        // Section pas encore écrite (titre seul, ou seulement une liste de
        // titres de cartes) : « Bientôt ».
        if (!aTexte) {
          const items = contenu.flatMap((b) => (b.type === "liste" ? b.items : []));
          return <Bientot key={s.id} titre={s.titre} items={items} p={p} />;
        }
        return (
          <div key={s.id} style={encartBase(C.coparent.accent, C.coparent.bg)}>
            <div style={{ ...labelStyle, color: C.coparent.label, marginBottom: 7 }}>{s.titre}</div>
            {s.volets.map((v, i) => (
              <Blocs key={i} blocs={v.blocs} p={p} color={C.coparent.label} accent={C.coparent.accent} />
            ))}
          </div>
        );
      })}
    </>
  );
}

function BlocToujours({
  section,
  p,
  theme,
}: {
  section: SommeilSection;
  p: (t?: string) => string;
  theme: { bg: string; accent: string; label: string };
}) {
  // 20/10 (Laura) : seul le bloc « La sécurité » reste repliable ; les autres sont ouverts.
  const repliable = /s[ée]curit[ée]/i.test(section.titre ?? "");
  const [ouvertManuel, setOpen] = useState(false);
  const open = repliable ? ouvertManuel : true;
  return (
    <div
      style={{
        background: theme.bg,
        border: `1px solid ${theme.accent}`,
        borderRadius: 10,
        padding: "11px 13px",
        marginBottom: 8,
      }}
    >
      <button
        type="button"
        onClick={repliable ? () => setOpen((o) => !o) : undefined}
        aria-expanded={repliable ? open : undefined}
        disabled={!repliable}
        style={{
          all: "unset",
          boxSizing: "border-box",
          display: "flex",
          width: "100%",
          gap: 9,
          alignItems: "center",
          cursor: repliable ? "pointer" : "default",
        }}
      >
        <span style={{ flex: 1, ...labelStyle, fontSize: 10, color: theme.label }}>
          {p(section.titre)}
        </span>
        {repliable ? <Chevron open={open} accent={theme.accent} /> : null}
      </button>
      {open ? (
        <div style={{ marginTop: 9 }}>
          {section.chapeau ? (
            <div style={{ fontSize: 11, color: theme.label, lineHeight: 1.5, marginBottom: 8 }}>
              <Inline texte={p(section.chapeau)} />
            </div>
          ) : null}
          {section.volets.map((v, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              {v.titre ? (
                <div style={{ fontSize: 11.5, fontWeight: 700, color: TEXT, marginBottom: 3 }}>
                  {p(v.titre)}
                </div>
              ) : null}
              <Blocs blocs={v.blocs} p={p} color="#5A4A40" accent={theme.accent} />
            </div>
          ))}
          {section.sources ? <Sources texte={section.sources} p={p} /> : null}
        </div>
      ) : null}
    </div>
  );
}

export function SommeilView({
  sommeil,
  coucher,
  babyName,
  genre,
}: {
  sommeil: SommeilMois;
  coucher: CoucherModule | null;
  babyName: string;
  genre: Genre | null;
}) {
  const onglets = sommeil.parties.filter((pt) => pt.id !== TOUJOURS);
  const toujours = sommeil.parties.find((pt) => pt.id === TOUJOURS);
  const [actif, setActif] = useState(onglets[0]?.id ?? "");
  // Premier choix du sélecteur (M20) : sert aussi au passage de la berceuse.
  const premierChoix =
    sommeil.parties
      .flatMap((pt) => pt.sections.flatMap((s) => s.volets))
      .filter(estSelecteur)
      .flatMap((v) => v.blocs.flatMap((b) => (b.type === "liste" ? b.items : [])))
      .map(slugChoix)[0] ?? null;
  const [choix, setChoix] = useState<string | null>(premierChoix);
  const partie = onglets.find((pt) => pt.id === actif) ?? onglets[0];

  const p = (t?: string) => personaliser(t, babyName, genre).replaceAll("{prenom}", babyName);


  return (
    <div style={{ padding: "4px 16px 80px" }}>
      <header style={{ textAlign: "center", marginBottom: 14 }}>
        <LuneEtoile />
        <h1
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: 20,
            fontWeight: 600,
            color: TEXT,
            lineHeight: 1.2,
            margin: "8px 0 6px",
          }}
        >
          Sommeil et endormissement
        </h1>
        <div
          style={{
            ...labelStyle,
            color: "#8A9E98",
            letterSpacing: ".15em",
            marginBottom: sommeil.exergue ? 8 : 0,
          }}
        >
          Rythme et Rituels
        </div>
        {sommeil.exergue ? (
          <p
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontSize: 12.5,
              color: "#5C7480",
              lineHeight: 1.45,
              margin: "0 6px",
            }}
          >
            {sommeil.exergue}
          </p>
        ) : null}
      </header>

      {/* Onglets */}
      <div
        role="tablist"
        style={{
          display: "flex",
          gap: 4,
          background: "#E8F0F2",
          borderRadius: 12,
          padding: 4,
          marginBottom: 6,
        }}
      >
        {onglets.map((pt) => {
          const selected = pt.id === partie?.id;
          return (
            <button
              key={pt.id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setActif(pt.id)}
              style={{
                all: "unset",
                boxSizing: "border-box",
                flex: 1,
                textAlign: "center",
                cursor: "pointer",
                fontSize: 10.5,
                fontWeight: 700,
                lineHeight: 1.25,
                padding: "7px 4px",
                borderRadius: 9,
                color: selected ? "#FFFFFF" : "#3A5A64",
                background: selected ? "#4A7990" : "transparent",
              }}
            >
              {pt.titre}
            </button>
          );
        })}
      </div>

      {partie ? (
        partie.id === BOITE ? (
          <BoiteAOutils partie={partie} coucher={coucher} p={p} choix={choix} />
        ) : (
          <>
            {partie.sections.map((s) => {
              const theme = THEME_PARTIE[partie.id] ?? THEME_DEFAUT;
              return (
                <div key={s.id}>
                  <TitreSection titre={s.titre} color={theme.label} />
                  {s.chapeau ? (
                    <div style={{ fontSize: 11, color: theme.label, marginBottom: 7 }}>
                      <Inline texte={p(s.chapeau)} />
                    </div>
                  ) : null}
                  {s.volets.map((v, i) => (
                    <Volet
                      key={i}
                      volet={v}
                      p={p}
                      theme={theme}
                      selecteur={{ choix, setChoix }}
                    />
                  ))}
                </div>
              );
            })}
            {partie.sources ? <Sources texte={partie.sources} p={p} /> : null}
          </>
        )
      ) : null}

      {/* Toujours accessible */}
      {toujours ? (
        <div style={{ marginTop: 18 }}>
          {toujours.sections.map((s, i) => (
            <BlocToujours key={s.id} section={s} p={p} theme={i === 0 ? SECURITE : REVEILS} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

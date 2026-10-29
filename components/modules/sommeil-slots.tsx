"use client";

import type React from "react";
import Link from "next/link";
import type { SommeilMois, SommeilPartie, SommeilReperes } from "@/lib/sommeil";
import type { Genre } from "@/lib/auth";
import { LuneEtoile, TEXT, labelStyle, personaliser } from "@/components/modules/coucher-view";
import { NavBack } from "@/components/ui/nav-context";
import { LegendeRoue, RoueSommeil } from "@/components/modules/sommeil-roue";
import {
  Blocs,
  Inline,
  Sources,
  THEME_SLOT,
  THEME_DEFAUT,
  TitreSection,
  Volet,
  type ThemeVolet,
} from "@/components/modules/sommeil-view";

// ----------------------------------------------------------------------------
// Sommeil en slots (pilote tranche M2-M5, 28/10).
// Page 1 : une carte par slot, dans l'ordre du JSON, deux par ligne : chaque
// ligne est un groupe de deux slots et porte sa couleur (pas de titre de
// groupe). Un clic ouvre le slot (/coucher?slot=…) ; le Retour de la barre du
// bas ramène à la grille.
// ----------------------------------------------------------------------------

const PLAYFAIR = "var(--font-playfair), Georgia, serif";
const EUCAL = "#8A9E98";
const SOUS_TITRE_THEME = "Ce qu'on travaille en ce moment";

// 29/10 : soleil levant (jaune, orangé doux) pour repères / comprendre, ciel en bleus pour le milieu,
// soleil couchant (rouge-violet doux) pour mon rituel / thème du mois.
// Couleur de la carte, par groupe de slots (même groupe = même couleur).
const CARTE: Record<string, string> = {
  "reperes-cles": "#FBE9BE",
  "comprendre-son-sommeil": "#F8D49E",
  "journee-et-siestes": "#D2EAFB",
  "fin-de-journee": "#B8DAF7",
  endormissement: "#9EC7F1",
  "reveils-nocturnes": "#8FB2EB",
  "mon-rituel": "#EDC6D6",
  "theme-du-mois": "#D8A6C6",
};

// Slots qui changent chaque mois : pas de tranche d'âge affichée.
const MENSUELS = new Set(["reperes-cles", "comprendre-son-sommeil", "mon-rituel", "theme-du-mois"]);
const PHRASE_REPERES = "Une journée type, pas un objectif : chaque bébé a son rythme.";

const age = (s: SommeilMois) =>
  s.tranche ? `${s.tranche.debut} - ${s.tranche.fin} mois` : `${s.mois} mois`;

// « M3 · Un sommeil qui se réorganise » → « Un sommeil qui se réorganise » :
// on n'affiche qu'un mois à la fois, le repère « M3 » est inutile à l'écran.
const sansMois = (titre: string | null) =>
  titre ? titre.replace(/^M\d+\s*·\s*/, "") : titre;

// 29/10 : camaïeu par slot (chaque grande partie reprend la couleur du slot, un peu plus soutenue),
// une couleur fixe pour le relais du co-parent dans tous les slots, et le cadre rouge de
// « Quand consulter », le même que le « Cadre de sécurité » de Guide-moi (protocole-view.tsx).
const CO_PARENT: ThemeVolet = { bg: "#DDF1EC", accent: "#7CC4B4", label: "#1F5E52" };
const CADRE = { bg: "#EDE9E4", accent: "#D4604A", label: "#8A3020", texte: "#5A4A40" };

function melange(a: string, b: string, t: number) {
  const n = (h: string, i: number) => parseInt(h.slice(1 + 2 * i, 3 + 2 * i), 16);
  const c = [0, 1, 2].map((i) => Math.round(n(a, i) * (1 - t) + n(b, i) * t).toString(16).padStart(2, "0"));
  return `#${c.join("")}`;
}
const nuance = (th: ThemeVolet, i: number): ThemeVolet => ({
  ...th,
  bg: melange(th.bg, th.accent, [0, 0.3, 0.55][i % 3]),
});
const estCoParent = (s: SommeilPartie["sections"][number]) =>
  /co-parent|relais/i.test([s.titre, ...s.volets.map((v) => v.titre ?? "")].join(" "));
const estConsulter = (s: SommeilPartie["sections"][number]) => /^quand consulter$/i.test(s.titre ?? "");

// 29/10 : un pictogramme par slot (traits simples, style infographie).
const SOL = (n: number) => (
  <>
    <circle cx="12" cy="12" r="3.6" />
    {Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      return (
        <line key={i} x1={12 + 6.5 * Math.cos(a)} y1={12 + 6.5 * Math.sin(a)} x2={12 + n * Math.cos(a)} y2={12 + n * Math.sin(a)} />
      );
    })}
  </>
);
const PICTO_SLOT: Record<string, React.ReactNode> = {
  "reperes-cles": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.2 2" />
    </>
  ),
  "comprendre-son-sommeil": (
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
  ),
  "journee-et-siestes": SOL(9),
  "fin-de-journee": <path d="M4 18h16M7 18a5 5 0 0 1 10 0M12 6v3M5.5 10.5l2 2M18.5 10.5l-2 2" />,
  endormissement: <path d="M17 15.5A7.5 7.5 0 0 1 9.5 8 7.5 7.5 0 1 0 17 15.5zM18 3.5v4M16 5.5h4" />,
  "reveils-nocturnes": (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  "mon-rituel": <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  "theme-du-mois": (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </>
  ),
};

function SlotPicto({ id, taille = 22, couleur = "#3A3228" }: { id: string; taille?: number; couleur?: string }) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke={couleur}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PICTO_SLOT[id] ?? PICTO_SLOT["reperes-cles"]}
    </svg>
  );
}

function Entete({
  titre,
  sousTitre,
  petit,
  phrase,
  picto,
}: {
  picto?: React.ReactNode;
  titre: string;
  sousTitre?: string;
  petit?: string;
  phrase?: string;
}) {
  return (
    <header style={{ textAlign: "center", marginBottom: 16 }}>
      {picto ?? <LuneEtoile />}
      {petit ? (
        <div style={{ ...labelStyle, color: EUCAL, letterSpacing: ".15em", marginTop: 6 }}>{petit}</div>
      ) : null}
      <h1
        style={{
          fontFamily: PLAYFAIR,
          fontSize: 21,
          fontWeight: 600,
          color: TEXT,
          lineHeight: 1.2,
          margin: "6px 0 5px",
          textWrap: "balance",
        }}
      >
        {titre}
      </h1>
      {sousTitre ? (
        <div style={{ ...labelStyle, color: EUCAL, letterSpacing: ".15em" }}>{sousTitre}</div>
      ) : null}
      {phrase ? (
        <p style={{ fontSize: 11.5, fontStyle: "italic", color: "#5C7480", margin: "6px 0 0" }}>{phrase}</p>
      ) : null}
    </header>
  );
}

function Grille({ sommeil }: { sommeil: SommeilMois }) {
  return (
    <div style={{ padding: "4px 16px 80px" }}>
      <Entete titre="Sommeil et endormissement" sousTitre="Rythme et Rituels" />
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: 10,
        }}
      >
        {sommeil.parties.map((pt) => (
          <li key={pt.id}>
            <Link
              prefetch
              href={`/coucher?slot=${pt.id}`}
              style={{
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 14,
                minHeight: 64,
                padding: "10px 14px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,.06)",
                background: CARTE[pt.id] ?? "#E4EEF0",
                textAlign: "left",
                textDecoration: "none",
              }}
            >
              <span
                aria-hidden
                style={{ display: "inline-flex", flexShrink: 0, width: 42, height: 42, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.55)" }}
              >
                <SlotPicto id={pt.id} />
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
              <span
                style={{
                  fontFamily: PLAYFAIR,
                  fontWeight: 600,
                  fontSize: 15,
                  lineHeight: 1.15,
                  color: TEXT,
                  letterSpacing: "-.01em",
                  textWrap: "balance",
                }}
              >
                {pt.titre}
              </span>
              {MENSUELS.has(pt.id) ? null : (
                <span style={{ ...labelStyle, fontSize: 8.5, color: "#5C6E68", letterSpacing: ".12em" }}>
                  {age(sommeil)}
                </span>
              )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const LIBELLES_REPERES: [keyof SommeilReperes, string][] = [
  ["sommeil_24h", "Sommeil sur 24 heures"],
  ["siestes", "Siestes"],
  ["duree_eveil_moyenne", "Fenêtre d'éveil"],
  ["cycle", "Cycle de sommeil"],
  ["coucher", "Coucher"],
];

// 29/10 : pas de cadres. Chaque repère est une forme ovale asymétrique, dans un dégradé de bleus,
// avec un pictogramme (style infographie).
const NAVY = "#1F3A5F";
const BLOBS = [
  "M28 10 C60 -4 118 2 146 26 C166 46 150 90 112 100 C70 112 20 100 8 66 C-2 40 8 20 28 10 Z",
  "M40 6 C84 -6 140 10 152 44 C162 76 128 106 86 104 C42 102 4 92 6 56 C8 30 22 12 40 6 Z",
  "M20 24 C44 2 104 -2 136 14 C164 28 158 72 130 92 C98 114 44 106 18 84 C-2 66 -2 40 20 24 Z",
];
const BLEUS = ["#D6EAFB", "#C2DDF6", "#AED0F1", "#9CC3EC", "#8DB7E6"];

const PICTO: Record<string, React.ReactNode> = {
  sommeil_24h: <path d="M17 14.5A7.5 7.5 0 0 1 9.5 7 7.5 7.5 0 1 0 17 14.5z" />,
  siestes: <path d="M7 18h10a4 4 0 0 0 .5-7.97A5.5 5.5 0 0 0 7 9.5 4.25 4.25 0 0 0 7 18z" />,
  duree_eveil_moyenne: (
    <>
      <circle cx="12" cy="12" r="3.6" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <line
            key={i}
            x1={12 + 6.5 * Math.cos(a)}
            y1={12 + 6.5 * Math.sin(a)}
            x2={12 + 9 * Math.cos(a)}
            y2={12 + 9 * Math.sin(a)}
          />
        );
      })}
    </>
  ),
  cycle: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  coucher: <path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.6 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />,
};

function Bulle({ cle, libelle, valeur, i }: { cle: string; libelle: string; valeur: string; i: number }) {
  return (
    <div style={{ position: "relative", minWidth: 0, aspectRatio: "160 / 110" }}>
      <svg
        viewBox="0 0 160 110"
        preserveAspectRatio="none"
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <path d={BLOBS[i % BLOBS.length]} fill={BLEUS[i % BLEUS.length]} />
      </svg>
      <div
        style={{
          position: "relative",
          height: "100%",
          boxSizing: "border-box",
          padding: "0 16% 0 14%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 3,
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={NAVY}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {PICTO[cle]}
        </svg>
        <div style={{ ...labelStyle, fontSize: 8.5, color: NAVY, opacity: 0.75 }}>{libelle}</div>
        <div style={{ fontFamily: PLAYFAIR, fontSize: 17, fontWeight: 700, color: NAVY, lineHeight: 1.15 }}>
          {valeur}
        </div>
      </div>
    </div>
  );
}

function ReperesCles({ sommeil, theme }: { sommeil: SommeilMois; theme: ThemeVolet }) {
  const r = sommeil.reperes ?? {};
  const cartes = LIBELLES_REPERES.filter(([k]) => r[k]);
  return (
    <>
      <div style={{ padding: "4px 0 6px", marginBottom: 6 }}>
        <div
          style={{ ...labelStyle, textAlign: "center", color: theme.label, letterSpacing: ".12em", marginBottom: 4 }}
        >
          Éveil / Sommeil sur 24 h
        </div>
        <RoueSommeil mois={sommeil.mois} />
        <LegendeRoue />
      </div>
      {cartes.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 4 }}>
          {cartes.map(([k, libelle], i) => (
            <Bulle key={k} cle={k} libelle={libelle} valeur={String(r[k])} i={i} />
          ))}
        </div>
      ) : null}
    </>
  );
}

function Slot({
  sommeil,
  partie,
  p,
}: {
  sommeil: SommeilMois;
  partie: SommeilPartie;
  p: (t?: string) => string;
}) {
  const theme = THEME_SLOT[partie.id] ?? THEME_DEFAUT;
  const estTheme = partie.id === "theme-du-mois";
  return (
    <div style={{ padding: "4px 16px 80px" }}>
      <NavBack href="/coucher" label="Sommeil" />
      <Entete
        picto={
          <span style={{ display: "inline-flex", width: 44, height: 44, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: theme.bg, border: `1px solid ${theme.accent}` }}>
            <SlotPicto id={partie.id} couleur={theme.label} />
          </span>
        }
        titre={partie.titre}
        petit={MENSUELS.has(partie.id) ? undefined : age(sommeil)}
        sousTitre={estTheme ? SOUS_TITRE_THEME : partie.id === "reperes-cles" ? `${sommeil.mois} mois` : undefined}
        phrase={partie.id === "reperes-cles" ? PHRASE_REPERES : undefined}
      />

      {partie.id === "reperes-cles" ? <ReperesCles sommeil={sommeil} theme={theme} /> : null}

      {partie.sections.map((s, idx) => {
        if (estConsulter(s)) {
          return (
            <div
              key={s.id}
              style={{
                background: CADRE.bg,
                border: `1px solid ${CADRE.accent}`,
                borderRadius: 10,
                padding: "11px 13px",
                margin: "14px 0 10px",
              }}
            >
              <div style={{ ...labelStyle, color: CADRE.label, marginBottom: 6 }}>{s.titre}</div>
              {s.volets.map((v, i) => (
                <Blocs key={i} blocs={v.blocs} p={p} color={CADRE.texte} accent={CADRE.accent} />
              ))}
              {s.sources ? <Sources texte={s.sources} p={p} /> : null}
            </div>
          );
        }
        const th = estCoParent(s) ? CO_PARENT : nuance(theme, idx);
        return (
          <div key={s.id}>
            {/* Thème du mois : la section porte seulement le mois (« M3 »), déjà dans le titre. */}
            {estTheme ? null : <TitreSection titre={s.titre} color={th.label} grand />}
            {s.chapeau ? (
              <div style={{ fontSize: 11, color: th.label, marginBottom: 7 }}>
                <Inline texte={p(s.chapeau)} />
              </div>
            ) : null}
            {s.volets.map((v, i) => (
              <Volet
                key={i}
                volet={{ ...v, titre: sansMois(v.titre) }}
                p={p}
                theme={th}
                majuscules
                numero={Number(v.titre?.match(/^(\d+)\./)?.[1]) || undefined}
              />
            ))}
            {s.sources ? <Sources texte={s.sources} p={p} /> : null}
          </div>
        );
      })}

      {partie.sources ? <Sources texte={partie.sources} p={p} /> : null}
    </div>
  );
}

export function SommeilSlots({
  sommeil,
  slot,
  babyName,
  genre,
}: {
  sommeil: SommeilMois;
  slot: string | null;
  babyName: string;
  genre: Genre | null;
}) {
  const p = (t?: string) => personaliser(t, babyName, genre).replaceAll("{prenom}", babyName);
  const partie = slot ? sommeil.parties.find((pt) => pt.id === slot) : undefined;
  return partie ? <Slot sommeil={sommeil} partie={partie} p={p} /> : <Grille sommeil={sommeil} />;
}

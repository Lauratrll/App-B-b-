"use client";

import type React from "react";
import Link from "next/link";
import type { SommeilMois, SommeilPartie, SommeilReperes } from "@/lib/sommeil";
import type { Genre } from "@/lib/auth";
import { LuneEtoile, TEXT, labelStyle, personaliser } from "@/components/modules/coucher-view";
import { NavBack } from "@/components/ui/nav-context";
import { teinteAuDessus } from "@/lib/couleurs";
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
  "reperes-cles": "#DCDDBB",
  "comprendre-son-sommeil": "#C7E1CA",
  "journee-et-siestes": "#CEE4E8",
  "fin-de-journee": "#B6D6DD",
  endormissement: "#9EC9D1",
  "reveils-nocturnes": "#89BDC8",
  "mon-rituel": "#CDC2D6",
  "theme-du-mois": "#DAC3D3",
};

// Slots qui changent chaque mois : pas de tranche d'âge affichée.
const MENSUELS = new Set(["reperes-cles", "comprendre-son-sommeil", "mon-rituel", "theme-du-mois"]);
const PHRASE_REPERES = "Une journée type, pas un objectif : chaque bébé a son rythme.";

const age = (s: SommeilMois) =>
  s.tranche ? `${s.tranche.debut} - ${s.tranche.fin} mois` : `${s.mois} mois`;
// Sur les cartes de la grille : « 2 à 5 mois » (exemple de Laura, 29/10).
const ageCarte = (s: SommeilMois) =>
  s.tranche ? `${s.tranche.debut} à ${s.tranche.fin} mois` : `${s.mois} mois`;

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

function SlotPicto({
  id,
  taille = 22,
  couleur = "#3A3228",
  epaisseur = 1.6,
}: {
  id: string;
  taille?: number;
  couleur?: string;
  epaisseur?: number;
}) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke={couleur}
      strokeWidth={epaisseur}
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
  suite,
  sousTitre,
  petit,
  phrase,
  picto,
}: {
  /** null = pas de picto (Repères clés, 29/10). */
  picto?: React.ReactNode;
  titre: string;
  /** Suite du titre en majuscules, sur la même ligne : « Repères clés / 3 MOIS ». */
  suite?: string;
  sousTitre?: string;
  petit?: string;
  phrase?: string;
}) {
  return (
    <header style={{ textAlign: "center", marginBottom: picto === null && phrase ? 6 : 16 }}>
      {picto === null ? null : (picto ?? <LuneEtoile />)}
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
        {suite ? (
          <>
            {" / "}
            <span style={{ ...labelStyle, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 13, color: TEXT, letterSpacing: ".08em" }}>
              {suite}
            </span>
          </>
        ) : null}
      </h1>
      {sousTitre ? (
        <div style={{ ...labelStyle, color: EUCAL, letterSpacing: ".15em" }}>{sousTitre}</div>
      ) : null}
      {phrase ? (
        // 29/10 : la phrase prend la typo du sous-titre (capitales eucalyptus).
        <p style={{ ...labelStyle, color: EUCAL, letterSpacing: ".15em", lineHeight: 1.5, margin: "4px 0 0", textWrap: "balance" }}>{phrase}</p>
      ) : null}
    </header>
  );
}

function Grille({ sommeil }: { sommeil: SommeilMois }) {
  return (
    <div style={{ padding: "4px 16px 80px" }}>
      <Entete picto={null} titre="Sommeil et endormissement" sousTitre="Rythme et Rituels" />
      {/* 29/10 : mêmes cartes que la page 1 de Guide-moi (taille, rond, flèche à droite).
          La tranche d'âge suit le titre sur la même ligne : « Fin de journée / 2 À 5 MOIS ». */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gridTemplateColumns: "max-content",
          justifyContent: "center",
          gap: 10,
          maxWidth: "100%",
        }}
      >
        {sommeil.parties.map((pt) => (
          <li key={pt.id} style={{ display: "flex" }}>
            <Link
              prefetch
              href={`/coucher?slot=${pt.id}`}
              style={{
                background: CARTE[pt.id] ?? "#E4EEF0",
                borderRadius: 11,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                width: "100%",
                textDecoration: "none",
              }}
            >
              <span
                aria-hidden
                style={{ width: 28, height: 28, borderRadius: "50%", background: teinteAuDessus(CARTE[pt.id] ?? "#E4EEF0"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                <SlotPicto id={pt.id} taille={17} couleur={TEXT} />
              </span>
              <span
                style={{
                  flex: 1,
                  fontFamily: PLAYFAIR,
                  fontWeight: 600,
                  fontSize: 15,
                  color: TEXT,
                  letterSpacing: "-.01em",
                  whiteSpace: "nowrap",
                }}
              >
                {pt.titre}
                {MENSUELS.has(pt.id) ? null : (
                  <>
                    {" / "}
                    <span style={{ ...labelStyle, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 10, color: TEXT, letterSpacing: ".08em" }}>
                      {ageCarte(sommeil)}
                    </span>
                  </>
                )}
              </span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const LIBELLES_REPERES: [keyof SommeilReperes, string][] = [
  ["sommeil_24h", "Sommeil sur 24h"],
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
          padding: "0 12%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: 2,
        }}
      >
        <svg
          width="17"
          height="17"
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
        <div style={{ ...labelStyle, fontSize: 7, letterSpacing: ".04em", lineHeight: 1.2, color: NAVY, opacity: 0.75 }}>{libelle}</div>
        <div style={{ fontFamily: PLAYFAIR, fontSize: 13.5, fontWeight: 700, color: NAVY, lineHeight: 1.1, whiteSpace: "nowrap" }}>
          {valeur}
        </div>
      </div>
    </div>
  );
}

function ReperesCles({ sommeil }: { sommeil: SommeilMois }) {
  const r = sommeil.reperes ?? {};
  const cartes = LIBELLES_REPERES.filter(([k]) => r[k]);
  return (
    <>
      {/* 29/10 : « Éveil / Sommeil sur 24h » est au centre de la roue ; repères sur 3 colonnes
          pour que la page tienne sur un écran. */}
      <div style={{ padding: "0 0 2px", marginBottom: 2 }}>
        <RoueSommeil mois={sommeil.mois} />
        <LegendeRoue />
      </div>
      {cartes.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 2 }}>
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
  const estReperes = partie.id === "reperes-cles";
  return (
    <div style={{ padding: "4px 16px 80px" }}>
      <NavBack href="/coucher" label="Sommeil" />
      {estReperes ? (
        // 29/10 : tout tient sur un écran ; pas de picto, le mois suit le titre, la phrase en sous-titre.
        <Entete picto={null} titre={partie.titre} suite={`${sommeil.mois} mois`} phrase={PHRASE_REPERES} />
      ) : (
        <Entete
          picto={
            // 29/10 : pas de rond autour du picto, juste la couleur du slot.
            <span style={{ display: "flex", justifyContent: "center" }}>
              <SlotPicto id={partie.id} taille={36} epaisseur={2} couleur={CARTE[partie.id] ?? theme.label} />
            </span>
          }
          titre={partie.titre}
          petit={MENSUELS.has(partie.id) ? undefined : age(sommeil)}
          sousTitre={estTheme ? SOUS_TITRE_THEME : undefined}
        />
      )}

      {partie.id === "reperes-cles" ? <ReperesCles sommeil={sommeil} /> : null}

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

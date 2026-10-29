"use client";

import { useState } from "react";
import type React from "react";
import Link from "next/link";
import type { SommeilMois, SommeilPartie, SommeilReperes } from "@/lib/sommeil";
import type { Genre } from "@/lib/auth";
import { LuneEtoile, TEXT, labelStyle, personaliser } from "@/components/modules/coucher-view";
import { NavBack } from "@/components/ui/nav-context";
import { teinteAuDessus } from "@/lib/couleurs";
import { COULEURS_ROUE, LegendeRoue, RoueSommeil, aUneRoue } from "@/components/modules/sommeil-roue";
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
const PHRASE_REPERES = "Une journée type, pas un objectif\u00a0: chaque bébé a son rythme.";

// Tranche d'âge : « 2 à 5 mois » (cartes et pages des slots, Laura 29/10).
const ageCarte = (s: SommeilMois) =>
  s.tranche ? `${s.tranche.debut} à ${s.tranche.fin} mois` : `${s.mois} mois`;

// « M3 · Un sommeil qui se réorganise » → « Un sommeil qui se réorganise » :
// on n'affiche qu'un mois à la fois, le repère « M3 » est inutile à l'écran.
const sansMois = (titre: string | null) =>
  titre ? titre.replace(/^M\d+\s*·\s*/, "") : titre;

// 29/10 : couleurs des blocs FIXES par rôle dans l'argumentaire, quel que soit le slot
// (même logique que les protocoles de Guide-moi, protocole-view.tsx) :
//   ce qui se passe = observation / explication · action = quoi faire · co-parent · cadre de sécurité.
const OBSERVATION: ThemeVolet = { bg: "#E8F0F2", accent: "#8FB4BC", label: "#3A5A64" };
const ACTION: ThemeVolet = { bg: "#F8E4D4", accent: "#DB936B", label: "#9A4F2A" };
const CO_PARENT: ThemeVolet = { bg: "#DDF1EC", accent: "#7CC4B4", label: "#1F5E52" };
const CADRE = { bg: "#EDE9E4", accent: "#D4604A", label: "#8A3020", texte: "#5A4A40" };

const estCoParent = (s: SommeilPartie["sections"][number]) =>
  /co-parent|relais|partager les nuits/i.test(s.titre ?? "");
const estCadre = (s: SommeilPartie["sections"][number]) =>
  /^(quand consulter)$/i.test(s.titre ?? "");
const estAction = (s: SommeilPartie["sections"][number]) =>
  /redescendre|le coucher|façons de s'endormir|chemin vers|que regarder|ses siestes|premier rituel|besoins|la pose|rythme|tes gestes|cette semaine/i.test(
    s.titre ?? "",
  );
const roleTheme = (s: SommeilPartie["sections"][number]): ThemeVolet =>
  estCoParent(s) ? CO_PARENT : estAction(s) ? ACTION : OBSERVATION;

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
      {/* 29/10 : la tranche d'âge passe sous le titre. */}
      {petit ? (
        <div style={{ ...labelStyle, color: EUCAL, letterSpacing: ".15em", marginBottom: 2 }}>{petit}</div>
      ) : null}
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
    // 29/10 : grille centrée entre le haut de l'écran et la barre du bas (espaces égaux).
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 16px 8px" }}>
      <div aria-hidden style={{ flex: 1 }} />
      <Entete picto={null} titre="Sommeil & Endormissement" sousTitre="Rythme et Rituels" />
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
      <div aria-hidden style={{ flex: 1 }} />
    </div>
  );
}

// ----------------------------------------------------------------------------
// Repères clés (refonte 29/10, Laura) : tout tient sur un écran, sans défiler.
// Titre « Repères clés » + « à 4 mois » à la ligne ; la phrase en sous-titre ;
// la roue agrandie ; les repères en deux colonnes en quinconce, aux couleurs
// de la roue (nuit, sieste, éveil) ; un bouton vers l'outil « rythme » (à venir).
// ----------------------------------------------------------------------------

type Forme = { fond: string; texte: string; d: string; marge: string };

// Formes ovales asymétriques (viewBox 160 x 100, étirées à la taille de la case).
const OVALES = [
  "M28 9 C60 -4 118 2 146 24 C166 42 150 82 112 91 C70 102 20 91 8 60 C-2 36 8 18 28 9 Z",
  "M40 5 C84 -5 140 9 152 40 C162 69 128 96 86 95 C42 93 4 84 6 51 C8 27 22 11 40 5 Z",
  "M20 22 C44 2 104 -2 136 13 C164 25 158 65 130 84 C98 104 44 96 18 76 C-2 60 -2 36 20 22 Z",
];
// Fenêtre d'éveil : forme plus large et plus droite, pour que les horaires (« 2h30 à 3h45 ») tiennent.
const OVALE_LARGE = "M22 8 C62 0 122 0 148 14 C162 26 162 72 148 86 C122 100 52 100 20 92 C2 86 -2 60 2 40 C5 20 10 12 22 8 Z";

const NUIT = { fond: COULEURS_ROUE.nuit, texte: "#FFFFFF" };
const SIESTE = { fond: COULEURS_ROUE.sieste, texte: TEXT };
const EVEIL = { fond: COULEURS_ROUE.eveil, texte: TEXT };

// Colonne de gauche : sommeil (nuit), fenêtre d'éveil (éveil), coucher (sieste).
// Colonne de droite, décalée d'une demi-case : siestes (sieste), cycle (nuit).
const GAUCHE: [keyof SommeilReperes, string, Forme][] = [
  ["sommeil_24h", "Sommeil sur 24h", { ...NUIT, d: OVALES[0], marge: "14%" }],
  ["duree_eveil_moyenne", "Fenêtre d'éveil", { ...EVEIL, d: OVALE_LARGE, marge: "7%" }],
  ["coucher", "Coucher", { ...SIESTE, d: OVALES[2], marge: "12%" }],
];
const DROITE: [keyof SommeilReperes, string, Forme][] = [
  ["siestes", "Siestes", { ...SIESTE, d: OVALES[1], marge: "14%" }],
  ["cycle", "Cycle de sommeil", { ...NUIT, d: OVALES[2], marge: "10%" }],
];

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

// Hauteur d'une case = 58 % de sa largeur ; le décalage de la colonne de droite en dépend.
const RATIO = 58;
const ECART = 6;

function Bulle({ cle, libelle, valeur, forme }: { cle: string; libelle: string; valeur: string; forme: Forme }) {
  return (
    <div style={{ position: "relative", minWidth: 0, aspectRatio: `100 / ${RATIO}` }}>
      <svg
        viewBox="0 0 160 100"
        preserveAspectRatio="none"
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <path d={forme.d} fill={forme.fond} />
      </svg>
      <div
        style={{
          position: "relative",
          height: "100%",
          boxSizing: "border-box",
          padding: `0 ${forme.marge}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: 2,
          color: forme.texte,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {PICTO[cle]}
        </svg>
        <div style={{ ...labelStyle, fontSize: 8.5, letterSpacing: ".05em", lineHeight: 1.2 }}>{libelle}</div>
        <div style={{ fontFamily: PLAYFAIR, fontSize: 16.5, fontWeight: 700, lineHeight: 1.1, whiteSpace: "nowrap" }}>
          {valeur}
        </div>
      </div>
    </div>
  );
}

function Colonne({ items, r, decalee }: { items: [keyof SommeilReperes, string, Forme][]; r: SommeilReperes; decalee?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: ECART,
        minWidth: 0,
        // Quinconce : la colonne de droite descend d'une demi-case.
        paddingTop: decalee ? `calc((100% * ${RATIO} / 100 + ${ECART}px) / 2)` : 0,
      }}
    >
      {items
        .filter(([k]) => r[k])
        .map(([k, libelle, forme]) => (
          <Bulle key={k} cle={k} libelle={libelle} valeur={String(r[k])} forme={forme} />
        ))}
    </div>
  );
}

function BoutonRythme() {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div style={{ textAlign: "center" }}>
      {/* Mènera à l'outil « rythme de mon bébé », à développer plus tard. */}
      <button
        type="button"
        onClick={() => setOuvert(true)}
        style={{
          width: "100%",
          border: "none",
          borderRadius: 999,
          padding: "12px 16px",
          background: COULEURS_ROUE.nuit,
          color: "#FFFFFF",
          fontFamily: PLAYFAIR,
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Enregistrer le rythme de mon bébé
      </button>
      {ouvert ? (
        <p style={{ ...labelStyle, color: EUCAL, letterSpacing: ".12em", margin: "6px 0 0" }}>Bientôt disponible</p>
      ) : null}
    </div>
  );
}

function ReperesCles({ sommeil }: { sommeil: SommeilMois }) {
  const r = sommeil.reperes ?? {};
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 16px 8px" }}>
      <NavBack href="/coucher" label="Sommeil" />
      <div aria-hidden style={{ flex: 1 }} />
      <header style={{ textAlign: "center", marginBottom: 14 }}>
        <h1
          style={{
            fontFamily: PLAYFAIR,
            fontSize: 22,
            fontWeight: 600,
            color: TEXT,
            lineHeight: 1.15,
            margin: "0 0 6px",
          }}
        >
          Repères clés
          <br />à {sommeil.mois} mois
        </h1>
        <p style={{ ...labelStyle, color: EUCAL, letterSpacing: ".15em", lineHeight: 1.5, margin: 0, textWrap: "balance" }}>
          {PHRASE_REPERES}
        </p>
      </header>
      {aUneRoue(sommeil.mois) ? (
        <div style={{ marginBottom: 6 }}>
          <RoueSommeil mois={sommeil.mois} taille={250} />
          <LegendeRoue />
        </div>
      ) : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: ECART, margin: "6px 0 14px" }}>
        <Colonne items={GAUCHE} r={r} />
        <Colonne items={DROITE} r={r} decalee />
      </div>
      <BoutonRythme />
      <div aria-hidden style={{ flex: 1 }} />
    </div>
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
  // Repères clés : page à part, qui tient sur un écran (refonte 29/10).
  if (partie.id === "reperes-cles") return <ReperesCles sommeil={sommeil} />;
  return (
    <div style={{ padding: "4px 16px 80px" }}>
      <NavBack href="/coucher" label="Sommeil" />
      <Entete
        picto={
          // 29/10 : pas de rond autour du picto, juste la couleur du slot.
          <span style={{ display: "flex", justifyContent: "center" }}>
            <SlotPicto id={partie.id} taille={36} epaisseur={2} couleur={CARTE[partie.id] ?? theme.label} />
          </span>
        }
        titre={partie.titre}
        petit={MENSUELS.has(partie.id) ? undefined : ageCarte(sommeil)}
        sousTitre={estTheme ? SOUS_TITRE_THEME : undefined}
      />

      {partie.sections.map((s) => {
        if (estCadre(s)) {
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
        const th = roleTheme(s);
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

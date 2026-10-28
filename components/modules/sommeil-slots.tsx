"use client";

import Link from "next/link";
import type { SommeilMois, SommeilPartie, SommeilReperes } from "@/lib/sommeil";
import type { Genre } from "@/lib/auth";
import { LuneEtoile, TEXT, labelStyle, personaliser } from "@/components/modules/coucher-view";
import { NavBack } from "@/components/ui/nav-context";
import { LegendeRoue, RoueSommeil } from "@/components/modules/sommeil-roue";
import {
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

// Couleur de la carte, par groupe de slots (même groupe = même couleur).
const CARTE: Record<string, string> = {
  "reperes-cles": "#D5E7EB",
  "comprendre-son-sommeil": "#D5E7EB",
  "journee-et-siestes": "#E5D6C5",
  "fin-de-journee": "#E5D6C5",
  endormissement: "#F5D0C8",
  "reveils-nocturnes": "#F5D0C8",
  "mon-rituel": "#CCD7B9",
  "theme-du-mois": "#CCD7B9",
};

const age = (s: SommeilMois) =>
  s.tranche ? `${s.tranche.debut} - ${s.tranche.fin} mois` : `${s.mois} mois`;

// « M3 · Un sommeil qui se réorganise » → « Un sommeil qui se réorganise » :
// on n'affiche qu'un mois à la fois, le repère « M3 » est inutile à l'écran.
const sansMois = (titre: string | null) =>
  titre ? titre.replace(/^M\d+\s*·\s*/, "") : titre;

function Entete({ titre, sousTitre, petit }: { titre: string; sousTitre?: string; petit?: string }) {
  return (
    <header style={{ textAlign: "center", marginBottom: 16 }}>
      <LuneEtoile />
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
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
                height: 96,
                padding: "10px 10px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,.06)",
                background: CARTE[pt.id] ?? "#E4EEF0",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
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
              <span style={{ ...labelStyle, fontSize: 8.5, color: "#5C6E68", letterSpacing: ".12em" }}>
                {age(sommeil)}
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
  ["duree_eveil_moyenne", "Durée d'éveil moyenne"],
  ["cycle", "Cycle de sommeil"],
  ["nuits", "Enchaînement de nuit"],
  ["coucher", "Coucher"],
];

function ReperesCles({ sommeil, theme }: { sommeil: SommeilMois; theme: ThemeVolet }) {
  const r = sommeil.reperes ?? {};
  const cartes = LIBELLES_REPERES.filter(([k]) => r[k]);
  return (
    <>
      <div
        style={{
          background: "#FFFFFF",
          border: `1px solid ${theme.accent}`,
          borderRadius: 16,
          padding: "16px 12px 10px",
          marginBottom: 12,
        }}
      >
        <RoueSommeil mois={sommeil.mois} />
        <LegendeRoue />
        <p style={{ fontSize: 10, fontStyle: "italic", color: "#5C7480", textAlign: "center", margin: "4px 0 0" }}>
          Une journée type, pas un objectif : chaque bébé a son rythme.
        </p>
      </div>
      {cartes.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
          {cartes.map(([k, libelle]) => (
            <div
              key={k}
              style={{
                background: theme.bg,
                border: `1px solid ${theme.accent}`,
                borderRadius: 12,
                padding: "10px 11px",
                minWidth: 0,
              }}
            >
              <div style={{ ...labelStyle, fontSize: 8.5, color: theme.label, marginBottom: 4 }}>{libelle}</div>
              <div style={{ fontFamily: PLAYFAIR, fontSize: 14, fontWeight: 600, color: TEXT, lineHeight: 1.25 }}>
                {r[k]}
              </div>
            </div>
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
        titre={partie.titre}
        petit={partie.id === "reperes-cles" ? undefined : age(sommeil)}
        sousTitre={estTheme ? SOUS_TITRE_THEME : undefined}
      />

      {partie.id === "reperes-cles" ? <ReperesCles sommeil={sommeil} theme={theme} /> : null}

      {partie.sections.map((s) => (
        <div key={s.id}>
          {/* Thème du mois : la section porte seulement le mois (« M3 »), déjà dans le titre. */}
          {estTheme ? null : <TitreSection titre={s.titre} color={theme.label} />}
          {s.chapeau ? (
            <div style={{ fontSize: 11, color: theme.label, marginBottom: 7 }}>
              <Inline texte={p(s.chapeau)} />
            </div>
          ) : null}
          {s.volets.map((v, i) => (
            <Volet key={i} volet={{ ...v, titre: sansMois(v.titre) }} p={p} theme={theme} />
          ))}
          {s.sources ? <Sources texte={s.sources} p={p} /> : null}
        </div>
      ))}

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

import React from "react";
import sosData from "@/content/sos-faut-il-consulter/sos.json";

// ----------------------------------------------------------------------------
// Rubrique S.O.S « Dois-je consulter ? » — données + design partagés.
// Contenu : content/sos-faut-il-consulter/sos.json (import statique, pas de
// Supabase). Citations ameli / carnet de santé recopiées MOT POUR MOT.
//
// Gamme validée le 08/10/2026 : jaune bouton d'or → orange → orange sanguine.
//  - Page 1 : couleur de slot PAR RANG (0 jaune, 1 orange, 2 sanguine).
//  - Page 2 : couleur de bloc PAR NIVEAU d'urgence
//    (comprendre = jaune, journee = orange, urgence = sanguine).
// ----------------------------------------------------------------------------

export type SosNiveau = "comprendre" | "journee" | "urgence";

export type SosBloc = {
  titre: string;
  niveau: SosNiveau;
  definition?: string;
  texte?: string;
  items?: string[];
  conclusion?: string;
  source?: string;
};

export type SosTheme = { id: string; nom: string; blocs: SosBloc[] };

export type SosTranche = {
  id: string;
  label: string;
  mois_min: number;
  mois_max: number;
  intro?: { texte: string; source: string };
  themes: SosTheme[];
};

type SosData = {
  bandeau: { texte: string; numeros: string[]; source: string };
  tranches: SosTranche[];
};

export const SOS = sosData as SosData;

export function trancheSos(mois: number): SosTranche {
  return (
    SOS.tranches.find((t) => mois >= t.mois_min && mois <= t.mois_max) ??
    SOS.tranches[SOS.tranches.length - 1]
  );
}

export const SOS_TEXT = "#3A3228";
export const SOS_MUTED = "#8A9E98";

export type SosTon = {
  slot: string; // fond de case page 1
  pastille: string; // rond du picto
  bg: string; // fond de bloc page 2
  accent: string; // filet gauche du bloc
  label: string; // intitulés + texte du bloc
};

export const SOS_JAUNE: SosTon = {
  slot: "#FFCD67",
  pastille: "#FFB42D",
  bg: "#FFE9BA",
  accent: "#FFAA00",
  label: "#814D00",
};
export const SOS_ORANGE: SosTon = {
  slot: "#FFC18F",
  pastille: "#F3A262",
  bg: "#FFE3CD",
  accent: "#F0903C",
  label: "#814200",
};
export const SOS_SANGUINE: SosTon = {
  slot: "#FFBAA5",
  pastille: "#FC9980",
  bg: "#FFE0D6",
  accent: "#FA8467",
  label: "#873B28",
};

const GAMME = [SOS_JAUNE, SOS_ORANGE, SOS_SANGUINE];

export function tonSlot(index: number): SosTon {
  return GAMME[index % GAMME.length];
}

export const TON_NIVEAU: Record<SosNiveau, SosTon> = {
  comprendre: SOS_JAUNE,
  journee: SOS_ORANGE,
  urgence: SOS_SANGUINE,
};

// Bandeau urgences — corail, hors gamme, en haut de chaque écran S.O.S.
const CORAIL = "#D4604A";
const CORAIL_FONCE = "#8A3020";

export function SosBandeau({ complet }: { complet?: boolean }) {
  return (
    <div
      style={{
        background: CORAIL,
        borderRadius: 12,
        padding: "10px 12px",
        margin: "0 0 18px",
      }}
    >
      {complet ? (
        <p
          style={{
            fontSize: 11,
            lineHeight: 1.45,
            color: "#fff",
            margin: "0 0 10px",
          }}
        >
          {SOS.bandeau.texte}
        </p>
      ) : null}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {!complet ? (
          <span
            style={{
              flex: 1,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            Urgences
          </span>
        ) : null}
        {SOS.bandeau.numeros.map((n) => (
          <a
            key={n}
            href={`tel:${n}`}
            aria-label={`Appeler le ${n}`}
            style={{
              flex: complet ? 1 : "none",
              minWidth: 50,
              height: 36,
              borderRadius: 18,
              background: "#fff",
              color: CORAIL_FONCE,
              fontWeight: 700,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            {n}
          </a>
        ))}
      </div>
      {complet ? (
        <p
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,.85)",
            fontStyle: "italic",
            margin: "8px 0 0",
          }}
        >
          {SOS.bandeau.source}
        </p>
      ) : null}
    </div>
  );
}

// Pictos — même style trait que Guide-moi (viewBox 24, stroke 1.6).
const ICONES: Record<string, React.ReactNode> = {
  fievre: (
    <>
      <path d="M10 13.5V5a2 2 0 014 0v8.5a4 4 0 11-4 0z" />
      <path d="M12 9v6" />
      <circle cx="12" cy="17" r="1.4" fill="currentColor" />
    </>
  ),
  "diarrhee-vomissements": (
    <path d="M12 3.5c-3 4-5.5 7-5.5 10.2a5.5 5.5 0 0011 0C17.5 10.5 15 7.5 12 3.5z" />
  ),
  respiration: (
    <>
      <path d="M3 9h11a3 3 0 10-3-3" />
      <path d="M3 13h15a3 3 0 11-3 3" />
      <path d="M3 17h7" />
    </>
  ),
};

export function SosIcone({
  id,
  color,
  size = 17,
}: {
  id: string;
  color: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color }}
      aria-hidden
    >
      {ICONES[id]}
    </svg>
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

const sourceStyle: React.CSSProperties = {
  fontSize: 9,
  color: "#8A8078",
  fontStyle: "italic",
  lineHeight: 1.4,
  margin: "-2px 2px 12px",
};

// Bloc page 2 — même gabarit que les encarts des protocoles Guide-moi.
export function SosBlocView({ bloc }: { bloc: SosBloc }) {
  const ton = TON_NIVEAU[bloc.niveau];
  const texte: React.CSSProperties = {
    fontSize: 11,
    color: ton.label,
    lineHeight: 1.55,
    margin: 0,
  };
  return (
    <>
      <div
        style={{
          background: ton.bg,
          borderLeft: `3px solid ${ton.accent}`,
          borderRadius: "0 12px 12px 0",
          padding: "11px 13px",
          marginBottom: 8,
        }}
      >
        {bloc.titre ? <div style={labelStyle(ton.label)}>{bloc.titre}</div> : null}
        {bloc.definition ? (
          <p style={{ ...texte, fontStyle: "italic", marginBottom: 4 }}>
            {bloc.definition}
          </p>
        ) : null}
        {bloc.texte ? <p style={texte}>{bloc.texte}</p> : null}
        {bloc.items && bloc.items.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {bloc.items.map((it, i) => (
              <li
                key={i}
                style={{
                  ...texte,
                  display: "flex",
                  gap: 7,
                  marginTop: i === 0 ? 0 : 5,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: ton.accent,
                    flexShrink: 0,
                    marginTop: 6,
                  }}
                />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {bloc.conclusion ? (
          <p style={{ ...texte, fontWeight: 700, marginTop: 8 }}>
            {bloc.conclusion}
          </p>
        ) : null}
      </div>
      {bloc.source ? <p style={sourceStyle}>{bloc.source}</p> : null}
    </>
  );
}

export function SosSource({ children }: { children: React.ReactNode }) {
  return <p style={sourceStyle}>{children}</p>;
}

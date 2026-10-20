import React from "react";
import sosData from "@/content/sos-faut-il-consulter/sos.json";

// ----------------------------------------------------------------------------
// Rubrique S.O.S « Dois-je consulter ? » — données + design partagés.
// Contenu : content/sos-faut-il-consulter/sos.json (import statique, pas de
// Supabase). Citations ameli / carnet de santé recopiées MOT POUR MOT.
//
// Gamme validée le 08/10/2026 : jaune bouton d'or → orange → orange sanguine.
// Adoucie en pastel le 19/10/2026 (Laura) pour rejoindre l'ADN de l'app
// (pêche, corail clair, abricot) : mêmes teintes, moins saturées. Puis
// réchauffées (Laura : jaune des blocs fade, écriture marron) : fond jaune plus
// ensoleillé, textes terre cuite et corail au lieu de bruns.
//  - Page 1 : couleur de slot PAR RANG (0 jaune, 1 orange, 2 sanguine).
//  - Page 2 : couleur de bloc PAR NIVEAU d'urgence
//    (comprendre = jaune, journee = orange, urgence = sanguine).
// ----------------------------------------------------------------------------

export type SosNiveau = "comprendre" | "journee" | "urgence";

export type SosBloc = {
  titre: string;
  niveau: SosNiveau;
  definition?: string;
  note?: string; // phrase de l'app, en italique en tête du bloc (pas une citation)
  texte?: string;
  items?: string[];
  // Sous-parties d'un même bloc (README §16), chacune avec son titre en gras.
  sections?: { titre: string; texte?: string; items?: string[] }[];
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

type SosNumero = { numero: string; nom: string; precision?: string };

type SosData = {
  accueil?: { origine?: string; message: string };
  bandeau: {
    titre: string;
    numeros: SosNumero[];
    cas_particulier?: SosNumero & { titre: string };
  };
  // Légende des deux niveaux d'action (README §8), affichée sous le titre des
  // blocs « journee » et « urgence ».
  niveaux?: Partial<Record<SosNiveau, { titre: string; sous_titre?: string }>>;
  tranches: SosTranche[];
};

export const SOS = sosData as unknown as SosData;

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
  slot: "#FBE8C0",
  pastille: "#F2D59A",
  bg: "#FFEDC4",
  accent: "#F4BC4A",
  label: "#A3561A",
};
export const SOS_ORANGE: SosTon = {
  slot: "#FAD2B3",
  pastille: "#F3B88C",
  bg: "#FDE8D9",
  accent: "#EDA36E",
  label: "#A4471F",
};
export const SOS_SANGUINE: SosTon = {
  slot: "#F6C4B6",
  pastille: "#EFA996",
  bg: "#FBE2DA",
  accent: "#E68D76",
  label: "#A33A2B",
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

// Bandeau urgences — en haut de chaque écran S.O.S. Pastel depuis le 19/10
// (Laura : le corail plein était trop saturé) : fond corail clair, numéros en
// pastilles blanches, chiffres et textes corail foncé.
const CORAIL_CLAIR = "#F5D0C8";
const CORAIL_FONCE = "#8A3020";

// Bandeau sans ligne source (README §6) : 15 et 112 en appel, 114 à part en
// SMS sous « Cas particulier ». Version complète en page 1, compacte ensuite.
export function SosBandeau({ complet }: { complet?: boolean }) {
  const { titre, numeros, cas_particulier: cas } = SOS.bandeau;
  const pastille = (
    href: string,
    label: string,
    n: string,
    grand?: boolean,
    petit?: boolean,
  ) => (
    <a
      key={n}
      href={href}
      aria-label={label}
      style={{
        minWidth: petit ? 40 : grand ? 50 : 46,
        height: petit ? 26 : grand ? 32 : 34,
        padding: "0 10px",
        borderRadius: 19,
        background: "#fff",
        color: CORAIL_FONCE,
        fontWeight: 700,
        fontSize: petit ? 12.5 : grand ? 15 : 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        flexShrink: 0,
      }}
    >
      {n}
    </a>
  );

  if (!complet) {
    return (
      <div
        style={{
          background: CORAIL_CLAIR,
          borderRadius: 12,
          padding: "8px 12px",
          margin: "0 0 18px",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <span
          style={{
            flex: 1,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: CORAIL_FONCE,
          }}
        >
          Urgences
        </span>
        {numeros.map((n) => pastille(`tel:${n.numero}`, `Appeler le ${n.numero}`, n.numero))}
        {cas ? pastille(`sms:${cas.numero}`, `Envoyer un SMS au ${cas.numero}`, cas.numero) : null}
      </div>
    );
  }

  // Les trois numéros sur une seule ligne (choix Laura, 19/10) : pastille, et
  // le nom en petit dessous. 15 et 112 en appel, 114 en SMS. Sans sous-texte.
  const tous = [
    ...numeros.map((n) => ({ n, href: `tel:${n.numero}`, label: `Appeler le ${n.numero}` })),
    ...(cas
      ? [{ n: cas, href: `sms:${cas.numero}`, label: `Envoyer un SMS au ${cas.numero}` }]
      : []),
  ];

  return (
    <div style={{ background: CORAIL_CLAIR, borderRadius: 12, padding: "9px 10px 10px" }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: CORAIL_FONCE,
          textAlign: "center",
        }}
      >
        {titre}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${tous.length}, minmax(0, 1fr))`,
          gap: 6,
          marginTop: 8,
        }}
      >
        {tous.map(({ n, href, label }) => (
          <div
            key={n.numero}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
          >
            {pastille(href, label, n.numero, true)}
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                color: CORAIL_FONCE,
                lineHeight: 1.2,
                textAlign: "center",
              }}
            >
              {n.nom}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Phrase de protection en bas de la page 1 (README §11), à l'image de la mention
// préventive de Guide-moi (choix Laura, 19/10) : petite, centrée, italique, gris doux.
// Le « 15 » reste cliquable.
// « Repères officiels » n'y figure plus : il est déjà en sous-titre (Laura, 20/10).
export function SosAccueil() {
  const message = SOS.accueil?.message;
  if (!message) return null;
  const morceaux = message.split(/(\b15\b)/);
  return (
    <div
      style={{
        padding: "10px 4px 4px",
        fontSize: 9,
        color: SOS_MUTED,
        lineHeight: 1.4,
        textAlign: "center",
        fontStyle: "italic",
      }}
    >
      {morceaux.map((m, i) =>
        m === "15" ? (
          <a key={i} href="tel:15" style={{ color: SOS_MUTED, textDecoration: "underline" }}>
            15
          </a>
        ) : (
          <React.Fragment key={i}>{m}</React.Fragment>
        ),
      )}
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
  // Vomissements : un bol, une vague qui en sort.
  vomissements: (
    <>
      <path d="M4 12h16a8 8 0 01-16 0z" />
      <path d="M9 8.5c0-1.5 1.5-1.5 1.5-3S9 4 9 2.8" />
      <path d="M14 8.5c0-1.5 1.5-1.5 1.5-3S14 4 14 2.8" />
    </>
  ),
  // Diarrhée : une goutte (déshydratation).
  diarrhee: (
    <path d="M12 3.5c-3 4-5.5 7-5.5 10.2a5.5 5.5 0 0011 0C17.5 10.5 15 7.5 12 3.5z" />
  ),
  // Choc à la tête : une tête de profil et un petit éclat.
  "choc-tete": (
    <>
      <circle cx="11" cy="13" r="6.5" />
      <path d="M17.5 3.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
    </>
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
  const liste = (items: string[]) => (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((it, i) => (
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
  );
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
        {bloc.niveau !== "comprendre" && SOS.niveaux?.[bloc.niveau]?.sous_titre ? (
          <p style={{ ...texte, fontSize: 10.5, fontWeight: 600, marginBottom: 7 }}>
            {SOS.niveaux[bloc.niveau]!.sous_titre}
          </p>
        ) : null}
        {bloc.note ? (
          <p style={{ ...texte, fontStyle: "italic", marginBottom: 6 }}>{bloc.note}</p>
        ) : null}
        {bloc.definition ? (
          <p style={{ ...texte, fontStyle: "italic", marginBottom: 4 }}>
            {bloc.definition}
          </p>
        ) : null}
        {bloc.texte ? <p style={texte}>{bloc.texte}</p> : null}
        {bloc.items && bloc.items.length > 0 ? liste(bloc.items) : null}
        {bloc.sections?.map((sec, si) => (
          <div key={si} style={{ marginTop: si === 0 ? 0 : 11 }}>
            <p style={{ ...texte, fontWeight: 700, marginBottom: 5 }}>{sec.titre}</p>
            {sec.texte ? <p style={{ ...texte, marginBottom: 5 }}>{sec.texte}</p> : null}
            {sec.items && sec.items.length > 0 ? liste(sec.items) : null}
          </div>
        ))}
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

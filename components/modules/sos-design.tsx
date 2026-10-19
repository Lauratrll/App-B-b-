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
  note?: string; // phrase de l'app, en italique en tête du bloc (pas une citation)
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

type SosNumero = { numero: string; nom: string; precision?: string };

type SosData = {
  accueil?: { message: string };
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

// Bandeau sans ligne source (README §6) : 15 et 112 en appel, 114 à part en
// SMS sous « Cas particulier ». Version complète en page 1, compacte ensuite.
export function SosBandeau({ complet }: { complet?: boolean }) {
  const { titre, numeros, cas_particulier: cas } = SOS.bandeau;
  const pastille = (href: string, label: string, n: string, grand?: boolean) => (
    <a
      key={n}
      href={href}
      aria-label={label}
      style={{
        minWidth: grand ? 56 : 46,
        height: grand ? 38 : 34,
        padding: "0 10px",
        borderRadius: 19,
        background: "#fff",
        color: CORAIL_FONCE,
        fontWeight: 700,
        fontSize: grand ? 16 : 14,
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
          background: CORAIL,
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
            color: "#fff",
          }}
        >
          Urgences
        </span>
        {numeros.map((n) => pastille(`tel:${n.numero}`, `Appeler le ${n.numero}`, n.numero))}
        {cas ? pastille(`sms:${cas.numero}`, `Envoyer un SMS au ${cas.numero}`, cas.numero) : null}
      </div>
    );
  }

  const ligne = (n: SosNumero, href: string, label: string) => (
    <div key={n.numero} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
      {pastille(href, label, n.numero, true)}
      <div style={{ color: "#fff", lineHeight: 1.3 }}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>{n.nom}</div>
        {n.precision ? (
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.88)" }}>{n.precision}</div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div style={{ background: CORAIL, borderRadius: 12, padding: "11px 13px", margin: "0 0 18px" }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: "#fff",
        }}
      >
        {titre}
      </div>
      {numeros.map((n) => ligne(n, `tel:${n.numero}`, `Appeler le ${n.numero}`))}
      {cas ? (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.35)",
            marginTop: 10,
            paddingTop: 8,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: ".07em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,.88)",
            }}
          >
            {cas.titre}
          </div>
          {ligne(cas, `sms:${cas.numero}`, `Envoyer un SMS au ${cas.numero}`)}
        </div>
      ) : null}
    </div>
  );
}

// Message d'accueil de la page 1 (README §11) : le « 15 » est cliquable.
export function SosAccueil() {
  const message = SOS.accueil?.message;
  if (!message) return null;
  const morceaux = message.split(/(\b15\b)/);
  return (
    <p
      style={{
        textAlign: "center",
        fontFamily: "var(--font-playfair), Georgia, serif",
        fontWeight: 600,
        fontSize: 16,
        color: CORAIL_FONCE,
        margin: "0 0 16px",
        lineHeight: 1.3,
      }}
    >
      {morceaux.map((m, i) =>
        m === "15" ? (
          <a key={i} href="tel:15" style={{ color: CORAIL_FONCE, textDecoration: "underline" }}>
            15
          </a>
        ) : (
          <React.Fragment key={i}>{m}</React.Fragment>
        ),
      )}
    </p>
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

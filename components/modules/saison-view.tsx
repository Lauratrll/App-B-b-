import type React from "react";
import type { SaisonKey, SaisonVersion } from "@/lib/content";

// ----------------------------------------------------------------------------
// Vivre la saison : design du 01/11 (Laura).
// - Même typographie et mêmes tailles que Sommeil, S.O.S et Guide-moi :
//   titre Playfair 21, sous-titre en capitales 9 px, titres de cartes 12 px
//   gras, textes 11 px (interligne 1,55).
// - Fond de page propre à la saison, clair et pastel, tiré d'une couleur
//   existante de l'app (version éclaircie en OKLCH : clarté 0,955, intensité
//   x 0,75, teinte inchangée) :
//     hiver     ← bleu du slot 3 de Sommeil      #CEE4E8 (journee-et-siestes)
//     printemps ← vert du slot 1 de Sommeil      #DCDDBB (reperes-cles)
//     été       ← jaune du slot 1 de S.O.S       #FBE8C0
//     automne   ← terracotta du slot 1 Guide-moi #F0B8A8
// - Cadres de texte en blanc transparent posés sur ce fond.
// Les couleurs couleur_theme / couleur_accent / emoji du JSON ne sont plus
// utilisées : la page prend la gamme de la saison.
// ----------------------------------------------------------------------------

const PLAYFAIR = "var(--font-playfair), Georgia, serif";
const TEXT = "#3A3228";
export const CADRE_BLANC = "rgba(255,255,255,.6)";

export type SaisonTon = {
  /** Fond de toute la page (pastel). */
  fond: string;
  /** Sous-titre, intitulés de section (teinte foncée de la saison). */
  label: string;
  /** Pastilles numérotées et picto (teinte moyenne). */
  accent: string;
};

export const SAISON_TONS: Record<SaisonKey, SaisonTon> = {
  hiver: { fond: "#E3F4F7", label: "#2E5D65", accent: "#86ADB4" },
  printemps: { fond: "#F2F2D9", label: "#5A5910", accent: "#A9A96C" },
  ete: { fond: "#FDEFD1", label: "#6C5105", accent: "#C1A056" },
  automne: { fond: "#FFE5D8", label: "#7F4130", accent: "#E7876C" },
};

// Pictos traits simples (style des slots Sommeil), un par saison.
const PICTO: Record<SaisonKey, React.ReactNode> = {
  hiver: (
    <>
      <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
      <path d="M9.8 4.6L12 6.5l2.2-1.9M9.8 19.4L12 17.5l2.2 1.9" />
    </>
  ),
  printemps: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 12c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5z" />
      <path d="M12 15c0-3-2.5-5.2-6-5.2 0 3 2.5 5.2 6 5.2z" />
    </>
  ),
  ete: (
    <>
      <circle cx="12" cy="12" r="3.6" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <line key={i} x1={12 + 6.5 * Math.cos(a)} y1={12 + 6.5 * Math.sin(a)} x2={12 + 9 * Math.cos(a)} y2={12 + 9 * Math.sin(a)} />
        );
      })}
    </>
  ),
  automne: (
    <>
      <path d="M5 19C5 10.5 10.5 5 19.5 4.5 19 13.5 13.5 19 5 19z" />
      <path d="M5 19l8.5-8.5" />
    </>
  ),
};

export function SaisonPicto({ saison }: { saison: SaisonKey }) {
  return (
    <svg
      width={36}
      height={36}
      viewBox="0 0 24 24"
      fill="none"
      stroke={SAISON_TONS[saison].label}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ display: "block", margin: "0 auto" }}
    >
      {PICTO[saison]}
    </svg>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: ".07em",
};

export function SaisonEntete({
  saison,
  sousTitre,
}: {
  saison: SaisonKey;
  sousTitre: string;
}) {
  const ton = SAISON_TONS[saison];
  return (
    <header style={{ textAlign: "center", marginBottom: 16 }}>
      <SaisonPicto saison={saison} />
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
        Vivre la saison
      </h1>
      <div style={{ ...labelStyle, color: ton.label, letterSpacing: ".15em" }}>{sousTitre}</div>
    </header>
  );
}

const cadre: React.CSSProperties = {
  background: CADRE_BLANC,
  borderRadius: 12,
  padding: "11px 13px",
  marginBottom: 8,
};

export function SaisonView({ version, saison }: { version: SaisonVersion; saison: SaisonKey }) {
  const ton = SAISON_TONS[saison];
  const idees = version.idees_du_moment ?? [];

  return (
    <article>
      {version.ambiance ? (
        <div style={cadre}>
          <p style={{ fontSize: 11, fontStyle: "italic", color: TEXT, lineHeight: 1.55, margin: 0 }}>
            {version.ambiance}
          </p>
        </div>
      ) : null}

      {idees.length > 0 ? (
        <>
          <div style={{ ...labelStyle, color: ton.label, margin: "14px 0 7px" }}>Idées du moment</div>
          {idees.map((idee, i) => (
            <div key={i} style={cadre}>
              <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
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
                    background: ton.accent,
                    color: "#FFFFFF",
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: TEXT, lineHeight: 1.3 }}>
                  {idee.titre}
                </span>
              </div>
              {idee.texte ?? idee.ce_que_ca_apporte ? (
                <p style={{ fontSize: 11, color: TEXT, lineHeight: 1.55, margin: "9px 0 0" }}>
                  {idee.texte ?? idee.ce_que_ca_apporte}
                </p>
              ) : null}
            </div>
          ))}
        </>
      ) : null}
    </article>
  );
}

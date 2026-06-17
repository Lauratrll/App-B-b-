import { Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { ConseilSoin } from "@/lib/content";
import {
  PLAYFAIR,
  INK,
  EUCAL,
  PEACH_DARK,
  WARM_LABEL,
  WARM_BODY,
  CORAL,
  CORAL_DARK,
  COULEUR_SLOT,
  TITRE_COURT,
  formatTitre,
  SoinPicto,
} from "./soin-design";

// ----------------------------------------------------------------------------
// Écrans de détail « Prendre soin de moi » (B1→B5), squelette commun.
// Spec : skills/CONSIGNES_CLAUDE_CODE_prendre_soin_de_moi.md §6.
// Rendu par `numero`. Les champs absents (selon le mois) sont ignorés.
// La TopBar et la nav du bas sont fournies par le layout (comme l'accueil).
// ----------------------------------------------------------------------------

type Rec = Record<string, unknown>;
const str = (v: unknown): string => (typeof v === "string" ? v : "");
const arr = (v: unknown): string[] => (Array.isArray(v) ? (v as unknown[]).map(String) : []);

// ---- petits pictos d'accent ------------------------------------------------
function Svg({ children, size = 14, color = PEACH_DARK, sw = 1.7 }: { children: ReactNode; size?: number; color?: string; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
      {children}
    </svg>
  );
}
const Horloge = (p: { color?: string }) => (
  <Svg color={p.color}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></Svg>
);
const Coche = (p: { color?: string }) => <Svg color={p.color}><polyline points="20 6 9 17 4 12" /></Svg>;
const Etoile = (p: { color?: string }) => (
  <Svg color={p.color}><polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.6 5.8 21 7 14 2 9.3 9 8.5 12 2" /></Svg>
);

// ---- blocs partagés --------------------------------------------------------
const labStyle: CSSProperties = {
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: ".13em",
  textTransform: "uppercase",
  color: EUCAL,
  marginBottom: 8,
};

function Cadre({
  bg,
  label,
  labelColor = EUCAL,
  border,
  children,
}: {
  bg: string;
  label?: string;
  labelColor?: string;
  border?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: border ? 10 : 12,
        border: border ?? "none",
        padding: "13px 15px",
        marginTop: 14,
      }}
    >
      {label ? <div style={{ ...labStyle, color: labelColor }}>{label}</div> : null}
      {children}
    </div>
  );
}

function Prose({ texte, italic, color = WARM_BODY }: { texte: string; italic?: boolean; color?: string }) {
  const paras = texte.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  return (
    <>
      {paras.map((p, i) => (
        <p
          key={i}
          style={{
            fontSize: 12.5,
            lineHeight: 1.6,
            color,
            fontStyle: italic ? "italic" : "normal",
            margin: i === 0 ? 0 : "9px 0 0",
            whiteSpace: "pre-line",
          }}
        >
          {p}
        </p>
      ))}
    </>
  );
}

function Chip({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 10.5,
        color: WARM_LABEL,
        background: "#F1DDD2",
        borderRadius: 20,
        padding: "4px 11px",
      }}
    >
      {icon}
      {children}
    </span>
  );
}

function Chips({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 7, marginTop: 12 }}>
      {children}
    </div>
  );
}

function Liste({ items, marqueur = "coche" }: { items: string[]; marqueur?: "coche" | "chevron" | "puce" }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 7 }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
          <span style={{ marginTop: 3 }}>
            {marqueur === "coche" ? (
              <Coche />
            ) : marqueur === "chevron" ? (
              <span style={{ color: PEACH_DARK, fontWeight: 700 }}>›</span>
            ) : (
              <span style={{ color: "#9A8E80" }}>•</span>
            )}
          </span>
          <span style={{ fontSize: 12.5, lineHeight: 1.5, color: WARM_BODY }}>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function TraitChapo({ texte }: { texte: string }) {
  return (
    <div style={{ textAlign: "center", marginTop: 14 }}>
      <div style={{ width: 34, height: 1, background: PEACH_DARK, opacity: 0.55, margin: "0 auto 12px" }} />
      <p style={{ fontSize: 12.5, lineHeight: 1.6, color: WARM_BODY, margin: 0 }}>{texte}</p>
    </div>
  );
}

// Isole un mantra entre « … » pour l'afficher en Playfair italique centré.
function Cloture({ texte }: { texte: string }) {
  const m = texte.match(/«\s*([\s\S]*?)\s*»/);
  if (!m) return <Prose texte={texte} />;
  const avant = texte.slice(0, m.index).trim();
  return (
    <>
      {avant ? <Prose texte={avant} /> : null}
      <p
        style={{
          fontFamily: PLAYFAIR,
          fontStyle: "italic",
          fontSize: 15,
          lineHeight: 1.4,
          color: INK,
          textAlign: "center",
          margin: "12px 0 0",
        }}
      >
        «&nbsp;{m[1]}&nbsp;»
      </p>
    </>
  );
}

// ---- B1 — Auto-massage -----------------------------------------------------
function B1({ c }: { c: Rec }) {
  const points = Array.isArray(c.points) ? (c.points as Rec[]) : [];
  const indications = arr(c.indications);
  return (
    <>
      <Chips>
        {str(c.duree) ? <Chip icon={<Horloge color={WARM_LABEL} />}>{str(c.duree)}</Chip> : null}
        {points.length ? <Chip icon={<SoinPicto numero={1} size={13} color={WARM_LABEL} strokeWidth={1.7} />}>{points.length} points · sur tes mains</Chip> : null}
      </Chips>
      {str(c.intro) ? <TraitChapo texte={str(c.intro)} /> : null}
      {indications.length ? (
        <Cadre bg="#F7ECE4" label="Tu peux l'utiliser quand">
          <Liste items={indications} marqueur="coche" />
        </Cadre>
      ) : null}
      {points.length ? (
        <Cadre bg="#FBF4EE" label={`Les ${points.length} points, dans l'ordre`}>
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {points.map((pt, i) => {
              const zone = str(pt.zone);
              const par = zone.match(/^(.*?)\s*\((.*)\)\s*$/);
              return (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 11,
                    padding: i === 0 ? "0 0 11px" : "11px 0",
                    borderTop: i === 0 ? "none" : "0.5px solid #EFE2D8",
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: PEACH_DARK,
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.4, color: INK }}>
                      <strong style={{ fontWeight: 700 }}>{par ? par[1] : zone}</strong>
                      {par ? <span style={{ color: "#9A8E80" }}> ({par[2]})</span> : null}
                    </p>
                    {str(pt.geste) ? (
                      <p style={{ margin: "3px 0 0", fontSize: 12, lineHeight: 1.45, color: WARM_BODY }}>{str(pt.geste)}</p>
                    ) : null}
                    {str(pt.effet) ? (
                      <p style={{ margin: "3px 0 0", fontSize: 11.5, fontStyle: "italic", lineHeight: 1.4, color: WARM_BODY }}>{str(pt.effet)}</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </Cadre>
      ) : null}
      {str(c.cloture) ? (
        <Cadre bg="#F3DCD0" label="Pour clore">
          <Cloture texte={str(c.cloture)} />
        </Cadre>
      ) : null}
    </>
  );
}

// ---- B2 — Méditation audio -------------------------------------------------
function MeditationTexte({ texte }: { texte: string }) {
  const blocs = texte.split(/\n{2,}/).filter((b) => b.trim().length > 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {blocs.map((b, i) => {
        const pause = b.match(/\[pause\s*[-–]\s*(.+?)\]/i);
        if (pause) {
          return (
            <p key={i} style={{ textAlign: "center", fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: EUCAL, margin: 0 }}>
              pause&nbsp;{pause[1].replace(/secondes?/i, "s").trim()}
            </p>
          );
        }
        return (
          <p key={i} style={{ fontSize: 12.5, lineHeight: 1.6, color: WARM_BODY, margin: 0, whiteSpace: "pre-line" }}>
            {b}
          </p>
        );
      })}
    </div>
  );
}

function LecteurAudio({ duree }: { duree: string }) {
  return (
    <div style={{ background: "#F4E4DA", borderRadius: 12, padding: "11px 14px", marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: PEACH_DARK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden>
          <polygon points="8 5 19 12 8 19 8 5" />
        </svg>
      </span>
      <span style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(200,128,106,.3)" }}>
        <span style={{ display: "block", width: "0%", height: "100%", borderRadius: 2, background: PEACH_DARK }} />
      </span>
      <span style={{ fontSize: 10.5, color: WARM_LABEL, flexShrink: 0 }}>0:00&nbsp;/&nbsp;{duree || "—"}</span>
    </div>
  );
}

function B2({ c }: { c: Rec }) {
  return (
    <>
      <Chips>
        {str(c.duree) ? <Chip icon={<Horloge color={WARM_LABEL} />}>{str(c.duree)}</Chip> : null}
        <Chip>voix à la 1ʳᵉ personne</Chip>
      </Chips>
      {str(c.instruction) ? (
        <Cadre bg="#F7ECE4" label="Avant de commencer">
          <Prose texte={str(c.instruction)} />
        </Cadre>
      ) : null}
      {str(c.intro) ? (
        <Cadre bg="#F9F1EA" label="L'image de cette méditation">
          <Prose texte={str(c.intro)} italic />
        </Cadre>
      ) : null}
      <LecteurAudio duree={str(c.duree)} />
      {str(c.texte_meditation) ? (
        <Cadre bg="#FBF6F1" border="0.5px solid #EFE2D8" label="Texte de la méditation">
          <MeditationTexte texte={str(c.texte_meditation)} />
        </Cadre>
      ) : null}
    </>
  );
}

// ---- Gabarits papier (B3) — visuels NON éditables, pilotés par `gabarit` ----
// §6.3 : un seul composant présentationnel, paramétré par gabarit.type.
// Aucune saisie / sauvegarde in-app ; ne re-rend aucun texte de contenu.
const LIGNE: CSSProperties = { display: "block", height: 1, background: "rgba(58,50,40,.20)" };

function numFrom(v: unknown, def: number): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const m = v.match(/\d+/);
    if (m) return Number(m[0]);
  }
  return def;
}

function Lignes({ n = 5 }: { n?: number }) {
  const k = Math.max(1, Math.min(n, 7));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
      {Array.from({ length: k }).map((_, i) => (
        <span key={i} style={LIGNE} />
      ))}
    </div>
  );
}

function ColHeader({ label, bg }: { label: string; bg: string }) {
  return (
    <div style={{ background: bg, borderRadius: 7, padding: "4px 8px", fontSize: 10, fontWeight: 600, color: WARM_LABEL, textAlign: "center", lineHeight: 1.2 }}>
      {label}
    </div>
  );
}

function B3Gabarit({ g }: { g: Rec }) {
  const type = str(g.type);
  const colonnes = (Array.isArray(g.colonnes) ? g.colonnes : Array.isArray(g.colonnes_jours) ? g.colonnes_jours : []).map(String);
  const pages = (Array.isArray(g.pages) ? g.pages : []).map(String);
  const lignes = numFrom(g.lignes ?? g.lignes_par_colonne, 5);

  switch (type) {
    case "vocal":
      return (
        <div style={{ background: "#F4E4DA", borderRadius: 10, padding: "13px 14px", marginTop: 8, display: "flex", alignItems: "center", gap: 11 }}>
          <span style={{ width: 32, height: 32, borderRadius: "50%", background: PEACH_DARK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M6 11a6 6 0 0 0 12 0M12 17v3" />
            </svg>
          </span>
          <span style={{ fontSize: 12, color: WARM_BODY }}>
            Enregistrement vocal{str(g.duree) ? ` · ${str(g.duree)}` : ""}
          </span>
        </div>
      );

    case "deux_colonnes":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
          {(colonnes.length ? colonnes : ["", ""]).slice(0, 2).map((col, i) => (
            <div key={i}>
              <ColHeader label={col} bg={i % 2 ? "#E7B99F" : "#EFE0D0"} />
              <Lignes n={numFrom(g.lignes_par_colonne, 6)} />
            </div>
          ))}
        </div>
      );

    case "deux_pages":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          {(pages.length ? pages : ["", ""]).slice(0, 2).map((pg, i) => (
            <div key={i}>
              <ColHeader label={pg} bg={i % 2 ? "#E7B99F" : "#EFE0D0"} />
              <Lignes n={4} />
            </div>
          ))}
        </div>
      );

    case "lettre":
      return (
        <div style={{ marginTop: 8 }}>
          {str(g.entete) ? (
            <p style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontSize: 13, color: INK, margin: "0 0 8px" }}>{str(g.entete)},</p>
          ) : null}
          <Lignes n={lignes} />
        </div>
      );

    case "liste_numerotee": {
      const n = Math.min(numFrom(g.nombre, 5), 7);
      const prefixe = str(g.prefixe_entree);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 8 }}>
          {Array.from({ length: n }).map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 9, alignItems: "center" }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: PEACH_DARK, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
              {prefixe ? <span style={{ fontSize: 11, fontStyle: "italic", color: WARM_BODY, whiteSpace: "nowrap" }}>{prefixe}</span> : null}
              <span style={{ flex: 1, ...LIGNE }} />
            </div>
          ))}
        </div>
      );
    }

    case "carnet_date": {
      const jours = numFrom(g.jours, 7);
      const champs = (Array.isArray(g.champs_par_jour) ? g.champs_par_jour : Array.isArray(g.colonnes) ? g.colonnes : []).map(String);
      const sample = Math.min(jours, 3);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          {Array.from({ length: sample }).map((_, i) => (
            <div key={i} style={{ borderTop: i ? "0.5px solid #EFE2D8" : "none", paddingTop: i ? 8 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: PEACH_DARK }}>Jour {i + 1}</span>
                <span style={{ flex: 1, ...LIGNE }} />
              </div>
              {champs.length ? (
                champs.map((ch, j) => (
                  <div key={j} style={{ fontSize: 10.5, color: WARM_BODY, margin: "4px 0 0" }}>{ch}<span style={{ display: "block", marginTop: 5, ...LIGNE }} /></div>
                ))
              ) : (
                <Lignes n={1} />
              )}
            </div>
          ))}
          {jours > sample ? (
            <p style={{ fontSize: 10, fontStyle: "italic", color: EUCAL, textAlign: "center", margin: 0 }}>… {jours} jours au total</p>
          ) : null}
        </div>
      );
    }

    case "grille_planning": {
      // §6.3 « Ma semaine en couleurs » (M19).
      const cols = Math.min(numFrom(g.colonnes_jours ?? g.colonnes, 7), 7);
      const jours = ["L", "M", "M", "J", "V", "S", "D"].slice(0, cols);
      const bandes = ["6–9h", "9–12h", "12–14h", "14–18h", "18–21h", "21–23h"];
      const legende = Array.isArray(g.legende) ? (g.legende as Rec[]) : [];
      const COL_AUTRES = "#B7C4BE";
      const COL_MOI = "#E6B570";
      // Quelques cellules pré-colorées (illustratif).
      const moiCells = new Set(["1-2", "4-5", "5-0", "3-6"]);
      const autresCells = new Set(["0-0", "2-3", "3-1", "0-4", "1-6"]);
      return (
        <div style={{ marginTop: 8 }}>
          {str(g.plage_horaire) ? (
            <p style={{ fontSize: 10, color: EUCAL, margin: "0 0 6px" }}>{str(g.plage_horaire)}</p>
          ) : null}
          <div style={{ display: "grid", gridTemplateColumns: `auto repeat(${cols}, 1fr)`, gap: 2 }}>
            <span />
            {jours.map((j, i) => (
              <span key={`h${i}`} style={{ fontSize: 9, fontWeight: 600, color: WARM_LABEL, textAlign: "center", background: "#F0E2D5", borderRadius: 3, padding: "3px 0" }}>{j}</span>
            ))}
            {bandes.map((b, r) => (
              <Fragment key={r}>
                <span style={{ fontSize: 8.5, color: WARM_BODY, background: "#F4ECE2", borderRadius: 3, padding: "0 5px", display: "flex", alignItems: "center" }}>{b}</span>
                {jours.map((_, c) => {
                  const key = `${r}-${c}`;
                  const bg = moiCells.has(key) ? COL_MOI : autresCells.has(key) ? COL_AUTRES : "transparent";
                  return <span key={c} style={{ height: 15, borderRadius: 3, border: "0.5px solid #E4D5C7", background: bg }} />;
                })}
              </Fragment>
            ))}
          </div>
          {legende.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 8 }}>
              {legende.map((l, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, color: WARM_BODY }}>
                  <span style={{ width: 11, height: 11, borderRadius: 3, background: i === 1 ? COL_MOI : COL_AUTRES }} />
                  {str(l.cle)}
                </span>
              ))}
            </div>
          ) : null}
          {str(g.objectif) ? (
            <p style={{ fontSize: 11, fontStyle: "italic", color: EUCAL, textAlign: "center", margin: "8px 0 0", lineHeight: 1.4 }}>{str(g.objectif)}</p>
          ) : null}
        </div>
      );
    }

    case "cercles_concentriques": {
      // §6.3 « Ma carte de soutien » (M1). cercles[0] = anneau le plus proche.
      const cer = Array.isArray(g.cercles) ? (g.cercles as Rec[]) : [];
      const swatch = ["#F0CFB8", "#F7E2D2", "#FBEFE6"];
      return (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg width="180" height="180" viewBox="0 0 200 200" aria-hidden>
              <circle cx="100" cy="100" r="94" fill="#FBEFE6" />
              <circle cx="100" cy="100" r="66" fill="#F7E2D2" />
              <circle cx="100" cy="100" r="40" fill="#F0CFB8" />
              <circle cx="100" cy="100" r="22" fill="#E7B99F" />
              <text x="100" y="105" textAnchor="middle" fontFamily={PLAYFAIR} fontSize="15" fontStyle="italic" fill={INK}>{str(g.centre) || "Moi"}</text>
            </svg>
          </div>
          {cer.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
              {cer.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, position: "relative", top: 1, background: swatch[i] ?? "#F0CFB8", border: "1px solid #C8806A" }} />
                  <span style={{ fontSize: 11.5, lineHeight: 1.4, color: WARM_BODY }}>
                    <strong style={{ color: WARM_LABEL, fontWeight: 700 }}>{str(c.label)}</strong>
                    {str(c.indice) ? ` — ${str(c.indice)}` : ""}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
          {str(g.annotation) ? (
            <p style={{ fontSize: 11, fontStyle: "italic", color: EUCAL, textAlign: "center", margin: "10px 0 0", lineHeight: 1.4 }}>{str(g.annotation)}</p>
          ) : null}
        </div>
      );
    }

    case "lignes_libres":
    default:
      return <Lignes n={lignes} />;
  }
}

// ---- B3 — Auto-reconnaissance ----------------------------------------------
function B3({ c }: { c: Rec }) {
  const amorces = arr(c.amorces_si_blocage);
  const gabarit = (c.gabarit && typeof c.gabarit === "object" ? (c.gabarit as Rec) : null);
  const estVocal =
    (gabarit && str(gabarit.type) === "vocal") || c.espace_pour_enregistrement === true;
  return (
    <>
      <Chips>
        <Chip>{estVocal ? "format vocal" : "format écriture"}</Chip>
      </Chips>
      {str(c.intro) ? <TraitChapo texte={str(c.intro)} /> : null}
      {str(c.consigne) ? (
        <Cadre bg="#F7ECE4" label="Comment faire">
          <Prose texte={str(c.consigne)} />
        </Cadre>
      ) : null}
      <Cadre bg="#FBF6F1" border="0.5px solid #EFE2D8" label="Ta carte">
        <B3Gabarit g={gabarit ?? {}} />
      </Cadre>
      {amorces.length ? (
        <Cadre bg="#F7ECE4" label="Si tu bloques, commence par…">
          <Liste items={amorces} marqueur="chevron" />
        </Cadre>
      ) : null}
      {str(c.principe) ? (
        <Cadre bg="#F9F1EA" label="À retenir">
          <Prose texte={str(c.principe)} italic />
        </Cadre>
      ) : null}
    </>
  );
}

// ---- B4 — Réalité du post-partum -------------------------------------------
function B4({ c }: { c: Rec }) {
  const maman = c.pour_la_maman as Rec | undefined;
  const coparent = c.pour_le_papa_co_parent as Rec | undefined;
  const signaux = arr(c.signaux_a_ne_pas_negliger);
  const quiConsulter = arr(c.qui_consulter);
  return (
    <>
      {str(c.intro) ? (
        <Cadre bg="#F7ECE4" label="Ce qui se passe">
          <Prose texte={str(c.intro)} />
        </Cadre>
      ) : null}
      {maman && str(maman.contenu) ? (
        <Cadre bg="#F8E6DE" label={str(maman.titre) || "Côté maman"}>
          <Prose texte={str(maman.contenu)} />
        </Cadre>
      ) : null}
      {coparent && str(coparent.contenu) ? (
        <Cadre bg="#F6EBE1" label={str(coparent.titre) || "Côté papa / co-parent"}>
          <Prose texte={str(coparent.contenu)} />
        </Cadre>
      ) : null}
      {signaux.length ? (
        <Cadre bg="#E4DDD6" label="Signaux à ne pas négliger">
          <Liste items={signaux} marqueur="puce" />
        </Cadre>
      ) : null}
      {str(c.urgence) ? (
        <Cadre bg="#EDE9E4" border={`1px solid ${CORAL}`} label="En cas d'urgence" labelColor={CORAL_DARK}>
          <p style={{ fontSize: 12.5, lineHeight: 1.55, color: WARM_BODY, margin: 0 }}>
            {renderUrgence(str(c.urgence))}
          </p>
        </Cadre>
      ) : null}
      {quiConsulter.length ? (
        <Cadre bg="#EFEBE6" border="1px solid #D9D2CA" label="Qui consulter">
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {quiConsulter.map((q, i) => {
              const sep = q.match(/^(.*?)(\s*:\s*)([\s\S]*)$/);
              return (
                <li key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 12, lineHeight: 1.5, color: WARM_BODY }}>
                  <span style={{ color: "#9A8E80", marginTop: 1 }}>•</span>
                  <span>
                    {sep ? (
                      <>
                        <strong style={{ fontWeight: 700, color: INK }}>{sep[1]}</strong>
                        {sep[2]}
                        {sep[3]}
                      </>
                    ) : (
                      q
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </Cadre>
      ) : null}
    </>
  );
}

// Met « 3114 » en gras Coral-dark dans le texte d'urgence.
function renderUrgence(texte: string): ReactNode {
  const parts = texte.split(/(3114)/);
  return parts.map((p, i) =>
    p === "3114" ? (
      <strong key={i} style={{ fontWeight: 700, color: CORAL_DARK }}>
        3114
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

// ---- Motifs illustratifs (B5) — §6.5, non éditables, pilotés par `gabarit` --
const MOTIF_STROKE = PEACH_DARK;
const MOTIF_FILL = "#F3DCD0";

function MotifBox({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>{children}</div>;
}

function B5Gabarit({ g, prenom }: { g: Rec; prenom: string }) {
  switch (str(g.type)) {
    case "menu": {
      // §6.5 « Le menu des limites » (M15) — rendu en carte de restaurant.
      const sections = Array.isArray(g.sections) ? (g.sections as Rec[]) : [];
      const maison = str(g.maison).replace(/\{prenom\}/gi, prenom || "");
      return (
        <div style={{ background: "#FBF4EC", border: "1px solid #DCC7B4", borderRadius: 10, padding: "14px 15px", marginTop: 12, boxShadow: "inset 0 0 0 3px #FBF4EC, inset 0 0 0 4px #ECDCCB" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#C8806A", fontSize: 12, letterSpacing: ".3em" }}>✦ ❦ ✦</div>
            {str(g.entete) ? (
              <p style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 17, color: INK, margin: "4px 0 2px" }}>{str(g.entete)}</p>
            ) : null}
            {maison ? (
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: WARM_LABEL, margin: 0 }}>{maison}</p>
            ) : null}
            <div style={{ height: 1, background: "#ECDCCB", margin: "9px 0" }} />
          </div>
          {sections.map((s, si) => {
            const ex = Array.isArray(s.exemples) ? (s.exemples as Rec[]) : [];
            return (
              <div key={si} style={{ marginTop: si ? 12 : 0 }}>
                <p style={{ fontFamily: PLAYFAIR, fontWeight: 600, fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase", color: WARM_LABEL, textAlign: "center", margin: 0 }}>{str(s.titre)}</p>
                {str(s.sous_titre) ? (
                  <p style={{ fontSize: 11, fontStyle: "italic", color: EUCAL, textAlign: "center", margin: "2px 0 8px" }}>{str(s.sous_titre)}</p>
                ) : null}
                {ex.map((e, ei) => (
                  <div key={ei} style={{ margin: "7px 0" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontSize: 12, color: INK }}>{str(e.intitule)}</span>
                      <span style={{ flex: 1, borderBottom: "1px dotted #D9C6B4" }} />
                    </div>
                    {str(e.descripteur) ? (
                      <p style={{ fontSize: 10.5, fontStyle: "italic", color: "#C8806A", margin: "2px 0 0" }}>{str(e.descripteur)}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            );
          })}
          {g.items_sont_des_exemples === true ? (
            <div style={{ marginTop: 10 }}>
              {[0, 1].map((i) => (
                <div key={i} style={{ borderBottom: "1px dotted #D9C6B4", margin: "10px 0" }} />
              ))}
              <p style={{ textAlign: "center", margin: "4px 0 0" }}>
                <span style={{ fontSize: 9.5, color: WARM_LABEL, background: "#F3DCD0", borderRadius: 20, padding: "3px 10px" }}>à composer vous-mêmes</span>
              </p>
            </div>
          ) : null}
          {str(g.note) ? (
            <>
              <div style={{ height: 1, background: "#ECDCCB", margin: "10px 0 7px" }} />
              <p style={{ fontSize: 10.5, fontStyle: "italic", color: WARM_BODY, textAlign: "center", margin: 0 }}>{str(g.note)}</p>
            </>
          ) : null}
        </div>
      );
    }
    case "sortie":
      return (
        <MotifBox>
          <svg width="44" height="50" viewBox="0 0 44 50" fill={MOTIF_FILL} stroke={MOTIF_STROKE} strokeWidth={1.4} strokeLinejoin="round" aria-hidden>
            <rect x="12" y="6" width="22" height="38" rx="2" />
            <circle cx="29" cy="26" r="1.3" fill={MOTIF_STROKE} stroke="none" />
            <path d="M8 44h30" fill="none" />
          </svg>
        </MotifBox>
      );
    case "cartes_questions": {
      const n = Math.min(numFrom(g.nombre, 3), 5);
      return (
        <MotifBox>
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: n }).map((_, i) => (
              <span key={i} style={{ width: 26, height: 34, borderRadius: 5, background: MOTIF_FILL, border: `1.2px solid ${MOTIF_STROKE}`, display: "flex", alignItems: "center", justifyContent: "center", color: MOTIF_STROKE, fontSize: 13 }}>?</span>
            ))}
          </div>
        </MotifBox>
      );
    }
    case "carte_a_remplir":
      return (
        <MotifBox>
          <div style={{ width: 190, borderRadius: 8, background: MOTIF_FILL, border: `1.2px solid ${MOTIF_STROKE}`, padding: "9px 11px" }}>
            {str(g.entete) ? (
              <p style={{ fontSize: 10.5, fontWeight: 600, color: WARM_LABEL, margin: "0 0 7px", textAlign: "center" }}>{str(g.entete)}</p>
            ) : null}
            <span style={{ display: "block", height: 1, background: "rgba(200,128,106,.5)", margin: "7px 0" }} />
            <span style={{ display: "block", height: 1, background: "rgba(200,128,106,.5)" }} />
          </div>
        </MotifBox>
      );
    case "mots_echanges":
      return (
        <MotifBox>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 34, height: 26, borderRadius: 4, background: MOTIF_FILL, border: `1.2px solid ${MOTIF_STROKE}` }} />
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke={MOTIF_STROKE} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M2 8h16M13 3l5 5-5 5" />
            </svg>
            <span style={{ width: 34, height: 26, borderRadius: 4, background: MOTIF_FILL, border: `1.2px solid ${MOTIF_STROKE}`, position: "relative" }}>
              {g.cache === true ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={MOTIF_STROKE} strokeWidth={2} style={{ position: "absolute", top: 7, left: 11 }} aria-hidden>
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
              ) : null}
            </span>
          </div>
        </MotifBox>
      );
    case "deux_portraits":
      return (
        <MotifBox>
          <div style={{ display: "flex", gap: 10 }}>
            {[0, 1].map((i) => (
              <span key={i} style={{ width: 42, height: 48, borderRadius: 6, background: MOTIF_FILL, border: `1.2px solid ${MOTIF_STROKE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
                <span style={{ width: 14, height: 14, borderRadius: "50%", border: `1.4px solid ${MOTIF_STROKE}` }} />
                <span style={{ width: 22, height: 10, borderRadius: "10px 10px 0 0", border: `1.4px solid ${MOTIF_STROKE}`, borderBottom: "none" }} />
              </span>
            ))}
          </div>
        </MotifBox>
      );
    case "boite_capsule":
      return (
        <MotifBox>
          <svg width="56" height="48" viewBox="0 0 56 48" fill={MOTIF_FILL} stroke={MOTIF_STROKE} strokeWidth={1.4} strokeLinejoin="round" aria-hidden>
            <rect x="10" y="16" width="36" height="26" rx="2" />
            <rect x="7" y="10" width="42" height="8" rx="2" />
            <circle cx="28" cy="29" r="3" fill="none" />
          </svg>
        </MotifBox>
      );
    case "moment_partage":
    default:
      return null;
  }
}

// ---- B5 — Challenge couple -------------------------------------------------
function B5({ c, prenom }: { c: Rec; prenom: string }) {
  const challenge = c.challenge_du_mois as Rec | undefined;
  const gabarit = c.gabarit && typeof c.gabarit === "object" ? (c.gabarit as Rec) : null;
  return (
    <>
      <Chips>
        {str(c.duree) ? <Chip icon={<Horloge color={WARM_LABEL} />}>{str(c.duree)}</Chip> : null}
        <Chip icon={<SoinPicto numero={5} size={13} color={WARM_LABEL} strokeWidth={1.7} />}>à deux</Chip>
      </Chips>
      {str(c.intro) ? <TraitChapo texte={str(c.intro)} /> : null}
      {challenge ? (
        <Cadre bg="#FBF4EE" label="Le challenge">
          {str(challenge.nom) ? (
            <p style={{ fontFamily: PLAYFAIR, fontWeight: 600, fontSize: 17, lineHeight: 1.25, color: INK, textAlign: "center", margin: 0 }}>
              {str(challenge.nom)}
            </p>
          ) : null}
          {str(challenge.deroule) ? (
            <div style={{ marginTop: 10 }}>
              <Prose texte={str(challenge.deroule)} />
            </div>
          ) : null}
          {gabarit ? <B5Gabarit g={gabarit} prenom={prenom} /> : null}
          {str(challenge.regle_clef) ? (
            <div style={{ background: "#F3DCD0", borderRadius: 10, padding: "10px 12px", marginTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <Etoile />
                <span style={{ ...labStyle, marginBottom: 0 }}>{"La règle d'or"}</span>
              </div>
              <p style={{ fontSize: 12.5, lineHeight: 1.5, color: WARM_BODY, margin: 0 }}>{str(challenge.regle_clef)}</p>
            </div>
          ) : null}
        </Cadre>
      ) : null}
      {str(c.pourquoi_ca_marche) ? (
        <Cadre bg="#F9F1EA" label="Pourquoi ça marche">
          <Prose texte={str(c.pourquoi_ca_marche)} />
        </Cadre>
      ) : null}
    </>
  );
}

// ---- Squelette commun ------------------------------------------------------
export function SoinDetail({ conseil, prenom = "" }: { conseil: ConseilSoin; prenom?: string }) {
  const c = conseil as Rec;
  const numero = typeof c.numero === "number" ? (c.numero as number) : 0;
  const promesse = str(c.promesse) || str(c.nom_outil) || str(c.titre);
  const eyebrow = str(c.nom_outil) || TITRE_COURT[numero] || "";
  const slot = COULEUR_SLOT[numero] ?? PEACH_DARK;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ textAlign: "center" }}>
        <span style={{ display: "inline-flex", margin: "0 auto 9px" }}>
          <SoinPicto numero={numero} size={32} color={slot} strokeWidth={1.8} />
        </span>
      </div>
      {eyebrow ? (
        <div style={{ textAlign: "center", fontSize: 9, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: EUCAL, marginBottom: 9 }}>
          {eyebrow}
        </div>
      ) : null}
      <h1
        style={{
          fontFamily: PLAYFAIR,
          fontWeight: 600,
          fontSize: 19,
          lineHeight: 1.32,
          color: INK,
          textAlign: "center",
          textWrap: "balance",
          margin: 0,
        }}
      >
        {formatTitre(promesse)}
      </h1>

      {numero === 1 ? <B1 c={c} /> : null}
      {numero === 2 ? <B2 c={c} /> : null}
      {numero === 3 ? <B3 c={c} /> : null}
      {numero === 4 ? <B4 c={c} /> : null}
      {numero === 5 ? <B5 c={c} prenom={prenom} /> : null}
    </div>
  );
}

"use client";

// ----------------------------------------------------------------------------
// Le rythme de bébé (06/11/2026, 2e version) : une roue par jour du calendrier.
// Le parent note des moments (réveil, endormissement) dans l'ordre qu'il veut ;
// la roue se colore au fur et à mesure (lib/rythme.ts). Enregistrement
// automatique. La journée suivante reprend le coucher du soir.
// Couleurs (Laura, 06/11) : fond = vert du slot Repères clés ; cercle de base
// blanc à 75 % ; sieste = bleu du slot Fin de journée ; nuit = bleu du slot
// Réveils nocturnes ; éveil = pêche ; dégradé d'éveil = beige de la case
// « Fenêtre d'éveil » ; dégradé de sommeil = bleu du rond de Journée et siestes.
// ----------------------------------------------------------------------------

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type React from "react";
import { teinteAuDessus } from "@/lib/couleurs";
import { COULEURS_ROUE } from "@/components/modules/sommeil-roue";
import { enregistrerJournee } from "@/lib/rythme-actions";
import {
  UNE_JOURNEE,
  dessiner,
  duree,
  enMinutes,
  estNuit,
  heureLisible,
  horloge,
  ML_MAX,
  repriseDeLaVeille,
  separer,
  trier,
  trierReperes,
  verifier,
  type Dessin,
  type FenetreEveil,
  type JourneeEnregistree,
  type Moment,
  type Repere,
} from "@/lib/rythme";
import { PICTOS_RYTHME } from "@/lib/rythme-pictos";

const TEXT = "#3A3228";
const DOUX = "#4E5E6A"; // gris bleuté (07/11, avec le fond bleu ciel)
const PLAYFAIR = "var(--font-playfair), Georgia, serif";
const FOND = "#D3E5F2"; // bleu ciel de la gamme Réflexologie (Laura, 07/11 : remplace le vert)
const FOND_JOURNEES = "#C6DAE8"; // 12/11 : un cran plus soutenu (« Bleu ciel » de la réflexologie, fond de carte)
const VERT_TEXTE = "#2F6081"; // bleu profond de la même famille (nom gardé)
const CARTE = "rgba(255,255,255,.55)";

export const COULEURS_RYTHME = {
  base: "rgba(255,255,255,.75)",
  nuit: "#89BDC8", // slot Réveils nocturnes : la nuit précédente, après minuit
  nuitSoir: "#74A8BA", // 12/11 (Laura) : la nuit qui commence le soir, avant minuit, un cran plus soutenue (choix de Claude ; 1er essai #5F93AB trop loin)
  sieste: "#B6D6DD", // slot Fin de journée
  eveil: "#F8DBC9", // 12/11 (Laura) : adouci, couleur du slot 3 de Guide-moi (avant : pêche #F0B8A8)
  // 12/11 (Laura) : prises de lait = rosé du slot 2 de Guide-moi ; selles = vert du slot 5 ;
  // picto plus foncé de la même teinte, repris en contour des petits ronds de la roue.
  lait: "#F5D0C8", // 12/11 (Laura) : rosé du slot 2 de Guide-moi (avant : violet réflexo #D3D5EA, vert Repères clés #DCDDBB)
  laitPicto: "#9A5444", // rosé foncé (choix de Claude)
  selle: "#BECEA9", // 12/11 (Laura) : vert du slot 5 de Guide-moi (avant : brun réflexo #DFBEB0)
  sellePicto: "#4F6236", // vert foncé (choix de Claude)
  haloEveil: COULEURS_ROUE.eveil, // beige de la case « Fenêtre d'éveil »
  haloSommeil: teinteAuDessus("#CEE4E8"), // rond du picto de Journée et siestes
  coucher: COULEURS_ROUE.coucher,
};
const C = COULEURS_RYTHME;

// ---------------------------------------------------------------------------
// La roue : vraie horloge, minuit en haut, midi en bas.
// ---------------------------------------------------------------------------

function point(cx: number, cy: number, r: number, f: number): [number, number] {
  const a = f * 2 * Math.PI;
  // Arrondi : le serveur et le téléphone ne tombent pas toujours sur la même 15e décimale.
  return [Math.round((cx + r * Math.sin(a)) * 100) / 100, Math.round((cy - r * Math.cos(a)) * 100) / 100];
}

function cheminArc(cx: number, cy: number, ro: number, ri: number, f0: number, f1: number) {
  const span = f1 - f0;
  if (span >= 0.9999) {
    return `M${cx},${cy - ro} A${ro},${ro} 0 1 1 ${cx - 0.01},${cy - ro} L${cx - 0.01},${cy - ri} A${ri},${ri} 0 1 0 ${cx},${cy - ri} Z`;
  }
  const big = span > 0.5 ? 1 : 0;
  const a = point(cx, cy, ro, f0);
  const b = point(cx, cy, ro, f1);
  const c = point(cx, cy, ri, f1);
  const d = point(cx, cy, ri, f0);
  return `M${a} A${ro},${ro} 0 ${big} 1 ${b} L${c} A${ri},${ri} 0 ${big} 0 ${d} Z`;
}

/** Picto biberon ou selle (tracés de la réflexologie), à poser dans un <svg> ou seul. */
function PictoRythme({ quoi, taille, couleur, x, y }: { quoi: "lait" | "selle"; taille: number; couleur: string; x?: number; y?: number }) {
  const p = PICTOS_RYTHME[quoi];
  return (
    <svg x={x} y={y} width={taille} height={taille} viewBox={p.viewBox} fill={couleur} aria-hidden style={{ display: "block", flexShrink: 0 }}>
      {p.traces.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

export function RoueRythme({
  dessin,
  mini,
  maintenant,
  reperes,
}: {
  dessin: Dessin;
  mini?: boolean;
  maintenant?: number | null;
  reperes?: Repere[];
}) {
  const cx = 150;
  const cy = 150;
  const ro = 108;
  const ri = 72; // 12/11 (Laura) : anneau affiné, 36 d'épaisseur au lieu de 44
  const F = UNE_JOURNEE;
  const formes: React.ReactNode[] = [];
  let k = 0;
  const plage = (a: number, b: number, fill: string, op = 1) => {
    if (b <= a) return;
    formes.push(<path key={k++} d={cheminArc(cx, cy, ro, ri, a / F, b / F)} fill={fill} fillOpacity={op} />);
  };
  // Un dégradé le long du cercle : des tranches de plus en plus transparentes.
  const fondu = (a: number, b: number, fill: string) => {
    const N = 16;
    const pas = (b - a) / N;
    for (let s = 0; s < N; s++) {
      const x = a + s * pas;
      plage(x, Math.min(x + pas + 0.6, b), fill, 1 - (s + 0.5) / N);
    }
  };

  for (const z of dessin.zones) {
    if (z.k === "halo-eveil") {
      plage(z.a, z.plein, C.haloEveil);
      fondu(z.plein, z.b, C.haloEveil);
    } else if (z.k === "halo-sommeil") {
      fondu(z.a, z.b, C.haloSommeil);
    }
  }
  for (const z of dessin.zones) {
    // 12/11 (Laura) : deux nuits, deux couleurs. Une nuit qui commence après midi est celle du soir.
    if (z.k === "nuit") plage(z.a, z.b, z.a >= 12 * 60 ? C.nuitSoir : C.nuit);
    else if (z.k === "sieste" || z.k === "eveil") plage(z.a, z.b, C[z.k]);
  }

  const traits: React.ReactNode[] = [];
  if (!mini) {
    for (let h = 0; h < 24; h++) {
      const p0 = point(cx, cy, ro + 3, h / 24);
      const p1 = point(cx, cy, ro + (h % 6 === 0 ? 9 : 6), h / 24);
      traits.push(<line key={h} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={VERT_TEXTE} strokeOpacity={0.45} strokeWidth={1} />);
    }
  }
  const etiquettes: [string, number][] = [
    ["0h", 0],
    ["3h", 0.125], // 12/11 (Laura) : 3h, 9h, 15h, 21h ajoutées
    ["6h", 0.25],
    ["9h", 0.375],
    ["12h", 0.5],
    ["15h", 0.625],
    ["18h", 0.75],
    ["21h", 0.875],
  ];

  return (
    <svg
      viewBox={mini ? "36 36 228 228" : "0 0 300 300"}
      role="img"
      aria-label={`Roue de la journée : ${duree(dessin.sommeil)} de sommeil.`}
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      <circle cx={cx} cy={cy} r={(ro + ri) / 2} fill="none" stroke={C.base} strokeWidth={ro - ri} />
      {formes}
      {traits}
      {/* 12/11 (Laura) : plus de barre rouge au coucher du soir (dessin.couchers reste calculé, non affiché). */}
      {/* 12/11 (Laura) : un petit rond par selle, posé à moitié sur la bordure extérieure, et par prise
          de lait, aux deux tiers à l'extérieur. Les ronds peuvent se chevaucher. Selles dessinées d'abord. */}
      {mini
        ? null
        : [...(reperes ?? [])]
            .sort((a, b) => (a.t === b.t ? 0 : a.t === "selle" ? -1 : 1))
            .map((r, i) => {
              const rayon = 10;
              const lait = r.t === "lait";
              const [x, y] = point(cx, cy, lait ? ro + rayon / 3 : ro, enMinutes(r.h) / F);
              const taille = rayon * 1.45;
              return (
                <g key={`r${i}`}>
                  <circle cx={x} cy={y} r={rayon} fill={lait ? C.lait : C.selle} stroke={lait ? C.laitPicto : C.sellePicto} strokeWidth={1.2} />
                  <PictoRythme quoi={r.t} taille={taille} couleur={lait ? C.laitPicto : C.sellePicto} x={x - taille / 2} y={y - taille / 2} />
                </g>
              );
            })}
      {maintenant !== null && maintenant !== undefined && !mini ? (
        <circle cx={point(cx, cy, ro + 14, maintenant / F)[0]} cy={point(cx, cy, ro + 14, maintenant / F)[1]} r={3.2} fill={VERT_TEXTE} />
      ) : null}
      {mini
        ? null
        : etiquettes.map(([t, f]) => {
            const p = point(cx, cy, ro + 24, f);
            return (
              <text key={t} x={p[0]} y={p[1] + 4.5} textAnchor="middle" style={{ fontSize: 13, fontWeight: 600, fill: VERT_TEXTE }}>
                {t}
              </text>
            );
          })}
      <text x={cx} y={cy + (mini ? 10 : 2)} textAnchor="middle" style={{ fontSize: mini ? 30 : 24, fontWeight: 700, fill: TEXT }}>
        {duree(dessin.sommeil)}
      </text>
      {mini ? null : (
        <>
          <text x={cx} y={cy + 20} textAnchor="middle" style={{ fontSize: 11, fill: DOUX }}>
            de sommeil
          </text>
          <text x={cx} y={cy + 33} textAnchor="middle" style={{ fontSize: 11, fill: DOUX }}>
            {dessin.ouverte ? "jusqu’ici" : "sur 24h"}
          </text>
        </>
      )}
    </svg>
  );
}

// 07/11 (Laura) : la légende ne garde que les trois couleurs pleines (plus de ligne
// pour les dégradés « éveil moyen » et « sommeil en cours »).
function Legende() {
  const p = (fond: string): React.CSSProperties => ({
    width: 11,
    height: 11,
    borderRadius: 3,
    background: fond,
    flexShrink: 0,
  });
  const item = (style: React.CSSProperties, txt: string) => (
    <span key={txt} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span aria-hidden style={style} />
      {txt}
    </span>
  );
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 14px", fontSize: 11, color: TEXT }}>
      {/* 12/11 (Laura) : les deux bleus de nuit côte à côte, un seul mot « Nuit ». */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        <span aria-hidden style={{ display: "inline-flex", gap: 2 }}>
          <span style={p(C.nuit)} />
          <span style={p(C.nuitSoir)} />
        </span>
        Nuit
      </span>
      {item(p(C.eveil), "Éveil")}
      {item(p(C.sieste), "Sieste")}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

const deux = (n: number) => (n < 10 ? "0" : "") + n;
const versJour = (d: Date) => `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`;
const aujourdhui = () => versJour(new Date());
const decaler = (jour: string, n: number) => {
  const d = new Date(`${jour}T12:00:00`);
  d.setDate(d.getDate() + n);
  return versJour(d);
};
const dateLongue = (jour: string) => {
  const t = new Date(`${jour}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const dateCourte = (jour: string) =>
  new Date(`${jour}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
const maintenantMinutes = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

// ---------------------------------------------------------------------------
// L'écran
// ---------------------------------------------------------------------------

// Teintes légères de la case de l'heure (07/11) : pêche pour un réveil, bleu pour un endormissement.
// 12/11 : réveil un cran plus clair avec le nouvel éveil ; lait et selles dans leurs teintes.
type Saisie = "reveil" | "endormi" | "lait" | "selle";
const TEINTE: Record<Saisie, string> = { reveil: "#FCEDE4", endormi: "#D3E7EC", lait: "#FAE7E2", selle: "#E4EAD9" };
const PLEIN: Record<Saisie, string> = { reveil: C.eveil, endormi: C.nuit, lait: C.lait, selle: C.selle };

// ---------------------------------------------------------------------------
// Sélecteur d'heure à faire défiler, comme les réveils de téléphone (07/11) :
// heures de 0 à 23, minutes de 5 en 5. Directement dans la case, sans fenêtre.
// ---------------------------------------------------------------------------

const LIGNE = 30; // hauteur d'un chiffre
const HEURES = Array.from({ length: 24 }, (_, i) => deux(i));
const MINUTES = Array.from({ length: 12 }, (_, i) => deux(i * 5));

// 07/11 (Laura) : les chiffres tournent en boucle (23 → 00, 55 → 00). La liste est
// répétée plusieurs fois ; quand le défilement s'arrête, on revient sans bruit sur
// la copie du milieu, pour ne jamais buter sur un bout.
const COPIES = 9;

function Colonne({ valeurs, index, onChange, label }: { valeurs: string[]; index: number; onChange: (i: number) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const n = valeurs.length;
  const milieu = Math.floor(COPIES / 2) * n;
  const [pos, setPos] = useState(milieu + index); // ligne au centre, toutes copies comprises
  const pause = useRef<number | undefined>(undefined);
  // Position de départ, une seule fois : ensuite c'est le doigt qui décide.
  useLayoutEffect(() => {
    if (ref.current) ref.current.scrollTop = (milieu + index) * LIGNE;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => () => window.clearTimeout(pause.current), []);
  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={label}
      className="rythme-roulette"
      onScroll={(ev) => {
        const el = ev.currentTarget;
        const p = Math.max(0, Math.min(n * COPIES - 1, Math.round(el.scrollTop / LIGNE)));
        if (p !== pos) {
          setPos(p);
          if (p % n !== pos % n) onChange(p % n);
        }
        window.clearTimeout(pause.current);
        pause.current = window.setTimeout(() => {
          const q = Math.round(el.scrollTop / LIGNE);
          const recentre = milieu + (((q % n) + n) % n);
          if (q !== recentre) {
            el.scrollTop = recentre * LIGNE;
            setPos(recentre);
          }
        }, 180);
      }}
      style={{
        height: LIGNE * 3,
        width: 38,
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        scrollbarWidth: "none",
        WebkitMaskImage: "linear-gradient(transparent, #000 32%, #000 68%, transparent)",
        maskImage: "linear-gradient(transparent, #000 32%, #000 68%, transparent)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ height: LIGNE }} />
      {Array.from({ length: n * COPIES }, (_, p) => {
        const v = valeurs[p % n];
        const ici = p === pos;
        return (
          <div
            key={p}
            role="option"
            aria-selected={ici}
            aria-hidden={Math.abs(p - pos) > 1}
            onClick={() => ref.current?.scrollTo({ top: p * LIGNE, behavior: "smooth" })}
            style={{
              height: LIGNE,
              lineHeight: `${LIGNE}px`,
              textAlign: "center",
              scrollSnapAlign: "center",
              fontSize: ici ? 19 : 16,
              fontWeight: ici ? 700 : 500,
              color: TEXT,
              fontVariantNumeric: "tabular-nums",
              cursor: "pointer",
            }}
          >
            {v}
          </div>
        );
      })}
      <div style={{ height: LIGNE }} />
    </div>
  );
}

function SelecteurHeure({ valeur, onChange, type }: { valeur: string; onChange: (h: string) => void; type: Saisie }) {
  const [h, m] = valeur.split(":").map(Number);
  const iH = h;
  const iM = Math.min(11, Math.round(m / 5));
  const cur = useRef({ h: iH, m: iM });
  const envoyer = () => onChange(`${HEURES[cur.current.h]}:${MINUTES[cur.current.m]}`);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: "0 8px",
        borderRadius: 14,
        background: TEINTE[type],
        flexShrink: 0,
      }}
    >
      {/* La bande du milieu : la valeur choisie. */}
      <div aria-hidden style={{ position: "absolute", left: 6, right: 6, top: LIGNE, height: LIGNE, borderRadius: 8, background: "rgba(255,255,255,.7)" }} />
      <Colonne valeurs={HEURES} index={iH} label="Heure" onChange={(i) => ((cur.current.h = i), envoyer())} />
      <span style={{ position: "relative", zIndex: 1, fontSize: 18, fontWeight: 700, color: TEXT }}>:</span>
      <Colonne valeurs={MINUTES} index={iM} label="Minutes" onChange={(i) => ((cur.current.m = i), envoyer())} />
    </div>
  );
}

/** L'heure d'un moment noté : une case étroite, teintée selon le moment ; la toucher rouvre le sélecteur. */
const caseHeure = (type: Saisie): React.CSSProperties => ({
  font: "inherit",
  fontSize: 15,
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
  color: TEXT,
  background: TEINTE[type],
  border: "none",
  borderRadius: 10,
  padding: "4px 10px",
  cursor: "pointer",
  flexShrink: 0,
});

const boutonPlein = (type: Saisie): React.CSSProperties => ({
  padding: "9px 16px",
  borderRadius: 999,
  border: "none",
  background: PLEIN[type],
  color: TEXT,
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  flexShrink: 0,
});

/** Bouton en simple texte souligné (12/11 : « En voir plus » / « Voir moins »). */
const lienTexte: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: "4px 2px",
  font: "inherit",
  fontSize: 14,
  fontWeight: 600,
  color: VERT_TEXTE,
  textDecoration: "underline",
  textUnderlineOffset: 3,
  cursor: "pointer",
};

const croix: React.CSSProperties = {
  width: 30,
  height: 30,
  flexShrink: 0,
  borderRadius: 999,
  border: "none",
  background: "transparent",
  color: DOUX,
  fontSize: 19,
  lineHeight: 1,
  cursor: "pointer",
};

const IconeSoleil = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
    <circle cx={12} cy={12} r={4} />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
  </svg>
);
const IconeLune = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Calendrier (12/11, Laura) : remplace celui du téléphone, qui ne sait pas marquer de jours.
// Un mois à la fois, lundi en premier ; un point sous chaque jour noté ; flèches pour
// remonter les mois (sans aller au-delà du mois en cours). Jours futurs grisés.
// ---------------------------------------------------------------------------

const JOURS_SEMAINE = ["L", "M", "M", "J", "V", "S", "D"];

function Calendrier({ jour, marques, onChoisir }: { jour: string; marques: Set<string>; onChoisir: (j: string) => void }) {
  const auj = aujourdhui();
  const [mois, setMois] = useState(jour.slice(0, 7)); // « 2026-11 »
  const [a, m] = mois.split("-").map(Number);
  const premier = new Date(a, m - 1, 1);
  const nbJours = new Date(a, m, 0).getDate();
  const decalage = (premier.getDay() + 6) % 7; // lundi = 0
  const changerMois = (n: number) => {
    const d = new Date(a, m - 1 + n, 1);
    setMois(`${d.getFullYear()}-${deux(d.getMonth() + 1)}`);
  };
  const titre = premier.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const dernierMois = mois >= auj.slice(0, 7);
  const notesDuMois = Array.from(marques).filter((j) => j.startsWith(mois)).length;
  const fleche: React.CSSProperties = { width: 34, height: 34, borderRadius: 999, border: "none", background: "rgba(255,255,255,.7)", color: VERT_TEXTE, fontSize: 18, cursor: "pointer" };
  return (
    <div style={{ background: CARTE, borderRadius: 18, padding: "10px 12px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <button type="button" aria-label="Mois précédent" style={fleche} onClick={() => changerMois(-1)}>
          ‹
        </button>
        <span style={{ flex: 1, textAlign: "center", fontFamily: PLAYFAIR, fontSize: 16, fontWeight: 600, color: TEXT }}>
          {titre.charAt(0).toUpperCase() + titre.slice(1)}
          <span style={{ display: "block", fontFamily: "inherit", fontSize: 10, fontWeight: 400, color: DOUX }}>
            {notesDuMois ? `${notesDuMois} jour${notesDuMois > 1 ? "s" : ""} noté${notesDuMois > 1 ? "s" : ""}` : "aucun jour noté"}
          </span>
        </span>
        <button type="button" aria-label="Mois suivant" style={{ ...fleche, opacity: dernierMois ? 0.35 : 1 }} disabled={dernierMois} onClick={() => changerMois(1)}>
          ›
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" }}>
        {JOURS_SEMAINE.map((l, i) => (
          <span key={i} aria-hidden style={{ fontSize: 10, fontWeight: 700, color: DOUX, padding: "2px 0" }}>
            {l}
          </span>
        ))}
        {Array.from({ length: decalage }, (_, i) => (
          <span key={`v${i}`} />
        ))}
        {Array.from({ length: nbJours }, (_, i) => {
          const j = `${mois}-${deux(i + 1)}`;
          const futur = j > auj;
          const choisi = j === jour;
          const note = marques.has(j);
          return (
            <button
              key={j}
              type="button"
              disabled={futur}
              onClick={() => onChoisir(j)}
              aria-label={`${dateLongue(j)}${note ? ", journée notée" : ""}`}
              aria-pressed={choisi}
              style={{
                height: 36,
                borderRadius: 10,
                border: j === auj && !choisi ? `1.5px solid ${VERT_TEXTE}` : "1.5px solid transparent",
                background: choisi ? VERT_TEXTE : "transparent",
                color: choisi ? "#fff" : TEXT,
                opacity: futur ? 0.3 : 1,
                fontSize: 14,
                fontWeight: note ? 700 : 500,
                cursor: futur ? "default" : "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                padding: 0,
              }}
            >
              {i + 1}
              {/* Jour noté : un petit point (blanc sur le jour choisi). */}
              <span aria-hidden style={{ width: 5, height: 5, borderRadius: 999, background: note ? (choisi ? "#fff" : VERT_TEXTE) : "transparent" }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function RythmeOutil({
  prenom,
  mois,
  fenetre,
  journees,
  disponible,
  genre,
}: {
  genre?: "garcon" | "fille" | null;
  prenom: string;
  mois: number;
  fenetre: FenetreEveil | null;
  journees: JourneeEnregistree[];
  disponible: boolean;
}) {
  const [jours, setJours] = useState<Record<string, Moment[]>>(() =>
    Object.fromEntries(journees.map((j) => [j.jour, separer(j.evenements).moments]).filter(([, ms]) => ms.length)),
  );
  // 12/11 : prises de lait et selles de chaque jour, rangées à part des moments d'éveil-sommeil.
  const [reperesJours, setReperesJours] = useState<Record<string, Repere[]>>(() =>
    Object.fromEntries(journees.map((j) => [j.jour, separer(j.evenements).reperes]).filter(([, rs]) => rs.length)),
  );
  // 12/11 (Laura) : les trois cadres fermés à l’ouverture, pour voir toute la page sur un écran.
  const [ouverts, setOuverts] = useState({ sommeil: false, lait: false, selles: false });
  // 12/11 : calendrier ouvert sous la date ; nombre de journées précédentes montrées.
  const [calOuvert, setCalOuvert] = useState(false);
  const [nbVisibles, setNbVisibles] = useState(3);
  const [jour, setJour] = useState(aujourdhui);
  const [ajout, setAjout] = useState<null | Saisie>(null);
  const [ml, setMl] = useState(""); // quantité de lait saisie, en mL (facultative)
  const [heureAjout, setHeureAjout] = useState("07:00");
  // Moment de la liste dont on change l'heure (index dans l'ordre de la journée).
  const [edition, setEdition] = useState<number | null>(null);
  // 12/11 : lait ou selle du détail dont on change l'heure (et la quantité pour le lait).
  const [editionR, setEditionR] = useState<Repere | null>(null);
  const [heureR, setHeureR] = useState("07:00");
  const [mlR, setMlR] = useState("");
  const [heureEdition, setHeureEdition] = useState("07:00");
  const [message, setMessage] = useState<string | null>(null);
  const [etat, setEtat] = useState<"" | "enregistrement" | "enregistre" | "erreur">("");
  const file = useRef<Promise<unknown>>(Promise.resolve());
  // La date et l'heure sont celles du téléphone : on dessine une fois la page ouverte.
  const [monte, setMonte] = useState(false);
  useEffect(() => {
    setMonte(true);
    setJour(aujourdhui());
  }, []);
  // 12/11 : redessine chaque minute, pour que « éveil depuis… » et l'aiguille de la roue avancent seuls.
  const [, setTic] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTic((n) => n + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);
  const e =genre === "fille" ? "e" : "";

  const momentsDe = (j: string, tous = jours) => tous[j] ?? repriseDeLaVeille(tous[decaler(j, -1)]);
  // 12/11 (Laura) : la nuit ne se colore jusqu'à minuit que si le RÉVEIL du lendemain est noté.
  // Tant qu'il ne l'est pas, bébé peut encore se réveiller : seul reste le dégradé.
  const suiteDort = (j: string, tous = jours) => {
    const suite = tous[decaler(j, 1)];
    return Boolean(suite?.[0]?.veille && suite.some((m) => m.t === "reveil"));
  };
  const moments = momentsDe(jour);
  const estAujourdhui = jour === aujourdhui();
  const dessin = dessiner(moments, fenetre, suiteDort(jour));

  const reperes = reperesJours[jour] ?? [];

  /** Enregistre une journée : ses moments + ses prises de lait et selles (`rs`, celles du jour par défaut). */
  const sauver = (j: string, ms: Moment[], rs: Repere[] = reperesJours[j] ?? []) => {
    if (!disponible) return;
    setEtat("enregistrement");
    file.current = file.current.then(async () => {
      const r = await enregistrerJournee({ jour: j, mois_bebe: mois, evenements: [...ms, ...rs] });
      setEtat(r.ok ? "enregistre" : "erreur");
      if (!r.ok) setMessage(r.message);
    });
  };

  /** Change les moments d'un jour, garde la journée suivante en accord (son « endormi hier »), et enregistre. */
  const changerJour = (j: string, ms: Moment[]) => {
    const tries = trier(ms);
    const tous = { ...jours };
    if (tries.length) tous[j] = tries;
    else delete tous[j];
    const lendemain = decaler(j, 1);
    const suite = tous[lendemain];
    let suiteChangee: Moment[] | null = null;
    if (suite) {
      const sansVeille = suite.filter((m) => !m.veille);
      const nouvelle = trier([...repriseDeLaVeille(tries), ...sansVeille]);
      if (JSON.stringify(nouvelle) !== JSON.stringify(suite) && verifier(nouvelle) === null) {
        tous[lendemain] = nouvelle;
        suiteChangee = nouvelle;
      }
    }
    setJours(tous);
    setEdition(null);
    sauver(j, tries);
    if (suiteChangee) sauver(lendemain, suiteChangee);
  };

  const essayer = (ms: Moment[], siOk?: string) => {
    const err = verifier(ms);
    if (err) {
      setMessage(err);
      return false;
    }
    changerJour(jour, ms);
    setMessage(siOk ?? null);
    return true;
  };

  /** Change les prises de lait et selles du jour affiché, et enregistre. */
  const changerReperes = (rs: Repere[]) => {
    const tries = trierReperes(rs);
    const tous = { ...reperesJours };
    if (tries.length) tous[jour] = tries;
    else delete tous[jour];
    setReperesJours(tous);
    // La journée garde ses moments, dont l'« endormi hier soir » repris de la veille.
    if (!jours[jour] && moments.length) setJours({ ...jours, [jour]: moments });
    sauver(jour, moments, tries);
  };

  const ouvrirAjout = (t: Saisie) => {
    setMessage(null);
    // Toucher le bouton déjà choisi referme la saisie ; changer de bouton garde l'heure choisie.
    if (ajout === t) return setAjout(null);
    if (t === "lait") setMl("");
    if (ajout) return setAjout(t);
    setAjout(t);
    const dernier = moments.length ? trier(moments)[moments.length - 1] : null;
    let h: number;
    if (estAujourdhui) h = Math.round(maintenantMinutes() / 5) * 5;
    else if (t === "lait" || t === "selle") h = 12 * 60;
    else if (dernier && !dernier.veille) h = enMinutes(dernier.h) + (dernier.t === "reveil" ? Math.round(((fenetre?.min ?? 90) + (fenetre?.max ?? 90)) / 2) : 60);
    else h = t === "reveil" ? 7 * 60 : 13 * 60;
    setHeureAjout(horloge(Math.min(h, UNE_JOURNEE - 5)));
  };

  // 12/11 (Laura) : un moment s'ajoute toujours seul, n'importe où, même deux réveils ou deux
  // endormissements à la suite ; le parent complétera l'autre état après coup.
  const valider = () => {
    if (!ajout) return;
    if (ajout === "lait" || ajout === "selle") {
      if (ajout === "selle") changerReperes([...reperes, { t: "selle", h: heureAjout }]);
      else {
        const q = Number(ml.trim());
        const quantite = ml.trim() && Number.isInteger(q) && q > 0 && q <= ML_MAX ? q : undefined;
        if (ml.trim() && quantite === undefined) return setMessage(`La quantité doit être un nombre entier de mL (jusqu’à ${ML_MAX}).`);
        changerReperes([...reperes, quantite ? { t: "lait", h: heureAjout, ml: quantite } : { t: "lait", h: heureAjout }]);
      }
      setMessage(null);
      setAjout(null);
      return;
    }
    if (essayer([...moments, { t: ajout, h: heureAjout }])) setAjout(null);
  };

  // Retirer un moment le retire seul (deux états identiques à la suite sont permis depuis le 12/11).
  const retirer = (i: number) => essayer(trier(moments).filter((_, k) => k !== i));

  const allerA = (j: string) => {
    if (!j || j > aujourdhui()) return;
    setJour(j);
    setAjout(null);
    setEdition(null);
    setEditionR(null);
    setMessage(null);
  };

  /**
   * Champ « … mL » (facultatif) du lait, entre la roulette et « Ajouter » (Laura, 12/11 : sans texte
   * « Quantité bue », bien visible : fond blanc, contour rosé foncé).
   */
  const champMl = (valeur: string, changer: (v: string) => void) => (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 14, color: C.laitPicto, fontWeight: 700, flexShrink: 0 }}>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="…"
        value={valeur}
        onChange={(ev) => changer(ev.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
        aria-label="Quantité bue, en mL (facultatif)"
        style={{
          width: 54,
          padding: "7px 8px",
          borderRadius: 10,
          border: `1.5px solid ${C.laitPicto}`,
          background: "#fff",
          font: "inherit",
          fontSize: 16,
          fontWeight: 700,
          textAlign: "center",
          color: TEXT,
        }}
      />
      mL
    </label>
  );

  // Lignes de la liste (07/11) : le premier moment en bas, le plus récent en haut.
  // La durée de chaque phase s'écrit au-dessus du moment qui l'ouvre.
  const tries = trier(moments);
  const lignes = tries.map((m, i) => {
    const suivant = tries[i + 1];
    const a = m.veille ? 0 : enMinutes(m.h);
    const nuit = m.t === "endormi" && (m.veille || estNuit(m.h));
    const couleur = m.t === "reveil" ? C.eveil : !nuit ? C.sieste : !m.veille && a >= 12 * 60 ? C.nuitSoir : C.nuit;
    const libelle = m.veille ? `Endormi${e} hier soir` : m.t === "reveil" ? `Réveillé${e}` : `Endormi${e}`;
    const enEdition = edition === i && !m.veille;
    let apres: string | null = null;
    if (suivant) {
      // La nuit reprise de la veille se compte depuis le coucher d'hier soir.
      const depuis = m.veille ? enMinutes(m.h) - UNE_JOURNEE : a;
      const d = duree(enMinutes(suivant.h) - depuis);
      apres = m.t === "reveil" ? `éveil ${d}` : `${nuit ? "nuit" : "sieste"} ${d}`;
    } else if (m.t === "reveil") {
      // 12/11 (Laura) : aujourd'hui, le temps d'éveil écoulé depuis ce réveil, à la place de « éveil en cours ».
      const ecoule = estAujourdhui ? maintenantMinutes() - a : -1;
      apres = ecoule >= 0 ? `éveil depuis ${duree(ecoule)}` : "éveil en cours";
    }
    else if (suiteDort(jour)) apres = `nuit jusqu’à minuit, ${duree(UNE_JOURNEE - a)}`;
    else {
      // 12/11 (Laura) : pareil pour le sommeil, « sommeil depuis 40 min », même phrase pour la nuit et les siestes.
      // La nuit reprise de la veille se compte depuis le coucher d'hier soir.
      const debut = m.veille ? enMinutes(m.h) - UNE_JOURNEE : a;
      const ecoule = estAujourdhui ? maintenantMinutes() - debut : -1;
      apres = ecoule >= 0 ? `sommeil depuis ${duree(ecoule)}` : "sommeil en cours";
    }
    return (
      <li key={`${m.veille ? "v" : ""}${m.t}${m.h}`} style={{ listStyle: "none" }}>
        {apres ? <div style={{ padding: "0 0 0 18px", fontSize: 12, lineHeight: 1.3, color: DOUX }}>{apres}</div> : null}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 0" }}>
          <span aria-hidden style={{ width: 10, height: enEdition ? 60 : 24, borderRadius: 5, background: couleur, flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: TEXT }}>{libelle}</span>
          {enEdition ? (
            <>
              <SelecteurHeure valeur={heureEdition} onChange={setHeureEdition} type={m.t} />
              <button
                type="button"
                style={{ ...boutonPlein(m.t), padding: "8px 12px" }}
                onClick={() => {
                  if (heureEdition === m.h) return setEdition(null);
                  if (essayer(tries.map((x, k) => (k === i ? { ...x, h: heureEdition } : x)))) setEdition(null);
                }}
              >
                OK
              </button>
            </>
          ) : m.veille ? (
            <span style={{ ...caseHeure(m.t), cursor: "default" }}>{m.h}</span>
          ) : (
            <button
              type="button"
              aria-label={`Modifier l’heure : ${libelle} à ${heureLisible(m.h)}`}
              style={caseHeure(m.t)}
              onClick={() => {
                setMessage(null);
                setHeureEdition(m.h);
                setEdition(i);
              }}
            >
              {m.h}
            </button>
          )}
          <button type="button" aria-label="Retirer ce moment" style={croix} onClick={() => retirer(i)}>
            ×
          </button>
        </div>
      </li>
    );
  });
  lignes.reverse();

  // 12/11 (Laura) : détail des prises de lait et des selles, le plus récent en haut. Sous chaque
  // ligne, l'écart avec la précédente (« 3h10 après la précédente », même phrase pour les deux).
  const lignesReperes = (quoi: "lait" | "selle") => {
    const liste = reperes.filter((r) => r.t === quoi);
    return liste
      .map((r, i) => {
        const prec = liste[i - 1];
        const ecart = prec ? enMinutes(r.h) - enMinutes(prec.h) : null;
        const enEdition = editionR === r;
        const libelle = r.t === "lait" ? (r.ml ? `${r.ml} mL` : "Lait") : "Selle";
        // 12/11 (Laura) : toucher l'heure (ou la quantité) d'un lait ouvre la roulette et la quantité ;
        // pour une selle, la roulette seule.
        const ouvrir = () => {
          setMessage(null);
          setHeureR(r.h);
          setMlR(r.t === "lait" && r.ml ? String(r.ml) : "");
          setEditionR(r);
        };
        const validerEdition = () => {
          let nouveau: Repere = { t: "selle", h: heureR };
          if (r.t === "lait") {
            const q = Number(mlR.trim());
            const quantite = mlR.trim() && Number.isInteger(q) && q > 0 && q <= ML_MAX ? q : undefined;
            if (mlR.trim() && quantite === undefined) return setMessage(`La quantité doit être un nombre entier de mL (jusqu’à ${ML_MAX}).`);
            nouveau = quantite ? { t: "lait", h: heureR, ml: quantite } : { t: "lait", h: heureR };
          }
          changerReperes(reperes.map((x) => (x === r ? nouveau : x)));
          setEditionR(null);
        };
        // 12/11 (Laura) : au-dessus du dernier lait d'aujourd'hui, « il y a 2h15 » (recalculé chaque minute).
        const ilYa = quoi === "lait" && estAujourdhui && i === liste.length - 1 ? maintenantMinutes() - enMinutes(r.h) : -1;
        return (
          <li key={`${quoi}${r.h}${i}`} style={{ listStyle: "none" }}>
            {ilYa >= 0 ? <div style={{ padding: "0 0 0 32px", fontSize: 12, lineHeight: 1.3, color: DOUX }}>il y a {duree(ilYa)}</div> : null}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 0" }}>
              <span aria-hidden style={{ width: 24, height: 24, borderRadius: 999, background: PLEIN[quoi], display: "grid", placeItems: "center", flexShrink: 0 }}>
                <PictoRythme quoi={quoi} taille={16} couleur={quoi === "lait" ? C.laitPicto : C.sellePicto} />
              </span>
              {enEdition ? (
                <>
                  <span style={{ flex: 1 }} />
                  <SelecteurHeure valeur={heureR} onChange={setHeureR} type={quoi} />
                  {r.t === "lait" ? champMl(mlR, setMlR) : null}
                  <button type="button" style={{ ...boutonPlein(quoi), padding: "8px 11px" }} onClick={validerEdition}>
                    OK
                  </button>
                </>
              ) : (
                <>
                  {r.t === "lait" ? (
                    <button
                      type="button"
                      onClick={ouvrir}
                      aria-label={r.ml ? `Modifier la quantité : ${r.ml} mL` : "Ajouter la quantité"}
                      style={{ flex: 1, textAlign: "left", background: "none", border: "none", padding: 0, font: "inherit", fontSize: 14, fontWeight: 600, color: TEXT, cursor: "pointer" }}
                    >
                      {libelle}
                    </button>
                  ) : (
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: TEXT }}>{libelle}</span>
                  )}
                  <button type="button" aria-label={`Modifier l’heure : ${libelle} à ${heureLisible(r.h)}`} style={caseHeure(quoi)} onClick={ouvrir}>
                    {r.h}
                  </button>
                </>
              )}
              {/* Pendant la modification d'un lait, la croix s'efface pour laisser la place à la quantité. */}
              {enEdition && r.t === "lait" ? null : (
                <button
                  type="button"
                  aria-label={quoi === "lait" ? "Retirer cette prise de lait" : "Retirer cette selle"}
                  style={croix}
                  onClick={() => changerReperes(reperes.filter((x) => x !== r))}
                >
                  ×
                </button>
              )}
            </div>
            {ecart !== null ? (
              <div style={{ padding: "0 0 0 32px", fontSize: 12, lineHeight: 1.3, color: DOUX }}>{duree(ecart)} après la précédente</div>
            ) : null}
          </li>
        );
      })
      .reverse();
  };
  const lignesLait = lignesReperes("lait");
  const lignesSelles = lignesReperes("selle");
  const totalMl = reperes.reduce((s, r) => s + (r.t === "lait" && r.ml ? r.ml : 0), 0);

  const sauvegardes = Array.from(new Set([...Object.keys(jours), ...Object.keys(reperesJours)]))
    .filter((j) => (jours[j]?.length ?? 0) + (reperesJours[j]?.length ?? 0) > 0)
    .sort((a, b) => (a < b ? 1 : -1));
  const precedentes = sauvegardes.filter((j) => j < aujourdhui());

  /** Un cadre déroulant du détail (12/11) : titre, petit résumé à droite, chevron. */
  const cadre = (cle: keyof typeof ouverts, titre: string, resume: string, contenu: React.ReactNode) => (
    <details
      className="rythme-cadre"
      open={ouverts[cle]}
      onToggle={(ev) => {
        const ouvert = (ev.currentTarget as HTMLDetailsElement).open;
        if (ouvert !== ouverts[cle]) setOuverts((o) => ({ ...o, [cle]: ouvert }));
      }}
      style={{ background: CARTE, borderRadius: 18, overflow: "hidden" }}
    >
      <summary style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
        <span style={{ flex: 1, fontFamily: PLAYFAIR, fontSize: 16, fontWeight: 600, color: TEXT }}>{titre}</span>
        <span style={{ fontSize: 12, color: DOUX }}>{resume}</span>
        <svg className="rythme-chevron" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={VERT_TEXTE} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0, transition: "transform .2s ease" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <ul style={{ margin: "0 auto", padding: "0 12px 12px", maxWidth: 294 }}>{contenu}</ul>
    </details>
  );

  /** Bouton rond Lait / Selles (12/11) : fond plein, picto plus foncé ; entouré quand la saisie est ouverte. */
  const boutonRond = (quoi: "lait" | "selle") => (
    <button
      type="button"
      aria-label={quoi === "lait" ? "Noter une prise de lait" : "Noter une selle"}
      aria-pressed={ajout === quoi}
      onClick={() => ouvrirAjout(quoi)}
      style={{
        width: 48,
        height: 48,
        borderRadius: 999,
        border: ajout === quoi ? `2px solid ${VERT_TEXTE}` : "2px solid transparent",
        background: PLEIN[quoi],
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <PictoRythme quoi={quoi} taille={28} couleur={quoi === "lait" ? C.laitPicto : C.sellePicto} />
      {/* 12/11 (Laura) : petit « + » en haut à droite, pour dire qu'on ajoute. */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: -4,
          right: -4,
          width: 18,
          height: 18,
          borderRadius: 999,
          background: "#fff",
          color: quoi === "lait" ? C.laitPicto : C.sellePicto,
          fontSize: 15,
          fontWeight: 700,
          lineHeight: "18px",
          textAlign: "center",
          boxShadow: "0 1px 2px rgba(0,0,0,.12)",
        }}
      >
        +
      </span>
    </button>
  );

  // 12/11 (Laura) : les deux boutons restent toujours actifs (avant, le 07/11 : seulement
  // l'autre moment que le dernier noté, ce qui empêchait d'ajouter un oubli).
  // Celui qui n'est pas le moment logique suivant perd sa couleur, mais reste cliquable.
  const dernierNote = tries.length ? tries[tries.length - 1].t : null;
  const logique = (t: "reveil" | "endormi") => dernierNote !== t;

  const boutonMoment = (t: "reveil" | "endormi"): React.CSSProperties => ({
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 10px",
    borderRadius: 16,
    border: ajout === t ? `2px solid ${VERT_TEXTE}` : "2px solid transparent",
    // 12/11 (Laura) : le bouton mis en retrait garde une teinte légère de sa couleur (pas le blanc des cadres).
    background: ajout !== t && !logique(t) ? TEINTE[t] : t === "reveil" ? C.eveil : C.nuit,
    color: TEXT,
    fontFamily: PLAYFAIR,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  });

  const fleche: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "none",
    background: CARTE,
    color: VERT_TEXTE,
    fontSize: 20,
    cursor: "pointer",
    flexShrink: 0,
  };

  const fond = (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2"
      style={{ width: "min(100vw, 390px)", background: FOND, zIndex: 0 }}
    />
  );
  if (!monte) return fond;

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2"
        style={{ width: "min(100vw, 390px)", background: FOND, zIndex: 0 }}
      />
      <style>{`.rythme-roulette::-webkit-scrollbar{display:none}`}</style>
      {/* 12/11 (Laura) : tout tenir sur un écran, du titre au cadre « Selles » fermé : espaces de 10, roue de 256. */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 10, paddingBottom: 12 }}>
        <header style={{ textAlign: "center", marginTop: 14 }}>
          <h1 style={{ fontFamily: PLAYFAIR, fontSize: 24, fontWeight: 600, color: TEXT, margin: "0 0 4px", lineHeight: 1.15 }}>
            Le rythme de {prenom}
          </h1>
          {/* 12/11 (Laura) : sous-titre « Ses périodes d’éveil et de sommeil » retiré, pour alléger. */}
        </header>

        {/* Choix du jour : flèches, ou toucher la date pour ouvrir le calendrier. */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button type="button" aria-label="Journée précédente" style={fleche} onClick={() => allerA(decaler(jour, -1))}>
            ‹
          </button>
          {/* 12/11 (Laura) : calendrier maison (plus celui du téléphone), qui marque les jours notés. */}
          <button
            type="button"
            aria-expanded={calOuvert}
            aria-label="Choisir la date dans le calendrier"
            onClick={() => setCalOuvert((o) => !o)}
            style={{ flex: 1, textAlign: "center", cursor: "pointer", background: "none", border: "none", padding: 0, font: "inherit" }}
          >
            <span style={{ display: "block", fontFamily: PLAYFAIR, fontSize: 17, fontWeight: 600, color: TEXT }}>{dateLongue(jour)}</span>
            <span style={{ display: "block", fontSize: 10, color: DOUX }}>{estAujourdhui ? "aujourd’hui" : "toucher pour changer de date"}</span>
          </button>
          <button
            type="button"
            aria-label="Journée suivante"
            style={{ ...fleche, opacity: estAujourdhui ? 0.35 : 1 }}
            disabled={estAujourdhui}
            onClick={() => allerA(decaler(jour, 1))}
          >
            ›
          </button>
        </div>
        {calOuvert ? (
          <Calendrier
            jour={jour}
            marques={new Set(sauvegardes)}
            onChoisir={(j) => {
              allerA(j);
              setCalOuvert(false);
            }}
          />
        ) : null}

        <div style={{ maxWidth: 256, width: "100%", margin: "-4px auto" }}>
          <RoueRythme dessin={dessin} maintenant={estAujourdhui ? maintenantMinutes() : null} reperes={reperes} />
        </div>
        {/* 12/11 (Laura) : Lait à gauche de la légende, Selles à droite, au-dessus de Réveillé / Endormi. */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {boutonRond("lait")}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Legende />
          </div>
          {boutonRond("selle")}
        </div>

        {/* Saisie d’un moment. */}
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" style={boutonMoment("reveil")} onClick={() => ouvrirAjout("reveil")}>
            <IconeSoleil /> Réveillé{e}
          </button>
          <button type="button" style={boutonMoment("endormi")} onClick={() => ouvrirAjout("endormi")}>
            <IconeLune /> Endormi{e}
          </button>
        </div>
        {/* 07/11 : la case de l'heure, plus étroite, et « Ajouter » sur la même ligne. Pas de bouton Annuler :
            toucher à nouveau le bouton choisi referme la saisie. Pour le lait, une 2e ligne : la quantité. */}
        {ajout ? (
          <div style={{ background: CARTE, borderRadius: 16, padding: "8px 12px", display: "grid", gap: 8 }}>
            {/* 12/11 (Laura) : roulette centrée dans la case (grille 1fr / roulette / 1fr) ; pour le lait,
                la quantité prend la place, la ligne reste en flex. */}
            <div
              style={
                ajout === "lait"
                  ? { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }
                  : { display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 10 }
              }
            >
              <span style={{ flex: 1, fontSize: 14, color: TEXT, fontWeight: 600 }}>
                {ajout === "reveil" ? `Réveillé${e} à` : ajout === "endormi" ? `Endormi${e} à` : ajout === "lait" ? "Lait à" : "Selle à"}
              </span>
              <SelecteurHeure valeur={heureAjout} onChange={setHeureAjout} type={ajout} />
              {/* 12/11 (Laura) : la quantité entre l'heure et « Ajouter ». */}
              {ajout === "lait" ? champMl(ml, setMl) : null}
              <button
                type="button"
                onClick={valider}
                style={ajout === "lait" ? { ...boutonPlein(ajout), padding: "9px 12px" } : { ...boutonPlein(ajout), justifySelf: "end" }}
              >
                Ajouter
              </button>
            </div>
          </div>
        ) : null}

        {message ? (
          <p role="status" style={{ margin: 0, fontSize: 13, color: "#8A3020", lineHeight: 1.4, textAlign: "center" }}>
            {message}
          </p>
        ) : null}

        {/* 07/11 : lignes resserrées vers le centre du cadre (moins de vide au milieu). */}
        {/* 12/11 (Laura) : plus de « Commence par le moment que tu veux… » ni de « Demain, sa roue
            commencera… », l'outil est assez intuitif. Le cadre n'apparaît que s'il a quelque chose à montrer. */}
        {/* 12/11 (Laura) : le détail en 3 cadres déroulants, chacun seulement s'il a quelque chose à montrer. */}
        <style>{`
          details.rythme-cadre > summary { list-style: none; }
          details.rythme-cadre > summary::-webkit-details-marker { display: none; }
          details.rythme-cadre[open] .rythme-chevron { transform: rotate(180deg); }
          details.rythme-cadre:first-of-type { margin-top: 6px; }
        `}</style>
        {lignes.length ? cadre("sommeil", "Éveil & Sommeil", dessin.sommeil ? `${duree(dessin.sommeil)} de sommeil` : "", lignes) : null}
        {lignesLait.length
          ? cadre("lait", "Prises de lait", `${lignesLait.length}${totalMl ? ` · ${totalMl} mL` : ""}`, lignesLait)
          : null}
        {lignesSelles.length ? cadre("selles", "Selles", String(lignesSelles.length), lignesSelles) : null}
        {/* Plus de « Chaque moment est enregistré tout seul. » (Laura, 12/11/2026) :
            on n'écrit rien quand tout va bien, seulement l'enregistrement en cours ou un souci. */}
        {!disponible || etat === "enregistrement" || etat === "erreur" ? (
          <p style={{ margin: 0, fontSize: 11.5, color: DOUX, textAlign: "center" }}>
            {!disponible
              ? "L’enregistrement des journées arrive bientôt : cette roue n’est pas gardée."
              : etat === "enregistrement"
                ? "Enregistrement…"
                : "Pas enregistré : vérifie ta connexion."}
          </p>
        ) : null}

        {/* 12/11 (Laura) : plus de bouton « Journée suivante → » ici ; les flèches du haut suffisent. */}

        {/* 12/11 (Laura) : « Ses journées précédentes », sans phrase d'aide ; les 3 plus récentes avant
            aujourd'hui, puis « En voir plus » (6 de plus à chaque fois). Rien s'il n'y en a pas.
            12/11 (Laura) : bande de fond bleu un cran plus soutenu (même gamme), d’un bord à l’autre et
            jusqu’en bas, pour séparer les journées précédentes du reste ; plus de marge au-dessus. */}
        {precedentes.length ? (
        <section
          aria-label="Ses journées précédentes"
          style={{ margin: "18px -20px -28px", padding: "18px 20px 28px", background: FOND_JOURNEES, borderRadius: "22px 22px 0 0" }}
        >
          <h2 style={{ fontFamily: PLAYFAIR, fontSize: 18, fontWeight: 600, color: TEXT, margin: "0 0 12px", textAlign: "center" }}>Ses journées précédentes</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {precedentes.slice(0, nbVisibles).map((j) => (
              <button
                key={j}
                type="button"
                onClick={() => {
                  allerA(j);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={{
                  background: CARTE,
                  border: j === jour ? `2px solid ${VERT_TEXTE}` : "2px solid transparent",
                  borderRadius: 14,
                  padding: 6,
                  cursor: "pointer",
                }}
              >
                <RoueRythme dessin={dessiner(jours[j] ?? [], fenetre, suiteDort(j))} mini />
                <span style={{ display: "block", marginTop: 4, fontSize: 11.5, fontWeight: 600, color: TEXT }}>{dateCourte(j)}</span>
              </button>
            ))}
          </div>
          {/* 12/11 (Laura) : « En voir plus » / « Voir moins » en simple texte souligné. */}
          {precedentes.length > nbVisibles || nbVisibles > 3 ? (
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 12 }}>
              {precedentes.length > nbVisibles ? (
                <button type="button" onClick={() => setNbVisibles((n) => n + 6)} style={lienTexte}>
                  En voir plus
                </button>
              ) : null}
              {nbVisibles > 3 ? (
                <button type="button" onClick={() => setNbVisibles(3)} style={lienTexte}>
                  Voir moins
                </button>
              ) : null}
            </div>
          ) : null}
        </section>
        ) : null}
      </div>
    </>
  );
}

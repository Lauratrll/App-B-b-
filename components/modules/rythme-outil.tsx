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
  repriseDeLaVeille,
  trier,
  verifier,
  type Dessin,
  type FenetreEveil,
  type JourneeEnregistree,
  type Moment,
} from "@/lib/rythme";

const TEXT = "#3A3228";
const DOUX = "#4E5E6A"; // gris bleuté (07/11, avec le fond bleu ciel)
const PLAYFAIR = "var(--font-playfair), Georgia, serif";
const FOND = "#D3E5F2"; // bleu ciel de la gamme Réflexologie (Laura, 07/11 : remplace le vert)
const VERT_TEXTE = "#2F6081"; // bleu profond de la même famille (nom gardé)
const EUCAL = "#8A9E98";
const CARTE = "rgba(255,255,255,.55)";
const BORD = "rgba(47,96,129,.16)";

export const COULEURS_RYTHME = {
  base: "rgba(255,255,255,.75)",
  nuit: "#89BDC8", // slot Réveils nocturnes
  sieste: "#B6D6DD", // slot Fin de journée
  eveil: "#F0B8A8", // pêche
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

export function RoueRythme({ dessin, mini, maintenant }: { dessin: Dessin; mini?: boolean; maintenant?: number | null }) {
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
    if (z.k === "nuit" || z.k === "sieste" || z.k === "eveil") plage(z.a, z.b, C[z.k]);
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
    ["6h", 0.25],
    ["12h", 0.5],
    ["18h", 0.75],
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
      {dessin.couchers.map((m) => {
        const a = point(cx, cy, ri - 4, m / F);
        const b = point(cx, cy, ro + 4, m / F);
        return <line key={`c${m}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.coucher} strokeWidth={mini ? 4 : 2.5} strokeLinecap="round" />;
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
      {item(p(C.nuit), "Nuit")}
      {item(p(C.sieste), "Sieste")}
      {item(p(C.eveil), "Éveil")}
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
const TEINTE = { reveil: "#F8DDD4", endormi: "#D3E7EC" } as const;
const PLEIN = { reveil: C.eveil, endormi: C.nuit } as const;

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

function SelecteurHeure({ valeur, onChange, type }: { valeur: string; onChange: (h: string) => void; type: "reveil" | "endormi" }) {
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
const caseHeure = (type: "reveil" | "endormi"): React.CSSProperties => ({
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

const boutonPlein = (type: "reveil" | "endormi"): React.CSSProperties => ({
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
    Object.fromEntries(journees.map((j) => [j.jour, trier(j.evenements ?? [])])),
  );
  const [jour, setJour] = useState(aujourdhui);
  const [ajout, setAjout] = useState<null | "reveil" | "endormi">(null);
  const [heureAjout, setHeureAjout] = useState("07:00");
  // Moment de la liste dont on change l'heure (index dans l'ordre de la journée).
  const [edition, setEdition] = useState<number | null>(null);
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
  const suiteDort = (j: string, tous = jours) => Boolean(tous[decaler(j, 1)]?.[0]?.veille);
  const moments = momentsDe(jour);
  const estAujourdhui = jour === aujourdhui();
  const dessin = dessiner(moments, fenetre, suiteDort(jour));

  const sauver = (j: string, ms: Moment[]) => {
    if (!disponible) return;
    setEtat("enregistrement");
    file.current = file.current.then(async () => {
      const r = await enregistrerJournee({ jour: j, mois_bebe: mois, evenements: ms });
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

  const ouvrirAjout = (t: "reveil" | "endormi") => {
    setMessage(null);
    // Toucher le bouton déjà choisi referme la saisie ; changer de bouton garde l'heure choisie.
    if (ajout === t) return setAjout(null);
    if (ajout) return setAjout(t);
    setAjout(t);
    const dernier = moments.length ? trier(moments)[moments.length - 1] : null;
    let h: number;
    if (estAujourdhui) h = Math.round(maintenantMinutes() / 5) * 5;
    else if (dernier && !dernier.veille) h = enMinutes(dernier.h) + (dernier.t === "reveil" ? Math.round(((fenetre?.min ?? 90) + (fenetre?.max ?? 90)) / 2) : 60);
    else h = t === "reveil" ? 7 * 60 : 13 * 60;
    setHeureAjout(horloge(Math.min(h, UNE_JOURNEE - 5)));
  };

  const valider = () => {
    if (!ajout) return;
    if (essayer([...moments, { t: ajout, h: heureAjout }])) setAjout(null);
  };

  const retirer = (i: number) => {
    const s = trier(moments);
    const sans = (...idx: number[]) => s.filter((_, k) => !idx.includes(k));
    if (verifier(sans(i)) === null) return essayer(sans(i));
    // Retirer un moment au milieu laisserait deux réveils (ou deux endormissements) à la suite :
    // on retire aussi le moment qui le suit, comme on effacerait une sieste entière.
    if (i + 1 < s.length && verifier(sans(i, i + 1)) === null) {
      return essayer(sans(i, i + 1), `Le moment de ${heureLisible(s[i + 1].h)} est retiré aussi, pour garder l’enchaînement.`);
    }
    if (i > 0 && verifier(sans(i - 1, i)) === null) {
      const p = s[i - 1];
      return essayer(sans(i - 1, i), `Le moment ${p.veille ? "d’hier soir" : `de ${heureLisible(p.h)}`} est retiré aussi, pour garder l’enchaînement.`);
    }
    setMessage("Ce moment ne peut pas être retiré seul.");
  };

  const allerA = (j: string) => {
    if (!j || j > aujourdhui()) return;
    setJour(j);
    setAjout(null);
    setEdition(null);
    setMessage(null);
  };

  // Lignes de la liste (07/11) : le premier moment en bas, le plus récent en haut.
  // La durée de chaque phase s'écrit au-dessus du moment qui l'ouvre.
  const tries = trier(moments);
  const lignes = tries.map((m, i) => {
    const suivant = tries[i + 1];
    const a = m.veille ? 0 : enMinutes(m.h);
    const nuit = m.t === "endormi" && (m.veille || estNuit(m.h));
    const couleur = m.t === "reveil" ? C.eveil : nuit ? C.nuit : C.sieste;
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

  const sauvegardes = Object.keys(jours)
    .filter((j) => jours[j].length)
    .sort((a, b) => (a < b ? 1 : -1));

  // 07/11 (Laura) : les deux boutons au début de la roue, ensuite seulement l'autre moment
  // que le dernier noté ; celui qui n'est pas accessible passe en gris clair.
  const dernierNote = tries.length ? tries[tries.length - 1].t : null;
  const permis = (t: "reveil" | "endormi") => dernierNote !== t;

  const boutonMoment = (t: "reveil" | "endormi"): React.CSSProperties => ({
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 10px",
    borderRadius: 16,
    border: ajout === t ? `2px solid ${VERT_TEXTE}` : "2px solid transparent",
    background: !permis(t) ? "rgba(255,255,255,.45)" : t === "reveil" ? C.eveil : C.nuit,
    color: permis(t) ? TEXT : "rgba(58,50,40,.3)",
    fontFamily: PLAYFAIR,
    fontSize: 16,
    fontWeight: 600,
    cursor: permis(t) ? "pointer" : "default",
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
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 14, paddingBottom: 12 }}>
        <header style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: PLAYFAIR, fontSize: 24, fontWeight: 600, color: TEXT, margin: "0 0 4px", lineHeight: 1.15 }}>
            Le rythme de {prenom}
          </h1>
          {/* 07/11 : sous-titre en capitales eucalyptus (typo des sous-titres de Sommeil). */}
          <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: EUCAL, margin: 0 }}>
            Ses périodes d’éveil et de sommeil
          </p>
        </header>

        {/* Choix du jour : flèches, ou toucher la date pour ouvrir le calendrier. */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button type="button" aria-label="Journée précédente" style={fleche} onClick={() => allerA(decaler(jour, -1))}>
            ‹
          </button>
          <label style={{ position: "relative", flex: 1, textAlign: "center", cursor: "pointer" }}>
            <span style={{ display: "block", fontFamily: PLAYFAIR, fontSize: 17, fontWeight: 600, color: TEXT }}>{dateLongue(jour)}</span>
            <span style={{ display: "block", fontSize: 11.5, color: DOUX }}>{estAujourdhui ? "aujourd’hui" : "toucher pour changer de date"}</span>
            <input
              type="date"
              value={jour}
              max={aujourdhui()}
              aria-label="Choisir la date"
              onChange={(e) => allerA(e.target.value)}
              style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", cursor: "pointer" }}
            />
          </label>
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

        <div style={{ maxWidth: 290, width: "100%", margin: "0 auto" }}>
          <RoueRythme dessin={dessin} maintenant={estAujourdhui ? maintenantMinutes() : null} />
        </div>
        <Legende />

        {/* Saisie d'un moment. */}
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" style={boutonMoment("reveil")} disabled={!permis("reveil")} onClick={() => ouvrirAjout("reveil")}>
            <IconeSoleil /> Réveillé{e}
          </button>
          <button type="button" style={boutonMoment("endormi")} disabled={!permis("endormi")} onClick={() => ouvrirAjout("endormi")}>
            <IconeLune /> Endormi{e}
          </button>
        </div>
        {/* 07/11 : la case de l'heure, plus étroite, et « Ajouter » sur la même ligne. Pas de bouton Annuler :
            toucher à nouveau Réveillé / Endormi referme la saisie. */}
        {ajout && permis(ajout) ? (
          <div style={{ background: CARTE, borderRadius: 16, padding: "8px 12px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ flex: 1, fontSize: 14, color: TEXT, fontWeight: 600 }}>{ajout === "reveil" ? `Réveillé${e} à` : `Endormi${e} à`}</span>
            <SelecteurHeure valeur={heureAjout} onChange={setHeureAjout} type={ajout} />
            <button type="button" onClick={valider} style={boutonPlein(ajout)}>
              Ajouter
            </button>
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
        {lignes.length || !disponible || etat === "enregistrement" || etat === "erreur" ? (
        <section style={{ background: CARTE, borderRadius: 18, padding: "10px 12px" }} aria-label="Moments notés">
          {lignes.length ? <ul style={{ margin: "0 auto", padding: 0, maxWidth: 270 }}>{lignes}</ul> : null}
          {/* Plus de « Chaque moment est enregistré tout seul. » (Laura, 12/11/2026) :
              on n'écrit rien quand tout va bien, seulement l'enregistrement en cours ou un souci. */}
          {!disponible || etat === "enregistrement" || etat === "erreur" ? (
            <p style={{ margin: "6px 0 0", fontSize: 11.5, color: DOUX, textAlign: "center" }}>
              {!disponible
                ? "L’enregistrement des journées arrive bientôt : cette roue n’est pas gardée."
                : etat === "enregistrement"
                  ? "Enregistrement…"
                  : "Pas enregistré : vérifie ta connexion."}
            </p>
          ) : null}
        </section>
        ) : null}

        {estAujourdhui ? null : (
          <button
            type="button"
            onClick={() => allerA(decaler(jour, 1))}
            style={{ padding: "11px 16px", borderRadius: 999, border: `1px solid ${BORD}`, background: CARTE, color: VERT_TEXTE, fontFamily: PLAYFAIR, fontSize: 15, fontWeight: 600, cursor: "pointer" }}
          >
            Journée suivante →
          </button>
        )}

        <section aria-label="Ses journées">
          <h2 style={{ fontFamily: PLAYFAIR, fontSize: 18, fontWeight: 600, color: TEXT, margin: "6px 0 4px" }}>Ses journées</h2>
          <p style={{ fontSize: 12.5, color: DOUX, margin: "0 0 10px", lineHeight: 1.4 }}>
            {sauvegardes.length ? "Touche une roue pour la revoir ou la compléter." : "Les journées notées s’afficheront ici, côte à côte."}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {sauvegardes.map((j) => (
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
                <RoueRythme dessin={dessiner(jours[j], fenetre, suiteDort(j))} mini />
                <span style={{ display: "block", marginTop: 4, fontSize: 11.5, fontWeight: 600, color: TEXT }}>{dateCourte(j)}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

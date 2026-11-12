// ----------------------------------------------------------------------------
// Le rythme de bébé (outil « Enregistrer le rythme de mon bébé », 06/11/2026).
// Calculs purs, partagés par l'écran et les actions serveur.
//
// Modèle (Laura, 06/11, 2e version) : une roue = un jour du calendrier, de 0h
// à 24h. Le parent note des MOMENTS, dans l'ordre qu'il veut : « réveil à » ou
// « endormi à ». La roue se colore au fur et à mesure :
//   - un réveil sans endormissement après → dégradé beige sur la durée d'éveil
//     moyenne de l'âge (plein jusqu'au bas de la fourchette, puis s'efface) ;
//   - un endormissement sans réveil après → dégradé bleu sur 1h ;
//   - dès que le moment suivant est noté → couleur pleine (éveil, sieste, nuit).
// Endormi entre 8h et 17h50 = sieste ; sinon nuit.
// Enchaînement : la journée suivante reprend l'endormissement du soir
// (« endormi hier à »), la nuit part alors de 0h.
// ----------------------------------------------------------------------------

import reperes from "@/content/sommeil/reperes_cles.json";

export type Moment = { t: "reveil" | "endormi"; h: string; veille?: boolean };
/**
 * 12/11/2026 (Laura) : repères posés sur la roue, hors éveil et sommeil. Rangés dans la
 * même colonne `evenements` (pas de migration) ; ils ne comptent pas dans le rythme.
 */
export type Repere = { t: "lait"; h: string; ml?: number } | { t: "selle"; h: string };
export type Evenement = Moment | Repere;
export type JourneeEnregistree = { id: string; jour: string; mois_bebe: number | null; evenements: Evenement[] };

export const estMoment = (x: Evenement): x is Moment => x.t === "reveil" || x.t === "endormi";
export const trierReperes = (r: Repere[]): Repere[] => [...r].sort((a, b) => enMinutes(a.h) - enMinutes(b.h));
/** Une journée enregistrée → ses moments d'éveil et de sommeil, et ses repères (lait, selles). */
export function separer(evs: Evenement[] | null | undefined): { moments: Moment[]; reperes: Repere[] } {
  const l = evs ?? [];
  return {
    moments: trier(l.filter(estMoment)),
    reperes: trierReperes(l.filter((x): x is Repere => !estMoment(x))),
  };
}
/** Quantité de lait acceptée, en mL. */
export const ML_MAX = 2000;

export type Zone =
  | { k: "nuit" | "sieste" | "eveil"; a: number; b: number }
  | { k: "halo-eveil"; a: number; plein: number; b: number }
  | { k: "halo-sommeil"; a: number; b: number };

export type Dessin = { zones: Zone[]; sommeil: number; ouverte: boolean; couchers: number[] };

export const UNE_JOURNEE = 1440;
export const HEURE_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
export const JOUR_RE = /^\d{4}-\d{2}-\d{2}$/;
/** Le dégradé de sommeil s'étend sur 1h (Laura, 06/11). */
export const HALO_SOMMEIL = 60;

export const enMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** « 19:45 » à partir de minutes. */
export function horloge(min: number) {
  const x = ((Math.round(min) % UNE_JOURNEE) + UNE_JOURNEE) % UNE_JOURNEE;
  const h = Math.floor(x / 60);
  const m = x % 60;
  return `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}`;
}

/** « 19h45 », « 7h » (DECISIONS 29/10 : sans espace). */
export const heureLisible = (t: string) => {
  const [h, m] = t.split(":");
  return `${Number(h)}h${m === "00" ? "" : m}`;
};

/** Durée sans espace : 45 min, 1h, 1h30, 13h15. */
export function duree(min: number) {
  const x = Math.round(min);
  if (x < 60) return `${x} min`;
  const h = Math.floor(x / 60);
  const m = x % 60;
  return `${h}h${m ? (m < 10 ? "0" : "") + m : ""}`;
}

/** Endormi entre 8h et 17h50 : sieste. Sinon : nuit (Laura, 06/11). */
export const estNuit = (h: string) => {
  const x = enMinutes(h);
  return x >= 17 * 60 + 50 || x < 8 * 60;
};

const position = (m: Moment) => (m.veille ? -1 : enMinutes(m.h));

export function trier(ms: Moment[]): Moment[] {
  return [...ms].sort((a, b) => position(a) - position(b));
}

/**
 * null si la suite est cohérente ; sinon une phrase pour le parent.
 * 12/11 (Laura) : deux réveils ou deux endormissements à la suite sont PERMIS. Le parent
 * complète souvent après coup (le réveil oublié entre deux sommeils) ; en attendant, chaque
 * moment compte jusqu'au suivant, dans son propre état.
 */
export function verifier(ms: Moment[]): string | null {
  const s = trier(ms);
  if (s.filter((m) => m.veille).length > 1) return "Il ne peut y avoir qu'un endormissement de la veille.";
  for (let i = 1; i < s.length; i++) {
    const p = s[i - 1];
    const c = s[i];
    if (!c.veille && !p.veille && c.h === p.h) return `Deux moments sont notés à ${heureLisible(c.h)}.`;
  }
  return null;
}

/**
 * Zones de la roue. `suiteDort` : la journée suivante est notée et commence
 * endormie, donc le dernier endormissement va jusqu'à minuit en couleur pleine.
 */
export function dessiner(ms: Moment[], fenetre: FenetreEveil | null, suiteDort = false): Dessin {
  const s = trier(ms);
  const zones: Zone[] = [];
  const couchers: number[] = [];
  let sommeil = 0;
  let ouverte = false;
  s.forEach((m, i) => {
    const a = m.veille ? 0 : enMinutes(m.h);
    const suivant = s[i + 1];
    const b = suivant ? enMinutes(suivant.h) : null;
    if (m.t === "endormi") {
      const nuit = m.veille || estNuit(m.h);
      // Trait rouge : le coucher du soir seulement (pas un rendormissement de nuit).
      if (!m.veille && a >= 17 * 60 + 50) couchers.push(a);
      const fin = b ?? (suiteDort ? UNE_JOURNEE : null);
      if (fin !== null) {
        zones.push({ k: nuit ? "nuit" : "sieste", a, b: fin });
        sommeil += fin - a;
      } else {
        zones.push({ k: "halo-sommeil", a, b: Math.min(a + HALO_SOMMEIL, UNE_JOURNEE) });
        ouverte = true;
      }
    } else if (b !== null) {
      zones.push({ k: "eveil", a, b });
    } else {
      ouverte = true;
      if (fenetre) {
        zones.push({
          k: "halo-eveil",
          a,
          plein: Math.min(a + fenetre.min, UNE_JOURNEE),
          b: Math.min(a + fenetre.max, UNE_JOURNEE),
        });
      }
    }
  });
  return { zones, sommeil, ouverte, couchers };
}

/** Moment de départ d'une nouvelle journée : l'endormissement du soir de la veille, s'il y en a un. */
export function repriseDeLaVeille(veille: Moment[] | undefined): Moment[] {
  if (!veille?.length) return [];
  const dernier = trier(veille)[veille.length - 1];
  if (dernier.t !== "endormi" || dernier.veille || !estNuit(dernier.h)) return [];
  return [{ t: "endormi", h: dernier.h, veille: true }];
}

// ---------------------------------------------------------------------------
// Durée d'éveil moyenne de l'âge, lue dans reperes_cles.json
// (« 10 à 30 min », « ≈ 1h30 », « 2h à 3h »). Valeur unique : 15 min de part
// et d'autre (choix provisoire, DECISIONS 06/11).
// ---------------------------------------------------------------------------

function lireDuree(txt: string): number | null {
  const t = txt.trim();
  const hm = /^(\d+)h(\d{1,2})?$/.exec(t);
  if (hm) return Number(hm[1]) * 60 + Number(hm[2] ?? 0);
  const mn = /^(\d+)\s*min$/.exec(t);
  if (mn) return Number(mn[1]);
  const nu = /^(\d+)$/.exec(t);
  return nu ? Number(nu[1]) : null;
}

export type FenetreEveil = { min: number; max: number; texte: string };

export function fenetreEveil(mois: number): FenetreEveil | null {
  const r = (reperes as Record<string, { duree_eveil_moyenne?: string }>)[String(mois)];
  const texte = r?.duree_eveil_moyenne;
  if (!texte) return null;
  const propre = texte.replace("≈", "").trim();
  const [g, d] = propre.split(" à ").map((x) => x.trim());
  if (d !== undefined) {
    const max = lireDuree(d);
    const min = lireDuree(/min$/.test(d) && /^\d+$/.test(g) ? `${g} min` : g);
    return min !== null && max !== null && max > min ? { min, max, texte } : null;
  }
  const v = lireDuree(propre);
  return v === null ? null : { min: Math.max(5, v - 15), max: v + 15, texte };
}

/** Contrôle des données reçues (actions serveur) : moments d'éveil-sommeil + repères lait / selles. */
export function evenementsValides(x: unknown): x is Evenement[] {
  if (!Array.isArray(x) || x.length > 150) return false;
  const ok = x.every((m) => {
    if (!m || typeof m !== "object") return false;
    const e = m as Record<string, unknown>;
    if (typeof e.h !== "string" || !HEURE_RE.test(e.h)) return false;
    if (e.t === "reveil" || e.t === "endormi") return e.veille === undefined || e.veille === true;
    if (e.t === "lait") return e.ml === undefined || (Number.isInteger(e.ml) && (e.ml as number) > 0 && (e.ml as number) <= ML_MAX);
    return e.t === "selle";
  });
  return ok && verifier((x as Evenement[]).filter(estMoment)) === null;
}

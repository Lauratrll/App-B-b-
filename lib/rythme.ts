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
export type JourneeEnregistree = { id: string; jour: string; mois_bebe: number | null; evenements: Moment[] };

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
 * Ajout d'un moment n'importe où dans la journée (Laura, 12/11) : un sommeil
 * oublié à 1h, une sieste au milieu d'un éveil déjà noté…
 * - `seul` : le moment s'insère tel quel ;
 * - sinon il tombe au milieu d'une phase du même genre et il faut l'autre bout de
 *   la période : `apres` = l'autre moment vient après (avant le moment suivant),
 *   sinon il vient avant (après le moment précédent). `suggestion` : heure proposée.
 */
export type Insertion =
  | { seul: true }
  | { seul: false; autre: "reveil" | "endormi"; apres: boolean; suggestion: string };

export function insertion(ms: Moment[], t: "reveil" | "endormi", h: string): Insertion {
  const s = trier(ms);
  const x = enMinutes(h);
  const avant = s.filter((m) => position(m) < x).pop();
  const suivant = s.find((m) => position(m) > x);
  const autre = t === "reveil" ? "endormi" : "reveil";
  if (suivant && suivant.t === t) {
    const fin = Math.max(x + 5, Math.min(x + 30, position(suivant) - 5));
    return { seul: false, autre, apres: true, suggestion: horloge(Math.min(fin, UNE_JOURNEE - 5)) };
  }
  if (avant && avant.t === t) {
    const debut = Math.min(x - 5, Math.max(x - 30, Math.max(0, position(avant)) + 5));
    return { seul: false, autre, apres: false, suggestion: horloge(Math.max(debut, 0)) };
  }
  return { seul: true };
}

/** null si la suite est cohérente ; sinon une phrase pour le parent. */
export function verifier(ms: Moment[]): string | null {
  const s = trier(ms);
  if (s.filter((m) => m.veille).length > 1) return "Il ne peut y avoir qu'un endormissement de la veille.";
  for (let i = 1; i < s.length; i++) {
    const p = s[i - 1];
    const c = s[i];
    if (!c.veille && !p.veille && c.h === p.h) return `Deux moments sont notés à ${heureLisible(c.h)}.`;
    if (c.t === p.t) {
      const quoi = c.t === "reveil" ? "deux réveils" : "deux endormissements";
      const manque = c.t === "reveil" ? "un endormissement" : "un réveil";
      const avant = p.veille ? "hier soir" : heureLisible(p.h);
      return `Il y a ${quoi} à la suite (${avant} et ${heureLisible(c.h)}) : il manque ${manque} entre les deux.`;
    }
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

/** Contrôle des données reçues (actions serveur). */
export function momentsValides(x: unknown): x is Moment[] {
  return (
    Array.isArray(x) &&
    x.length <= 40 &&
    x.every(
      (m) =>
        m &&
        typeof m === "object" &&
        ((m as Moment).t === "reveil" || (m as Moment).t === "endormi") &&
        typeof (m as Moment).h === "string" &&
        HEURE_RE.test((m as Moment).h) &&
        ((m as Moment).veille === undefined || (m as Moment).veille === true),
    ) &&
    verifier(x as Moment[]) === null
  );
}

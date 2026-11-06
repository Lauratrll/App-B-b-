// lib/apaisement.ts
// ===========================================================================
// Couche données de la rubrique « Gestes d'apaisement » (boîte à outils).
//
// Les gestes sont lus depuis content/apaisement/gestes_apaisement.json, en
// import statique (comme la Réflexologie plantaire), et non depuis Supabase.
// Ce JSON est GÉNÉRÉ par docs/apaisement notes/generer_json_gestes.py à partir
// du tableau content/apaisement/Gestes_apaisement_reference.xlsx par
// scripts/export_gestes_apaisement.py : ne jamais le modifier à la main.
//
// La table `content` ne porte qu'une ligne par geste (module 'apaisement'),
// pour l'épingler : scripts/import-apaisement.mjs.
// ===========================================================================

import donnees from "@/content/apaisement/gestes_apaisement.json";

/**
 * La mention « Description en cours de création » sous le pas à pas.
 * Passer à `false` quand Laura aura validé les textes (brief §4.4).
 */
export const AFFICHER_MENTION_DESCRIPTION = true;

/** Cookie qui garde le dernier onglet consulté (brief §4.3). */
export const COOKIE_ONGLET = "apaisement_onglet";

export type PasAPas = {
  intro: string[];
  etapes: string[];
  suite: string[];
};

export type Geste = {
  id: string;
  ordre: number;
  titre: string;
  mois_debut: number;
  mois_fin: number;
  /** Un seul onglet par geste (Laura, 05/11). */
  onglet: string;
  format_prevu: string;
  visuel_attendu: boolean;
  objectif: string | null;
  pourquoi: string | null;
  pas_a_pas: PasAPas | null;
  cadre_securite: string[] | null;
  sources: string[];
  /** `lien_coherence_cardiaque` : la carte renvoie vers /coherence. */
  type?: string;
};

export type Onglet = { id: string; label: string; nombre: number };

type Donnees = {
  placeholder_visuel: string;
  mention_description: string;
  onglet_par_defaut: string;
  masquer_onglet_sous_n_gestes: number;
  onglets: { id: string; label: string }[];
  gestes: Geste[];
};

const D = donnees as unknown as Donnees;

export const PLACEHOLDER_VISUEL = D.placeholder_visuel;
export const MENTION_DESCRIPTION = D.mention_description;
export const ONGLET_PAR_DEFAUT = D.onglet_par_defaut;

const GESTES = [...D.gestes].sort((a, b) => a.ordre - b.ordre);

export function estLienCoherence(g: Geste): boolean {
  return g.type === "lien_coherence_cardiaque";
}

/** Un geste est visible si mois_debut ≤ mois de bébé ≤ mois_fin. */
export function gesteVisible(g: Geste, mois: number): boolean {
  return g.mois_debut <= mois && mois <= g.mois_fin;
}

export function getGestesDuMois(mois: number): Geste[] {
  return GESTES.filter((g) => gesteVisible(g, mois));
}

/** Tous les gestes qui ont une fiche (la cohérence cardiaque n'en a pas). */
export function getGestesAvecFiche(): Geste[] {
  return GESTES.filter((g) => !estLienCoherence(g));
}

/** La fiche d'un geste, quel que soit le mois : un geste épinglé reste
 *  accessible depuis les Épinglés après son mois de fin (brief §4.5). */
export function getGeste(id: string): Geste | null {
  const g = GESTES.find((x) => x.id === id);
  return g && !estLienCoherence(g) ? g : null;
}

/**
 * Les onglets du mois, dans l'ordre du bloc « onglets » du JSON (Mal
 * de ventre, gaz · Stop pleurs · Détente · Portage · Guide). Pas d'onglet
 * « Tous » ; un onglet qui a moins de « masquer_onglet_sous_n_gestes » gestes
 * visibles est masqué.
 */
export function getOnglets(mois: number): Onglet[] {
  const gestes = getGestesDuMois(mois);
  return D.onglets
    .map((o) => ({ ...o, nombre: gestes.filter((g) => g.onglet === o.id).length }))
    .filter((o) => o.nombre >= D.masquer_onglet_sous_n_gestes);
}

/** L'onglet à ouvrir (brief §4.3) : la première fois, « onglet_par_defaut » ;
 *  ensuite le dernier consulté ; s'il est masqué ce mois-ci, le premier onglet
 *  visible. */
export function ongletAOuvrir(onglets: Onglet[], memorise: string | undefined): string {
  const visible = (id?: string) => Boolean(id) && onglets.some((o) => o.id === id);
  const premier = onglets[0]?.id ?? D.onglet_par_defaut;
  // Un onglet qui n'existe plus (l'ancien « Tous ») compte comme une première visite.
  const connu = D.onglets.some((o) => o.id === memorise);
  if (memorise && connu) return visible(memorise) ? memorise : premier;
  return visible(D.onglet_par_defaut) ? D.onglet_par_defaut : premier;
}

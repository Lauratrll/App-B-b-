// ----------------------------------------------------------------------------
// « Que me dit bébé ? » : préparation du contenu côté serveur (05/11/2026).
//
// Lit content/signaux-bebe/signaux_bebe_v2.json (questionnaire « pleurs » court, 06/11/2026 ; l'original est rangé dans docs/signaux-bebe-v1/ pour un questionnaire sommeil ; généré depuis le classeur par
// scripts/export_signaux_bebe.py ; ne jamais l'éditer à la main) et ne garde
// QUE ce qui s'affiche. Les champs internes (note_interne, sources,
// statut_preuve, pourquoi, tests) ne partent jamais vers le téléphone.
// Les textes sont nettoyés des identifiants de sources et des notes de travail.
// ----------------------------------------------------------------------------

import brut from "@/content/signaux-bebe/signaux_bebe_v2.json";
import {
  alertesAffichees,
  nettoyerTexte,
  type DonneesSignaux,
  type OptionSignal,
} from "@/lib/signaux-bebe";

/** Phrase prudente de chaque piste (« jamais un diagnostic »). Proposées le
 *  05/11/2026 et validées par Laura avec la maquette. Le classeur n'a qu'un
 *  nom court par piste : à reporter dans le classeur un jour, puis à lire ici. */
export const PHRASES_PISTES: Record<string, string> = {
  FA: "Il cherche peut-être à manger",
  VE: "Il a peut-être mal au ventre ou des gaz",
  CO: "Sa couche le gêne peut-être",
  TE: "Il a peut-être trop chaud ou trop froid",
  FT: "Il est peut-être fatigué",
  CT: "Il a peut-être besoin de contact",
  SU: "Il a peut-être eu trop de stimulations",
  SO: "Ce sont peut-être les pleurs du soir",
  ET: "Il a peut-être besoin de bouger, de s'exercer",
  EN: "Il cherche peut-être à jouer, à échanger",
  FR: "Il est peut-être frustré",
  IN: "Quelque chose le gêne peut-être : couche, chaleur, vêtement",
  SA: "Il dort peut-être d'un sommeil agité",
};

/** Sources qui ne s'affichent jamais (formation, cartes éditoriales, vérifications internes). */
const SOURCES_INTERNES = new Set(["S13", "S14", "S19", "S24", "S27", "S29"]);
const idsPublics = (brut: unknown): string[] =>
  (Array.isArray(brut) ? brut.map(String) : String(brut ?? "").split(","))
    .map((x) => x.trim())
    .filter((x) => /^S\d+$/.test(x) && !SOURCES_INTERNES.has(x));

export type Carte = {
  titre: string;
  sens: string;
  sources_sens: string[];
  gestes: string[];
  sources_gestes: string[];
  observer: string | null;
  sources_observer: string[];
  consulter: string | null;
  sources_consulter: string[];
};

/** Variante d'une carte pour une tranche d'âge : ne remplace que les champs renseignés
 *  (avec leurs propres sources). Âge en mois, bornes comprises. */
export type VarianteCarte = {
  age_min: number;
  age_max: number;
  sens?: string;
  sources_sens?: string[];
  gestes?: string[];
  sources_gestes?: string[];
  observer?: string;
  sources_observer?: string[];
  consulter?: string;
  sources_consulter?: string[];
};

/** Carte adaptée à l'âge de bébé : la variante de sa tranche, sinon la carte de base. */
export function carteAgee(carte: Carte, variantes: VarianteCarte[] | undefined, age: number): Carte {
  const v = (variantes ?? []).find((x) => x.age_min <= age && age <= x.age_max);
  if (!v) return carte;
  return {
    ...carte,
    sens: v.sens ?? carte.sens,
    sources_sens: v.sens ? (v.sources_sens ?? []) : carte.sources_sens,
    gestes: v.gestes && v.gestes.length > 0 ? v.gestes : carte.gestes,
    sources_gestes: v.gestes && v.gestes.length > 0 ? (v.sources_gestes ?? []) : carte.sources_gestes,
    observer: v.observer ?? carte.observer,
    sources_observer: v.observer ? (v.sources_observer ?? []) : carte.sources_observer,
    consulter: v.consulter ?? carte.consulter,
    sources_consulter: v.consulter ? (v.sources_consulter ?? []) : carte.sources_consulter,
  };
}

export type SourceRef = { titre: string; auteur: string | null; lien: string | null };

export type ContenuSignaux = DonneesSignaux & {
  /** Références des sources publiques (numérotées à l'affichage, dépliées en bas). */
  sourcesRef: Record<string, SourceRef>;
  /** Une carte « hypothèse » par piste : sens, gestes pas à pas, à observer, quand consulter. */
  cartes: Record<string, Carte>;
  /** Variantes de cartes par tranche d'âge (voir carteAgee). */
  cartesParAge: Record<string, VarianteCarte[]>;
  /** Catégories dans l'ordre du classeur, libellé sans le numéro (« Regard et visage »). */
  categories: { id: string; titre: string }[];
  phrases: Record<string, string>;
};

const source = brut as unknown as {
  pistes: DonneesSignaux["pistes"];
  options: (OptionSignal & Record<string, unknown>)[];
  alertes: DonneesSignaux["alertes"];
  etapes: (DonneesSignaux["etapes"][number] & { sources?: string | null })[];
  sources_reference: Record<string, SourceRef>;
  cartes: Record<string, Record<string, unknown>>;
  cartes_par_age?: Record<string, Record<string, unknown>[]>;
  messages: DonneesSignaux["messages"];
  confiance: DonneesSignaux["confiance"];
};

export function getContenuSignaux(): ContenuSignaux {
  const options: OptionSignal[] = source.options.map((o) => ({
    id: o.id,
    categorie: o.categorie,
    question: nettoyerTexte(o.question),
    reponse: o.reponse, // texte exact : le moteur s'en sert (message pleurs intenses)
    age_min: o.age_min,
    age_max: o.age_max,
    type: o.type,
    points: o.points ?? {},
    sources: idsPublics(o.sources),
  }));

  const categories: { id: string; titre: string }[] = [];
  for (const o of options) {
    if (!categories.some((c) => c.id === o.categorie)) {
      categories.push({ id: o.categorie, titre: o.categorie.replace(/^\d+\.\s*/, "") });
    }
  }

  return {
    pistes: source.pistes.map((p) => ({
      code: p.code,
      nom: p.nom,
      libelle: p.libelle,
      action: nettoyerTexte(p.action),
    })),
    options,
    alertes: alertesAffichees(source.alertes).map((a) => ({
      situation: nettoyerTexte(a.situation),
      pourquoi: null,
      a_dire: nettoyerTexte(a.a_dire ?? ""),
      urgence: a.urgence,
      declencheurs: a.declencheurs ?? [],
      combinaison: a.combinaison ?? null,
      sources: idsPublics(a.sources),
    })),
    etapes: source.etapes.map((e) => ({ n: e.n, texte: nettoyerTexte(e.texte), sources: idsPublics(e.sources) })),
    cartes: Object.fromEntries(
      Object.entries(source.cartes ?? {}).map(([code, c]) => [
        code,
        {
          titre: String(c.titre),
          sens: nettoyerTexte(String(c.sens)),
          sources_sens: idsPublics(c.sources_sens),
          gestes: ((c.gestes as string[]) ?? []).map((g) => nettoyerTexte(g)),
          sources_gestes: idsPublics(c.sources_gestes),
          observer: c.observer ? nettoyerTexte(String(c.observer)) : null,
          sources_observer: idsPublics(c.sources_observer),
          consulter: c.consulter ? nettoyerTexte(String(c.consulter)) : null,
          sources_consulter: idsPublics(c.sources_consulter),
        },
      ]),
    ),
    cartesParAge: Object.fromEntries(
      Object.entries(source.cartes_par_age ?? {}).map(([code, liste]) => [
        code,
        liste.map((c) => ({
          age_min: Number(c.age_min),
          age_max: Number(c.age_max),
          sens: c.sens ? nettoyerTexte(String(c.sens)) : undefined,
          sources_sens: idsPublics(c.sources_sens),
          gestes: c.gestes ? (c.gestes as string[]).map((g) => nettoyerTexte(g)) : undefined,
          sources_gestes: idsPublics(c.sources_gestes),
          observer: c.observer ? nettoyerTexte(String(c.observer)) : undefined,
          sources_observer: idsPublics(c.sources_observer),
          consulter: c.consulter ? nettoyerTexte(String(c.consulter)) : undefined,
          sources_consulter: idsPublics(c.sources_consulter),
        })),
      ]),
    ),
    sourcesRef: Object.fromEntries(
      Object.entries(source.sources_reference ?? {}).filter(([id]) => !SOURCES_INTERNES.has(id)),
    ),
    messages: source.messages.map((m) => ({ id: m.id, texte: nettoyerTexte(m.texte), quand: "" })),
    confiance: source.confiance.map((c) => ({ quand: "", texte: c.texte })),
    categories,
    phrases: PHRASES_PISTES,
  };
}

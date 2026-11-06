// ----------------------------------------------------------------------------
// « Que me dit bébé ? » : préparation du contenu côté serveur (05/11/2026).
//
// Lit content/signaux-bebe/signaux_bebe_v2.json (questionnaire « pleurs » court, 06/11/2026 ; l'original signaux_bebe.json est gardé pour un questionnaire sommeil ; généré depuis le classeur par
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
  IN: "Quelque chose le gêne peut-être (couche, chaleur, vêtement…)",
  SA: "Il dort peut-être d'un sommeil agité",
};

/** Sources qui ne s'affichent jamais (formation, cartes éditoriales, vérifications internes). */
const SOURCES_INTERNES = new Set(["S13", "S14", "S19", "S24", "S27", "S29"]);
const idsPublics = (brut: unknown): string[] =>
  (Array.isArray(brut) ? brut.map(String) : String(brut ?? "").split(","))
    .map((x) => x.trim())
    .filter((x) => /^S\d+$/.test(x) && !SOURCES_INTERNES.has(x));

export type SourceRef = { titre: string; auteur: string | null; lien: string | null };

export type ContenuSignaux = DonneesSignaux & {
  /** Références des sources publiques (numérotées à l'affichage, dépliées en bas). */
  sourcesRef: Record<string, SourceRef>;
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
      observer: p.observer ? nettoyerTexte(p.observer) : null,
      consulter: p.consulter ? nettoyerTexte(p.consulter) : null,
      sources: idsPublics((p as unknown as { sources_conseils?: string }).sources_conseils),
    })),
    options,
    alertes: alertesAffichees(source.alertes).map((a) => ({
      situation: nettoyerTexte(a.situation),
      pourquoi: null,
      a_dire: nettoyerTexte(a.a_dire ?? ""),
      urgence: a.urgence,
      declencheurs: a.declencheurs ?? [],
      sources: idsPublics(a.sources),
    })),
    etapes: source.etapes.map((e) => ({ n: e.n, texte: nettoyerTexte(e.texte), sources: idsPublics(e.sources) })),
    sourcesRef: Object.fromEntries(
      Object.entries(source.sources_reference ?? {}).filter(([id]) => !SOURCES_INTERNES.has(id)),
    ),
    messages: source.messages.map((m) => ({ id: m.id, texte: nettoyerTexte(m.texte), quand: "" })),
    confiance: source.confiance.map((c) => ({ quand: "", texte: c.texte })),
    categories,
    phrases: PHRASES_PISTES,
  };
}

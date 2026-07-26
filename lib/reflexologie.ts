// lib/reflexologie.ts
// ===========================================================================
// Couche données de l'onglet « Réflexologie plantaire » (remplace « Jeux »).
//
// Contrairement aux 6 modules mensuels, ces protocoles ne dépendent PAS du mois
// de bébé : c'est une bibliothèque fixe, la même pour tout le monde. Ils sont
// donc lus directement depuis /reflexologie/*.json (embarqués au build via des
// imports statiques — la voie fiable pour que Vercel les inclue), et non depuis
// la table Supabase `content`.
//
// ⚠️ Le module `reflexo` déjà présent en base est AUTRE CHOSE : ce sont les
// sections réflexo extraites de Coucher/Soin/Jeux pour les épingles. On n'y
// touche pas.
//
// Règle des consignes : ne jamais coder en dur la liste affichée — on filtre
// sur le champ `lancement`. Un protocole qui passe à `true` apparaît tout seul.
//
// ➕ Ajouter un protocole = déposer le JSON dans /reflexologie ET l'ajouter à
// PROTOCOLES ci-dessous (imports statiques obligatoires pour le bundling). Le
// reste (ordre, visibilité) est piloté par les données, pas par le code.
// ===========================================================================

import indexJson from "@/reflexologie/protocoles-index.json";
import accueilJson from "@/reflexologie/accueil-onglet-reflexologie.json";
import ouvertureJson from "@/reflexologie/_ouverture-commune.json";
import catalogueJson from "@/reflexologie/zones-mouvements.json";

import accueilNouveauNe from "@/reflexologie/protocole-accueil-nouveau-ne.json";
import agitationConcentration from "@/reflexologie/protocole-agitation-concentration.json";
import allergies from "@/reflexologie/protocole-allergies.json";
import anxieteNervosite from "@/reflexologie/protocole-anxiete-nervosite.json";
import bronchiteAsthme from "@/reflexologie/protocole-bronchite-asthme.json";
import cesarienne from "@/reflexologie/protocole-cesarienne.json";
import chutes from "@/reflexologie/protocole-chutes.json";
import coliques from "@/reflexologie/protocole-coliques.json";
import confianceEnSoi from "@/reflexologie/protocole-confiance-en-soi.json";
import constipation from "@/reflexologie/protocole-constipation.json";
import dents from "@/reflexologie/protocole-dents.json";
import diarrhee from "@/reflexologie/protocole-diarrhee.json";
import difficultesATeter from "@/reflexologie/protocole-difficultes-a-teter.json";
import eczema from "@/reflexologie/protocole-eczema.json";
import enuresie from "@/reflexologie/protocole-enuresie.json";
import frustrationMotrice from "@/reflexologie/protocole-frustration-motrice.json";
import ictere from "@/reflexologie/protocole-ictere.json";
import inconfortDigestif from "@/reflexologie/protocole-inconfort-digestif.json";
import jalousieFratrie from "@/reflexologie/protocole-jalousie-fratrie.json";
import malDesTransports from "@/reflexologie/protocole-mal-des-transports.json";
import meconium from "@/reflexologie/protocole-meconium.json";
import oppositionFrustration from "@/reflexologie/protocole-opposition-frustration.json";
import prematurite from "@/reflexologie/protocole-prematurite.json";
import reflux from "@/reflexologie/protocole-reflux.json";
import rhumeOtite from "@/reflexologie/protocole-rhume-otite.json";
import separation from "@/reflexologie/protocole-separation.json";
import sommeil from "@/reflexologie/protocole-sommeil.json";

// --- Types -----------------------------------------------------------------

export type ReflexoZone = {
  zone: string;
  designation: string;
  mouvement: string;
  description_mouvement: string;
  /** Sens du geste (certaines zones se jouent en sens inverse). Détail d'animation. */
  sens?: string;
};

export type ReflexoEtape = {
  ordre: number;
  designation: string;
  intention: string;
  /** Absent quand l'étape est `hors_pied`. */
  zones?: ReflexoZone[];
  /** Deux zones jouées l'une après l'autre (bassin, digestif, dents, nez-oreilles). */
  gestes_enchaines?: boolean;
  /** Étape sans animation : juste le texte. */
  hors_pied?: boolean;
  note?: string;
};

export type ReflexoVariante = {
  condition: string;
  /** La variante n'est proposée qu'à partir de cet âge (en mois). */
  age_min_mois?: number;
  ajout?: ReflexoZone[];
  texte: string;
};

export type ReflexoProtocole = {
  id: string;
  titre: string;
  categorie_guide_moi?: string;
  lien_pathologie?: boolean;
  /** À qui/quoi s'applique le protocole (ex. « bébé né d'une césarienne »). */
  s_applique?: string;
  /**
   * Carte récapitulative des zones (image des pieds numérotés). Valeur telle
   * qu'écrite dans le JSON : « visuels-protocoles/Visuel - <titre>.png ».
   * Convertie en URL servable par `visuelUrl()`.
   */
  visuel?: string;
  intro: string;
  emotion?: string;
  ouverture: { titre: string; etapes: string[] };
  sequence: ReflexoEtape[];
  variante?: ReflexoVariante;
  /** Ligne de sécurité mise en avant (ex. diarrhée infectieuse → avis médical). */
  vigilance?: string;
  note_fin: string;
  disclaimer: string;
  lancement: boolean;
  /** Termes prudents obligatoires : accompagner / apaiser, jamais soigner. */
  sujet_sensible?: boolean;
  raison_report?: string;
  /** Notes internes de rédaction — jamais affichées au parent. */
  notes?: string[];
};

/**
 * « Avant de commencer » — bloc COMMUN à tous les protocoles, réécrit en version
 * courte (libellé en gras + phrase brève). Source unique : _ouverture-commune.json.
 * (Les protocoles portent encore un `ouverture` historique plus long : on ne
 * l'utilise plus, la version commune fait foi — cf. consignes §4.3.)
 */
export type ReflexoOuvertureCommune = {
  titre: string;
  etapes: { gras: string; texte: string }[];
};

export const ouvertureCommune = ouvertureJson as ReflexoOuvertureCommune;

export type ReflexoAccueil = {
  titre: string;
  sous_titre: string;
  presentation: string[];
  precautions_titre: string;
  precautions: { cle: string; texte: string }[];
  note_fin?: string; // retiré du JSON — affiché seulement s'il existe
  disclaimer: string;
};

export const accueilReflexo = accueilJson as unknown as ReflexoAccueil;

/** Entrée de la liste affichée dans l'onglet. */
export type ReflexoListItem = {
  id: string;
  titre: string;
  accroche: string;
  sujet_sensible: boolean;
  categorie_guide_moi?: string;
  nb_etapes: number;
};

// --- Sources ---------------------------------------------------------------

// Tous les protocoles présents sur disque, publiés ou non. Le filtrage se fait
// plus bas sur `lancement`, jamais sur cette liste.
const PROTOCOLES = [
  accueilNouveauNe,
  agitationConcentration,
  allergies,
  anxieteNervosite,
  bronchiteAsthme,
  cesarienne,
  chutes,
  coliques,
  confianceEnSoi,
  constipation,
  dents,
  diarrhee,
  difficultesATeter,
  eczema,
  enuresie,
  frustrationMotrice,
  ictere,
  inconfortDigestif,
  jalousieFratrie,
  malDesTransports,
  meconium,
  oppositionFrustration,
  prematurite,
  reflux,
  rhumeOtite,
  separation,
  sommeil,
] as unknown as ReflexoProtocole[];

const PAR_ID = new Map(PROTOCOLES.map((p) => [p.id, p]));

// L'index porte l'ordre d'affichage voulu (et non l'ordre alphabétique des
// fichiers) : on s'en sert comme référence de tri.
const ORDRE_LANCEMENT: string[] = indexJson.lancement;
const ORDRE_REPORTES: string[] = (indexJson as { reportes?: string[] }).reportes ?? [];

// ⚠️ TEMPORAIRE (demande Laura) : afficher TOUS les protocoles, publiés ET
// reportés, le temps de la relecture. Repasser à `false` pour ne montrer que
// les protocoles `lancement === true` (comportement cible + futur filtre par âge).
const TOUT_VISIBLE = true;
// Ordre d'affichage quand tout est visible : lancement d'abord, puis reportés.
const ORDRE_AFFICHAGE = [...ORDRE_LANCEMENT, ...ORDRE_REPORTES];


// --- Accès -----------------------------------------------------------------

/** Première phrase de l'intro — sert d'accroche courte dans la liste. */
function accrocheDepuisIntro(intro: string): string {
  const premiere = intro.split(/(?<=\.)\s/)[0]?.trim() ?? intro;
  return premiere.length > 130 ? `${premiere.slice(0, 127).trimEnd()}…` : premiere;
}

/**
 * Les protocoles publiés (`lancement === true`), dans l'ordre de l'index.
 * Un protocole publié mais absent de l'index est ajouté à la fin plutôt
 * qu'ignoré silencieusement.
 */
export function getProtocolesPublies(): ReflexoListItem[] {
  const ordre = TOUT_VISIBLE ? ORDRE_AFFICHAGE : ORDRE_LANCEMENT;
  const visibles = PROTOCOLES.filter((p) => TOUT_VISIBLE || p.lancement === true);
  const rang = (id: string) => {
    const i = ordre.indexOf(id);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return visibles
    .sort((a, b) => rang(a.id) - rang(b.id) || a.titre.localeCompare(b.titre, "fr"))
    .map((p) => ({
      id: p.id,
      titre: p.titre,
      accroche: accrocheDepuisIntro(p.intro),
      sujet_sensible: p.sujet_sensible === true,
      categorie_guide_moi: p.categorie_guide_moi,
      nb_etapes: p.sequence.length,
    }));
}

/** Un protocole. Renvoie null si inconnu (ou non publié, hors mode TOUT_VISIBLE). */
export function getProtocole(id: string): ReflexoProtocole | null {
  const p = PAR_ID.get(id);
  if (!p || (!TOUT_VISIBLE && p.lancement !== true)) return null;
  return p;
}

/** Ids des protocoles publiés — pour `generateStaticParams`. */
export function getIdsPublies(): string[] {
  return getProtocolesPublies().map((p) => p.id);
}

// --- Lecteur animé ---------------------------------------------------------

// Catalogue des 37 zones : id de zone → ids des éléments SVG (`cibles`) à
// animer. C'est le pont entre une étape de protocole (qui cite une `zone`) et
// l'illustration des pieds (qui porte les `id` SVG).
const CATALOGUE_CIBLES = new Map<string, string[]>(
  (catalogueJson.zones as { id: string; cibles?: string[] }[]).map((z) => [
    z.id,
    z.cibles ?? [],
  ]),
);

/**
 * Une étape telle que la consomme le lecteur animé paysage : le texte synchronisé
 * (nom parent, intention, description du geste) + les `id` SVG à mettre en avant.
 */
export type ReflexoAnimStep = {
  ordre: number;
  designation: string;
  intention: string;
  /** Description du mouvement (1re zone de l'étape). */
  desc: string;
  mouvement: string | null;
  /** Étape hors pied : aucune zone à animer, texte seul. */
  horsPied: boolean;
  /** Ids d'éléments SVG à révéler/animer (plusieurs si gestes enchaînés). */
  cibles: string[];
};

/** Convertit la séquence d'un protocole en étapes prêtes pour le lecteur animé. */
export function getStepsAnimation(protocole: ReflexoProtocole): ReflexoAnimStep[] {
  return protocole.sequence.map((e) => {
    const zones = e.zones ?? [];
    const cibles = zones.flatMap((z) => CATALOGUE_CIBLES.get(z.zone) ?? []);
    return {
      ordre: e.ordre,
      designation: e.designation,
      intention: e.intention,
      desc: zones[0]?.description_mouvement ?? "",
      mouvement: zones[0]?.mouvement ?? null,
      horsPied: e.hors_pied === true,
      cibles,
    };
  });
}

/**
 * URL servable de la carte récapitulative d'un protocole.
 *
 * Le champ `visuel` du JSON vaut « visuels-protocoles/Visuel - <titre>.png ».
 * Les images sont copiées dans `public/reflexologie/visuels/` (source de
 * vérité : `reflexologie/visuels-protocoles/`, cf. scripts/sync-reflexo-visuels.mjs).
 * On garde le nom de fichier tel quel (espaces/accents) et on l'encode pour l'URL.
 */
export function visuelUrl(visuel: string | undefined): string | null {
  if (!visuel) return null;
  const fichier = visuel.split("/").pop();
  if (!fichier) return null;
  return `/reflexologie/visuels/${encodeURIComponent(fichier)}`;
}

/**
 * La variante n'est proposée que si l'âge de bébé atteint `age_min_mois`
 * (ex. cauchemars à partir de 12 mois). Sans contrainte d'âge, elle est
 * toujours proposée.
 */
export function varianteVisible(
  variante: ReflexoVariante | undefined,
  moisBebe: number,
): boolean {
  if (!variante) return false;
  if (typeof variante.age_min_mois !== "number") return true;
  return moisBebe >= variante.age_min_mois;
}

/**
 * Relais depuis Guide-moi : le protocole correspondant à une catégorie du mois,
 * s'il existe et s'il est publié. La correspondance se fait sur
 * `categorie_guide_moi` (comparaison insensible à la casse et aux accents).
 */
export function getProtocolePourCategorieGuide(
  categorie: string,
): ReflexoListItem | null {
  // RegExp construit depuis une chaîne échappée (diacritiques combinants) pour
  // éviter le flag Unicode `u`, indisponible sans cible ES6.
  const diacritiques = new RegExp("[\\u0300-\\u036f]", "g");
  const norm = (s: string) =>
    s.normalize("NFD").replace(diacritiques, "").toLowerCase().trim();
  const cible = norm(categorie);
  return (
    getProtocolesPublies().find(
      (p) => p.categorie_guide_moi && norm(p.categorie_guide_moi) === cible,
    ) ?? null
  );
}

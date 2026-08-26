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
// PROTOCOLES_SUR_DISQUE ci-dessous (imports statiques obligatoires pour le
// bundling). Le reste (ordre, visibilité) est piloté par les données.
//
// ➖ Retirer un protocole de l'app sans supprimer le fichier : ajouter son id à
// `retires_deontologie` dans protocoles-index.json (cf. RETIRES_DEONTOLOGIE).
// ===========================================================================

import indexJson from "@/reflexologie/protocoles-index.json";
import accueilJson from "@/reflexologie/accueil-onglet-reflexologie.json";
import ouvertureJson from "@/reflexologie/_ouverture-commune.json";
import catalogueJson from "@/reflexologie/zones-mouvements.json";
import iconesJson from "@/reflexologie/icones-protocoles.json";
import dureesJson from "@/reflexologie/durees-protocoles.json";

import accueilNouveauNe from "@/reflexologie/protocole-accueil-nouveau-ne.json";
import agitationConcentration from "@/reflexologie/protocole-agitation-concentration.json";
import allergies from "@/reflexologie/protocole-allergies.json";
import anxieteNervosite from "@/reflexologie/protocole-anxiete-nervosite.json";
import bronchiteAsthme from "@/reflexologie/protocole-bronchite-asthme.json";
import cesarienne from "@/reflexologie/protocole-cesarienne.json";
import coliques from "@/reflexologie/protocole-coliques.json";
import confianceEnSoi from "@/reflexologie/protocole-confiance-en-soi.json";
import constipation from "@/reflexologie/protocole-constipation.json";
import dents from "@/reflexologie/protocole-dents.json";
import diarrhee from "@/reflexologie/protocole-diarrhee.json";
import difficultesATeter from "@/reflexologie/protocole-difficultes-a-teter.json";
import eczema from "@/reflexologie/protocole-eczema.json";
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
  /**
   * Le « pourquoi » de CETTE zone dans CE protocole — la phrase à montrer au
   * parent. Laura a tranché protocole par protocole entre la version physio
   * et la version énergétique du catalogue, ou écrit une phrase sur-mesure :
   * au sein d'un protocole, c'est ce champ qui prime (consignes §4).
   */
  phrase?: string;
  /** Provenance de `phrase` : Physio | Énergie | sur-mesure. Suivi interne. */
  choix?: string;
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
  /** Étapes AJOUTÉES à la séquence (même forme qu'une étape normale). */
  ajout?: ReflexoEtape[];
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
  /** Carte récapitulative de la VARIANTE (ex. « Sommeil (avec cauchemars) »). */
  visuel_cauchemars?: string;
  intro: string;
  /**
   * Sous-titre COURT affiché sous le titre dans la liste (page 1) : un verbe en
   * tête, 12 mots maximum. Écrit à la main dans le JSON. Sans lui, on retombe
   * sur la première phrase de `intro` (ancien comportement).
   */
  accroche?: string;
  ouverture: { titre: string; etapes: string[] };
  sequence: ReflexoEtape[];
  variante?: ReflexoVariante;
  /** Ligne de sécurité mise en avant (ex. diarrhée infectieuse → avis médical). */
  vigilance?: string;
  note_fin: string;
  /** Rappel commun de fin de fiche : la régularité prime sur la performance. */
  regularite?: string;
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
  /**
   * Le NUMÉRO DE SLOT du protocole : sa position dans l'ordre de l'index,
   * indépendante de ce qui est affiché à l'écran. C'est lui qui donne sa
   * couleur, via `slotReflexo()`.
   *
   * ⚠️ Surtout pas l'index de la boucle d'affichage. Quand les protocoles
   * seront dispatchés par mois, la liste n'en montrera qu'un sous-ensemble et
   * son index repartirait de 0, alors que la fiche garderait le rang global :
   * la carte et la fiche donneraient deux couleurs différentes au même
   * protocole. Un seul numéro, calculé ici, sert aux deux écrans.
   */
  rang: number;
};

// --- Sources ---------------------------------------------------------------

// Tous les protocoles présents sur disque, publiés ou non. Le filtrage se fait
// plus bas sur `lancement`, jamais sur cette liste.
const PROTOCOLES_SUR_DISQUE = [
  accueilNouveauNe,
  agitationConcentration,
  allergies,
  anxieteNervosite,
  bronchiteAsthme,
  cesarienne,
  coliques,
  confianceEnSoi,
  constipation,
  dents,
  diarrhee,
  difficultesATeter,
  eczema,
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

/**
 * Protocoles RETIRÉS de l'app pour raison déontologique : ce sont des sujets
 * pathologiques (bronchite/asthme, eczéma, allergies, ictère, méconium) qu'un
 * praticien en réflexologie ne peut pas prétendre accompagner. Ils ne doivent
 * apparaître NULLE PART — ni liste, ni recherche, ni page directe (404).
 *
 * La liste vit dans protocoles-index.json (`retires_deontologie`), jamais en
 * dur ici : en retirer un id suffit à le faire réapparaître.
 */
const RETIRES_DEONTOLOGIE = new Set<string>(
  (indexJson as { retires_deontologie?: string[] }).retires_deontologie ?? [],
);

/** Ce que l'app connaît vraiment : le disque MOINS les retraits déontologiques. */
const PROTOCOLES = PROTOCOLES_SUR_DISQUE.filter((p) => !RETIRES_DEONTOLOGIE.has(p.id));

const PAR_ID = new Map(PROTOCOLES.map((p) => [p.id, p]));

// L'index porte l'ordre d'affichage voulu (et non l'ordre alphabétique des
// fichiers) : on s'en sert comme référence de tri.
const ORDRE_LANCEMENT: string[] = indexJson.lancement.filter(
  (id) => !RETIRES_DEONTOLOGIE.has(id),
);
const ORDRE_REPORTES: string[] = (
  (indexJson as { reportes?: string[] }).reportes ?? []
).filter((id) => !RETIRES_DEONTOLOGIE.has(id));

// ⚠️ TEMPORAIRE (demande Laura) : afficher TOUS les protocoles, publiés ET
// reportés, le temps de la relecture. Repasser à `false` pour ne montrer que
// les protocoles `lancement === true` (comportement cible + futur filtre par âge).
const TOUT_VISIBLE = true;
// Ordre d'affichage quand tout est visible : lancement d'abord, puis reportés.
const ORDRE_AFFICHAGE = [...ORDRE_LANCEMENT, ...ORDRE_REPORTES];


// --- Accès -----------------------------------------------------------------

/** Repli : première phrase de l'intro, quand le JSON n'a pas d'`accroche`. */
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
    .map((p, rang) => ({
      id: p.id,
      titre: p.titre,
      accroche: p.accroche?.trim() || accrocheDepuisIntro(p.intro),
      sujet_sensible: p.sujet_sensible === true,
      categorie_guide_moi: p.categorie_guide_moi,
      nb_etapes: p.sequence.length,
      rang,
    }));
}

/** Un protocole. Renvoie null si inconnu (ou non publié, hors mode TOUT_VISIBLE). */
export function getProtocole(id: string): ReflexoProtocole | null {
  const p = PAR_ID.get(id);
  if (!p || (!TOUT_VISIBLE && p.lancement !== true)) return null;
  return p;
}

/**
 * La durée totale de la lecture animée d'un protocole, en millisecondes, ou
 * `undefined` si elle n'a pas encore été mesurée (le bouton n'annonce alors
 * aucune durée plutôt qu'une durée fausse).
 *
 * Ces valeurs sortent du moteur d'animation lui-même : elles dépendent de la
 * géométrie réelle des zones (longueur des médianes, nombre de points d'appui,
 * nombre d'orteils), qu'aucun calcul « à côté » ne saurait reproduire sans
 * dériver. Régénération : `npm run dev`, puis /dev-durees-reflexo.
 */
export function getDureeAnimation(
  id: string,
  { avecVariante = false }: { avecVariante?: boolean } = {},
): number | undefined {
  const cle = avecVariante ? `${id}+variante` : id;
  return (dureesJson.durees as Record<string, number>)[cle] || undefined;
}

/**
 * Le rang d'un protocole dans la liste affichée, ou -1 s'il n'y figure pas.
 * Sert à retrouver SA couleur : la gamme est attribuée par position, donc la
 * fiche doit reprendre la teinte de la ligne sur laquelle le parent a tapé.
 */
export function getRangProtocole(id: string): number {
  return getProtocolesPublies().findIndex((p) => p.id === id);
}

/** Ids des protocoles publiés — pour `generateStaticParams`. */
export function getIdsPublies(): string[] {
  return getProtocolesPublies().map((p) => p.id);
}

/**
 * Icône d'un protocole : les tracés extraits du SVG dessiné par Laura
 * (reflexologie/visuels-icones/icone-<id>.svg → icones-protocoles.json, généré
 * par scripts/sync-reflexo-visuels.mjs). Aucune couleur : l'icône prend celle
 * du texte qui l'entoure.
 */
export type ReflexoIconeData = { viewBox: string; traces: string[] };

const ICONES = (iconesJson as { icones: Record<string, ReflexoIconeData> }).icones;

/** L'icône du protocole `id`, ou null si elle n'est pas encore dessinée. */
export function getIconeProtocole(id: string): ReflexoIconeData | null {
  const i = ICONES[id];
  return i && i.traces.length > 0 ? i : null;
}

// --- Lecteur animé ---------------------------------------------------------

/**
 * Une zone du catalogue `zones-mouvements.json` (41 zones), côté TEXTE.
 * C'est le pont entre une étape de protocole (qui cite une `zone`) et
 * l'illustration des pieds (qui porte les `id` SVG).
 */
export type ReflexoZoneCatalogue = {
  id: string;
  designation: string;
  /** Ids d'éléments SVG à révéler/animer. */
  cibles: string[];
  /** Le geste, en une ligne : « Pression glissée, 3 répétitions. » */
  geste_court: string;
  /** Bibliothèque de référence — le protocole a déjà tranché via `zone.phrase`. */
  phrase_physio: string;
  phrase_energie: string;
  /**
   * Cas contre-intuitif à signaler au parent : les dents se travaillent sur le
   * DESSUS du pied, pas sous la plante. Présent seulement sur ces zones-là.
   */
  emplacement?: string;
  mise_en_avant?: boolean;
};

const CATALOGUE = new Map<string, ReflexoZoneCatalogue>(
  (
    catalogueJson.zones as {
      id: string;
      designation?: string;
      cibles?: string[];
      geste_court?: string;
      phrase_physio?: string;
      phrase_energie?: string;
      emplacement?: string;
      mise_en_avant?: boolean;
    }[]
  ).map((z) => [
    z.id,
    {
      id: z.id,
      designation: z.designation ?? "",
      cibles: z.cibles ?? [],
      geste_court: z.geste_court ?? "",
      phrase_physio: z.phrase_physio ?? "",
      phrase_energie: z.phrase_energie ?? "",
      emplacement: z.emplacement,
      mise_en_avant: z.mise_en_avant,
    },
  ]),
);

/** La fiche catalogue d'une zone (textes + cibles SVG), ou null si inconnue. */
export function getZoneCatalogue(id: string): ReflexoZoneCatalogue | null {
  return CATALOGUE.get(id) ?? null;
}

/**
 * Les trois lignes à montrer au parent pour une zone d'un protocole :
 * son nom, le geste (catalogue) et le pourquoi (`phrase` du protocole, qui
 * prime toujours sur les phrases génériques du catalogue).
 * `emplacement` n'est renseigné que pour les zones contre-intuitives (dents).
 */
export type ReflexoZoneTexte = {
  designation: string;
  geste: string;
  phrase: string;
  emplacement?: string;
};

export function texteZone(z: ReflexoZone): ReflexoZoneTexte {
  const c = CATALOGUE.get(z.zone);
  return {
    designation: z.designation || c?.designation || z.zone,
    // Le catalogue fait foi pour le geste ; la description longue du protocole
    // sert de filet si `geste_court` venait à manquer.
    geste: c?.geste_court || z.description_mouvement || "",
    phrase: z.phrase ?? "",
    emplacement: c?.mise_en_avant ? c.emplacement : undefined,
  };
}

/**
 * Une étape telle que la consomme le lecteur animé paysage : le texte synchronisé
 * (nom parent, intention, description du geste) + les `id` SVG à mettre en avant.
 */
export type ReflexoAnimStep = {
  ordre: number;
  designation: string;
  intention: string;
  /** Le geste, en une ligne (1re zone de l'étape) — `geste_court` du catalogue. */
  desc: string;
  /**
   * Une ligne par zone de l'étape : nom, geste, pourquoi. Les étapes à gestes
   * enchaînés (bassin, dents, cardia/pylore) en ont deux — le lecteur les
   * affiche toutes les deux, dans l'ordre où elles se jouent.
   */
  zonesTexte: ReflexoZoneTexte[];
  /**
   * Consigne d'emplacement contre-intuitive à mettre en avant (les dents se
   * travaillent SUR LE DESSUS du pied). Absente pour toutes les autres zones.
   */
  emplacement?: string;
  mouvement: string | null;
  /** Étape hors pied : aucune zone à animer, texte seul. */
  horsPied: boolean;
  /** Ids d'éléments SVG à révéler/animer (à plat, toutes zones confondues). */
  cibles: string[];
  /**
   * Un groupe = les cibles d'UNE zone du protocole. Quand `gestesEnchaines` est
   * vrai, les groupes se jouent l'un APRÈS l'autre (ex. bassin : d'abord la
   * spirale, puis le glissé de l'ancrage), jamais en même temps. Cf. §8.
   */
  groupes: string[][];
  gestesEnchaines: boolean;
  /**
   * Mouvement joué À L'ENVERS (`sens: "inverse"` dans le protocole, ex. Diarrhée) :
   * trajectoire parcourue depuis la fin ; pour le gros intestin enchaîné, ordre
   * des pieds inversé (gauche d'abord, puis droit). Cf. consignes §14ter.
   */
  inverse: boolean;
};

/**
 * Convertit la séquence d'un protocole en étapes prêtes pour le lecteur animé.
 * `avecVariante` ajoute à la suite les étapes de la variante (ex. Sommeil
 * « avec cauchemars » : la vésicule en 9e) — c'est la version que montre la
 * carte récapitulative de la variante.
 */
export function getStepsAnimation(
  protocole: ReflexoProtocole,
  { avecVariante = false }: { avecVariante?: boolean } = {},
): ReflexoAnimStep[] {
  const sequence = avecVariante
    ? [...protocole.sequence, ...(protocole.variante?.ajout ?? [])]
    : protocole.sequence;
  return sequence.map((e) => {
    const zones = e.zones ?? [];
    const groupes = zones
      .map((z) => CATALOGUE.get(z.zone)?.cibles ?? [])
      .filter((g) => g.length > 0);
    const zonesTexte = zones.map(texteZone);
    return {
      ordre: e.ordre,
      designation: e.designation,
      // Le « pourquoi » : la phrase de la 1re zone si elle existe (elle prime),
      // sinon l'intention historique de l'étape.
      intention: zonesTexte[0]?.phrase || e.intention,
      desc: zonesTexte[0]?.geste ?? "",
      zonesTexte,
      emplacement: zonesTexte.find((z) => z.emplacement)?.emplacement,
      mouvement: zones[0]?.mouvement ?? null,
      horsPied: e.hors_pied === true,
      cibles: groupes.flat(),
      groupes,
      gestesEnchaines: e.gestes_enchaines === true,
      inverse: zones.some((z) => (z as { sens?: string }).sens === "inverse"),
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

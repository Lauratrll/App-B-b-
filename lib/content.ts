import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

// =========================================================================
// Cache stratégie
// =========================================================================
// Le contenu (table `content`) ne change qu'après `npm run import-content`.
// On utilise unstable_cache avec :
//   - revalidate: 3600 (1h) — fallback si le revalidate explicite n'arrive pas
//   - tags: ['content'] — invalidation manuelle via /api/revalidate-content
// On utilise createAdminClient (service_role) car unstable_cache ne supporte
// pas les fonctions qui lisent les cookies. La sécurité d'accès est assurée
// en amont par le layout (auth) — chaque page protégée appelle requireUser
// avant d'arriver ici.
// =========================================================================

const CACHE_OPTIONS = {
  revalidate: 3600,
  tags: ["content"] as string[],
};

// =========================================================================
// Types
// =========================================================================

export type CategorieGuide = {
  id: string;
  nom: string;
  sous_titre: string;
  icone: string;
};

export type GuideMeta = {
  mois: number;
  tranche_age?: string;
  rubrique?: string;
  titre_rubrique?: string;
  sous_titre?: string;
  description?: string;
  ancrage?: string;
  categories: CategorieGuide[];
};

export type BlocActionne = {
  couleur_fond: string;
  couleur_texte: string;
  titre: string;
  etapes: string[];
};

export type ProtocoleGuide = {
  categorie: string;
  situation: string;
  titre: string;
  explication: string;
  ancrage: string;
  action_immediate: BlocActionne;
  geste_doux: BlocActionne;
  pour_aller_plus_loin: string[];
  principe: string;
  erreurs_a_eviter: string[];
  consulter_si: string;
};

export type SituationListItem = {
  id: string;
  ordre: number;
  categorie: string;
  situation: string;
  titre: string;
};

export type RituelEtape = {
  etape: number;
  titre: string;
  horaire?: string;
  duree?: string;
  description: string;
};

export type ReflexologieEtape = {
  zone: string;
  duree: string;
  geste: string;
  ce_que_cest?: string;
};

export type CoucherModule = {
  mois: number;
  tranche_age?: string;
  titre_rubrique?: string;
  sous_titre?: string;
  description?: string;
  reperes_cles?: string[];
  rituel_etapes?: RituelEtape[];
  reflexologie_du_coucher?: {
    titre: string;
    intro?: string;
    duree_totale?: string;
    pression?: string;
    etapes: ReflexologieEtape[];
  };
  script_audio_du_soir?: {
    titre: string;
    duree?: string;
    instruction?: string;
    texte: string;
  };
  signaux_de_fatigue?: string[];
  erreurs_a_eviter?: string[];
  consulter_si?: string;
};

export type ContentRow = {
  id: string;
  mois: number;
  module: string;
  categorie: string | null;
  situation: string | null;
  ordre: number;
  data: Record<string, unknown>;
};

// Schéma JSON Soin — nouvelle convention sémantique (M0, M1, M2…) :
//   promesse   = phrase qui incarne le travail (ex. "Décharger la tension…")
//   nom_outil  = étiquette canonique de l'outil (ex. "Auto-massage de réflexologie")
// Ancienne convention (M3, M6, M9, M14 — encore en transition) :
//   titre / sous_titre — conservés en fallback le temps de la migration.
export type ConseilSoin = {
  id: string;
  numero?: number;
  icone?: string;
  // Nouvelle convention
  promesse?: string;
  nom_outil?: string;
  // Ancienne convention (fallback)
  titre?: string;
  sous_titre?: string;
  intro?: string;
  [key: string]: unknown;
};

// Métadonnées de la rubrique Soin pour un mois donné.
// Nouvelle convention :
//   nom_rubrique     = "Prendre soin de moi" (libellé canonique)
//   promesse_du_mois = phrase du thème, à afficher en grand sur l'accueil
//   theme_du_mois    = identique à promesse_du_mois, gardé pour analytics
//   intention_du_mois = texte long d'intro
// Ancienne convention :
//   titre_rubrique / sous_titre — conservés en fallback.
export type SoinMeta = {
  mois: number;
  // Nouvelle convention
  nom_rubrique?: string;
  promesse_du_mois?: string;
  theme_du_mois?: string;
  intention_du_mois?: string;
  // Ancienne convention (fallback)
  titre_rubrique?: string;
  sous_titre?: string;
  description?: string;
};

export type ConseilListItem = {
  id: string;
  ordre: number;
  // Affichés sur la carte :
  //   en grand : nom_outil ?? titre
  //   en petit : promesse  ?? sous_titre
  nom_outil?: string;
  promesse?: string;
  titre?: string;        // fallback
  sous_titre?: string;   // fallback
  icone?: string;
};

export type SaisonKey = "printemps" | "ete" | "automne" | "hiver";

export type SaisonVersion = {
  id?: string;
  titre?: string;
  ambiance?: string;
  couleur_theme?: string;
  couleur_accent?: string;
  emoji?: string;
  ancrage?: string;
  principes?: string[];
  habillage?: {
    principe?: string;
    guide_temperature?: Array<{ temperature: string; tenue: string }>;
  };
  sorties?: {
    frequence_conseillee?: string;
    moments_ideaux?: string[];
    lieux_recommandes?: string[];
    equipement?: string[];
  };
  diversification_de_saison?: {
    titre?: string;
    intro?: string;
    legumes_prioritaires?: string[];
    fruits_prioritaires?: string[];
    vigilance_allergies?: string;
  };
  particularites_sante?: {
    vigilance?: string[];
    signes_consultation?: string[];
    vitamine_d?: string;
    [key: string]: unknown;
  };
  alimentation_maman?: {
    titre?: string;
    elements?: string[];
  };
  [key: string]: unknown;
};

export type SaisonMeta = {
  mois: number;
  titre_rubrique?: string;
  sous_titre?: string;
  description?: string;
  logique_selection?: unknown;
};

export type ScriptAudio = {
  id: string;
  titre: string;
  duree_estimee?: string;
  contexte_ideal?: string;
  theme?: string;
  couleur?: string;
  couleur_texte?: string;
  intention?: string;
  preparation_parent?: string;
  texte: string;
};

export type AudioMeta = {
  mois: number;
  titre_rubrique?: string;
  sous_titre?: string;
  description?: string;
  ancrage?: string;
  trimestre?: string;
  comment_utiliser?: string[];
};

export type ScriptListItem = {
  id: string;
  ordre: number;
  titre: string;
  duree_estimee?: string;
  theme?: string;
  couleur?: string;
  couleur_texte?: string;
};

export type ActiviteType = "standard" | "socle" | "complementaire";

export type ActiviteJeu = {
  id: string;
  numero?: number;
  titre?: string;
  duree?: string;
  frequence?: string;
  developpe?: string[];
  materiel?: string[];
  description?: string;
  comment_jouer?: string[];
  nom?: string;
  pourquoi?: string;
  comment_faire?: string[];
  pour_le_co_parent?: string;
  variante?: string;
  ce_qui_marche_le_mieux?: string;
  alternative_si_il_deteste?: string;
  principe_pikler?: string;
  zones_speciales?: string[];
  [key: string]: unknown;
};

export type PrincipeFondamental = { titre: string; texte: string };

export type FenetreEveilCalme = {
  titre: string;
  intro?: string;
  signes_phase_propice?: string[];
  signes_phase_a_eviter?: string[];
  duree_eveil_max?: string;
};

export type ElementNonRecommande = {
  element: string;
  raison: string;
  alternative?: string;
};

export type ErreurJeu = string | { erreur: string; consequence: string };

export type JeuxMeta = {
  mois: number;
  titre_rubrique?: string;
  sous_titre?: string;
  description?: string;
  adjectif_du_mois?: string;
  qualification_du_mois?: string;
  principes_cles?: string[];
  geste_reflexo_du_mois?: {
    titre: string;
    intro?: string;
    duree?: string;
    moment?: string;
    etapes: string[];
    ce_que_ca_fait?: string;
  };
  rythme_journee_type?: {
    titre?: string;
    intro?: string;
    creneaux: Array<{ horaire: string; activite: string }>;
  };
  ancrage?: string;
  principes_fondamentaux?: PrincipeFondamental[];
  reperer_phase_eveil_calme?: FenetreEveilCalme;
  ce_qui_n_est_pas_recommande_a_cet_age?: {
    titre: string;
    intro?: string;
    elements: ElementNonRecommande[];
  };
  rythme_d_une_journee_d_eveil_type?: {
    titre: string;
    intro?: string;
    exemple: string[];
  };
  geste_reflexologie_du_mois?: {
    titre: string;
    intro?: string;
    comment_faire: string[];
    ce_qu_il_fait?: string;
  };
  erreurs_a_eviter?: ErreurJeu[];
  consulter_si?: string;
  phrases_ancrage?: string[];
  [key: string]: unknown;
};

export type ActiviteListItem = {
  id: string;
  ordre: number;
  titre: string;
  duree?: string;
  developpe?: string[];
  type: ActiviteType;
};

// =========================================================================
// Helpers de lecture — toutes wrappées avec unstable_cache
// =========================================================================

// ---- Guide-moi ! --------------------------------------------------------

export const getGuideMeta = unstable_cache(
  async (mois: number): Promise<GuideMeta | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("data")
      .eq("mois", mois)
      .eq("module", "guide")
      .eq("categorie", "_meta")
      .maybeSingle();
    if (error || !data) return null;
    return data.data as GuideMeta;
  },
  ["guide-meta"],
  CACHE_OPTIONS,
);

export const getGuideSituations = unstable_cache(
  async (mois: number, categorie: string): Promise<SituationListItem[]> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("id, ordre, categorie, situation, data")
      .eq("mois", mois)
      .eq("module", "guide")
      .eq("categorie", categorie)
      .order("ordre", { ascending: true });
    if (error || !data) return [];
    return data.map((row) => ({
      id: row.id as string,
      ordre: (row.ordre as number) ?? 0,
      categorie: row.categorie as string,
      situation: row.situation as string,
      titre:
        (row.data as { titre?: string })?.titre ?? (row.situation as string),
    }));
  },
  ["guide-situations"],
  CACHE_OPTIONS,
);

export const getGuideProtocole = unstable_cache(
  async (
    mois: number,
    categorie: string,
    ordre: number,
  ): Promise<{ contentId: string; protocole: ProtocoleGuide } | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("id, data")
      .eq("mois", mois)
      .eq("module", "guide")
      .eq("categorie", categorie)
      .eq("ordre", ordre)
      .maybeSingle();
    if (error || !data) return null;
    return {
      contentId: data.id as string,
      protocole: data.data as ProtocoleGuide,
    };
  },
  ["guide-protocole"],
  CACHE_OPTIONS,
);

// ---- Coucher -------------------------------------------------------------

export const getCoucher = unstable_cache(
  async (
    mois: number,
  ): Promise<{ contentId: string; coucher: CoucherModule } | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("id, data")
      .eq("mois", mois)
      .eq("module", "coucher")
      .eq("categorie", "_full")
      .maybeSingle();
    if (error || !data) return null;
    return {
      contentId: data.id as string,
      coucher: data.data as CoucherModule,
    };
  },
  ["coucher"],
  CACHE_OPTIONS,
);

// ---- Lookup par id (épingles) ------------------------------------------

export const getContentById = unstable_cache(
  async (id: string): Promise<ContentRow | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("id, mois, module, categorie, situation, ordre, data")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return data as ContentRow;
  },
  ["content-by-id"],
  CACHE_OPTIONS,
);

// ---- Soin ----------------------------------------------------------------

export const getSoinMeta = unstable_cache(
  async (mois: number): Promise<SoinMeta | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("data")
      .eq("mois", mois)
      .eq("module", "soin")
      .eq("categorie", "_meta")
      .maybeSingle();
    if (error || !data) return null;
    return data.data as SoinMeta;
  },
  ["soin-meta"],
  CACHE_OPTIONS,
);

export const getSoinConseils = unstable_cache(
  async (mois: number): Promise<ConseilListItem[]> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("ordre, situation, data")
      .eq("mois", mois)
      .eq("module", "soin")
      .eq("categorie", "conseil")
      .order("ordre", { ascending: true });
    if (error || !data) return [];
    return data.map((row) => {
      const d = row.data as ConseilSoin;
      return {
        id: row.situation as string,
        ordre: (row.ordre as number) ?? 0,
        // Nouvelle convention
        nom_outil: d.nom_outil,
        promesse: d.promesse,
        // Fallback ancienne convention
        titre: d.titre,
        sous_titre: d.sous_titre,
        icone: d.icone,
      };
    });
  },
  ["soin-conseils"],
  CACHE_OPTIONS,
);

export const getSoinConseil = unstable_cache(
  async (mois: number, id: string): Promise<ConseilSoin | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("data")
      .eq("mois", mois)
      .eq("module", "soin")
      .eq("situation", id)
      .maybeSingle();
    if (error || !data) return null;
    return data.data as ConseilSoin;
  },
  ["soin-conseil"],
  CACHE_OPTIONS,
);

// ---- Saison --------------------------------------------------------------

export const getSaisonMeta = unstable_cache(
  async (mois: number): Promise<SaisonMeta | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("data")
      .eq("mois", mois)
      .eq("module", "saison")
      .eq("categorie", "_meta")
      .maybeSingle();
    if (error || !data) return null;
    return data.data as SaisonMeta;
  },
  ["saison-meta"],
  CACHE_OPTIONS,
);

export const getSaisonVersion = unstable_cache(
  async (mois: number, saison: SaisonKey): Promise<SaisonVersion | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("data")
      .eq("mois", mois)
      .eq("module", "saison")
      .eq("situation", saison)
      .maybeSingle();
    if (error || !data) return null;
    return data.data as SaisonVersion;
  },
  ["saison-version"],
  CACHE_OPTIONS,
);

// ---- Audio ---------------------------------------------------------------

export const getAudioMeta = unstable_cache(
  async (mois: number): Promise<AudioMeta | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("data")
      .eq("mois", mois)
      .eq("module", "audio")
      .eq("categorie", "_meta")
      .maybeSingle();
    if (error || !data) return null;
    return data.data as AudioMeta;
  },
  ["audio-meta"],
  CACHE_OPTIONS,
);

export const getAudioScripts = unstable_cache(
  async (mois: number): Promise<ScriptListItem[]> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("ordre, situation, data")
      .eq("mois", mois)
      .eq("module", "audio")
      .eq("categorie", "script")
      .order("ordre", { ascending: true });
    if (error || !data) return [];
    return data.map((row) => {
      const d = row.data as ScriptAudio;
      return {
        id: row.situation as string,
        ordre: (row.ordre as number) ?? 0,
        titre: d.titre,
        duree_estimee: d.duree_estimee,
        theme: d.theme,
        couleur: d.couleur,
        couleur_texte: d.couleur_texte,
      };
    });
  },
  ["audio-scripts"],
  CACHE_OPTIONS,
);

export const getAudioScript = unstable_cache(
  async (mois: number, id: string): Promise<ScriptAudio | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("data")
      .eq("mois", mois)
      .eq("module", "audio")
      .eq("situation", id)
      .maybeSingle();
    if (error || !data) return null;
    return data.data as ScriptAudio;
  },
  ["audio-script"],
  CACHE_OPTIONS,
);

// ---- Jeux ----------------------------------------------------------------

export const getJeuxMeta = unstable_cache(
  async (mois: number): Promise<JeuxMeta | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("data")
      .eq("mois", mois)
      .eq("module", "jeux")
      .eq("categorie", "_meta")
      .maybeSingle();
    if (error || !data) return null;
    return data.data as JeuxMeta;
  },
  ["jeux-meta"],
  CACHE_OPTIONS,
);

export const getJeuxActivites = unstable_cache(
  async (mois: number): Promise<ActiviteListItem[]> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("ordre, situation, categorie, data")
      .eq("mois", mois)
      .eq("module", "jeux")
      .in("categorie", [
        "activite",
        "activite_socle",
        "activite_complementaire",
      ])
      .order("ordre", { ascending: true });
    if (error || !data) return [];
    return data.map((row) => {
      const d = row.data as ActiviteJeu;
      const cat = row.categorie as string;
      const type: ActiviteType =
        cat === "activite_socle"
          ? "socle"
          : cat === "activite_complementaire"
            ? "complementaire"
            : "standard";
      return {
        id: row.situation as string,
        ordre: (row.ordre as number) ?? 0,
        titre: d.titre ?? d.nom ?? "",
        duree: d.duree,
        developpe: d.developpe,
        type,
      };
    });
  },
  ["jeux-activites"],
  CACHE_OPTIONS,
);

export const getJeuxActivite = unstable_cache(
  async (mois: number, id: string): Promise<ActiviteJeu | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("data")
      .eq("mois", mois)
      .eq("module", "jeux")
      .eq("situation", id)
      .maybeSingle();
    if (error || !data) return null;
    return data.data as ActiviteJeu;
  },
  ["jeux-activite"],
  CACHE_OPTIONS,
);

// ---- Reflexo (épinglable) ------------------------------------------------
// Ces helpers retournent le contentId de la ligne 'reflexo' correspondante
// pour permettre l'épinglage côté UI.

export type ReflexoSource = "coucher" | "soin" | "jeux";

export type ReflexoRef = {
  contentId: string;
  source: ReflexoSource;
  data: Record<string, unknown>;
};

export const getReflexoFromCoucher = unstable_cache(
  async (mois: number): Promise<ReflexoRef | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("id, data")
      .eq("mois", mois)
      .eq("module", "reflexo")
      .eq("categorie", "coucher")
      .maybeSingle();
    if (error || !data) return null;
    return {
      contentId: data.id as string,
      source: "coucher",
      data: data.data as Record<string, unknown>,
    };
  },
  ["reflexo-coucher"],
  CACHE_OPTIONS,
);

export const getReflexoFromSoin = unstable_cache(
  async (mois: number, conseilId: string): Promise<ReflexoRef | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("id, data")
      .eq("mois", mois)
      .eq("module", "reflexo")
      .eq("categorie", "soin")
      .eq("situation", conseilId)
      .maybeSingle();
    if (error || !data) return null;
    return {
      contentId: data.id as string,
      source: "soin",
      data: data.data as Record<string, unknown>,
    };
  },
  ["reflexo-soin"],
  CACHE_OPTIONS,
);

export const getReflexoFromJeux = unstable_cache(
  async (mois: number): Promise<ReflexoRef | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("content")
      .select("id, data")
      .eq("mois", mois)
      .eq("module", "reflexo")
      .eq("categorie", "jeux")
      .maybeSingle();
    if (error || !data) return null;
    return {
      contentId: data.id as string,
      source: "jeux",
      data: data.data as Record<string, unknown>,
    };
  },
  ["reflexo-jeux"],
  CACHE_OPTIONS,
);

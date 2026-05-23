import { createClient } from "@/lib/supabase/server";

// =========================================================================
// Types reflétant la structure du contenu importé dans la table `content`.
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

// =========================================================================
// Fonctions de lecture du contenu Guide-moi !
// =========================================================================

export async function getGuideMeta(mois: number): Promise<GuideMeta | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("content")
    .select("data")
    .eq("mois", mois)
    .eq("module", "guide")
    .eq("categorie", "_meta")
    .maybeSingle();

  if (error || !data) return null;
  return data.data as GuideMeta;
}

export async function getGuideSituations(
  mois: number,
  categorie: string,
): Promise<SituationListItem[]> {
  const supabase = createClient();
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
    titre: (row.data as { titre?: string })?.titre ?? row.situation as string,
  }));
}

export async function getGuideProtocole(
  mois: number,
  categorie: string,
  ordre: number,
): Promise<{ contentId: string; protocole: ProtocoleGuide } | null> {
  const supabase = createClient();
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
}

// =========================================================================
// Types et helpers pour les 5 autres modules
// =========================================================================

// ---- Coucher -------------------------------------------------------------

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

export async function getCoucher(
  mois: number,
): Promise<{ contentId: string; coucher: CoucherModule } | null> {
  const supabase = createClient();
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
}

// Récupère n'importe quel contenu par son id (pour la page /epingle/[id]).
export type ContentRow = {
  id: string;
  mois: number;
  module: string;
  categorie: string | null;
  situation: string | null;
  ordre: number;
  data: Record<string, unknown>;
};

export async function getContentById(id: string): Promise<ContentRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("content")
    .select("id, mois, module, categorie, situation, ordre, data")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as ContentRow;
}

// ---- Soin ----------------------------------------------------------------

// Structure variable selon le conseil — on garde un type souple.
export type ConseilSoin = {
  id: string;
  numero?: number;
  icone?: string;
  titre: string;
  sous_titre?: string;
  intro?: string;
  // Tout le reste est variable :
  [key: string]: unknown;
};

export type SoinMeta = {
  mois: number;
  titre_rubrique?: string;
  sous_titre?: string;
  description?: string;
};

export type ConseilListItem = {
  id: string;
  ordre: number;
  titre: string;
  sous_titre?: string;
  icone?: string;
};

export async function getSoinMeta(mois: number): Promise<SoinMeta | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("content")
    .select("data")
    .eq("mois", mois)
    .eq("module", "soin")
    .eq("categorie", "_meta")
    .maybeSingle();

  if (error || !data) return null;
  return data.data as SoinMeta;
}

export async function getSoinConseils(mois: number): Promise<ConseilListItem[]> {
  const supabase = createClient();
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
      titre: d.titre,
      sous_titre: d.sous_titre,
      icone: d.icone,
    };
  });
}

export async function getSoinConseil(
  mois: number,
  id: string,
): Promise<ConseilSoin | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("content")
    .select("data")
    .eq("mois", mois)
    .eq("module", "soin")
    .eq("situation", id)
    .maybeSingle();

  if (error || !data) return null;
  return data.data as ConseilSoin;
}

// ---- Saison --------------------------------------------------------------

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

export async function getSaisonMeta(mois: number): Promise<SaisonMeta | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("content")
    .select("data")
    .eq("mois", mois)
    .eq("module", "saison")
    .eq("categorie", "_meta")
    .maybeSingle();

  if (error || !data) return null;
  return data.data as SaisonMeta;
}

export async function getSaisonVersion(
  mois: number,
  saison: SaisonKey,
): Promise<SaisonVersion | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("content")
    .select("data")
    .eq("mois", mois)
    .eq("module", "saison")
    .eq("situation", saison)
    .maybeSingle();

  if (error || !data) return null;
  return data.data as SaisonVersion;
}

// ---- Audio ---------------------------------------------------------------

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

export async function getAudioMeta(mois: number): Promise<AudioMeta | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("content")
    .select("data")
    .eq("mois", mois)
    .eq("module", "audio")
    .eq("categorie", "_meta")
    .maybeSingle();

  if (error || !data) return null;
  return data.data as AudioMeta;
}

export async function getAudioScripts(mois: number): Promise<ScriptListItem[]> {
  const supabase = createClient();
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
}

export async function getAudioScript(
  mois: number,
  id: string,
): Promise<ScriptAudio | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("content")
    .select("data")
    .eq("mois", mois)
    .eq("module", "audio")
    .eq("situation", id)
    .maybeSingle();

  if (error || !data) return null;
  return data.data as ScriptAudio;
}

// ---- Jeux ----------------------------------------------------------------

export type ActiviteType = "standard" | "socle" | "complementaire";

export type ActiviteJeu = {
  id: string;
  numero?: number;
  // Variantes des mois 3+ :
  titre?: string;
  duree?: string;
  frequence?: string;
  developpe?: string[];
  materiel?: string[];
  description?: string;
  comment_jouer?: string[];
  // Variantes du mois 0 :
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
  // Variantes mois 3+ :
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
  // Variantes mois 0 :
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

export async function getJeuxMeta(mois: number): Promise<JeuxMeta | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("content")
    .select("data")
    .eq("mois", mois)
    .eq("module", "jeux")
    .eq("categorie", "_meta")
    .maybeSingle();

  if (error || !data) return null;
  return data.data as JeuxMeta;
}

export async function getJeuxActivites(mois: number): Promise<ActiviteListItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("content")
    .select("ordre, situation, categorie, data")
    .eq("mois", mois)
    .eq("module", "jeux")
    .in("categorie", ["activite", "activite_socle", "activite_complementaire"])
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
}

export async function getJeuxActivite(
  mois: number,
  id: string,
): Promise<ActiviteJeu | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("content")
    .select("data")
    .eq("mois", mois)
    .eq("module", "jeux")
    .eq("situation", id)
    .maybeSingle();

  if (error || !data) return null;
  return data.data as ActiviteJeu;
}

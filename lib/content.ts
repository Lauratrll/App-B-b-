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
): Promise<ProtocoleGuide | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("content")
    .select("data")
    .eq("mois", mois)
    .eq("module", "guide")
    .eq("categorie", categorie)
    .eq("ordre", ordre)
    .maybeSingle();

  if (error || !data) return null;
  return data.data as ProtocoleGuide;
}

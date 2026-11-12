"use server";

// Actions serveur de l'outil « Le rythme de bébé » (06/11/2026).
// Ce fichier n'exporte QUE des fonctions async (exigence Next.js).
// Table : journees_rythme (migration 0006), une ligne par jour du calendrier.
// L'écran enregistre tout seul à chaque moment ajouté, changé ou retiré ;
// une journée vidée de ses moments est supprimée.

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { JOUR_RE, evenementsValides, separer, type Evenement, type JourneeEnregistree } from "@/lib/rythme";

type Resultat = { ok: true; journee: JourneeEnregistree | null } | { ok: false; message: string };

export async function enregistrerJournee(entree: {
  jour: string;
  mois_bebe: number;
  evenements: Evenement[];
}): Promise<Resultat> {
  const user = await requireUser();
  if (!JOUR_RE.test(entree.jour) || !evenementsValides(entree.evenements)) {
    return { ok: false, message: "Cette journée n'a pas pu être enregistrée : vérifie les heures." };
  }
  const supabase = createClient();

  if (entree.evenements.length === 0) {
    const { error } = await supabase.from("journees_rythme").delete().eq("user_id", user.id).eq("jour", entree.jour);
    revalidatePath("/rythme");
    return error ? { ok: false, message: "L'enregistrement n'a pas marché. Réessaie dans un instant." } : { ok: true, journee: null };
  }

  const mois = Number.isInteger(entree.mois_bebe) ? Math.max(0, Math.min(23, entree.mois_bebe)) : null;
  // Moments d'éveil-sommeil d'abord (dans l'ordre de la journée), puis lait et selles (12/11).
  const { moments, reperes } = separer(entree.evenements);
  const evenements = [
    ...moments.map((m) => (m.veille ? { t: m.t, h: m.h, veille: true } : { t: m.t, h: m.h })),
    ...reperes.map((r) => (r.t === "lait" && r.ml ? { t: r.t, h: r.h, ml: r.ml } : { t: r.t, h: r.h })),
  ];
  const { data, error } = await supabase
    .from("journees_rythme")
    .upsert(
      { user_id: user.id, jour: entree.jour, mois_bebe: mois, evenements, updated_at: new Date().toISOString() },
      { onConflict: "user_id,jour" },
    )
    .select("id, jour, mois_bebe, evenements")
    .single();

  if (error || !data) {
    return { ok: false, message: "L'enregistrement n'a pas marché. Réessaie dans un instant." };
  }
  revalidatePath("/rythme");
  return { ok: true, journee: data as unknown as JourneeEnregistree };
}

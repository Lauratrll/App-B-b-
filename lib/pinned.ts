"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

// =========================================================================
// Quotas d'épingles par module
// =========================================================================

export const PIN_QUOTAS = {
  guide: 6,
  coucher: 2,
} as const;

export type PinnableModule = keyof typeof PIN_QUOTAS;

export const PINNABLE_MODULES: PinnableModule[] = ["guide", "coucher"];

// =========================================================================
// Types
// =========================================================================

export type PinnedItem = {
  id: string;                // id de la ligne `pinned`
  content_id: string;        // id de la ligne `content`
  created_at: string;
  mois: number;              // mois associé au contenu
  module: PinnableModule;
  categorie: string | null;
  situation: string | null;
  data: Record<string, unknown>;
};

// =========================================================================
// Lecture
// =========================================================================

export async function getPins(): Promise<PinnedItem[]> {
  const user = await requireUser();
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pinned")
    .select(
      "id, content_id, created_at, content!inner(mois, module, categorie, situation, data)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  type Row = {
    id: string;
    content_id: string;
    created_at: string;
    content: {
      mois: number;
      module: string;
      categorie: string | null;
      situation: string | null;
      data: Record<string, unknown>;
    };
  };

  return (data as unknown as Row[])
    .filter((r) => PINNABLE_MODULES.includes(r.content.module as PinnableModule))
    .map((r) => ({
      id: r.id,
      content_id: r.content_id,
      created_at: r.created_at,
      mois: r.content.mois,
      module: r.content.module as PinnableModule,
      categorie: r.content.categorie,
      situation: r.content.situation,
      data: r.content.data,
    }));
}

export async function isPinned(contentId: string): Promise<boolean> {
  const user = await requireUser();
  const supabase = createClient();
  const { data } = await supabase
    .from("pinned")
    .select("id")
    .eq("user_id", user.id)
    .eq("content_id", contentId)
    .maybeSingle();
  return Boolean(data);
}

export async function countPinsByModule(
  module: PinnableModule,
): Promise<number> {
  const pins = await getPins();
  return pins.filter((p) => p.module === module).length;
}

// =========================================================================
// Server actions
// =========================================================================

/**
 * Tente d'épingler ou de désépingler un contenu.
 * Retour : URL vers laquelle rediriger (toast / page de gestion).
 *
 * Comportement :
 *   - Si déjà épinglé → unpin → redirect retour avec ?epingle=retire
 *   - Si pas encore épinglé :
 *       - quota OK → pin → redirect retour avec ?epingle=ajoute
 *       - quota plein → redirect /epingles/gerer?pending=ID&module=X&return=URL
 */
export async function togglePinAction(contentId: string, returnUrl: string) {
  const user = await requireUser();
  const supabase = createClient();

  // Récupère le module du contenu
  const { data: content, error: cErr } = await supabase
    .from("content")
    .select("module")
    .eq("id", contentId)
    .maybeSingle();

  if (cErr || !content) {
    redirect(`${returnUrl}?epingle=erreur`);
  }

  const mod = content.module as PinnableModule;
  if (!PINNABLE_MODULES.includes(mod)) {
    redirect(`${returnUrl}?epingle=non_eligible`);
  }

  // Déjà épinglé ?
  const { data: existing } = await supabase
    .from("pinned")
    .select("id")
    .eq("user_id", user.id)
    .eq("content_id", contentId)
    .maybeSingle();

  if (existing) {
    // Unpin
    await supabase.from("pinned").delete().eq("id", existing.id);
    revalidatePath("/", "layout");
    redirect(`${returnUrl}?epingle=retire`);
  }

  // Sinon : vérifier le quota
  const count = await countPinsByModule(mod);
  if (count >= PIN_QUOTAS[mod]) {
    // Quota plein → page de gestion
    const params = new URLSearchParams({
      pending: contentId,
      module: mod,
      return: returnUrl,
    });
    redirect(`/epingles/gerer?${params.toString()}`);
  }

  // Ajout
  const { error: insErr } = await supabase
    .from("pinned")
    .insert({ user_id: user.id, content_id: contentId });

  if (insErr) {
    redirect(`${returnUrl}?epingle=erreur`);
  }

  revalidatePath("/", "layout");
  redirect(`${returnUrl}?epingle=ajoute`);
}

/**
 * Supprime une épingle. Si pendingContentId fourni, tente d'épingler
 * ce contenu après suppression et redirige vers returnUrl avec toast.
 * Sinon, redirige vers /epingles.
 */
export async function removePinAction(
  pinId: string,
  pendingContentId?: string,
  returnUrl?: string,
) {
  const user = await requireUser();
  const supabase = createClient();

  // Vérifie la propriété de l'épingle
  const { data: pin } = await supabase
    .from("pinned")
    .select("id, user_id, content_id")
    .eq("id", pinId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!pin) {
    redirect("/epingles?epingle=erreur");
  }

  // Supprime
  await supabase.from("pinned").delete().eq("id", pin.id);
  revalidatePath("/", "layout");

  // Si une épingle est en attente, on l'ajoute et on retourne au protocole d'origine
  if (pendingContentId && returnUrl) {
    const { error: insErr } = await supabase
      .from("pinned")
      .insert({ user_id: user.id, content_id: pendingContentId });
    if (insErr) {
      redirect(`${returnUrl}?epingle=erreur`);
    }
    revalidatePath("/", "layout");
    redirect(`${returnUrl}?epingle=ajoute`);
  }

  redirect("/epingles?epingle=retire");
}

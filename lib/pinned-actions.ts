"use server";

// Server actions pour le système d'épingles.
// Ce fichier ne doit exporter QUE des fonctions async (exigence Next.js
// pour les fichiers "use server"). Les constantes, types et helpers de
// lecture sont dans lib/pinned.ts.

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import {
  PIN_QUOTAS,
  PINNABLE_MODULES,
  countPinsByModule,
  type PinnableModule,
} from "@/lib/pinned";

/**
 * Tente d'épingler ou de désépingler un contenu.
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
    await supabase.from("pinned").delete().eq("id", existing.id);
    revalidatePath("/", "layout");
    redirect(`${returnUrl}?epingle=retire`);
  }

  // Vérifier le quota
  const count = await countPinsByModule(mod);
  if (count >= PIN_QUOTAS[mod]) {
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

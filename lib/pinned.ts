// Helpers et constantes pour le système d'épingles.
// IMPORTANT : ce fichier exporte des constantes et des types, donc
// ne pas mettre "use server" en haut. Les server actions sont dans
// lib/pinned-actions.ts.

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
// Lecture (helpers serveur, appelables depuis Server Components)
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

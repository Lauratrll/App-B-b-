import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client admin avec la service_role key — bypass RLS.
// À utiliser UNIQUEMENT côté serveur, jamais exposer cette clé.
// Usages : webhooks Stripe, scripts d'import de contenu.

let adminClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createAdminClient() {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Variables Supabase manquantes : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises.",
    );
  }

  adminClient = createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Persistance de la session : 30 jours minimum sur les cookies écrits par
// Supabase. Au-delà, on respecte ce que Supabase passe (refresh tokens
// peuvent avoir une durée plus longue).
const MIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours en secondes

function extendCookieOptions(options: CookieOptions): CookieOptions {
  const incoming = options.maxAge ?? 0;
  return {
    ...options,
    maxAge: Math.max(incoming, MIN_COOKIE_MAX_AGE),
  };
}

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...extendCookieOptions(options) });
          } catch {
            // Les Server Components ne peuvent pas écrire de cookies.
            // Le middleware rafraîchira la session sur la prochaine requête.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // idem
          }
        },
      },
    },
  );
}

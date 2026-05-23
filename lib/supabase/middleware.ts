import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Persistance de la session : 30 jours minimum (cf. lib/supabase/server.ts)
const MIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
function extendCookieOptions(options: CookieOptions): CookieOptions {
  return {
    ...options,
    maxAge: Math.max(options.maxAge ?? 0, MIN_COOKIE_MAX_AGE),
  };
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          const opts = extendCookieOptions(options);
          request.cookies.set({ name, value, ...opts });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value, ...opts });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // IMPORTANT : appel auth.getUser() rafraîchit la session si nécessaire.
  await supabase.auth.getUser();

  return response;
}

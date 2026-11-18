import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Lien « Confirmer mon adresse » de l'email d'inscription (18/11/2026).
// Le modèle d'email (supabase/emails/confirmation-inscription.html) envoie
// ici un token_hash : il marche même si le parent ouvre l'email sur un autre
// appareil ou dans l'app Gmail, contrairement au lien par défaut de Supabase.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = (searchParams.get("type") ?? "email") as EmailOtpType;

  if (token_hash) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      // Mot de passe oublié : il en choisit un nouveau. Inscription :
      // il présente son bébé.
      const suite = type === "recovery" ? "/nouveau-mot-de-passe" : "/profil";
      return NextResponse.redirect(`${origin}${suite}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=lien_expire`);
}

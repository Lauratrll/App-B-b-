"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function resetAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect("/reset?error=email_manquant");
  }

  const supabase = createClient();
  const appUrl =
    headers().get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  // On ne révèle pas si l'email existe — toujours le même message côté UI.
  await supabase.auth.resetPasswordForEmail(email, {
    // Le lien de l'email (supabase/emails/mot-de-passe.html) passe par
    // /auth/confirm, qui envoie vers « Choisir un nouveau mot de passe ».
    redirectTo: `${appUrl}/auth/confirm`,
  });

  redirect("/login?reset=sent");
}

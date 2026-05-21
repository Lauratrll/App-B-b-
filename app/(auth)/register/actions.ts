"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function registerAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!email || !password) {
    redirect("/register?error=champs_manquants");
  }
  if (password.length < 8) {
    redirect("/register?error=mot_de_passe_court");
  }
  if (password !== confirm) {
    redirect("/register?error=mots_de_passe_differents");
  }

  const supabase = createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${appUrl}/auth/callback` },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      redirect("/register?error=email_deja_utilise");
    }
    redirect("/register?error=inscription_echouee");
  }

  redirect("/login?registered=1");
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function nouveauMotDePasseAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) {
    redirect("/nouveau-mot-de-passe?error=mot_de_passe_court");
  }
  if (password !== confirm) {
    redirect("/nouveau-mot-de-passe?error=mots_de_passe_differents");
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (error.code === "same_password") {
      redirect("/nouveau-mot-de-passe?error=meme_mot_de_passe");
    }
    redirect("/nouveau-mot-de-passe?error=echec");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

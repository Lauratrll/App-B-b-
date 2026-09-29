"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getRealProfile, isCurrentUserAdmin, requireUser } from "@/lib/auth";

// Le profil est verrouillé dès sa création (prénom, date, genre) : seuls
// les admins peuvent le modifier. La base l'impose aussi (RLS, migration
// 0004) — ce contrôle-ci sert à afficher un message clair.
export async function upsertProfile(formData: FormData) {
  const user = await requireUser();
  const existing = await getRealProfile();
  const isAdmin = await isCurrentUserAdmin();

  if (existing && !isAdmin) {
    redirect("/profil?error=profil_verrouille");
  }

  const baby_name = String(formData.get("baby_name") ?? "").trim();
  const birthdate = String(formData.get("birthdate") ?? "");
  const genreRaw = String(formData.get("genre") ?? "");
  // Genre optionnel ; on n'accepte que les valeurs connues, sinon null.
  const genre =
    genreRaw === "garcon" || genreRaw === "fille" ? genreRaw : null;

  if (!baby_name || !birthdate) {
    redirect("/profil?error=champs_manquants");
  }

  // birthdate au format YYYY-MM-DD côté <input type="date">
  const birthDateObj = new Date(birthdate);
  if (Number.isNaN(birthDateObj.getTime())) {
    redirect("/profil?error=date_invalide");
  }
  if (birthDateObj > new Date()) {
    redirect("/profil?error=date_future");
  }

  if (!existing && formData.get("confirmation") !== "oui") {
    redirect("/profil?error=confirmation_manquante");
  }

  const supabase = createClient();
  const { error } = existing
    ? await supabase
        .from("profiles")
        .update({ baby_name, birthdate, genre })
        .eq("user_id", user.id)
    : await supabase
        .from("profiles")
        .insert({ user_id: user.id, baby_name, birthdate, genre });

  if (error) {
    redirect("/profil?error=sauvegarde_echouee");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

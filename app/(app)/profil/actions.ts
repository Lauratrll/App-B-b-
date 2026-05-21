"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export async function upsertProfile(formData: FormData) {
  const user = await requireUser();
  const baby_name = String(formData.get("baby_name") ?? "").trim();
  const birthdate = String(formData.get("birthdate") ?? "");

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

  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .upsert(
      { user_id: user.id, baby_name, birthdate },
      { onConflict: "user_id" },
    );

  if (error) {
    redirect("/profil?error=sauvegarde_echouee");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

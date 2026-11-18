"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  codeEstValide,
  enregistrerInscription,
  normaliserCode,
} from "@/lib/inscription";

export async function registerAction(formData: FormData) {
  const nom = String(formData.get("nom") ?? "").trim().slice(0, 60);
  const prenom = String(formData.get("prenom") ?? "").trim().slice(0, 60);
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const code = normaliserCode(String(formData.get("code") ?? ""));

  if (!nom || !prenom || !email || !password || !code) {
    redirect("/register?error=champs_manquants");
  }
  if (password.length < 8) {
    redirect("/register?error=mot_de_passe_court");
  }
  if (password !== confirm) {
    redirect("/register?error=mots_de_passe_differents");
  }
  // Inscriptions fermées sans code d'activation (Laura, 18/11/2026).
  if (!(await codeEstValide(code))) {
    redirect("/register?error=code_invalide");
  }

  const supabase = createClient();
  // Adresse de l'app telle que le parent la voit (locale ou en ligne) :
  // le lien de l'email y ramène, quelle que soit la variable d'environnement.
  const appUrl =
    headers().get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/confirm`,
      data: { nom, prenom },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      redirect("/register?error=email_deja_utilise");
    }
    redirect("/register?error=inscription_echouee");
  }
  // Email déjà inscrit (Supabase ne le dit pas quand la confirmation par
  // email est active : il renvoie un compte sans identité).
  if (!data.user || data.user.identities?.length === 0) {
    redirect("/register?error=email_deja_utilise");
  }

  await enregistrerInscription({
    userId: data.user.id,
    email,
    nom,
    prenom,
    code,
  });

  redirect(data.session ? "/profil" : "/verifier-email");
}

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Genre = "garcon" | "fille";

export type BabyProfile = {
  id: string;
  user_id: string;
  baby_name: string;
  birthdate: string;
  genre: Genre | null;
  created_at: string;
  updated_at: string;
};

// React cache() : un seul appel Supabase par render, même si plusieurs
// helpers le demandent. Élimine les waterfalls dans layout + page.

// getClaims() vérifie le jeton de session SUR PLACE (clé publique ES256 du
// projet, mise en cache) au lieu d'interroger le serveur d'authentification
// à chaque page comme getUser() : un aller-retour réseau de moins par clic
// (20/10/2026, lenteur signalée par Laura). Si le jeton est expiré, il est
// rafraîchi ; s'il n'est pas signé en asymétrique, la bibliothèque retombe
// d'elle-même sur getUser().
export type AuthUser = { id: string; email: string | null };

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) return null;
  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
  };
});

// Profil tel qu'enregistré en base. Sert à l'écran Profil ; les modules
// passent par getCurrentProfile, qui applique l'aperçu admin.
export const getRealProfile = cache(async (): Promise<BabyProfile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (data as BabyProfile | null) ?? null;
});

// Admin = e-mail présent dans la table `admins` (gérée depuis le dashboard
// Supabase). Vérifié côté base : un cookie trafiqué ne suffit jamais.
export const isCurrentUserAdmin = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;
  const supabase = createClient();
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
});

// ----- Aperçu admin -----------------------------------------
// Les admins choisissent un mois et un genre ; stockés en cookie, ils
// remplacent l'âge réel et le genre dans toute l'app. Le profil en base
// n'est jamais touché.
export const APERCU_MOIS_COOKIE = "apercu_mois";
export const APERCU_GENRE_COOKIE = "apercu_genre";
export const APERCU_MOIS_MAX = 23;

export type Apercu = {
  mois: number | null;
  // "aucun" = simuler un profil sans genre renseigné.
  genre: Genre | "aucun" | null;
};

export const getApercu = cache(async (): Promise<Apercu | null> => {
  if (!(await isCurrentUserAdmin())) return null;
  const store = cookies();
  const moisRaw = store.get(APERCU_MOIS_COOKIE)?.value;
  const genreRaw = store.get(APERCU_GENRE_COOKIE)?.value;
  const moisNum = moisRaw ? Number(moisRaw) : NaN;
  const mois =
    Number.isInteger(moisNum) && moisNum >= 0 && moisNum <= APERCU_MOIS_MAX
      ? moisNum
      : null;
  const genre =
    genreRaw === "garcon" || genreRaw === "fille" || genreRaw === "aucun"
      ? genreRaw
      : null;
  return { mois, genre };
});

// Date de naissance fictive qui donne exactement `mois` via getBabyMonth :
// le 1er du mois, `mois` mois avant le mois courant.
function birthdateForMonth(mois: number): string {
  const today = new Date();
  const d = new Date(
    Date.UTC(today.getFullYear(), today.getMonth() - mois, 1),
  );
  return d.toISOString().slice(0, 10);
}

export const getCurrentProfile = cache(
  async (): Promise<BabyProfile | null> => {
    // Profil et statut admin demandés EN MÊME TEMPS, pas l'un après l'autre.
    const [profile, apercu] = await Promise.all([getRealProfile(), getApercu()]);
    if (!profile) return null;

    if (!apercu) return profile;

    return {
      ...profile,
      birthdate:
        apercu.mois === null
          ? profile.birthdate
          : birthdateForMonth(apercu.mois),
      genre:
        apercu.genre === null
          ? profile.genre
          : apercu.genre === "aucun"
            ? null
            : apercu.genre,
    };
  },
);

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireProfile(): Promise<{
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
  profile: BabyProfile;
}> {
  const user = await requireUser();
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/profil");
  }

  return { user, profile };
}

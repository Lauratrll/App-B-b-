import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type BabyProfile = {
  id: string;
  user_id: string;
  baby_name: string;
  birthdate: string;
  created_at: string;
  updated_at: string;
};

// React cache() : un seul appel Supabase par render, même si plusieurs
// helpers le demandent. Élimine les waterfalls dans layout + page.

export const getCurrentUser = cache(async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentProfile = cache(
  async (): Promise<BabyProfile | null> => {
    const user = await getCurrentUser();
    if (!user) return null;

    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    return (data as BabyProfile | null) ?? null;
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

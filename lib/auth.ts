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

export async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<BabyProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (data as BabyProfile | null) ?? null;
}

export async function requireProfile(): Promise<{
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
  profile: BabyProfile;
}> {
  const user = await requireUser();
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/profil");
  }

  return { user, profile: profile as BabyProfile };
}

"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  APERCU_GENRE_COOKIE,
  APERCU_MOIS_COOKIE,
  APERCU_MOIS_MAX,
  isCurrentUserAdmin,
} from "@/lib/auth";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function setApercu(formData: FormData) {
  if (!(await isCurrentUserAdmin())) return;
  const store = cookies();

  const mois = Number(formData.get("mois"));
  if (Number.isInteger(mois) && mois >= 0 && mois <= APERCU_MOIS_MAX) {
    store.set(APERCU_MOIS_COOKIE, String(mois), COOKIE_OPTIONS);
  } else {
    store.delete(APERCU_MOIS_COOKIE);
  }

  const genre = String(formData.get("genre") ?? "");
  if (genre === "garcon" || genre === "fille" || genre === "aucun") {
    store.set(APERCU_GENRE_COOKIE, genre, COOKIE_OPTIONS);
  } else {
    store.delete(APERCU_GENRE_COOKIE);
  }

  revalidatePath("/", "layout");
}

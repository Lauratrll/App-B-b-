// Côté serveur uniquement (clé service) : n'importer que depuis des
// server actions ou des pages serveur.
import { createAdminClient } from "@/lib/supabase/admin";
import { getBabyMonth } from "@/lib/utils";

// Codes d'activation et inscriptions (18/11/2026, migration 0007).
// Les tables ne sont lisibles qu'avec la clé service : tout passe ici,
// côté serveur.

/** « bonne nuit » → « BONNENUIT » : majuscules, sans espaces. */
export function normaliserCode(brut: string): string {
  return brut.replace(/\s+/g, "").toUpperCase();
}

export async function codeEstValide(code: string): Promise<boolean> {
  if (!code) return false;
  const { data, error } = await createAdminClient()
    .from("codes_activation")
    .select("actif")
    .eq("code", code)
    .maybeSingle();
  return !error && data?.actif === true;
}

export async function enregistrerInscription(params: {
  userId: string;
  email: string | null;
  nom: string | null;
  prenom: string | null;
  code: string;
}): Promise<boolean> {
  const { error } = await createAdminClient().from("inscriptions").upsert(
    {
      user_id: params.userId,
      email: params.email,
      nom: params.nom,
      prenom: params.prenom,
      code: params.code,
    },
    { onConflict: "user_id", ignoreDuplicates: true },
  );
  return !error;
}

export async function getInscription(userId: string) {
  const { data } = await createAdminClient()
    .from("inscriptions")
    .select("nom, prenom, code, email")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

// ----- Email à Laura à chaque nouvelle inscription ------------
// Envoyé quand le parent crée le profil de son bébé (c'est là qu'on
// connaît le bébé). Destinataire : INSCRIPTION_NOTIF_EMAIL (pas écrit
// dans le code, le dépôt pouvant être public). Si la clé Resend ou le
// destinataire manquent, rien n'est envoyé et l'inscription continue.

function echapper(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&quot;",
  );
}

function ageLisible(birthdate: string): string {
  const naissance = new Date(birthdate);
  const jours = Math.floor((Date.now() - naissance.getTime()) / 86_400_000);
  if (jours < 31) {
    const semaines = Math.floor(jours / 7);
    return semaines < 1 ? `${jours} jour${jours > 1 ? "s" : ""}` : `${semaines} semaine${semaines > 1 ? "s" : ""}`;
  }
  const mois = getBabyMonth(naissance);
  return `${mois} mois`;
}

export async function notifierInscription(params: {
  nomParent: string | null;
  prenomParent: string | null;
  email: string | null;
  code: string | null;
  bebe: string;
  birthdate: string;
  genre: "garcon" | "fille" | null;
}): Promise<void> {
  const cle = process.env.RESEND_API_KEY;
  const destinataire = process.env.INSCRIPTION_NOTIF_EMAIL;
  if (!cle || !destinataire) return;

  const expediteurEnv = process.env.RESEND_FROM_EMAIL ?? "";
  // Tant qu'aucun domaine n'est vérifié chez Resend, seule l'adresse de
  // test de Resend peut envoyer (et seulement vers le titulaire du compte).
  const expediteur =
    expediteurEnv && !expediteurEnv.includes("votre-domaine")
      ? expediteurEnv
      : "onboarding@resend.dev";

  const [a, m, j] = params.birthdate.split("-");
  const genre =
    params.genre === "garcon" ? "garçon" : params.genre === "fille" ? "fille" : "non renseigné";
  const lignes: [string, string][] = [
    ["Parent", [params.prenomParent, params.nomParent].filter(Boolean).join(" ") || "(nom non renseigné)"],
    ["Email", params.email || "?"],
    ["Code utilisé", params.code || "?"],
    ["Bébé", params.bebe],
    ["Né(e) le", `${j}/${m}/${a}`],
    ["Âge", ageLisible(params.birthdate)],
    ["Genre", genre],
  ];

  const html = `<div style="font-family:Arial,sans-serif;color:#3A3228">
<p style="font-size:16px">Nouvelle inscription sur l'app</p>
<table style="border-collapse:collapse;font-size:14px">
${lignes
  .map(
    ([k, v]) =>
      `<tr><td style="padding:4px 14px 4px 0;color:#9A5444">${k}</td><td style="padding:4px 0"><b>${echapper(v)}</b></td></tr>`,
  )
  .join("\n")}
</table></div>`;
  const text = lignes.map(([k, v]) => `${k} : ${v}`).join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cle}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Parentalité consciente <${expediteur}>`,
        to: [destinataire],
        subject: `Nouvelle inscription : ${[params.prenomParent, params.nomParent].filter(Boolean).join(" ") || params.email || "un parent"} (${params.bebe}, ${ageLisible(params.birthdate)})`,
        html,
        text,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error("Email d'inscription non envoyé :", res.status, await res.text());
    }
  } catch (e) {
    console.error("Email d'inscription non envoyé :", e);
  }
}

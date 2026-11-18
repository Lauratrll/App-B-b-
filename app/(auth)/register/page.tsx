import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { C_INSCRIPTION } from "@/lib/couleurs-inscription";
import { registerAction } from "./actions";

// Page d'inscription aux couleurs du slot 2 de Guide-moi (Laura, 18/11/2026).
const C = C_INSCRIPTION;

const ERROR_MESSAGES: Record<string, string> = {
  champs_manquants: "Merci de remplir tous les champs.",
  mot_de_passe_court: "Le mot de passe doit contenir au moins 8 caractères.",
  mots_de_passe_differents: "Les deux mots de passe ne correspondent pas.",
  email_deja_utilise: "Un compte existe déjà pour cet email.",
  code_invalide:
    "Ce code d'activation n'est pas reconnu. Vérifiez-le auprès de la personne qui vous l'a transmis.",
  inscription_echouee: "L'inscription a échoué. Réessayez dans un instant.",
};

const champ =
  "w-full rounded-[14px] border-[1.5px] px-3.5 py-2 text-base outline-none transition focus:border-[#9A5444] focus:bg-white focus:ring-2 focus:ring-[#9A5444]/15 placeholder:text-[#B98577]";
const champStyle = {
  background: "rgba(255,255,255,.62)",
  borderColor: C.soutenu,
  color: C.texte,
};

function Etiquette({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-[10px] font-bold uppercase tracking-[.08em]"
      style={{ color: C.accent }}
    >
      {children}
    </span>
  );
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const errorMsg = searchParams.error
    ? (ERROR_MESSAGES[searchParams.error] ?? "Une erreur est survenue.")
    : null;

  return (
    // Fond plein écran : on annule le retrait du gabarit (app/(auth)/layout).
    <div
      className="relative -mx-6 -my-10 min-h-dvh overflow-hidden px-5 pb-6 pt-6"
      style={{ background: C.fond, color: C.texte }}
    >
      {/* Deux halos du camaïeu, pour la douceur */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full"
        style={{ background: C.clair, opacity: 0.7 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-[46%] h-56 w-56 rounded-full"
        style={{ background: C.soutenu, opacity: 0.45 }}
      />

      <section className="relative space-y-4">
        <header className="space-y-1 text-center">
          <div
            className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,.5)" }}
            aria-hidden
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke={C.accent}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 13a6 6 0 11-7-7 4.5 4.5 0 007 7z" />
              <path d="M18 4.5v2M17 5.5h2" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-[24px] font-semibold leading-tight">
            Créer mon compte
          </h1>
          <p className="text-[13px]" style={{ color: C.accent }}>
            Vous renseignerez les infos de votre bébé juste après.
          </p>
        </header>

        {errorMsg ? (
          <p
            className="rounded-[14px] p-3 text-sm"
            style={{ background: "#FFF4F1", color: "#8A2E1E" }}
          >
            {errorMsg}
          </p>
        ) : null}

        <form action={registerAction} className="space-y-3">
          <div
            className="space-y-3 rounded-[22px] p-4"
            style={{ background: "rgba(255,255,255,.38)" }}
          >
            <div className="grid grid-cols-2 gap-2.5">
              <label className="block min-w-0 space-y-1">
                <Etiquette>Nom</Etiquette>
                <input
                  type="text"
                  name="nom"
                  required
                  maxLength={60}
                  autoComplete="family-name"
                  className={champ}
                  style={champStyle}
                />
              </label>
              <label className="block min-w-0 space-y-1">
                <Etiquette>Prénom</Etiquette>
                <input
                  type="text"
                  name="prenom"
                  required
                  maxLength={60}
                  autoComplete="given-name"
                  className={champ}
                  style={champStyle}
                />
              </label>
            </div>
            <label className="block space-y-1">
              <Etiquette>Email</Etiquette>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className={champ}
                style={champStyle}
              />
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <label className="block min-w-0 space-y-1">
                <Etiquette>Mot de passe</Etiquette>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="8 caractères"
                  className={champ}
                  style={champStyle}
                />
              </label>
              <label className="block min-w-0 space-y-1">
                <Etiquette>Confirmation</Etiquette>
                <input
                  type="password"
                  name="confirm"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Le même"
                  className={champ}
                  style={champStyle}
                />
              </label>
            </div>
          </div>

          <label
            className="block space-y-1.5 rounded-[22px] border-[1.5px] border-dashed px-4 py-3"
            style={{ background: C.moyen, borderColor: C.profond }}
          >
            <Etiquette>Code d&apos;activation</Etiquette>
            <span className="block text-xs leading-snug">
              L&apos;app est en test : saisissez le code reçu.
            </span>
            <input
              type="text"
              name="code"
              required
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="VOTRE CODE"
              className={`${champ} text-center font-semibold uppercase tracking-[.2em]`}
              style={{ ...champStyle, background: "rgba(255,255,255,.75)" }}
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl px-6 py-3.5 text-base font-semibold text-white shadow-[0_6px_18px_-8px_rgba(94,51,40,.55)] transition active:scale-[.98]"
            style={{ background: C.accent }}
          >
            S&apos;inscrire
          </button>
        </form>

        <p className="text-center text-sm" style={{ color: C.accent }}>
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-semibold underline"
            style={{ color: C.texte }}
          >
            Se connecter
          </Link>
        </p>
      </section>
    </div>
  );
}

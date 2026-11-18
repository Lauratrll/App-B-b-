import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { C_INSCRIPTION as C } from "@/lib/couleurs-inscription";
import { loginAction } from "./actions";

const champ =
  "w-full rounded-[14px] border-[1.5px] px-3.5 py-2.5 text-base outline-none transition focus:border-[#9A5444] focus:bg-white focus:ring-2 focus:ring-[#9A5444]/15";
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

const ERROR_MESSAGES: Record<string, string> = {
  champs_manquants: "Merci de remplir tous les champs.",
  identifiants_invalides: "Email ou mot de passe incorrect.",
  email_non_confirme:
    "Votre adresse n'est pas encore confirmée : touchez le bouton « Confirmer mon adresse » dans l'email que nous vous avons envoyé.",
  lien_expire:
    "Ce lien n'est plus valable ou a déjà servi. Connectez-vous ci-dessous, ou demandez un nouveau lien avec « Mot de passe oublié ? ».",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; registered?: string; reset?: string };
}) {
  // Si déjà connectée, redirect direct vers le dashboard (pas besoin
  // de re-saisir les identifiants à chaque visite).
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const errorMsg = searchParams.error
    ? (ERROR_MESSAGES[searchParams.error] ?? "Une erreur est survenue.")
    : null;

  return (
    // Même fond rose que l'inscription (slot 2 de Guide-moi, Laura 18/11).
    <div
      className="relative -mx-6 -my-10 min-h-dvh overflow-hidden px-6 pb-8 pt-12"
      style={{ background: C.fond, color: C.texte }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full"
        style={{ background: C.clair, opacity: 0.7 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-[50%] h-56 w-56 rounded-full"
        style={{ background: C.soutenu, opacity: 0.45 }}
      />

      <section className="relative space-y-5">
        <header className="space-y-2 text-center">
          <div
            className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,.5)" }}
            aria-hidden
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
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
          <h1 className="font-[family-name:var(--font-playfair)] text-[26px] font-semibold leading-tight">
            Bon retour
          </h1>
          <p className="text-[13px]" style={{ color: C.accent }}>
            Connectez-vous pour retrouver le contenu adapté à votre bébé.
          </p>
        </header>

        {searchParams.registered === "1" ? (
          <p className="rounded-[14px] p-3 text-sm" style={{ background: C.clair }}>
            Votre compte a été créé. Un email de confirmation vous a été envoyé.
          </p>
        ) : null}
        {searchParams.reset === "sent" ? (
          <p className="rounded-[14px] p-3 text-sm" style={{ background: C.clair }}>
            Si un compte existe pour cet email, un lien pour choisir un nouveau
            mot de passe vient de vous être envoyé.
          </p>
        ) : null}
        {errorMsg ? (
          <p
            className="rounded-[14px] p-3 text-sm"
            style={{ background: "#FFF4F1", color: "#8A2E1E" }}
          >
            {errorMsg}
          </p>
        ) : null}

        <form action={loginAction} className="space-y-4">
          <div
            className="space-y-3 rounded-[22px] p-4"
            style={{ background: "rgba(255,255,255,.38)" }}
          >
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
            <label className="block space-y-1">
              <Etiquette>Mot de passe</Etiquette>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className={champ}
                style={champStyle}
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl px-6 py-3.5 text-base font-semibold text-white shadow-[0_6px_18px_-8px_rgba(94,51,40,.55)] transition active:scale-[.98]"
            style={{ background: C.accent }}
          >
            Se connecter
          </button>
        </form>

        <div className="flex flex-col gap-2 text-center text-sm" style={{ color: C.accent }}>
          <Link href="/reset" className="underline">
            Mot de passe oublié ?
          </Link>
          <Link href="/register">
            Pas encore de compte ?{" "}
            <span className="font-semibold underline" style={{ color: C.texte }}>
              Créer un compte
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { C_INSCRIPTION as C } from "@/lib/couleurs-inscription";
import { nouveauMotDePasseAction } from "./actions";

// « Choisir un nouveau mot de passe » (Laura, 18/11/2026). On y arrive par
// le lien de l'email « Mot de passe oublié », qui connecte le parent.
const ERROR_MESSAGES: Record<string, string> = {
  mot_de_passe_court: "Le mot de passe doit contenir au moins 8 caractères.",
  mots_de_passe_differents: "Les deux mots de passe ne correspondent pas.",
  meme_mot_de_passe: "Choisissez un mot de passe différent de l'ancien.",
  echec: "L'enregistrement a échoué. Réessayez dans un instant.",
};

const champ =
  "w-full rounded-[14px] border-[1.5px] px-3.5 py-2.5 text-base outline-none transition focus:border-[#9A5444] focus:bg-white focus:ring-2 focus:ring-[#9A5444]/15";
const champStyle = {
  background: "rgba(255,255,255,.62)",
  borderColor: C.soutenu,
  color: C.texte,
};

export default async function NouveauMotDePassePage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?error=lien_expire");

  const errorMsg = searchParams.error
    ? (ERROR_MESSAGES[searchParams.error] ?? "Une erreur est survenue.")
    : null;

  return (
    <div
      className="relative -mx-6 -my-10 min-h-dvh overflow-hidden px-6 pb-8 pt-14"
      style={{ background: C.fond, color: C.texte }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full"
        style={{ background: C.clair, opacity: 0.7 }}
      />

      <section className="relative space-y-5">
        <header className="space-y-2 text-center">
          <div
            className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,.55)" }}
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
              <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
              <path d="M8.5 10.5V7.5a3.5 3.5 0 017 0v3" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-[24px] font-semibold leading-tight">
            Nouveau mot de passe
          </h1>
          <p className="text-[13px]" style={{ color: C.accent }}>
            Choisissez-le, puis vous retrouverez l&apos;app.
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

        <form action={nouveauMotDePasseAction} className="space-y-4">
          <div
            className="space-y-3 rounded-[22px] p-4"
            style={{ background: "rgba(255,255,255,.38)" }}
          >
            {[
              { name: "password", label: "Nouveau mot de passe", ph: "8 caractères minimum" },
              { name: "confirm", label: "Confirmation", ph: "Le même" },
            ].map((f) => (
              <label key={f.name} className="block space-y-1">
                <span
                  className="block text-[10px] font-bold uppercase tracking-[.08em]"
                  style={{ color: C.accent }}
                >
                  {f.label}
                </span>
                <input
                  type="password"
                  name={f.name}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder={f.ph}
                  className={`${champ} placeholder:text-[#B98577]`}
                  style={champStyle}
                />
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl px-6 py-3.5 text-base font-semibold text-white shadow-[0_6px_18px_-8px_rgba(94,51,40,.55)] transition active:scale-[.98]"
            style={{ background: C.accent }}
          >
            Enregistrer
          </button>
        </form>
      </section>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { C_INSCRIPTION as C } from "@/lib/couleurs-inscription";
import { resetAction } from "./actions";

// « Mot de passe oublié », au fond rose de l'inscription (Laura, 18/11/2026).
export default async function ResetPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const errorMsg =
    searchParams.error === "email_manquant"
      ? "Merci de renseigner votre email."
      : null;

  return (
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
              <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
              <path d="M8.5 10.5V7.5a3.5 3.5 0 017 0v3" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-[26px] font-semibold leading-tight">
            Mot de passe oublié
          </h1>
          <p className="text-[13px]" style={{ color: C.accent }}>
            Indiquez votre email : vous recevrez un lien pour en choisir un
            nouveau.
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

        <form action={resetAction} className="space-y-4">
          <div
            className="rounded-[22px] p-4"
            style={{ background: "rgba(255,255,255,.38)" }}
          >
            <label className="block space-y-1">
              <span
                className="block text-[10px] font-bold uppercase tracking-[.08em]"
                style={{ color: C.accent }}
              >
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="w-full rounded-[14px] border-[1.5px] px-3.5 py-2.5 text-base outline-none transition focus:border-[#9A5444] focus:bg-white focus:ring-2 focus:ring-[#9A5444]/15"
                style={{
                  background: "rgba(255,255,255,.62)",
                  borderColor: C.soutenu,
                  color: C.texte,
                }}
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl px-6 py-3.5 text-base font-semibold text-white shadow-[0_6px_18px_-8px_rgba(94,51,40,.55)] transition active:scale-[.98]"
            style={{ background: C.accent }}
          >
            Envoyer le lien
          </button>
        </form>

        <p className="text-center text-sm" style={{ color: C.accent }}>
          <Link
            href="/login"
            className="font-semibold underline"
            style={{ color: C.texte }}
          >
            Retour à la connexion
          </Link>
        </p>
      </section>
    </div>
  );
}

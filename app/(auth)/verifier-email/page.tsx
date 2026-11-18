import Link from "next/link";
import { C_INSCRIPTION as C } from "@/lib/couleurs-inscription";

// Écran affiché juste après l'inscription : le parent doit confirmer son
// adresse en touchant le bouton de l'email (Laura, 18/11/2026).
export default function VerifierEmailPage() {
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
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-[55%] h-56 w-56 rounded-full"
        style={{ background: C.soutenu, opacity: 0.45 }}
      />

      <section className="relative space-y-5 text-center">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,.55)" }}
          aria-hidden
        >
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10"
            fill="none"
            stroke={C.accent}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
            <path d="M3.8 7l8.2 6 8.2-6" />
          </svg>
        </div>

        <header className="space-y-2">
          <p
            className="text-[10px] font-bold uppercase tracking-[.08em]"
            style={{ color: C.accent }}
          >
            Plus qu&apos;une étape
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-[26px] font-semibold leading-tight">
            Ouvrez vos emails
          </h1>
        </header>

        <p className="text-[15px] leading-relaxed">
          Nous venons de vous envoyer un email. Touchez le bouton{" "}
          <b>« Confirmer mon adresse »</b> : votre compte sera activé et vous
          pourrez présenter votre bébé.
        </p>

        <div
          className="space-y-1.5 rounded-[22px] p-4 text-left text-[13px] leading-snug"
          style={{ background: "rgba(255,255,255,.38)" }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[.08em]"
            style={{ color: C.accent }}
          >
            Rien reçu ?
          </p>
          <p>Attendez une minute, puis regardez dans vos courriers indésirables.</p>
          <p>Vérifiez aussi l&apos;adresse saisie à l&apos;inscription.</p>
        </div>

        <p className="text-sm" style={{ color: C.accent }}>
          Adresse déjà confirmée ?{" "}
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

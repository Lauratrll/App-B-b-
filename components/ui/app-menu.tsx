"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------------
// Menu « 3 traits » de l'en-tête (choix Laura, 20/10/2026) : les réglages.
// Mon bébé · Mes informations · Mon abonnement ; puis Nous contacter et
// Mentions légales (à remplir) ; Se déconnecter en bas.
// Panneau qui glisse depuis la gauche, fermé par le fond, la croix ou Échap.
// ----------------------------------------------------------------------------

const TEXT = "#3A3228";
const MUTED = "#8A9E98";

const ENTREES = [
  { href: "/profil", label: "Mon bébé" },
  { href: "/compte", label: "Mes informations" },
  { href: "/abonnement", label: "Mon abonnement" },
] as const;

// Pages encore vides, placées pour ne pas les oublier (Laura, 20/10).
const SECONDAIRES = [
  { href: "/contact", label: "Nous contacter" },
  { href: "/mentions-legales", label: "Mentions légales" },
] as const;

export function AppMenu() {
  const [ouvert, setOuvert] = useState(false);
  const pathname = usePathname();

  // Une navigation referme le menu.
  useEffect(() => {
    setOuvert(false);
  }, [pathname]);

  useEffect(() => {
    if (!ouvert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [ouvert]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        aria-label="Réglages"
        aria-expanded={ouvert}
        className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full"
      >
        <svg
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="none"
          stroke={TEXT}
          strokeWidth={1.6}
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M4.5 7h15" />
          <path d="M4.5 12h15" />
          <path d="M4.5 17h15" />
        </svg>
      </button>

      {/* Fond + panneau, toujours montés pour l'animation. */}
      <div
        className="fixed inset-0 z-50"
        style={{ pointerEvents: ouvert ? "auto" : "none" }}
        aria-hidden={!ouvert}
      >
        <div
          onClick={() => setOuvert(false)}
          className="absolute inset-0 transition-opacity duration-200"
          style={{ background: "rgba(58,50,40,.35)", opacity: ouvert ? 1 : 0 }}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Réglages"
          className="absolute left-0 top-0 flex h-full w-[78%] max-w-[300px] flex-col transition-transform duration-200 ease-out"
          style={{
            background: "#F2EDE8",
            transform: ouvert ? "translateX(0)" : "translateX(-100%)",
            boxShadow: ouvert ? "4px 0 18px rgba(58,50,40,.15)" : "none",
          }}
        >
          <div className="flex items-center justify-between px-5 pb-2 pt-4">
            <p
              className="text-[10px] font-semibold uppercase"
              style={{ letterSpacing: "0.15em", color: MUTED }}
            >
              Réglages
            </p>
            <button
              type="button"
              onClick={() => setOuvert(false)}
              aria-label="Fermer"
              tabIndex={ouvert ? 0 : -1}
              className="-mr-2 flex h-11 w-11 items-center justify-center"
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke={TEXT}
                strokeWidth={1.6}
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-3">
            <ul>
              {ENTREES.map((e) => {
                const actif = pathname === e.href;
                return (
                  <li key={e.href}>
                    <Link
                      href={e.href}
                      tabIndex={ouvert ? 0 : -1}
                      className="flex min-h-[48px] items-center justify-between rounded-[9px] px-3 font-display"
                      style={{
                        fontSize: 17,
                        fontWeight: 600,
                        color: actif ? "#D4604A" : TEXT,
                        background: actif ? "rgba(255,255,255,.55)" : "transparent",
                      }}
                    >
                      {e.label}
                      <span aria-hidden style={{ color: MUTED, fontSize: 16 }}>
                        ›
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="mt-3 border-t pt-3" style={{ borderColor: "#E4DDD6" }}>
              {SECONDAIRES.map((e) => (
                <li key={e.href}>
                  <Link
                    href={e.href}
                    tabIndex={ouvert ? 0 : -1}
                    className="flex min-h-[44px] items-center px-3 text-sm"
                    style={{ color: pathname === e.href ? "#D4604A" : TEXT }}
                  >
                    {e.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <form
            action="/auth/signout"
            method="post"
            className="border-t px-6 py-4"
            style={{ borderColor: "#E4DDD6", paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <button
              type="submit"
              tabIndex={ouvert ? 0 : -1}
              className="min-h-[44px] text-sm underline underline-offset-2"
              style={{ color: MUTED }}
            >
              Se déconnecter
            </button>
          </form>
        </aside>
      </div>
    </>
  );
}

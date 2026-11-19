"use client";

import { useEffect, useRef, useState } from "react";

// « Thème du mois » (Laura, 19/11/2026) : l'encart de l'initiale, en haut à gauche
// de l'accueil, devient un bouton qui ouvre un panneau plein écran avec le mot du
// mois et son texte. Textes validés et lus à voix
// haute (content/Compétences bébé/themes_du_mois.json) : affichés tels quels.
// Le panneau reste sur l'accueil : « Retour » le ferme et rend la main au bouton.

const FOND = "#FAEEE9"; // fond de l'accueil
const TEXTE = "#3A3228";
const BRUN = "#8A4030";
const ROSE = "#F5D0C8"; // fond de la case Guide-moi, celui de l'encart
const AUREOLES = ["#E3AFA0", "#EABDB1"] as const; // auréoles de la case Guide-moi (accueil-vue.tsx)
const GRIS = "#8A9E98"; // gris du Retour de la barre du bas

export type ThemeDuMoisData = {
  mot: string;
  texte: string;
  introCourte: string;
};

export function ThemeDuMois({ initiale, theme }: { initiale: string; theme: ThemeDuMoisData }) {
  const [ouvert, setOuvert] = useState(false);
  const declencheur = useRef<HTMLButtonElement>(null);
  const retour = useRef<HTMLButtonElement>(null);
  const dejaOuvert = useRef(false);

  useEffect(() => {
    if (!ouvert) {
      // Rend le focus au bouton de l'initiale (pas au premier affichage).
      if (dejaOuvert.current) declencheur.current?.focus();
      return;
    }
    dejaOuvert.current = true;
    retour.current?.focus();
    const echap = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    document.addEventListener("keydown", echap);
    const defilement = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", echap);
      document.body.style.overflow = defilement;
    };
  }, [ouvert]);

  return (
    <>
      <button
        ref={declencheur}
        type="button"
        onClick={() => setOuvert(true)}
        aria-label={`Thème du mois : ${theme.mot}`}
        aria-haspopup="dialog"
        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-[22px] font-semibold transition-transform active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          backgroundColor: ROSE,
          // Indice « bouton » (Laura, 19/11) : auréoles et ombre de la case Guide-moi de l'accueil.
          backgroundImage: `radial-gradient(circle at 0% 0%, ${AUREOLES[0]} 0, ${AUREOLES[0]}00 78%), radial-gradient(circle at 100% 100%, ${AUREOLES[1]}D9 0, ${AUREOLES[1]}00 62%)`,
          boxShadow: "0 8px 18px -8px rgba(110,60,45,.30), 0 2px 4px rgba(110,60,45,.06)",
          color: BRUN,
          ["--tw-ring-color" as string]: BRUN,
          ["--tw-ring-offset-color" as string]: FOND,
        }}
      >
        {initiale}
      </button>

      {ouvert ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="theme-du-mois-titre"
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ background: FOND }}
        >
          <div
            className="mx-auto flex min-h-full w-full max-w-[390px] flex-col px-5"
            style={{ paddingTop: "max(24px, env(safe-area-inset-top))", paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}
          >
            <div className="my-auto py-6">
              <p
                className="text-center"
                style={{ fontSize: 9, color: BRUN, letterSpacing: ".07em", textTransform: "uppercase", fontWeight: 600 }}
              >
                Thème du mois
              </p>
              <h2
                id="theme-du-mois-titre"
                className="mt-2 text-center font-display font-bold"
                style={{ fontSize: 26, color: TEXTE, letterSpacing: "-.015em", lineHeight: 1.1 }}
              >
                {theme.mot}
              </h2>
              {theme.introCourte ? (
                <p className="mt-2 text-center italic" style={{ fontSize: 12, color: BRUN, lineHeight: 1.4 }}>
                  {theme.introCourte}
                </p>
              ) : null}

              <p className="mt-6" style={{ fontSize: 15, color: TEXTE, lineHeight: 1.6 }}>
                {theme.texte}
              </p>

              {/* « À propos de ce repère » (introduction.texte) retiré à la demande de Laura, 19/11. */}
            </div>

            <button
              ref={retour}
              type="button"
              onClick={() => setOuvert(false)}
              aria-label="Retour : Accueil"
              className="flex items-center gap-1.5 self-start rounded-full transition-transform active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2"
              style={{ height: 40, padding: "0 14px 0 10px", background: "rgba(255,255,255,.55)", ["--tw-ring-color" as string]: BRUN }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={GRIS} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M14.5 5.5L8 12l6.5 6.5" />
              </svg>
              <span style={{ fontSize: 10, color: GRIS, letterSpacing: ".07em", textTransform: "uppercase", fontWeight: 600 }}>
                Accueil
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

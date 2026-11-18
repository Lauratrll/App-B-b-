"use client";

import { useEffect, useRef, useState } from "react";
import { C_INSCRIPTION as C } from "@/lib/couleurs-inscription";

// Installer l'app sur le téléphone (Laura, 18/11/2026).
//
// Le moment : quand le parent VALIDE le profil de son bébé (« Présentez
// votre bébé », /profil), après la confirmation de son email. Bouton
// « Valider et installer l'app » :
// - Android (Chrome, Edge, Samsung Internet) : la fenêtre « Installer » du
//   téléphone s'ouvre, puis le profil est enregistré, que le parent accepte
//   ou non. Si le navigateur ne propose pas la fenêtre, on indique le menu ⋮
//   sur l'accueil.
// - iPhone : Apple ne permet à aucun site de s'installer seul ; le profil
//   est enregistré, puis l'accueil montre les gestes (Partager → Sur l'écran
//   d'accueil).
// - Ordinateur, ou app déjà ouverte depuis son icône : simple validation.

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Appareil = "iphone" | "android" | null;

const CLE_AIDE = "aide_installation"; // "iphone" | "android"

function estInstallee(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function detecterAppareil(): Appareil {
  const ua = navigator.userAgent;
  if (
    /iPhone|iPad|iPod/.test(ua) ||
    (ua.includes("Macintosh") && navigator.maxTouchPoints > 1)
  ) {
    return "iphone";
  }
  if (/Android/.test(ua)) return "android";
  return null;
}

/** Bouton d'envoi du formulaire « Présentez votre bébé ». */
export function BoutonValiderInstaller({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const invite = useRef<InstallPromptEvent | null>(null);
  const [appareil, setAppareil] = useState<Appareil>(null);
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    if (estInstallee()) return;
    setAppareil(detecterAppareil());
    const garder = (e: Event) => {
      e.preventDefault();
      invite.current = e as InstallPromptEvent;
    };
    window.addEventListener("beforeinstallprompt", garder);
    return () => window.removeEventListener("beforeinstallprompt", garder);
  }, []);

  async function surClic(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.form;
    if (!form || !appareil) return; // envoi normal
    e.preventDefault();
    if (!form.reportValidity()) return;
    setEnvoi(true);

    const evt = invite.current;
    if (evt) {
      try {
        await evt.prompt();
        await evt.userChoice;
      } catch {
        // fenêtre refusée par le navigateur : on enregistre quand même
      }
      invite.current = null;
    } else {
      // Pas de fenêtre possible : l'accueil montrera comment faire.
      try {
        localStorage.setItem(CLE_AIDE, appareil);
      } catch {}
    }
    form.requestSubmit();
  }

  return (
    <button
      type="submit"
      onClick={surClic}
      disabled={envoi}
      className={className}
      style={style}
    >
      {appareil ? "Valider et installer l'app" : "Valider"}
    </button>
  );
}

function IconePartager() {
  return (
    <svg
      aria-label="Partager"
      viewBox="0 0 24 24"
      className="inline h-4 w-4 align-[-2px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 15V3M8 7l4-4 4 4" />
      <path d="M7 10H5v11h14V10h-2" />
    </svg>
  );
}

/** Sur l'accueil, juste après la validation du profil, quand le téléphone
 *  n'a pas pu ouvrir sa fenêtre d'installation : les gestes à faire, dans
 *  une fenêtre rose qui se ferme. Affichée une seule fois. */
export function AideInstallationAccueil() {
  const [appareil, setAppareil] = useState<Appareil>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem(CLE_AIDE);
      if ((v === "iphone" || v === "android") && !estInstallee()) {
        setAppareil(v);
      }
    } catch {}
  }, []);

  if (!appareil) return null;

  function fermer() {
    try {
      localStorage.removeItem(CLE_AIDE);
    } catch {}
    setAppareil(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-4 pb-8"
      onClick={fermer}
    >
      <div
        role="dialog"
        aria-label="Installer l'app sur mon téléphone"
        className="w-full max-w-[358px] rounded-[22px] p-5 text-sm leading-relaxed shadow-xl"
        style={{ background: C.fond, color: C.texte }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className="mb-2 text-[10px] font-bold uppercase tracking-[.08em]"
          style={{ color: C.accent }}
        >
          Installer l&apos;app sur mon téléphone
        </p>
        {appareil === "iphone" ? (
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              Touchez Partager <IconePartager /> en bas de Safari.
            </li>
            <li>Choisissez « Sur l&apos;écran d&apos;accueil ».</li>
            <li>
              Ouvrez l&apos;app depuis son icône et connectez-vous une fois.
            </li>
          </ol>
        ) : (
          <p>
            Touchez le menu ⋮ de votre navigateur, puis « Installer
            l&apos;application » (ou « Ajouter à l&apos;écran d&apos;accueil »).
          </p>
        )}
        <button
          type="button"
          onClick={fermer}
          className="mt-4 w-full rounded-2xl px-5 py-3 text-[15px] font-semibold text-white"
          style={{ background: C.accent }}
        >
          C&apos;est noté
        </button>
      </div>
    </div>
  );
}

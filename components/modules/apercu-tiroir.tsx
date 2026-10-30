"use client";

import { useEffect, useRef, useState } from "react";

// ----------------------------------------------------------------------------
// Tiroir du bandeau admin (Laura, 29/10) : caché par défaut, pour voir l'app
// comme un parent. Il descend quand on glisse l'écran vers le bas alors qu'on
// est tout en haut de la page (sur ordinateur : molette vers le haut, en haut
// de page). Il remonte en glissant vers le haut, en touchant l'écran ailleurs,
// ou tout seul après un changement (la page se recharge).
// 30/10 : le geste était trop difficile à trouver. Une petite poignée discrète,
// en haut au centre, ouvre aussi le tiroir d'un simple toucher (admins seulement).
// ----------------------------------------------------------------------------

const SEUIL = 45; // px à glisser pour ouvrir

export function ApercuTiroir({ children }: { children: React.ReactNode }) {
  const [ouvert, setOuvert] = useState(false);
  const tiroir = useRef<HTMLDivElement>(null);
  const depart = useRef<number | null>(null);
  const cumulMolette = useRef(0);

  useEffect(() => {
    // Pas de « tirer pour rafraîchir » du navigateur : le geste sert au tiroir (admins seulement).
    const avant = document.body.style.overscrollBehaviorY;
    document.body.style.overscrollBehaviorY = "contain";

    const enHaut = () => window.scrollY <= 0;
    const surTiroir = (e: Event) => !!tiroir.current?.contains(e.target as Node);

    const debut = (e: TouchEvent) => {
      depart.current = e.touches[0].clientY;
    };
    const glisse = (e: TouchEvent) => {
      if (depart.current === null) return;
      const dy = e.touches[0].clientY - depart.current;
      if (!ouvert && dy > SEUIL && enHaut()) {
        setOuvert(true);
        depart.current = null;
      } else if (ouvert && dy < -40) {
        setOuvert(false);
        depart.current = null;
      }
    };
    const fin = () => {
      depart.current = null;
    };
    // Molette ou pavé tactile : on additionne les petits crans vers le haut.
    const molette = (e: WheelEvent) => {
      if (ouvert || !enHaut() || e.deltaY >= 0) {
        cumulMolette.current = 0;
        return;
      }
      cumulMolette.current += -e.deltaY;
      if (cumulMolette.current > 40) {
        cumulMolette.current = 0;
        setOuvert(true);
      }
    };
    const toucheAilleurs = (e: Event) => {
      if (ouvert && !surTiroir(e)) setOuvert(false);
    };

    window.addEventListener("touchstart", debut, { passive: true });
    window.addEventListener("touchmove", glisse, { passive: true });
    window.addEventListener("touchend", fin, { passive: true });
    window.addEventListener("wheel", molette, { passive: true });
    window.addEventListener("pointerdown", toucheAilleurs);
    return () => {
      document.body.style.overscrollBehaviorY = avant;
      window.removeEventListener("touchstart", debut);
      window.removeEventListener("touchmove", glisse);
      window.removeEventListener("touchend", fin);
      window.removeEventListener("wheel", molette);
      window.removeEventListener("pointerdown", toucheAilleurs);
    };
  }, [ouvert]);

  return (
    <>
      {/* Poignée discrète : un toucher ouvre le bandeau. */}
      {!ouvert && (
        <button
          type="button"
          aria-label="Ouvrir le bandeau d'aperçu admin"
          onClick={() => setOuvert(true)}
          style={{
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 40,
            width: 80,
            height: 24,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: 6,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              width: 40,
              height: 5,
              borderRadius: 3,
              background: "rgba(0,0,0,.22)",
            }}
          />
        </button>
      )}
      <div
        ref={tiroir}
        aria-hidden={!ouvert}
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          width: "100%",
          maxWidth: 390,
          zIndex: 40,
          transform: `translate(-50%, ${ouvert ? "0" : "-100%"})`,
          transition: "transform 220ms ease",
          boxShadow: ouvert ? "0 4px 12px rgba(0,0,0,.08)" : "none",
          visibility: ouvert ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </>
  );
}

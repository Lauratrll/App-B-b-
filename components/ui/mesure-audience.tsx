"use client";

// Mesure d'audience Vercel (Laura, 18/11/2026) : globale et anonyme, sans
// cookie, jamais reliée à un compte. Les visites des admins ne sont pas
// comptées : dès qu'un admin ouvre l'app, son appareil est marqué (stockage
// local du navigateur) et plus rien n'est envoyé depuis cet appareil, même
// sur les pages de connexion.

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";

const CLE_SANS_MESURE = "beserene_sans_mesure";

function appareilExclu(): boolean {
  try {
    return window.localStorage.getItem(CLE_SANS_MESURE) === "1";
  } catch {
    return false;
  }
}

export function MesureAudience() {
  return (
    <Analytics beforeSend={(event) => (appareilExclu() ? null : event)} />
  );
}

// Rendu seulement pour les admins (app/(app)/layout.tsx).
export function ExclureAppareilDeLaMesure() {
  useEffect(() => {
    try {
      window.localStorage.setItem(CLE_SANS_MESURE, "1");
    } catch {
      // Stockage bloqué (navigation privée) : rien à faire.
    }
  }, []);
  return null;
}

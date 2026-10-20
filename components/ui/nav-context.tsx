"use client";

import { createContext, useContext, useEffect, useState } from "react";

// ----------------------------------------------------------------------------
// Ce qu'une page confie à la barre du bas (choix Laura, 20/10/2026) : le
// bouton « épingler » ne vit plus en haut de la fiche, il apparaît dans la
// barre, à côté des Épinglés. La page le déclare avec <NavPin … /> ; la barre
// le retire dès qu'on quitte la page. Même principe pour le Retour quand son
// libellé dépend des données (le nom de la catégorie) : <NavBack … />.
// ----------------------------------------------------------------------------

export type NavPinConfig = {
  contentId: string;
  isPinned: boolean;
  returnUrl: string;
};

export type NavBackConfig = { href: string; label: string };

type NavState = {
  pin: NavPinConfig | null;
  setPin: (pin: NavPinConfig | null) => void;
  back: NavBackConfig | null;
  setBack: (back: NavBackConfig | null) => void;
};

const NavContext = createContext<NavState>({
  pin: null,
  setPin: () => {},
  back: null,
  setBack: () => {},
});

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [pin, setPin] = useState<NavPinConfig | null>(null);
  const [back, setBack] = useState<NavBackConfig | null>(null);
  return (
    <NavContext.Provider value={{ pin, setPin, back, setBack }}>{children}</NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext);
}

/** Déclare le contenu épinglable de la page. Ne rend rien. */
export function NavPin({ contentId, isPinned, returnUrl }: NavPinConfig) {
  const { setPin } = useNav();
  useEffect(() => {
    setPin({ contentId, isPinned, returnUrl });
    return () => setPin(null);
  }, [contentId, isPinned, returnUrl, setPin]);
  return null;
}

/** Déclare le Retour de la page quand la barre ne peut pas le deviner. */
export function NavBack({ href, label }: NavBackConfig) {
  const { setBack } = useNav();
  useEffect(() => {
    setBack({ href, label });
    return () => setBack(null);
  }, [href, label, setBack]);
  return null;
}

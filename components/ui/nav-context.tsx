"use client";

import { createContext, useContext, useEffect, useState } from "react";

// ----------------------------------------------------------------------------
// Ce qu'une page confie à la barre du bas (choix Laura, 20/10/2026) : le
// bouton « épingler » ne vit plus en haut de la fiche, il apparaît dans la
// barre, à côté des Épinglés. La page le déclare avec <NavPin … /> ; la barre
// le retire dès qu'on quitte la page.
// ----------------------------------------------------------------------------

export type NavPinConfig = {
  contentId: string;
  isPinned: boolean;
  returnUrl: string;
};

type NavState = {
  pin: NavPinConfig | null;
  setPin: (pin: NavPinConfig | null) => void;
};

const NavContext = createContext<NavState>({ pin: null, setPin: () => {} });

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [pin, setPin] = useState<NavPinConfig | null>(null);
  return <NavContext.Provider value={{ pin, setPin }}>{children}</NavContext.Provider>;
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

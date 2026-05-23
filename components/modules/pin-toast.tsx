"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const MESSAGES: Record<string, { text: string; className: string }> = {
  ajoute: {
    text: "✓ Épinglé",
    className: "bg-emerald-600 text-white",
  },
  retire: {
    text: "Épingle retirée",
    className: "bg-neutral-800 text-white",
  },
  erreur: {
    text: "Une erreur est survenue",
    className: "bg-red-600 text-white",
  },
  non_eligible: {
    text: "Ce contenu n'est pas épinglable",
    className: "bg-neutral-800 text-white",
  },
};

export function PinToast() {
  const searchParams = useSearchParams();
  const status = searchParams.get("epingle");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status && MESSAGES[status]) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [status]);

  if (!visible || !status || !MESSAGES[status]) return null;
  const m = MESSAGES[status];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-sm font-medium shadow-lg ${m.className}`}
    >
      {m.text}
    </div>
  );
}

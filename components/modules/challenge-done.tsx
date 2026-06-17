"use client";

import { useEffect, useState } from "react";

const STORAGE_PREFIX = "beserene:challenge-done:";

function readDone(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + id) === "1";
  } catch {
    return false;
  }
}

function writeDone(id: string, done: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (done) {
      window.localStorage.setItem(STORAGE_PREFIX + id, "1");
    } else {
      window.localStorage.removeItem(STORAGE_PREFIX + id);
    }
  } catch {
    /* ignorer (quota plein, mode privé, etc.) */
  }
}

export function ChallengeDone({ id }: { id: string }) {
  // Premier rendu serveur : non monté → on n'affiche rien d'asymétrique
  const [hydrated, setHydrated] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(readDone(id));
    setHydrated(true);
  }, [id]);

  const toggle = () => {
    const next = !done;
    setDone(next);
    writeDone(id, next);
  };

  if (!hydrated) {
    return (
      <div className="h-12 animate-pulse rounded-full bg-amber-100/60" aria-hidden />
    );
  }

  if (done) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <span aria-hidden>✓</span>
        Challenge réalisé
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={false}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      <span aria-hidden>✓</span>
      Marquer comme réalisé
    </button>
  );
}

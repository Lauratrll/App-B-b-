"use client";

import { useEffect, useState } from "react";

type DoneState = { done: boolean; date?: string };

const STORAGE_PREFIX = "beserene:challenge-done:";

function readState(id: string): DoneState {
  if (typeof window === "undefined") return { done: false };
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + id);
    if (!raw) return { done: false };
    const parsed = JSON.parse(raw) as DoneState;
    return parsed?.done ? parsed : { done: false };
  } catch {
    return { done: false };
  }
}

function writeState(id: string, state: DoneState): void {
  if (typeof window === "undefined") return;
  try {
    if (state.done) {
      window.localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(state));
    } else {
      window.localStorage.removeItem(STORAGE_PREFIX + id);
    }
  } catch {
    /* ignorer (quota plein, mode privé, etc.) */
  }
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function ChallengeDone({ id }: { id: string }) {
  // Premier rendu serveur : non monté → on n'affiche rien d'asymétrique
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<DoneState>({ done: false });

  useEffect(() => {
    setState(readState(id));
    setHydrated(true);
  }, [id]);

  const markDone = () => {
    const next = { done: true, date: new Date().toISOString() };
    setState(next);
    writeState(id, next);
  };

  const undo = () => {
    const next = { done: false };
    setState(next);
    writeState(id, next);
  };

  if (!hydrated) {
    return (
      <div className="h-12 animate-pulse rounded-full bg-amber-100/60" aria-hidden />
    );
  }

  if (state.done) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <span className="inline-flex items-center gap-2 font-medium">
          <span aria-hidden>✓</span>
          Challenge réalisé
          {state.date ? (
            <span className="font-normal text-emerald-800/70">
              · {formatDate(state.date)}
            </span>
          ) : null}
        </span>
        <button
          type="button"
          onClick={undo}
          className="text-xs font-medium text-emerald-800 underline-offset-2 hover:underline"
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={markDone}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      <span aria-hidden>✓</span>
      Marquer comme réalisé
    </button>
  );
}

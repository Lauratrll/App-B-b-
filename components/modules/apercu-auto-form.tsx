"use client";

import { setApercu } from "@/app/(app)/apercu-actions";

// Formulaire du bandeau admin : il s'envoie dès qu'un menu change,
// sans bouton à cliquer (Laura, 27/10).
export function ApercuAutoForm({ children }: { children: React.ReactNode }) {
  return (
    <form
      action={setApercu}
      onChange={(e) => e.currentTarget.requestSubmit()}
      className="flex flex-nowrap items-center gap-1.5"
    >
      {children}
    </form>
  );
}

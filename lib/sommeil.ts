// Rubrique Sommeil, nouvelle structure (06/10) : 1. Comprendre son sommeil ·
// 2. Son rythme · 3. La boîte à outils · toujours accessibles : La sécurité,
// Il se réveille plus que d'habitude ?
//
// Source : content/sommeil/M{n}_sommeil.md, converti en
// content/sommeil/sommeil.json par scripts/sommeil-md-vers-json.mjs (lancé par
// `npm run dev` et `npm run build`). Import statique, pas de Supabase.
import donnees from "@/content/sommeil/sommeil.json";

export type SommeilBloc =
  | { type: "p"; texte: string }
  | { type: "citation"; texte: string }
  | { type: "liste"; items: string[] };

export type SommeilVolet = { titre: string | null; blocs: SommeilBloc[] };

export type SommeilSection = {
  id: string;
  titre: string;
  chapeau: string | null;
  volets: SommeilVolet[];
  sources: string | null;
};

export type SommeilPartie = {
  id: string;
  titre: string;
  sections: SommeilSection[];
  sources: string | null;
};

export type SommeilMois = {
  mois: number;
  exergue: string | null;
  parties: SommeilPartie[];
};

const SOMMEIL = donnees as unknown as Record<string, SommeilMois>;

export function getSommeil(mois: number): SommeilMois | null {
  return SOMMEIL[String(mois)] ?? null;
}

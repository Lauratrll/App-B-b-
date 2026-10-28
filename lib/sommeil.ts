// Rubrique Sommeil, nouvelle structure (06/10) : 1. Comprendre son sommeil ·
// 2. Son rythme · 3. La boîte à outils · toujours accessibles : La sécurité,
// Il se réveille plus que d'habitude ?
//
// Sources (28/10) : un fichier par tranche d'âge,
// content/sommeil/T{n}_M{debut}-M{fin}_sommeil.json, généré depuis les .md par
// scripts/sommeil-md-vers-json.mjs (lancé par `npm run dev` et `npm run build`).
// Import statique, pas de Supabase.
import sommeilAncien from "@/content/sommeil/sommeil.json";
import t1 from "@/content/sommeil/T1_M0-M1_sommeil.json";
import t2 from "@/content/sommeil/T2_M2-M5_sommeil.json";
import t3 from "@/content/sommeil/T3_M6-M8_sommeil.json";
import t4 from "@/content/sommeil/T4_M9-M11_sommeil.json";
import t5 from "@/content/sommeil/T5_M12-M14_sommeil.json";
import t6 from "@/content/sommeil/T6_M15-M17_sommeil.json";
import t7 from "@/content/sommeil/T7_M18-M23_sommeil.json";

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

type SommeilTranche = {
  tranche: { debut: number; fin: number };
  exergue: string | null;
  parties: SommeilPartie[];
};

const TRANCHES = [t1, t2, t3, t4, t5, t6, t7] as unknown as SommeilTranche[];

// ─── EMPRUNT TEMPORAIRE (28/10) ───────────────────────────────────────────
// Les tranches n'ont pas encore « La boîte à outils » ni « Toujours
// accessible » : on reprend celles de sommeil.json, mois le plus proche
// (3 pour M0-M5, 9 pour M6-M11, 20 pour M12-M23).
// Pour retirer l'emprunt : passer EMPRUNT_ACTIF à false (puis, quand plus
// rien n'en dépend, supprimer ce bloc et l'import de sommeil.json).
const EMPRUNT_ACTIF = true;
const PARTIES_EMPRUNTEES = ["la-boite-a-outils", "toujours-accessible"];
const ANCIEN = sommeilAncien as unknown as Record<string, SommeilMois>;

function moisEmprunt(mois: number): string {
  if (mois <= 5) return "3";
  if (mois <= 11) return "9";
  return "20";
}

function emprunter(mois: number, parties: SommeilPartie[]): SommeilPartie[] {
  if (!EMPRUNT_ACTIF) return parties;
  const source = ANCIEN[moisEmprunt(mois)];
  if (!source) return parties;
  const ajouts = PARTIES_EMPRUNTEES.filter(
    (id) => !parties.some((pt) => pt.id === id),
  )
    .map((id) => source.parties.find((pt) => pt.id === id))
    .filter((pt): pt is SommeilPartie => Boolean(pt));
  return [...parties, ...ajouts];
}
// ─── fin de l'emprunt temporaire ──────────────────────────────────────────

export function getSommeil(mois: number): SommeilMois | null {
  const t = TRANCHES.find(
    (x) => mois >= x.tranche.debut && mois <= x.tranche.fin,
  );
  if (!t) return null;
  return { mois, exergue: t.exergue, parties: emprunter(mois, t.parties) };
}

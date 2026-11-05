// ----------------------------------------------------------------------------
// « Que me dit bébé ? » : le moteur de calcul (05/11/2026).
//
// Fonction PURE : elle reçoit le contenu (signaux_bebe.json), l'âge et les
// réponses cochées, et renvoie le résultat. Elle n'enregistre rien, n'appelle
// rien, ne lit ni base ni cookie : tout vit en mémoire dans la page (règle de
// confidentialité du prompt, §7).
//
// La spécification est le champ `algorithme` du JSON, calqué sur l'onglet
// « Résultat » du classeur Signaux_bebe_reference.xlsx. Validé par
// scripts/test-signaux-bebe.mjs (les 6 `tests_attendus` du classeur).
//
// Pas d'import ici : le fichier doit pouvoir être lu tel quel par Node
// (scripts de test) comme par Next.
// ----------------------------------------------------------------------------

export type Piste = { code: string; nom: string; libelle: string; action: string };

export type OptionSignal = {
  id: string;
  categorie: string;
  question: string;
  reponse: string;
  age_min: number;
  age_max: number;
  type: "signe" | "alerte" | string;
  points: Record<string, number>;
};

export type Alerte = {
  situation: string;
  pourquoi: string | null;
  a_dire: string | null;
  urgence: string | null;
};

export type Etape = { n: number; texte: string };
export type MessageConditionnel = { id: string; texte: string; quand: string };
export type NiveauConfiance = { quand: string; texte: string };

export type DonneesSignaux = {
  pistes: Piste[];
  options: OptionSignal[];
  alertes: Alerte[];
  etapes: Etape[];
  messages: MessageConditionnel[];
  confiance: NiveauConfiance[];
};

export type PisteClassee = { piste: Piste; score: number; rang: number };

export type ResultatSignaux = {
  /** Réponses cochées ET valables à cet âge (alertes comprises). */
  nbValables: number;
  /** Une réponse « alerte » est cochée et valable : la liste des alertes passe avant tout. */
  alerte: boolean;
  /** Les 3 premières pistes de score > 0. */
  top3: PisteClassee[];
  /** Texte du niveau de confiance (pris dans le JSON). */
  confiance: string;
  /** Textes des messages conditionnels qui s'appliquent. */
  messages: string[];
};

/** Une réponse ne s'affiche et ne compte qu'entre age_min et age_max. */
export function estValable(option: OptionSignal, age: number): boolean {
  return option.age_min <= age && age <= option.age_max;
}

/** Ordre d'affichage des alertes : « Immédiate » d'abord. */
const ORDRE_URGENCE = ["Immédiate", "Rapide", "Pour toi"];

/** Les alertes à montrer aux parents, triées par urgence. Les lignes sans
 *  consigne (« Liste à faire relire… », note de travail du classeur) sont
 *  écartées. Le tri est stable : à urgence égale, l'ordre du classeur reste. */
export function alertesAffichees(alertes: Alerte[]): Alerte[] {
  const rangUrgence = (u: string | null) => {
    const i = ORDRE_URGENCE.indexOf(u ?? "");
    return i === -1 ? ORDRE_URGENCE.length : i;
  };
  return alertes
    .filter((a) => a.a_dire && a.urgence)
    .map((a, i) => ({ a, i }))
    .sort((x, y) => rangUrgence(x.a.urgence) - rangUrgence(y.a.urgence) || x.i - y.i)
    .map(({ a }) => a);
}

/** Retire d'un texte ce qui ne doit pas être montré aux parents : les
 *  identifiants de sources (« (S09) », « (S07, S22) ») et les notes de
 *  travail du classeur (« (action à valider) », « (durée non sourcée) »).
 *  Choix du 05/11/2026 : masquer à l'affichage, le classeur reste intact. */
export function nettoyerTexte(texte: string): string {
  return texte
    .replace(/\s*\((?:S\d+\s*,?\s*)+\)/g, "")
    .replace(/\s*\([^()]*(?:à valider|non sourcé)[^()]*\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Le calcul complet. `idsCoches` : identifiants des réponses cochées (o001…). */
export function analyserSignaux(
  donnees: DonneesSignaux,
  age: number,
  idsCoches: Iterable<string>,
): ResultatSignaux {
  const coches = new Set(idsCoches);
  const valables = donnees.options.filter((o) => coches.has(o.id) && estValable(o, age));

  // Score de chaque piste : somme des points des réponses cochées et valables.
  const scores = new Map<string, number>();
  for (const p of donnees.pistes) scores.set(p.code, 0);
  for (const o of valables) {
    for (const [code, pts] of Object.entries(o.points ?? {})) {
      if (scores.has(code)) scores.set(code, (scores.get(code) ?? 0) + pts);
    }
  }

  // Classement : score décroissant, seulement > 0 ; à égalité, l'ordre de la
  // liste « pistes » départage (tri stable sur l'ordre du JSON).
  const classement: PisteClassee[] = donnees.pistes
    .map((piste, i) => ({ piste, score: scores.get(piste.code) ?? 0, i }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x, k) => ({ piste: x.piste, score: x.score, rang: k + 1 }));

  const rang = (code: string): number | null =>
    classement.find((c) => c.piste.code === code)?.rang ?? null;

  const alerte = valables.some((o) => o.type === "alerte");

  // Confiance : mêmes conditions, dans le même ordre, que la formule du classeur.
  const texteConfiance = (i: number) => donnees.confiance[i]?.texte ?? "";
  let confiance: string;
  if (valables.length === 0) confiance = texteConfiance(0);
  else if (classement.length === 0) confiance = texteConfiance(1);
  else if (valables.length < 3) confiance = texteConfiance(2);
  else if (classement[0].score - (classement[1]?.score ?? 0) < 2) confiance = texteConfiance(3);
  else confiance = texteConfiance(4);

  // Messages conditionnels : les conditions du champ `quand`, traduites ici.
  const auPlus = (code: string, n: number) => {
    const r = rang(code);
    return r !== null && r <= n;
  };
  const conditions: Record<string, () => boolean> = {
    m0_dormeur: () => age === 0 && auPlus("FT", 3),
    pleurs_calmer_puis_nourrir: () =>
      valables.some((o) => o.reponse === "Pleurs intenses qui montent, difficiles à calmer"),
    faim_et_fatigue: () => auPlus("FA", 2) && auPlus("FT", 2),
  };
  const messages = donnees.messages
    .filter((m) => conditions[m.id]?.() ?? false)
    .map((m) => m.texte);

  return {
    nbValables: valables.length,
    alerte,
    top3: classement.slice(0, 3),
    confiance,
    messages,
  };
}

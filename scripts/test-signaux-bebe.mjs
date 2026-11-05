// Vérifie le moteur « Que me dit bébé ? » (lib/signaux-bebe.ts) contre les
// 6 scénarios `tests_attendus` calculés par le classeur.
// Lancer : node scripts/test-signaux-bebe.mjs   (Node 22.18+ lit le .ts tel quel)

import { readFileSync } from "node:fs";
import { analyserSignaux, alertesAffichees, nettoyerTexte } from "../lib/signaux-bebe.ts";

const donnees = JSON.parse(
  readFileSync(new URL("../content/signaux-bebe/signaux_bebe.json", import.meta.url), "utf8"),
);

let echecs = 0;
const egal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

for (const t of donnees.tests_attendus) {
  // Le classeur nomme les réponses par leur texte ; un même texte peut exister
  // sur deux tranches d'âge (o052 / o053) : on coche les deux, l'âge trie.
  const ids = donnees.options
    .filter((o) => t.reponses_cochees.includes(o.reponse))
    .map((o) => o.id);
  const r = analyserSignaux(donnees, t.age, ids);
  const a = t.attendu;

  const obtenu = {
    nb_reponses_valables: r.nbValables,
    alerte: r.alerte,
    top3: r.top3.map((c) => ({ nom: c.piste.libelle, score: c.score })),
    confiance: r.confiance,
    messages: r.messages,
  };
  const attendu = {
    nb_reponses_valables: a.nb_reponses_valables,
    alerte: a.alerte !== "Non",
    top3: a.top3,
    confiance: a.confiance,
    messages: a.messages,
  };

  const ecarts = Object.keys(attendu).filter((k) => !egal(obtenu[k], attendu[k]));
  if (ecarts.length === 0) {
    console.log(`OK     ${t.nom}`);
  } else {
    echecs++;
    console.log(`ÉCHEC  ${t.nom}`);
    for (const k of ecarts) {
      console.log(`   ${k}\n     attendu : ${JSON.stringify(attendu[k])}\n     obtenu  : ${JSON.stringify(obtenu[k])}`);
    }
  }
}

// Garde-fous d'affichage : rien d'interne ne doit sortir.
const interdits = /\bS\d{2}\b|à valider|non sourcé|EDPP|formation/i;
const affiches = [
  ...donnees.pistes.map((p) => nettoyerTexte(p.action)),
  ...donnees.etapes.map((e) => nettoyerTexte(e.texte)),
  ...alertesAffichees(donnees.alertes).flatMap((al) => [al.situation, al.a_dire].map((x) => nettoyerTexte(x ?? ""))),
  ...donnees.messages.map((m) => nettoyerTexte(m.texte)),
];
const fuites = affiches.filter((x) => interdits.test(x));
if (fuites.length) {
  echecs++;
  console.log("ÉCHEC  textes internes visibles :", fuites);
} else {
  console.log("OK     aucun texte interne dans ce qui s'affiche");
}
if (donnees.messages.some((m) => /Questionnaire!|\$[A-Z]\$/.test(m.texte))) {
  echecs++;
  console.log("ÉCHEC  un message contient un morceau de formule Excel");
}

console.log(echecs ? `\n${echecs} échec(s)` : "\nTout passe.");
process.exit(echecs ? 1 : 0);

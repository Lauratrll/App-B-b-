// scripts/import-apaisement.mjs
// ===========================================================================
// Rend épinglables les gestes de la rubrique « Gestes d'apaisement » (05/11/2026).
//
// Les fiches sont lues en import statique (content/apaisement/gestes_apaisement.json),
// pas dans Supabase. Une épingle pointe vers une ligne de la table content :
// ce script crée UNE LIGNE PAR GESTE, qui ne porte que l'identifiant et le
// titre : module='apaisement', categorie='geste', situation=<id>, mois=0 (champ
// obligatoire, sans signification ici).
//
// Prérequis : la migration supabase/migrations/0005_add_apaisement_module.sql.
//
// Il ne SUPPRIME jamais rien : supprimer une ligne effacerait les épingles des
// parents (ON DELETE CASCADE). Il crée les lignes manquantes et remet le titre
// à jour sur les autres. Relançable sans risque.
//
//   node scripts/import-apaisement.mjs --dry   → simulation
//   node scripts/import-apaisement.mjs         → écrit
// ===========================================================================

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

const DRY = process.argv.includes("--dry");
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "ERREUR : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env.local",
  );
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const donnees = JSON.parse(readFileSync("content/apaisement/gestes_apaisement.json", "utf8"));
// La cohérence cardiaque n'a pas de fiche : elle renvoie vers /coherence.
const publies = donnees.gestes.filter((g) => g.type !== "lien_coherence_cardiaque");

const { data: existants, error } = await supabase
  .from("content")
  .select("id, situation, data")
  .eq("module", "apaisement");
if (error) {
  console.error("ERREUR lecture :", error.message);
  process.exit(1);
}
const parId = new Map(existants.map((r) => [r.situation, r]));

let crees = 0;
let maj = 0;
for (const p of publies) {
  const data = { id: p.id, titre: p.titre };
  const ligne = parId.get(p.id);
  if (!ligne) {
    crees++;
    console.log(`+ ${p.id} (${p.titre})`);
    if (!DRY) {
      const { error: e } = await supabase.from("content").insert({
        mois: 0,
        module: "apaisement",
        categorie: "geste",
        situation: p.id,
        data,
      });
      if (e) throw new Error(`${p.id} : ${e.message}`);
    }
  } else if (ligne.data?.titre !== p.titre) {
    maj++;
    console.log(`~ ${p.id} : « ${ligne.data?.titre} » → « ${p.titre} »`);
    if (!DRY) {
      const { error: e } = await supabase.from("content").update({ data }).eq("id", ligne.id);
      if (e) throw new Error(`${p.id} : ${e.message}`);
    }
  }
}
console.log(
  `${DRY ? "[simulation] " : ""}${publies.length} gestes : ${crees} créée(s), ${maj} titre(s) mis à jour.`,
);

// scripts/import-reflexo-plantaire.mjs
// ===========================================================================
// Rend épinglables les fiches de l'onglet Réflexologie plantaire (20/10/2026).
//
// Les fiches sont lues en imports statiques (reflexologie/*.json), pas dans
// Supabase. Or une épingle pointe vers une ligne de la table `content`. Ce
// script crée donc UNE LIGNE PAR FICHE PUBLIÉE, qui ne porte que l'identifiant
// et le titre : module='reflexo', categorie='plantaire', situation=<id>,
// mois=0 (champ obligatoire, sans signification ici : la fiche couvre une
// tranche d'âge, l'écran des épingles ne l'affiche pas).
//
// Il ne SUPPRIME jamais rien : supprimer une ligne effacerait les épingles
// des parents (ON DELETE CASCADE). Il crée les lignes manquantes et remet le
// titre à jour sur les autres. Relançable sans risque.
//
//   node scripts/import-reflexo-plantaire.mjs --dry   → simulation
//   node scripts/import-reflexo-plantaire.mjs         → écrit
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

const index = JSON.parse(readFileSync("reflexologie/protocoles-index.json", "utf8"));
const publies = index.protocoles.filter((p) => p.lancement !== false);

const { data: existants, error } = await supabase
  .from("content")
  .select("id, situation, data")
  .eq("module", "reflexo")
  .eq("categorie", "plantaire");
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
        module: "reflexo",
        categorie: "plantaire",
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
  `${DRY ? "[simulation] " : ""}${publies.length} fiches publiées : ${crees} créée(s), ${maj} titre(s) mis à jour.`,
);

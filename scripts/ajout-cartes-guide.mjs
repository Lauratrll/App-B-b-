// scripts/ajout-cartes-guide.mjs
// ===========================================================================
// AJOUTE dans Supabase les cartes Guide-moi présentes dans les fichiers
// (content/guide-moi/mois-XX/) mais absentes de la base, SANS rien supprimer :
// les lignes existantes et leurs identifiants ne bougent pas, donc les épingles
// des parents restent (19/11/2026).
//
// Garde-fou : une carte n'est ajoutée que si elle se place EN FIN de sa
// catégorie (son `ordre` est >= au nombre de cartes déjà en base pour cette
// catégorie). Sinon il faudrait décaler des cartes existantes : le script
// refuse et le signale. Les lignes en base sans fichier ne sont pas touchées.
//
//   node scripts/ajout-cartes-guide.mjs [mois…]            → simulation
//   node scripts/ajout-cartes-guide.mjs [mois…] --ecrire   → écrit en base
//   option : --sauf "M2:sepa:Les mains des inconnus"  (préfixe de situation)
// Sans mois : M0 à M23. Ensuite, `maj-textes-en-place.mjs --module guide`
// remet à jour la ligne _meta si besoin.
// ===========================================================================
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { GUIDE_CAT_FILE_RE, decomposeGuideCategories } from "./lib/guide-decompose.mjs";

config({ path: ".env.local" });
config({ path: ".env" });

const args = process.argv.slice(2);
const ECRIRE = args.includes("--ecrire");
const sauf = [];
for (let i = 0; i < args.length; i++) if (args[i] === "--sauf") sauf.push(args[i + 1]);
const moisDemandes = args
  .filter((a, i) => /^\d+$/.test(a) && args[i - 1] !== "--sauf")
  .map(Number);
const MOIS = moisDemandes.length ? moisDemandes : Array.from({ length: 24 }, (_, i) => i);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const cle = (r) => `${r.categorie ?? ""}|${r.situation ?? ""}|${r.ordre ?? 0}`;
const exclue = (mois, r) =>
  sauf.some((s) => {
    const [m, cat, ...rest] = s.split(":");
    return m === `M${mois}` && cat === r.categorie && (r.situation ?? "").startsWith(rest.join(":"));
  });

function lignesGuide(mois) {
  const dir = join(process.cwd(), "content", "guide-moi", `mois-${String(mois).padStart(2, "0")}`);
  if (!existsSync(dir)) return [];
  const parCat = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const m = f.match(GUIDE_CAT_FILE_RE);
    if (m) parCat.push({ file: f, slot: parseInt(m[1], 10), json: JSON.parse(readFileSync(join(dir, f), "utf-8")) });
  }
  return parCat.length ? decomposeGuideCategories(parCat, mois) : [];
}

let prevues = 0, ecrites = 0, refusees = 0, erreurs = 0;

for (const mois of MOIS) {
  const voulues = lignesGuide(mois);
  if (!voulues.length) continue;
  const { data: enBase, error } = await supabase
    .from("content")
    .select("id, categorie, situation, ordre")
    .eq("mois", mois)
    .eq("module", "guide");
  if (error) { console.error(`✗ M${mois} lecture : ${error.message}`); erreurs++; continue; }

  const cles = new Set(enBase.map(cle));
  const nbParCat = {};
  for (const r of enBase) nbParCat[r.categorie] = (nbParCat[r.categorie] ?? 0) + 1;

  const absentes = voulues.filter((r) => r.categorie !== "_meta" && !cles.has(cle(r)));
  for (const r of absentes) {
    if (exclue(mois, r)) { console.log(`  M${mois} · mise de côté : ${cle(r)}`); continue; }
    if ((r.ordre ?? 0) < (nbParCat[r.categorie] ?? 0)) {
      console.log(`  M${mois} · ✗ REFUSÉE (pas en fin de catégorie, ${nbParCat[r.categorie]} déjà en base) : ${cle(r)}`);
      refusees++;
      continue;
    }
    prevues++;
    console.log(`  M${mois} · ${ECRIRE ? "ajout" : "à ajouter"} : ${cle(r)}`);
    if (ECRIRE) {
      const { error: e } = await supabase.from("content").insert(r);
      if (e) { console.error(`    ✗ ${e.message}`); erreurs++; } else ecrites++;
    }
  }
}

console.log(
  `\n${ECRIRE ? "Ajoutées" : "Simulation"} : ${ECRIRE ? ecrites : prevues} carte(s)` +
    `${refusees ? `, ${refusees} refusée(s)` : ""}${erreurs ? `, ${erreurs} erreur(s)` : ""}.`,
);

if (ECRIRE && ecrites && process.env.REVALIDATE_URL && process.env.REVALIDATE_SECRET) {
  try {
    const res = await fetch(process.env.REVALIDATE_URL, {
      method: "POST",
      headers: { "x-revalidate-secret": process.env.REVALIDATE_SECRET },
    });
    console.log(res.ok ? "✅ Cache de l'app vidé" : `⚠️ Vidage du cache refusé (${res.status})`);
  } catch (e) {
    console.warn(`⚠️ Cache non vidé : ${e.message}`);
  }
}

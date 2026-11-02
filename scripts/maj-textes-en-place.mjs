// scripts/maj-textes-en-place.mjs
// ===========================================================================
// Met à jour les TEXTES de Guide-moi et de Vivre la saison dans Supabase, EN
// PLACE : on ne supprime et on n'ajoute aucune ligne. Chaque ligne déjà en base
// est retrouvée par (mois, module, categorie, situation, ordre) et seul son
// champ `data` est remplacé s'il a changé. Les identifiants ne bougent pas,
// donc les épingles des parents restent.
//
// Ce qui ne correspond pas (ligne présente d'un seul côté) est signalé et
// laissé tel quel : c'est un changement de structure, à publier avec les
// scripts d'import (import-guide-mois.mjs…) en connaissance de cause.
// La ligne `_meta` d'un mois n'est mise à jour que si tout le mois correspond.
//
//   node scripts/maj-textes-en-place.mjs            → simulation (rien n'est écrit)
//   node scripts/maj-textes-en-place.mjs --ecrire   → écrit en base
//   option : --module guide | --module saison
// ===========================================================================

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { GUIDE_CAT_FILE_RE, decomposeGuideCategories } from "./lib/guide-decompose.mjs";
import { decomposeGuide, decomposeSaison } from "./import-content.mjs";

config({ path: ".env.local" });
config({ path: ".env" });

const ECRIRE = process.argv.includes("--ecrire");
const iMod = process.argv.indexOf("--module");
const SEUL = iMod > -1 ? process.argv[iMod + 1] : null;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
const CONTENT = join(process.cwd(), "content");

// JSON à clés triées, pour comparer deux contenus sans tenir compte de l'ordre des clés.
const stable = (v) =>
  Array.isArray(v)
    ? `[${v.map(stable).join(",")}]`
    : v && typeof v === "object"
      ? `{${Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + stable(v[k])).join(",")}}`
      : JSON.stringify(v);
const cle = (r) => `${r.categorie ?? ""}|${r.situation ?? ""}|${r.ordre ?? 0}`;

function lignesGuide(mois) {
  const dir = join(CONTENT, "guide-moi", `mois-${String(mois).padStart(2, "0")}`);
  if (!existsSync(dir)) return [];
  const fichiers = readdirSync(dir).filter((f) => f.endsWith(".json"));
  const parCat = [];
  for (const f of fichiers) {
    const m = f.match(GUIDE_CAT_FILE_RE);
    if (m) parCat.push({ file: f, slot: parseInt(m[1], 10), json: JSON.parse(readFileSync(join(dir, f), "utf-8")) });
  }
  if (parCat.length) return decomposeGuideCategories(parCat, mois); // même règle que import-content
  const ancien = fichiers.find((f) => /^(01-guide|M\d+_guide_moi)\.json$/i.test(f));
  return ancien ? decomposeGuide(JSON.parse(readFileSync(join(dir, ancien), "utf-8")), mois) : [];
}

function lignesSaison(mois) {
  const p = join(CONTENT, "saison", `M${mois}_saison.json`);
  return existsSync(p) ? decomposeSaison(JSON.parse(readFileSync(p, "utf-8")), mois) : [];
}

const MODULES = [
  { module: "guide", lire: lignesGuide },
  { module: "saison", lire: lignesSaison },
].filter((m) => !SEUL || m.module === SEUL);

let aMettreAJour = 0, ecrites = 0, erreurs = 0;
const ecarts = [];

for (const { module, lire } of MODULES) {
  console.log(`\n=== ${module} ===`);
  for (let mois = 0; mois <= 23; mois++) {
    const voulues = lire(mois);
    if (!voulues.length) continue;
    const { data: enBase, error } = await supabase
      .from("content")
      .select("id, categorie, situation, ordre, data")
      .eq("mois", mois)
      .eq("module", module);
    if (error) { console.error(`  ✗ M${mois} lecture : ${error.message}`); erreurs++; continue; }

    const parCle = new Map();
    for (const r of enBase) {
      const k = cle(r);
      if (parCle.has(k)) { console.warn(`  ⚠️ M${mois} doublon en base : ${k}`); }
      parCle.set(k, r);
    }
    const clesVoulues = new Set(voulues.map(cle));
    const absentesBase = voulues.filter((r) => !parCle.has(cle(r)));
    const enTrop = enBase.filter((r) => !clesVoulues.has(cle(r)));
    const moisComplet = !absentesBase.length && !enTrop.length;

    const maj = [];
    for (const r of voulues) {
      const b = parCle.get(cle(r));
      if (!b) continue;
      if (r.categorie === "_meta" && !moisComplet) continue;
      if (stable(b.data) !== stable(r.data)) maj.push({ id: b.id, k: cle(r), data: r.data });
    }
    aMettreAJour += maj.length;

    let msg = `  M${mois} : ${maj.length} ligne(s) modifiée(s) sur ${enBase.length}`;
    if (!moisComplet) {
      msg += ` · ⚠️ structure différente (${absentesBase.length} absente(s) en base, ${enTrop.length} en base sans fichier) : non touchées`;
      ecarts.push({ module, mois, absentes: absentesBase.map(cle), enTrop: enTrop.map(cle) });
    }
    console.log(msg);

    if (ECRIRE) {
      for (const u of maj) {
        const { error: e } = await supabase
          .from("content")
          .update({ data: u.data, updated_at: new Date().toISOString() })
          .eq("id", u.id);
        if (e) { console.error(`    ✗ ${u.k} : ${e.message}`); erreurs++; } else ecrites++;
      }
    }
  }
}

console.log(`\n${ECRIRE ? "Écrit" : "Simulation"} : ${ECRIRE ? ecrites : aMettreAJour} ligne(s)${erreurs ? `, ${erreurs} erreur(s)` : ""}.`);
if (ecarts.length) {
  console.log("\nÉcarts de structure (rien n'a été fait pour ces lignes) :");
  for (const e of ecarts) {
    console.log(`  ${e.module} M${e.mois}`);
    if (e.absentes.length) console.log(`    absentes en base : ${e.absentes.join(" ; ")}`);
    if (e.enTrop.length) console.log(`    en base sans fichier : ${e.enTrop.join(" ; ")}`);
  }
}

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

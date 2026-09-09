# -*- coding: utf-8 -*-
"""Synchronise GUIDE2_situations.xlsx avec le corpus écrit.

À lancer APRÈS toute écriture ou réécriture de contenu (règle du 01/09/2026).
  python3 scripts/sync_tableau.py            → rapport seul, rien n'est écrit
  python3 scripts/sync_tableau.py --ecrire   → passe le Statut à « écrit » et signale le reste

Ne touche JAMAIS aux libellés ni aux angles éditoriaux : ce sont des décisions,
elles se reportent à la main.
"""
import json, glob, re, sys, openpyxl

ECRIRE = "--ecrire" in sys.argv
CLASSEUR = "GUIDE2_situations.xlsx"

def fiches():
    for f in sorted(glob.glob("content/mois-*/M*_guide_moi_N*.json")):
        if "_avant" in f or "anciens" in f: continue
        d = json.load(open(f, encoding="utf-8"))
        m = int(re.search(r"mois-(\d+)", f).group(1))
        for pr in d["protocoles"]:
            yield m, pr["situation"], d["categorie"]["nom"], f

wb = openpyxl.load_workbook(CLASSEUR)
ws = wb["Situations"]
h = [c.value for c in ws[1]]
iM, iP1, iP2, iS = (h.index("Mois"), h.index("Libellé partie 1"),
                    h.index("Libellé partie 2"), h.index("Statut"))

lignes = {}
for r in ws.iter_rows(min_row=2):
    if r[iM].value is None: continue
    lignes[(r[iM].value, f"{str(r[iP1].value).strip()} / {str(r[iP2].value).strip()}")] = r

ecrites = {(m, s): (cat, f) for m, s, cat, f in fiches()}

orphelines = [(m, s, ecrites[(m, s)]) for (m, s) in ecrites if (m, s) not in lignes]
maj = 0
for (m, s) in ecrites:
    r = lignes.get((m, s))
    if r is not None and r[iS].value != "écrit":
        print(f"  STATUT   M{m} · {s}  ({r[iS].value} → écrit)")
        if ECRIRE: r[iS].value = "écrit"
        maj += 1

print(f"\n{len(ecrites)} fiches écrites · {len(lignes)} lignes au tableau")
print(f"{maj} statut(s) à mettre à jour" + (" — écrits" if ECRIRE else " — relancer avec --ecrire"))
if orphelines:
    print(f"\n{len(orphelines)} fiche(s) écrite(s) SANS ligne au tableau (arbitrage requis) :")
    for m, s, (cat, f) in sorted(orphelines):
        print(f"  M{m:<3} [{cat[:24]:26s}] {s}")
else:
    print("\naucune fiche orpheline")
if ECRIRE and maj:
    wb.save(CLASSEUR); print(f"\n{CLASSEUR} enregistré")

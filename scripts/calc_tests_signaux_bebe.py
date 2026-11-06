#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Calcule `tests_attendus` AVEC LE CLASSEUR (LibreOffice recalcule les formules de l'onglet Résultat)
et les ajoute au JSON. Usage : python scripts/calc_tests_signaux_bebe.py <classeur.xlsx> <signaux.json>"""
import json, os, shutil, subprocess, sys, tempfile
import openpyxl

xlsx, jpath = sys.argv[1], sys.argv[2]
SCEN = [
    ("faim_et_fatigue_2_mois", 2, ["Il se frotte les yeux ou il bâille", "Il porte les mains à la bouche, suce son poing ou ses doigts"]),
    ("bailler_seul_naissance", 0, ["Il se frotte les yeux ou il bâille"]),
    ("pleurs_intenses_14_mois", 14, ["Pleurs intenses qui montent, difficiles à calmer"]),
    ("alerte_cri_aigu_3_mois", 3, ["Cri aigu, inhabituel, qui me fait peur", "Il se frotte les yeux ou il bâille"]),
    ("malade_combinaison_3_mois", 3, ["Il est mou, peu tonique", "Il fixe dans le vide, sans réaction", "Petits pleurs, gémissements, grognements"]),
    ("mou_et_fixe_sans_autre_3_mois", 3, ["Il est mou, peu tonique", "Il fixe dans le vide, sans réaction"]),
    ("ventre_soir_3_mois", 3, ["Il est regroupé : membres repliés vers l'intérieur", "Il est crispé et raide", "Il arque le dos", "Pleurs à la même heure chaque jour"]),
    ("rien_coche", 5, []),
    ("bras_mouvement_8_mois", 8, ["Dans mes bras ou en portage", "En mouvement", "Stimulant : écran, bruit, agitation, lumière forte", "Il détourne le regard ou me fuit"]),
    ("vaccin_4_mois", 4, ["Un vaccin ces dernières 48 h", "Visage crispé, yeux serrés, front bombé"]),
    ("contraint_9_mois", 9, ["Il a été plutôt contraint (siège, transat, parc, porte-bébé…)", "Il cherche à changer de position"]),
    ("tetee_alerte_2_mois", 2, ["Il pleure à chaque tétée ou biberon, pendant ou juste après", "Ses paupières papillonnent"]),
]
tmp = tempfile.mkdtemp()
out = []
for nom, age, reps in SCEN:
    wb = openpyxl.load_workbook(xlsx)
    wq, wr = wb["Questionnaire"], wb["Résultat"]
    wr["B3"] = age
    for r in range(2, wq.max_row + 1):
        if wq.cell(row=r, column=3).value in reps:
            wq.cell(row=r, column=4, value="✔")
    p = os.path.join(tmp, nom + ".xlsx")
    wb.save(p)
    od = os.path.join(tmp, "out"); os.makedirs(od, exist_ok=True)
    subprocess.run(["soffice", "--headless", "--calc", "--convert-to", "xlsx", "--outdir", od, p],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    v = openpyxl.load_workbook(os.path.join(od, nom + ".xlsx"), data_only=True)["Résultat"]
    top3 = []
    for r in (9, 10, 11):
        if isinstance(v.cell(row=r, column=7).value, (int, float)):
            top3.append({"nom": v.cell(row=r, column=6).value, "score": v.cell(row=r, column=7).value})
    msgs = [v.cell(row=r, column=1).value for r in (21, 22, 23) if v.cell(row=r, column=1).value]
    out.append({"nom": nom, "age": age, "reponses_cochees": reps, "attendu": {
        "nb_reponses_valables": v["B5"].value, "alerte": v["B6"].value, "top3": top3,
        "confiance": v["F13"].value, "messages": msgs}})
    print(nom, v["B5"].value, v["B6"].value, [(t["nom"][:18], t["score"]) for t in top3], v["F13"].value[:12], len(msgs))
d = json.load(open(jpath, encoding="utf-8"))
d["tests_attendus"] = out
json.dump(d, open(jpath, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
shutil.rmtree(tmp)
print("OK tests_attendus :", len(out))

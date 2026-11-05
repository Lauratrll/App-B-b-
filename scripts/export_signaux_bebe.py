#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Exporte Signaux_bebe_reference.xlsx (source de vérité) vers un JSON pour l'app.

Usage : python scripts/export_signaux_bebe.py content/signaux-bebe/Signaux_bebe_reference.xlsx content/signaux-bebe/signaux_bebe.json
Le classeur reste la source de vérité : on corrige dans Excel, puis on relance ce script.
"""
import json, re, sys
import openpyxl

src, dst = sys.argv[1], sys.argv[2]
wb = openpyxl.load_workbook(src)  # formules conservées : on lit les textes des messages
wq, wr, wa = wb["Questionnaire"], wb["Résultat"], wb["Alertes"]

# --- pistes (ordre = ordre des colonnes de points = ordre de départage des égalités)
hdr = [c.value for c in wq[1]]
pts_cols = [i for i, h in enumerate(hdr) if isinstance(h, str) and h.startswith("Points : ")]
codes = [wr.cell(row=9 + k, column=2).value for k in range(len(pts_cols))]
pistes = []
for k, ci in enumerate(pts_cols):
    pistes.append({
        "code": codes[k],
        "nom": hdr[ci].replace("Points : ", ""),
        "libelle": wr.cell(row=9 + k, column=1).value,
        "action": wr.cell(row=9 + k, column=10).value,
    })

# --- options du questionnaire
col = {h: i for i, h in enumerate(hdr)}
options = []
for n, row in enumerate(wq.iter_rows(min_row=2, values_only=True), 1):
    if not row[2]:
        continue
    points = {codes[k]: row[ci] for k, ci in enumerate(pts_cols) if row[ci] not in (None, 0)}
    srcs = [s.strip() for s in str(row[col["Source(s)"]] or "").split(",") if s.strip()]
    options.append({
        "id": f"o{n:03d}",
        "categorie": row[0],
        "question": row[1],
        "reponse": row[2],
        "age_min": int(row[4]), "age_max": int(row[5]),
        "type": "alerte" if row[col["Type"]] == "ALERTE" else "signe",
        "points": points,
        "sources": srcs,
        "statut_preuve": row[col["Statut de la preuve"]],
        "note_interne": row[col["Lecture / note (interne)"]],
    })

# --- alertes
alertes = []
for row in wa.iter_rows(min_row=2, values_only=True):
    if row[0]:
        alertes.append({"situation": row[0], "pourquoi": row[1], "a_dire": row[2], "sources": row[3], "urgence": row[4]})

# --- étapes « à essayer dans l'ordre »
etapes = []
r = 27
while wr.cell(row=r, column=1).value not in (None, "") and str(wr.cell(row=r, column=1).value).isdigit():
    etapes.append({"n": int(wr.cell(row=r, column=1).value), "texte": wr.cell(row=r, column=2).value, "sources": wr.cell(row=r, column=6).value})
    r += 1

# --- messages conditionnels (texte pris dans les formules du classeur)
def texte(cell):
    f = wr[cell].value
    # Lit les chaînes Excel une à une, de gauche à droite ("" = guillemet échappé).
    # L'ancienne lecture "([^"]{30,})" attrapait parfois le morceau de formule
    # ENTRE deux chaînes (bug du message pleurs_calmer_puis_nourrir, 05/11/2026).
    chaines = [s.replace('""', '"') for s in re.findall(r'"((?:[^"]|"")*)"', f)]
    return max(chaines, key=len)
messages = [
    {"id": "m0_dormeur", "texte": texte("A21"), "quand": "age == 0 ET rang(FT) <= 3"},
    {"id": "pleurs_calmer_puis_nourrir", "texte": texte("A22"), "quand": "une option « Pleurs intenses qui montent, difficiles à calmer » est cochée et valable à l'âge saisi"},
    {"id": "faim_et_fatigue", "texte": texte("A23"), "quand": "rang(FA) <= 2 ET rang(FT) <= 2"},
]

confiance = [
    {"quand": "aucune réponse cochée valable à cet âge", "texte": "Aucune réponse cochée"},
    {"quand": "aucune piste n'a un score > 0", "texte": "Aucune piste ne ressort : voir les essais plus bas"},
    {"quand": "nb réponses valables < 3", "texte": "Faible : trop peu d'éléments, plusieurs pistes possibles"},
    {"quand": "score1 - score2 < 2", "texte": "Moyenne : les deux premières pistes sont proches, essayer les deux"},
    {"quand": "sinon", "texte": "Meilleure : une piste ressort"},
]

out = {
    "_info": "Généré par scripts/export_signaux_bebe.py depuis Signaux_bebe_reference.xlsx. Ne pas modifier à la main : corriger le classeur puis relancer le script.",
    "algorithme": {
        "age": "âge de bébé en mois entier, 0 à 23",
        "option_valable": "age_min <= age <= age_max",
        "score_piste": "somme, pour chaque option cochée ET valable, de points[code_piste] (les négatifs comptent)",
        "classement": "tri par score décroissant, seulement score > 0 ; à égalité, l'ordre de la liste « pistes » départage (la première gagne)",
        "affichage": "3 premières pistes avec score > 0 : nom + action ; puis messages conditionnels ; puis la liste « etapes » toujours visible",
        "alerte": "si une option de type « alerte » est cochée et valable : afficher l'alerte AVANT tout résultat ; les alertes n'ont aucun point",
        "interdits": "ne jamais afficher « il a faim » mais « il cherche peut-être à manger » ; pas de diagnostic ; ne jamais afficher les sources internes (S13, S14, S24, S29) ni le champ note_interne",
    },
    "pistes": pistes,
    "options": options,
    "alertes": alertes,
    "etapes": etapes,
    "messages": messages,
    "confiance": confiance,
}
with open(dst, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print(f"OK {dst} : {len(pistes)} pistes, {len(options)} options, {len(alertes)} alertes, {len(etapes)} étapes")

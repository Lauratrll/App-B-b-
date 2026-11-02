#!/usr/bin/env python3
"""Espace insecable (U+00A0) entre le nombre et « °C » sur toutes les temperatures affichees dans l'app.

Decision du 01/11/2026 (Laura) : « 38,5 °C », « 20 °C », « 19 °C » avec une espace insecable
partout (fievre, chambre, bain, etc.).
Perimetre : content/**/*.json et *.md (hors archives _avant_*, _sauvegardes, _anciens, ancien),
plus les textes visibles de app/, components/, lib/ (*.ts, *.tsx).
Le degre sans « C » (angles, couleurs) n'est jamais touche.
Remplacement fait sur le texte brut (aucune reecriture du JSON) : le reste du fichier reste identique.
Usage : python3 scripts/espaces_temperatures.py [--ecrire]   (sans option : simulation + journal)
"""
import os, re, sys, json, shutil, datetime

NB = " "
ESP = "[   ]?"
# nombre + espace eventuelle + degre + espace eventuelle + C (ou F), non suivi d'une lettre
TEMP = re.compile(r"(\d(?:[.,]\d+)?)" + ESP + r"(°|º|˚)" + ESP + r"([CF])(?![A-Za-zÀ-ÿ])")
# decimale au point (a signaler seulement)
POINT = re.compile(r"\d\.\d+" + ESP + r"°" + ESP + r"[CF]")
# « 20 degres », « 20 C » sans signe degre (a signaler seulement)
AUTRES = re.compile(r"\d(?:[.,]\d+)?[  ]?(?:degrés?|degres?)\b|\b\d{2}(?:[.,]\d)?[  ]C\b")
SKIP = ("_avant_", "_sauvegardes", "_anciens", "ancien", "node_modules", ".next")

def fichiers():
    for racine, exts in (("content", (".json", ".md")), ("app", (".ts", ".tsx")),
                         ("components", (".ts", ".tsx")), ("lib", (".ts", ".tsx"))):
        for dp, dn, fn in os.walk(racine):
            if any(s in dp for s in SKIP):
                continue
            for f in fn:
                if f.endswith(exts):
                    yield os.path.join(dp, f)

def main():
    ecrire = "--ecrire" in sys.argv
    jour = datetime.date.today().isoformat()
    sauv = os.path.join("_sauvegardes", jour, "avant_espaces_temperatures")
    journal, n_total, n_fichiers, signalements = [], 0, 0, []
    for p in fichiers():
        t = open(p, encoding="utf-8").read()
        nouveau, n = TEMP.subn(lambda m: m.group(1) + NB + "°" + m.group(3), t)
        for m in POINT.finditer(t):
            signalements.append((p, "point decimal", t[max(0, m.start() - 30):m.end() + 20].replace("\n", " ")))
        for m in AUTRES.finditer(t):
            signalements.append((p, "autre forme", t[max(0, m.start() - 30):m.end() + 20].replace("\n", " ")))
        if nouveau != t:
            # ne compte que les vrais changements
            vrais = [m for m in TEMP.finditer(t) if m.group(0) != m.group(1) + NB + "°" + m.group(3)]
            for m in vrais:
                journal.append({"fichier": p.replace("\\", "/"), "avant": repr(t[max(0, m.start() - 25):m.end() + 12]),
                                "apres": repr(t[max(0, m.start() - 25):m.start()] + m.group(1) + NB + "°" + m.group(3) + t[m.end():m.end() + 12])})
            n_total += len(vrais); n_fichiers += 1
            if ecrire:
                dest = os.path.join(sauv, p)
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                shutil.copy2(p, dest)
                open(p, "w", encoding="utf-8", newline="").write(nouveau)
    with open("scripts/espaces_temperatures_journal.jsonl", "w", encoding="utf-8") as j:
        for e in journal:
            j.write(json.dumps(e, ensure_ascii=False) + "\n")
    print(("ECRIT" if ecrire else "SIMULATION"), ":", n_total, "temperatures a corriger dans", n_fichiers, "fichiers")
    if ecrire:
        print("Sauvegardes :", sauv)
    print("A signaler (non modifie) :", len(signalements))
    for s in signalements[:40]:
        print("  ", s)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fix_tirets.py — Remplace les tirets cadratins d'un contenu JSON, en variant la ponctuation.

Usage :
    python3 fix_tirets.py entree.json sortie.json      # applique et ecrit
    python3 fix_tirets.py entree.json --diff           # montre seulement les changements

Le script ne cherche pas a etre parfait : il traite les cas surs et signale (marqueur >>>)
les conversions a relire a la main.
"""

import json
import re
import sys

NBSP = " "

# La suite du tiret commence par un mot de liaison -> virgule
LIAISON = re.compile(
    r"^(et|mais|ou|or|donc|car|ni|alors|tandis|sans|avec|pour|avant|après|plutôt|"
    r"jamais|toujours|sauf|y compris|comme|quand|lorsque|puis|surtout|même|"
    r"parfois|souvent|non|pas |ce qui|ce que|celui|celle|au|aux|du|des|de la|d'|à )",
    re.I)

# Debut de proposition autonome -> point + majuscule
AUTONOME = re.compile(
    r"^(c'est|ce n'est|cela|ça|il |elle |ils |elles |on |tu |le |la |les |un |une |"
    r"ton |ta |tes |son |sa |ses |chaque|beaucoup|rien |tout |cette|ces |ceux |"
    r"aucun|dangereux|inefficace|mauvais|la suite)", re.I)

TITRES = re.compile(r"^(Action immédiate|Geste doux|Réflexologie|Consulter si|Source)\s*—\s*")

# Verbe conjugue dans la suite : condition pour couper en deux phrases
VERBE_CONJ = re.compile(
    r"\b(est|n'est|sont|a |ont |fait|font|peut|peuvent|va |vont|doit|doivent|reste|restent|"
    r"devient|deviennent|permet|permettent|aide|aident|augmente|augmentent|diminue|apaise|"
    r"apporte|donne|crée|ajoute|suffit|arrive|arrivent|passe|s'installe|s'agit|existe|"
    r"mesure|mesurent|dégrade|relance|viendra|apparaît|apprend|change|compte|tient|"
    r"n'apprend|n'existe|n'hypothèque|croit|échouera|ne sait|se joue|se construit)\b", re.I)


def classe_tail(tail: str, gauche: str, champ: str = ""):
    """Retourne (', ', False) | ('. ', True) | (' : ', False)."""
    mots = tail.split()
    deja_deux_points = ":" in gauche
    if champ.endswith("source"):
        return ", ", False
    if LIAISON.match(tail):
        return ", ", False
    proposition = AUTONOME.match(tail) and VERBE_CONJ.search(tail) and len(mots) > 5
    if deja_deux_points:
        return (". ", True) if proposition else (", ", False)
    if proposition and len(mots) > 8:
        return ". ", True
    return NBSP + ": ", False


def convertir(s: str, journal, chemin):
    if "—" not in s:
        return s
    avant = s
    douteux = False

    if TITRES.match(s):
        s = TITRES.sub(lambda m: m.group(1) + NBSP + ": ", s, count=1)

    # incise encadree par deux tirets dans la meme phrase
    while s.count("—") >= 2:
        i = s.find("—")
        j = s.find("—", i + 1)
        if re.search(r"[.!?]", s[i:j]):
            break
        gauche, milieu, droite = s[:i].rstrip(), s[i + 1:j].strip(), s[j + 1:].lstrip()
        s = f"{gauche}, {milieu}, {droite}"

    while "—" in s:
        i = s.find("—")
        gauche = s[:i].rstrip()
        droite = s[i + 1:].lstrip()
        if not droite:
            s = gauche
            continue
        sep, majuscule = classe_tail(droite, gauche, chemin)
        if majuscule:
            droite = droite[0].upper() + droite[1:]
        if sep == ", " and len(droite.split()) > 10:
            douteux = True
        s = gauche.rstrip(",;") + sep + droite

    # nettoyage : espaces avant , et . uniquement (on ne touche pas aux : ; ! ?)
    s = re.sub(r"[  ]+([,.])", r"\1", s)
    s = re.sub(r"  +", " ", s)
    if s != avant:
        journal.append((chemin, avant, s, douteux))
    return s


def parcourir(o, journal, chemin=""):
    if isinstance(o, str):
        return convertir(o, journal, chemin)
    if isinstance(o, list):
        return [parcourir(v, journal, f"{chemin}[{i}]") for i, v in enumerate(o)]
    if isinstance(o, dict):
        return {k: parcourir(v, journal, f"{chemin}.{k}" if chemin else k) for k, v in o.items()}
    return o


if __name__ == "__main__":
    src = sys.argv[1]
    dst = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith("--") else None
    seulement_douteux = "--douteux" in sys.argv
    data = json.load(open(src, encoding="utf-8"))
    journal = []
    data = parcourir(data, journal)
    for chemin, avant, apres, douteux in journal:
        if seulement_douteux and not douteux:
            continue
        marque = ">>> " if douteux else "    "
        print(f"{marque}{chemin}\n  AP : {apres}")
    n_d = sum(1 for j in journal if j[3])
    print(f"\n{len(journal)} chaîne(s) modifiée(s), dont {n_d} à relire (>>>)")
    if dst:
        with open(dst, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print("écrit dans", dst)

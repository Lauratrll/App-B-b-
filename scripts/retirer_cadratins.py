#!/usr/bin/env python3
"""Retire les tirets cadratins (U+2014) des textes affiches de l'app (content/**/*.json hors archives).

Regles (decision du 17/10/2026, Laura : aucun cadratin dans l'app) :
- « Action immediate — X » -> « Action immediate : X » ; pareil pour « Geste doux — X ».
- « [Pause — 5 secondes] » -> « [Pause de 5 secondes] ».
- Deux cadratins qui encadrent une incise : virgules, ou parentheses si l'incise contient deja une virgule.
- Un cadratin seul :
    * dans une liste (etapes, erreurs, reperes, pour aller plus loin...) : « Amorce : explication » ;
      si une amorce « : » existe deja, point + majuscule, ou virgule si la suite est un complement ;
    * dans un texte suivi : virgule, ou deux-points si la suite explique (« c'est », « cela »...).
Usage : python3 scripts/retirer_cadratins.py [--ecrire]   (sans option : simulation + journal)
"""
import json, re, sys, glob, random, os

NB = " "
TIRET = "—"
LISTES = re.compile(r"(etapes|erreurs_a_eviter|reperes_cles|pour_aller_plus_loin|regles|actions|comment_jouer|a_eviter)\[\d+\]$")
COMPLEMENT = re.compile(r"^(d'|de |du |des |en |avec |sans |pour |sur |dans |à |au |aux |par |jusqu|afin |même |surtout |ou |et |mais |car |donc |puis |ni |sous |entre |selon |comme |tant |quand |si |où |dont |qui |que |parce |plutôt |ici |là |toujours |jamais |encore |déjà |environ |autour |chaque |tout |toute |tous |toutes |1 |2 |3 |\d)", re.I)
EXPLIQUE = re.compile(r"^(c'est|ce n'est|ce sont|cela|ça |voilà|autrement dit|soit |à savoir)", re.I)
VIRGULE = re.compile(r"^(mais|et|ou|car|donc|puis|parce|alors|sans|avec|pour|dont|qui|que|où|même|ni|tandis|sinon|sauf)\b", re.I)

def maj(s):
    return s[:1].upper() + s[1:] if s and s[0].isalpha() else s

def nettoie(s):
    s = re.sub(r",\s*,", ",", s)
    s = re.sub(r",\s*([.!?;:])", r"\1", s)
    s = re.sub(r"[ ]{2,}", " ", s)
    s = re.sub(r"(?<![  ]) ([:;!?])", lambda m: NB + m.group(1), s) if False else s
    return s

CONTINUE = set("""où qui que dont mais et ou car donc puis parce sans avec pour en dans sur sous toujours souvent surtout même parfois bien plus moins très presque exactement précisément notamment comme quand si alors ni encore déjà enfin d' de du des à au aux par selon autour entre vers jusqu' depuis pendant chez contre malgré sauf soit tant aussi ainsi pas rien tout toute tous toutes chaque jamais environ""".split())
DETERMINANT = set("""il elle ils elles on ce c' cela ça ceci voilà ton ta tes son sa ses mon ma mes le la les l' un une des notre nos votre vos leur leurs lui""".split())
IMPERATIFS = set("""chante danse demande essaie propose laisse garde prends pose mets fais reste évite préfère privilégie commence parle regarde vérifie attends accueille offre nomme tiens reviens respire appelle consulte note observe sécurise rassure installe choisis écoute montre donne prévois sers sois aide invite protège réduis ajuste adapte cherche compte éteins range lis joue dis cours porte ralentis accompagne continue soutiens trouve teste profite pense prépare habille couche berce câline masse nettoie surveille ouvre ferme assieds allonge aère réchauffe couvre découvre explique fredonne accroche pars rentre sors entre cache marche saute grimpe""".split())

def premier_mot(t):
    m = re.match(r"[«\"(\[]?\s*([\wÀ-ÿ'’]+)", t)
    if not m: return ""
    w = m.group(1).lower().replace("’", "'")
    if "'" in w:
        w = w.split("'")[0] + "'"
    return w

def classe_prose(reste):
    w = premier_mot(reste)
    if re.match(r"^(c'est|ce n'est|cela|ça |voilà|autrement dit|à savoir)", reste, re.I): return "deuxpoints"
    if w in IMPERATIFS: return "point"
    if w in CONTINUE or re.match(r"^\d", reste): return "virgule"
    if w in DETERMINANT: return "deuxpoints"
    return "inconnu"

def un_tiret(s, kind):
    """Remplace le PREMIER cadratin de s (paire ou seul) et renvoie la chaine."""
    j = s.find(TIRET)
    avant = s[:j].rstrip()
    reste = s[j + 1:].lstrip()
    k = reste.find(TIRET)
    fin = re.search(r"[.!?]\s", reste)
    if k >= 0 and (not fin or k < fin.start()):
        incise = reste[:k].strip()
        apres = reste[k + 1:].lstrip()
        if "," in incise or ":" in incise:
            return avant + " (" + incise + ") " + apres
        return avant + ", " + incise + ", " + apres
    deja_amorce = bool(re.search(r"\S\s?:\s", avant)) or (NB + ":") in avant
    if kind == "list":
        if not deja_amorce:
            return avant + NB + ": " + reste
        if COMPLEMENT.match(reste) or re.match(r"^\d", reste) or premier_mot(reste) in CONTINUE:
            return avant + ", " + reste
        sep = "" if avant.endswith((".", "!", "?")) else "."
        return avant + sep + " " + maj(reste)
    if avant.startswith("Source"):
        return avant + ", " + reste
    c = classe_prose(reste)
    if c in ("deuxpoints", "inconnu"):
        return avant + NB + ": " + reste
    if c == "point":
        sep = "" if avant.endswith((".", "!", "?")) else "."
        return avant + sep + " " + maj(reste)
    return avant + ", " + reste

def traite(s, kind):
    if TIRET not in s:
        return s
    s = re.sub(r"\[Pause\s*" + TIRET + r"\s*(\d+)\s*secondes?\]", lambda m: f"[Pause de {m.group(1)} secondes]", s)
    if kind == "titre":
        s = re.sub(r"^(Action immédiate|Geste doux)\s*" + TIRET + r"\s*", lambda m: m.group(1) + NB + ": ", s)
    n = 0
    while TIRET in s and n < 20:
        s = un_tiret(s, kind); n += 1
    return nettoie(s)

def walk(x, path, acc):
    if isinstance(x, str):
        if TIRET in x:
            acc.append((path, x))
    elif isinstance(x, list):
        for i, v in enumerate(x): walk(v, f"{path}[{i}]", acc)
    elif isinstance(x, dict):
        for k, v in x.items(): walk(v, f"{path}.{k}" if path else k, acc)

def kind_of(path):
    if LISTES.search(path): return "list"
    if re.search(r"(^|\.)titre$", path) or path.endswith("action_immediate.titre") or path.endswith("geste_doux.titre"): return "titre"
    if "script_audio" in path: return "script"
    return "prose"

def fichiers():
    return sorted(f for f in glob.glob("content/**/*.json", recursive=True)
                  if not re.search(r"_avant|anciens|ancien/|fichier lisible|_sauv", f))

LITT = re.compile(r'"(?:[^"\\]|\\.)*"')

def traite_fichier(f, ecrire, journal):
    raw = open(f, encoding="utf-8").read()
    data = json.loads(raw)
    acc = []
    walk(data, "", acc)
    if not acc: return 0
    nouveaux = [(p, o, traite(o, kind_of(p))) for p, o in acc]
    # remplacement dans le texte brut, litteral par litteral, dans l'ordre
    it = iter(nouveaux)
    cur = [next(it, None)]
    def rep(m):
        lit = m.group(0)
        if TIRET not in lit or cur[0] is None: return lit
        p, o, n = cur[0]
        attendu = json.dumps(o, ensure_ascii=False)
        if lit != attendu:
            raise RuntimeError(f"{f}: litteral inattendu {lit[:60]}")
        cur[0] = next(it, None)
        return json.dumps(n, ensure_ascii=False)
    nouveau = LITT.sub(rep, raw)
    assert cur[0] is None, f"{f}: litteraux non consommes"
    json.loads(nouveau)
    for p, o, n in nouveaux:
        journal.append((f, p, kind_of(p), o, n))
    if ecrire:
        open(f, "w", encoding="utf-8").write(nouveau)
    return len(nouveaux)

if __name__ == "__main__":
    ecrire = "--ecrire" in sys.argv
    journal = []
    n = sum(traite_fichier(f, ecrire, journal) for f in fichiers())
    with open("scripts/retirer_cadratins_journal.jsonl", "w", encoding="utf-8") as fh:
        for f, p, k, o, nn in journal:
            fh.write(json.dumps([f, p, k, o, nn], ensure_ascii=False) + "\n")
    print(n, "textes concernes", "(ecrits)" if ecrire else "(simulation)")

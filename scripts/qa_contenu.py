#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
qa_contenu.py — Controle qualite des contenus JSON de l'app (Guide-moi !, coucher, etc.)

Usage :
    python3 qa_contenu.py fichier.json [autres.json ...]        # verifie + normalise
    python3 qa_contenu.py --check-only fichier.json             # verifie sans rien ecrire

Ce que fait le script :
  1. NORMALISE (ecriture en place) les espaces insecables U+00A0 :
       - avant  :  ;  !  ?
       - apres  «   et avant  »
  2. SIGNALE, sans corriger, les points qui demandent une decision humaine :
       - tiret cadratin —
       - guillemets droits
       - vocabulaire interdit (massage, caresse, reflexo, therapie, diagnostic...)
       - formulations interdites (votre enfant, il faut, malheureusement)
       - pression chiffree (0/10)
       - comptes de champs (4 points, 4 erreurs, 5 etapes max, 9 champs)
       - volume du protocole (350-800 mots)
       - redondance interne : suites de 4 mots repetees d'un bloc a l'autre
       - amorces trop uniformes dans une meme liste

Le script ne remplace pas la relecture de fond (passes 1 et 2 du SKILL_contenu).
"""

import json
import re
import sys
import unicodedata
from collections import defaultdict

NBSP = " "

CHAMPS_OBLIGATOIRES = [
    "categorie", "situation", "titre", "explication", "ancrage",
    "action_immediate", "geste_doux", "pour_aller_plus_loin",
    "principe", "erreurs_a_eviter", "consulter_si",
]

# (motif regex, message, gravite)
INTERDITS = [
    (r"—", "tiret cadratin", "ERREUR"),
    (r"[\"“”]", "guillemet droit ou typographique anglais", "ERREUR"),
    (r"\bmassages?\b|\bmasser\b|\bmassant\b", "mot « massage » (acte reserve au kine)", "ERREUR"),
    (r"\bcaresses?\b|\bcaresser\b|\bcaressant\b", "mot « caresse » (proscrit en reflexologie)", "ERREUR"),
    (r"\breflexo\b|\bréflexo\b(?!logie)", "abreviation « reflexo »", "ERREUR"),
    (r"\bth[ée]rap", "registre « therapie »", "ERREUR"),
    (r"\bdiagnostic|\bdiagnostiqu", "mot « diagnostic »", "ERREUR"),
    (r"\bsoigner\b|\bgu[ée]rir\b|\btraitement curatif\b", "registre « soigner / guerir »", "ERREUR"),
    (r"\bprescri", "registre « prescription »", "ERREUR"),
    (r"\bpatients?\b", "mot « patient »", "ERREUR"),
    (r"\bDPP\b", "abreviation « DPP »", "ERREUR"),
    (r"\d\s*/\s*10", "pression chiffree", "ERREUR"),
    (r"\bvotre\b|\bvos\b", "« votre / vos » (tutoiement attendu)", "ALERTE"),
    (r"\bil faut\b", "« il faut » (injonction)", "ALERTE"),
    (r"[Mm]alheureusement", "« malheureusement »", "ALERTE"),
    (r"\bhuiles? essentielles?\b", "huiles essentielles (a verifier : interdit avant 3 ans)", "ALERTE"),
    (r"\blidoca[ïi]ne\b", "lidocaine (a verifier : interdit avant 2 ans)", "ALERTE"),
]

STOPWORDS = set("""a au aux avec ce ces dans de des du elle en et eux il ils je la le les leur lui ma mais me
meme mes moi mon ne nos notre nous on ou par pas pour qu que qui sa se ses son sur ta te tes toi ton tu un une
vous y c d j l m n s t est sont etre a ete plus moins tout tous toute toutes son ses quand comme si ni""".split())


# ---------------------------------------------------------------- normalisation

def normaliser(texte: str) -> str:
    """Pose les espaces insecables francaises."""
    if not isinstance(texte, str):
        return texte
    # avant : ; ! ?  (une seule espace insecable, quelle que soit l'espace presente)
    texte = re.sub(r"[   ]*([;:!?])", NBSP + r"\1", texte)
    # apres « et avant »
    texte = re.sub(r"«[   ]*", "«" + NBSP, texte)
    texte = re.sub(r"[   ]*»", NBSP + "»", texte)
    return texte


def parcourir(obj, fn):
    if isinstance(obj, str):
        return fn(obj)
    if isinstance(obj, list):
        return [parcourir(v, fn) for v in obj]
    if isinstance(obj, dict):
        return {k: parcourir(v, fn) for k, v in obj.items()}
    return obj


# ---------------------------------------------------------------- verifications

def textes(obj, chemin=""):
    """Genere (chemin, texte) pour toutes les chaines."""
    if isinstance(obj, str):
        yield chemin, obj
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from textes(v, f"{chemin}[{i}]")
    elif isinstance(obj, dict):
        for k, v in obj.items():
            yield from textes(v, f"{chemin}.{k}" if chemin else k)


def mots(texte):
    t = unicodedata.normalize("NFD", texte.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return [m for m in re.findall(r"[a-z']+", t)]


def blocs_texte(proto):
    """Retourne {nom_du_bloc: texte concatene} pour le test de redondance."""
    out = {}
    for champ in ["explication", "ancrage", "principe", "consulter_si", "situation", "titre"]:
        if isinstance(proto.get(champ), str):
            out[champ] = proto[champ]
    for champ in ["action_immediate", "geste_doux"]:
        bloc = proto.get(champ)
        if isinstance(bloc, dict):
            out[champ] = " ".join(bloc.get("etapes", []))
    for champ in ["pour_aller_plus_loin", "erreurs_a_eviter"]:
        if isinstance(proto.get(champ), list):
            out[champ] = " ".join(proto[champ])
    return out


def redondances(proto, n=4):
    """4-grammes partages entre deux blocs differents."""
    index = defaultdict(set)
    for nom, texte in blocs_texte(proto).items():
        w = mots(texte)
        for i in range(len(w) - n + 1):
            gram = tuple(w[i:i + n])
            if sum(1 for g in gram if g not in STOPWORDS) >= 2:
                index[gram].add(nom)
    return {" ".join(g): sorted(b) for g, b in index.items() if len(b) > 1}


def compter_mots(proto):
    return sum(len(mots(t)) for _, t in textes(proto))


def verifier_protocole(proto, etiquette, rapport):
    def dire(gravite, msg):
        rapport.append((gravite, f"{etiquette} : {msg}"))

    for champ in CHAMPS_OBLIGATOIRES:
        if champ not in proto:
            dire("ERREUR", f"champ manquant « {champ} »")

    for champ, attendu in [("pour_aller_plus_loin", 4), ("erreurs_a_eviter", 4)]:
        val = proto.get(champ)
        if isinstance(val, list) and len(val) != attendu:
            dire("ERREUR", f"{champ} = {len(val)} elements (attendu {attendu})")

    for champ in ["action_immediate", "geste_doux"]:
        bloc = proto.get(champ)
        if isinstance(bloc, dict):
            etapes = bloc.get("etapes", [])
            if len(etapes) > 5:
                dire("ERREUR", f"{champ} = {len(etapes)} etapes (5 maximum)")
            sans_amorce = [e for e in etapes if ":" not in e[:60]]
            if sans_amorce:
                dire("ALERTE", f"{champ} : {len(sans_amorce)} etape(s) sans amorce « Amorce : suite »")
            titre = bloc.get("titre", "")
            if champ == "geste_doux" and not titre.startswith(("Réflexologie", "Geste doux")):
                dire("ALERTE", f"geste_doux : titre inattendu « {titre} »")

    titre = proto.get("titre", "")
    if " / " not in titre:
        dire("ERREUR", f"titre sans separateur « / » : « {titre} »")

    cs = proto.get("consulter_si", "")
    if cs and not cs.lstrip().startswith("Consulter"):
        dire("ALERTE", "consulter_si ne commence pas par « Consulter si : »")

    n = compter_mots(proto)
    if n < 350:
        dire("ALERTE", f"volume faible : {n} mots (cible 400-700)")
    elif n > 800:
        dire("ALERTE", f"volume eleve : {n} mots (cible 400-700)")

    for gram, blocs in sorted(redondances(proto).items()):
        dire("REDITE", f"« {gram} » apparait dans {', '.join(blocs)}")

    for chemin, texte in textes(proto):
        for motif, msg, gravite in INTERDITS:
            for m in re.finditer(motif, texte):
                extrait = texte[max(0, m.start() - 30):m.end() + 30].replace("\n", " ")
                dire(gravite, f"{msg} dans {chemin} : …{extrait}…")


def verifier_fichier(chemin, check_only=False):
    with open(chemin, encoding="utf-8") as f:
        data = json.load(f)

    if not check_only:
        data = parcourir(data, normaliser)
        with open(chemin, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")

    rapport = []
    protos = data.get("protocoles")
    if protos is None:
        protos = []
        for cat in data.get("categories", []):
            protos.extend(cat.get("protocoles", []))
    for i, p in enumerate(protos, 1):
        verifier_protocole(p, f"[{i}] {p.get('titre', '?')[:45]}", rapport)

    print(f"\n=== {chemin} — {len(protos)} protocole(s) ===")
    if not rapport:
        print("  Rien a signaler.")
    ordre = {"ERREUR": 0, "ALERTE": 1, "REDITE": 2}
    for gravite, msg in sorted(rapport, key=lambda r: ordre.get(r[0], 3)):
        print(f"  {gravite:7} {msg}")
    return sum(1 for g, _ in rapport if g == "ERREUR")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    check_only = "--check-only" in sys.argv
    total = 0
    for chemin in args:
        total += verifier_fichier(chemin, check_only)
    print(f"\nTotal erreurs bloquantes : {total}")
    sys.exit(1 if total else 0)

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
qa_contenu.py — Controle qualite des contenus JSON de l'app (Guide-moi !, coucher, etc.)

Usage :
    python3 qa_contenu.py                                       # TOUT le contenu vivant
    python3 qa_contenu.py --check-only                          # idem, sans rien ecrire
    python3 qa_contenu.py fichier.json [autres.json ...]        # verifie + normalise
    python3 qa_contenu.py --check-only fichier.json             # verifie sans rien ecrire

Sans argument, le script controle tout le contenu vivant. S'il ne lit aucun
fichier, il le dit et sort en erreur : il ne rend jamais un verdict a vide.

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
       - comptes de champs (4 points, 4 erreurs, 5 etapes — un de plus admis, 9 champs)
       - volume du protocole (350-800 mots)
       - redondance interne : suites de 4 mots repetees d'un bloc a l'autre
       - amorces trop uniformes dans une meme liste

Le script ne remplace pas la relecture de fond (passes 1 et 2 du SKILL_contenu).
"""

import json
import pathlib
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
    # « patient » : seul le NOM est interdit (registre medical). L'adjectif est libre :
    # « sois patient », « les parents les plus patients », « la patience ».
    # On ne declenche donc que sur determinant + patient(e)(s), ce qui attrape aussi
    # le feminin « une patiente » que l'ancien motif laissait passer.
    (r"(?:\b(?:au|aux|du|le|la|les|un|une|des|ce|cet|cette|ces|mon|ma|mes|ton|ta|tes|son|sa|ses"
     r"|notre|nos|votre|vos|leur|leurs|chaque|plusieurs|quelques|certains|certaines)\s+)"
     r"patient(?:e|s|es)?\b", "mot « patient » employe comme nom (registre medical)", "ERREUR"),
    (r"\bDPP\b", "abreviation « DPP »", "ERREUR"),
    (r"\d\s*/\s*10", "pression chiffree", "ERREUR"),
    (r"\bvotre\b|\bvos\b", "« votre / vos » (tutoiement attendu)", "ALERTE"),
    (r"\bil faut\b", "« il faut » (injonction)", "ALERTE"),
    (r"[Mm]alheureusement", "« malheureusement »", "ALERTE"),
    (r"\bhuiles? essentielles?\b", "huiles essentielles (a verifier : interdit avant 3 ans)", "ALERTE"),
    (r"\blidoca[ïi]ne\b", "lidocaine (a verifier : interdit avant 2 ans)", "ALERTE"),
    # « se soigne » : regle Laura du 26/08. La formule est ACCEPTEE quand elle affirme,
    # dans la meme phrase, qu'on s'adresse a un professionnel (« se soigne bien, une fois
    # prise en charge », « se soigne avec l'aide d'un professionnel »). Elle est REFUSEE
    # quand elle laisse entendre que cela se resout seul, ou quand l'app affirme d'elle-meme
    # ce qui se soigne ou ne se soigne pas. Le script ne sait pas trancher : il signale,
    # et la relecture humaine applique la regle.
    (r"collier d'ambre|gel anesth|lidoca|(collier|gel|granule|sirop|produit)[^.]{0,40}(inefficace|sans efficacit)",
     "prise de position sur un remede (regle du 26/08 : renvoyer au pharmacien)", "ERREUR"),
    (r"\bse soigne\w*\b|\bse gu[ée]ri\w*\b", "« se soigne » (a verifier : renvoi a un professionnel dans la meme phrase ?)", "ALERTE"),
]

STOPWORDS = set("""a au aux avec ce ces dans de des du elle en et eux il ils je la le les leur lui ma mais me
meme mes moi mon ne nos notre nous on ou par pas pour qu que qui sa se ses son sur ta te tes toi ton tu un une
vous y c d j l m n s t est sont etre a ete plus moins tout tous toute toutes son ses quand comme si ni""".split())


# ---------------------------------------------------------------- normalisation

import unicodedata as _ud
def _sansacc(s):
    """Compare un libelle sans ses accents ni ses espaces insecables."""
    s = (s or "").replace(chr(160), " ").strip()
    return "".join(c for c in _ud.normalize("NFD", s) if _ud.category(c) != "Mn")

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


# ---------------------------------------------------------------------------
# Redites VOULUES, exclues du detecteur.
#
#  - `consulter_si` : le cadre de securite se repete mot pour mot d'un protocole
#    a l'autre ET reprend des elements du corps (decision du 01/09/2026). Il n'a
#    donc rien a faire dans un test de redondance INTERNE au protocole.
#  - REFRAINS_VOULUS : formulations arretees, a reprendre telles quelles
#    (retrait d'urgence, numeros, nom et acces de Mon soutien psy). Decisions des
#    01/09, 02/09 et 03/09/2026.
#
# Tout le reste est signale : une redite non enregistree ici est une redite a
# corriger, pas une redite a tolerer.
# ---------------------------------------------------------------------------
#  - `situation` : c'est le libelle de la carte, pas un bloc de contenu. Qu'une
#    explication nomme la scene qu'elle explique est normal, et meme souhaitable.
#    `titre` reste dans le test : lui, il ne doit pas se retrouver dans le corps.
BLOCS_HORS_REDONDANCE = ("consulter_si", "situation")

REFRAINS_VOULUS = [
    "allo parents bebe",
    "0 800 00 34 56",
    "mon soutien psy",
    "assurance maladie",
    "pensees noires",
    "3114",
    "ne jamais secouer",
    "provoquer des lesions graves",
    "quelques secondes suffisent",
    "poser bebe sur le dos",
    "poser l'enfant en securite",
    "sortir de la piece",
    "faire baisser la tension",
    "appeler quelqu'un avant de revenir",
    "medecin sage femme ou pmi",
    "sage femme ou pmi",
    "violences femmes info",
    "centre communal d'action sociale",
]


def _refrain(gram):
    plat = " ".join(gram)
    return any(r in plat for r in REFRAINS_VOULUS)


def redondances(proto, n=4):
    """4-grammes partages entre deux blocs differents, hors redites voulues."""
    index = defaultdict(set)
    for nom, texte in blocs_texte(proto).items():
        if nom in BLOCS_HORS_REDONDANCE:
            continue
        w = mots(texte)
        for i in range(len(w) - n + 1):
            gram = tuple(w[i:i + n])
            if sum(1 for g in gram if g not in STOPWORDS) >= 2 and not _refrain(gram):
                index[gram].add(nom)
    return {" ".join(g): sorted(b) for g, b in index.items() if len(b) > 1}


def compter_mots(proto):
    return sum(len(mots(t)) for _, t in textes(proto))


# ---------------------------------------------------------------------------
# Titres du bloc `geste_doux` — arretes le 28 aout, precises le 1er septembre 2026.
# Trois titres au maximum par theme. Les transverses valent partout ; le troisieme
# est PROPRE au theme et ne doit pas etre recycle dans un autre slot.
# Reference : skills/SKILL_protocole.md § 3.7
# ---------------------------------------------------------------------------
TITRES_TRANSVERSES = (
    "Réflexologie",     # des que le geste releve de la reflexologie
    "Geste doux",       # geste corporel non reflexologique
    "Observer bébé",    # on demande au parent de lire, pas d'agir
    "Si ça arrive",     # RESERVE au danger vital (etouffement)
)

# Un titre thematise par categorie. La cle est l'id de categorie du protocole.
TITRES_THEMATISES = {
    "alim":      ("Hors du repas",),        # M6+, la diversification a commence
    "digestion": ("Au moment du lait",),    # M0-M5, avant la diversification : tetee ou prise
    "parent":    ("Retrouver le contact",),  # M0-M23, le geste corporel AVEC l'enfant
}


def verifier_protocole(proto, etiquette, rapport):
    def dire(gravite, msg):
        rapport.append((gravite, f"{etiquette} : {msg}"))

    for champ in CHAMPS_OBLIGATOIRES:
        if champ not in proto:
            dire("ERREUR", f"champ manquant « {champ} »")

    # Souplesse d'un point sur chaque bloc — arretee le 8 septembre 2026.
    # Decision de Laura : « pourquoi se limiter a 4 points s'il en faut plus ? »,
    # puis « on ajoute de la souplesse dans le nombre de points dans les categories.
    # Si c'est necessaire, on ajoute un point. »
    #
    # Le compte de reference ne bouge pas : 4 points, 4 erreurs, 5 etapes. C'est le
    # standard visuel de l'app et il oblige a choisir. Ce qui change, c'est qu'UN
    # point de plus est admis quand une idee est ecrasee en etant fondue dans une
    # autre — jamais pour caser une pensee supplementaire.
    # Le vrai plafond n'est pas le nombre de puces : c'est le volume du protocole,
    # qui reste entre 350 et 800 mots.
    for champ, mini, maxi in [("pour_aller_plus_loin", 4, 5), ("erreurs_a_eviter", 4, 5)]:
        val = proto.get(champ)
        if isinstance(val, list) and not (mini <= len(val) <= maxi):
            attendu = str(mini) if mini == maxi else f"{mini} ou {maxi}"
            dire("ERREUR", f"{champ} = {len(val)} elements (attendu {attendu})")

    for champ in ["action_immediate", "geste_doux"]:
        bloc = proto.get(champ)
        if isinstance(bloc, dict):
            etapes = bloc.get("etapes", [])
            if len(etapes) > 6:
                dire("ERREUR", f"{champ} = {len(etapes)} etapes (5, 6 au maximum)")
            elif len(etapes) == 6:
                dire("ALERTE", f"{champ} = 6 etapes — le 6e est-il vraiment une idee a part ?")
            sans_amorce = [e for e in etapes if ":" not in e[:60]]
            if sans_amorce:
                dire("ALERTE", f"{champ} : {len(sans_amorce)} etape(s) sans amorce « Amorce : suite »")
            titre = bloc.get("titre", "")
            if champ == "geste_doux":
                cat = proto.get("categorie", "")
                permis = TITRES_TRANSVERSES + TITRES_THEMATISES.get(cat, ())
                if not titre.startswith(permis):
                    if titre.startswith(tuple(t for c in TITRES_THEMATISES for t in TITRES_THEMATISES[c])):
                        dire("ALERTE", f"geste_doux : titre thematise emprunte a un autre slot "
                                       f"« {titre} » (categorie « {cat} »)")
                    else:
                        dire("ALERTE", f"geste_doux : titre inattendu « {titre} » (categorie « {cat} »)")

    # --- Format situation / titre, nouvelle convention du 26/08/2026 ---------------
    # AVANT : situation = « scene / detail », titre = « scene / ce que le protocole apporte ».
    #         La partie 1 du titre repetait la partie 1 de la situation (redite permanente).
    # APRES : situation = « Le nom de la situation / il fait ceci » (ou « je »), affichee
    #         entiere dans la liste, et reduite a sa partie 1 en sous-titre dans le protocole.
    #         titre  = le principe de la solution, en une phrase courte, sans separateur.
    # PERIODE DE TRANSITION : seul M9 est bascule. Les autres mois gardent l'ancien format,
    # signale en ALERTE et non en ERREUR. Une fois tous les mois bascules, passer les deux
    # controles ci-dessous en "ERREUR".
    titre = proto.get("titre", "")
    situation = proto.get("situation", "")
    if " / " in titre:
        dire("ALERTE", f"titre a l'ancien format (deux parties) : « {titre} »")
    else:
        if len(titre) > 48:
            dire("ALERTE", f"titre long ({len(titre)} car., 48 max) : « {titre} »")
        if titre[:1] and titre[:1] != titre[:1].upper():
            dire("ERREUR", f"titre sans capitale initiale : « {titre} »")
        if titre.endswith("."):
            dire("ERREUR", f"titre termine par un point : « {titre} »")
        import re as _re
        if _re.match(r"^(fais|faites|pense|pensez|prends|prenez|garde|gardez|essaie|essayez|mets|mettez)\b", titre, _re.I):
            dire("ERREUR", f"titre a l'imperatif (infinitif ou groupe nominal attendu) : « {titre} »")
    if " / " not in situation:
        dire("ALERTE", f"situation sans separateur « / » : « {situation} »")
    else:
        _p1, _p2 = [y.strip() for y in situation.split(" / ", 1)]
        import re as _re2
        _ARRETES_P1 = {"Sept mois de nuits hachees"}
        if (_sansacc(_p1) not in _ARRETES_P1
                and not _re2.match(r"^(le |la |les |l'|un |une |mon |ma |mes |son |sa |ses |leur |leurs |ce |cet |cette )", _p1, _re2.I)):
            dire("ALERTE", f"situation : partie 1 sans article « le / la / les » : « {_p1} »")
        # Exception du 02/09/2026 : une partie 2 entierement entre guillemets est une
        # citation (ce qu'on DIT au parent, pas ce qu'il dit). Elle n'a donc ni « il » ni « je ».
        _citation = _re2.match(r"^«[\s\u00a0].*[\s\u00a0]»$", _p2)
        # « on / nous » acceptes depuis le 02/09/2026 : c'est la voix du parent quand la
        # situation met en scene les deux parents (decision de Laura).
        # Libelles arretes par Laura le 09/09/2026 : la partie 2 y est une phrase du parent
        # sans pronom explicite (« Tout le monde est reparti »), et c'est voulu. Ils ne se
        # signalent plus. Toute nouvelle situation reste soumise a la regle.
        _ARRETES_P2 = {
            "Tout le monde est reparti", "Tous les autres bebes dorment",
            "Les comptes ne passent plus", "Ca ne passe pas", "Des mois apres",
            "Tout doit etre parfait", "Soulagee et triste a la fois",
            "Aucun temps a deux depuis un an", "Les autres marchent deja",
        }
        if (not _citation and _sansacc(_p2) not in _ARRETES_P2
                and not _re2.search(r"\b(ils?|elles?|je|j'|me|m'|moi|mon|ma|mes|ses|son|sa|on|nous|notre|nos)\b", _p2, _re2.I)):
            dire("ALERTE", f"situation : partie 2 sans « il » ni « je » : « {_p2} »")
        if _re2.search(r"\b(tu|te|toi|ton|ta|tes)\b", situation, _re2.I):
            dire("ERREUR", f"situation ecrite en « tu » (voix du parent attendue) : « {situation} »")

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


# ---------------------------------------------------------------------------
# Perimetre par defaut.
#
# Sans argument, le script verifiait ZERO fichier et annoncait « 0 erreur ».
# Corrige le 08/09/2026 : sans argument, il passe tout le contenu vivant, et il
# refuse de rendre un verdict s'il n'a rien lu.
# ---------------------------------------------------------------------------
RACINE = pathlib.Path(__file__).resolve().parent.parent
EXCLUS = ("_avant", "anciens", "_sauvegardes", "_archive")


def corpus_vivant():
    """Tous les JSON de contenu qui portent des protocoles, hors sauvegardes."""
    fichiers = []
    for chemin in sorted((RACINE / "content").rglob("*.json")):
        rel = chemin.relative_to(RACINE).as_posix()
        if any(x in rel for x in EXCLUS):
            continue
        try:
            data = json.loads(chemin.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            continue
        if isinstance(data, dict) and (data.get("protocoles") or data.get("categories")):
            fichiers.append(str(chemin))
    return fichiers


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    check_only = "--check-only" in sys.argv
    if not args:
        args = corpus_vivant()
        print(f"Aucun chemin donne : controle de tout le contenu vivant "
              f"({len(args)} fichier(s)).")
    if not args:
        print("\nAUCUN FICHIER LU — le controle n'a pas eu lieu. Rien n'est valide.")
        sys.exit(2)
    total = 0
    for chemin in args:
        total += verifier_fichier(chemin, check_only)
    print(f"\n{len(args)} fichier(s) verifie(s) — total erreurs bloquantes : {total}")
    sys.exit(1 if total else 0)

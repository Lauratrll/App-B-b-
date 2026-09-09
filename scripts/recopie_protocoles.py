# -*- coding: utf-8 -*-
"""Recopie RÉELLE : consulter_si et les refrains de sécurité sont exclus (décisions du 01/09/2026)."""
import json, re, itertools, glob, sys

REFRAINS_SECURITE = [
 "Coucher bébé sur le ventre ou sur le côté pour soulager son ventre",
 "Tapoter fort ou secouer bébé pour faire sortir l'air",
 "Introduire un thermomètre, un coton-tige ou un suppositoire",
 "Donner de l'eau, un jus de fruit ou une tisane à un bébé de moins de six mois",
 "Changer de lait, sa dose ou sa dilution de sa propre initiative",
 "Surélever la tête du lit, incliner son matelas ou glisser une cale",
 "Utiliser des huiles essentielles",
 "Le coucher à plat, sur le dos",
 "Ne rien surélever soi-même",
 "Chercher à déclencher la selle en introduisant quelque chose",
 "Ne rien introduire pour faire venir la selle",
 # --- Parents submerges : le retrait d'urgence et le secouement (02/09/2026).
 # Decision du 01/09 : une consigne de securite s'ecrit une fois et se repete mot pour mot.
 "Poser l'enfant en sécurité",
 "Poser bébé sur le dos dans son lit",
 "Sortir de la pièce",
 "Sortir : une autre pièce",
 "Faire baisser par le corps",
 "Faire baisser la tension physiquement",
 "Ne jamais secouer",
 "Appeler quelqu'un avant de revenir",
 "Revenir quand la voix est redescendue",
 "Appeler avant de revenir",
 # --- 09/09/2026 : l'introduction du 119 sur les cartes de colere parentale.
 # Decision de Laura : le numero se garde, mais il ne s'annonce jamais sans cette phrase,
 # sinon il se lit comme un soupcon. C'est donc un refrain de securite, mot pour mot.
 "si tu as besoin de parler de ce que tu ressens envers ton enfant",
 "le 119 répond aussi aux parents",
 # --- 09/09/2026, passe Ventre & digestion : trois formulations arretees qui se repetent
 # mot pour mot d'un protocole a l'autre et ne sont pas de la recopie.
 # 1. La clause d'arret du geste de reflexologie (SKILL_protocole 3.7, consentement du bebe).
 "S'arrêter à sa demande",
 # 2. Le renvoi au pharmacien (regle du 26/08 : on ne prend pas position sur un remede).
 "c'est lui qui sait ce qui convient à cet âge",
 "Demander au pharmacien",
 # 3. Les portes institutionnelles nommees (meme statut que « Mon soutien psy », 03/09).
 "Pousser la porte de la PMI",
 "Poser la question à la PMI",
 "les consultations de suivi des premières semaines",
]
# --- Refrains institutionnels : noms de dispositifs et portes d'entree.
# Decision du 03/09/2026 : la formulation de « Mon soutien psy » est arretee mot pour mot
# (nom exact, prise en charge, acces), exactement comme une consigne de securite.
# Elle se repete donc a l'identique et n'est pas comptee comme de la recopie.
REFRAINS_INSTITUTIONNELS = [
 "Connaître Mon soutien psy",
 "Mon soutien psy",
 "Utiliser les dispositifs existants",
 "S'appuyer sur Maman Blues",
 "Connaître les relais",
 "S'appuyer sur les ressources",
]
REFRAINS_SECURITE += REFRAINS_INSTITUTIONNELS

def securite(ligne):
    return any(ligne.startswith(r) or r in ligne[:70] for r in REFRAINS_SECURITE)

def grams(s, n=8):
    w = re.findall(r"[a-zà-ÿ']+", s.lower())
    return set(tuple(w[i:i+n]) for i in range(len(w)-n+1))

def texte(pr, brut):
    t = [pr["explication"], pr["ancrage"], pr["principe"]]
    listes = pr["action_immediate"]["etapes"] + pr["geste_doux"]["etapes"] \
           + pr["pour_aller_plus_loin"] + pr["erreurs_a_eviter"]
    if brut:
        t.append(pr["consulter_si"]); t += listes
    else:
        t += [l for l in listes if not securite(l)]
    return " ".join(t)

motif = sys.argv[1] if len(sys.argv) > 1 else "N3_ventre_digestion"
tous = []
for f in sorted(glob.glob(f"content/mois-*/M*_guide_moi_*{motif}*.json")):
    if "_avant" in f or "anciens" in f: continue
    m = int(re.search(r"mois-(\d+)", f).group(1))
    for pr in json.load(open(f, encoding="utf-8"))["protocoles"]:
        tous.append((m, pr))
print(f"{len(tous)} protocoles\n{'paire':70s} {'brut':>6s} {'réel':>6s}")
lignes = []
for (m1, a), (m2, b) in itertools.combinations(tous, 2):
    net = len(grams(texte(a, False)) & grams(texte(b, False)))
    if net >= 15:
        lignes.append((net, len(grams(texte(a, True)) & grams(texte(b, True))),
                       f"M{m1} {a['situation'][:30]:32s}<-> M{m2} {b['situation'][:30]}"))
lignes.sort(reverse=True)
for net, brut, lib in lignes: print(f"{lib:70s} {brut:6d} {net:6d}")
print(f"\n{len(lignes)} paire(s) au-dessus de 15 en recopie réelle" if lignes
      else "\naucune paire au-dessus de 15 en recopie réelle")

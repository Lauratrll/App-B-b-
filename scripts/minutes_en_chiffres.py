# -*- coding: utf-8 -*-
"""Regle des 8-9 septembre 2026 : toute duree s'ecrit en chiffres (secondes, minutes, heures).
Ne touche QUE les champs de consigne (etapes, pour_aller_plus_loin, consulter_si).
La prose et les libelles sont listes pour relecture, jamais modifies automatiquement."""
import json, io, re, glob, sys, collections

NB = {u"une":1,u"deux":2,u"trois":3,u"quatre":4,u"cinq":5,u"six":6,u"sept":7,u"huit":8,
      u"neuf":9,u"dix":10,u"onze":11,u"douze":12,u"treize":13,u"quatorze":14,u"quinze":15,
      u"seize":16,u"vingt":20,u"trente":30,u"quarante":40,u"cinquante":50,u"soixante":60}
COMP = {u"vingt-cinq":25,u"trente-cinq":35,u"quarante-cinq":45,u"cinquante-cinq":55,
        u"soixante-dix":70,u"soixante-quinze":75,u"quatre-vingt-dix":90,
        u"quatre-vingt-quinze":95,u"quatre-vingts":80,u"quatre-vingt":80}
TOUS = sorted(list(COMP)+list(NB), key=len, reverse=True)
MOT = u"(?:%s)" % u"|".join(TOUS)
SEP = u"(?:\\s*(?:,\\s*)?(?:à|a|ou|puis)\\s+)"
# Les minutes se convertissent des « une » (consigne chronometree : « 1 minute par pied »).
# Les secondes et les heures se convertissent a partir de « deux » seulement :
#   « qu'1 heure », « en 1 seconde » ne s'ecrivent pas, et « une heure » designe le plus
#   souvent un moment (« a une heure decidee », « une heure de la journee »), pas une duree.
MOT2 = u"(?:%s)" % u"|".join([w for w in TOUS if w != u"une"])
RX  = re.compile(u"\\b(%s(?:%s%s)*)\\s+(minutes?)\\b" % (MOT, SEP, MOT), re.I)
RX2 = re.compile(u"\\b(%s(?:%s%s)*)\\s+(secondes?|heures?)\\b" % (MOT2, SEP, MOT2), re.I)
RXMOT = re.compile(u"\\b(%s)\\b" % MOT, re.I)

def chiffre(m):
    w = m.group(1).lower()
    return str(COMP.get(w, NB.get(w, w)))

def convertir(t):
    if not t: return t, 0
    n = [0]
    def rep(m):
        n[0] += 1
        return RXMOT.sub(chiffre, m.group(1)) + u" " + m.group(2)
    s = _protege(t)
    s = RX.sub(rep, s)
    s = RX2.sub(rep, s)
    return _restaure(s), n[0]

CONSIGNES = ("action_immediate", "geste_doux", "pour_aller_plus_loin", "consulter_si",
             "explication", "ancrage", "principe", "erreurs_a_eviter", "titre")
PROSE     = ()
LIBELLES  = ("situation",)

# Tournures ou le nombre n'est pas une duree mais une figure de style
# (« pas la moindre minute », « aussitot ») : elles restent en lettres.
IDIOMES = [
    # figures de style : le nombre n'est pas une mesure
    u"plus passé une minute",
    u"te perdre de vue, même une minute",
    u"le dira en une minute",
    # « une heure » qui designe un moment, pas une duree
    u"une heure décidée", u"une heure fixe", u"une heure précise", u"une heure donnée",
    u"une heure dite", u"une heure nommée", u"une heure choisie", u"une heure décidée",
    u"à une heure", u"une heure du matin", u"une heure de l'après-midi",
    u"une heure difficile", u"une heure dure", u"une heure creuse",
]

def _protege(t):
    for i, s in enumerate(IDIOMES):
        t = t.replace(s, u"\x00%d\x00" % i)
    return t

def _restaure(t):
    for i, s in enumerate(IDIOMES):
        t = t.replace(u"\x00%d\x00" % i, s)
    return t

def main(ecrire):
    tot = 0; touches = []; a_relire = collections.OrderedDict()
    for f in sorted(glob.glob("content/mois-*/*.json")):
        if any(x in f for x in ("_avant","anciens","_sauvegardes","_archive")): continue
        try: d = json.load(io.open(f, encoding="utf-8"))
        except Exception: continue
        protos = list(d.get("protocoles") or [])
        for c in (d.get("categories") or []): protos += list(c.get("protocoles") or [])
        if not protos: continue
        n_f = 0
        for p in protos:
            for k in CONSIGNES:
                v = p.get(k)
                if isinstance(v, str):
                    nv, n = convertir(v); p[k] = nv; n_f += n
                elif isinstance(v, list):
                    for i, x in enumerate(v):
                        nv, n = convertir(x); v[i] = nv; n_f += n
                elif isinstance(v, dict):
                    for kk in ("titre","etapes"):
                        vv = v.get(kk)
                        if isinstance(vv, str):
                            nv, n = convertir(vv); v[kk] = nv; n_f += n
                        elif isinstance(vv, list):
                            for i, x in enumerate(vv):
                                nv, n = convertir(x); vv[i] = nv; n_f += n
            for k in PROSE + LIBELLES:
                v = p.get(k)
                items = v if isinstance(v, list) else ([v] if isinstance(v, str) else [])
                for x in items:
                    for m in RX.finditer(x or ""):
                        i = max(0, m.start()-55)
                        a_relire.setdefault(("LIBELLE" if k in LIBELLES else "PROSE", k), []).append(
                            u"M%-3s %s« …%s[%s]%s… »" % (d.get("mois","?"), "", x[i:m.start()],
                             m.group(0), (x[m.end():m.end()+30])))
        if n_f:
            tot += n_f; touches.append((f, n_f))
            if ecrire: json.dump(d, io.open(f,"w",encoding="utf-8"), ensure_ascii=False, indent=2)
    print(u"%d occurrence(s) converties dans %d fichier(s)%s\n" % (tot, len(touches),
          u"" if ecrire else u"  (SIMULATION — rien ecrit)"))
    for (typ,k), lst in a_relire.items():
        print(u"--- %s : %s — %d a relire a la main ---" % (typ, k, len(lst)))
        for l in lst: print(u"   " + l)
        print()

if __name__ == "__main__":
    main("--ecrire" in sys.argv)

#!/usr/bin/env python3
"""Recopie les blocs communs (source unique : content/sommeil/_blocs_communs.md)
dans chaque fichier content/sommeil/M*_sommeil.md, entre les deux marqueurs.
Usage : python3 scripts/recopie_communs_sommeil.py"""
import re, pathlib
base = pathlib.Path(__file__).resolve().parent.parent / "content" / "sommeil"
src = (base / "_blocs_communs.md").read_text(encoding="utf-8")
communs = src[src.index("### "):].strip()  # tout ce qui suit l'en-tête du fichier source
BEGIN_RE = re.compile(r"<!-- BLOCS COMMUNS\s*:\s*début")
END_RE = re.compile(r"<!-- BLOCS COMMUNS\s*:\s*fin -->")
n = 0
for f in sorted(base.glob("M*_sommeil.md")):
    t = f.read_text(encoding="utf-8")
    mb = BEGIN_RE.search(t); me = END_RE.search(t)
    i = mb.start() if mb else -1; j = me.start() if me else -1
    if i < 0 or j < 0:
        print("marqueurs absents :", f.name); continue
    k = t.index("-->", i) + 3
    new = t[:k] + "\n" + communs + "\n" + t[j:]
    if new != t:
        f.write_text(new, encoding="utf-8"); n += 1
    print("ok :", f.name)
print(n, "fichier(s) mis à jour")

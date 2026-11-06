"""Génère content/apaisement/gestes_apaisement.json (lu par l'app) et docs/apaisement notes/Gestes_apaisement_textes_lisibles.md
à partir de content/apaisement/Gestes_apaisement_reference.xlsx (le tableau est la source, on ne modifie jamais le JSON à la main).
Usage (depuis la racine du projet) : python scripts/export_gestes_apaisement.py   (nécessite openpyxl : pip install openpyxl)"""
import openpyxl, re, json, unicodedata, os, sys
from openpyxl.cell.rich_text import CellRichText, TextBlock
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D=os.path.join(ROOT,'content','apaisement')
DOCS=os.path.join(ROOT,'docs','apaisement notes')
ws=openpyxl.load_workbook(os.path.join(D,'Gestes_apaisement_reference.xlsx'),data_only=True,rich_text=True)['Gestes']
ONGLETS=[('ventre_gaz','Mal de ventre, gaz'),('stop_pleurs','Stop pleurs'),('detente','Détente'),('portage','Portage'),('guide','Guide')]
ONG_ID={l.lower():k for k,l in ONGLETS}
ONG_DEFAUT='stop_pleurs'   # onglet d'arrivée la première fois (réglable ici)
def nbsp(x):
    """Espace insécable (U+00A0) avant : ; ! ? » et après «, appliquée à tous les textes du JSON."""
    if isinstance(x,str):
        x=re.sub(r' +([:;!?»])',lambda m:'\u00a0'+m.group(1),x)
        return re.sub(r'(«) +',lambda m:'«\u00a0',x)
    if isinstance(x,list): return [nbsp(i) for i in x]
    if isinstance(x,dict): return {k:nbsp(v) for k,v in x.items()}
    return x


def val(c):
    """Valeur d'une cellule ; le gras Excel devient **gras** et l'italique *italique* (markdown)."""
    v=c.value
    if isinstance(v,CellRichText):
        out=''
        for p in v:
            if isinstance(p,TextBlock):
                t=p.text
                if p.font is not None and t.strip():
                    if p.font.b and p.font.i: t='***'+t+'***'
                    elif p.font.b: t='**'+t+'**'
                    elif p.font.i: t='*'+t+'*'
                out+=t
            else: out+=p
        return out
    return v
def slug(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')
def clean(x): return re.sub(r'\s+',' ',x).strip() if isinstance(x,str) and x.strip() else None
def month(x):
    m=re.match(r'M(\d+)',str(x)); return int(m.group(1)) if m else None
BAD=re.compile(r'formation|projet|blog|edpp|doc \d+|carte th|brazelton|^none$|^aucune',re.I)
def sources(s):
    out=[]
    for line in (s or '').split('\n'):
        line=line.strip()
        if re.search(r'webmd|yada',line,re.I): continue
        if not line or BAD.search(line) and not line.startswith('Câlin papillon'): 
            # ligne mixte « sante.fr, formation » : garder les morceaux propres
            parts=[p.strip() for p in line.split(',') if p.strip() and not BAD.search(p)]
            if parts and not re.search(r'blog|yada|webmd',line,re.I): out.append(', '.join(parts))
            continue
        out.append(line)
    return out
def pas_a_pas(desc):
    if not desc: return None
    intro,et,suite=[],[],[]
    for line in desc.split('\n'):
        line=line.strip()
        if not line or re.fullmatch(r'\(.*\)',line): continue
        parts=re.split(r'\s+(?=\d+\.\s)',line)   # étapes collées sur une ligne
        for p in parts:
            m=re.match(r'(\d+)\.\s+(.*)',p)
            if m: et.append(m.group(2).strip())
            elif et: suite.append(p)
            else: intro.append(p)
    return dict(intro=intro,etapes=et,suite=suite)
G=[];n=0
for r in [[val(c) for c in row] for row in ws.iter_rows(min_row=2)]:
    if not r[0] or (r[18] or '').strip()!='Valider': continue
    n+=1; nom=clean(r[0]); d,f=month(r[1]),month(r[2]); tous=d is None
    fmt=clean(r[4]) or ''
    g=dict(id=slug(re.sub(r'\(.*?\)','',nom)) or slug(nom), ordre=n, titre=nom,
        mois_debut=0 if tous else d, mois_fin=23 if tous else f,
        onglet=ONG_ID.get(str(r[21] or '').strip().lower()), _tri=r[22],
        format_prevu=fmt, visuel_attendu=bool(re.search(r'vid[eé]o|image|infographie|sch[eé]ma|visuel',fmt,re.I)),
        objectif=clean(r[12]), pourquoi=re.sub(r'\s*\((?:sante\.fr|ameli)[^)]*\)','',clean(r[13]) or '') or None,
        pas_a_pas=pas_a_pas(r[14]),
        cadre_securite=[l.strip() for l in (r[20] or '').split('\n') if l.strip()] or None,
        sources=sources(r[17]))
    if nom.startswith('Cohérence'): g.update(type='lien_coherence_cardiaque')
    assert g['onglet'],f"Onglet manquant ou inconnu pour « {nom} » (colonne V)"
    G.append(g)
ids=[g['id'] for g in G]; assert len(ids)==len(set(ids))
ordo=[k for k,_ in ONGLETS]
G.sort(key=lambda g:(ordo.index(g['onglet']),g['_tri'] if isinstance(g['_tri'],(int,float)) else 999))
for i,g in enumerate(G,1): g['ordre']=i; g.pop('_tri')
out=dict(module='apaisement',route='/apaisement',titre_page="Gestes d'apaisement",sous_titre='Boîte à outils',
 placeholder_visuel='Contenu visuel en cours de réalisation',
 mention_description='Description en cours de création',
 onglet_par_defaut=ONG_DEFAUT, masquer_onglet_sous_n_gestes=1,
 onglets=[dict(id=k,label=l) for k,l in ONGLETS],
 gestes=G)
out=nbsp(out)
G=out['gestes']
J=os.path.join(D,'gestes_apaisement.json')
json.dump(out,open(J,'w',encoding='utf-8'),ensure_ascii=False,indent=2)

L={f['id']:f['label'] for f in out['onglets']}
o=["# Gestes d'apaisement : textes tels qu'ils s'afficheront dans l'app\n",
"Version lisible, générée à partir de `Gestes_apaisement_reference.xlsx` (le tableau reste la source : on modifie là, puis on régénère ce fichier et le JSON). Chaque fiche affiche : le titre, l'objectif en sous-titre, « Gestes pas à pas », « Cadre de sécurité » (seulement si renseigné), « Pourquoi ça fonctionne », les sources. Mention affichée : « Description en cours de création ». Visuel : « Contenu visuel en cours de réalisation ».\n"]
for g in G:
    mois='Tous âges' if g.get('type') else f"M{g['mois_debut']} à M{g['mois_fin']}"
    o.append(f"\n---\n\n## {g['ordre']}. {g['titre']}\n")
    o.append(f"*Visible : {mois} · Onglet : {L[g['onglet']]}*\n")
    if g['objectif']: o.append(f"**{g['objectif']}**\n")
    p=g['pas_a_pas']
    if p:
        o.append("### Gestes pas à pas\n")
        for t in p['intro']: o.append(t+"\n")
        for i,t in enumerate(p['etapes'],1): o.append(f"{i}. {t}")
        if p['etapes']: o.append("")
        for t in p['suite']: o.append(t+"\n")
    if g['cadre_securite']:
        o.append("### Cadre de sécurité\n")
        for t in g['cadre_securite']: o.append(f"- {t}")
        o.append("")
    if g['pourquoi']: o.append(f"### Pourquoi ça fonctionne\n\n{g['pourquoi']}\n")
    if g['sources']:
        o.append("### Sources\n")
        for s in g['sources']: o.append(f"- {s}")
        o.append("")
open(os.path.join(DOCS,'Gestes_apaisement_textes_lisibles.md'),'w',encoding='utf-8').write("\n".join(o))
print(len(G),'gestes écrits dans content/apaisement/gestes_apaisement.json et docs/apaisement notes/Gestes_apaisement_textes_lisibles.md')

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Construit Signaux_bebe_reference_v2.xlsx (questionnaire court « pleurs ») à partir de
Signaux_bebe_reference.xlsx, qui reste intact (réutilisable pour un questionnaire sommeil)."""
import copy, re, shutil, sys
import openpyxl
from openpyxl.formatting.rule import FormulaRule, CellIsRule
from openpyxl.formatting.formatting import ConditionalFormattingList
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.styles import PatternFill

SRC, DST = sys.argv[1], sys.argv[2]
shutil.copy(SRC, DST)
wb = openpyxl.load_workbook(DST)
wq, wr = wb["Questionnaire"], wb["Résultat"]

PISTES = ["FA", "VE", "FT", "CT", "SU", "SO", "ET", "EN", "IN", "SA"]
COLP = {c: 7 + i for i, c in enumerate(PISTES)}  # G..P
C_SRC, C_NOTE, C_STAT, C_TYPE, C_DEC, C_REM = 17, 18, 19, 20, 21, 22

# ----------------------------------------------------------------- lignes du questionnaire
CAT = {
    1: ("1. Pleurs", "Comment sont ses pleurs ?"),
    4: ("2. Regard", "Que fait son regard ?"),
    5: ("3. Visage", "Que fait son visage ?"),
    6: ("4. Corps et mouvements", "Comment est son corps, comment bouge-t-il ?"),
    3: ("5. Environnement", "Dans quel environnement est-il maintenant ?"),
    2: ("6. Rythme de la journée", "Comment s'est passée sa journée ?"),
}
ORDER = [1, 4, 5, 6, 3, 2]  # ordre des écrans (06/11, Laura)
S, P, I, V = "Sourcé", "Preuve partielle", "Source interne", "Proposition à valider"
L = []  # (cat, reponse, min, max, pts, sources, note, statut, type)
def add(cat, rep, mn, mx, pts, src, note, statut, typ="Signe"):
    L.append((cat, rep, mn, mx, pts, src, note, statut, typ))

# 1. Pleurs : durée, rythme, régularité, intensité
add(1, "Petits pleurs, gémissements, grognements", 0, 9, dict(FA=1, FT=1, CT=1, SU=1, EN=1), "S10, S13", "Début de l'escalade : peu distinctif.", S)
add(1, "Pleurs intenses qui montent, difficiles à calmer", 0, 9, dict(FA=1, VE=1, FT=1, SU=1, SO=1), "S08, S09, S11, S04, S28", "Faim, niveau 3 : signe tardif de la faim à tout âge (décision Laura 05/11). Poids volontairement faible : les pleurs intenses ont d'autres causes. Le message « le calmer d'abord » dépend de ce texte exact.", S)
add(1, "Pleurs intenses qui montent, difficiles à calmer", 10, 23, dict(FA=1, VE=1, FT=1, SU=1), "S04, S28", "Même ligne, pour les âges où les pleurs du soir ne s'appliquent plus.", S)
add(1, "Pleurs qui commencent et s'arrêtent brusquement", 0, 4, dict(SO=2), "S14, S07, S31", "Rythme : début et fin brusques, difficiles à consoler (pleurs du soir).", S)
add(1, "Pleurs à la même heure chaque jour", 0, 4, dict(VE=2, SO=2), "S08, S07", "Régularité : crises à heures régulières (S08). Se distinguent par le contexte.", S)
add(1, "Il pleure depuis longtemps : plus de 3 h par jour", 0, 11, {}, "S08, S09, S31", "Durée. S31 : environ 2 h par 24 h en moyenne. S08 range les pleurs de plus de 3 h par jour parmi les signes à faire évaluer. Voir « Alertes ».", S, "ALERTE")
add(1, "Cri aigu, inhabituel, qui me fait peur", 0, 23, {}, "S08", "Voir « Alertes » : cri qui change.", S, "ALERTE")
add(1, "Il pleure à chaque tétée ou biberon, pendant ou juste après", 0, 11, {}, "S08, S07, S31", "Point distinctif (décision Laura 06/11) : s'il est systématique, S08 le range parmi les signes à faire évaluer. S31/S07 : réflexe gastro-colique, reflux. Voir « Alertes ».", S, "ALERTE")

# 2. Rythme de la journée
add(2, "Journée très remplie : visites, sorties…", 0, 23, dict(FT=1, SU=2), "S07, S10, S24", "S07 recommande un environnement calme. Lien visite/pleurs : carte éditoriale interne, sans étude. L'explication « cortisol » n'est pas retenue (S29).", I)
add(2, "Journée stimulante : écran, bruit, agitation, lumière forte", 0, 23, dict(SU=2), "S31, S06, S24", "Bruit et lumière trop forts : S31. Écran : source interne uniquement.", P)
add(2, "Crèche ou nounou : bruits, autres enfants", 0, 23, dict(FT=1, SU=1), "S24", "Proposition éditoriale (v2), sans source externe.", V)
add(2, "Changement de repères : nouveau lieu, rythme, garde…", 0, 23, dict(CT=1, SU=1), "S24", "Source interne uniquement.", I)
add(2, "Un vaccin ces dernières 48 h", 0, 23, dict(IN=2), "S32", "S32 : irritabilité et douleur au point d'injection possibles, réactions normales jusqu'à 2 jours. Voir « Alertes » (fièvre > 39 °C, pleurs inconsolables).", S)
add(2, "Journée calme, lumière douce", 0, 23, dict(SU=-1), "S31, S06", "Contre la piste sur-stimulation. Proposition éditoriale.", V)
add(2, "Bébé beaucoup posé", 0, 23, dict(CT=2), "S31, S15", "S31 : le besoin de contact est la principale cause de pleurs. S15 : un bébé porté davantage pleure moins (lien à retrouver).", P)
add(2, "Bébé beaucoup porté", 0, 23, dict(CT=-1), "S15", "S15 : porté davantage, il pleure moins. Le besoin de contact est déjà comblé.", P)
add(2, "Il a eu du temps pour explorer, bouger librement", 6, 23, dict(ET=-1), "S24", "À partir de 6 mois (mobilité). Proposition éditoriale, sans source.", V)
add(2, "Il a été plutôt contraint (siège, transat, parc, porte-bébé…)", 6, 23, dict(ET=2, EN=1), "S24", "À partir de 6 mois (mobilité). Proposition éditoriale, sans source.", V)

# 3. Environnement maintenant
add(3, "Stimulant : écran, bruit, agitation, lumière forte", 0, 23, dict(FT=1, SU=3), "S31, S06", "S31 : un bruit ou une lumière trop forts peuvent déranger bébé.", S)
add(3, "Calme, lumière douce", 0, 23, dict(SU=-2), "S31, S06", "Contre la piste sur-stimulation.", S)
add(3, "Posé, en sécurité (lit, tapis, transat, chaise…)", 0, 23, dict(CT=2), "S31, S15", "S31 : le contact est la principale cause. Pleurs posé : le test est de le prendre.", P)
add(3, "Dans mes bras, en statique", 0, 23, dict(CT=-2), "S31", "Déjà dans les bras : le manque de contact est moins probable.", V)
add(3, "Dans mes bras ou en portage, en mouvement", 0, 23, dict(CT=-2, SU=1), "S31, S06", "S06 : il peut s'agiter davantage quand on le porte ou le stimule.", V)

# 4. Regard
add(4, "Il me regarde, cherche mon regard, sourit", 0, 23, dict(CT=1, SU=-1, EN=2), "S06", "Signaux d'engagement : éveil calme, disponible pour l'échange.", S)
add(4, "Il détourne le regard ou me fuit", 0, 23, dict(FT=2, SU=3), "S06, S13", "Partagé entre sur-stimulation (calme, pause) et fatigue (sieste).", S)
add(4, "Il fixe dans le vide, ses paupières papillonnent, il louche", 0, 23, dict(FT=3), "S05", "Signe de fatigue.", S)

# 5. Visage
add(5, "Il cherche à téter : il tourne la tête, ouvre la bouche, se lèche les lèvres", 0, 6, dict(FA=3), "S03, S04, S10", "Faim, niveau 1. Regroupe les deux anciennes lignes de « Bouche et succion » (la faim reste la cause n°1).", S)
add(5, "Il se frotte les yeux ou il bâille", 0, 23, dict(FT=3, SU=1), "S05, S10, S30, S06, S13", "Regroupe « se frotte les yeux » (FT 3) et « bâille » (FT 2, SU 1).", S)
add(5, "Il met ses mains devant le visage, doigts écartés", 0, 23, dict(FT=1, SU=3), "S06", "Geste de protection.", S)
add(5, "Visage crispé, yeux serrés, front bombé", 0, 23, dict(VE=1, IN=1), "S06", "Signaux d'inconfort ou de douleur. Si ça dure : voir « Alertes ».", S)
add(5, "Visage qui exprime la douleur mais je ne trouve rien", 0, 4, dict(SO=2), "S11", "Le visage « de douleur » fait partie de la courbe normale des pleurs, même sans douleur.", S)
add(5, "Il tire sur ses oreilles", 0, 23, dict(FT=1, IN=1), "S05, S07, S30", "Peut aussi venir d'une otite : si fièvre, consulter (S07).", S)
add(5, "Petites mimiques (sourire, grimaces), yeux qui clignent, mains ouvertes, il n'interagit pas", 0, 9, dict(VE=-2, FT=-1, SA=3), "S13", "Sommeil agité : les grimaces ne sont pas des plaintes. Ne pas le réveiller. Regroupe l'ancienne ligne de « Corps et tonus ».", S)
add(5, "Il bave, mord, se frotte les gencives", 4, 23, dict(IN=1), "S07", "Poussée dentaire : effets souvent surestimés, poids faible (prudence).", "Prudence")

# 6. Corps et mouvements (ex « Corps et tonus » + « Mouvements »)
add(6, "Il se raidit : bras et jambes tendus, dos arqué", 0, 23, dict(VE=2, FT=1, SU=2), "S08, S06, S05", "Regroupe « tendus, raidis » et « arque le dos » (mêmes points).", S)
add(6, "Il replie ses jambes contre le ventre, son ventre est dur ou gonflé", 0, 6, dict(VE=3), "S08, S07", "Regroupe « replie ses jambes » (VE 2) et « ventre dur ou gonflé » (VE 3). Avec « se raidit » et « même heure chaque jour », le ventre ressort par association.", S)
add(6, "Il s'agite : mouvements saccadés, désorganisés, il pousse des pieds", 0, 9, dict(FA=1, VE=1, FT=2, SU=2, CT=1), "S13, S05, S06", "Regroupe « s'agite » et « pousse des pieds contre un appui ». L'ancienne ligne « regroupé, pieds cherchent un appui » est retirée (deux positions mélangées).", S)
add(6, "Il porte les mains à la bouche, suce son poing ou ses doigts", 0, 5, dict(FA=2, FT=1, SU=1), "S04, S03, S02, S06, S05, S31", "Faim, niveau 2. Suce ses doigts : aussi un geste d'auto-apaisement.", S)
add(6, "Il a les bras et les jambes très relâchés, il se laisse aller", 0, 23, dict(FA=-2, FT=2), "S03, S13", "Signe de satiété ou de fatigue.", S)
add(6, "Il essaie de se retourner, ramper, se redresser ; il répète un geste", 3, 23, dict(ET=3), "S18", "Signe observable du geste en cours. Calendrier non confirmé (S27).", P)
add(6, "Il a l'air malade : mou, très peu tonique, il ne réagit pas", 0, 23, {}, "S08, S07, S31", "Voir « Alertes ». S31 : un bébé qui souffre est plutôt geignard et mou que hurlant.", S, "ALERTE")

L.sort(key=lambda l: ORDER.index(l[0]))
N = 1 + len(L)  # dernière ligne

# ----------------------------------------------------------------- Questionnaire : on réécrit
tmpl = {c: copy.copy(wq.cell(row=2, column=c)._style) for c in range(1, 25)}
hdr = [c.value for c in wq[1]]
hdr_style = [copy.copy(c._style) for c in wq[1]]
new_hdr = hdr[:6] + ["Points : " + {
    "FA": "Faim", "VE": "Ventre / gaz", "FT": "Fatigue", "CT": "Contact", "SU": "Sur-stimulation",
    "SO": "Pleurs du soir", "ET": "Nouvelle étape", "EN": "Ennui / échange", "IN": "Inconfort local", "SA": "Sommeil agité"}[c]
    for c in PISTES] + hdr[18:]
wq.delete_rows(2, wq.max_row)
for c, v in enumerate(new_hdr, 1):
    cell = wq.cell(row=1, column=c, value=v)
    cell._style = hdr_style[min(c - 1, 23)] if c <= 6 else hdr_style[6 + (c - 7) % 12] if c < 17 else hdr_style[c + 1]
for c in range(23, 25):
    wq.cell(row=1, column=c).value = None
for c in range(17, 23):  # colonnes après les points : styles d'en-tête d'origine (S..X)
    wq.cell(row=1, column=c)._style = hdr_style[c + 1]
wq.cell(row=1, column=23)._style = copy.copy(wq.cell(row=1, column=1)._style)
for i, (cat, rep, mn, mx, pts, src, note, statut, typ) in enumerate(L, 2):
    cname, q = CAT[cat]
    vals = {1: cname, 2: q, 3: rep, 4: None, 5: mn, 6: mx,
            C_SRC: src, C_NOTE: note, C_STAT: statut, C_TYPE: typ, C_DEC: None, C_REM: "Nouveau / regroupé (v2)" if True else None}
    for p, ci in COLP.items():
        vals[ci] = pts.get(p)
    for c in range(1, 23):
        cell = wq.cell(row=i, column=c, value=vals.get(c))
        src_col = c if c <= 6 else (7 if c < 17 else c + 2)  # style des points = style d'une colonne de points
        cell._style = copy.copy(tmpl[src_col])
    wq.cell(row=i, column=4)._style = copy.copy(tmpl[4])
for c, w in {17: 16, 18: 52, 19: 18, 20: 10, 21: 14, 22: 30}.items():
    wq.column_dimensions[openpyxl.utils.get_column_letter(c)].width = w
for c in (23, 24):
    wq.column_dimensions[openpyxl.utils.get_column_letter(c)].width = 9
wq.auto_filter.ref = f"A1:V{N}"
wq.conditional_formatting = ConditionalFormattingList()
wq.conditional_formatting.add(f"A2:C{N}", FormulaRule(formula=["OR($E2>'Résultat'!$B$3,$F2<'Résultat'!$B$3)"], fill=PatternFill(bgColor="EDEDED", fill_type="solid")))
wq.conditional_formatting.add(f"D2:D{N}", CellIsRule(operator="equal", formula=['"✔"'], fill=PatternFill(bgColor="DDEFE3", fill_type="solid")))
wq.data_validations.dataValidation = []
dv1 = DataValidation(type="list", formula1='"✔"', allow_blank=True); dv1.add(f"D2:D{N}")
dv2 = DataValidation(type="list", formula1='"Garder,À modifier,Écarter"', allow_blank=True); dv2.add(f"U2:U{N}")
wq.add_data_validation(dv1); wq.add_data_validation(dv2)

# ----------------------------------------------------------------- Résultat
def rng(col):
    return f"Questionnaire!${col}$2:${col}${N}"
OK = f'({rng("D")}="✔")*({rng("E")}<=$B$3)*({rng("F")}>=$B$3)'
LIB = {
    "FA": ("A faim / cherche à manger (3 niveaux d'intensité)", "Proposer à manger. S'il pleure fort : le calmer d'abord (câlin, voix douce), puis lui proposer à manger"),
    "VE": ("Inconfort du ventre, gaz, coliques", "Rot, jambes repliées doucement vers le ventre (voir Alertes si signes inquiétants)"),
    "FT": ("Fatigue, besoin de dormir (évolutif avec l'âge)", "Proposer une sieste"),
    "CT": ("Besoin de contact, de présence, de réassurance", "Le prendre dans les bras, le porter"),
    "SU": ("Trop de stimulations, besoin d'une pause", "Calme, pause, apaisement"),
    "SO": ("Pleurs du soir / pic des pleurs (3 sem. à 4 mois)", "Pas de cause à chercher : le porter, le bercer, se relayer (action à valider)"),
    "ET": ("Il a besoin de bouger, de s'exercer (nouvelle étape)", "Lui laisser l'espace de s'exercer, rester disponible (action à valider)"),
    "EN": ("Veut de l'échange, de l'activité (ajout proposé)", "Jeu, échange"),
    "IN": ("Gêne : couche, chaud ou froid, vêtement, fesses, vaccin, dents", "Regarder la couche, toucher la nuque ou la poitrine (trop chaud ? trop froid ?), vérifier que rien ne serre ni ne gratte, inspecter le corps"),
    "SA": ("Il dort (sommeil agité normal) : ne pas le réveiller", "Ne pas le réveiller"),
}
sty = {c: copy.copy(wr.cell(row=9, column=c)._style) for c in (1, 2, 3, 4, 10)}
for r in range(9, 21):
    for c in (1, 2, 3, 4, 10):
        wr.cell(row=r, column=c).value = None
for k, code in enumerate(PISTES):
    r = 9 + k
    col = openpyxl.utils.get_column_letter(COLP[code])
    wr.cell(row=r, column=1, value=LIB[code][0])
    wr.cell(row=r, column=2, value=code)
    wr.cell(row=r, column=3, value=f"=SUMPRODUCT({OK}*{rng(col)})")
    wr.cell(row=r, column=4, value=f'=IF(C{r}<=0,"",RANK(C{r},$C$9:$C$18)+COUNTIF($C$9:C{r},C{r})-1)')
    wr.cell(row=r, column=10, value=LIB[code][1])
    for c in (1, 2, 3, 4, 10):
        wr.cell(row=r, column=c)._style = copy.copy(sty[c])
for r in (19, 20):
    for c in (1, 2, 3, 4, 10):
        wr.cell(row=r, column=c)._style = copy.copy(wr.cell(row=21, column=c)._style)
wr["B5"] = f"=SUMPRODUCT({OK})"
wr["B6"] = f'=IF(SUMPRODUCT({OK}*({rng("T")}="ALERTE"))>0,"⚠ OUI : lis l\'onglet Alertes avant tout","Non")'
for r in (9, 10, 11):
    for c in (6, 7, 8):
        v = wr.cell(row=r, column=c).value
        if isinstance(v, str):
            wr.cell(row=r, column=c).value = v.replace("$20", "$18")
FT_ROW = 9 + PISTES.index("FT")
FA_ROW = 9
a21 = wr["A21"].value.replace("D13", f"D{FT_ROW}")
wr["A21"] = a21
wr["A22"] = wr["A22"].value.replace("$78", f"${N}")
wr["A23"] = wr["A23"].value.replace("D13", f"D{FT_ROW}")
wr["A25"] = wr["A25"].value.replace("$20", "$18")
wr["F15"] = ("Un signe absent ne compte pas : bébé ne montre jamais tous les signes à la fois. Seules les réponses cochées comptent, y compris "
             "les réponses qui vont contre une piste (par exemple : « Dans mes bras » enlève des points à « besoin de contact »). "
             "Les actions proposées plus bas s'essaient une à une ; aucun retour n'est demandé.")

# ----------------------------------------------------------------- Résultat : pistes d'observation et de consultation (06/11)
CONSEILS = {
    "FA": ("Il prend avec appétit et se calme après quelques minutes. Les signes précoces (il cherche, mains à la bouche) précèdent les pleurs.",
           "S'il refuse de boire, vomit ou régurgite beaucoup, ou prend peu de poids : en parler à un professionnel de santé.", "S09, S07, S08"),
    "VE": ("Les crises reviennent à heures régulières ; il se soulage après un rot ou les jambes repliées doucement. Repère des coliques : plus de 3 h par jour, 3 jours par semaine, depuis plus d'une semaine.",
           "Pleurs qui augmentent après la 8e semaine, sang dans les selles, fièvre, vomissements : consulter.", "S08, S09, S07, S21"),
    "FT": ("Compte le temps d'éveil et regarde ses yeux. Il se calme quand on l'installe pour dormir.", "", "S05"),
    "CT": ("Le test : le prendre dans les bras. Un calme rapide confirme le besoin de contact.", "", "S07, S15, S31"),
    "SU": ("Il s'apaise au calme, lumière basse, avec moins de monde. Il s'agite plus quand on le porte ou le stimule.", "", "S06, S10"),
    "SO": ("Âge de 2 semaines à 3-4 mois, fin d'après-midi ou soirée, début et fin brusques, rien d'autre ne l'explique, les essais ne marchent pas.",
           "Pleurs sans horaire précis, qui augmentent après la 8e semaine, qui durent plus de 3 h par jour ou après 3 mois : en parler à un professionnel de santé.", "S07, S08, S09, S11"),
    "ET": ("Il répète un geste, il est plus agité et plus collant depuis quelques jours, et un progrès visible suit.", "", "S18"),
    "EN": ("Un jeu ou un échange le calme et le fait sourire.", "", "S06, S10"),
    "IN": ("Regarde et touche la couche ; touche la nuque ou la poitrine (moite : trop chaud) ; cherche une étiquette, une couture, un cheveu autour d'un orteil ; après un vaccin, regarde la zone d'injection.",
           "Après un vaccin : fièvre supérieure à 39 °C, éruption, pleurs inconsolables ou ronchon plus de 24 h. Il tire sur son oreille avec de la fièvre : consulter.", "S07, S10, S22, S32"),
    "SA": ("Il n'interagit pas, mains ouvertes, petites mimiques : attends quelques instants avant d'intervenir.", "", "S31"),
}
for col, titre in ((11, "À observer"), (12, "Quand consulter"), (13, "Sources (conseils)")):
    wr.cell(row=8, column=col, value=titre)._style = copy.copy(wr.cell(row=8, column=10)._style)
    wr.column_dimensions[openpyxl.utils.get_column_letter(col)].width = 50
for k, code in enumerate(PISTES):
    for j, v in enumerate(CONSEILS[code]):
        wr.cell(row=9 + k, column=11 + j, value=v or None)._style = copy.copy(sty[10])

# étapes : couche et température deviennent une seule étape « gêne » (réponse, pas question)
steps = [
    ("Lui proposer à manger. S'il pleure très fort : le calmer d'abord (câlin, voix douce), puis lui proposer à manger", "S09, S07, S28"),
    ("Regarder la couche ; toucher la nuque ou la poitrine (ajouter ou enlever une couche si besoin) ; vérifier que rien ne serre", "S07, S22, S31"),
    ("Rot, jambes repliées doucement vers le ventre", "S07"),
    ("Le prendre dans les bras, le porter, le bercer doucement", "S09, S07, S31"),
    ("Si trop de stimulation : calme, pause, apaisement (lumière basse, moins de bruit et de monde)", "S09, S10"),
    ("Si fatigué : proposer une sieste", "S05, S13"),
    ("Laisser quelques minutes à chaque essai avant de conclure (durée non sourcée)", "—"),
    ("Si ça dure ou si un autre signe inquiète : voir Alertes", "S08, S09"),
    ("Pour toi : quelques respirations lentes, par exemple 5 secondes en inspirant, 5 secondes en expirant (cohérence cardiaque). Si tu es à bout : poser bébé en sécurité dans son lit et t'éloigner quelques minutes", "S09, S25, S26"),
]
for k, (t, s) in enumerate(steps):
    r = 27 + k
    wr.cell(row=r, column=1, value=str(k + 1)); wr.cell(row=r, column=2, value=t); wr.cell(row=r, column=6, value=s)
last = 27 + len(steps)  # 36
wr.unmerge_cells("B36:E36")
for c in range(1, 8):
    wr.cell(row=36, column=c).value = None
wr["A38"] = "L'ordre est une proposition, qui suit la Société canadienne de pédiatrie (S09) : vérifier faim, couche et température, puis porter et calmer."

# ----------------------------------------------------------------- Hypothèses : Couche + Chaud/froid -> Inconfort
wh = wb["Hypothèses"]
for r in range(wh.max_row, 1, -1):
    if wh.cell(row=r, column=1).value in ("Couche", "Chaud / froid"):
        wh.delete_rows(r)
for r in range(2, wh.max_row + 1):
    if wh.cell(row=r, column=1).value == "Inconfort local":
        wh.cell(row=r, column=1).value = "Gêne (couche, chaud/froid, vêtement, fesses, vaccin, dents)"
        wh.cell(row=r, column=2).value = "Forte quand on trouve la cause ; aucun signe de comportement fiable pour la couche et la température"
        wh.cell(row=r, column=3).value = "Fesses rouges, étiquette, couture, cheveu autour d'un orteil, couche serrée ; moite ou en sueur (trop chaud) ; vaccin récent (< 48 h)."
        wh.cell(row=r, column=5).value = "Regarder et toucher la couche ; toucher la nuque ou la poitrine (mains et pieds froids : pas un signe fiable ; chambre : 16-20 °C) ; inspecter le corps et les vêtements."
        wh.cell(row=r, column=7).value = "S07, S10, S12, S22, S32"

# ----------------------------------------------------------------- Alertes : vaccin
wa = wb["Alertes"]
row_style = [copy.copy(c._style) for c in wa[12]]
wa.insert_rows(13)
vals = ["Après un vaccin : fièvre supérieure à 39 °C, éruption, pleurs inconsolables ou bébé anormalement ronchon plus de 24 h, somnolence anormale, inflammation qui s'aggrave",
        "Réaction qui dépasse l'attendu", "Consulter.", "S32", "Rapide"]
for c, v in enumerate(vals, 1):
    cell = wa.cell(row=13, column=c, value=v); cell._style = copy.copy(row_style[c - 1])

# colonne F : réponse du questionnaire qui déclenche l'alerte (appel à consulter)
TRIG = {
    "Pleurs de plus de 3 h par jour": ["Il pleure depuis longtemps : plus de 3 h par jour"],
    "Pleurs systématiques pendant ou juste après les boires": ["Il pleure à chaque tétée ou biberon, pendant ou juste après"],
    "Changement de comportement, faible tonus": ["Cri aigu, inhabituel, qui me fait peur", "Il a l'air malade : mou, très peu tonique, il ne réagit pas"],
}
wa["F1"] = "Réponse du questionnaire qui la déclenche"
wa["F1"]._style = copy.copy(wa["E1"]._style)
wa.column_dimensions["F"].width = 40
for r in range(2, wa.max_row + 1):
    sit = str(wa.cell(row=r, column=1).value or "")
    for k, v in TRIG.items():
        if sit.startswith(k):
            wa.cell(row=r, column=6, value=" | ".join(v))._style = copy.copy(wa.cell(row=r, column=5)._style)

# ----------------------------------------------------------------- Sources
wsrc = wb["Sources"]
last = wsrc.max_row
while wsrc.cell(row=last, column=1).value in (None, ""):
    last -= 1
st = [copy.copy(c._style) for c in wsrc[last]]
new = [
    ["S31", "Pleurs de mon enfant, les comprendre et les calmer", "sante.fr (service public d'information en santé)", "consulté le 06/11/2026",
     "https://www.sante.fr/node/1068787", "Institutionnelle française (A)", "A",
     "Causes : faim, fatigue, couche, vêtements et température, ventre, besoin de contact (principale cause), bruit et lumière. Pleurs en moyenne ~2 h par 24 h ; pleurs du soir : début fin de la 2e semaine, maximum ~6 semaines, baisse fin du 1er trimestre. Bébé geignard et mou = douleur possible.",
     "Lu le 06/11/2026. Ne cite ni ennui, ni sur-stimulation, ni dents."],
    ["S32", "Après une vaccination, quand dois-je m'inquiéter et appeler un médecin ?", "sante.fr", "consulté le 06/11/2026",
     "https://www.sante.fr/apres-une-vaccination-quand-dois-je-minquieter-et-appeler-un-medecin", "Institutionnelle française (A)", "A",
     "Réactions normales quelques heures après : douleur ou rougeur au point d'injection, légère fièvre, bébé grognon ou somnolent, jusqu'à 2 jours. Consulter si fièvre > 39 °C, éruption, pleurs inconsolables ou ronchon > 24 h, somnolence anormale.",
     "Lu le 06/11/2026."],
]
for k, row in enumerate(new, 1):
    for c, v in enumerate(row, 1):
        wsrc.cell(row=last + k, column=c, value=v)._style = copy.copy(st[c - 1])

# ----------------------------------------------------------------- Par besoin : régénéré
wp = wb["Par besoin"]
pst = [copy.copy(c._style) for c in wp[2]]
wp.delete_rows(2, wp.max_row)
def force(p):
    return "Très évocateur" if p >= 3 else "Évocateur" if p == 2 else "Compatible"
r = 2
for code in PISTES:
    items = sorted([(l[4][code], l) for l in L if l[4].get(code, 0) > 0], key=lambda x: -x[0])
    first = True
    for p, l in items:
        vals = [LIB[code][0] if first else None, force(p), l[1], f"{l[2]}-{l[3]}", l[5], l[7], CAT[l[0]][0]]
        for c, v in enumerate(vals, 1):
            wp.cell(row=r, column=c, value=v)._style = copy.copy(pst[c - 1])
        first = False; r += 1

# ----------------------------------------------------------------- Lisez-moi
wl = wb["Lisez-moi"]
wl["A1"] = "Signaux de bébé : classeur de référence (VERSION 2, questionnaire « pleurs » court)"
wl["B2"] = ("Version 2 du 06/11/2026 : questionnaire raccourci pour répondre vite quand bébé pleure (6 écrans, environ 40 réponses au lieu de 77). "
            "Supprimés : âge (l'app le connaît), éveil depuis combien de temps, moment de la journée, couche, température, états de vigilance, bouche et succion, ventre et digestion, peau et température. "
            "Couche et température ne sont plus des questions mais des actions (piste « Gêne »). L'original Signaux_bebe_reference.xlsx est conservé intact pour un futur questionnaire sommeil. "
            "Lignes marquées « Proposition à valider » : points éditoriaux à trancher.")
wb.save(DST)
print("OK", DST, "lignes:", len(L), "N=", N)

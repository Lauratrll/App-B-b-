# SKILL\_protocole.md — Génération des protocoles Guide-moi !

> Lire ce fichier AVANT de générer tout protocole, quelle que soit la situation ou le mois.
> Ce skill définit la structure, le ton et les règles non-négociables de chaque protocole.

\---

## Structure obligatoire — 7 blocs dans l'ordre

Chaque protocole contient exactement ces 7 blocs. Aucun ne peut être omis.

### Bloc 1 — Explication neurologique / développementale

**Objectif :** Comprendre ce qui se passe POUR le bébé (pas pour le parent).
**Règles :**

* Toujours expliquer le mécanisme neurologique ou développemental à l'œuvre
* Jamais de jargon médical non expliqué
* Toujours bienveillant envers le bébé ("il ne fait pas exprès", "c'est neurologique")
* Jamais de formulation culpabilisante envers le parent
* Longueur : 3 à 5 phrases

**Formulations interdites :**

* "votre enfant" → "Théo" ou "bébé" ou "lui/elle"
* "il faut" → "tu peux", "une option est de"
* "c'est normal mais" → "c'est normal" (sans le "mais")
* Tout ce qui commence par "Malheureusement"

\---

### Bloc 2 — Phrase d'ancrage parent

**Objectif :** Réguler le parent AVANT qu'il agisse. Une seule phrase ou deux phrases courtes.
**Règles :**

* Adressée directement au parent (tu/toi)
* Reformule ce qui se passe en lui donnant un rôle clair et possible
* Jamais de "tu dois" — toujours "tu peux" ou "ton rôle est"
* Maximum 2 phrases
* Toujours en italique dans l'UI

**Exemples de bonnes phrases d'ancrage :**

* *"Tu n'as pas à calmer la crise. Tu as à rester présent(e) pendant qu'elle passe."*
* *"Son 'non' n'est pas contre toi. C'est pour lui."*
* *"Il cherche à se sentir. Son cerveau réclame des informations."*

\---

### Bloc 3 — Action immédiate (rouge)

**Objectif :** Ce qu'on fait dans les 30 secondes qui suivent.
**Règles :**

* 5 étapes numérotées maximum
* Verbes d'action au début de chaque étape, mais de vraies phrases. 
* Chaque étape = une action, pas deux
* Ordre chronologique strict
* Couleur UI : fond `#FCEBEB`, texte `#A32D2D`

**Format JSON :**

```json
"action\_immediate": {
  "titre": "Action immédiate — \[contexte précis]",
  "couleur": "#FCEBEB",
  "couleur\_texte": "#A32D2D",
  "etapes": \[
    "Étape 1 : verbe d'action + quoi + comment",
    ...
  ]
}
```

\---

### Bloc 4 — Action complémentaire douce (vert) — Réflexologie

**Objectif :** Geste réflexologique ou massage doux complémentaire à l'action immédiate.
**Règles :**

* 5 étapes maximum
* Toujours préciser la zone du pied concernée
* Toujours préciser le niveau de pression selon l'âge (voir tableau ci-dessous)
* Toujours préciser la durée (secondes ou minutes)
* Commencer par réchauffer les pieds si mois 0–3
* Couleur UI : fond `#E1F5EE`, texte `#085041`

**Tableau des niveaux de pression par âge :**

|Âge|Niveau de pression|Description|
|-|-|-|
|Mois 0–1|0/10|Effleurement à peine perceptible — le souffle suffit|
|Mois 2–3|1/10|Contact de la pulpe du doigt, aucune pression|
|Mois 4–6|2/10|Légère pression de la pulpe|
|Mois 7–12|3/10|Pression douce, cercles lents|
|Mois 13–18|4/10|Pression modérée, gestes fluides|
|Mois 19–24|5/10|Pression moyenne, toujours sans douleur|

**Zones réflexologiques de référence :**

|Zone du pied|Organe / Système|
|-|-|
|Gros orteil|Tête, cerveau, hypothalamus|
|Face interne gros orteil|Colonne vertébrale haute, gorge|
|Base des orteils|Gencives, dents|
|Voûte haute gauche|Estomac|
|Voûte haute droite|Foie, vésicule|
|Voûte centre|Plexus solaire, intestin grêle|
|Voûte basse|Côlon|
|Talon|Bassin, sécurité, ancrage|
|Cheville interne|Système reproducteur, lymphe|
|Bord externe du pied|Épaules, bras|

\---

### Bloc 5 — Action parent (rose)

**Objectif :** Ce que le parent fait pour lui-même (régulation émotionnelle).
**Règles :**

* 4 étapes maximum
* Toujours inclure au moins 1 action de régulation de soi (respiration, recul, etc.)
* Toujours inclure au moins 1 action concrète et pratique
* Couleur UI : fond `#FBEAF0`, texte `#72243E`

\---

### Bloc 6 — Conseil préventif (ambre)

**Objectif :** Ce qu'on fait AVANT la prochaine occurrence pour la prévenir ou l'atténuer.
**Règles :**

* 2 à 4 phrases
* Toujours actionnable (pas juste "soyez patient")
* Couleur UI : fond `#FAEEDA`, texte `#854F0B`

\---

### Bloc 7 — Erreurs à éviter + Cadre de sécurité (rouge + gris)

**Erreurs à éviter :**

* 4 erreurs maximum, formulées positivement ("ne pas X" → "X sans Y")
* Jamais culpabilisant — factuel et bienveillant
* Couleur UI : fond `#FCEBEB`, texte `#A32D2D`, icône ✕

**Cadre de sécurité :**

* Toujours présent — même si le sujet semble bénin
* Mois 0 : toujours inclure au moins un numéro d'urgence (15, 3114, PMI)
* Formulation type : "Consulter si : \[symptômes précis] → \[action]"
* Couleur UI : fond `#F1EFE8`, texte `#444441`

**Numéros d'urgence à connaître (à citer selon contexte) :**

* `15` → SAMU (urgence médicale)
* `3114` → Numéro national de prévention du suicide (détresse parentale)
* `PMI` → Protection Maternelle et Infantile (soutien à domicile gratuit)
* `0800 900 900` → La Leche League (allaitement, gratuit)
* `SOLIPAM` → Réseau soutien familles isolées post-partum

\---

## Règles de différenciation entre situations

Chaque situation dans une même catégorie DOIT être différenciée. Jamais deux protocoles identiques dans la même catégorie.

**Critères de différenciation :**

* Intensité de la situation (légère / intense / très intense)
* Durée (depuis ce matin / depuis plusieurs jours / depuis des semaines)
* Contexte (à la maison / en public / en crèche)
* Premier épisode vs récidive
* Cause identifiable vs inconnue

**Exemple — catégorie Sommeil :**

* Sit 1 : Refuse de se coucher → rituel du soir, causes immédiates
* Sit 2 : Se réveille plusieurs fois → associations d'endormissement
* Sit 3 : Régression depuis 1 semaine → cap développemental
* Sit 4 : Résiste à la sieste → transition sieste unique

Ces 4 situations ont des protocoles DIFFÉRENTS même si la catégorie est la même.

\---

## Adaptations obligatoires par âge

### Mois 0 (nouveau-né)

* Pression réflexo : 0/10 systématiquement
* Toujours mentionner la PMI et la sage-femme de ville
* Toujours inclure les signes d'urgence (fièvre > 38°C avant 1 mois = urgence absolue)
* Jamais de méthode d'endormissement autonome avant 4 mois
* Rappeler que la tétée toutes les heures est normale
* Syndrome du bébé secoué à mentionner si contexte pleurs intenses

### Mois 5–12

* Introduire la diversification alimentaire si pertinent
* Mentionne la permanence de l'objet (acquise vers 8–10 mois)
* Angoisse de l'étranger normale à partir de 8 mois

### Mois 12–18

* Période d'opposition normale (non systématique)
* Angoisse de séparation à son pic
* Transition vers la sieste unique en cours
* Marche acquise ou en cours d'acquisition

### Mois 18–24

* Langage en explosion (ou pas — vaste variation normale)
* Autonomie croissante + dépendance paradoxale
* Crises émotionnelles liées à l'autonomie frustrée

\---

## Format JSON complet d'un protocole

```json
{
  "mois": 14,
  "module": "guide",
  "categorie": "colere",
  "situation": "Crise de colère intense depuis 20 min",
  "data": {
    "titre": "Crise de colère intense depuis 20 minutes",
    "explication": "...",
    "ancrage": "...",
    "action\_immediate": {
      "titre": "Action immédiate — rester présent sans intervenir",
      "couleur": "#FCEBEB",
      "couleur\_texte": "#A32D2D",
      "etapes": \["...", "...", "...", "...", "..."]
    },
    "action\_complementaire": {
      "titre": "Geste doux — réflexo plexus solaire (après la crise)",
      "couleur": "#E1F5EE",
      "couleur\_texte": "#085041",
      "etapes": \["...", "...", "...", "...", "..."]
    },
    "action\_parent": {
      "couleur": "#FBEAF0",
      "couleur\_texte": "#72243E",
      "etapes": \["...", "...", "...", "..."]
    },
    "preventif": "...",
    "erreurs": \["...", "...", "...", "..."],
    "cadre\_securite": "..."
  }
}
```

\---

## Checklist avant de valider un protocole

* \[ ] Les 7 blocs sont présents et dans l'ordre
* \[ ] La phrase d'ancrage s'adresse directement au parent
* \[ ] Le niveau de pression réflexo est adapté à l'âge
* \[ ] La situation est différenciée des 3 autres de la même catégorie
* \[ ] Le cadre de sécurité est présent et précis
* \[ ] Aucun terme médical n'est utilisé sans être expliqué
* \[ ] Le ton est bienveillant envers le parent ET envers le bébé
* \[ ] Les couleurs UI sont correctes (voir tableau ci-dessus)


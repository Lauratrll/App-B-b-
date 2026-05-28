# SKILL_protocole.md — Génération des 32 protocoles Guide-moi !

> Lire ce fichier AVANT de générer le `01_protocoles.json` d'un mois.
> Ce skill définit la structure, le ton et les règles non-négociables.
> Référence validée : Mois 14 — `01_protocoles.json`.

---

## 1. Principe directeur

Le module Guide-moi ! est **le cœur de l'application**. C'est lui que le parent ouvre en situation de crise. Sa qualité conditionne tout le projet.

**Une situation = un protocole différencié.** Jamais de protocole générique appliqué à plusieurs situations. Si un parent ouvre l'app pour "Mon enfant se cogne la tête pendant une crise", il doit trouver un protocole spécifique à cette situation — pas un protocole générique sur "les crises".

---

## 2. Structure obligatoire — 32 protocoles par mois

**8 catégories × 4 situations = 32 protocoles.**

Les 8 catégories varient selon l'âge du bébé. Voir `SKILL_rubriques.md` § 2 pour les adjectifs du mois et les enjeux développementaux.

### Catégories par tranche d'âge (à valider mois par mois)

**Mois 0 à 4** (nourrisson) :
- pleurs · alim · sommeil · corps · stimu · sepa · sante · parent

**Mois 5 à 11** (bébé qui s'éveille) :
- pleurs · alim · sommeil · motricite · stimu · sepa · dents · parent

**Mois 12 à 24** (enfant qui marche) :
- colere · sommeil · langage · alim · sepa · corpo · dents · stimu

**Règle :** chaque catégorie doit avoir un identifiant court et stable (`colere`, pas `coleres_et_frustration`), un nom long affiché dans l'UI, une icône emoji. **Pas de `sous_titre`** : le nom de catégorie se suffit à lui-même (ex. « Alimentation » seul, sans énumération type « sein, biberon, tétées » qui alourdit et fait redondance).

---

## 3. Structure d'un protocole — 9 champs obligatoires

Chaque protocole contient **exactement** ces 9 champs, dans cet ordre :

```json
{
  "categorie": "colere",
  "situation": "Crise de colère intense depuis 20 minutes",
  "titre": "Crise de colère intense qui dure",
  "explication": "...",
  "ancrage": "...",
  "action_immediate": {
    "couleur_fond": "#F4E2CE",
    "couleur_texte": "#8A4E1C",
    "titre": "Action immédiate",
    "etapes": ["...", "...", "...", "...", "..."]
  },
  "geste_doux": {
    "couleur_fond": "#DCE9CF",
    "couleur_texte": "#3F5C2E",
    "titre": "Geste doux — ...",
    "etapes": ["...", "...", "...", "...", "..."]
  },
  "pour_aller_plus_loin": ["...", "...", "...", "..."],
  "principe": "...",
  "erreurs_a_eviter": ["...", "...", "...", "..."],
  "consulter_si": "..."
}
```

### 3.1 `categorie` (string)
Identifiant technique court. Doit correspondre à un id dans `categories`.

### 3.2 `situation` (string)
La situation telle que le parent la verrait formulée. C'est le libellé du bouton dans l'app : "Bébé se jette par terre et se cogne la tête".

**Règles :**
- Formuler du point de vue de l'observation parentale, pas de la cause médicale
- Court, déclaratif (10-15 mots max)
- Pas de jargon
- ✅ "Refuse tout ce qu'il acceptait avant"
- ❌ "Néophobie alimentaire post-12 mois"

### 3.3 `titre` (string)
Le titre du protocole affiché en grand. Peut être plus synthétique que la situation.

### 3.4 `explication` (3-5 phrases — 60-100 mots)
**Objectif :** expliquer ce qui se passe POUR l'enfant, pas POUR le parent.

**Règles :**
- Expliquer le mécanisme neurologique ou développemental à l'œuvre
- Jamais de jargon médical non expliqué
- Bienveillant envers l'enfant ("il ne fait pas exprès", "c'est neurologique")
- Pas de formulation culpabilisante envers le parent
- Si pertinent, citer une référence implicite : "neurosciences montrent que...", "à cet âge..."

**Formulations interdites :**
- "votre enfant" → préférer "ton enfant" ou "bébé" ou "lui/elle"
- "il faut" → préférer "tu peux", "une option est de"
- "c'est normal mais" → "c'est normal" (sans le "mais")
- Tout ce qui commence par "Malheureusement"

### 3.5 `ancrage` (1-2 phrases — 20-40 mots)
**Objectif :** réguler le parent AVANT qu'il agisse.

**Règles :**
- Adressé directement au parent (tu/toi)
- Reformule ce qui se passe en lui donnant un rôle clair et possible
- Jamais de "tu dois" — toujours "tu peux" ou "ton rôle est"
- Maximum 2 phrases

**Exemples validés :**
- "Tu n'as pas à calmer la crise. Tu as à rester présent(e) pendant qu'elle passe. C'est différent — et c'est suffisant."
- "Sa frustration est un signe que son intelligence dépasse ses outils d'expression. C'est rassurant — pas inquiétant."
- "Il ne cherche pas à se faire mal. Il cherche à se sentir. Ton rôle : protéger sans dramatiser."

### 3.6 `action_immediate` (objet)
**Objectif :** quoi faire MAINTENANT, dans la minute.

**Structure :**
```json
{
  "couleur_fond": "#F4E2CE",
  "couleur_texte": "#8A4E1C",
  "titre": "Action immédiate",
  "etapes": [
    "Étape 1 — verbe d'action, court",
    "...",
    "..."
  ]
}
```

**Règles :**
- **5 étapes maximum** — pas plus
- Chaque étape : 1 phrase de 15-25 mots max
- Verbe d'action en début d'étape ("S'accroupir...", "Ne pas argumenter...", "Voix très basse : '...'")
- Couleurs fixes (rouge clair / rouge foncé) — code de l'urgence

### 3.7 `geste_doux` (objet)
**Objectif :** l'élément réflexologique ou de régulation douce, après l'action immédiate.

**Structure :**
```json
{
  "couleur_fond": "#DCE9CF",
  "couleur_texte": "#3F5C2E",
  "titre": "Geste doux — après la crise uniquement",
  "etapes": [
    "Étape réflexo ou de contact doux",
    "...",
    "..."
  ]
}
```

**Règles :**
- **5 étapes maximum**
- Titre toujours préfixé "Geste doux —" suivi d'une précision sur le moment ("après la crise uniquement", "input proprioceptif", "stimulation du langage"...)
- Inclure si pertinent une zone réflexo et sa durée (ex : "Réflexo plexus solaire : centre de la voûte, cercles doux, 1 min")
- Pression toujours rappelée : "pression 0/10"
- Couleurs fixes (vert clair / vert foncé)

### 3.8 `pour_aller_plus_loin` (liste — exactement 4 points)
**Objectif :** ce que le parent peut faire à plus long terme.

**Règles :**
- **Exactement 4 points** — c'est un standard visuel dans l'app
- **Format imposé « Amorce : suite »** : chaque point commence par une amorce courte de 2-4 mots, suivie de « : », puis du développement. L'amorce est mise en gras à l'affichage (lecture rapide). Ex : « Tenir un journal : noter les déclencheurs sur une semaine. »
- Amorce = un groupe nominal ou verbal court (pas une phrase complète) ; pas de « : » ailleurs dans le point
- Chaque point : 1-2 phrases max après l'amorce
- Ton de l'invitation, pas de l'injonction
- Inclure si pertinent une référence pratique (consultant, professionnel) — mais avec mesure
- Bannir « votre/vos » (formulation interdite) — préférer « ton/tes » ou une tournure neutre

### 3.9 `principe` (1-2 phrases — 30-50 mots)
**Objectif :** la règle de fond. Ce que le parent doit retenir au-delà du protocole.

**Exemples validés :**
- "La régularité est plus puissante que le contenu du rituel. Même rituel à ± 15 min chaque soir."
- "Plus tu offres d'inputs sensoriels adaptés dans la journée, moins le besoin de se cogner sera intense en crise."

### 3.10 `erreurs_a_eviter` (liste — exactement 4 erreurs)
**Objectif :** les pièges fréquents — informatif, pas culpabilisant.

**Règles :**
- **Exactement 4 erreurs** — c'est un standard visuel
- Formuler comme un constat factuel suivi de sa conséquence neurologique/développementale
- ✅ "Reculer l'heure du coucher espérant qu'il soit plus fatigué — crée la sur-fatigue qui empêche le sommeil"
- ❌ "Ne reculez pas l'heure du coucher !" (injonction)
- Jamais de "vous faites ça parce que..." — pas d'interprétation psychologisante

### 3.11 `consulter_si` (string — 2-4 lignes)
**Objectif :** le cadre de sécurité médical. Critères objectifs uniquement.

**Règles :**
- Toujours formulé ainsi : "Consulter si : [symptôme observable] → [action]"
- Jamais "si tu t'inquiètes" (subjectif)
- Toujours avec un critère mesurable : durée, fréquence, intensité, signe physique
- Inclure les numéros d'urgence quand pertinent : 15 (SAMU), 3114 (prévention suicide)
- Inclure la suggestion d'un professionnel spécialisé si pertinent (psychomotricien, orthophoniste, ergothérapeute)

---

## 4. Différenciation des 4 situations par catégorie

C'est **le point critique** du module. Les 4 situations d'une même catégorie doivent avoir des protocoles **vraiment différents** — pas une variation cosmétique.

### Test de différenciation
Pour chaque catégorie, les 4 protocoles doivent répondre à **4 questions distinctes** :

**Exemple — catégorie "colere" (Mois 14) :**
1. Crise qui dure → comment tenir la durée
2. Auto-stimulation (se cogne) → comment rediriger sensoriellement
3. "Non !" systématique → comment offrir des choix
4. Première morsure → comment poser la limite

**Exemple — catégorie "sommeil" (Mois 14) :**
1. Refus du coucher → rituel et fenêtre d'éveil
2. Réveils multiples → association d'endormissement
3. Régression de 14 mois → tenir le cadre pendant la phase
4. Refus de sieste sur fatigue → transition vers une sieste unique

**Règle :** si deux protocoles d'une même catégorie ont 80% d'action_immediate et de geste_doux identiques, les fusionner ou redéfinir la situation.

---

## 5. Volume cible par protocole

Un protocole bien calibré pèse **2,5 à 3,5 Ko** en JSON. Pour 32 protocoles, le fichier final pèse 100-120 Ko.

| Champ | Volume cible |
|-------|--------------|
| explication | 60-100 mots |
| ancrage | 20-40 mots |
| action_immediate.etapes | 5 × 15-25 mots = 75-125 mots |
| geste_doux.etapes | 5 × 15-25 mots = 75-125 mots |
| pour_aller_plus_loin | 4 × 15-25 mots = 60-100 mots |
| principe | 30-50 mots |
| erreurs_a_eviter | 4 × 15-25 mots = 60-100 mots |
| consulter_si | 30-60 mots |

**Total par protocole : 400-700 mots.**

Si un protocole dépasse 800 mots, il est probablement trop dense — couper.
Si un protocole fait moins de 350 mots, il est probablement trop sec — étoffer.

---

## 6. Références pratiques par âge

### Mois 0 à 6
- Pédiatre et sage-femme = premières lignes
- PMI = consultation gratuite, idéale pour les questions du quotidien
- SOLIPAM (réseau de soutien périnatal)
- Allo Parents Bébé : 0 800 00 34 56
- Pour les pleurs prolongés inexpliqués : enquête sur le reflux, les coliques, le frein de langue

### Mois 6 à 12
- Diversification alimentaire — diététicienne pédiatrique si difficulté
- Bilan auditif systématique si pas de réaction au prénom à 12 mois
- Kiné spécialisée pédiatrique pour les questions de motricité

### Mois 12 à 24
- Orthophoniste si pas de mot à 18 mois (bilan, pas urgence)
- Psychomotricien pour les questions sensorielles, motrices, ou de régulation
- Ergothérapeute spécialisé intégration sensorielle
- Pédopsychiatre ou psychologue de la petite enfance pour les questions de comportement persistantes

### Transverses (tous mois)
- 15 = SAMU, urgences vitales
- 3114 = prévention suicide (parents)
- MonParcoursPsy = 8 séances/an remboursées
- Maman Blues = association soutien dépression post-partum

---

## 7. Précautions absolues — JAMAIS dans un protocole

- **Pas d'huiles essentielles** avant 3 ans (même diffusion, sauf eau florale de camomille en spray d'ambiance occasionnel)
- **Pas de paracétamol** sans dose pédiatrique vérifiée par un médecin
- **Pas de gel anesthésiant à la lidocaïne** avant 2 ans (poussées dentaires)
- **Pas de collier d'ambre** (risque étouffement + inefficacité prouvée)
- **Pas de sirop antitussif** avant 2 ans (la plupart sont contre-indiqués)
- **Pas de miel** avant 1 an (botulisme infantile)
- **Pas d'eau** pour les bébés < 6 mois (risque hyponatrémie)

---

## 8. Checklist avant validation d'un protocole

- [ ] Les 9 champs obligatoires sont présents
- [ ] L'explication est 3-5 phrases, bienveillante envers l'enfant
- [ ] L'ancrage est 1-2 phrases adressées au parent
- [ ] Action immédiate = exactement 5 étapes max
- [ ] Geste doux = exactement 5 étapes max, avec zone réflexo si pertinent
- [ ] Pour aller plus loin = exactement 4 points
- [ ] Principe = 1-2 phrases de fond
- [ ] Erreurs à éviter = exactement 4 erreurs, formulées comme constats
- [ ] Consulter_si = critères objectifs uniquement
- [ ] Aucune formulation interdite (votre enfant, il faut, malheureusement)
- [ ] Aucune précaution interdite (huiles essentielles, lidocaïne, miel...)
- [ ] Le protocole est VRAIMENT différent des 3 autres protocoles de sa catégorie
- [ ] Le volume est entre 400 et 700 mots

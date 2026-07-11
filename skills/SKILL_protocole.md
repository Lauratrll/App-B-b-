# SKILL_protocole.md — Génération des 32 protocoles Guide-moi !

> Lire ce fichier AVANT de générer le `01_protocoles.json` d'un mois.
> Ce skill définit la structure, le ton et les règles non-négociables.
> Référence validée : Mois 14 — `01_protocoles.json`.

---

## 1. Principe directeur

Le module Guide-moi ! est **le cœur de l'application**. C'est lui que le parent ouvre en situation de crise. Sa qualité conditionne tout le projet.

**Une situation = un protocole différencié.** Jamais de protocole générique appliqué à plusieurs situations. Si un parent ouvre l'app pour "Mon enfant se cogne la tête pendant une crise", il doit trouver un protocole spécifique à cette situation — pas un protocole générique sur "les crises".

### Principes transverses — VALABLES POUR TOUS LES MOIS

Ces cinq principes s'appliquent à **chaque** protocole, sans exception :

1. **Bienveillance systématique.** Le ton est chaleureux, jamais culpabilisant. On déculpabilise le parent et on présente l'enfant avec bienveillance ("il ne fait pas exprès", "c'est neurologique"). On valide l'émotion du parent avant de proposer une action.

2. **Chaque enfant évolue à son rythme.** Dès que le protocole touche un jalon développemental (sourire, sommeil, motricité, langage, alimentation, propreté…), rappeler explicitement, au moins une fois dans le protocole (souvent dans l'explication, l'ancrage ou le principe), que les fourchettes sont larges et que chaque enfant a son propre rythme. Bannir toute comparaison normative anxiogène. Formulations types : "la fourchette est large et normale", "chaque enfant a son propre rythme", "ce n'est ni une course ni une compétition".

3. **Ne jamais se substituer à un professionnel.** L'app est un soutien, pas un avis médical. Le `consulter_si` n'est pas une formalité : il oriente clairement vers le bon professionnel (pédiatre, sage-femme, PMI, IBCLC, kiné, psychologue périnatal…) avec des critères objectifs. Aucun protocole ne doit laisser entendre qu'il remplace un diagnostic, un examen ou un traitement. En cas de doute, le réflexe affiché est toujours "consulter", jamais "gérer seul". Mention récurrente possible : "ce protocole ne remplace pas l'avis de ton pédiatre / d'un professionnel".

4. **Les redites entre les mois sont acceptables.** Certains sujets durent dans le temps (sommeil, coliques, sur-stimulation, charge parentale, séparation, alimentation…) et un parent donné peut rencontrer un même problème à des mois différents. Il est donc normal et utile qu'un thème réapparaisse d'un mois à l'autre. La règle n'est pas d'éviter toute répétition, mais de **ne jamais copier-coller** : à chaque mois, le protocole est réécrit en tenant compte de l'évolution de l'enfant (nouvelles capacités, nouveaux enjeux développementaux, fenêtre d'âge différente). Le fond peut se recouper, la formulation et les détails développementaux doivent être propres au mois. Mieux vaut un bon protocole récurrent et actualisé qu'une situation artificielle inventée pour fuir la répétition.

5. **Valider l'émotion de l'enfant avant de résoudre.** Chaque fois que l'enfant est traversé par une émotion (peur, colère, frustration, chagrin, envie contrariée), le protocole commence par **nommer et reformuler ce qu'il ressent pour le valider**, AVANT de proposer une solution ou de poser le cadre. Mettre des mots sur l'émotion (« je vois que tu es en colère », « tu avais très envie de rester debout », « le noir te fait peur, je te crois ») apaise le cerveau émotionnel et rend l'enfant à nouveau disponible. On valide toujours l'émotion — jamais le comportement problématique ni la demande déclenchante. Séquence type : **accueillir → nommer/reformuler → puis accompagner ou cadrer**. Deux exceptions où l'enfant n'est pas joignable par la parole : les tout premiers mois (le nourrisson ne comprend pas les mots, mais le ton et le contact valident déjà), et les états d'éveil partiel comme les terreurs nocturnes (on protège et on attend, on ne cherche pas à raisonner).

---

### Conventions typographiques — VALABLES POUR TOUS LES MOIS

Constance typographique obligatoire dans **tous** les champs (situation, titre, explication, ancrage, étapes, principe…) :

- **Guillemets français « » uniquement**, jamais de guillemets droits `"`. Une citation courte de la voix du parent ou de l'enfant se met entre « » (pas de guillemets droits, y compris imbriqués).
- **Espaces insécables (U+00A0) obligatoires** : avant `:`, `;`, `!`, `?`, avant `»` et après `«`.
- **« Réflexologie » toujours écrit en toutes lettres** — jamais l'abréviation « réflexo ».
- **Genre de l'enfant — masculin par défaut, PAS de personnalisation.** Dans les protocoles, on n'emploie **jamais** de forme dédoublée pour l'enfant (pas de `[acteur/actrice]`, pas de `[aimé/aimée]`, pas de `[grand/grande]`). On garde le **masculin par défaut** pour enfant/bébé (« il »). Raison : dédoubler un adjectif obligerait à dédoubler aussi tous les « il/elle », et le texte devient illisible. La **voix du parent** garde en revanche ses formes inclusives (« présent.e », « débordé.e »).

> ⚠️ **La référence M14 est antérieure à ces règles.** Elle contient encore des guillemets droits, aucune espace insécable, l'abréviation « réflexo » et le mot « massage ». M14 fait foi pour la **structure** des 9 champs, **pas** pour la typographie ni pour le vocabulaire réflexologie : suivre les règles ci-dessus et le § 3.7, pas la lettre de M14.

---

## 2. Structure obligatoire — 32 protocoles par mois

### Nommage des fichiers de contenu

Les fichiers de protocoles produits par catégorie suivent **toujours** la convention **`M{n}_guide_moi_{categorie}`** (ex. `M23_guide_moi_sommeil`, `M23_guide_moi_colere`), où `{n}` est le numéro de mois (M0 à M23) et `{categorie}` l'identifiant court de la catégorie. Cette structure est à conserver pour la cohérence de tous les contenus.

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

Chaque protocole contient **exactement** ces 9 champs obligatoires, dans cet ordre (+ un 10ᵉ champ **optionnel** `source`, cf. § 3.12, ajouté uniquement sur un sujet sensible) :

```json
{
  "categorie": "colere",
  "situation": "Crise de colère intense depuis 20 minutes",
  "titre": "Crise de colère intense qui dure",
  "explication": "...",
  "ancrage": "...",
  "action_immediate": {
    "couleur_fond": "#FCEBEB",
    "couleur_texte": "#A32D2D",
    "titre": "Action immédiate",
    "etapes": ["...", "...", "...", "...", "..."]
  },
  "geste_doux": {
    "couleur_fond": "#E1F5EE",
    "couleur_texte": "#085041",
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

**Construction en deux parties OBLIGATOIRE**, séparées par « / » (espace, slash, espace) :

**« [Thème / famille] / [précision de la situation] »**

- La **première partie** situe le thème récurrent : l'objet, la grande question ou la famille de situations (« Le grand lit », « Les réveils nocturnes », « La peur du noir »…).
- La **seconde partie** précise la situation concrète du protocole (« préparer la transition », « se lève sans cesse », « vient dans le lit des parents »…).
- Une même première partie peut être partagée par plusieurs situations d'un même sous-thème (ex. les deux « Le grand lit / … »), ce qui les regroupe visuellement.

**Exemples validés :**
- « Le grand lit / préparer la transition »
- « Le grand lit / se lève sans cesse »
- « Les réveils nocturnes / vient dans le lit des parents »
- « Les terreurs nocturnes / le réveil qui n'en est pas un »
- « La peur du noir / besoin de présence au coucher »

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
  "couleur_fond": "#FCEBEB",
  "couleur_texte": "#A32D2D",
  "titre": "Action immédiate — [complément]",
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
- **Format « Amorce : suite » imposé** : chaque étape commence par une amorce courte (2-4 mots ou un verbe d'action), suivie de « : » (ou « — »), puis du détail. L'amorce est mise en gras à l'affichage. Ex : « S'accroupir : se mettre à sa hauteur, sans le toucher tout de suite. »
- Le `titre` inclut un complément après un tiret (ex. « Action immédiate — désamorcer le moment du repas »)
- Couleurs fixes (codes verrouillés) : fond `#FCEBEB`, texte `#A32D2D`
- **Exception catégorie `parent`** : pour les protocoles de la catégorie `parent`, l'action immédiate utilise fond `#FBEAF0`, texte `#72243E`

### 3.7 `geste_doux` (objet)
**Objectif :** l'élément réflexologique ou de régulation douce, après l'action immédiate.

**Structure :**
```json
{
  "couleur_fond": "#E1F5EE",
  "couleur_texte": "#085041",
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
- **Format « Amorce : suite » imposé** : chaque étape commence par une amorce courte suivie de « : » (ou « — »), puis du détail. L'amorce est mise en gras à l'affichage. Ex : « Zone du plexus solaire : centre de la voûte plantaire, cercles lents, 1 min par pied. »
- **Titre — le mot « Réflexologie » doit apparaître quand le geste en relève.** Quand le geste doux repose sur la réflexologie (le cas le plus fréquent), le titre commence par « Réflexologie » pour que le parent comprenne immédiatement de quoi il s'agit. **Format : « Réflexologie : [précision courte] »** (ex. « Réflexologie : apaisement et sécurité », « Réflexologie : préparer une transition »). Uniquement pour un geste **non** réflexologique (contact, pression proprioceptive, portage), garder le préfixe « Geste doux — [précision] ».
- Inclure si pertinent une zone réflexe et sa durée
- **Réflexologie — vocabulaire imposé (RÈGLE MISE À JOUR) :**
  - **Jamais de pression chiffrée.** Ne plus écrire « pression 0/10 » ni aucune échelle numérique. Décrire la pression de façon qualitative : « pression douce et constante », « toucher doux et enveloppant », « appui léger et maintenu ».
  - **Ne jamais écrire « massage » — ni pour l'affirmer, ni pour le nier.** La formule « ce n'est pas un massage » est **supprimée** : elle est fausse (c'en est un) et sa négation attire l'attention sur le terme légalement réservé. On n'emploie tout simplement pas le mot.
  - **Ne jamais employer « caresse ».** Une caresse chatouille et peut être désagréable — ce n'est pas la sensation recherchée. Vocabulaire autorisé : « toucher », « pression douce », « geste doux », « stimulation des zones réflexes », « geste de balayage ».
- Couleurs fixes : fond `#E1F5EE`, texte `#085041` (vert sauge — codes verrouillés, cf. M14 réel)

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

### 3.12 `source` (string — optionnel, conditionnel)

Champ **facultatif**, ajouté **uniquement quand c'est nécessaire**, pour rendre une affirmation défendable.

**Quand l'ajouter :**
- Seulement si le protocole avance une affirmation qui touche un **sujet sensible** (nutrition, santé, corps, motricité/kiné, sommeil médicalisé…).
- **Jamais** sur les sujets libres (posture parentale, comportement, émotions, jeu…) : pas de champ `source` du tout.

**Règles (voir `SKILL_contenu.md` § Sourcing des affirmations sensibles pour le détail) :**
- Sources **obligatoirement françaises** : HAS, Santé publique France / PNNS, sociétés savantes, pédiatres (AFPA / mpedia.fr), CERIN… **Aucune source étrangère** sur un sujet sensible (défendabilité en droit français).
- **Réellement vérifiées et correctement attribuées** : on cite l'auteur/l'organisme, on ne s'approprie pas la méthode d'un professionnel, on n'invente jamais une référence.
- **Une seule ligne discrète**, affichée en petit en bas de la fiche. Format : chaîne unique commençant par « Source : … ».
- Ex. : « Source : ne pas forcer, respecter l'appétit de l'enfant — repères pédiatriques mpedia.fr (AFPA) ; courbe de croissance : HAS. »

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
- [ ] Geste doux = exactement 5 étapes max, avec zone réflexe si pertinent
- [ ] Geste doux : AUCUNE pression chiffrée, AUCUN emploi de « massage » (ni affirmé ni nié), AUCUN « caresse »
- [ ] Typographie : guillemets « » + espaces insécables (avant : ; ! ? et autour des guillemets), « Réflexologie » en toutes lettres
- [ ] Titre du geste doux réflexologique au format « Réflexologie : … » (le mot apparaît clairement)
- [ ] Aucune personnalisation de genre de l'enfant (pas de [x/y]) — masculin par défaut ; formes inclusives réservées à la voix du parent
- [ ] Émotion de l'enfant validée/reformulée avant la résolution (sauf nourrisson pré-verbal et éveil partiel type terreur nocturne)
- [ ] Titre construit en deux parties « Thème / précision de la situation » (séparateur « / »)
- [ ] `source` (si sujet sensible uniquement) : source française vérifiée et attribuée, une ligne discrète ; aucune source sur les sujets libres
- [ ] Pour aller plus loin = exactement 4 points
- [ ] Principe = 1-2 phrases de fond
- [ ] Erreurs à éviter = exactement 4 erreurs, formulées comme constats
- [ ] Consulter_si = critères objectifs uniquement
- [ ] Aucune formulation interdite (votre enfant, il faut, malheureusement)
- [ ] Aucune précaution interdite (huiles essentielles, lidocaïne, miel...)
- [ ] Le protocole est VRAIMENT différent des 3 autres protocoles de sa catégorie
- [ ] Le volume est entre 400 et 700 mots

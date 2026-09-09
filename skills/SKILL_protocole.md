# SKILL_protocole.md — Génération des protocoles Guide-moi !

> Lire ce fichier AVANT de générer les fichiers protocoles d'un mois.
> Ce skill définit la structure, le ton et les règles non-négociables.
> **Référence validée : Mois 0 — les 7 fichiers `M0_guide_moi_N{slot}_{categorie}.json`.**
> M14 reste une référence historique de structure ; sa typographie et son vocabulaire
> sont périmés (voir § 3.7).

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

- **Tiret cadratin `—` interdit dans les contenus.** Aucun tiret long dans un champ destiné au parent. Remplacer par deux-points, virgules, parenthèses pour un aparté secondaire, ou réécrire la phrase. Varier les solutions : enchaîner les deux-points crée une autre signature mécanique. Voir `SKILL_contenu.md` § « Le tiret cadratin est interdit ». Le demi-cadratin `–` reste réservé aux fourchettes chiffrées (3–4 mois, 17h–19h), jamais en incise.
- **Guillemets français « » uniquement**, jamais de guillemets droits `"`. Une citation courte de la voix du parent ou de l'enfant se met entre « » (pas de guillemets droits, y compris imbriqués).
- **Espaces insécables (U+00A0) obligatoires** : avant `:`, `;`, `!`, `?`, avant `»` et après `«`.
- **« Réflexologie » toujours écrit en toutes lettres** — jamais l'abréviation « réflexo ».
- **Genre de l'enfant — masculin par défaut, PAS de personnalisation.** Dans les protocoles, on n'emploie **jamais** de forme dédoublée pour l'enfant (pas de `[acteur/actrice]`, pas de `[aimé/aimée]`, pas de `[grand/grande]`). On garde le **masculin par défaut** pour enfant/bébé (« il »). Raison : dédoubler un adjectif obligerait à dédoubler aussi tous les « il/elle », et le texte devient illisible. La **voix du parent** garde en revanche ses formes inclusives (« présent.e », « débordé.e »).

> ⚠️ **La référence M14 est antérieure à ces règles.** Elle contient encore des guillemets droits, aucune espace insécable, l'abréviation « réflexo » et le mot « massage ». M14 fait foi pour la **structure** des 9 champs, **pas** pour la typographie ni pour le vocabulaire réflexologie : suivre les règles ci-dessus et le § 3.7, pas la lettre de M14.

---

## 2. Structure obligatoire — un fichier par catégorie

### Nommage des fichiers de contenu

Convention **obligatoire** : **`M{n}_guide_moi_N{slot}_{categorie}.json`**
(ex. `M0_guide_moi_N2_alimentation.json`, `M23_guide_moi_N4_langage.json`), où :
- `{n}` = numéro de mois (M0 à M23),
- `{slot}` = **numéro d'ordre de la catégorie** dans l'architecture de la tranche d'âge (tableau ci-dessous) — il ne change jamais à l'intérieur d'une tranche,
- `{categorie}` = identifiant court de la catégorie.

**Un mois = N fichiers, un par catégorie.** Plus de fichier unique agrégé.

### ⚠️ Le nombre de situations n'est PAS de 4 partout

Le **tableau de pilotage des protocoles** (catégories × situations × angle éditorial × statut) est la
**source de vérité** de chaque mois. Il fixe :
- le nombre de catégories du mois,
- le **nombre de situations par catégorie** (variable : 4, 5 ou 6),
- le **libellé exact** de chaque situation,
- l'**angle éditorial** imposé à chaque protocole.

Ne jamais inventer une situation qui n'y figure pas ; ne jamais en supprimer une sans arbitrage.

**Exemple — M0 : 7 catégories, 33 situations**
pleurs (6) · alim (5) · digestion (4) · sommeil (4) · corps (6) · sepa (4) · parent (4)

### Catégories par tranche d'âge

| Slot | M0–M5 (7 cases) | M6–M11 (8 cases) | M12–M17 (8 cases) | M18–M23 (8 cases) |
|------|-----------------|------------------|-------------------|-------------------|
| 1 | Pleurs & sur-stimulation | Pleurs & frustration | Colère & émotions | Colère & débordement |
| 2 | Alimentation | Alimentation & digestion | Alimentation | Alimentation |
| 3 | Ventre & digestion | Sommeil | Sommeil | Sommeil |
| 4 | Sommeil | Motricité & exploration | Motricité & exploration | Motricité & exploration |
| 5 | Corps & soins | Dents & petits inconforts | Dents & petits inconforts | Dents & petits inconforts |
| 6 | Lien & attachement | Sur-stimulation | Sur-stimulation | Propreté & autonomie |
| 7 | Parents submergés | Angoisse de séparation | Séparation & socialisation | Séparation & socialisation |
| 8 | — | Parents submergés | Parents submergés | Parents submergés |

> ⚠️ **L'onglet « Santé » est SUPPRIMÉ sur toute l'app** (coupe franche).
> **Sujets interdits, sans protocole :** fièvre · bronchiolite · gastro · vomissements ·
> déshydratation · otite · convulsion · vaccins · roséole · pied-main-bouche · muguet ·
> reflux nommé comme pathologie · torticolis · plagiocéphalie · chocs à la tête ·
> traumatisme dentaire.
> **Autorisés** (hygiène et confort) : cordon · peau · croûtes · siège · lavage de nez · ongles ·
> bain · bave · poussées dentaires · brossage · transit · portage.
> Ces sujets interdits restent légitimes **dans le `consulter_si`**, comme critères d'orientation.

> ⚠ **Corrigé le 2 septembre 2026.** La catégorie « Corps, dents & confort » de M12-M23 a été
> **supprimée le 28/08** : le corps se lit désormais en trois thèmes, Corps & soins (M0-M5) puis
> Motricité & exploration et Dents & petits inconforts (M6-M23). Le tableau ci-dessus est corrigé
> en conséquence, et les colonnes M12-M17 / M18-M23 se lisent avec Langage en 6, Sur-stimulation
> ou Propreté en 7, Séparation en 8 et **Parents submergés hors du dégradé**, avec sa couleur propre.

**Fusions actées :** Sur-stimulation → Pleurs (M0–M5) · Sur-stimulation → Colère & débordement
(M18–M23) · Ventre & digestion → Alimentation (dès M6) · Corps + Petits inconforts (M0–M5).

**Règle :** chaque catégorie a un identifiant court et stable (`digestion`, pas `ventre_et_digestion`), un nom long affiché dans l'UI, un `sous_titre` court (3-6 mots, affiché en Page 2) et une `icone` emoji de repli — la Page 1 et la Page 2 utilisant des pictos SVG, cet emoji ne sert que de valeur par défaut.

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
    "titre": "Geste doux : ...",
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

### 3.2 `situation` (string) — libellé du bouton, Page 2

**Le libellé EXACT du tableau de pilotage**, repris tel quel. Il est **construit en deux parties
séparées par « / »** (espace, slash, espace) — la Page 2 l'affiche sur deux lignes (L1 en capitales,
L2 en italique, slash en noir).

**Règles :**
- Reprendre le libellé du tableau — ne jamais le reformuler
- Formuler du point de vue de l'observation parentale, pas de la cause médicale
- Court, déclaratif (10-15 mots max), pas de jargon
- ✅ « Se réveille dès qu'on le pose / le réflexe de Moro »
- ✅ « Refus du biberon / préparer une introduction réussie »
- ❌ « Néophobie alimentaire post-12 mois »

> ⚠ **Corrigé le 2 septembre 2026.** `situation` **s'affiche bien en page 3**, en sous-titre
> au-dessus du `titre`. La règle inverse écrite ici datait d'avant la bascule du 26/08.

> ⚠️ **Les fichiers M23 utilisent la convention inverse** (`situation` en phrase parent sans slash,
> `titre` avec slash). Ils sont **hors norme** et font l'objet d'une passe d'alignement.
> La règle en vigueur est celle décrite ici.

### 3.3 `titre` (string) — titre de l'écran, Page 3

> ⚠ **Réécrit le 2 septembre 2026.** Cette section imposait un `titre` « en deux parties séparées
> par / ». C'était l'ancienne convention, abandonnée à la bascule du 26/08/2026 : la partie 1 du
> titre répétait mot pour mot la partie 1 de la situation, et le parent lisait deux fois la même
> chose. `SKILL_contenu.md` § « Le champ affiché sur le bouton est `situation` » fait foi.

**Le `titre` porte le principe d'action du protocole**, en une phrase courte. C'est ce que le
protocole propose de faire, ramené à son principe.

| Champ | Où il s'affiche | Ce qu'il porte |
|---|---|---|
| **`situation`** | page 2, sur le bouton de la carte, **et en sous-titre au-dessus du titre en page 3** | le libellé en deux parties séparées par « / » |
| **`titre`** | page 3, en titre du protocole | **le principe d'action**, en une phrase brève |

**Règles :**
- **Pas de séparateur « / »**, pas deux parties : une seule phrase.
- **48 caractères maximum**, initiale majuscule, pas de point final.
- **Pas d'impératif** : on énonce le principe, on ne donne pas l'ordre.
- **Explicite par rapport au contenu** : le titre doit dire ce que ce protocole-là apporte, et
  répondre à la scène annoncée par `situation`. Si ce n'est pas le cas, c'est le `titre` qu'on
  réaligne : le libellé, lui, est arrêté.

**Exemples réels du corpus :**
- « Sortir avant le débordement »
- « Donner du sol dans la journée »
- « Rendre la charge visible avant de la répartir »
- « Une émotion n'est pas une évaluation »

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
  "titre": "Action immédiate : [complément]",
  "etapes": [
    "Étape 1 — verbe d'action, court",
    "...",
    "..."
  ]
}
```

**Règles :**
- **5 étapes**, 6 au maximum si une idée mérite sa ligne (voir « Un point de plus, quand une idée le mérite »)
- Chaque étape : 1 phrase de 15-25 mots max
- **Format « Amorce : suite » imposé** : chaque étape commence par une amorce courte (2-4 mots ou un verbe d'action), suivie de « : », puis du détail. L'amorce est mise en gras à l'affichage. Ex : « S'accroupir : se mettre à sa hauteur, sans le toucher tout de suite. »
- Le `titre` inclut un complément après un deux-points (ex. « Action immédiate : désamorcer le moment du repas »)
- Couleurs fixes (codes verrouillés) : fond `#FCEBEB`, texte `#A32D2D`
- **Exception catégorie `parent`** : pour les protocoles de la catégorie `parent`, l'action immédiate utilise fond `#FBEAF0`, texte `#72243E`

### 3.6ter Le lait infantile ⭐

Le lait est le seul aliment du nourrisson, et c'est le sujet sur lequel l'entourage et les forums donnent le plus de conseils. La ligne éditoriale de l'app est stricte et **ne varie jamais** :

1. **On n'incite jamais à changer de lait.** Le changement n'apparaît nulle part comme une piste, une option ou une solution. Il n'existe dans les contenus que sous deux formes : une interdiction (« ne se change pas de sa propre initiative ») ou une erreur à éviter.
2. **On propose d'abord les réglages à la portée du parent**, et le premier de tous est la **température**. À température du corps, le lait est **plus digeste** pour un système digestif encore immature : c'est la base, et c'est le réglage le plus simple à essayer. Deux précisions obligatoires à chaque fois :
   - **réchauffage au bain-marie** ;
   - **le micro-ondes est fortement déconseillé**, il chauffe de façon inégale et peut brûler.

   **Le geste de mélange compte aussi.** On **roule le biberon entre les paumes**, à l'horizontale, plutôt que de l'agiter de haut en bas : la poudre se dissout aussi bien et il se forme beaucoup moins de bulles. Un lait plein de mousse fait avaler de l'air, et cet air se paie en inconfort digestif. Si de la mousse s'est formée, on la laisse retomber avant de donner : **aucun repère de temps ne se donne ici**, cela relève du bon sens de l'observation, et un chiffre inventé n'apporterait rien. **Ne jamais écrire « secouer »** dans un protocole de préparation.

   **L'inclinaison du biberon reste un détail, et s'écrit comme tel.** ⭐ Une **légère inclinaison**, biberon presque à l'horizontale, bébé redressé : cela suffit, et cela se dit en une incise, jamais en développement. On **n'écrit pas qu'il faut remplir la tétine de lait**, ce qui reviendrait à trop incliner. C'est un réglage qui peaufine, pas un geste qui décide du confort digestif : lui donner plus de place que cela déséquilibre la fiche et inquiète un parent pour rien.

   On explique le bénéfice (la digestion), on ne diabolise pas le froid : pas de « jamais froid », pas de formulation qui transforme un réglage de confort en faute. Viennent ensuite le dosage (une mesure rase pour 30 ml, jamais plus de poudre), le choix de l'eau, la position et le rythme de la prise.

   **L'eau du biberon, telle qu'on l'écrit.** L'eau du robinet **convient**, et on le dit dans cet ordre-là : d'abord qu'elle convient, ensuite les précautions. Eau froide, laissée couler quelques secondes, ni adoucie ni filtrée en carafe. Une eau embouteillée portant la mention *convenant à l'alimentation des nourrissons* est une alternative, pas la norme. **Le repère du plomb se dit aussi** : dans un immeuble d'avant 1948, les canalisations peuvent en contenir, et la mairie renseigne en un appel. C'est une information utile et vérifiable en cinq minutes, elle se donne sans dramatiser et sans sous-entendre que le parent aurait dû le savoir. Ces gestes-là s'essaient avant toute idée de changer quoi que ce soit.
3. **Un changement se valide avec le médecin**, à l'aller comme au retour. Revenir au lait précédent est un changement de plus, il se décide de la même façon.
4. **Le temps d'adaptation est un message obligatoire.** Après un changement, l'estomac d'un nourrisson met **une à deux semaines**, parfois davantage, à se réhabituer : le transit se dérègle avant de se remettre en place. Chaque protocole qui touche à un changement de lait doit le dire, sinon le parent rechange au bout de trois jours et prolonge l'inconfort.

**Test avant de valider un protocole qui parle de lait** : un parent inquiet pourrait-il en repartir avec l'idée d'essayer un autre lait ? Si oui, le texte est à reprendre.

---

### 3.6bis La règle de temps avant d'orienter ⭐

Sur un **sujet banal** (constipation du nourrisson, régurgitations, pleurs du soir, rougeurs, sommeil qui se dérègle), un protocole qui envoie consulter dès la première occurrence transforme un événement ordinaire en alerte, et il fait exactement l'inverse de ce que l'app promet. Le parent repart avec plus d'inquiétude qu'en arrivant.

**Structure obligatoire de l'orientation sur un sujet banal :**

1. **Une fenêtre de temps chiffrée**, pendant laquelle le parent accompagne : « si cela persiste au-delà de trois ou quatre jours malgré les gestes de confort ».
2. **Puis l'orientation, sans urgence** : « → pédiatre, médecin traitant ou PMI, sans urgence ».
3. **À part, la liste courte des signes qui court-circuitent le délai** : sang, vomissements, refus de boire, absence de prise de poids, ventre dur et tendu en permanence, etc. Ceux-là s'appellent tout de suite, et ils sont nommés séparément.

Un sujet **grave d'emblée** (fièvre avant trois mois, difficulté à respirer, suspicion de secouement, arrêt total des selles et des gaz) n'a évidemment pas de fenêtre de temps : il s'oriente immédiatement.

**Conséquence sur la réflexologie** : quand une règle de temps existe, le geste et le lien ont toute leur place, ils occupent précisément cette fenêtre d'accompagnement. Quand le protocole oriente d'emblée vers une consultation, le geste n'apporte rien et brouille le message.

**Test avant de valider un `consulter_si`** : est-ce qu'un parent dont l'enfant va bien pourrait cocher tous les critères ? Si oui, le seuil est mal posé.

---

### 3.7 `geste_doux` (objet)
**Objectif :** l'élément réflexologique ou de régulation douce, après l'action immédiate.

**Structure :**
```json
{
  "couleur_fond": "#E1F5EE",
  "couleur_texte": "#085041",
  "titre": "Geste doux : après la crise uniquement",
  "etapes": [
    "Étape réflexo ou de contact doux",
    "...",
    "..."
  ],
  "lien_reflexologie": { "id": "sommeil", "titre": "Sommeil agité" }
}
```

#### Le lien vers l'onglet Réflexologie ⭐

Quand la thématique du protocole correspond à un protocole de l'onglet **Réflexologie plantaire**, on ajoute le champ facultatif **`lien_reflexologie`** dans `geste_doux`. Il renvoie le parent vers la séquence complète et animée, sans la recopier.

**Deux conditions cumulatives, aucune exception :**

1. **La thématique correspond vraiment.** Sommeil ↔ `sommeil`, régurgitations ↔ `reflux`, selles ↔ `constipation`, coliques ↔ `coliques`, séparation ↔ `separation`, dents ↔ `dents`, etc. Pas de rapprochement approximatif : un protocole sur les pleurs de sur-stimulation n'est pas un protocole « anxiété ».
2. **Le protocole de réflexologie est disponible au mois travaillé.** ⚠️ C'est l'erreur la plus facile à commettre. Les bornes d'âge sont dans **`reflexologie/protocoles-index.json`** (champs `age_min_mois` / `age_max_mois`, résumés par le champ `age`). Exemple : `coliques` s'arrête à M2, donc un protocole M3 « la fin des coliques » ne peut **pas** pointer dessus ; `separation` ne démarre qu'à M6, donc pas de lien depuis un M3 sur la reprise du travail. **Toujours ouvrir le tableau de répartition avant d'écrire un lien.**

**On ne modifie jamais le protocole de réflexologie lui-même** depuis Guide-moi : on l'utilise tel qu'il est, ou on ne le lie pas. Les étapes écrites dans `geste_doux` restent le geste court du protocole Guide-moi, elles ne sont pas la séquence complète.

Sont hors périmètre du lien : les protocoles retirés pour déontologie (`bronchite-asthme`, `eczema`, `allergies`, `ictere`, `meconium`) et tout protocole `lancement: false`.

**Règles :**
- **5 étapes**, 6 au maximum si une idée mérite sa ligne
- **Format « Amorce : suite » imposé** : chaque étape commence par une amorce courte suivie de « : », puis du détail. L'amorce est mise en gras à l'affichage. Ex : « Zone du plexus solaire : centre de la voûte plantaire, cercles lents, 1 min par pied. »
- **Titre — le mot « Réflexologie » doit apparaître quand le geste en relève.** Quand le geste doux repose sur la réflexologie (le cas le plus fréquent), le titre commence par « Réflexologie » pour que le parent comprenne immédiatement de quoi il s'agit. **Format : « Réflexologie : [précision courte] »** (ex. « Réflexologie : apaisement et sécurité », « Réflexologie : préparer une transition »). Uniquement pour un geste **non** réflexologique (contact, pression proprioceptive, portage), garder le préfixe « Geste doux : [précision] ».
- Inclure si pertinent une zone réflexe et sa durée
- **Trois titres au maximum par thème ⭐ — arrêté le 28 août, précisé le 1er septembre 2026.** Le titre du bloc ne change pas d'un protocole à l'autre. Chaque thème dispose de **trois titres au plus**, choisis pour couvrir le maximum de situations, plus les deux registres imposés par le sujet.

  | Titre | Portée | Emploi |
  |---|---|---|
  | `Réflexologie : …` | **transverse** | dès que le geste relève de la réflexologie (règle ci-dessus) |
  | `Geste doux : …` | **transverse** | geste corporel non réflexologique : position, portage, contact, respiration |
  | `Observer bébé : …` | **transverse** | quand ce qu'on demande au parent est de regarder et de lire, pas d'agir. Décision de Laura : « peut intervenir dans tous les slots » |
  | `Si ça arrive : …` | **transverse, réservé** | uniquement le danger vital, quand le geste doit être trouvé sans réfléchir (étouffement) |
  | le troisième titre | **propre au thème** | il porte la couleur du thème et ne sort pas de son slot |

  **Le troisième titre est thématisé, et il se cherche.** Décision de Laura : « "hors du repas" reste thématisé à "alimentation". Si nécessaire, en trouver un qui s'adapte à chaque slot et au contenu : le but étant de rester dans la création pertinente et intelligente des contenus. » Autrement dit, on ne recycle pas le titre d'un thème dans un autre : à chaque nouveau thème, on cherche le titre qui dit vraiment ce que le bloc fait dans ce thème-là.

  **Un titre thématisé ne sort jamais de son slot.** On n'emprunte pas `Hors du repas` à
  l'alimentation pour un protocole de sommeil : `qa_contenu.py` le signale.

  | Thème | Troisième titre | Ce qu'il contient |
  |---|---|---|
  | Alimentation (M6+) | `Hors du repas : …` | ce qui se travaille en dehors du moment du repas |
  | Ventre & digestion (M0-M5) | `Au moment du lait : …` | ce que le parent change avant, pendant et après la prise de lait *(arrêté le 01/09, remplace « Après le repas »)* |
  | Parents submergés | `Retrouver le contact : …` | le geste corporel **avec l'enfant** quand le lien est éteint *(arrêté le 02/09)* |
- **La Réflexologie n'est PAS systématique.** Elle n'apparaît que là où elle est réellement pertinente, et elle est **exclue** des contextes à risque allergène, à enjeu d'autonomie corporelle, ou à enjeu de peau. Dans ces contextes, utiliser « Geste doux : … » (position, portage, contact, respiration).

  **Contextes où la Réflexologie est interdite ⭐ :**
  - **alimentation et appétit** (tétée, biberon, quantités, diversification, morsure du sein)
  - **endormissement lié à la tétée** : tout protocole où le geste viendrait remplacer ou accompagner une prise alimentaire, même sous couvert de sommeil
  - **propreté**
  - **peau et dermatologie** (sécheresse, eczéma, érythème, croûtes) : la peau du nourrisson est le terrain le plus sensible, aucun geste appuyé ni aucun produit ne s'y ajoute

  **Contextes où la Réflexologie est AUTORISÉE, contrairement à ce qui était écrit avant ⭐ :**
  - **digestion et transit** : l'onglet Réflexologie comporte des protocoles *Constipation*, *Diarrhée* et *Inconfort digestif*. Le geste et le lien sont donc légitimes sur ces sujets, dans les bornes d'âge de chaque protocole.
  - **poussée dentaire** : autorisée **seulement quand le protocole traite réellement de la dent ou du besoin de soulager une gencive**. Un protocole où la gencive n'est qu'un décor (une morsure pendant la tétée, une salivation qu'on explique par autre chose) ne reçoit ni geste ni lien. Le test : si on retirait la douleur de gencive, le protocole existerait-il encore de la même façon ? Si oui, pas de réflexologie.
- **Clause d'arrêt, à inclure quand c'est pertinent** : « S'arrêter à sa demande : s'il retire son pied ou se crispe, on arrête sans insister. » Le geste est toujours réalisé **par le parent, sur son propre enfant**.
- **Réflexologie — vocabulaire imposé (RÈGLE MISE À JOUR) :**
  - **Jamais de pression chiffrée.** Ne plus écrire « pression 0/10 » ni aucune échelle numérique. Décrire la pression de façon qualitative : « pression douce et constante », « toucher doux et enveloppant », « appui léger et maintenu ».
  - **Ne jamais écrire « massage » — ni pour l'affirmer, ni pour le nier.** La formule « ce n'est pas un massage » est **supprimée** : elle est fausse (c'en est un) et sa négation attire l'attention sur le terme légalement réservé. On n'emploie tout simplement pas le mot.
  - **Ne jamais employer « caresse ».** Une caresse chatouille et peut être désagréable — ce n'est pas la sensation recherchée. Vocabulaire autorisé : « toucher », « pression douce », « geste doux », « stimulation des zones réflexes », « geste de balayage ».
- Couleurs fixes : fond `#E1F5EE`, texte `#085041` (vert sauge — codes verrouillés, cf. M14 réel)

### Un point de plus, quand une idée le mérite ⭐ — arrêté le 8 septembre 2026

**Décision de Laura**, en deux temps : « pourquoi se limiter à 4 points s'il en faut plus ? La table
à langer nécessite son point à elle seule », puis « on ajoute de la souplesse dans le nombre de
points dans les catégories. Si c'est nécessaire, on ajoute un point ».

**Le compte de référence ne bouge pas.** C'est le standard visuel de l'app, et surtout il oblige à
choisir, ce qui est la moitié du travail d'écriture :

| Bloc | Référence | Toléré |
|---|---|---|
| `action_immediate.etapes` | 5 | 6 |
| `geste_doux.etapes` | 5 | 6 |
| `pour_aller_plus_loin` | 4 | 5 |
| `erreurs_a_eviter` | 4 | 5 |

**Ce qui change, c'est la sanction.** Le point supplémentaire n'est plus une erreur : il est admis
**quand une idée est écrasée en étant fondue dans une autre**. C'est le seul motif recevable.

**Le test :** est-ce que ce point dit quelque chose que les autres ne disent pas, et est-ce que
l'y fondre lui ferait perdre son sens ? Si oui, il prend sa ligne. Sinon, il n'existe pas.

> **Le cas qui a produit la règle.** Le protocole *Le combat du matin* (M19) traitait dans une seule
> ligne les gestes à mettre à sa portée et le fait de l'habiller au sol plutôt que sur la table à
> langer. Deux idées différentes, dont l'une répondait à une question précise du parent : la table à
> langer y perdait son explication. Elle a désormais sa ligne.

**Et le plafond de mots ne coupe pas une carte validée ⭐ — arrêté le 9 septembre 2026.**
Décision de Laura, à propos du *Combat du matin* (M19), qui pèse 812 mots pour un plafond de 800 :
« la laisser. Et parfois c'est le cadre de sécurité qui est très lourd. » Le plafond sert à empêcher
la dérive, pas à raboter une carte relue ligne à ligne par la fondatrice — ni à faire payer à un
protocole la longueur de son `consulter_si`, qui n'est pas de la rédaction mais de la protection.

**Ce que la souplesse n'autorise pas.** Elle ne sert **jamais** à caser une pensée de plus, ni à
éviter de trancher entre deux formulations, ni à compenser un protocole qui n'a pas trouvé son
angle. Un bloc qui déborde systématiquement signale presque toujours que le protocole traite deux
sujets et qu'il faut en couper un.

**Et le vrai plafond n'est pas le nombre de puces.** C'est le **volume du protocole**, qui reste
entre **350 et 800 mots**. Un point de plus pris sur un protocole déjà long se paie ailleurs, et
c'est le compteur de mots qui arbitre, pas la puce.

**Un dispositif rapporté par la recherche s'ajoute, il ne remplace pas ⭐ — arrêté le 8 septembre
2026.** Décision de Laura, à la question posée pendant la passe mois par mois : « tu passes à
5 points s'il en manque un. »

Le cas est précis : la vérification à la source française fait apparaître un **dispositif réel que
le protocole ne mentionnait pas** — le congé supplémentaire de naissance, le TISF de la Caf, un
lieu d'accueil enfants-parents, un rendez-vous prévu par le parcours de soin. La tentation est de
le substituer à un point existant pour tenir le compte de 4. **C'est l'inverse qu'on fait : on
passe à 5.**

**La raison.** Un point existant a déjà été jugé utile ; le retirer pour faire de la place, c'est
échanger une aide contre une autre au lieu d'en donner deux. Et une porte concrète est précisément
ce qui distingue ce corpus d'un article de blog : elle vaut plus qu'une puce de mise en page.

**Ce que cela ne change pas** : le test de l'idée écrasée reste le seul motif, le plafond reste le
volume du protocole, et un bloc qui déborde de deux points signale toujours un protocole qui traite
deux sujets. **On passe à 5, pas à 6.**

### 3.8 `pour_aller_plus_loin` (liste — 4 points, 5 quand une idée mérite sa ligne)
**Objectif :** ce que le parent peut faire à plus long terme.

**Règles :**
- **4 points par défaut, 5 au maximum.** Voir la règle générale de souplesse ci-dessous : elle vaut
  pour tous les blocs, pas seulement pour celui-ci.
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

### 3.10 `erreurs_a_eviter` (liste — 4 erreurs, 5 quand une idée mérite sa ligne)
**Objectif :** les pièges fréquents — informatif, pas culpabilisant.

**Règles :**
- **4 erreurs**, 5 au maximum si une idée mérite sa ligne (voir « Un point de plus, quand une idée le mérite »)
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
- Inclure les numéros utiles quand pertinent : **15** (Samu, urgence vitale), **119** (Allo Enfance
  en danger, gratuit, 24 h/24, et c'est le numéro que l'Assurance Maladie nomme pour le parent qui
  sent qu'il risque de secouer), **Allo Parents Bébé 0 800 00 34 56** (gratuit, en journée du lundi
  au vendredi, psychologues et puéricultrice, parents d'enfants de moins de trois ans)
- ⛔ **Le 3114 et le sujet du suicide ne figurent nulle part dans l'app** — arrêté le 02/09/2026,
  voir `SKILL_contenu.md`
- Inclure la suggestion d'un professionnel spécialisé si pertinent (psychomotricien, orthophoniste, ergothérapeute)

### 3.12 `source` (string — optionnel, conditionnel)

Champ **facultatif**, ajouté **uniquement quand c'est nécessaire**, pour rendre une affirmation défendable.

**Quand l'ajouter — deux portes, et deux seulement (règle du 08/09/2026, détail dans `SKILL_contenu.md`) :**
- **La sécurité légale** : le texte avance une affirmation qui engage la responsabilité de l'app — danger, geste à ne pas faire, conduite à tenir médicale, seuil de dépistage, interdit posé par la loi. Là, la source est obligatoire.
- **L'étude officielle avec un chiffre** : une donnée sourcée qui éclaire un fait et le rend saisissable. Là, la source est du crédit, pas une protection.
- **Jamais** sur du savoir-faire éducatif (posture parentale, comportement, émotions, jeu…) : citer une référence sous une évidence de métier laisse croire que l'app ne le savait pas d'elle-même.

**Règles (voir `SKILL_contenu.md` § Sourcing des affirmations sensibles pour le détail) :**
- Sources **obligatoirement françaises et institutionnelles** : Haute Autorité de Santé, Assurance Maladie (ameli.fr), Santé publique France, ANSES, Inserm, mpedia.fr (AFPA), 1000-premiers-jours.fr, sociétés savantes, UFSBD. **Aucune source étrangère** sur un sujet sensible (défendabilité en droit français), et **aucun organisme financé par une filière** : le CERIN a été retiré du corpus le 08/09/2026 pour cette raison.
- **Réellement vérifiées et correctement attribuées** : on cite l'auteur/l'organisme, on ne s'approprie pas la méthode d'un professionnel, on n'invente jamais une référence.
- **Une seule ligne discrète**, affichée en petit en bas de la fiche. Format : chaîne unique commençant par « Source : … ».
- Ex. : « Source : ne pas forcer, respecter l'appétit de l'enfant — repères pédiatriques mpedia.fr (AFPA) ; courbe de croissance : HAS. »

---

## 3bis. Répartition des informations — la matrice anti-redondance ⭐

> **Point de vigilance n°1 des contenus actuels.** Les mêmes idées circulent d'un bloc à l'autre : ce qui se passe, l'ancrage, l'action, le principe et les erreurs finissent par dire la même chose avec d'autres mots. Résultat : le parent lit quatre fois la même information et ne retient rien.

### La matrice : une question par bloc

| Bloc | La question à laquelle il répond | Angle exclusif | Ce qu'il ne contient JAMAIS |
|------|----------------------------------|----------------|------------------------------|
| `explication` | Que vit l'enfant, et pourquoi ? | Côté enfant : mécanisme développemental ou neurologique | Aucun conseil, aucun geste, aucune consigne au parent |
| `ancrage` | Comment le parent se positionne avant d'agir ? | Côté parent : posture, permission, déculpabilisation | Ne redit pas le mécanisme, ne donne aucune technique |
| `action_immediate` | Que faire dans la minute ? | Gestes concrets, séquencés, ici et maintenant | Rien de préventif, rien d'organisationnel, rien de long terme |
| `geste_doux` | Quel geste corporel après la vague ? | Toucher et réflexologie : zone, qualité, consentement | Aucun conseil éducatif, aucune logistique |
| `pour_aller_plus_loin` | Que mettre en place en amont, ou dans la durée ? | Prévention, environnement, organisation, ressources, professionnels | Aucune reprise des étapes déjà données |
| `principe` | Que retenir si on oublie tout le reste ? | Une loi générale, formulée en abstraction | Pas de résumé des étapes, pas de consigne pratique nouvelle |
| `erreurs_a_eviter` | Quel piège fréquent, et quelle conséquence ? | Constat + conséquence, sur des pièges non traités ailleurs | Pas la simple négation de ce qui vient d'être conseillé (1 maximum) |
| `consulter_si` | Quand ce n'est plus de notre ressort ? | Critères observables + professionnel nommé | Aucun conseil d'accompagnement |

### La seule répétition autorisée

Une notion centrale peut réapparaître **une seconde fois au maximum**, à condition de **changer de niveau** : l'action donne **le geste**, le principe donne **la loi**. Jamais trois fois, jamais avec les mêmes mots.

### Le test des 8 lignes (obligatoire avant de valider un protocole)

Écrire en brouillon **une ligne par bloc** résumant son idée-clé, puis relire les 8 lignes ensemble :
1. Deux lignes disent la même chose → réécrire l'une des deux ou la supprimer.
2. Une ligne ne répond pas à la question de son bloc → elle est mal placée, la déplacer.
3. Une expression signature (« il ne fait pas exprès », « ce n'est pas un caprice », « son cerveau est en travaux ») apparaît deux fois → n'en garder qu'une.

### Exemple de dérive (à ne pas reproduire)

- `explication` : « il ne mesure pas encore le danger »
- `ancrage` : « ce n'est pas de la désobéissance, son cerveau ne juge pas le risque »
- `principe` : « grimper est un besoin normal, pas un caprice »
- `erreurs_a_eviter` : « croire qu'il comprendra après un seul rappel »

Quatre formulations pour une seule idée. **Correction** : garder le mécanisme dans l'explication, donner au parent une posture dans l'ancrage, énoncer une loi neuve dans le principe, et réserver les erreurs à des pièges non dits.

### Le contrôle croisé obligatoire : situation ↔ principe ↔ action ↔ erreurs ⭐

Les redites les plus tenaces ne sont pas entre l'explication et l'ancrage : elles sont entre **l'action immédiate et les erreurs à éviter**, parce qu'une erreur est souvent écrite comme la négation de l'étape qu'on vient de donner. Vérifier les quatre couples, un par un :

| Couple | Ce qu'on cherche | Comment on corrige |
|--------|------------------|--------------------|
| `situation` ↔ `principe` | Le principe reformule l'intitulé de la situation | Le principe doit énoncer une loi qui dépasse la scène décrite |
| `principe` ↔ `action_immediate` | Le principe résume les étapes | Le principe monte d'un cran, il ne récapitule pas |
| `action_immediate` ↔ `erreurs_a_eviter` | Une étape et une erreur sont la même idée à l'endroit et à l'envers | **On garde l'étape positive et on remplace l'erreur** par un piège qu'on n'a pas encore nommé |
| `erreurs_a_eviter` ↔ `pour_aller_plus_loin` | Le même conseil, une fois en positif, une fois en négatif | On n'en garde qu'un des deux |

**Un point d'action qui est en réalité une erreur déguisée sort de l'action.** Si une étape ne dit que « ne pas faire X », elle appartient aux erreurs, pas à l'action immédiate. L'action immédiate ne contient que des gestes que le parent peut poser.

**Alléger vaut mieux que compléter.** On n'est pas obligé de remplir chaque bloc jusqu'à la limite. Un protocole de cinq étapes utiles vaut mieux qu'un protocole de cinq étapes dont deux se répètent : un parent épuisé lit ce qui est court et distinct, il décroche de ce qui tourne en rond. La seule exception reste celle du § « La seule répétition autorisée » : deux formulations différentes d'un point vraiment important, à deux niveaux différents.

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
| pour_aller_plus_loin | 4 (ou 5) × 15-25 mots = 60-125 mots |
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
- 119 = Allo Enfance en danger, gratuit, 24 h/24, n'apparaît sur aucun relevé de téléphone
- Allo Parents Bébé = 0 800 00 34 56, gratuit, en journée du lundi au vendredi
- Mon soutien psy = des séances de psychologue prises en charge par l'Assurance Maladie, sur rendez-vous direct ou après avis d'un médecin (jamais de nombre de séances : voir la règle sur les chiffres des dispositifs)
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
- [ ] Action immédiate = 5 étapes (6 si une idée le justifie)
- [ ] Geste doux = 5 étapes (6 si une idée le justifie), avec zone réflexe si pertinent
- [ ] Geste doux : AUCUNE pression chiffrée, AUCUN emploi de « massage » (ni affirmé ni nié), AUCUN « caresse »
- [ ] Typographie : guillemets « » + espaces insécables (avant : ; ! ? et autour des guillemets), « Réflexologie » en toutes lettres
- [ ] Titre du geste doux réflexologique au format « Réflexologie : … » (le mot apparaît clairement)
- [ ] Aucune personnalisation de genre de l'enfant (pas de [x/y]) — masculin par défaut ; formes inclusives réservées à la voix du parent
- [ ] Émotion de l'enfant validée/reformulée avant la résolution (sauf nourrisson pré-verbal et éveil partiel type terreur nocturne)
- [ ] Titre construit en deux parties « Thème / précision de la situation » (séparateur « / »)
- [ ] `source` (si sujet sensible uniquement) : source française vérifiée et attribuée, une ligne discrète ; aucune source sur les sujets libres
- [ ] Pour aller plus loin = 4 points (5 si une idée le justifie) · Erreurs = 4 (5 si justifié) · Étapes = 5 (6 si justifié)
- [ ] Principe = 1-2 phrases de fond
- [ ] Erreurs à éviter = 4 erreurs (5 si une idée le justifie), formulées comme constats
- [ ] Consulter_si = critères objectifs uniquement
- [ ] Aucune formulation interdite (votre enfant, il faut, malheureusement)
- [ ] Aucune précaution interdite (huiles essentielles, lidocaïne, miel...)
- [ ] Le protocole est VRAIMENT différent des 3 autres protocoles de sa catégorie
- [ ] Le volume est entre 400 et 700 mots
- [ ] **Aucun tiret cadratin `—`**, et la ponctuation de remplacement est variée
- [ ] **Test des 8 lignes passé : une information, un seul bloc** (§ 3bis)
- [ ] Le principe énonce une loi de fond, pas un résumé ; une seule erreur-miroir maximum
- [ ] **Libellé `situation` repris à l'identique du tableau de pilotage**
- [ ] **Contrôle qualité en 3 passes effectué** (voir `SKILL_contenu.md`)
- [ ] **Difficultés, alertes et interrogations signalées à la fondatrice**

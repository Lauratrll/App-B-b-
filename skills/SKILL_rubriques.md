# SKILL_rubriques.md — Structure éditoriale des 6 rubriques par mois

> Lire ce fichier AVANT de générer le contenu d'un nouveau mois.
> Ce skill définit la structure JSON, le ton, les conventions transverses, et la convention de l'adjectif du mois.

---

## 1. Vue d'ensemble

Chaque mois (de 0 à 24) contient **6 fichiers JSON** dans un dossier `mois{XX}/` :

| # | Fichier | Rubrique app | Statut éditorial |
|---|---------|--------------|------------------|
| 1 | `01_protocoles.json` | Guide-moi ! | **Le plus développé** — 32 protocoles différenciés |
| 2 | `02_coucher.json` | Préparer le coucher | Concis — rituel + réflexo + script audio |
| 3 | `03_prendre_soin_de_moi.json` | Prendre soin de moi | 6 conseils, droit au but |
| 4 | `04_saison.json` | Saison | 4 variantes saisonnières dans un seul fichier |
| 5 | `05_partager_rassurer.json` | Partager & rassurer | 3 scripts audio (1 par trimestre) |
| 6 | `06_jeux.json` | Jeux & stimulation | 4 activités diversifiées |

**Règle de nomenclature :** `NN_nom_avec_underscores.json` — pas de tirets, deux chiffres pour le numéro de mois.

---

## 2. Convention de l'adjectif du mois ⭐ (NOUVEAU)

Chaque mois est qualifié par **un adjectif unique** qui résume le moment développemental. Cet adjectif :
- Apparaît dans `06_jeux.json` (clé `adjectif_du_mois`) et dans le `sous_titre`
- Sert d'ancrage éditorial pour toute la production du mois — il oriente le ton et les choix de contenu
- Est affiché dans l'app comme une bannière subtile sur l'écran d'accueil du mois

### Format dans le JSON

```json
{
  "sous_titre": "Mois 14 — Le mois de l'Explorateur",
  "adjectif_du_mois": "Explorateur",
  "qualification_du_mois": "À 14 mois, ton enfant marche, comprend tout, manipule avec une précision croissante. C'est le mois de l'exploration active — où le monde se découvre par le corps et par les sens."
}
```

### Table des adjectifs proposés pour les 24 mois

Liste à **valider ou ajuster** avec la fondatrice mois par mois. Les adjectifs doivent évoquer un mouvement développemental, pas un état figé.

| Mois | Adjectif | Moment développemental clé |
|------|----------|---------------------------|
| 0 | Le Lové | Adaptation extra-utérine, peau à peau, premier souffle |
| 1 | L'Éveillé | Premiers sourires sociaux, regard qui accroche |
| 2 | Le Communicant | Babillage, vocalisations, échanges face à face |
| 3 | L'Attentif | Suit des yeux, tient la tête, intéressé par le monde |
| 4 | Le Découvreur | Préhension volontaire, exploration buccale |
| 5 | Le Joueur | Rires, jeux de "coucou", attente du retour |
| 6 | Le Réceptif | Diversification, nouvelles textures, nouvelles saveurs |
| 7 | Le Mobile | Retournements, début du quatre pattes |
| 8 | L'Audacieux | Quatre pattes affirmé, premiers déplacements |
| 9 | Le Curieux | Permanence de l'objet, recherche active, pointage |
| 10 | Le Grimpeur | Se met debout, longe les meubles |
| 11 | L'Imitateur | Imitation des gestes, premiers signes |
| 12 | Le Marcheur | Premiers pas, premiers mots |
| 13 | L'Affirmé | Choix, préférences, début de l'opposition |
| 14 | L'Explorateur | Marche affirmée, manipulation fine, exploration active |
| 15 | Le Bavard | Explosion lexicale, 10-20 mots, comprend tout |
| 16 | L'Indépendant | "Moi tout seul", refus de l'aide, autonomie |
| 17 | Le Sensible | Émotions amplifiées, empathie naissante |
| 18 | Le Diplomate | Premières phrases, négociations, "non" structurés |
| 19 | Le Rythmé | Routines intégrées, sens du temps qui s'installe |
| 20 | Le Symbolique | Jeu de faire-semblant, imagination débordante |
| 21 | Le Sociable | Intérêt pour les autres enfants, premiers jeux parallèles |
| 22 | Le Tendre | Câlins spontanés, déclarations d'amour |
| 23 | L'Aventurier | Course, sauts, escalade — confiance corporelle |
| 24 | L'Émergent | Pré-conscience de soi, "je", projets simples |

**Règles d'ajustement :**
- Si la fondatrice préfère un autre adjectif pour un mois, l'ancien est archivé en commentaire dans le JSON
- Un même adjectif ne peut pas être utilisé deux fois
- Préférer la nuance à l'exhaustivité (ex : "L'Explorateur" couvre déjà "L'Aventurier" — ne pas dupliquer)

---

## 3. Structure des 6 fichiers — clés top-level communes

Tous les fichiers JSON partagent ce socle :

```json
{
  "mois": 14,
  "tranche_age": "14 mois",
  "rubrique": "guide_moi",
  "titre_rubrique": "Guide-moi !",
  "sous_titre": "Mois 14 — Le mois de l'Explorateur",
  "description": "...",
  ...
}
```

Notes :
- `mois` : nombre entier 0 à 24
- `tranche_age` : chaîne lisible ("0-4 semaines" pour M0, "14 mois" pour M14+)
- `rubrique` : identifiant technique (`guide_moi`, `preparer_le_coucher`, `prendre_soin_de_moi`, `saison`, `partager_rassurer`, `jeux`)
- `titre_rubrique` : libellé exact affiché dans l'app
- `sous_titre` : intègre l'adjectif du mois (sauf pour les rubriques très techniques)

---

## 4. Structure spécifique de chaque rubrique

### 4.1 `01_protocoles.json` — Guide-moi ! (Référence — le plus développé)

**Format :**
- `categories` : liste de 8 catégories (id, nom, sous_titre, icone)
- `protocoles` : liste de 32 protocoles (4 par catégorie)

**Structure d'un protocole :**
```json
{
  "categorie": "colere",
  "situation": "Crise de colère intense depuis 20 minutes",
  "titre": "Crise de colère intense qui dure",
  "explication": "3-5 phrases sur le mécanisme neuro/développemental",
  "ancrage": "1-2 phrases adressées au parent",
  "action_immediate": {
    "couleur_fond": "#FCEBEB",
    "couleur_texte": "#A32D2D",
    "titre": "Action immédiate",
    "etapes": ["...", "..."]  // 5 étapes max
  },
  "geste_doux": {
    "couleur_fond": "#E1F5EE",
    "couleur_texte": "#085041",
    "titre": "Geste doux — après la crise uniquement",
    "etapes": ["...", "..."]  // 5 étapes max
  },
  "pour_aller_plus_loin": ["...", "...", "...", "..."],  // 4 points
  "principe": "1 phrase de fond — la règle générale",
  "erreurs_a_eviter": ["...", "...", "...", "..."],  // 4 erreurs max
  "consulter_si": "Critères médicaux objectifs"
}
```

**Voir `SKILL_protocole.md` pour les règles détaillées de rédaction.**

### 4.2 `02_coucher.json` — Préparer le coucher

**Structure essentielle :**
```json
{
  "reperes_cles": ["...", "...", "..."],  // 3 max
  "rituel_etapes": [...],  // 6 étapes chronologiques
  "reflexologie_du_coucher": {
    "titre": "...",
    "duree_totale": "7 minutes",
    "pression": "0/10",
    "etapes": [...]  // 6 zones réflexo
  },
  "script_audio_du_soir": {
    "titre": "...",
    "duree": "~5 minutes",
    "instruction": "...",
    "texte": "..."  // script complet avec [pause]
  },
  "signaux_de_fatigue": ["...", "..."],  // 4-5 max
  "erreurs_a_eviter": ["...", "...", "..."],  // 3 erreurs ciblées max (dont les écrans)
  "consulter_si": "..."
}
```

**Règles :**
- Pas d'ancrage en tête (redondant avec le contenu)
- 3 erreurs max — toujours inclure une référence aux écrans (lumière bleue / mélatonine)
- Le script audio est l'élément le plus important — soigner la qualité littéraire
- **Ordre de fin de rituel (bande nourrisson M0–M5)** : massage + réflexo (bébé au chaud) → **pyjama + gigoteuse** → **dernière prise de lait** → pose. On habille **avant** la prise de lait pour pouvoir coucher bébé endormi sans le réveiller pour le rhabiller. _(Bande diversification M6+ : la prise de lait fait partie du repas du soir, placé en début de rituel.)_
- **Ne jamais évoquer le « peau à peau » au coucher.** Les parents le pratiquent s'ils le souhaitent, mais le contenu ne le mentionne ni ne le prescrit — ni dans les étapes du rituel, ni dans la berceuse.
- **Alimentation** : écrire **« prise de lait »** (couvre sein + biberon sans hiérarchie). Jamais **« tétée »** seul, ni **« en tétant »** (préférer **« en buvant »**).
- **Berceuse honnête** : ne pas écrire que « la nuit, c'est un long câlin » (bébé dort dans son lit, c'est mensonger). Préférer « tu vas dormir dans ton lit, tout près de moi » / « je veille sur toi ».
- **micro-réveils** (jamais « micro-éveils »).
- Berceuse : ouvrir sur `[Prénom]`, refrain de clôture commun (« Tu es en sécurité. Tu es au chaud. Tu es [aimé/aimée]. … Bonne nuit. »), formes genrées masculin d'abord `[forme_m/forme_f]`, jamais d'écriture inclusive typographique.
- Rendu berceuse (cf. `CONSIGNES_CLAUDE_CODE_coucher.md` §7) : garder le titre « Berceuse » + le teaser ; **ne pas afficher le champ `instruction`** (logique d'usage) ; afficher le `texte` **en noir** (`#3A3228`).
- Réflexo : inclure un champ `consentement` (observer bébé, s'arrêter à la moindre crispation, accepter ses positions).

### 4.3 `03_prendre_soin_de_moi.json` — Prendre soin de moi

**Structure validée :** 6 conseils numérotés, format direct, sans multi-découpage.

```json
{
  "description": "...",
  "conseils": [
    {
      "id": "auto_massage_reflexologie",
      "numero": 1,
      "icone": "🤲",
      "titre": "...",
      "sous_titre": "...",
      "intro": "...",
      ...  // structure variable selon le type de conseil
    },
    ...
  ]
}
```

**Les 6 conseils fixes (ordre stable mois par mois, contenu variable) :**

1. **Auto-massage de réflexologie** — soutient les maux/émotions parentales du moment (stress, fatigue de portage, insomnie, troubles digestifs, allaitement). 4 points sur les mains, accessibles partout.

2. **Méditation audio** — script complet de 5-7 min, à écouter le soir. Fréquence indicative (hebdo ou quotidien).

3. **Célébrer les petites victoires** — pour soi, pour son bien-être. Notion de récurrence (quotidien ou hebdomadaire). 5-6 exemples concrets.

4. **Auto-reconnaissance** — participatif, format à varier mois par mois (liste écrite, voix enregistrée, lettre à soi-même...). Toujours avec `espace_pour_ecrire: true` ou équivalent. Donner 4-5 amorces si blocage.

5. **Réalité du post-partum maman ET papa** — deux sections distinctes. Plus dense dans les premiers mois (M0 à M6), plus condensé après. Bienveillant, sans jugement. Toujours inclure : signaux à ne pas négliger + qui consulter (3114, sage-femme, MonParcoursPsy, Allo Parents Bébé, Maman Blues).

6. **Challenge couple** — simple, amusant, durée 5-10 min, hebdomadaire. Un challenge différent chaque mois.

**Règles transverses :**
- Pas de section "signaux d'alerte" séparée — elle est intégrée au conseil 5
- Pas de section "ressources" séparée — les ressources sont dans le conseil 5
- Aller droit au but, sans intro philosophique

### 4.4 `04_saison.json` — Saison (4 variantes en un fichier)

**Structure :**
```json
{
  "logique_selection": {
    "regle": "À partir de 12 mois : saison du mois civil en cours. Avant 12 mois : voir SKILL pour règle spécifique au mois.",
    "mapping": {
      "printemps": ["mars", "avril", "mai"],
      "ete": ["juin", "juillet", "août"],
      "automne": ["septembre", "octobre", "novembre"],
      "hiver": ["décembre", "janvier", "février"]
    }
  },
  "versions": {
    "printemps": {...},
    "ete": {...},
    "automne": {...},
    "hiver": {...}
  }
}
```

**Structure d'une variante :**
- `id`, `titre`, `ambiance`, `couleur_theme`, `couleur_accent`, `emoji`, `ancrage`
- `principes` (3-4 points)
- `habillage` : principe + `guide_temperature` (4 tranches)
- `sorties` : frequence_conseillee, moments_ideaux, activites_specifiques
- `particularites_sante` : vigilance + signes_consultation + vitamine_d
- `rituel_lumiere` (ou `rituel_fraicheur` en été)
- `alimentation_maman` (liste simple)
- `amenagement_chambre` (liste simple)
- `moral_hiver` ou `moral_lumiere_decroissante` (uniquement automne/hiver)

**Règles :**
- Pas de `erreurs_a_eviter` ni de `phrases_ancrage` à la fin (trop éditorial)
- Couleurs thématiques fixes : printemps `#EAF3DE`, été `#FAEEDA`, automne `#F5E4DE`, hiver `#E4EEF0`
- Emojis fixes : 🌱 ☀️ 🍂 ❄️

**Spécificité Mois 0 :** la règle de sélection se base sur le mois de naissance (un nouveau-né reste dans sa saison de naissance pendant 4 semaines). À partir du Mois 12+, la règle se base sur le mois civil en cours.

### 4.5 `05_partager_rassurer.json` — Partager & rassurer

**Intention éditoriale fondamentale**

Cette rubrique propose des **audios** que le parent fait écouter à son bébé (ou se lit à lui-même en présence du bébé). L'objectif n'est pas informationnel — c'est **émotionnel et inconscient**. Il s'agit d'**accueillir les émotions inconscientes** du bébé en fonction de son âge.

Le principe : ce que le bébé n'a pas pu mettre en mots, ce que la mère ou le père n'ont peut-être pas pu lui dire, ce qui s'est passé pendant la grossesse, à la naissance, ou dans l'histoire familiale — peut être nommé doucement par la voix du parent (ou par la voix enregistrée), pour libérer des tensions inconscientes et créer de l'apaisement.

**Exemple de formulation type (validé par la fondatrice) :**
> "Je voulais que tu bouges souvent dans mon ventre pour savoir que tu vas bien. Aujourd'hui tu peux t'apaiser et dormir tranquillement."

Ce type de phrase fait deux choses simultanément :
1. Reconnaît une réalité passée (l'angoisse maternelle pendant la grossesse a pu créer une vigilance chez le bébé)
2. Libère le bébé de cette charge en nommant que c'est terminé

### Champs théoriques d'inspiration

Les scripts s'inspirent **librement** de ces approches, sans jamais citer verbatim ni reprendre de formulations propres à leurs auteurs :

- **Haptonomie périnatale** (Frans Veldman, années 1960) — le bébé est sensible à l'intention affective dès le 2e trimestre. La parole adressée et le toucher conscient construisent le lien.
- **Psychologie périnatale** (Bernard Golse, école française) — le bébé a une vie psychique précoce. L'émotion est déjà un mode de communication.
- **Audition fœtale et voix maternelle** (Marie-Claire Busnel) — le nouveau-né préfère la voix maternelle entendue in utero. Reconnexion sonore validée scientifiquement.
- **Constellations familiales** (approche systémique, méthode développée à partir des années 1980) — un enfant peut porter inconsciemment des charges qui ne lui appartiennent pas (deuils non faits, fausses couches précédentes, secrets de famille). Les nommer libère.
- **Communication consciente / Parole au bébé** (approches contemporaines) — adresser des mots clairs et bienveillants au bébé, même pré-verbal, est un acte de reconnaissance qui apaise.
- **Mémoire prénatale** — recherches contemporaines sur la sensibilité fœtale à l'atmosphère émotionnelle maternelle dès le 2e trimestre.

### Thématiques à explorer par tranche d'âge

Les thèmes évoluent avec l'âge — ce que le bébé "a besoin d'entendre" change.

| Trimestre | Mois | Thèmes prioritaires |
|-----------|------|---------------------|
| T1 | M0-M2 | Conception · Grossesse · Naissance · Angoisses prénatales · Fausses couches antérieures · Première rencontre |
| T2 | M3-M5 | Reconnaissance de l'enfant tel qu'il est · Lien d'attachement · Permission de grandir · Réparation des premiers moments difficiles |
| T3 | M6-M8 | Diversification émotionnelle · Permission de l'autonomie naissante · Lien avec le co-parent · Place dans la fratrie |
| T4 | M9-M11 | Permission de la séparation · Sécurité de base · Confiance dans le retour · Histoire familiale élargie |
| T5 | M12-M14 | Transformation parent-enfant · Fierté · Libération des charges transgénérationnelles · Reconnaissance mutuelle |
| T6 | M15-M17 | Permission du "non" · Identité naissante · Place dans la famille élargie · Reconnaissance des émotions complexes |
| T7 | M18-M20 | Permission de l'opposition · Reconnaissance du désir propre · Préparation aux séparations à venir · Histoire de couple parental |
| T8 | M21-M23 | Permission de l'imagination · Reconnaissance du monde intérieur · Continuité de l'amour malgré l'opposition |
| T9 | M24 | Bilan symbolique · Permission de devenir enfant (et plus seulement bébé) · Continuité de la sécurité |

**Règle : un trimestre = 3 scripts.** Le parent les fait sur 3 mois, à son rythme. Chaque script peut être réécouté plusieurs fois.

### Structure JSON

```json
{
  "trimestre": "T1 — Mois 0 à 2",
  "intention_pedagogique": "Accueillir les émotions inconscientes du tout-petit autour de la conception, la grossesse et la naissance. Libérer ce qui doit l'être pour créer de l'apaisement.",
  "comment_utiliser": ["...", "...", "..."],
  "scripts": [
    {
      "id": "...",
      "titre": "...",
      "duree_estimee": "~6 minutes",
      "contexte_ideal": "...",
      "theme": "Conception · Grossesse",
      "champ_inspiration": "Haptonomie, mémoire prénatale",
      "couleur": "#EEEDFE",
      "couleur_texte": "#3C3489",
      "intention": "Permettre au bébé d'entendre l'histoire de sa venue, avec ses joies et ses incertitudes",
      "preparation_parent": "Lire seul une première fois. Identifier les passages qui te touchent. C'est normal d'être ému(e).",
      "texte": "..."
    }
  ]
}
```

### Règles de rédaction des scripts

- **Personnalisation par `[prénom]`** dans le texte — l'app remplace en runtime
- **Pauses structurées** : `[pause - 5 secondes]` ou `[pause - 10 secondes]` aux moments où le parent doit laisser remonter l'émotion
- **Voix grave et lente** indiquée dans `comment_utiliser`
- **Durée** : entre 5 et 9 minutes (audio entre 6 et 11 min après lecture lente)
- **Toujours terminer par une libération** : le script ne laisse jamais l'auditeur dans la tension. Toujours une phrase de paix, d'apaisement, de continuité.
- **Jamais de jugement** : ni sur le parent, ni sur ce qui s'est passé. La parole accueille, elle ne juge pas.

### Droits d'auteur — IMPORTANT

- **Aucune citation verbatim** d'auteurs (Veldman, Golse, Hellinger, Busnel, etc.) — uniquement inspiration des concepts
- **Aucune reprise de scripts existants** de praticiens (haptonomes, constellateurs, sophrologues)
- **Formulations entièrement originales** dans le ton du projet
- Si un script s'inspire d'un concept identifiable (ex : constellations familiales), le mentionner dans le champ `champ_inspiration` comme reconnaissance intellectuelle — mais ne jamais reproduire de phrasés propres à ces praticiens

### Récurrence trimestrielle

Les **mêmes 3 scripts sont proposés pendant 3 mois consécutifs** (T1 = M0-M2 = scripts identiques pendant ces 3 mois). Cela permet au parent d'avoir le temps de :
- Lire seul une première fois
- Préparer le contexte (calme, moment, intention)
- Faire le script une fois, plusieurs fois si besoin
- Revenir dessus quand le moment est juste

Quand l'enfant passe au trimestre suivant, l'app propose les 3 nouveaux scripts adaptés à l'âge.

### ⚠️ RÈGLE D'UNICITÉ ABSOLUE — CHAQUE SCRIPT, CHAQUE MOIS DOIT ÊTRE DIFFÉRENT

**Aucun thème ne peut être utilisé deux fois sur les 27 scripts du parcours complet** (9 trimestres × 3 scripts).

C'est le module le plus exposé au risque de redite, parce que les approches inspiratrices (haptonomie, constellations, parole au bébé) ont un nombre fini de thèmes naturels. Pour éviter ce piège :

**Procédure obligatoire avant de rédiger un nouveau script :**

1. **Ouvrir `CONTENT_INDEX.md`** et lire la table "Scripts audio déjà produits" (§ Scripts audio — table d'unicité)
2. **Vérifier les thèmes déjà couverts** dans les trimestres voisins (T-1 et T+1 surtout)
3. **Identifier un angle nouveau** propre au moment développemental
4. **Inscrire le nouveau thème dans le CONTENT_INDEX** une fois validé

**Critères de différenciation entre deux scripts :**

Deux scripts ne sont **PAS** différents si :
- Ils traitent du même sujet de fond (ex : deux scripts sur la transmission transgénérationnelle)
- Ils utilisent les mêmes formulations rituelles (ex : "Tu n'as pas à porter...")
- Ils s'inspirent du même champ théorique exclusivement (ex : deux scripts purement "constellations familiales")
- Ils visent le même mouvement émotionnel (ex : deux scripts "libération de la charge")

Deux scripts **SONT** différents si :
- Le sujet est ancré dans un moment développemental spécifique de l'enfant
- Le mouvement émotionnel visé est distinct (accueil, libération, reconnaissance, permission, célébration, transmission positive, etc.)
- Les formulations centrales sont entièrement originales (pas seulement reformulées)
- L'angle (du point de vue du parent ? du bébé ? d'un tiers symbolique ?) est différent

**Si un thème semble proche d'un script déjà produit** : changer d'angle, changer de mouvement émotionnel, OU choisir un autre thème de la liste des thématiques par tranche d'âge.

### Cartographie des 27 mouvements émotionnels (palette à puiser)

Pour aider à diversifier, voici 27 mouvements émotionnels distincts — un par script possible. À utiliser chacun **une seule fois** sur les 9 trimestres :

| # | Mouvement émotionnel | Verbe central |
|---|---------------------|---------------|
| 1 | Accueillir l'arrivée | "Bienvenue" |
| 2 | Reconnaître la difficulté de la naissance | "C'est passé" |
| 3 | Libérer des charges transgénérationnelles | "Tu peux déposer" |
| 4 | Nommer le désir d'enfant | "Tu étais attendu(e)" |
| 5 | Apaiser la mémoire prénatale | "Tu peux te détendre" |
| 6 | Reconnaître l'enfant tel qu'il est | "Je te vois" |
| 7 | Permettre le lien d'attachement sécure | "Je reviendrai toujours" |
| 8 | Réparer un début difficile | "On recommence ici" |
| 9 | Permettre la séparation progressive | "Tu peux t'éloigner" |
| 10 | Donner sa place dans la famille | "Tu es à ta place" |
| 11 | Reconnaître les émotions complexes naissantes | "Tu as le droit" |
| 12 | Soutenir l'autonomie naissante | "Tu peux essayer" |
| 13 | Célébrer la transformation parent-enfant | "On a changé tous les deux" |
| 14 | Reconnaître la force unique de l'enfant | "Tu es fort(e) à ta façon" |
| 15 | Permettre l'affirmation de soi | "Tu peux dire non" |
| 16 | Reconnaître la sensibilité particulière | "Tu sens tout, c'est ok" |
| 17 | Donner permission au désir propre | "Ce que tu veux compte" |
| 18 | Inscrire l'amour inconditionnel | "Mon amour ne dépend pas de" |
| 19 | Reconnaître le rythme propre | "Tu prends ton temps" |
| 20 | Permettre l'imaginaire | "Tu peux inventer" |
| 21 | Reconnaître la place dans la fratrie ou groupe | "Tu as ton rang" |
| 22 | Célébrer la tendresse reçue | "Tu donnes aussi" |
| 23 | Permettre l'opposition saine | "Notre lien tient" |
| 24 | Reconnaître la pré-conscience de soi | "Tu deviens toi" |
| 25 | Inscrire la sécurité de base | "Tu es en sécurité" |
| 26 | Reconnaître la continuité de la présence | "Je serai là" |
| 27 | Célébrer la fin du bébé / début de l'enfant | "Tu grandis" |

Cette palette est **indicative et ajustable** — la fondatrice peut faire évoluer la liste mois par mois. L'essentiel est que **chaque script du parcours mobilise un mouvement émotionnel distinct**.

### 4.6 `06_jeux.json` — Jeux & stimulation

**Structure validée :** 4 jeux + adjectif du mois.

```json
{
  "sous_titre": "Mois 14 — Le mois de l'Explorateur",
  "adjectif_du_mois": "Explorateur",
  "qualification_du_mois": "À 14 mois, ton enfant marche... C'est le mois de l'exploration active.",
  "principes_cles": ["...", "...", "..."],  // 3 max
  "activites": [
    {
      "id": "...",
      "numero": 1,
      "titre": "...",
      "duree": "...",
      "frequence": "...",
      "developpe": ["...", "..."],  // 3-4 compétences max
      "materiel": ["...", "..."],
      "description": "...",
      "comment_jouer": ["...", "..."]  // 4-5 étapes max
    }
  ],  // EXACTEMENT 4 activités
  "geste_reflexo_du_mois": {...},
  "rythme_journee_type": {...}
}
```

**Règles :**
- **Exactement 4 activités** — pas 6, pas 3. Garder des idées en réserve pour les mois suivants.
- **Diversifier les compétences** travaillées : 1 motricité fine, 1 motricité globale, 1 émotionnel/sensoriel, 1 cognitif/Montessori (ou variante mois par mois)
- Pas de section "ce qui n'est pas recommandé" — c'est jugeant pour les parents
- Le `geste_reflexo_du_mois` est court (2-3 min) — un mini-rituel facile à intégrer
- Le `rythme_journee_type` est un repère, pas un protocole rigide

---

## 5. Ton éditorial transverse

**Tutoiement du parent** systématique.

**L'enfant nommé "ton enfant"** dans le JSON (le prénom est inséré en runtime par l'app).

**Pas de jugement comportemental :**
- ✅ "Les écrans dans l'heure avant le coucher inhibent la mélatonine" (information factuelle)
- ❌ "Ne le distrais pas avec un écran pour avoir la paix" (jugement)

**Précautions médicales : oui, toujours.**
- Critères objectifs uniquement (fièvre > 39°C, refus de boire 12h, tirage respiratoire)
- Pas de "consultez si vous vous inquiétez" — toujours un critère mesurable
- Numéros utiles : 15 (SAMU), 3114 (prévention suicide), Allo Parents Bébé

**Neurosciences légères :**
- Cortex préfrontal, cortisol/mélatonine, neurones miroirs, cervelet
- Toujours expliqué simplement, jamais en jargon
- Références : Pikler (motricité libre), Bowlby/Ainsworth (attachement), Montessori (Montessori uniquement comme inspiration, jamais comme dogme)

**Pression réflexo :**
- M0 à M12 : "0/10 — c'est une caresse, pas un massage"
- M12 à M24 : "0/10 — c'est une caresse" (même prudence)

**Précautions absolues :**
- Pas d'huiles essentielles avant 3 ans
- Pas de paracétamol sans dose pédiatrique vérifiée par un médecin
- Pas d'anesthésiant lidocaïne (gel dentaire) avant 2 ans
- Jamais de collier d'ambre (risque d'étouffement + inefficacité prouvée)

---

## 6. Workflow de production d'un nouveau mois

1. **Définir l'adjectif du mois** (consulter la table § 2, ajuster si besoin)
2. **Lire `CONTENT_INDEX.md`** pour voir ce qui a déjà été dit dans les mois proches (éviter les redites)
3. **Lire `SKILL_protocole.md`** avant de produire `01_protocoles.json`
4. **Produire les 6 fichiers** dans l'ordre, en respectant les structures du § 4
5. **Mettre à jour `CONTENT_INDEX.md`** avec un résumé du mois produit
6. **Valider** les JSON avec un parseur Python avant livraison

---

## 7. Volumes cibles (indicatifs)

| Fichier | Taille cible | Note |
|---------|--------------|------|
| `01_protocoles.json` | 100-120 Ko | Le plus dense — 32 protocoles complets |
| `02_coucher.json` | 5-8 Ko | Concis |
| `03_prendre_soin_de_moi.json` | 8-12 Ko | Le post-partum est plus dense en M0-M6 |
| `04_saison.json` | 15-20 Ko | 4 variantes — peut grimper à 25 Ko pour M0 |
| `05_partager_rassurer.json` | 7-10 Ko | 3 scripts complets |
| `06_jeux.json` | 5-8 Ko | 4 activités — pas plus |
| **Total par mois** | **140-180 Ko** | Pour 24 mois ≈ 3,3 à 4,3 Mo de JSON |

Si un fichier dépasse 25% au-dessus de sa cible, le rapport est probablement trop dense — alléger.

# SKILL_rubriques.md — Structure éditoriale des 6 rubriques par mois

> Lire ce fichier AVANT de générer le contenu d'un nouveau mois.
> Ce skill définit la structure JSON, le ton, les conventions transverses, et la convention de l'adjectif du mois.

---

## 1. Vue d'ensemble

Chaque mois (de 0 à 23, soit 24 mois de contenu) contient **6 fichiers JSON** dans un dossier `mois{XX}/` :

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

### Table des adjectifs proposés pour les 24 mois (M0 à M23)

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
| 23 | L'Aventurier | Course, sauts, escalade, confiance corporelle, pré-conscience de soi qui émerge |

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
  "signaux_de_fatigue": ["...", "..."],   // 4-5 max, SANS amorce
  "rituel_etapes": [...],  // 6 étapes chronologiques (varie selon le mois)
  "reflexologie_du_coucher": {            // ABSENTE en M0 (pas de réflexo sur un nouveau-né)
    "titre": "...",
    "duree_totale": "6-7 minutes",
    "pression": "0/10",
    "consentement": "...",
    "etapes": [...]  // 6 zones réflexo
  },
  "script_audio_du_soir": {
    "titre": "Berceuse-rituel « ... »",
    "duree": "~4 minutes",
    "instruction": "...",
    "texte": "..."  // ouverture [prénom], mots de l'enfant genrés [m/f], AUCUN marqueur de pause, refrain de clôture partagé
  },
  "co_parent": {...},                     // optionnel
  "cadre_de_securite": {...}              // M0–M3 UNIQUEMENT — titre + intro + regles[] (amorce en gras)
  "erreurs_a_eviter": ["...", "...", "..."]  // 3 erreurs ciblées max (dont les écrans)
}
```
> ⚠️ **Plus de champ `horaire` ni de clé `consulter_si`** dans les fichiers coucher (voir règles transversales ci-dessous). Les étapes `rituel_etapes` ne portent plus que `etape` / `titre` / `description` (ni `duree`, ni `horaire`). Idem pour les variantes du sélecteur (`variantes_developpementales.themes[].etape_rituel` = `titre` + `description` seulement).
> ⚠️ **Plus de champ racine `duree_eveil_max`** : l'information sur la durée d'éveil maximale figure déjà dans les `reperes_cles`, on ne la duplique pas.

**Règles :**
- Pas d'ancrage en tête (redondant avec le contenu)
- 3 erreurs max — toujours inclure une référence aux écrans (lumière bleue / mélatonine)
- Le script audio est l'élément le plus important — soigner la qualité littéraire
- **Pas de capitales d'emphase dans la prose** (pas de « AUCUN », « JAMAIS », « AVANT »… en majuscules). L'emphase passe par l'amorce en gras, pas par le cri typographique. Seuls les acronymes restent en capitales (MIN, ORL, PMI, 15…).

#### Sécurité du sommeil (MIN) — règle transversale ⭐
- La **prévention du couchage sécurisé est portée par le bloc `cadre_de_securite`**, présent **uniquement en M0–M3** (période de risque maximal de mort inattendue du nourrisson). C'est là, et seulement là, qu'on déroule les règles complètes (dos, lit nu et ferme, chambre partagée, 18-20°C, sans tabac, tétine/allaitement).
- **À partir de M4, on n'empile plus les rappels MIN** dans le rituel ni ailleurs. Bébé se retourne et se dégage de plus en plus seul, et le message a déjà été posé. Une mention courte et apaisée suffit (« le lit reste simple et sûr — matelas ferme, gigoteuse adaptée ») — sans énumération négative, sans « recommandations MIN », sans dramatiser.
- **Ne pas se prononcer sur les tours de lit / cale-bébé après M3** : ni les recommander, ni les proscrire. Le silence est le ton juste — certains parents les utilisent pour un bébé très mobile, ce n'est pas le lieu d'en faire un point d'attention.
- Côté rendu : en **M0–M3**, le bloc `cadre_de_securite` prend le **design rouge des protocoles Guide-moi** (cadre fermé `1px #D4604A`) — voir `CONSIGNES_CLAUDE_CODE_coucher.md`.

#### Règles transversales du rituel ⭐ (à appliquer à TOUS les mois)
1. **Ni heure ni durée dans les étapes du rituel.** Aucun horaire (« 19h45 ») ni durée (« 10 min », « 30-60 min ») dans `rituel_etapes` ni dans les `etape_rituel` du sélecteur : c'est au parent d'adapter à son organisation. Le créneau indicatif (≈ 19h-20h) est donné une seule fois, dans les `reperes_cles`. Les champs `horaire` et `duree` n'existent plus dans les étapes.
2. **L'explication « lumière bleue / mélatonine » ne va QUE dans `erreurs_a_eviter`.** Dans l'étape « Baisser l'ambiance », on garde uniquement l'action (« couper les écrans et la musique vive »), jamais le mécanisme — pas de répétition entre catégories.
3. **Étape « repas » obligatoire à partir de M5** (début de la diversification). Une étape de repas du soir clairement identifiée doit figurer dans le rituel de chaque mois ≥ M5, adaptée à l'âge (diversification puis lait au début ; vrai dîner en famille chez le tout-petit). Le lait du soir, s'il subsiste, vient avant le brossage des dents.
4. **Une seule histoire** (ou un nombre défini à l'avance), jamais « des histoires » en open bar. La répétition de la même histoire sur 2-3 semaines est un atout d'ancrage à rappeler.
5. **Plus de bloc `consulter_si` dans le coucher.** Cette information vit dans la rubrique Guide-moi (sommeil), où elle a davantage sa place. La sécurité du premier trimestre reste portée par `cadre_de_securite` (M0–M3).
6. **Pas de répétition entre catégories.** Chaque information à sa place : la sécurité du lit est dans les `reperes_cles` (ou le bloc dédié quand il existe), pas re-développée dans la phrase de clôture ; le mécanisme des écrans est dans les erreurs, pas dans le rituel ; etc. Vérifier systématiquement avant production.
7. **Un seul mot pour le sac de couchage** : « gigoteuse » (par défaut). Ne pas proposer « gigoteuse ou turbulette » — les parents comprennent. Peu importe que le mot varie d'un mois à l'autre, mais jamais les deux ensemble.
8. **Genre — vérification systématique** dans :
   - la **berceuse** : tout mot qualifiant l'enfant (« tu ») est crocheté masculin/féminin, y compris les déterminants et superlatifs accordés — `[Quel aventurier/Quelle aventurière]`, `[le plus intrépide des aventuriers/la plus intrépide des aventurières]`, `[tout seul/toute seule]`, `[grand/grande]`, `[aimé/aimée]`. Les mots qualifiant le parent lecteur sont neutralisés.
   - les **boutons du sélecteur** (`variantes_developpementales.themes[].sous_titre`) : forme `[Il…/Elle…]` avec accord complet des deux côtés (« [Il veut tout faire seul…/Elle veut tout faire seule…] » — ne pas oublier le féminin).
9. **Bain ou toilette — alléger dès M8.** Ne plus indiquer la **température du bain** (« eau à 37°C ») ni les rappels d'ambiance redondants (« lumière tamisée, voix grave et lente ») à partir de M8. Ces consignes, répétées mois après mois, font décrocher le lecteur ; on garde la place pour le conseil adapté à l'âge (sécurité antidérapante, participation de l'enfant, etc.). M0–M7 peuvent conserver la température (nourrisson).
10. **Massage + réflexologie AVANT le pyjama, regroupés dans une même étape** (« Massage, réflexologie, puis pyjama »). En sortie de bain, enfant encore dévêtu mais **au chaud** (une zone à la fois). **Le parent choisit** ce soir-là le massage, la réflexologie, ou les deux, selon la réceptivité de l'enfant **et sa propre fatigue**. **Aucun indicatif de temps de réflexologie** (« 7 min ») dans le rituel, à aucun mois (le détail des durées par zone reste dans le bloc `reflexologie_du_coucher`). Le pyjama vient **après** (logique de l'huile). M4/M5 : l'étape massage/réflexo peut rester distincte de l'étape pyjama qui la suit.
11. **Lait du soir AVANT l'histoire** (à partir de M12), dans le calme de la chambre, suivi du brossage des dents (le brossage est mentionné dès M12) — puis l'histoire, bouche propre, ferme la soirée. Formulation du lait : « au dessert du repas du soir, **ou à cet instant dans le rituel du soir** » (ne plus écrire « dernier temps »). **Supprimer** la phrase de rappel « Ensuite, un brossage… puis le coucher » (redondante).
12. **Histoire — nuance du cadre dès M13** : « Une seule histoire **(ou bien un nombre prédéfini et annoncé à l'enfant, pour tenir le cadre)**, lue lentement… ».
13. **Pas de paragraphe « sécuriser le lit » ni « tenir le cadre ».** On ne développe pas la sécurité du lit dans le coucher (elle vit ailleurs) : à partir de M18, **juste évoquer** « envisager le passage à un lit au sol » dans la `description` d'ouverture, sans développer. Le sous-bloc `tenir_le_cadre` des blocs thématiques mensuels est supprimé.
14. **Plus de bloc thématique d'âge en fin de page.** Le paragraphe lié à l'âge de l'enfant (ex. `regression_4_mois`, `poussee_angoisse_8_mois`, `opposition_au_coucher`, `l_explorateur_infatigable`…) **n'est plus une clé séparée en bas de page** : son contenu est **fusionné en tête, dans la `description` « Ce qui se passe »**. Un seul paragraphe d'ouverture, plus dense, bien ordonné (phénomène développemental nommé → ce qui se passe → conséquence au coucher → recadrage « pas un caprice / une régression » → quoi faire → pourquoi le rituel ancre), **sans redondance interne**. ⚠️ Ne pas confondre avec le bloc `co_parent` (M0-M11), qui reste une section distincte à conserver.

#### Sous-titre du mois (`sous_titre`) ⭐
- **Sous-titre UNIFORME sur tous les mois** : `"Un esprit, un corps, et un cœur apaisé"`. Identique de M0 à M23 — il signe la rubrique Coucher.
- Ne jamais écrire le numéro du mois ni un générique type « Crée ton rituel adapté » / « Rituel & réflexologie du soir ».

### 4.3 `03_prendre_soin_de_moi.json` — Prendre soin de moi

**Principe fondateur : un thème psycho-émotionnel par mois.**

Chaque mois de la rubrique « Prendre soin de moi » est organisé autour d'**un thème unique** qui sert de fil rouge aux 5 conseils du mois. Les conseils ne sont plus des éléments juxtaposés : ils convergent tous vers le même travail intérieur, en l'incarnant chacun à leur manière (corps, mental, écriture, post-partum, couple).

Le parent vit ainsi un seul sujet à la fois, en profondeur, et l'app entière l'accompagne dans ce travail-là.

### Arc des 24 thèmes (M0 à M23)

| Mois | Thème | Logique psychologique |
|------|-------|----------------------|
| M0 | **Habiter ton corps qui vient d'accomplir l'immense** | Le corps vient d'accomplir l'immense. Revenir physiquement dans ce corps-là. |
| M1 | **Oser demander, comme une compétence parentale** | L'entourage se retire. Réclamer activement plutôt que recevoir, sans honte. |
| M2 | **Trouver ta place face au travail (ou en dehors)** | Reprise effective fin M2 / début M3. Anticipation utile (englobe la non-reprise). |
| M3 | **Te donner les moyens de tenir, sans tenir seule** | Pic clinique de la DPP. Sortir du fantasme du « ça va s'arranger vite ». |
| M4 | **Aimer ce nouveau corps, celui d'aujourd'hui** | L'urgence retombe, la comparaison remonte. Travail de réconciliation. |
| M5 | **Offrir du positif à ton cerveau** | Biais de négativité installé. Réentraîner le mental à voir ce qui va. |
| M6 | **Accueillir la nouvelle personne que tu es devenue** | Mi-parcours. Deuil du soi d'avant, accueil du soi d'après. |
| M7 | **Choisir la bienveillance envers toi-même** | Bébé devient mobile, champ des « j'aurais dû » qui s'élargit. Désamorçage de la culpabilité. |
| M8 | **Réinventer ton couple, version parents** | Zone basse statistique du couple. Refondation possible, pas retour à « avant ». |
| M9 | **Alléger ta charge mentale, retrouver ta clarté** | Brouillard cognitif du post-partum tardif, souvent ignoré. |
| M10 | **Rallumer ce qui te fait vibrer** | Désir (sexuel, créatif, professionnel) qui revient ou pas. Faire le tri. |
| M11 | **Lâcher prise, faire confiance à la vie** | L'enfant marche bientôt, l'illusion de contrôle vacille. |
| M12 | **Célébrer une année de transformation** | Premier anniversaire. Bilan symbolique, sans minimiser ni dramatiser. |
| M13 | **Être le parent que toi seule peux être** | « Moins que », « plus que ». Désengagement de la comparaison sociale. |
| M14 | **Te retrouver, comme personne à part entière** | L'enfant explore. Reprise d'un espace intérieur propre. |
| M15 | **Poser tes limites avec sérénité** | Opposition naissante. Dire non à l'enfant, mais aussi aux autres. |
| M16 | **Accueillir l'imperfection comme un cadeau** | « Moi tout seul ». Accepter que ni l'un ni l'autre ne soit parfait. |
| M17 | **T'aimer, pour mieux aimer ton enfant** | Empathie naissante. L'enfant imite le rapport du parent à lui-même. |
| M18 | **Écouter ce dont tu as vraiment besoin** | Premières phrases. Le parent réapprend à nommer ses besoins. |
| M19 | **Inventer un rythme qui te respecte aussi** | Routines intégrées. Réinscrire ses propres rythmes dans la journée. |
| M20 | **Réveiller ton imagination, ton monde intérieur** | Faire-semblant chez l'enfant. Réactiver sa créativité étouffée. |
| M21 | **Te montrer telle que tu es, avec confiance** | Jeux parallèles. Exposition accrue au regard extérieur. |
| M22 | **T'autoriser à recevoir la tendresse** | Câlins spontanés. Apprendre à recevoir sans renvoyer. |
| M23 | **Faire confiance à ton enfant, faire confiance à toi** | L'enfant grimpe, court, ose. Confiance mutuelle qui s'installe. |

**Arc général :**
- **M0–M5** : survie physique et émotionnelle
- **M6–M11** : reconfiguration identitaire
- **M12–M17** : réémergence
- **M18–M23** : projection et ouverture

**Règle d'unicité :** chaque thème n'est utilisé qu'une seule fois sur les 24 mois. La table figure également dans `CONTENT_INDEX.md` comme table d'unicité.

### Hiérarchie visuelle (UI) et structure des champs

La rubrique « Prendre soin de moi » a une **double mise en scène du thème** : la maman comprend la stratégie du mois dès l'entrée dans la rubrique, puis la retrouve à chaque sous-catégorie. Cette double mise en scène est portée par **deux champs sémantiques distincts** dans le JSON :

- **`nom_outil`** = nom canonique du type de conseil (ex. *« Auto-massage de réflexologie »*)
- **`promesse`** = phrase qui incarne le travail du mois sur ce support (ex. *« Décharger la tension de tout porter, à mains nues »*)

L'UI choisit lequel afficher en grand selon l'écran. Pas d'inversion logique à gérer, juste deux champs explicites.

#### Logique d'affichage selon l'écran

| Écran | En grand (titre principal) | En petit (sous-titre / étiquette) |
|-------|----------------------------|-----------------------------------|
| **En-tête de la rubrique** (page d'accueil « Prendre soin de moi ») | `promesse_du_mois` (= phrase du thème) | `nom_rubrique` (= « Prendre soin de moi ») |
| **Liste des conseils** (cartes sur la page d'accueil de la rubrique) | `nom_outil` de chaque conseil | `promesse` de chaque conseil (en chapô court) |
| **Détail d'un conseil** (quand on a cliqué) | `promesse` du conseil | `nom_outil` du conseil |

**Pourquoi cette double mise en scène :**
- Sur la page d'accueil, la maman doit pouvoir **repérer rapidement les outils** qu'elle veut utiliser (massage, méditation, etc.). Le nom de l'outil reste l'élément le plus reconnaissable visuellement.
- En entrant dans un conseil, la maman doit **se reconnecter au thème** du mois. C'est la promesse qui devient titre, l'outil ne fait que la servir.
- En haut de la rubrique, c'est la **promesse du mois** qui est mise en avant (et non « Prendre soin de moi »), pour que la maman comprenne immédiatement la stratégie psycho-émotionnelle du mois.

#### Convention de nommage des champs

Au niveau **racine** du fichier :

| Champ | Valeur | Rôle |
|-------|--------|------|
| **`nom_rubrique`** | « Prendre soin de moi » | Nom canonique de la rubrique, affiché en petit en en-tête |
| **`promesse_du_mois`** | Phrase du thème (ex. *« Oser demander, comme une compétence parentale »*) | Promesse affichée en grand en en-tête |
| **`theme_du_mois`** | Même valeur que `promesse_du_mois` | Redondance volontaire pour les traitements analytiques et tables d'unicité |
| **`intention_du_mois`** | 2-3 phrases | Chapô qui pose le travail intérieur visé |

Au niveau de **chaque conseil** :

| Champ | Valeur | Rôle |
|-------|--------|------|
| **`nom_outil`** | Étiquette standardisée (« Auto-massage de réflexologie », « Méditation audio », « Auto-reconnaissance », « La réalité du post-partum », « Challenge couple ») | Affiché en grand sur la page liste, en petit sur la page détail |
| **`promesse`** | Phrase qui incarne le travail du mois sur ce support | Affichée en petit (chapô) sur la page liste, en grand sur la page détail |

#### Implications pour la rédaction

- Le **`promesse_du_mois`** (et son miroir `theme_du_mois`) doivent être travaillés comme un **titre de couverture de magazine** : court, incarné, à l'action ou au positif. Verbes d'action de préférence, ton qui donne envie d'ouvrir.
- L'**`intention_du_mois`** doit être travaillée comme un **chapô** : 2-3 phrases qui posent ce qui se joue et ce que la maman va y trouver.
- La **`promesse` de chaque conseil** doit être travaillée comme un **titre d'article** : suffisamment riche pour porter seule une promesse claire, et suffisamment liée au thème pour qu'on sente le fil rouge. Lisible et accrocheuse aussi bien en petit (chapô sur la page liste) qu'en grand (titre principal sur la page détail).
- Le **`nom_outil`** reste **strictement standardisé** d'un mois à l'autre. Il y a exactement 5 valeurs possibles, jamais d'autres. C'est le repère visuel stable de la rubrique.

#### Exception pour le challenge couple : impératif pluriel « -ez » autorisé

Le challenge couple est le **seul conseil qui s'adresse au couple** (les autres s'adressent à la maman seule). Pour cette raison, sa `promesse` peut adopter un ton d'**invitation directe à l'impératif pluriel** : *« Tirez une carte : demandez sans honte »*, *« Dessinez vos 3 prochains mois ensemble »*, *« Posez une main, en silence, 1 minute »*.

Cette tournure n'est **pas obligatoire**. Selon l'effet recherché, la `promesse` peut aussi prendre une forme nominale ou évocatrice (*« Le dessin partagé : imaginer les 3 prochains mois »*). Le rédacteur choisit au cas par cas.

#### Règles d'écriture pour le `promesse_du_mois`

- **Mode action ou positif** : commencer par un verbe d'action (« Habiter », « Oser », « Accueillir », « Choisir ») ou évoquer un état positif vers lequel on va.
- **Pas de formulation centrée sur le problème** : éviter « Sortir de… », « Tenir dans… », « Lutter contre… » sauf quand l'action est elle-même un mouvement positif (« Lâcher prise »).
- **Tutoiement intégré** quand pertinent (« ton corps », « toi-même »).
- **Pas d'écriture inclusive typographique** (voir SKILL_contenu.md). Féminin assumé puisque la rubrique s'adresse aux mamans.
- **Longueur** : 4 à 10 mots idéalement, pour rester lisible en grand.

### Structure JSON

```json
{
  "mois": 0,
  "tranche_age": "...",
  "rubrique": "prendre_soin_de_moi",
  "nom_rubrique": "Prendre soin de moi",     // nom canonique — affiché en petit en en-tête
  "promesse_du_mois": "...",                 // phrase du thème — affichée en grand en en-tête
  "theme_du_mois": "...",                    // même valeur que promesse_du_mois (redondance pour traitements analytiques)
  "intention_du_mois": "...",                // 2-3 phrases qui explicitent le travail intérieur visé
  "description": "...",
  "conseils": [
    {
      "id": "auto_massage_reflexologie",
      "numero": 1,
      "icone": "🤲",
      "nom_outil": "Auto-massage de réflexologie",  // étiquette standardisée — affichée en grand sur la liste, en petit sur le détail
      "promesse": "...",                            // phrase qui incarne le travail du mois — affichée en petit sur la liste, en grand sur le détail
      "intro": "...",
      ...
    },
    ...
  ]
}
```

**Notes structurelles :**
- **Le `nom_rubrique` vaut toujours « Prendre soin de moi »** (le nom canonique de la rubrique).
- **Le `promesse_du_mois` porte la phrase du thème** (ex. *« Oser demander, comme une compétence parentale »*).
- **Le `theme_du_mois` reprend la même valeur que `promesse_du_mois`** (redondance volontaire pour les traitements analytiques et tables d'unicité).
- **Le `nom_outil` reste strictement standardisé** d'un mois à l'autre : il y a exactement 5 valeurs possibles (Auto-massage de réflexologie, Méditation audio, Auto-reconnaissance, La réalité du post-partum, Challenge couple).
- **La `promesse` d'un conseil porte la phrase qui incarne le travail du mois** sur ce support. Elle doit être travaillée comme un titre d'article : suffisamment riche pour porter seule, suffisamment liée au thème pour qu'on sente le fil rouge.
- **Pas de `frequence_conseillee` nulle part** — la cadence imposée induit une charge mentale supplémentaire pour le parent. **Exception unique : l'auto-massage** peut conserver des durées précises par geste (60 sec sur ce point, 30 sec sur l'autre), parce que c'est une mécanique de pratique, pas une cadence dans la semaine.
- **`promesse_du_mois`** et **`intention_du_mois`** sont les deux clés structurantes qui orientent tout le contenu du mois.

### Les 5 conseils — structure stable, contenu aligné sur le thème

La rubrique est composée de **5 conseils** (et non 6). L'ancienne section « Célébrer les petites victoires » a été supprimée : la dynamique de reconnaissance est désormais portée par l'auto-reconnaissance, dont le format est plus engageant.

L'ordre est stable mois par mois. Chaque conseil incarne le thème à sa manière propre.

| # | Type de conseil | Rôle dans le thème |
|---|-----------------|---------------------|
| 1 | Auto-massage de réflexologie | Le thème **dans le corps** (mains, points réflexes) |
| 2 | Méditation audio | Le thème **dans l'esprit** (visualisation, parole intérieure) |
| 3 | Auto-reconnaissance | Le thème **dans l'écriture** (format variable mois par mois) |
| 4 | Réalité du post-partum | Le thème **dans la réalité physiologique et psychique** (maman + papa/co-parent) |
| 5 | Challenge couple | Le thème **dans le lien à deux** (mini-jeu hebdomadaire) |

#### Conseil 1 — Auto-massage de réflexologie

**Format :** 4 points sur les mains, accessibles partout (pendant une tétée ou un biberon, dans les transports, au bureau).

**Choix des 4 points :** doivent être alignés sur le thème (ex. thème « brouillard mental » → hypophyse, thyroïde, foie, reins ; thème « lâcher prise » → plexus solaire, diaphragme, nerf vague, épaules).

**Timing autorisé sur ce conseil uniquement.** Indiquer la durée précise de chaque geste (60 sec, 45 sec, 30 sec). C'est une mécanique de pratique, pas une cadence imposée dans la semaine.

**Structure JSON :**
```json
{
  "id": "auto_massage_reflexologie",
  "numero": 1,
  "icone": "🤲",
  "nom_outil": "Auto-massage de réflexologie",  // étiquette standardisée
  "promesse": "...",                            // phrase qui incarne le geste sur le thème du mois
  "intro": "...",            // 3-4 phrases qui relient le geste au thème du mois
  "duree": "5 minutes",
  "indications": ["...", "..."],   // 4-5 ressentis ciblés par les points choisis
  "points": [
    { "zone": "...", "geste": "...", "effet": "..." },
    ...   // 4 points
  ],
  "cloture": "..."           // 1-2 phrases pour clore le rituel (chaleur, ancrage)
}
```

#### Conseil 2 — Méditation audio — GRAMMAIRE DÉTAILLÉE

##### Principe : la voix dit « je »

Les méditations sont écrites à la **première personne du singulier**, et non plus à la deuxième. C'est le parent qui énonce intérieurement sa propre expérience, comme s'il (re)prenait possession de la parole.

Cette grammaire est inspirée du **training autogène de Schultz**, des pratiques d'auto-compassion de Kristin Neff, et de l'hypnose ericksonienne — où le sujet n'est pas guidé de l'extérieur mais énonce de l'intérieur.

| Grammaire « tu » (à NE PAS utiliser) | Grammaire « je » (à utiliser) |
|--------------------------------------|-------------------------------|
| « Pose une main sur ton ventre » | « Je pose une main sur mon ventre » |
| « Ton corps a fait quelque chose d'immense » | « Mon corps a fait quelque chose d'immense » |
| « Tu peux te détendre » | « Je peux me détendre » |
| « Respire lentement » | « Je respire lentement » |
| « Tes épaules portent beaucoup » | « Mes épaules portent beaucoup » |

**Le « je » est intégral.** Pas de mélange « tu/je » dans une même méditation. Si une consigne d'ouverture est nécessaire (avant que le « je » s'installe), elle peut être donnée dans le champ `instruction` du JSON, en dehors du `texte_meditation`.

##### Longueur et densité

- **Durée cible : 6 à 8 minutes** (vs ~5 min avant). Plus long permet vraiment d'entrer dans l'état méditatif.
- **Densité textuelle : environ 400 à 600 mots de texte parlé**, pauses incluses dans le décompte de durée.
- Lecture lente : compter environ **80 mots par minute** une fois pauses intégrées (vs 130-150 en parole normale).

##### Structure en 5 mouvements

Toute méditation suit cette progression :

1. **Ancrage corporel (30-60 sec)** — *Je m'installe. Je pose une main sur… Je respire…*  
   Court, simple, accessible même épuisé·e.

2. **Reconnaissance de l'état présent (60-90 sec)** — *Je suis fatigué·e. Mon corps porte beaucoup. Je ne sais pas toujours où je suis. C'est ok.*  
   Nommer ce qui est, sans juger, sans réparer.

3. **Cœur thématique (2 à 4 min)** — partie la plus longue, qui incarne le travail intérieur du thème. C'est ici qu'on peut **introduire de la visualisation** (voir ci-dessous).

4. **Permission/libération (60-90 sec)** — *J'ai le droit de… Je peux laisser… Je n'ai pas à…*  
   Une parole de relâchement, qui ouvre.

5. **Clôture et retour (30-60 sec)** — *Je garde une main sur… Je reviens doucement…*  
   Le retour n'est jamais brutal. Il y a toujours un pont vers la suite (revenir à bébé, ouvrir les yeux, se rendormir).

##### Visualisation (à intégrer quand le thème s'y prête)

Pour les thèmes qui le permettent (M4 corps qui a changé, M9 brouillard mental, M10 désir propre, M11 lâcher prise, M14 individualité, M20 imagination…), introduire une **séquence de visualisation** dans le cœur thématique.

**Types de visualisations possibles :**
- **Visualisation corporelle** — *J'imagine une lumière douce qui descend depuis le sommet de mon crâne…*
- **Visualisation symbolique** — *Je vois une rivière. Sur cette rivière, je dépose mes pensées comme des feuilles…*
- **Visualisation projective** — *Je me vois dans six mois. Je suis dans une pièce calme…*
- **Visualisation de personnage** — *J'imagine la personne en moi qui sait. Comment me regarde-t-elle ? Que me dit-elle ?*

**Règles pour les visualisations :**
- Toujours commencer par « J'imagine… », « Je vois… », « Je me représente… » (pas d'injonction « imagine »).
- Laisser des pauses longues (10-15 sec) pour que l'image s'installe.
- Toujours offrir une porte de sortie si l'image ne vient pas : *« Si l'image ne vient pas, ce n'est pas grave. Je reste avec la sensation. »*
- Ne pas surcharger : une seule visualisation par méditation, pas un enchaînement.

##### Pauses

Les pauses sont **structurelles**, pas décoratives. Elles sont notées dans le texte :

- `[pause - 5 secondes]` — micro-pause de respiration
- `[pause - 10 secondes]` — pause d'installation d'une sensation ou d'une image
- `[pause - 15 secondes]` — pause longue (visualisation, intégration)

**Fréquence indicative :** une pause toutes les 60-90 secondes de texte. Ni plus (lassant), ni moins (asphyxiant).

##### Inclusivité

- **Mode d'alimentation :** jamais présupposer l'allaitement. Si la méditation évoque un moment lié au lait, utiliser « pendant une tétée ou un biberon », « le moment du lait », ou contourner.
- **Statut du parent :** jamais présupposer la maman seule. Les méditations sont écrites de telle sorte qu'un papa, un co-parent, ou un parent solo puisse les vivre.
- **Genre :** accords inclusifs (`fatigué(e)`, `seul(e)`) ou contournements neutres (`je suis épuisé·e`, `mon état`).

##### Ponctuation

Pas de tiret cadratin (« — ») au milieu des phrases (voir SKILL_contenu.md). Préférer la virgule, le deux-points, ou un retour à la ligne — qui rythme particulièrement bien une méditation.

##### Structure JSON du conseil 2

```json
{
  "id": "meditation_audio",
  "numero": 2,
  "icone": "🎧",
  "nom_outil": "Méditation audio",  // étiquette standardisée
  "promesse": "...",                // phrase qui incarne le voyage intérieur sur le thème
  "duree": "~7 minutes",
  "intro": "...",                // 2-3 phrases pour situer le contexte d'écoute
  "instruction": "...",          // (optionnel) consigne pratique avant le « je » : posture, écouteurs, position de bébé
  "texte_meditation": "..."      // texte intégral en « je », avec [pause - X secondes]
}
```

#### Conseil 3 — Auto-reconnaissance

**Format participatif, adapté au thème du mois.** L'auto-reconnaissance absorbe désormais ce qui était auparavant porté par la rubrique « petites victoires » — elle peut donc, selon le thème, faire émerger des reconnaissances de soi qui ressemblent à des victoires, mais dans un format plus engageant et plus intime.

**Le format change chaque mois et s'adapte au thème.** Il n'y a pas de format unique. Quelques pistes :

| Type de format | Quand l'utiliser |
|----------------|------------------|
| **Vocal/audio** (enregistrement libre dans le téléphone) | Quand l'écriture est trop demandante (M0) ou quand la voix porte mieux la fatigue |
| **Lettre à soi-même d'avant** | Quand le thème invite à mesurer la transformation (M6) |
| **Récit de naissance/d'accouchement** | Quand le thème invite à immortaliser et mettre des mots (M2 par exemple) |
| **Dialogue intérieur écrit à deux colonnes** | Quand le thème invite à faire dialoguer deux voix intérieures contradictoires (M9, M5) |
| **Lettre de gratitude à un proche** | Quand le thème invite à reconnaître le réseau de soutien (M1) |
| **Liste écrite de reconnaissances** | Format léger pour les mois plus apaisés |
| **Dessin/carte mentale** | Quand le mental verbal est saturé (M9) |
| **Lettre à son enfant à 18 ans** | Quand le thème invite à la projection (M23) |
| **Photo + légende** | Quand le thème invite à figer un instant |
| **Mantra personnel** | Quand le thème invite à ancrer une parole |

**Règles transverses :**
- Toujours accompagné d'un champ `espace_pour_ecrire: true` (ou `espace_pour_enregistrement: true` pour le vocal).
- Toujours 4-5 amorces calibrées sur le thème en cas de blocage.
- Toujours un `principe` court (2-3 phrases) qui explique pourquoi ce format précis a été choisi pour ce mois précis.
- Le contenu produit appartient au parent et n'est jamais partagé.

**Structure JSON du conseil 3 :**
```json
{
  "id": "auto_reconnaissance",
  "numero": 3,
  "icone": "💗",    // ou autre, selon le format
  "nom_outil": "Auto-reconnaissance",  // étiquette standardisée
  "promesse": "...",                   // phrase qui incarne le format et le thème
  "intro": "...",
  "format_propose": "...",      // identifiant du format : "vocal_audio", "lettre_a_soi", "recit_naissance", etc.
  "consigne": "...",            // explication concrète de comment faire
  "amorces_si_blocage": ["...", "...", "...", "...", "..."],  // 4-5 amorces
  "espace_pour_ecrire": true,   // ou "espace_pour_enregistrement": true
  "principe": "..."             // 2-3 phrases qui justifient ce format pour ce mois
}
```

**Règle d'unicité :** chaque format ne peut être utilisé qu'une fois sur les 24 mois (voir table d'unicité dans `CONTENT_INDEX.md`).

#### Conseil 4 — Réalité du post-partum

**Quand le parent ouvre ce conseil, le `sous_titre` du conseil devient un VRAI titre visuel important**, qui met en valeur le sujet spécifique du post-partum traité ce mois-ci. Ce sujet peut être **différent du thème général** ou en être un sous-thème.

Le post-partum est un sujet à part : il garde sa propre densité, ses propres ressources, son propre cadre médical. Le thème du mois oriente l'angle, mais la réalité physiologique et psychique du post-partum doit pouvoir être nommée pour ce qu'elle est.

**Exemples d'articulation thème ↔ post-partum :**

| Mois | Thème du mois | Sous-titre du conseil post-partum (= titre visuel) |
|------|---------------|-----------------------------------------------------|
| M0 | Habiter son corps après l'accouchement | Ce que personne ne dit assez fort sur les 4 premières semaines |
| M1 | Apprendre à demander de l'aide | Le moment où l'entourage s'éloigne — et ce qui se passe à l'intérieur |
| M2 | Se repositionner face au travail | Reprendre, ne pas reprendre, négocier — et ce que ton corps en dit |
| M3 | Tenir dans l'épuisement qui dure | Le pic clinique de la dépression post-partum, et le silence autour |
| M9 | Le brouillard mental | La thyroïdite du post-partum, le « mom brain », ce qui s'explique chimiquement |

**Densité variable selon les mois :** plus dense de M0 à M6 (post-partum aigu et tardif), plus condensé après — mais toujours présent, parce que le post-partum psychique court bien au-delà de la première année.

**Structure JSON du conseil 4 :**
```json
{
  "id": "realite_post_partum",
  "numero": 4,
  "icone": "💬",
  "nom_outil": "La réalité du post-partum",  // étiquette standardisée
  "promesse": "...",                          // sujet spécifique du post-partum traité ce mois-ci
  "intro": "...",                       // 2-3 phrases qui posent le sujet du mois
  "pour_la_maman": {
    "titre": "Côté maman",
    "contenu": "..."                    // 1-3 paragraphes (plus dense M0-M6)
  },
  "pour_le_papa_co_parent": {
    "titre": "Côté papa / co-parent",
    "contenu": "..."                    // 1-3 paragraphes
  },
  "signaux_a_ne_pas_negliger": ["...", "..."],   // 5-8 signaux
  "urgence": "...",                     // formulation 3114 / 15 selon contexte
  "qui_consulter": ["...", "..."]       // ressources, 4-6 items
}
```

**Règles transverses post-partum :**
- Toujours inclure les signaux d'alerte et les ressources (sage-femme, MonParcoursPsy, Allo Parents Bébé, 3114, Maman Blues, PMI selon le contexte).
- Jamais culpabiliser, jamais minimiser.
- Toujours nommer le co-parent comme un parent à part entière, pas un assistant.

#### Conseil 5 — Challenge couple

**Format « petit jeu » qui donne envie.** Le challenge couple ne doit pas être une injonction supplémentaire dans la semaine. C'est un mini-rituel ludique, court (5-10 min), simple à mettre en œuvre, qui crée un fil entre les deux parents.

Le couple parental a besoin de **deux choses** que la palette doit couvrir : se **réguler** ensemble (écoute, présence, connexion émotionnelle, projection commune) **ET respirer** ensemble (romantisme, jeu, rire, légèreté). Le travail intérieur du thème oriente vers l'un ou l'autre registre selon le mois.

**Critères du challenge réussi :**
- **Simple à mettre en œuvre** : pas de matériel compliqué, pas d'organisation lourde.
- **Court** : 5 à 10 minutes maximum (15 max pour les formats plus ritualisés type rendez-vous à la maison).
- **Sans cadence imposée** : pas de « 3 fois par semaine », pas de « tous les dimanches soir ». Le couple choisit son moment.
- **Ludique, poétique, romantique ou drôle** : il y a une dimension de jeu, de surprise, de geste symbolique, de tendresse ou de rire.
- **Aligné sur le thème** : le challenge incarne le travail intérieur du mois (ou crée la respiration dont le mois a besoin).

### Palette d'inspirations en 5 registres

La palette ci-dessous est une **source d'inspiration**, pas une liste exhaustive. Le choix se fait **mois par mois selon le thème**, en piochant librement dans le registre qui résonne le mieux avec le travail intérieur du mois. Un nouveau challenge peut être créé si un thème le demande, en respectant les critères du challenge réussi.

#### Registre 1 — Écoute et connexion émotionnelle

Pour les mois où le couple a besoin de **se réguler ensemble**, de se reconnecter émotionnellement, de réapprendre à s'écouter sans réparer.

| Mécanique | Principe |
|-----------|----------|
| **Carte à tirer** *(utilisé M1)* | L'un écrit 5 questions précises sur un papier, l'autre tire au hasard et répond. Règle d'or : l'écoutant dit juste « ok, j'ai entendu », sans réparer ni minimiser |
| **Main posée 1 minute** *(utilisé M0)* | Présence physique silencieuse, pas de mots, juste la main qui sent l'autre. Calibré pour parents épuisés sans énergie pour plus |
| **Conversation d'oreiller** | Au coucher, lumière éteinte, allongés côte à côte. L'un parle 5 min sans interruption sur ce qui l'a traversé, l'autre écoute. Puis on inverse |
| **Mot du jour / phrase secrète** | Une phrase à se glisser dans la semaine pour signifier quelque chose au-delà des mots, à un moment où l'autre s'y attend le moins |
| **Mission à l'aveugle** | L'un donne une mini-mission à l'autre dans la semaine, sans rien dire d'autre (ex : « fais-moi sourire 3 fois cette semaine ») |

#### Registre 2 — Vision et projection commune

Pour les mois où le couple a besoin de **regarder ensemble dans la même direction**, de poser des envies, de se projeter.

| Mécanique | Principe |
|-----------|----------|
| **Dessin partagé** *(utilisé M2)* | Pendant 10 min en silence, chacun dessine ou écrit sur une feuille A3 ce qu'il aimerait pour les 3 prochains mois. La feuille devient un « tiers » à commenter ensemble |
| **Liste des envies** | Chacun écrit 5 choses qu'on aimerait faire dans l'année (sorties, voyages, projets, retrouvailles d'amis). On compare les listes, on cherche les points communs |

#### Registre 3 — Romantique 💕

Pour les mois où le couple a besoin de **se rappeler qu'il est aussi un couple d'amoureux**, pas seulement deux soignants de bébé.

| Mécanique | Principe |
|-----------|----------|
| **Le rendez-vous à la maison** | Dîner en amoureux à la maison après le coucher de bébé, lumière tamisée, plat simple mais pensé, téléphones rangés. 1h max |
| **La lettre d'amour cachée** | Écrire un petit mot doux et le glisser dans une poche, un sac, un livre, pour que l'autre le trouve par surprise dans la semaine |
| **Le premier rendez-vous rejoué** | Reconstituer le lieu (ou l'ambiance) de votre premier rendez-vous, juste pour rire ensemble du chemin parcouru. Boisson identique, musique identique, conversation libre |
| **Le slow improvisé** | Un soir, mettre LA chanson qui vous rappelle vous deux, danser 3 minutes dans le salon, sans rien attendre |
| **La carte postale du présent** | Écrire chacun une carte postale au couple qu'on est *maintenant* (pas à celui qu'on était avant bébé). Échanger les cartes |

#### Registre 4 — Décalé / qui fait rire

Pour les mois où le couple a besoin de **rire ensemble**, de sortir du sérieux parental, de retrouver de la légèreté.

| Mécanique | Principe |
|-----------|----------|
| **Le « si on était… »** | Si on était un duo de séries, on serait qui ? Si on était un plat, lequel ? Si on était une chanson ? Jeu rapide de 5-10 questions, chacun répond pour soi puis pour l'autre. Révèle plein de choses dans le rire |

*Ce registre est volontairement court : le rire ne se planifie pas trop. Il vient mieux quand la palette est restreinte et qu'on garde de la place pour l'inspiration mois par mois.*

#### Registre 5 — Action et rituel

Pour les mois où le couple a besoin de **faire quelque chose ensemble**, pas seulement parler. Le « mini-projet ensemble » est une mécanique duplicable sous différentes formes selon les thèmes.

| Mécanique | Principe |
|-----------|----------|
| **Le mini-projet ensemble (cuisine)** | Cuisiner ensemble un plat ou un dessert un soir, sans se répartir les tâches comme d'habitude. Ralentir, s'amuser à se passer les ingrédients, goûter à deux |
| **Le mini-projet ensemble (plantation)** | Planter ensemble une herbe aromatique, un bulbe, ou rempoter une plante. Geste symbolique : on fait grandir quelque chose de plus, à deux |
| **Le mini-projet ensemble (construction)** | Monter ensemble un meuble, une petite étagère, un tipi pour bébé. La maladresse partagée fait souvent rire |
| **Le mini-projet ensemble (déco / création)** | Créer ensemble quelque chose pour la maison ou pour bébé : un mobile, un cadre photo, un coin lecture, une playlist du couple |
| **Le merci inattendu** *(M14 ancienne version)* | Écrire chacun une chose que l'autre a faite ce mois qui a fait du bien. Échanger les papiers sans commentaire |

La mécanique « mini-projet ensemble » est **duplicable** sous d'autres formes que celles listées : l'idée centrale est *faire ensemble quelque chose de concret, qui produit un résultat tangible, à un rythme qui permet de respirer*. À adapter selon le thème.

### Exception M0

Le challenge « une main posée, 1 minute » reste tel quel. À M0, l'énergie ne permet aucun élément ludique supplémentaire : la sobriété est le bon design.

### Indications de registre selon les thèmes (orientation, pas règle)

Pour aider à orienter le choix du registre selon le thème du mois, voici quelques indications :

| Phase du parcours | Mois | Registres souvent les plus pertinents |
|-------------------|------|---------------------------------------|
| **Survie physique et émotionnelle** | M0-M5 | Registre 1 (écoute, connexion) — énergie basse, besoin de se réguler |
| **Reconfiguration identitaire** | M6-M11 | Registres 2, 3 (vision, romantique) — le couple se redéfinit, peut respirer |
| **Réémergence** | M12-M17 | Registres 3, 4, 5 (romantique, décalé, action) — l'énergie revient, le couple peut jouer |
| **Projection et ouverture** | M18-M23 | Registres 2, 3, 4, 5 (tout sauf écoute pure) — le couple se reconstruit dans la durée |

Ce n'est qu'une orientation : si un thème spécifique appelle un registre différent (ex. M9 brouillard mental → registre 1 même si on est dans la phase 2), il faut suivre le thème.

**Structure JSON du conseil 5 :**
```json
{
  "id": "challenge_couple",
  "numero": 5,
  "icone": "💑",
  "nom_outil": "Challenge couple",  // étiquette standardisée
  "promesse": "...",                // phrase qui incarne le jeu et le thème
                                    // Cas particulier : peut prendre la forme d'un impératif pluriel
                                    // « -ez » (ex. « Tirez une carte : demandez sans honte »).
                                    // Non obligatoire — selon l'effet recherché.
  "duree": "5 à 10 minutes",        // 15 max pour les formats type rendez-vous à la maison
  "intro": "...",                   // 2-3 phrases qui relient le challenge au thème
  "challenge_du_mois": {
    "nom": "...",                   // nom court et évocateur du jeu
    "registre": "...",              // 1 = écoute, 2 = vision, 3 = romantique, 4 = décalé, 5 = action/rituel
    "deroule": "...",               // 3-5 phrases pour expliquer comment faire
    "regle_clef": "..."             // (optionnel) une règle qui change la dynamique
  },
  "pourquoi_ca_marche": "..."       // 2-3 phrases (neurosciences, mécanique relationnelle) qui éclairent le choix
}
```

**Règle d'unicité :** chaque mécanique de challenge ne peut être utilisée qu'une fois sur les 24 mois (voir table d'unicité dans `CONTENT_INDEX.md`). Le « mini-projet ensemble » fait exception : il peut être décliné plusieurs fois sous des formes différentes (cuisine, plantation, construction, déco/création) car ce sont des variantes distinctes d'une même mécanique.

### Règles transverses sur la rubrique

- Pas de section « signaux d'alerte » ni « ressources » séparée du conseil 4. Elles sont intégrées dedans.
- Aller droit au but, pas d'intro philosophique en tête de fichier ni en tête de conseil.
- Chaque conseil mentionne ou évoque le thème du mois sans le marteler.
- Tutoiement du parent dans les `intro`, `consigne`, `principe`, `pourquoi_ca_marche`. Première personne (« je ») dans les `texte_meditation` et dans les amorces d'auto-reconnaissance.
- Pas de présupposition du mode d'alimentation, du genre, ou de la configuration familiale (voir SKILL_contenu.md).
- Pas de tiret cadratin au milieu des phrases (voir SKILL_contenu.md).

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
| T8 | M21-M23 | Permission de l'imagination · Reconnaissance du monde intérieur · Continuité de l'amour malgré l'opposition · Bilan symbolique · Permission de devenir enfant (et plus seulement bébé) · Continuité de la sécurité |

**Règle : un trimestre = 3 scripts.** Le parent les fait sur 3 mois, à son rythme. Chaque script peut être réécouté plusieurs fois. **Soit 8 trimestres × 3 scripts = 24 scripts au total sur le parcours M0–M23.**

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

**Aucun thème ne peut être utilisé deux fois sur les 24 scripts du parcours complet** (8 trimestres × 3 scripts).

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

### Cartographie des mouvements émotionnels (palette à puiser)

Pour aider à diversifier, voici une palette de **27 mouvements émotionnels distincts** dans laquelle puiser **24 fois** (un par script du parcours M0–M23). Les 3 mouvements non retenus restent en réserve éditoriale :

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
- M12 à M23 : "0/10 — c'est une caresse" (même prudence)

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
| **Total par mois** | **140-180 Ko** | Pour les 24 mois (M0 à M23) ≈ 3,3 à 4,3 Mo de JSON |

Si un fichier dépasse 25% au-dessus de sa cible, le rapport est probablement trop dense — alléger.

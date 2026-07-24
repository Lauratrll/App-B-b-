# CONSIGNES CLAUDE CODE — Onglet Réflexologie

But : créer un **onglet dédié Réflexologie** dans l'app, qui remplace l'onglet « Jeux », plus un **relais contextuel depuis Guide-moi**. La réflexologie est une *action* que le parent cherche au moment où le sujet le préoccupe : elle doit être facile à trouver, pas enfouie dans le fil mensuel.

---

## 0. L'onglet remplace « Jeux »

- **Supprimer** l'onglet « Jeux » (l'éveil est déjà couvert par « Saison » et d'autres contenus).
- **Le remplacer** par le nouvel onglet, à la même place dans la navigation.

**Libellé de l'onglet et de son écran d'accueil :**

- **Titre : « Réflexologie plantaire »** — typographie de titre (Playfair Display), noir `#3A3228`.
- **Sous-titre : « apaiser bébé »** — capitales à petite taille, Eucalyptus `#8A9E98`, interlettrage léger (même traitement que les sous-titres des autres écrans).

C'est la même alternance que partout dans l'app : une partie en typo de titre, une partie en capitales Eucalyptus.

---

## 1. Deux points d'entrée pour un même contenu

Le protocole n'existe **qu'une seule fois** (un fichier `protocole-<id>.json`). On y accède de deux endroits :

1. **L'onglet Réflexologie** (le domicile) : la liste de tous les protocoles publiés, cherchable et filtrable. Point d'entrée principal.
2. **Le relais depuis Guide-moi** : dans le contenu d'une catégorie Guide-moi (Sommeil, Alimentation…), un bouton **« Voir le geste de Réflexologie »** qui ouvre le protocole correspondant. C'est ce relais qui compte le plus : le parent est déjà sur son sujet, on lui propose l'action.

**Ne jamais dupliquer le contenu** : le bouton Guide-moi pointe vers le protocole, il ne le recopie pas. Correspondance par `categorie_guide_moi` du protocole (à renseigner) ou par une table de liens sujet → protocole.

---

## 2. Ce qu'on publie au lancement

**19 protocoles publiés** (`"lancement": true` dans chaque fichier), dans l'ordre de `protocoles-index.json` :

Accueil du nouveau-né · **Prématurité** · Césarienne _(bébé né d'une césarienne / d'un déclenchement)_ · Confiance en soi · Difficultés à téter · Séparation · Coliques · Inconfort digestif · **Reflux** · Dents · Constipation · **Diarrhée** · Mal des transports · Sommeil · **Rhume, otite** · Concentration, agitation · Anxiété, nervosité · Opposition, frustration · Énurésie.

_(Césarienne et Confiance en soi sont **deux protocoles distincts** ; Inconfort digestif reprend la séquence de Coliques avec un texte d'ouverture propre.)_

**6 protocoles reportés** (`"lancement": false`, `raison_report` renseigné), présents dans les données mais **non affichés** : Bronchite, asthme · Eczéma · Allergies · Ictère · Méconium · **Chutes** _(protocole complexe : vues de côté à créer)_.

> Le code filtre sur `lancement === true`. Ne rien coder en dur : si le champ passe à `true` un jour, le protocole apparaît.

**Reflux, Prématurité, Rhume-otite et Diarrhée** sont publiés mais portent `"sujet_sensible": true` (la Diarrhée porte en plus une `vigilance` : « diarrhée d'origine infectieuse : demander un avis médical ») : garder des **termes prudents** (« accompagner », « apaiser l'inconfort », « soulager le moment »), **jamais** « soigner », « traiter », « guérir ».

---

## 3. Où sont les données

| Fichier | Contenu |
|---|---|
| `protocoles-index.json` | La liste : quels protocoles, lesquels au lancement, lesquels reportés. **Point de départ du code.** |
| `protocole-<id>.json` | Un protocole complet (ouverture, étapes, variante, note de fin). Un par protocole. |
| `_ouverture-commune.json` | L'ouverture identique à tous les protocoles. |
| `zones-mouvements.json` | Le catalogue des 37 zones et de leur mouvement. |
| `protocole-<id>.json` → champ `visuel` | Chemin de la **carte récapitulative** du protocole (`visuels-protocoles/Visuel - <titre>.png`). |
| `maquette-lecteur-paysage.html` | **Maquette** du lecteur animé en paysage (référence de mise en page). |
| `pieds_bebe_zones_reflexes.svg` | L'illustration des pieds + toutes les zones. |
| `mouvement-*.html` | Les 6 prototypes d'animation validés (référence de comportement). |
| `PROTOCOLES_textes_app.md` | **Version lisible** de tous les textes (pour relecture humaine). |
| `SCHEMA_protocole.md` | La structure d'un protocole, champ par champ. |
| `CONSIGNES_CLAUDE_CODE_animation_reflexologie.md` | Comment reproduire les 6 mouvements. |

---

## 4. Anatomie d'un écran de protocole

Dans l'ordre, tel que chaque `protocole-<id>.json` le décrit :

1. **Titre** + **intro** (accueil chaleureux).
2. **Émotion** (`emotion`) si présente — une phrase qui accueille le ressenti.
3. **Ouverture** (`ouverture`, commune) : les 5 gestes d'installation, avant tout toucher réflexe (« Avant de commencer »).
4. **Carte récapitulative** (`visuel`) — voir §4 bis : l'image des pieds avec les zones du protocole numérotées, **placée juste sous « Avant de commencer »**, titrée **« Les zones réflexes, pas à pas »**, avec un bouton **lecture** qui lancera le protocole animé.
5. **Séquence** (`sequence`) : chaque **étape** = un libellé parent (`designation`), une **intention** (le pourquoi), et **l'animation** de sa/ses zone(s).
   - Une étape a en général **une zone**. Certaines en ont **deux, jouées l'une après l'autre** (`gestes_enchaines: true`) — la zone digestive, les dents, le nez-oreilles. Le **bassin** ne porte ses deux gestes (spirale + ancrage) que dans le protocole **Accueil du nouveau-né** ; partout ailleurs, « bassin » = la spirale seule.
   - Une étape peut être **hors pied** (`hors_pied: true`) : pas d'animation, juste le texte.
6. **Variante** (`variante`) si présente : proposée **seulement** si l'âge du bébé ≥ `age_min_mois` (ex. cauchemars dès 12 mois).
7. **Note de fin** (`note_fin`, commune) : consentement + sortie en douceur. **Toujours affichée.**
8. **Disclaimer** (`disclaimer`, commun) : la phrase exacte **« La Réflexologie plantaire ne se substitue pas à un avis médical. »**, affichée **en petit, en bas de chaque protocole**. **Toujours présente.**

L'animation de chaque zone reprend exactement les prototypes `mouvement-*.html` (voir les consignes d'animation). Écran prévu en **mode paysage**.

---

## 4 bis. La carte « Les zones réflexes, pas à pas »

Sous « Avant de commencer », chaque protocole affiche **une image récapitulative** : la vue des deux pieds avec **uniquement les zones du protocole**, chacune coloriée et portant un **badge numéroté** dans l'ordre des étapes.

- **Emplacement** : juste **sous « Avant de commencer »**, avant le déroulé des étapes.
- **Titre du bloc** : **« Les zones réflexes, pas à pas »** (typo de titre + éventuel sous-titre en capitales Eucalyptus, comme ailleurs).
- **Source de l'image** : champ **`visuel`** de chaque `protocole-<id>.json` (ex. `visuels-protocoles/Visuel - Coliques.png`). Une image par protocole, déjà générée. *(Idéalement remplacée à terme par un rendu SVG des zones + badges, pour rester net à toute taille — l'image PNG sert de référence exacte du contenu et de l'ordre.)*
- **Point interactif** : un **bouton lecture (triangle ▶)** posé sur l'image.

### Le lecteur animé (à construire plus tard — spéc. cible)

Au clic sur ▶, le protocole se **lance en animation**. Comportement voulu (à travailler ensuite avec Laura) :

- **Bascule en lecture horizontale (paysage)** plein écran. **Inviter l'utilisateur à tourner son téléphone sur le côté** (message + picto de rotation) afin d'afficher le **visuel des pieds + l'animation le plus grand possible** ; l'image est **calée à gauche**, plein écran, et le **fond de l'écran reprend la couleur du fond des pieds (#dfbeb0)** pour que l'image se fonde dans l'écran.
- **Nom de la zone en casse « Le Cardia »** : majuscule à l'article et à la première lettre du nom, le reste en minuscules (jamais tout en capitales). Trois niveaux de texte seulement : **le nom de la zone**, **l'intention** (courte), **la description du geste**.
- Les zones s'animent **une par une, dans l'ordre des étapes**, en reprenant exactement les mouvements validés (voir `CONSIGNES_CLAUDE_CODE_animation_reflexologie.md`).
- **Le texte descriptif de la zone s'affiche sur le côté de l'image**, **au moment précis où sa zone s'anime** (synchronisé étape par étape : `designation` + `intention` + éventuellement la description du mouvement), puis laisse place au texte de l'étape suivante.
- Contrôles simples : lecture / pause, étape suivante / précédente ; l'ouverture « Avant de commencer » reste consultable mais n'est pas animée.

> **Note (Claude Code)** : ne pas coder le lecteur maintenant — Laura veut d'abord caler ensemble la mise en page paysage et la synchro texte↔animation. Pour l'instant : afficher l'image `visuel` avec son titre et le bouton ▶ (inerte ou ouvrant un placeholder).

---

## 5. Organisation de l'onglet

- **PREMIÈRE BRIQUE de la catégorie : « Introduction — à lire avant de commencer »** (présentation + précautions). Contenu figé dans `accueil-onglet-reflexologie.json` (version lisible : `ACCUEIL_onglet_reflexologie.md`).

  > **Important (Claude Code) :** cette Introduction **n'est PAS un protocole**, et **pas non plus un simple texte** parmi d'autres : c'est **la première brique de la catégorie « Réflexologie plantaire »**, le cadre d'entrée. Elle s'affiche **TOUJOURS en premier, AVANT la liste des protocoles**. Pas d'animation, pas d'ouverture commune, pas de séquence de zones — seulement la présentation et les précautions, à lire une fois. Titre **« Introduction »** (typo de titre) + sous-titre **« à lire avant de commencer »** (capitales Eucalyptus), même traitement que les autres écrans.
- **Liste des protocoles publiés**, chacun avec son titre et une accroche courte.
- **Recherche par situation** (« mon bébé ne dort pas », « coliques »…) : c'est le besoin réel, souvent en urgence.
- **Filtre par âge** : masquer les protocoles et variantes non pertinents pour l'âge du bébé (certaines variantes ont un `age_min_mois`).
- Pas de tri par « organe » ou par zone : le parent pense par **problème**, pas par anatomie.

---

## 6. Vocabulaire — non négociable

- **« massage »** : autorisé en contexte bien-être uniquement, **avec parcimonie**. **« caresse » interdit**, même nié.
- On **accompagne**, on **apaise**, on **soulage un moment** — on ne **soigne** pas, on ne **traite** pas.
- **Aucune échelle de pression chiffrée** (une durée en secondes reste permise).
- **Réflexologie** toujours en toutes lettres, **sans guillemets** : c'est un vrai terme (jamais « Réflexologie »).
- Tutoiement du parent, voix posée ; le bébé est « il ».

---

## 7. Reste à décider (avec Laura)

- La **table de correspondance** Guide-moi → protocole (quel sujet mensuel renvoie vers quel protocole).
- Le **niveau des intentions** : elles sont aujourd'hui génériques par zone (réutilisées d'un protocole à l'autre). À personnaliser protocole par protocole si on veut plus de sur-mesure.
- Faut-il un **écran d'accueil de l'onglet** (présentation de la Réflexologie, précautions générales) avant la liste ?

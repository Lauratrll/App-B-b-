# CONSIGNES CLAUDE CODE — Onglet « Réflexologie »

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

**15 protocoles publiés** (`"lancement": true` dans chaque fichier) :

Accueil du nouveau-né · **Prématurité** · Césarienne _(bébé né d'une césarienne / d'un déclenchement)_ · Confiance en soi · Difficultés à téter · Séparation · Coliques · **Reflux** · Dents · Constipation · **Diarrhée** · Sommeil · **Rhume, otite** · Concentration, agitation · Anxiété, nervosité · Énurésie.

_(16 protocoles : Césarienne et Confiance en soi sont **deux protocoles distincts**.)_

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
| `zones-mouvements.json` | Le catalogue des 36 zones et de leur mouvement. |
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
3. **Ouverture** (`ouverture`, commune) : les 5 gestes d'installation, avant tout toucher réflexe.
4. **Séquence** (`sequence`) : chaque **étape** = un libellé parent (`designation`), une **intention** (le pourquoi), et **l'animation** de sa/ses zone(s).
   - Une étape a en général **une zone**. Certaines en ont **deux, jouées l'une après l'autre** (`gestes_enchaines: true`) — la zone digestive, les dents, le nez-oreilles. Le **bassin** ne porte ses deux gestes (spirale + ancrage) que dans le protocole **Accueil du nouveau-né** ; partout ailleurs, « bassin » = la spirale seule.
   - Une étape peut être **hors pied** (`hors_pied: true`) : pas d'animation, juste le texte.
5. **Variante** (`variante`) si présente : proposée **seulement** si l'âge du bébé ≥ `age_min_mois` (ex. cauchemars dès 12 mois).
6. **Note de fin** (`note_fin`, commune) : consentement + sortie en douceur. **Toujours affichée.**
7. **Disclaimer** (`disclaimer`, commun) : ne se substitue pas à un avis médical. **Toujours affiché.**

L'animation de chaque zone reprend exactement les prototypes `mouvement-*.html` (voir les consignes d'animation). Écran prévu en **mode paysage**.

---

## 5. Organisation de l'onglet

- **En 1re position, toujours présente : la sous-partie « Bienvenue »** (présentation + précautions). Contenu figé dans `accueil-onglet-reflexologie.json` (version lisible : `ACCUEIL_onglet_reflexologie.md`). Elle s'affiche en tête de l'onglet, avant la liste des protocoles — c'est le cadre et les précautions à lire une fois. Ne pas la traiter comme un protocole (pas d'animation, pas d'ouverture).
- **Liste des protocoles publiés**, chacun avec son titre et une accroche courte.
- **Recherche par situation** (« mon bébé ne dort pas », « coliques »…) : c'est le besoin réel, souvent en urgence.
- **Filtre par âge** : masquer les protocoles et variantes non pertinents pour l'âge du bébé (certaines variantes ont un `age_min_mois`).
- Pas de tri par « organe » ou par zone : le parent pense par **problème**, pas par anatomie.

---

## 6. Vocabulaire — non négociable

- **« massage »** : autorisé en contexte bien-être uniquement, **avec parcimonie**. **« caresse » interdit**, même nié.
- On **accompagne**, on **apaise**, on **soulage un moment** — on ne **soigne** pas, on ne **traite** pas.
- **Aucune échelle de pression chiffrée** (une durée en secondes reste permise).
- **« Réflexologie »** toujours en toutes lettres, guillemets français « » avec espaces insécables.
- Tutoiement du parent, voix posée ; le bébé est « il ».

---

## 7. Reste à décider (avec Laura)

- La **table de correspondance** Guide-moi → protocole (quel sujet mensuel renvoie vers quel protocole).
- Le **niveau des intentions** : elles sont aujourd'hui génériques par zone (réutilisées d'un protocole à l'autre). À personnaliser protocole par protocole si on veut plus de sur-mesure.
- Faut-il un **écran d'accueil de l'onglet** (présentation de la « Réflexologie », précautions générales) avant la liste ?

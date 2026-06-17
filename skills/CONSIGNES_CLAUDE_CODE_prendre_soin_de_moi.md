# CONSIGNES CLAUDE CODE — Rubrique « Prendre soin de moi » (accueil + 5 conseils)

**Statut : VALIDÉ V1 — design figé. Remplace et annule le document précédent « page accueil » seul. Single source of truth pour toute la rubrique.**

Cette fiche est autoportée. Elle couvre **6 écrans** :
- **A.** l'accueil de la rubrique (grand titre du mois + intro + 5 cases),
- **B1→B5.** les 5 écrans de détail (un par conseil), qui partagent un squelette commun.

---

## 1. Contexte fonctionnel

« Prendre soin de moi » est le 3ᵉ module de l'app. L'écran A liste les 5 conseils du mois. Au clic sur une case, on ouvre l'écran de détail correspondant (B1→B5). L'écran A **tient sur un téléphone sans scroll** ; les écrans de détail **peuvent défiler**.

---

## 2. Stack et hypothèses

- **React** (composant fonctionnel), **inline styles**.
- Données : `mois_${babyMonth.toString().padStart(2,'0')}_-_03_prendre_soin_de_moi.json`.
- Police titres : **Playfair Display** (Google Fonts, poids 600/700). Corps : système sans-serif.
- Bandeau du haut de l'écran A : **TopBar de la page 1 Guide-moi**, inchangé (fond Cream).

---

## 3. Source de données — JSON

Clés racine : `mois`, `nom_rubrique` (« Prendre soin de moi »), `promesse_du_mois`, `intention_du_mois`, `conseils[]`.

Les 5 `conseils` ont toujours `numero` **1→5 (stable)**, plus `id` (⚠️ **change chaque mois — ne jamais l'utiliser pour styler/ordonner**), `nom_outil`, `promesse`, puis des champs propres au type (voir §6). Mapping **par `numero`** :

| numero | nom_outil (canonique) | Titre court affiché | Picto | Couleur slot (page 1) |
|---|---|---|---|---|
| 1 | Auto-massage de réflexologie | **Auto-massage** | main | `#EABDB1` |
| 2 | Méditation audio | **Méditation audio** | casque | `#F8DBC9` |
| 3 | Auto-reconnaissance | **Auto-reconnaissance** | fleur | `#E7B99F` |
| 4 | La réalité du post-partum | **Réalité du post-partum** | tourbillon | `#F5D0C8` |
| 5 | Challenge couple | **Challenge couple** | deux cœurs | `#EEC7B0` |

```ts
const TITRE_COURT = {1:'Auto-massage',2:'Méditation audio',3:'Auto-reconnaissance',4:'Réalité du post-partum',5:'Challenge couple'};
const COULEUR_SLOT = {1:'#EABDB1',2:'#F8DBC9',3:'#E7B99F',4:'#F5D0C8',5:'#EEC7B0'};
```

### 3.1 ⭐ Tableau de correspondance EXHAUSTIF — champ JSON → où il s'affiche

> Règle d'or : **tout champ non listé comme affiché ci-dessous ne doit RIEN rendre à l'écran.**
>
> **Règle de voix.** On est dans « Prendre soin de **moi** ».
> • **1re personne** (je / me / m' / mon / ma / mes / moi) : les **titres** (`promesse_du_mois`, `conseils[].promesse`) **ET l'intro page 1** (`intention_du_mois`, signature « Ce mois **m'**invite à… »). Jamais *te / ton / ta / tes / toi*.
> • **Tutoiement conservé** : tous les **textes de corps des pages de détail** (`conseils[].intro`, `consigne`, `texte_meditation`, `pour_la_maman`/`pour_le_papa_co_parent`, `amorces_si_blocage`, `principe`, `challenge_du_mois`, etc.).
> • Les titres expriment une **thématique**, jamais une consigne d'usage (pas de « À écouter le soir… »). Les fichiers contiennent des champs hérités/techniques qui ne s'affichent pas — c'est normal, ne pas les rendre.

**Champs racine**

| Champ JSON | Affiché ? | Où / quoi |
|---|---|---|
| `promesse_du_mois` | ✅ Page 1 | **Grand titre du mois** (Playfair 700/25) |
| `nom_rubrique` | ✅ Page 1 | **Label** sous le titre (eucalyptus 9px uppercase) — vaut toujours « Prendre soin de moi » |
| `intention_du_mois` | ✅ Page 1 | **Intro** sous le titre, **en entier** (pas de troncature) |
| `conseils[]` | ✅ Page 1 | Les **5 cartes** |
| `mois` | ⛔ non affiché | Clé technique (numéro de module) |
| `tranche_age` | ⛔ non affiché | Info éditoriale interne |
| `rubrique` | ⛔ non affiché | Clé technique (`prendre_soin_de_moi`) |
| `titre_rubrique` | ⛔ non affiché | **Doublon** de `nom_rubrique` — ignorer, utiliser `nom_rubrique` |
| `theme_du_mois` | ⛔ non affiché | **Doublon** de `promesse_du_mois` — ignorer |
| `sous_titre` | ⛔ non affiché | Hérité (« Mois X — … ») — remplacé par titre + label |
| `description` | ⛔ non affiché | Hérité (peut mentionner « 6 propositions », inexact : il y en a 5) |

**Champs communs à chaque conseil**

| Champ | Affiché ? | Où / quoi |
|---|---|---|
| `numero` (1→5) | ⛔ (pilote) | Pilote ordre + couleur slot + picto. **Styler par `numero`, jamais par `id`.** |
| `nom_outil` | ✅ | Titre de la **carte** (page 1) **et** eyebrow du **détail** |
| `promesse` | ✅ | Phrase **sous la carte** (page 1, italique) **et** grand **titre H1 du détail** |
| `intro` | ✅ détail | Chapô en haut de l'écran de détail |
| `id` | ⛔ non affiché | Clé interne, **change chaque mois** |
| `icone` (emoji) | ⛔ non affiché | Le picto vient du `numero` (SVG §7), pas de l'emoji |

**Champs spécifiques par conseil** (détail uniquement)

| Conseil | Champ | Affiché ? | Rendu |
|---|---|---|---|
| 1 Auto-massage | `duree` | ✅ | chip meta |
| | `indications` (liste) | ✅ | cadre « Pour qui / quand » |
| | `points` (liste `{zone,geste,effet}`) | ✅ | lignes **numérotées** (pastille `#C8806A`) |
| | `cloture` | ✅ | note de fin |
| 2 Méditation | `duree` | ✅ | chip meta |
| | `instruction` | ✅ *(optionnel)* | bloc « Avant de commencer » — **absent M0/M3/M6/M9/M14** ⇒ masquer le bloc |
| | `texte_meditation` | ✅ | corps ; **ligne vide = pause** |
| 3 Auto-reconnaissance | `format_propose` | ⛔ (pilote) | `ecrit` ⇒ gabarit papier · `vocal_audio` ⇒ bloc vocal |
| | `gabarit` `{type,…}` | ⛔ (pilote) | mise en forme de la carte papier (voir §6.3) — **n'affiche aucun texte de contenu** |
| | `consigne` | ✅ | la consigne |
| | `amorces_si_blocage` (liste) | ✅ | amorces |
| | `espace_pour_ecrire` *(bool)* | ⛔ (pilote) | si `true` ⇒ afficher le gabarit papier non éditable |
| | `espace_pour_enregistrement` *(bool)* | ⛔ (pilote) | si `true` ⇒ bloc vocal (M0/M3/M6/M9/M14) |
| | `principe` | ✅ | note de fin |
| 4 Réalité | `pour_la_maman` `{titre,contenu}` | ✅ | cadre **Côté maman** (`#F8E6DE`) |
| | `pour_le_papa_co_parent` `{titre,contenu}` | ✅ | cadre **Côté co-parent** (`#F6EBE1`) |
| | `signaux_a_ne_pas_negliger` (liste) | ✅ | cadre **gris** `#E4DDD6` (puces grises, pas de croix rouge) |
| | `urgence` (string) | ✅ | cadre **rouge** fermé, **3114 en gras** |
| | `qui_consulter` (liste) | ✅ | cadre **gris clair** `#EFEBE6` |
| 5 Challenge | `duree` | ✅ | chip meta |
| | `gabarit` `{type,…}` | ⛔ (pilote) | motif illustratif du challenge (voir §6.5) — **n'affiche aucun texte de contenu** |
| | `challenge_du_mois` `{nom,registre?,deroule,regle_clef}` | ✅ | bloc challenge ; `registre` **absent M6/M9** ⇒ masquer le badge éventuel |
| | `pourquoi_ca_marche` | ✅ | note de fin |

---

## 4. Système visuel commun (à respecter sur tous les écrans)

### 4.1 Palette restreinte (chaude + neutres) — PAS de bleu, pas toute la gamme

| Token | Hex | Usage |
|---|---|---|
| Cream | `#F2EDE8` | Fond écran + fond TopBar |
| Cream-dark | `#E4DDD6` | Séparateurs, fond cadre « gris » (signaux) |
| Ink | `#3A3228` | Titres, texte fort, picto/flèche des cases (accueil) |
| Eucalyptus | `#8A9E98` | **Tous les labels** (eyebrow, labels de section), adjectif du mois, nav active |
| Peach-dark | `#C8806A` | Pastilles numérotées, pictos d'accent, trait décoratif |
| Warm-label | `#8A4030` | Texte fort sur fond chaud, durées mises en valeur |
| Warm-body | `#5A4A40` | Corps de texte des cadres / intro |
| Coral / Coral-dark | `#D4604A` / `#8A3020` | **Uniquement** le cadre d'urgence (sémantique) |

Tons chauds des cadres : `#F7ECE4` (soft), `#F9F1EA` (light), `#F3DCD0` (tendre), `#FBF4EE` / `#FBF6F1` (très clair). Tons « maman/co-parent » : `#F8E6DE` / `#F6EBE1`. Cadres fermés du bas : urgence `#EDE9E4` (bord rouge), qui consulter `#EFEBE6` (bord `#D9D2CA`).

### 4.2 Typographie

- Grand titre (`promesse` / `promesse_du_mois`) : **Playfair 600/700**, `#3A3228`, centré.
- Labels (eyebrow + sections) : **9 px, 600, UPPERCASE, `letter-spacing:.13–.16em`, Eucalyptus**.
- Corps : système sans-serif, 11,5–12,5 px, `line-height` 1.5–1.62.

### 4.3 ⭐ Règle d'harmonisation des grands titres (spécifique à « Prendre soin de moi »)

S'applique à tous les grands titres de la rubrique (`promesse_du_mois` sur l'accueil, `promesse` sur les détails). **Cette règle est propre à Prendre soin de moi** (les titres de Guide-moi gardent leur propre traitement).

**Objectif :** un titre sur **1 ou 2 lignes maximum**, sans mot orphelin, avec deux lignes de longueurs proches — sauf si une coupure sur une ponctuation tombe déjà bien.

**Mise en œuvre (3 couches) :**

1. **Équilibrage** — `text-wrap: balance` sur le `h1`, et **jamais de `<br>` manuel** :
   ```css
   h1 { text-wrap: balance; }
   ```

2. **Liens grammaticaux insécables** — avant rendu, passer le titre dans `formatTitre()`, qui relie par une **espace insécable (U+00A0)** les groupes qu'on ne coupe pas : un **article/déterminant** et le mot qui suit (le, la, les, l', un, une, des, du, de, au, aux, mon/ma/mes…), et un **pronom personnel sujet** et son verbe (je, tu, il, elle, on, nous, vous, ils, elles). Ainsi le navigateur ne coupera jamais « les / moyens » ni « tu / peux ».
   ```ts
   const ARTICLES = new Set(['le','la','les','un','une','des','du','de','au','aux',
     'mon','ma','mes','ton','ta','tes','son','sa','ses','notre','nos','votre','vos','leur','leurs',
     'ce','cette','ces']);
   const PRONOMS = new Set(['je','tu','il','elle','on','nous','vous','ils','elles']);
   const NBSP = '\u00A0';
   function formatTitre(t: string): string {
     const mots = t.split(' ');
     let out = mots[0];
     for (let i = 1; i < mots.length; i++) {
       const prevRaw = mots[i - 1];
       const prev = prevRaw.toLowerCase().replace(/[«».,;:!?—()]/g, '');
       const elision = /['’]$/.test(prevRaw);            // l’ c’ d’ qu’ n’ s’…
       const lier = ARTICLES.has(prev) || PRONOMS.has(prev) || elision;
       out += (lier ? NBSP : ' ') + mots[i];
     }
     return out;
   }
   ```
   À faire **au mieux** : ne pas multiplier les liens au point d'empêcher tout équilibrage. Sur des titres courts (4–10 mots) c'est sans risque.

3. **Ponctuation prioritaire** — si le titre contient une virgule (ou « : », « — ») à peu près au milieu, `text-wrap: balance` coupe naturellement à cet endroit : **inutile de forcer un 50/50**. Exemple attendu : « Te donner les moyens de tenir, / sans tenir seule » (et non « Te donner les moyens / de tenir, sans tenir seule »).

**Contrainte éditoriale (2 lignes max) :** les `promesse` doivent être rédigées assez courtes pour tenir en **2 lignes**. Si un titre menace d'en faire 3, **raccourcir la formule à la source** (priorité éditoriale) plutôt que de rétrécir la police. ⚠️ Plusieurs `promesse` actuelles (ex. Auto-massage, Méditation) sont longues et dépasseront 2 lignes : à raccourcir lors d'une passe éditoriale dédiée.

### 4.4 ⭐ Espaces insécables (U+00A0) — RÈGLE À RESPECTER AU RENDU

Tous les textes proviennent du JSON et **contiennent déjà** les espaces insécables (caractère **U+00A0**, pas `&nbsp;`, pas une espace fine) :
- **avant** `:` `;` `!` `?` et `»`,
- **après** `«`.

Au rendu, Claude Code doit :
1. **Préserver** ces caractères tels quels — ne jamais les normaliser, trimmer ou remplacer par des espaces ordinaires (attention aux minificateurs/formatters qui « nettoient » les espaces ; les U+00A0 ne doivent pas être touchés).
2. Ne **jamais** réintroduire une espace ordinaire devant ces ponctuations.
3. Si (et seulement si) du texte est **assemblé dynamiquement** côté front (concaténation, libellés générés, pluriels), appliquer la même règle : insérer un U+00A0 avant `: ; ! ?` et `»`, après `«`. Les deux-points **structurels du JSON/JS** (`"clé": valeur`) ne sont jamais précédés d'une espace, donc jamais concernés.
4. Les guillemets sont toujours des chevrons français `« … »` (jamais `"…"`).

Règle de fond commune à tout le projet : voir `SKILL_contenu.md` § Conventions typographiques (« dépression post-partum » toujours en toutes lettres, jamais « DPP » ; insécables obligatoires).

### 4.5 Picto catégorie (sur les écrans de détail)

En haut de chaque écran de détail, **picto 32 px centré**, même tracé que la case de l'accueil, **trait dans la couleur du slot** (`COULEUR_SLOT[numero]`), `strokeWidth 1.8`. Sur les teintes très pâles (Méditation `#F8DBC9`, Réalité post-partum `#F5D0C8`) le picto est **volontairement subtil** sur le Cream — c'est cohérent avec la même règle en page 2 de Guide-moi.

### 4.6 Système de cadres (commun à tous les détails)

Chaque section est un **cadre arrondi** avec son **titre intégré à l'intérieur** (en haut), jamais un label flottant au-dessus :

```css
.lab   { font-size:9px; font-weight:600; letter-spacing:.13em; text-transform:uppercase;
         color:#8A9E98; margin-bottom:8px; }          /* label eucalyptus intégré */
.cadre { border-radius:12px; padding:13px 15px; margin-top:14px; }  /* fond chaud, sans filet latéral */
```

- Cadres « ouverts » : fond chaud, **pas de bordure ni de filet gauche**, `border-radius:12px`.
- Cadres « fermés » (urgence, qui consulter) : `border:1px solid …`, `border-radius:10px`.
- Le label d'urgence est l'unique exception de couleur (Coral-dark) ; tous les autres labels sont Eucalyptus.

---

## 5. ÉCRAN A — Accueil de la rubrique

**Tient sur un écran, sans scroll. Pas de fil d'Ariane.**

1. **Bandeau** : TopBar de la page 1, fond **Cream `#F2EDE8`**, **inchangé** (avatar + prénom + badge `{mois} mois · {saison}` + adjectif du mois en eucalyptus).
2. **Grand titre** = `promesse_du_mois` (Playfair 700, 25 px, centré, `text-wrap:balance`).
3. **Label** « Prendre soin de moi » (`nom_rubrique`) **juste en dessous** (eucalyptus 9 px uppercase).
4. **Trait décoratif** 34×1 px `#C8806A` opacity .55.
5. **Intro** = `intention_du_mois`, désormais **réécrit court (~120-160 caractères)** et affiché **en entier, sans troncature** (chaleureux, 1-2 phrases, signature « Ce mois t'invite à… »). Plus besoin de helper de coupe. *(Les versions longues d'origine sont archivées dans `intention_du_mois_ARCHIVE_long.md`.)* Les 24 mois ont désormais leur en-tête (`promesse_du_mois` + `intention_du_mois`). ⚠️ M0, M3, M6, M9, M14 ont l'en-tête mais leurs **`conseils` restent en ancien format (6 conseils)** : la grille des 5 cartes ne s'affichera correctement qu'après migration de leurs conseils au format validé.
6. **5 cases** : conteneur **largeur 82 %, centré**, `gap:8px`, `border-radius:11px`, **sans bordure**. Chaque case :
   - cercle picto 38 px en **blanc transparent** `rgba(255,255,255,.48–.55)`, picto **trait noir `#3A3228`** ;
   - `TITRE_COURT[numero]` en **Playfair 600/14 `#3A3228`** ;
   - `promesse` en **11,5 px italique noir `#3A3228`** ;
   - **chevron droit noir `#3A3228`**.
   - Fonds **alternés** par `numero` (jamais de dégradé, jamais de Pleurs, jamais de marron-gris) : `1:#EABDB1 · 2:#F8DBC9 · 3:#E7B99F · 4:#F5D0C8 · 5:#EEC7B0`.
7. **Nav bas** : 5 entrées, icônes au trait, inactives `#B4A89C`, active (« Soin de moi ») **Eucalyptus `#8A9E98`**.

---

## 6. ÉCRANS B — Détail d'un conseil (squelette commun)

Ordre commun en tête de chaque détail : **TopBar Cream (retour + « Prendre soin de moi » + mois eucalyptus)** → **picto 32 px (couleur slot)** → **eyebrow `nom_outil` (eucalyptus)** → **H1 `promesse` (Playfair 600/19, `text-wrap:balance`)** → **chips meta** (selon le conseil) → **pile de cadres**.

```css
.eyebrow{text-align:center;font-size:9px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#8A9E98;margin-bottom:9px;}
h1{font-family:'Playfair Display',Georgia,serif;font-weight:600;font-size:19px;line-height:1.32;text-align:center;text-wrap:balance;}
.chip{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;color:#8A4030;background:#F1DDD2;border-radius:20px;padding:4px 11px;}
```

### 6.1 — B1 Auto-massage (numero 1, couleur `#EABDB1`, picto main)
Champs : `intro`, `duree`, `indications[]`, `points[] {zone, geste, effet}`, `cloture`.
- **Chips** : `duree` (horloge) + « 4 points · sur tes mains » (main).
- **Intro chapô** sous un petit trait décoratif (prose centrée, **sans label**).
- **Cadre `#F7ECE4` « Tu peux l'utiliser quand »** : `indications[]` en liste, coche `#C8806A`.
- **Cadre `#FBF4EE` « Les 4 points, dans l'ordre »** : `points[]` en **lignes numérotées** (pastille pleine `#C8806A`, chiffre blanc), `zone` en gras (+ complément entre parenthèses en gris léger), `geste` avec icône horloge et **durée en gras `#8A4030`**, `effet` en italique. Séparateur `.5px #EFE2D8` entre lignes.
- **Cadre `#F3DCD0` « Pour clore »** : `cloture` ; isoler le mantra final (entre « … ») en **Playfair italique** centré.

### 6.2 — B2 Méditation audio (numero 2, couleur `#F8DBC9`, picto casque)
Champs : `duree`, `intro`, `instruction`, `texte_meditation` (avec marqueurs `[pause - N secondes]`).
- **Chips** : `duree` (~7 min) + « voix à la 1ʳᵉ personne ».
- **Cadre `#F7ECE4` « Avant de commencer »** : `instruction`.
- **Cadre `#F9F1EA` « L'image de cette méditation »** : `intro` (italique).
- **Lecteur audio** (bloc `#F4E4DA`) **juste au-dessus du texte** : bouton play rond `#C8806A`, barre de progression, `0:00 / {duree}`. *(L'audio sera enregistré ; prévoir le composant `<audio>` branché plus tard.)*
- **Cadre `#FBF6F1` (filet .5px) « Texte de la méditation »** : rendre `texte_meditation` ; transformer chaque `[pause - N secondes]` en repère centré discret « pause N secondes » (eucalyptus), un paragraphe par bloc.

### 6.3 — B3 Auto-reconnaissance (numero 3, couleur `#E7B99F`, picto fleur)
Champs : `intro`, `format_propose`, **`gabarit` (optionnel)**, `consigne`, `amorces_si_blocage[]`, `espace_pour_ecrire` / `espace_pour_enregistrement` (bool), `principe`.
- **Chip** : « format écriture · 30 min » (ou « format vocal » si `espace_pour_enregistrement`).
- **Cadre `#F7ECE4` « Comment faire »** : `consigne`.
- **Cadre `#F7ECE4` « Si tu bloques, commence par… »** : `amorces_si_blocage[]` en lignes, chevron `›` `#C8806A`.
- **Cadre `#F9F1EA` « À retenir »** : `principe` (italique).

**⭐ Carte « Ta carte » — pilotée par `gabarit` (mise en forme générique).**
Le format d'écriture **change chaque mois** (c'est voulu). La mise en forme visuelle est portée par le champ optionnel **`gabarit`** ; le rendu lit `gabarit.type` et affiche le bon **gabarit visuel non éditable** (papier). **Aucune saisie / sauvegarde in-app** (app d'action, pas journaling) — un seul composant présentationnel, paramétré par `gabarit`. **Si `gabarit` est absent → repli sur des lignes libres.** Le contenu (`consigne`, `intro`, `amorces`, `principe`) n'est jamais re-rendu là : `gabarit` ne porte QUE la structure et les étiquettes (recopiées de la consigne, sans réécriture).

Vocabulaire `gabarit.type` (extensible) et champs associés :
| `type` | Rendu | Champs portés |
|---|---|---|
| `lignes_libres` | feuille à lignes | `lignes?` (nb) |
| `lettre` | feuille « lettre » + ligne d'en-tête | `entete?` (ex. « Cher corps »), `lignes?` |
| `deux_colonnes` | 2 colonnes titrées | `colonnes` (2 libellés), `lignes_par_colonne?` |
| `deux_pages` | 2 pages titrées | `pages` (2 libellés) |
| `liste_numerotee` | N entrées numérotées | `nombre?`, `prefixe_entree?` (ex. « En tant que parent… ») |
| `carnet_date` | N jours datés | `jours` (ex. 14), `champs_par_jour?` |
| `grille_planning` | grille jours × heures | `colonnes` (jours), `lignes?` (plages horaires) |
| `cercles_concentriques` | centre + N cercles | `centre?`, `cercles` (libellés) |
| `vocal` | bloc d'enregistrement (pas de feuille) | `duree?`, `question?` |

> Couleurs de la carte : fond `#FBF6F1`, filet ; en-têtes de colonnes/pages alternées `#EFE0D0` / `#E7B99F` ; pas de croix, pas de bleu.

Exemple (M15) `deux_colonnes` : `"gabarit": { "type":"deux_colonnes", "colonnes":["Mes oui assumés","Mes non à poser"], "lignes_par_colonne":8 }`

#### ⭐ `type:"cercles_concentriques"` — carte de soutien (M1)

Gabarit : `{ centre, cercles:[{label,indice}], annotation }`. Rendu dans la carte « Ma carte de soutien » (fond `#FBF6F1`) :
1. **3 anneaux concentriques** (du plus clair à l'extérieur au plus soutenu au centre), dégradé pêche : extérieur `#FBEFE6`, milieu `#F7E2D2`, intérieur `#F0CFB8`. **Disque central** `#E7B99F` portant `centre` (« Moi ») en Playfair.
2. **L'ordre est inversé visuellement** : `cercles[0]` (« proche ») = anneau **le plus proche du centre** ; le dernier (« lointain ») = anneau extérieur. Le `label` de chaque anneau s'écrit en petites capitales `#8A4030` en haut de sa bande.
3. **Sous la carte**, une légende reprend chaque `label` (gras) + `indice`.
4. Quelques **exemples illustratifs** (« ex. : ma sœur ») peuvent être posés dans les anneaux en pastilles `#FFFDFA`, pour montrer qu'on y inscrit des prénoms. `annotation` en pied (italique).
Papier, non éditable. Maquette : `maquette_M1_M19_autoreconnaissance.html`.

#### ⭐ `type:"grille_planning"` — semaine en couleurs (M19)

Gabarit : `{ colonnes_jours:7, plage_horaire, legende:[{cle,exemples}], objectif }`. Rendu dans « Ma semaine en couleurs » :
1. **Grille** : 7 colonnes (Lun→Dim) × **bandes horaires** (ex. 6–9h, 9–12h, 12–14h, 14–18h, 18–21h, 21–23h) sur la `plage_horaire`. En-têtes jours `#F0E2D5`, colonne heures `#F4ECE2`, filets `#E4D5C7`.
2. **Deux couleurs** = les deux entrées de `legende` : « pour les autres » → ton sobre `#B7C4BE` ; « pour moi » → ambre chaud `#E6B570` (pas de bleu vif ; ces tons remplacent le bleu/jaune du papier). Quelques cellules pré-colorées montrent l'usage.
3. **Légende** sous la grille (pastille + `cle`), puis `objectif` en pied (italique).
Papier, non éditable. Maquette : `maquette_M1_M19_autoreconnaissance.html`.

### 6.4 — B4 Réalité du post-partum (numero 4, couleur `#F5D0C8`, picto tourbillon)
Champs : `intro`, `pour_la_maman {titre, contenu}`, `pour_le_papa_co_parent {titre, contenu}`, `signaux_a_ne_pas_negliger[]`, `urgence`, `qui_consulter[]`.
Pile de cadres (tous arrondis, labels eucalyptus, **aucun bleu**) :
- **`#F7ECE4` « Ce qui se passe »** : `intro`.
- **`#F8E6DE` « Côté maman »** : `pour_la_maman.contenu`.
- **`#F6EBE1` « Côté papa / co-parent »** : `pour_le_papa_co_parent.contenu`.
- **`#E4DDD6` (gris) « Signaux à ne pas négliger »** : `signaux_a_ne_pas_negliger[]`, **puces grises** (`#9A8E80`) — volontairement **distinct des « erreurs à éviter »** de Guide-moi (aucune croix rouge).
- **Cadre fermé rouge « En cas d'urgence »** : `urgence`. Fond `#EDE9E4`, `border:1px solid #D4604A`, `border-radius:10`, label Coral-dark `#8A3020`. **Mettre le 3114 en gras `#8A3020`.** (Seule entorse couleur autorisée.)
- **Cadre fermé gris très clair « Qui consulter »** : `qui_consulter[]`. Fond `#EFEBE6`, `border:1px solid #D9D2CA`. Amorce avant `:` en gras ; pictos pros en gris `#9A8E80`.

### 6.5 — B5 Challenge couple (numero 5, couleur `#EEC7B0`, picto deux cœurs)
Champs : `duree`, `intro`, **`gabarit` (optionnel)**, `challenge_du_mois {nom, registre?, deroule, regle_clef}`, `pourquoi_ca_marche`.
- **Chips** : `duree` (30 min) + « à deux ».
- **Intro chapô** (prose centrée, sans label).
- **Cadre `#FBF4EE` « Le challenge »** : `challenge_du_mois.nom` en **Playfair 600/17 centré**, `registre`/tonalité en eucalyptus uppercase, `deroule` en prose. **`regle_clef`** isolée dans un encart « La règle d'or » (`#F3DCD0`, picto étoile `#C8806A`).
- **Cadre `#F9F1EA` « Pourquoi ça marche »** : `pourquoi_ca_marche`.

**⭐ Aperçu illustratif — piloté par `gabarit` (mise en forme générique).**
Le champ optionnel **`gabarit`** indique le **motif visuel** à dessiner dans le cadre « Le challenge » (illustration légère `#EEC7B0`, jamais éditable, pas de saisie in-app). Il ne re-rend aucun texte de contenu : `deroule`/`regle_clef`/`pourquoi_ca_marche` restent les seules sources de texte. **`gabarit` absent ou `type:"moment_partage"` ⇒ pas de motif, cadre standard.**

| `type` | Aperçu à dessiner | Champs portés |
|---|---|---|
| `moment_partage` | aucun (cadre standard) | — |
| `sortie` | petit motif « sortie » (porte / extérieur) | — |
| `cartes_questions` | N petites cartes/papiers | `nombre` |
| `carte_a_remplir` | une feuille/carte avec ligne d'en-tête | `entete?` (verbatim, ex. « Nos 3 prochains mois ») |
| `mots_echanges` | deux petits mots qui s'échangent | `cache?` (bool — mot caché à découvrir) |
| `deux_portraits` | deux cartes « portrait » côte à côte | — |
| `boite_capsule` | une boîte/capsule scellée | — |

Au vocabulaire ci-dessus s'ajoute un type spécialisé :

| `type` | Aperçu à dessiner | Champs portés |
|---|---|---|
| `menu` | une **vraie carte de restaurant** (voir détail ci-dessous) | `entete`, `maison?`, `sections[]`, `items_sont_des_exemples?`, `note?` |

*(`maison` utilise le token `{prenom}` → « Maison {prenom} » se personnalise automatiquement avec le prénom de l'enfant.)*

#### ⭐ `type:"menu"` — rendu en carte de restaurant (M15 « Le menu des limites »)

Objectif : matérialiser le challenge sous la forme **visuelle d'un menu**, pas en prose. Le `deroule` reste affiché au-dessus comme « comment faire » ; la carte, elle, est dessinée à partir du `gabarit`.

**Structure du gabarit** :
```json
"gabarit": {
  "type": "menu",
  "entete": "Menu des limites de la semaine",
  "maison": "Maison {prenom}",
  "sections": [
    { "titre": "Entrées", "sous_titre": "les petites limites quotidiennes…",
      "exemples": [ { "intitule": "Les chaussures restent dans l'entrée", "descripteur": "servi dès le retour à la maison" } ] }
  ],
  "items_sont_des_exemples": true,
  "note": "Exemples illustratifs — à composer vous-mêmes…"
}
```

**Rendu attendu** (carte sur fond papier `#FBF4EC`, double filet intérieur `#ECDCCB`, bord `#DCC7B4`) :
1. **En-tête centré** : petit ornement (`✦ ❦ ✦`, couleur `#C8806A`), puis `entete` en **Playfair 700 ~17px**, puis `maison` en petites capitales `#8A4030`, puis un filet fin.
2. **Pour chaque `section`** : `titre` en **Playfair 600**, petites capitales centrées `#8A4030` (Entrées / Plats / Desserts) ; `sous_titre` en **italique** `#8A9E98` centré juste dessous.
3. **Pour chaque exemple** : `intitule` à gauche, **ligne de points** (leader pointillé `#D9C6B4`) façon carte, et le `descripteur` **en italique `#C8806A`** sous l'intitulé (le clin d'œil « gastronomique »).
4. Si `items_sont_des_exemples` = true : afficher un petit badge discret **« à composer vous-mêmes »** près du titre ou en pied, et **2-3 lignes vides** (leaders pointillés) à la fin de la dernière section pour signifier que les parents complètent eux-mêmes — **aucune saisie in-app** (papier).
5. **Pied** : `note` en italique centré, filet au-dessus.

Couleurs : palette **Famille A** (challenge). Le `descripteur` italique pêche-foncé est l'élément clé qui donne le ton « carte de restaurant » — ne pas l'omettre. Maquette de référence : `maquette_menu_limites_M15.html`.

> **Anti-redondance (important).** Quand un `gabarit` embarque déjà les exemples (cas du `menu` : `sections`/`exemples`), **ne pas les répéter dans le `deroule`** : le `deroule` décrit la *méthode*, le `gabarit` porte la *structure et les exemples*. Vaut pour tout gabarit qui contient des libellés/exemples.

> Ce patron `menu` est réutilisable si un autre mois propose un challenge « en liste/carte thématique » ; sinon les autres challenges restent sur les types simples ci-dessus.

---

## 7. Pictos SVG (trait — `viewBox 0 0 24 24`, `stroke-linecap/linejoin round`)

Couleur : **slot** pour le picto 32 px d'en-tête ; **noir `#3A3228`** pour les cases de l'accueil ; **`#C8806A`** pour les pictos d'accent dans les cadres.

```
main (1)        : <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 11V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M17 12V8a1.5 1.5 0 0 1 3 0v6a6 6 0 0 1-6 6h-2.5a5 5 0 0 1-3.9-1.9L4 13.5a1.6 1.6 0 0 1 2.5-2L8 13.5"/>
casque (2)      : <path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="7" rx="2"/><rect x="17" y="13" width="4" height="7" rx="2"/>
fleur (3)       : <circle cx="12" cy="12" r="2"/> + 6× <ellipse cx="12" cy="6.8" rx="1.8" ry="2.8" transform="rotate(k 12 12)"/> (k=0,60,120,180,240,300)
tourbillon (4)  : spirale d'Archimède ~2,75 tours, virgule au centre — tracé exact dans components/modules/soin-design.tsx (PICTO_CASE[4])
deux cœurs (5)  : <path d="M9.5 16s-4.5-2.9-4.5-6.2A2.4 2.4 0 0 1 9.5 8a2.4 2.4 0 0 1 4.5 1.8C14 13.1 9.5 16 9.5 16z"/><path d="M15.5 19s-3.6-2.3-3.6-5A1.9 1.9 0 0 1 15.5 12a1.9 1.9 0 0 1 3.6 1.5c0 2.7-3.6 5-3.6 5z"/>
horloge (chip)  : <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>
coche (indic)   : <polyline points="20 6 9 17 4 12"/>
alerte (urgence): <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12.5"/><circle cx="12" cy="16" r=".6" fill="currentColor"/>
étoile (règle)  : <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.6 5.8 21 7 14 2 9.3 9 8.5 12 2"/>
```

---

## 8. Checklist de validation (toute la rubrique)

- [ ] **Accueil** : tient sur un écran, bandeau Cream inchangé, pas de fil d'Ariane, grand titre `promesse_du_mois` + « Prendre soin de moi » dessous, intro intégrale (réécrite courte, sans troncature), 5 cases 82 % alternées, cercles picto blanc transparent, picto/phrase/flèche **noirs**, chevrons présents.
- [ ] **Détails** : picto 32 px en couleur de slot centré, eyebrow `nom_outil` + H1 `promesse` Playfair.
- [ ] **Titres harmonisés** (§4.3) : `text-wrap: balance`, aucun `<br>` manuel, liens insécables article→nom et pronom→verbe via `formatTitre()`, coupure naturelle sur la ponctuation, **2 lignes max**.
- [ ] **Titres de section intégrés dans les cadres** (label eucalyptus en haut du bloc), partout.
- [ ] Palette chaude + neutres uniquement, **aucun bleu** ; Coral réservé au cadre d'urgence.
- [ ] **Espaces insécables** du JSON préservées au rendu ; règle réappliquée à tout texte assemblé dynamiquement.
- [ ] « dépression post-partum » jamais abrégée (cf. SKILL_contenu).
- [ ] Post-partum : Signaux en cadre **gris** (puces grises, pas de croix rouge) ; **3114** en gras dans le cadre d'urgence rouge ; Qui consulter en cadre gris très clair fermé.
- [ ] Méditation : lecteur **juste au-dessus** du texte ; `[pause]` rendues en repères discrets.
- [ ] Auto-massage : 4 points en lignes numérotées, durées en gras.
- [ ] Mapping fait par **`numero`** (jamais `id`).

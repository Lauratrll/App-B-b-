# CONSIGNES CLAUDE CODE — Animation des zones de « Réflexologie »

**Statut : validé.** Les 33 zones ont un mouvement défini et approuvé. Prêt pour l'intégration dans l'app et la compilation des protocoles.

| Fichier | Rôle |
|---|---|
| `pieds_bebe_zones_reflexes.svg` | Source graphique — les deux pieds + les groupes de zones |
| `pieds_bebe_zones_reflexes.ai` | Source Illustrator (édition des zones) |
| `zones-mouvements.json` | **Catalogue** : pour chaque zone, son mouvement, son libellé, ses réglages |
| `mouvement-zone-tete.html` | Prototype validé — **pression circulaire** |
| `mouvement-pression-maintenue.html` | Prototype validé — **pression maintenue** |
| `mouvement-pression-glissee.html` | Prototype validé — **pression glissée** |
| `mouvement-boucles-progressives.html` | Prototype validé — **boucles progressives** |
| `mouvement-spirale-centripete.html` | Prototype validé — **spirale centripète** |
| `mouvement-zone-digestive.html` | Prototype validé — **composite** |

Chaque prototype est un fichier HTML autonome (SVG inliné + JS). Il sert de **référence de comportement** : le code de l'app doit reproduire ces animations, pas réinventer la mécanique.

---

## 1. Objectif

Dans un protocole, on affiche **une zone réflexe** et **le mouvement** que le parent applique sur les pieds de son bébé. Le parent regarde l'animation et reproduit le geste.

Règle : **une zone = un mouvement**. Les textes de protocole (qui varient selon le sujet) viendront se greffer plus tard. Le seul texte associé au mouvement à ce stade est sa **description**.

C'est un accompagnement au bien-être du nourrisson : les rythmes ont été volontairement réglés **lents et doux**. Ne pas les accélérer sans raison.

---

## 2. Fichier source SVG — règles absolues

- `viewBox="0 0 1264 848"` — **ne jamais modifier** : toutes les coordonnées en dépendent.
- Export en **attributs de présentation** (`fill=`, `stroke=`…), pas de CSS interne, pas de classes.
- Aucune image matricielle, aucun masque d'écrêtage résiduel, aucun effet non décomposé.

### Structure des `id`

| Groupe | Contenu |
|---|---|
| `pied-gauche`, `pied-droit` | L'illustration des pieds. **Ne jamais animer.** |
| `zone-<nom>-g` / `zone-<nom>-d` | Une zone réflexe. `-g` = pied gauche, `-d` = pied droit. |

### Trois pièges de lecture — à connaître impérativement

1. **Le pied `-d` (droit) s'affiche à GAUCHE de l'image**, et inversement (vue plantaire). Le « côté gros orteil » de chaque pied est vers le **centre** de l'image.
2. **La plupart des zones sont des miroirs** l'une de l'autre (symétrie autour de `x = 632`) — mais **pas toutes** (voir §9).
3. **Le préfixe est trompeur.** `zone-colonne-vertebrale-` est un préfixe de `zone-colonne-vertebrale-contour-`. **Toujours comparer les `id` par égalité exacte**, jamais par `startsWith`, sinon deux zones différentes s'affichent ensemble.

### Deux natures d'élément

- **Surface** : `<path>` rempli (`fill`). La plupart des zones.
- **Trait** : `<path>` en `fill:none` + `stroke-width` (ex. `zone-thyroide`). Le chemin **est déjà la ligne médiane** : ni squelette à extraire, ni détourage.
- **Points** : `<circle>` parfaits (zones de pression maintenue).

---

## 3. Règles transversales — valables pour TOUS les mouvements

### Couleur

**Le mouvement se fait toujours dans la couleur de la zone définie dans le SVG. Aucune teinte ne doit être inventée.** C'est l'**opacité** qui porte l'information.

| État | Opacité |
|---|---|
| Zone au repos | `0.30` |
| Traînée (le sillage derrière le doigt) | `0.60` en pression circulaire · `0.75` partout ailleurs |
| Zone terminée | `0.90` — **la valeur du SVG d'origine** |
| Doigt | `1` |

La traînée est plus transparente en pression circulaire parce que le doigt y repasse plusieurs fois : il doit rester lisible par-dessus son propre sillage.

### Comportement commun

- **Détourage obligatoire.** Chaque mouvement est enfermé dans un `clipPath` bâti sur le `path` de la zone. **Aucun débordement n'est acceptable.**
- **Le doigt disparaît** à la fin du mouvement ; seul l'état terminé (0.90) reste affiché avant la reprise en boucle.
- **Fondu de fin.** Sur la fin du dernier passage, la zone monte vers 0.90 pendant que la traînée se résorbe (fondu croisé) — sinon la traînée reste visible sous un remplissage devenu translucide.
- **Anti-artefact.** Tant qu'un mouvement n'a pas commencé, mettre sa traînée en `visibility:hidden`. Un `stroke-dashoffset` seul laisse apparaître un disque fantôme (trait large à bouts ronds).
- **Boucle en `requestAnimationFrame`**, jamais `setInterval`. `getTotalLength()` calculé une seule fois au montage.
- **Deux pieds simultanés et en miroir** par défaut (sauf exceptions du §9).

### Le nombre de passages est propre à chaque zone

Il est porté par le champ `passages` du catalogue. Le lire, ne pas le recalculer.

---

## 4. Mouvement A — Pression circulaire

**Cible :** zones « surface » sur les orteils. **Description :** « Exercez une pression circulaire sur les orteils »

Pour **chaque orteil**, dans l'ordre (gros orteil → petit), les deux pieds en miroir : un **doigt opaque** parcourt une spirale continue de **3 tours**, laisse une traînée, et en fin de parcours la zone se fige à 0.90. L'orteil terminé reste colorié pendant que le mouvement passe au suivant.

| Paramètre | Valeur |
|---|---|
| `TOURS` | `3` |
| `LARGEUR` (Ø doigt = rmax × …) | `1.30` |
| `R0 → R1` (rayon d'orbite ×rmax) | `0.12 → 0.38` |
| `SEUIL_FIN` | `0.78` |
| `T_MVT` (orteil de référence) | `6300` ms |
| `EXP` (proportionnalité vitesse) | `1` — **vitesse linéaire constante** |
| `T_PAUSE` / `T_FIN` | `620` / `1500` ms |

`rmax = max(largeur, hauteur bbox) / 2 × 1.15`. **Départ bas-intérieur** (angle `π/4` pour `-d`, `3π/4` pour `-g`), rotation qui remonte par le côté intérieur. Un seul tracé continu pour les 3 tours (pas de coupure). Doigt positionné avec `getPointAtLength(L×k)` sur le tracé de la traînée.

**Zones concernées :** tete, estomac, foie, rate, intestin-grele *(voir catalogue pour l'affectation finale ; certaines de ces zones ont été réaffectées — le catalogue fait foi)*.

---

## 5. Mouvement B — Pression maintenue

**Cible :** zones « points » (cercles). **Description :** « Exercez une pression douce et maintenue, puis relâchez »

Un passage dure 7 s :

| Phase | Durée | Effet | Affichage |
|---|---|---|---|
| Pose | `T_POSE` 1000 ms | Un disque plein grandit **depuis le centre** | « Posez le doigt » |
| Maintien | `T_MAINTIEN` 3000 ms | Disque plein + **3 ondes**, une par seconde | décompte 3-2-1 |
| Relâchement | `T_RELACHE` 3000 ms | Le disque se rétracte vers le centre | décompte 3-2-1 |

Réglages : `T_RETRAIT` 900 ms · ondes `N_ONDES` 3, `ONDE_ECART` 1000, `ONDE_DUREE` 1000, `ONDE_EXPANSION` 1.50, `ONDE_OP` 0.38.

**Non négociable :** le rayonnement ne démarre **qu'une fois le disque plein** (à `T_POSE`), c'est une **surface pleine translucide** (pas un anneau), et il passe **sous** les groupes de zones (l'appui au-dessus), sinon le halo voile le point.

**Passages :** `CYCLES_SIMPLE = 3` (zone à point unique) · `CYCLES_MULTI = 2` (zone à plusieurs points).

**Plusieurs points par pied** (ex. ganglions lymphatiques, 4 points) : **un seul point actif à la fois**, du plus proche du gros orteil vers l'extérieur (= ordre des `<circle>` dans le SVG), les autres restant visibles à 0.30 ; transition de 1 s entre deux points ; les deux pieds appariés par indice (symétrie automatique).

**Zones (11) :** plexus-solaire, point-conception, rein, surrenales, thymus, cardia, hypophyse, bouche, epiphyse, vesicule, ganglions-lympahtiques.

---

## 6. Mouvement C — Pression glissée

**Cible :** zones en bande, et orteils un par un. **Description :** « Faites glisser le pouce le long de la zone »

Un **doigt opaque** glisse le long de la **ligne médiane** de la bande, laisse une traînée qui s'efface en fondu (`T_EFFACE` 550 ms) entre deux passages, puis repart du départ. Au dernier passage, la zone se fige (`SEUIL_FIN` 0.82).

**Extraction du rail :** les zones sont des bandes pleines, pas des lignes. Dériver la **ligne médiane** :
- Bande simple (axe franc) → balayer perpendiculairement à l'axe dominant (détecté par la bbox).
- Bande courbe (colonne-contour, gros-intestin…) → **squelette / axe médian** (skeletonize).
- Zone au trait (thyroïde) → le `path` est déjà la médiane.
Stocker chaque point `[x, y, épaisseur locale]`.

**Le doigt épouse la largeur du trait :** `r = max(épaisseur_locale/2 × 1.15, épaisseur_max × 0.18)`. Le plancher évite qu'il disparaisse aux extrémités effilées.

**Vitesse constante** obligatoire (`VITESSE_PX = 0.105` px/ms), car les zones vont de 68 à 944 px (`T_MIN` 2000, `T_MAX` 7000 ms). À durée fixe le doigt filerait sur les longues et ramperait sur les courtes.

**Zones à plusieurs orteils** (dents haut, dents bas, amygdales) : chaque orteil est un petit glissé, enchaînés du gros orteil vers le petit ; **vitesse constante `VITESSE_EL`** (durée de chaque orteil ∝ sa longueur, le gros orteil dure donc plus longtemps) ; plancher `T_MIN_EL2` 800 ms ; une zone peut avoir sa propre `vitesse_el` (les amygdales sont un peu plus lentes). Passages : 2.

**Zones (12) :** diaphragme, colonne-vertebrale, colonne-vertebrale-contour, oesophage, cou, bassin-ancrage, gros-intestin, thyroide, dents-machoire-haute, dents-machoire-bas, amygdales, oreilles-nez.

Deux sous-cas particuliers dans ce fichier :
- **gros-intestin** : cheminement enchaîné entre les pieds (voir §9).
- **oreilles-nez** : zone en croix, mode « groupe » — un passage = toute la croix (le nez de haut en bas, puis les oreilles en travers), répété 3 fois.

---

## 7. Mouvement D — Boucles progressives

**Cible :** grandes surfaces. **Description :** « Effectuez de petits cercles qui avancent »

Un **gros doigt** (Ø réaliste) parcourt une **spirale de boucles qui se croisent** et avance d'un bord à l'autre, coloriant toute la surface. Traînée + fige comme les autres. `SEUIL_FIN` 0.85, `T_EFFACE` 550.

**Points clés :**
- Les boucles doivent **se croiser** : l'amplitude horizontale doit dépasser `π × avance_par_radian` (sinon on obtient des traits verticaux séparés). Réglage retenu : `bx = 4·a`.
- **L'amplitude épouse le contour** : relever le profil vertical de la forme, la boucle repart quand le cercle du doigt touche le bord. Boucles plus hautes au centre, plus courtes aux extrémités.
- **Départ par le bord** : le tracé commence par peindre la **bordure** (petit passage vertical) avant de dérouler les boucles — sinon la première boucle doit revenir en arrière colorier le bord.

| Zone | Boucles | Ø doigt | Sens | Passages | Durée/passage |
|---|---|---|---|---|---|
| poumon | 6 | 44 | intérieur → extérieur | 3 | 8600 ms |
| pancreas | 4 | 30 | côté gros orteil → extérieur, **2 pieds en même temps** | 3 | 5000 ms |
| estomac | 3 | 28 | côté gros orteil → extérieur, **2 pieds en même temps** | 3 | 5000 ms |

---

## 8. Mouvement E — Spirale centripète

**Cible :** talon (surfaces rondes). **Description :** « Effectuez un mouvement circulaire de l'extérieur vers le centre »

Une spirale qui part du **bord extérieur et se resserre vers le centre** (l'inverse de la pression circulaire des orteils). Gros doigt pour tout colorier. Traînée + fige (`SEUIL_FIN` 0.85).

| Zone | Tours | Ø doigt | Départ | Miroir ? | Passages | Durée/passage |
|---|---|---|---|---|---|---|
| bassin | 3 | 54 | haut-gauche, extérieur → centre | **NON** (même sens sur les 2 talons) | 3 | 6000 ms |
| intestin-grele | 3 | 48 | extérieur → centre, sens horaire | **NON** | 3 | 5000 ms |

---

## 9. Mouvement F — Composite (zone digestive)

Une zone peut combiner **deux mouvements successifs**. La digestive (2 éléments) :
1. **Le trait** (bande verticale) en pression glissée, haut → bas, **3 passages** (`T_TRAIT` 2600 ms).
2. Puis **la grande surface** (talon) en boucles progressives, **du centre vers l'extérieur**, départ par le bord, **3 passages** (`T_SURF` 9000 ms — geste très lent, adapté au nourrisson).

Le trait reste colorié pendant que la surface se remplit.

---

## 10. Exceptions à la symétrie miroir

La plupart des zones sont des miroirs (on extrait un tracé et on le mirroite). **Trois zones ne le sont pas** — chaque pied a sa propre forme, il faut extraire un tracé par pied :

- **gros-intestin** (recouvrement miroir 0.30) : c'est un **cheminement enchaîné**, pas deux gestes simultanés. Le **pied droit d'abord** (départ par le bas), puis le **pied gauche prend le relais** (son point de départ = celui le plus proche du point d'arrivée du pied droit, en miroir). Le pied gauche est plus long (il porte plus de côlon).
- **estomac** (0.49) et **intestin-grele** (0.58) : formes différentes par pied, mais joués **en même temps** (pas de relais).

Le champ `miroir: false` du catalogue signale ces cas. **Ne pas les « corriger » en croyant rétablir une symétrie.**

---

## 11. Le catalogue `zones-mouvements.json`

C'est le fichier que l'app lit. Une entrée par zone :

```json
{
  "id": "plexus-solaire",
  "designation": "le plexus solaire",
  "cibles": ["zone-plexus-solaire-d", "zone-plexus-solaire-g"],
  "forme": "points",
  "mouvement": "pression-maintenue",
  "description_mouvement": "Exercez une pression douce et maintenue, puis relâchez",
  "sequence": "point-unique",
  "passages": 3,
  "valide": true
}
```

Champs utiles : `mouvement` (un des 6 types), `forme` (points / surface / trait), `sequence`, `sens`, `passages`, et les durées spécifiques (`duree_passage_ms`, `duree_surface_ms`, `vitesse_px_ms`…) quand une zone a été réglée à part. `designation` = **le nom avec son article** (`"la tête"`, `"les poumons"`), stocké en minuscules.

---

## 12. Libellé de la zone à l'écran

> **zone réflexe représentant** *la tête*

| Partie | Contenu | Traitement |
|---|---|---|
| Amorce (constante, jamais stockée) | `zone réflexe représentant` | CAPITALES à petite taille (≈ 9 px), Eucalyptus `#8A9E98`, interlettrage — via `text-transform: uppercase`, **pas** `small-caps` |
| Désignation (champ `designation`) | ex. `la tête` | Typographie de titre (Playfair Display), noir `#3A3228` |

Même principe d'alternance que « Guide-moi ! » (titre) / « mais n'oublie jamais » (capitales Eucalyptus).

---

## 13. Contraintes rédactionnelles — tout texte affiché

- **« massage »** : autorisé en contexte bien-être uniquement, avec parcimonie. **« caresse » reste interdit** (même nié).
- **Aucune échelle de pression chiffrée** (une durée en secondes reste permise).
- Vocabulaire : *toucher, pression douce, geste doux, stimulation des zones réflexes, geste de balayage*.
- **« Réflexologie »** toujours en toutes lettres, guillemets français « » avec espaces insécables.

---

## 14. Notes d'implémentation

- Composant React, **SVG inliné** (pas de `<img>` : les `id` doivent être dans le DOM).
- Zones non concernées par le protocole en `display:none`.
- Respecter `prefers-reduced-motion` : proposer un état statique (zone coloriée, sans mouvement).
- Écran de protocole prévu en **mode paysage**.

---

## 14 bis. Nouvelle zone `sacrum-lombaire` (pression glissée)

`zone-sacrum-lombaire-d/g` est une **bande verticale** le long du bord intérieur bas du pied (sacrum + lombaires). Elle se joue **exactement comme la colonne vertébrale** : mouvement **pression glissée**, extraction de la ligne médiane (squelette), glissé du pouce le long de la bande, **du haut vers le bas**, 3 passages. **Aucun nouveau prototype à créer** — réutiliser la mécanique de `mouvement-pression-glissee.html` en pointant sur `zone-sacrum-lombaire-d/g`. Utilisée pour l'**étape 1 des Coliques**.

## 14 quater. Nouvelle zone `systeme-urinaire` (trajet, mouvement composite)

`zone-systeme-urinaire-d/g` est un **trajet** : deux points (rein en haut, vessie en bas) reliés par un trait épais. Mouvement **composite** — enchaînement en 3 temps, **répété 3 fois** :

1. **Pression maintenue ~3 s** sur le point **vessie** (cercle du bas) ;
2. **Pression glissée lente** le long du trait, **de la vessie vers le rein** ;
3. **Pression maintenue** sur le point **rein** (cercle du haut).

Le doigt part donc de la vessie et remonte. Utilisée à l'**étape 10 de Confiance en soi**.

## 14 ter. Variantes « sens inverse » — protocole Diarrhée

Dans **Diarrhée uniquement**, deux étapes se jouent dans le **sens inverse** du geste habituel (champ `"sens": "inverse"` sur la zone) :

- **Intestin grêle (étape 10)** : même tracé que d'habitude, mais **parcouru à l'envers** — inverser l'ordre des points (`getPointAtLength` de `L` vers `0`), le doigt part du point d'arrivée normal.
- **Gros intestin (étape 11)** : parcours inversé **du bas du pied gauche vers le bas du pied droit** (le geste normal va du pied droit vers le pied gauche). Inverser la séquence des segments du cheminement.

Le tracé, la vitesse et le rendu restent identiques ; **seul le sens de parcours change**. Prévoir un paramètre `reverse` dans le composant de cheminement plutôt que dupliquer le code.

## 15. Reste à faire (hors animation)

- La couche de **textes de protocole**, variable selon le sujet — à brancher sur les zones.
- L'articulation avec les **8 catégories de « Guide-moi ! »** et leurs couleurs.
- Vérifier côté réflexologie le **sens du gros intestin et de l'intestin grêle** (déduits du sens de la digestion, non confirmés cliniquement).
- Petites coquilles d'`id` dans le SVG, sans impact sur le code mais à corriger un jour : `ganglions-lympahtiques` (lettres inversées).

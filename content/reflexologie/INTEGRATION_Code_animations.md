# Intégration des animations — pour Claude Code

Ce document existe parce que les animations, une fois codées, **ne correspondaient pas** aux mouvements validés. La cause : le code **re-dérive** les gestes à partir des descriptions en prose, au lieu de **reproduire** ce qui a déjà été validé. Voici la méthode et les ressources pour le faire fidèlement.

## Principe n°1 — Les prototypes sont la VÉRITÉ

Les six fichiers `mouvement-*.html` sont des animations **validées** (SVG inliné + JS autonome). Ils ne sont pas des illustrations : c'est le **comportement de référence exact**.

- **Réutiliser leur moteur** (la boucle `requestAnimationFrame`, le calcul du rail, le placement du doigt, les traînées, le fondu de fin). Ne pas réécrire une logique « équivalente » de mémoire.
- Ouvrir le prototype, lire sa fonction d'animation, la porter en React **à l'identique** (mêmes phases, mêmes constantes, mêmes easings).

| Mouvement | Prototype de référence |
|---|---|
| Pression circulaire | `mouvement-zone-tete.html` |
| Pression maintenue | `mouvement-pression-maintenue.html` |
| Pression glissée | `mouvement-pression-glissee.html` |
| Boucles progressives (cercles avancés) | `mouvement-boucles-progressives.html` |
| Spirale centripète (bassin) | `mouvement-spirale-centripete.html` |
| Composite | `mouvement-zone-digestive.html` |

## Principe n°2 — Les constantes viennent d'un fichier, pas de la prose

**`PARAMS_animation.json`** contient les **valeurs exactes** de chaque mouvement (durées, vitesses, easings, opacités, nombre de passages), extraites des prototypes. Le code lit ces valeurs. Ne pas « estimer » une durée ou une vitesse.

Rappels critiques qui y figurent :
- **Couleur = celle du SVG**, jamais inventée. L'information passe par l'**opacité** (repos 0.30 · traînée 0.75 · terminé 0.90).
- **Le coloriage RESTE** au passage (surligneur). Pas de « ver qui avance ». Le fondu (`T_EFFACE` 550 ms) n'agit qu'**entre** deux passages ; au dernier, la zone se fige à 0.90.
- **Clip obligatoire** sur la forme de la zone ; pour couvrir toute une zone, **brosse large clippée**.
- Vitesse glissée **constante** `0.105 px/ms`. Maintien **3000 ms** + 3 ondes. Circulaire **3 tours**, etc.

## Principe n°3 — Les tracés sont précalculés

**`RAILS_zones.json`** donne, pour les zones en bande / trajectoire, le **polyligne médian précalculé** (coordonnées viewBox `0 0 1264 848`), par pied. Le doigt suit ce rail. **Ne pas re-squelettiser** les zones dans le code (source n°1 de divergence de forme). Zones fournies : colonne, colonne-contour, **colonne-nerf-vague**, sacrum-lombaire, oesophage, cou, diaphragme, bassin-ancrage, gros-intestin, intestin-grêle, système urinaire, nez (croix), oreilles. *(La thyroïde est une zone au trait : son `path` SVG est déjà la médiane.)*

## Les cas particuliers à ne pas rater (détaillés dans PARAMS `overrides_par_zone`)

- **Gros intestin** : suivre la **ligne médiane du ruban** (le trait), pas le contour. **Deux gestes séparés, aucun trait entre les pieds.** Coloriage **persistant, clippé, brosse large** → toute la zone. Sens inverse (Diarrhée) = pied gauche d'abord (départ **côté intérieur du talon**), puis pied droit.
- **Intestin grêle** : **cercles avancés** (pas une spirale — la spirale, c'est le bassin). Départ **bord extérieur → intérieur**. Les **deux pieds finissent en même temps** (fraction commune `u=t/durée`, chaque pied dévoile `u × sa_longueur`).
- **Système urinaire** : composite **maintenue vessie 3 s → glissée lente → maintenue rein 3 s**, ×3.
- **Nez** : glissée en **croix** (vertical haut→bas, puis horizontal du bord vers les orteils), 1 passe ×3.
- **Oreilles** : glissée **de l'intérieur vers l'extérieur**, 3 passages.
- **Colonne + nerf vague** : **un seul** geste (version allongée de la colonne), **à la place** de la colonne dans Prématurité et Mal des transports.
- **Bassin** : spirale seule, **sauf** Accueil du nouveau-né (spirale + ancrage).

## Principe n°4 — Un moteur prêt à brancher

**`reflexo-anim.js`** est le **moteur autonome** (vanilla JS, sans dépendance) qui implémente les six mouvements + les cas particuliers, en lisant `PARAMS_animation.json`, `RAILS_zones.json` et le catalogue. Plutôt que de réécrire la mécanique, **réutiliser ce module** :

```js
const player = ReflexoAnim.create(svgElement, { catalog, rails, params });
await player.playZone('colonne-vertebrale');   // un geste (2 pieds)
await player.playProtocol(protocoleJson, (etape) => { /* afficher le texte de l'étape */ });
player.stop();
```

**`reflexo-anim-demo.html`** est une **démo ouvrable** : elle charge le vrai SVG + le moteur + les rails et joue n'importe quelle zone ou n'importe quel protocole. Elle sert de **preuve de fonctionnement** et d'exemple d'intégration. Comparer son rendu aux prototypes `mouvement-*.html`.

> Portage React : envelopper `ReflexoAnim.create` dans un composant qui rend le SVG inliné et pilote le player (play/pause/étape). Le moteur, lui, ne change pas.

## Ordre de travail conseillé

1. Porter le moteur d'un prototype (commencer par `pression-glissee`), en lisant `PARAMS_animation.json`.
2. Brancher les rails depuis `RAILS_zones.json`.
3. Comparer le rendu à l'aperçu `apercu-mouvements-a-valider.html` et au prototype **côte à côte**.
4. Appliquer les overrides par zone.
5. Ne considérer un mouvement « fait » que s'il est **indiscernable** du prototype.

## Fichiers de référence

`mouvement-*.html` (comportement) · `PARAMS_animation.json` (constantes) · `RAILS_zones.json` (tracés) · `apercu-mouvements-a-valider.html` (comparaison visuelle) · `CONSIGNES_CLAUDE_CODE_animation_reflexologie.md` (détail par mouvement) · `pieds_bebe_zones_reflexes.svg` (illustration + zones).

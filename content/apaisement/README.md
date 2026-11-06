# README : rubrique « Gestes d'apaisement » (boîte à outils)

Pour Claude Code : spécification complète dans `docs/apaisement notes/BRIEF_Claude_Code_gestes_apaisement.md`.

## Contenu de ce dossier
- `Gestes_apaisement_reference.xlsx` : **source de vérité**. Laura complète et corrige les textes ici (titres, mois, familles, objectif, pas à pas, cadre de sécurité, pourquoi, sources). Le gras et l'italique des cellules sont repris dans le JSON.
- `gestes_apaisement.json` : **généré** depuis le classeur. Ne jamais l'éditer à la main : il serait écrasé à la prochaine génération.

## Régénérer le JSON après une correction du classeur
`python scripts/export_gestes_apaisement.py` (depuis la racine du projet ; nécessite `openpyxl`). Le script réécrit aussi `docs/apaisement notes/Gestes_apaisement_textes_lisibles.md`, la version lisible des textes pour la relecture.

## Règles
Seules les lignes dont la colonne Décision est « Valider » sont exportées. Chaque geste a **un seul onglet** (colonne V : Mal de ventre, gaz / Stop pleurs / Détente / Portage / Guide) et un **ordre dans l'onglet** (colonne W). Les anciennes colonnes de familles (F à L) sont masquées et ne sont plus lues. Le script s'arrête avec un message si un geste validé n'a pas d'onglet. La colonne « Ce qui apaise », les notes internes, les remarques et les sources de formation ne sont jamais exportées. Le gras du tableau devient `**…**` et l'italique `*…*` : l'app les rend en gras et en italique, sans afficher les astérisques.

## Statut (05/11/2026)
Descriptions écrites à valider (mention « Description en cours de création » affichée). Visuels à réaliser (« Contenu visuel en cours de réalisation »).

## Hors périmètre
Le dossier est ignoré par `scripts/import-content.mjs` (qui ne lit que guide-moi, coucher, prendre-soin, saison, jeux). Le JSON est lu par l'app en import statique ; `scripts/import-apaisement.mjs` ne crée que les lignes d'épingles.

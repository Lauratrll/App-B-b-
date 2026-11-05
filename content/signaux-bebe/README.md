# README — Rubrique « Que me dit bébé ? » (outil d'analyse du comportement)

Pour Claude Code : spécification complète dans `PROMPT_que_me_dit_bebe.md` (à la racine du projet).

## Contenu de ce dossier
- `Signaux_bebe_reference.xlsx` : **source de vérité**. Laura corrige ici (questionnaire, points, alertes, sources).
- `signaux_bebe.json` : **généré** depuis le classeur par `scripts/export_signaux_bebe.py`. Ne jamais l'éditer à la main.

## Régénérer le JSON après une correction du classeur
`python scripts/export_signaux_bebe.py content/signaux-bebe/Signaux_bebe_reference.xlsx content/signaux-bebe/signaux_bebe.json`

## Statut (05/11/2026)
Brouillon de travail. Les alertes doivent être relues par un professionnel de santé avant toute ouverture aux parents. Les lignes marquées « à valider » ou « non sourcé » dans le classeur ne sont pas tranchées.

## Règles
Pistes, pas diagnostic. Aucune donnée de l'utilisateur enregistrée. Ne jamais afficher les sources internes (formation EDPP, enquête interne) ni les notes internes. Voir le prompt pour le détail.

## Hors périmètre
Le fichier est ignoré par `scripts/import-content.mjs` (qui ne lit que guide-moi, coucher, prendre-soin, saison, jeux) et par `scripts/qa_contenu.py` (le JSON n'a ni `protocoles` ni `categories`).

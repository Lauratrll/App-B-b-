# README — Rubrique « Que me dit bébé ? » (outil d'analyse du comportement)

Pour Claude Code : spécification complète dans `PROMPT_que_me_dit_bebe.md` (à la racine du projet).

## Contenu de ce dossier
- `Signaux_bebe_reference_v2.xlsx` : **source de vérité** du questionnaire « pleurs » court (6 écrans, 41 réponses, 06/11/2026). Laura corrige ici.
- `signaux_bebe_v2.json` : **généré** depuis le classeur v2 (lu par l'app). Ne jamais l'éditer à la main.
- Version 1 (77 réponses, `Signaux_bebe_reference.xlsx` + `signaux_bebe.json`) : **rangée, intacte, dans `docs/signaux-bebe-v1/`** pour un futur questionnaire sommeil. Pour recréer le classeur v2 : `python scripts/build_signaux_bebe_v2.py docs/signaux-bebe-v1/Signaux_bebe_reference.xlsx content/signaux-bebe/Signaux_bebe_reference_v2.xlsx`.

## Régénérer le JSON après une correction du classeur
`python scripts/export_signaux_bebe.py content/signaux-bebe/Signaux_bebe_reference_v2.xlsx content/signaux-bebe/signaux_bebe_v2.json`
puis `python scripts/calc_tests_signaux_bebe.py content/signaux-bebe/Signaux_bebe_reference_v2.xlsx content/signaux-bebe/signaux_bebe_v2.json` (tests_attendus), puis `node scripts/test-signaux-bebe.mjs`.

## Statut (05/11/2026)
Brouillon de travail. Les alertes doivent être relues par un professionnel de santé avant toute ouverture aux parents. Les lignes marquées « à valider » ou « non sourcé » dans le classeur ne sont pas tranchées.

## Règles
Pistes, pas diagnostic. Aucune donnée de l'utilisateur enregistrée. Ne jamais afficher les sources internes (formation EDPP, enquête interne) ni les notes internes. Voir le prompt pour le détail.

## Hors périmètre
Le fichier est ignoré par `scripts/import-content.mjs` (qui ne lit que guide-moi, coucher, prendre-soin, saison, jeux) et par `scripts/qa_contenu.py` (le JSON n'a ni `protocoles` ni `categories`).

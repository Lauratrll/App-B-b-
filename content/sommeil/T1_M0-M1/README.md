# Tranche M0–M1 · un fichier par slot

- `00_entete.md` : titre de la tranche et notes (commentaires, non affichés).
- `01_` à `08_` : un fichier par slot, dans l'ordre d'affichage. Le slot 08 « Thème du mois » est un brouillon : thèmes à valider, `docs/sommeil-contenus/31_...`.
- Les sources sont numérotées par slot (chaque fichier repart de ¹).
- `../reperes_cles.json` : données de la roue du sommeil du mois (slot 01, sans texte), clés "0" et "1".
- `_tranche_complete.md` : **généré** par `npm run dev` / `build` (assemblage de tous les fichiers). **À lire en entier pour la relecture** ; ne pas le modifier, il est réécrit à chaque génération.
- Ancienne version avant les slots : `../_sauvegardes/2026-10-29_T1_avant_slots/`.
- Volets « M0 · » / « M1 · » : voir `docs/sommeil-contenus/48_prompt_code_slots_T1_M0-M1.md`.

# README — Rubrique SOS « Faut-il consulter ? » (titre provisoire)

Pour Claude Code : contenu validé à intégrer dans l'app.

## Ce que c'est
Bouton SOS qui remplace l'onglet « Partager & rassurer ». Repères officiels pour savoir quand consulter : fièvre, diarrhée et vomissements, difficultés à respirer. Deux sections : « Avant 3 mois » et « À partir de 3 mois ».

## Règles à respecter (non négociables)
1. **Transmission, pas transformation** : tout texte entre « » est cité mot pour mot (ameli.fr ou carnet de santé). Ne jamais reformuler, raccourcir ni corriger.
   ⚠ **Exception assumée à la règle 8 du CLAUDE.md** (« droits d'auteur — contenu toujours original ») : ici, ce sont des repères de santé publique officiels, cités avec leur source. Ne pas les réécrire « en version originale ».
2. **Vouvoiement** dans cette rubrique uniquement (le reste de l'app tutoie).
3. **Pas de placeholders** `{prenom}` / `{genre}` dans cette rubrique.
4. **Source affichée** sous chaque bloc (une ligne discrète, champ `source`).
5. **Aucun contenu Réflexologie** dans le SOS.
6. **Bandeau permanent** en haut de chaque écran SOS, avec les numéros 15 · 112 · 114 cliquables (`tel:`).
7. Accessible en un clic depuis toutes les pages (usage d'une main, la nuit).

## Impact sur l'architecture
- Remplace le module 💜 Partager & rassurer (`/audio`) dans la navigation. **Proposer le plan technique à Laura avant de toucher au code** (route, schéma `content.module`, CLAUDE.md à mettre à jour).

## Fichiers de contenu
- `content/sos-faut-il-consulter/M00-M02_avant_3_mois.md` : affiché de M0 à M2 (« moins de trois mois » selon ameli).
- `content/sos-faut-il-consulter/M03-M23_a_partir_de_3_mois.md` : affiché de M3 à M23.
- Découpage tranché le 06/10/2026 : M3 = 3 mois révolus = « à partir de 3 mois ».

## Points ouverts

1. ✅ **Vous / tu** : tranché le 06/10/2026, vouvoiement dans cette catégorie.
2. ✅ **Vomissement « sanglant ou vert »** : repris du carnet de santé (absent des pages ameli accessibles).
3. **Édition du carnet** : noter l'année de ton carnet (au dos ou en première page) pour compléter les lignes source.
4. **Étouffement / fausse route et convulsions fébriles** : ameli a des pages dédiées (gestes pas à pas). Proposé en ajout dans le SOS, à rédiger dans un second temps.
5. **Numéros 116 117 et 3237** : pas confirmés sur ameli, donc non repris pour l'instant.
6. **Relecture humaine** : faire relire chaque citation par comparaison directe avec la page ameli, juste avant la mise en ligne, et noter la date de vérification.

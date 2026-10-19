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
6. **Bandeau permanent** en haut de chaque écran SOS, sans ligne source : 15 (SAMU) et 112 (numéro d'urgence européen) en premier, cliquables en `tel:` ; le 114 à part, sous « Cas particulier », cliquable en `sms:114`.
   ⚠ 19/10/2026 : la structure de `bandeau` dans `sos.json` a changé (`titre`, `numeros[]` avec `numero`/`nom`/`precision`, `cas_particulier`). Adapter le composant du bandeau.
7. Accessible en un clic depuis toutes les pages (usage d'une main, la nuit).
8. **Deux niveaux d'action seulement** (tranché le 19/10/2026), titres fixes :
   - `journee` → « Consultez rapidement votre médecin si : » (on peut rester à la maison en observant)
   - `urgence` → « Consultez en urgence si : » (sous-titre : « Appelez le 15 (SAMU) : un professionnel vous oriente, vers les urgences si besoin. »)
   Légende dans `sos.json` > `niveaux` (titre + sous_titre) : à afficher sur chaque écran. Le champ `definition` du bloc solution de réhydratation orale a été supprimé.
9. **Vomissements et Diarrhée séparés** (tranché le 19/10/2026) : le thème `diarrhee-vomissements` est remplacé par deux thèmes, `vomissements` et `diarrhee`, chacun lisible seul (répétitions assumées : déshydratation, solution de réhydratation orale, signes). Adapter les icônes de `components/modules/sos-design.tsx` (clé `diarrhee-vomissements` à remplacer).
10. **Ordre des blocs dans chaque thème** (tranché le 19/10/2026) : 1. Consultez en urgence → (signes de déshydratation juste dessous, pour vomissements et diarrhée) → 2. Consultez rapidement → 3. C'est quoi ? → 4. Que faire ?. Ne jamais réordonner : le parent doit d'abord savoir s'il doit se précipiter.
11. **Accueil SOS** : afficher en tête de la page qui liste les thèmes le message `accueil.message` de `sos.json` (« En cas de doute, appelez le 15. »), avec le 15 cliquable en `tel:`.
12. **Champ `note`** (bloc « Une cause possible : la bronchiolite ») : phrase de l'app, à afficher en italique en tête du bloc, avant les citations. Elle évite l'auto-diagnostic.
13. **Thème `choc-tete` « Choc à la tête »** (ajouté le 19/10/2026, M0 à M23) : source fiche ARS Normandie (d'après le carnet de santé). Citations à la 1re personne (« je »), garder telles quelles. Prévoir une icône dans `components/modules/sos-design.tsx`. Pas de consigne « glace » ni « ne pas déplacer » : absentes des sources officielles.
14. **Avant 3 mois : bloc « Que faire ? » avec la solution de réhydratation orale conservé** (tranché le 19/10/2026) : ameli le donne pour tous les moins de 2 ans, « avant même de consulter ». Il s'affiche après « Consultez rapidement votre médecin » : la solution ne remplace pas la consultation.

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

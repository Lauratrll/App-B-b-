# PROMPT CLAUDE CODE — « Que me dit bébé ? » (outil d'analyse du comportement)

Ce prompt est autonome. Lis-le en entier avant de coder. Laura n'a pas de compétences techniques : explique-lui chaque étape en français simple, et montre-lui le résultat (captures mobile) avant de poursuivre.

**Règle de travail (CLAUDE.md) : propose avant d'exécuter tout changement de structure.** Ici : présente d'abord à Laura (1) l'ordre de la barre du bas, (2) une maquette des écrans, puis seulement ensuite code.

---

## 1. Ce qu'on construit

Un outil pour une maman démunie face aux pleurs ou au comportement de son bébé. Elle coche ce qu'elle observe (l'âge de bébé vient du profil, on ne le lui demande pas), et reçoit :
- des **pistes classées** (jamais un diagnostic),
- une **action à essayer** pour chaque piste,
- des **messages** quand une situation précise le justifie,
- la liste « à essayer dans l'ordre ».

**La maman n'a rien d'autre à faire.** Elle ne revient pas dire si ça a marché : aucun écran de retour, aucune validation après coup.

## 2. Fichiers fournis (dossier APP BEBE, tout est dans `content/signaux-bebe/` sauf le script)

| Fichier | Rôle |
|---|---|
| `content/signaux-bebe/Signaux_bebe_reference_v2.xlsx` | **Source de vérité** du questionnaire « pleurs » court (v2, 06/11). Laura corrige dans Excel. Ne jamais éditer le JSON à la main. L'original `Signaux_bebe_reference.xlsx` (+ `signaux_bebe.json`) est rangé intact dans `docs/signaux-bebe-v1/` pour un futur questionnaire sommeil. |
| `content/signaux-bebe/signaux_bebe_v2.json` | Le contenu pour l'app (lu par `lib/signaux-bebe-contenu.ts`) : 9 pistes, 44 réponses avec points, 16 alertes (avec `declencheurs` et `combinaison`), `sources_reference`, 9 étapes, 3 messages conditionnels, règles de confiance, et `tests_attendus` (12 scénarios calculés par le classeur). |
| `scripts/export_signaux_bebe.py` | Régénère le JSON depuis le classeur : `python scripts/export_signaux_bebe.py content/signaux-bebe/Signaux_bebe_reference_v2.xlsx content/signaux-bebe/signaux_bebe_v2.json`, puis `python scripts/calc_tests_signaux_bebe.py <classeur v2> <json v2>` (recalcule `tests_attendus` avec LibreOffice). `scripts/build_signaux_bebe_v2.py` recrée le classeur v2 depuis l'original (`docs/signaux-bebe-v1/`). |

Le JSON contient `algorithme` (règles de calcul en toutes lettres). Lis-le : c'est la spécification.

## 3. Le moteur (fonction pure, testable)

Crée `lib/signaux-bebe.ts` : une fonction pure, sans effet de bord, qui prend `(age, idsCoches)` et renvoie `{ nbValables, alerte, top3, confiance, messages }`.

- Une réponse est **valable** si `age_min <= age <= age_max`.
- Score d'une piste = somme des `points[code]` des réponses **cochées ET valables** (les points négatifs comptent).
- Classement : score décroissant, uniquement les scores `> 0`. **À égalité, l'ordre de la liste `pistes` départage** (la première gagne).
- Alerte : si une réponse de `type: "alerte"` est cochée et valable, afficher **avant** tout résultat la liste `alertes` du JSON (colonnes `situation`, `a_dire`, `urgence`), triée par urgence (« Immédiate » d'abord). Le classeur ne relie pas une réponse à une ligne précise : on affiche donc toute la liste. Les réponses d'alerte n'ont aucun point.
- Confiance et messages : voir `confiance` et `messages` dans le JSON. Les conditions sont écrites dans le champ `quand` ; `rang(X)` = rang de la piste X dans le classement.
- **Valide ton moteur avec `tests_attendus`** (script de test, ex. `scripts/test-signaux-bebe.mjs`). Les scénarios doivent sortir exactement les mêmes top 3, la même confiance, la même alerte et les mêmes messages. Montre le résultat à Laura.

## 4. Les écrans

Mobile d'abord (max 390 px), fond Cream `#F2EDE8`, titres Playfair Display, corail `#D4604A`, vert eucalyptus `#8A9E98`, icônes SVG outline (jamais d'emoji), `padding-bottom` 80 px (barre fixe). Respecte `skills/SKILL_ui.md` : ne modifie aucune page existante.

1. **Pas d'écran « âge »** (décision 06/11) : l'âge est celui du bébé du profil (`getBabyMonth`), jamais redemandé ni modifiable ici.
2. **Questions par catégorie**, une catégorie par écran (champ `categorie` du JSON, dans l'ordre : Pleurs, Regard, Visage, Corps, Mouvements, Environnement, Journée). Le titre de l'écran est la question (« Ses pleurs ? »), sous l'en-tête « Que me dit bébé ? / Observons son comportement » ; bandeau d'avancement tout en haut ; bloc question + réponses centré ; en italique sous les réponses : « Coche aucune ou plusieurs réponses. » ; la mention « pas un diagnostic » n'apparaît qu'au résultat. Cases à cocher, plusieurs réponses possibles. Les réponses hors âge (`age_min`/`age_max`) **ne s'affichent pas**. Un indicateur discret « 3 observations cochées » suffit.
3. **Résultat** :
   - un message d'appel à consulter d'abord (alertes déclenchées par une réponse, ou par une combinaison : `alertesDeclenchees` dans le moteur, ex. « mou » + « fixe dans le vide » + un autre signe = bébé qui paraît malade) (« Parles-en vite à un professionnel de santé », lien 15), avec seulement les alertes déclenchées par les réponses cochées (`declencheurs`), sobre, jamais anxiogène ; un lien « Quand consulter ? » ouvre la liste complète en bas du résultat ;
   - les 3 hypothèses, en cartes déroulantes (la 1re ouverte), titrées « Hypothèse 1 » + nom (`cartes[code].titre`), avec « points sur 5 » (`forceIndices`, jamais 5 sur 5, ce n'est pas une probabilité) et un camaïeu de sauge du plus foncé (hypothèse 1) au plus clair. Dans chaque carte : sens, « Comment lui répondre » (gestes pas à pas), « À observer », « Quand consulter », chacun avec ses numéros de sources. Plus de liste d'actions globale : les actions sont toujours celles de l'hypothèse ;
   - les messages conditionnels ;
   - le niveau de confiance ;
   - le bloc « Pour toi » (étape 9 des `etapes`) ;
   - bouton « Recommencer ».
4. **Mentions fixes** (en bas, discrètes) : « Ce n'est pas un diagnostic et ne remplace pas un avis médical. En cas de doute, appelez le 15. » (même formule que la page SOS.)

Ce sont de nouveaux écrans : **propose-les d'abord en maquette à Laura**, ajuste, puis construis. Aucun design n'est figé pour eux.

## 5. Le bouton dans la barre du bas

Fichier : `components/ui/bottom-nav.tsx` (et `app/(app)/layout.tsx` si besoin). Laura veut un bouton **« Que me dit bébé ? » avec un picto loupe** (la loupe = analyse du comportement), et **restructurer l'ordre** de la barre.

Barre actuelle (4 entrées) : Accueil · Cohérence cardiaque · SOS · Épinglés.

**Propose cet ordre à Laura (5 entrées, SOS reste au centre) :**
Accueil · Cohérence cardiaque · **SOS** · Que me dit bébé ? · Épinglés

- Picto loupe en SVG outline, même trait que les autres pictos de la barre (grille 24 px, trait 1,6, bouts arrondis).
- Libellé « Que me dit bébé ? » lisible. Montre à Laura deux variantes (bouton rond avec le mot sous la loupe, ou pastille) et laisse-la choisir.
- Règle existante (20/10) : les boutons « portes d'entrée » n'apparaissent que sur l'accueil ; ailleurs, la barre porte Retour et Épingler. Garde cette logique, sauf si Laura décide autrement.
- Couleurs : actif corail `#D4604A`, inactif eucalyptus `#8A9E98`.

## 6. Qui le voit, et où ça se déploie (important)

- **Pour le test, visible uniquement pour les comptes admin** (réutilise le mécanisme admin déjà en place, cf. `ApercuAdminBar`). Raison : la liste des alertes doit être relue par un professionnel de santé avant d'être ouverte aux parents.
- **Déploiement en preview Vercel sur une branche**, pas en production. Donne à Laura le lien pour tester sur son téléphone.

## 7. Contraintes éditoriales et de confidentialité (non négociables)

- **Pistes, pas diagnostic.** Jamais « il a faim » : « il cherche peut-être à manger ».
- **Ne jamais afficher** : le champ `note_interne`, les identifiants de sources dans les phrases (numéros de notes à la place), ni les sources internes (S13, S14, S19, S24, S27, S29). Pas de mention de la formation EDPP dans l'app.
- Ne pas inventer de texte : tout ce qui s'affiche vient du JSON (ou des mentions du §4). Si un texte manque, demande à Laura.
- Tutoiement. Ton bienveillant, jamais culpabilisant (aucune piste « stress du parent »).
- **Aucune donnée enregistrée** : ni réponses, ni résultats, ni âge, ni analytics, aucune écriture en base. Tout vit en mémoire dans la page. (Données sur un mineur, proches de la santé : on ne les garde pas.)
- Les sources publiques s'affichent en notes numérotées dans l'ordre d'apparition, dépliées sous « Sources » en bas du résultat (même mécanisme que Sommeil) ; les sources internes jamais.

## 8. Ce qu'on ne fait PAS

- Pas de scan vidéo ni audio : c'est une idée séparée, à étudier plus tard.
- Pas d'import dans Supabase pour cette version (le JSON est lu directement par l'app, comme un fichier de contenu).
- Pas de modification des pages existantes ni des designs figés.

## 9. À la fin

1. Montre les captures mobile (iPhone 13/14 en 390×844 et iPhone SE en 375×667).
2. Donne le lien preview.
3. Liste simplement ce qui a changé et ce que Laura doit vérifier sur son téléphone.
4. **Après sa validation seulement**, note la décision dans `skills/DECISIONS.md` (barre du bas : nouvel ordre ; nouvelle rubrique « Que me dit bébé ? »).

# PROMPT CLAUDE CODE — « Que me dit bébé ? » (outil d'analyse du comportement)

Ce prompt est autonome. Lis-le en entier avant de coder. Laura n'a pas de compétences techniques : explique-lui chaque étape en français simple, et montre-lui le résultat (captures mobile) avant de poursuivre.

**Règle de travail (CLAUDE.md) : propose avant d'exécuter tout changement de structure.** Ici : présente d'abord à Laura (1) l'ordre de la barre du bas, (2) une maquette des écrans, puis seulement ensuite code.

---

## 1. Ce qu'on construit

Un outil pour une maman démunie face aux pleurs ou au comportement de son bébé. Elle indique l'âge de bébé, coche ce qu'elle observe, et reçoit :
- des **pistes classées** (jamais un diagnostic),
- une **action à essayer** pour chaque piste,
- des **messages** quand une situation précise le justifie,
- la liste « à essayer dans l'ordre ».

**La maman n'a rien d'autre à faire.** Elle ne revient pas dire si ça a marché : aucun écran de retour, aucune validation après coup.

## 2. Fichiers fournis (dossier APP BEBE, tout est dans `content/signaux-bebe/` sauf le script)

| Fichier | Rôle |
|---|---|
| `content/signaux-bebe/Signaux_bebe_reference.xlsx` | **Source de vérité.** Laura corrige dans Excel. Ne jamais éditer le JSON à la main. |
| `content/signaux-bebe/signaux_bebe.json` | Le contenu pour l'app : 12 pistes, 77 réponses avec points, 15 alertes, 10 étapes, 3 messages conditionnels, règles de confiance, et `tests_attendus` (6 scénarios calculés par le classeur). |
| `scripts/export_signaux_bebe.py` | Régénère le JSON depuis le classeur : `python scripts/export_signaux_bebe.py content/signaux-bebe/Signaux_bebe_reference.xlsx content/signaux-bebe/signaux_bebe.json` |

Le JSON contient `algorithme` (règles de calcul en toutes lettres). Lis-le : c'est la spécification.

## 3. Le moteur (fonction pure, testable)

Crée `lib/signaux-bebe.ts` : une fonction pure, sans effet de bord, qui prend `(age, idsCoches)` et renvoie `{ nbValables, alerte, top3, confiance, messages }`.

- Une réponse est **valable** si `age_min <= age <= age_max`.
- Score d'une piste = somme des `points[code]` des réponses **cochées ET valables** (les points négatifs comptent).
- Classement : score décroissant, uniquement les scores `> 0`. **À égalité, l'ordre de la liste `pistes` départage** (la première gagne).
- Alerte : si une réponse de `type: "alerte"` est cochée et valable, afficher **avant** tout résultat la liste `alertes` du JSON (colonnes `situation`, `a_dire`, `urgence`), triée par urgence (« Immédiate » d'abord). Le classeur ne relie pas une réponse à une ligne précise : on affiche donc toute la liste. Les réponses d'alerte n'ont aucun point.
- Confiance et messages : voir `confiance` et `messages` dans le JSON. Les conditions sont écrites dans le champ `quand` ; `rang(X)` = rang de la piste X dans le classement.
- **Valide ton moteur avec `tests_attendus`** (script de test, ex. `scripts/test-signaux-bebe.mjs`). Les 6 scénarios doivent sortir exactement les mêmes top 3, la même confiance, la même alerte et les mêmes messages. Montre le résultat à Laura.

## 4. Les écrans

Mobile d'abord (max 390 px), fond Cream `#F2EDE8`, titres Playfair Display, corail `#D4604A`, vert eucalyptus `#8A9E98`, icônes SVG outline (jamais d'emoji), `padding-bottom` 80 px (barre fixe). Respecte `skills/SKILL_ui.md` : ne modifie aucune page existante.

1. **Âge** : choix de l'âge en mois (0 à 23). Par défaut, l'âge du bébé déjà enregistré dans le profil, modifiable.
2. **Questions par catégorie**, une catégorie par écran (champ `categorie` du JSON, dans l'ordre). Cases à cocher, plusieurs réponses possibles. Les réponses hors âge (`age_min`/`age_max`) **ne s'affichent pas**. Un indicateur discret « 3 observations cochées » suffit.
3. **Résultat** :
   - la liste des alertes d'abord, si une réponse d'alerte est cochée (sobre, jamais anxiogène) ; un lien « Quand consulter ? » vers cette même liste reste toujours visible en bas du résultat ;
   - les 3 pistes : nom court (`nom`), formulée avec prudence (« il cherche peut-être à manger ») + `action` ;
   - les messages conditionnels ;
   - le niveau de confiance ;
   - « À essayer dans l'ordre » (`etapes`), toujours visible ;
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
- **Ne jamais afficher** : le champ `note_interne`, les identifiants de sources, ni les sources internes (S13, S14, S24, S29). Pas de mention de la formation EDPP dans l'app.
- Ne pas inventer de texte : tout ce qui s'affiche vient du JSON (ou des mentions du §4). Si un texte manque, demande à Laura.
- Tutoiement. Ton bienveillant, jamais culpabilisant (aucune piste « stress du parent »).
- **Aucune donnée enregistrée** : ni réponses, ni résultats, ni âge saisi, ni analytics, aucune écriture en base. Tout vit en mémoire dans la page. (Données sur un mineur, proches de la santé : on ne les garde pas.)
- Les sources du contenu sont dans le classeur (onglet Sources) ; ne pas les afficher.

## 8. Ce qu'on ne fait PAS

- Pas de scan vidéo ni audio : c'est une idée séparée, à étudier plus tard.
- Pas d'import dans Supabase pour cette version (le JSON est lu directement par l'app, comme un fichier de contenu).
- Pas de modification des pages existantes ni des designs figés.

## 9. À la fin

1. Montre les captures mobile (iPhone 13/14 en 390×844 et iPhone SE en 375×667).
2. Donne le lien preview.
3. Liste simplement ce qui a changé et ce que Laura doit vérifier sur son téléphone.
4. **Après sa validation seulement**, note la décision dans `skills/DECISIONS.md` (barre du bas : nouvel ordre ; nouvelle rubrique « Que me dit bébé ? »).

# Registre des décisions — Guide-moi

> **Document unique.** C'est le seul endroit où vivent les décisions de Laura. Il remplace les 27 documents de décisions et de règles datés du 26 août au 30 septembre 2026 (liste en fin de document).
> **Mode d'emploi**
> - **Fichier de référence : `skills/DECISIONS.md` sur l'ordinateur de Laura** (dossier `APP BEBE`). On travaille là. La copie du projet Claude (`claude/DECISIONS.md`) est écrasée par celle-ci à chaque mise à jour : on ne la modifie jamais seule.
> - Toute nouvelle décision s'écrit **ici**, dans sa section, avec sa date, **dans la minute où elle est prise**, et la règle correspondante est reportée dans `skills/SKILL_contenu.md` (ou `SKILL_protocole.md` / `SKILL_rubriques.md`) **dans le même geste**. Jamais dans un document séparé, jamais dans une nouvelle version datée.
> - Une décision remplacée ne disparaît pas : elle est marquée 🔁 avec la date et ce qui la remplace.
> - Les documents datés restent en archive pour l'argumentaire et les sources détaillées. **Ils ne font plus foi** : en cas d'écart, c'est ce registre qui gagne.
> - Les skills (`SKILL_contenu`, `SKILL_protocole`, `SKILL_rubriques`) appliquent ces décisions ; si un skill contredit ce registre, le skill est à corriger.
>
> Légende : ✅ en vigueur · 🔁 remplacée · 🟠 ouvert, à trancher · ⚠️ point de vigilance

Dernière mise à jour : 17 octobre 2026.

---

# 0. Méthode de travail

| Date | Décision |
|---|---|
| 17/10 | ✅ **Un seul fichier par sujet, mis à jour sur place, sur l'ordinateur de Laura.** Pas de dizaines de versions : on modifie le fichier qui est lu (le registre, les skills, les fiches de `content/`). Les sauvegardes vont dans `_sauvegardes/AAAA-MM-JJ/`. Les décisions et les skills sont mis à jour **systématiquement**, à chaque décision, avant de passer à la suite. Le projet Claude reçoit ensuite la copie du fichier de l'ordinateur, pas l'inverse. |
| 28/08 | ✅ **Ce que Laura n'a pas invalidé est validé.** Les propositions non contredites sont acquises, sauf si elles figurent en §12 (questions ouvertes). |
| 30/09 | ✅ **Toutes les décisions vivent dans ce registre**, pas dans des documents séparés : sinon elles se perdent. |
| 30/09 | ✅ **On ne supprime rien.** Lors d'une refonte, le contenu existant part dans `ancien/` du mois concerné, le nouveau se crée à neuf, ce qui est repris l'est sciemment. |
| 26/08 | ✅ Passe **thème par thème**, pas mois par mois ; table d'angles soumise à validation avant écriture. |
| 28/08 | ✅ On raisonne en **thèmes**, plus en numéros de slot. Documents de libellés nommés par thème. |
| 30/09 | ✅ **Phase de recherche fermée pour le sommeil : on construit.** Les vérifications restantes se font au moment d'écrire la carte concernée. |
| 29/09 | ✅ Claude est **garde-fou** : il dit d'où vient chaque repère (donnée mesurée, repère clinique de la formation, usage de praticien), signale difficultés, alertes et interrogations en fin de livraison. |
| 30/09 soir | ✅ **Les notes et le livret de formation sont la matière première** du contenu sommeil, pas un complément. Le livret fait foi quand il est sourcé ; on vérifie quand il ne l'est pas. |
| 29/08 | ✅ **Rien d'interne n'entre dans `content/`** : ni réserve (« à vérifier », « à faire relire »), ni note de travail, ni doute affiché au parent. Ces informations vont en conversation et dans le projet. Seuls `consulter_si` et le rappel de non-substitution protègent le parent dans le contenu. |
| 08/09 | ⚠️ Relancer `minutes_en_chiffres.py --ecrire` après toute régénération d'un mois (les scripts de rédaction réécrivent les JSON). |

---

# 1. Produit, positionnement, marché

| Date | Décision |
|---|---|
| 14/09 | ✅ **L'app ne demande rien à saisir.** Pas de tracking, pas de journal. Elle donne, elle ne réclame pas. |
| 28/09 | ✅ **Pas de champ de recherche.** Navigation mois → thème → situation. Le libellé porte tout le poids. Alternatives sans saisie : liste complète du mois, liens « voir aussi », entrées transversales préparées. |
| 14/09 | ✅ Backlog : offrir l'abonnement en **liste de naissance** ; **offre de parrainage**. |
| 14/09 | ✅ Positionnement à rejouer : acquisition sur le vocabulaire du symptôme (sommeil, pleurs), essai gratuit court avec preuve à J+3, couvrir M0-M1, prix cible 9,99-14,99 €/mois (99-149 €/an), pic de demande novembre-janvier. |
| 29/09 | ✅ L'ADN : l'activable, jamais de laisser-pleurer ni de culpabilisation, on ne fait pas peur, des repères avec dispersion, on ramène le parent à l'observation de son bébé, les sources s'affichent. |
| 29/09 | ✅ **Rester chez soi face aux concurrents** : on ne s'accorde jamais ce qu'on leur reproche (un mécanisme inventé pour expliquer une observation réelle). |

---

# 2. Architecture, libellés, rangement

## 2.1 Les thèmes et les mois

| Date | Décision |
|---|---|
| 28/08 | ✅ **Un thème se reprend d'un mois à l'autre, et c'est voulu.** Chaque protocole est autonome ; un thème durable est présent à chaque mois où il peut se produire ; ce qui est proscrit, c'est le **texte** répété, pas le sujet. |
| 28/08 | ✅ **On ne fait pas de rétention d'information** : deux fois le même protocole avec toutes les infos plutôt que des demi-protocoles. |
| 28/08 | ✅ **On n'enlève pas pour ajouter.** Une place ne se libère que sur doublon (même mois, ou autre thème). |
| 28/08 | ✅ **Une peur qui fait ouvrir l'app doit y trouver une réponse** : ce qui est banal, les points de vigilance, qui appeler, ce qui alerte si ça se répète. On ne médicalise pas, on donne des seuils. |
| 28/08 | ✅ **Une situation doit pouvoir être datée** par l'âge de l'enfant. Les sujets non datables (déménagement, maladie, fin de contrat, deuil) vont dans un protocole générique sur le changement (M14 *Le retour en arrière*) ou s'intègrent ponctuellement. |
| 28/08 | ✅ Le corps se scinde : **Corps & soins** (M0-M5) · **Motricité & exploration** (M6-M23, motricité fine incluse) · **Dents & petits inconforts** (M6-M23). |
| 28/08 | ✅ Sur-stimulation fusionne dans Colère & émotions dès M12 ; **Parents submergés** sort du dégradé avec sa couleur propre. |
| 28/08 | ✅ Frontière : **Parents submergés** = « comment je vais, moi » ; **Lien & attachement** = « et lui, comment il le vit ». |
| 28/08 | ✅ Tableau maître : **`GUIDE2_situations.xlsx`** remplace `GUIDE1.XLS` (périmé). |
| 01/09 | ✅ Une carte répond d'abord à la question de son thème, même quand la réponse est « non, ce n'est pas ça ». |

## 2.2 Libellés

| Date | Décision |
|---|---|
| 26/08 · 28/08 | ✅ **Le libellé garde la scène la plus reconnaissable** (« Le retour à la maison », « Le matin à la crèche »). Pas unique, pas exhaustif, jamais une catégorie. **Le contenu, lui, n'exclut personne** (« à la crèche comme chez une assistante maternelle »). |
| 02/09 | ✅ **55 caractères maximum**, cible 50. La coupe est libre tant que la scène reste reconnaissable ; une même partie 1 peut revenir à plusieurs mois, la partie 2 affine. |
| 02/09 | ✅ `situation` = libellé en deux parties avec « / » (bouton page 2, sous-titre page 3) ; `titre` = principe d'action, une phrase courte sans séparateur, 48 caractères max. |
| 09/09 | ✅ Les libellés arrêtés ne se signalent plus (listes blanches nominatives dans `qa_contenu.py`). |
| 01/09 | ✅ Avant la diversification, on ne dit pas « repas » mais **tétée** ou **prise de lait**. |

## 2.3 Rangement des situations (28/09)

✅ Le thème se choisit sur **l'endroit où la mère va chercher** : l'objet quand il a son thème (dents, lit, assiette), sinon l'émotion.
- Ce qu'il fait seul avec son corps → Motricité · ce qu'il refuse alors que l'adulte doit le faire (habillage, change, siège auto) → slot pleurs et colère · ce qu'il veut faire seul → Autonomie & propreté (dès M18 ; avant, pleurs et colère).
- Le brossage reste dans Dents. Avant M12, Corps & soins garde les actes de soin.
- Slot nommé **« Pleurs & colère »** dans le tableau ; dans l'app le nom suit l'âge (*Pleurs & sur-stimulation* M0-M5, *Pleurs & frustration* M6-M11, *Colère & émotions* M12-M17, *Colère & débordement* M23).
- Appliqué : M18 siège auto et M19 change debout → Pleurs & colère ; M22 main dans la couche → Autonomie & propreté ; M21 refus des chaussures reste en Motricité ; M20 « siège auto, encore » libéré.

---

# 3. Rubrique sommeil (ex-« Préparer le coucher »)

## 3.1 Structure A (29/09, révisée 30/09)

✅ Retenue. La rubrique = **ce qu'il faut savoir et installer** ; le thème Sommeil de Guide-moi = **ce qui ne va pas ce soir**.

```
SON SOMMEIL CE MOIS-CI ── le pourquoi
LA JOURNÉE ───────────── le quoi faire (« Les siestes » en sous-titre visible)
LA FIN DE JOURNÉE ────── le quoi faire
LE SOIR — le rituel ──── largement conservé
LA NUIT ──────────────── ce qui est normal + quand consulter
CE QUI PEUT LE RÉVEILLER ─ transversal, décorrélé de l'âge
LA SÉCURITÉ ──────────── version unique appelée, jamais recopiée
Réflexologie · script audio · co-parent ─ inchangés
```

| Date | Décision |
|---|---|
| 30/09 | ✅ **On peut se répéter, on ne peut pas se contredire.** Plusieurs portes d'entrée sur un sujet, c'est voulu : la répétition ancre. Le seul défaut, c'est la contradiction (et la copie manuelle qui dérive). 🔁 remplace « une information vit à un seul endroit » (doc 17 §9.6). |
| 30/09 | ✅ Le thème du mois s'écrira **après** l'intro sommeil ; un recouvrement n'est pas un problème. |
| 30/09 | ✅ **Case « Ce qui peut le réveiller »** : version unique appelée dans les 24 mois, entre « La nuit » et « La sécurité ». Rangée du plus simple au plus médical : ce qui se vérifie en dix secondes (température, vêtements, couche, bruit et lumière, **la tétine perdue** — ajout du 30/09 soir) · ce qui se voit sur quelques jours (dents, rhume, digestion, faim réelle, vaccins, changement d'environnement) · ce qui demande un avis (langue et voies respiratoires, otite, fièvre, reflux, respiration bruyante). Elle ne diagnostique pas, ne fait pas peur, chaque ligne finit par une observation, aucune prévalence, elle dit sa limite. Variations d'âge internes : dents, langue / voies respiratoires. |
| 30/09 | ✅ Questionnaire d'entrée : **non**. Vue d'ensemble « Où en êtes-vous ? » facultative (endormissement, réveils, siestes, fin de journée) qui **relie** sans filtrer : **oui**, forme à trancher (§12). |
| 28/09 | ✅ Sécurité : **pas de bloc identique répété partout** dans les cartes (il devient invisible), mais une **règle de déclenchement** : la sécurité apparaît, formulée pour le sujet, dès qu'une carte parle de coucher, sieste, tétée de nuit, bain, peau à peau, biberon, pleurs qui débordent, cododo, objet dans le lit. La rubrique sommeil porte en plus sa section sécurité unique. |

✅ (06/10) **Ne pas inonder le parent** (Laura) : trop d'informations, il ne lit rien et l'app perd sa valeur ajoutée. Mesure du 06/10 sur M3, M9, M20 : environ 2 200 mots par mois pour les 5 blocs propres + 900 mots pour les 2 blocs communs, soit plus de 10 minutes de lecture. **Tranché (06/10) : couper + replier.** Chaque sous-titre est un volet replié ; visibles d'emblée : le sous-titre et **une phrase en gras** ; les blocs communs sont repliés en entier. Les répétitions entre blocs sont coupées (une idée vit dans un seul bloc). Repère après la passe : environ 1 300 à 1 500 mots par mois, dont environ 350 visibles d'emblée. Doc 25 = proposition allégée, **en relecture** face au doc 26 (version complète). ⚠️ Précision de Laura (06/10) : **journée, fin de journée, rituel, nuit sont des slots séparés** dans l'app, lus un par un : le budget de lecture se compte **par slot**, pas par mois. Avant allègement, chaque slot fait 300 à 450 mots, sauf l'intro M3 (≈ 870).

✅ (06/10 soir) **Nouvelle structure de la rubrique Sommeil, en 3 parties** (validée par Laura) : **1. Comprendre son sommeil** (intro, ce qui bouge, ce que ça donne à la maison, la nuit ce qui est normal, ses repères) · **2. Son rythme** (la journée, la fin de journée, l'heure du coucher, la nuit pratique et quand consulter) · **3. La boîte à outils** (onglet : le rituel pas à pas, les 15 minutes vers le sommeil, les cartes, la place du co-parent ; **à remplir après validation de la liste des cartes**). Toujours accessibles : **La sécurité** et **« Il se réveille plus que d'habitude ? »** (version courte : vérifier le simple, renvoi à SOS et à Guide-moi).

✅ (06/10 soir) **Séparation Sommeil / Guide-moi** : la rubrique Sommeil = le quotidien, ce qu'on prépare ; **Guide-moi = les situations précises où ça coince**. Passent dans Guide-moi (à créer ou enrichir) : la tétine perdue la nuit (dont l'astuce de plusieurs tétines dès M12), le pas à pas des terreurs nocturnes (M15-M23), les réveils et les dents, le nez bouché la nuit, le reflux au coucher, les oreilles, la respiration et le ronflement (déjà prévu M20). Le « quand consulter » détaillé va dans Guide-moi et SOS.

✅ (06/10 soir) **Pas de mention « co-parent » par carte** : tout s'adresse aux deux parents. **« La place du co-parent » reste un bloc à part** dans la boîte à outils (le message « laisser la place »), avec un texte par tranche.

✅ (06/10 soir) **Slot du soir : deux choses distinctes** (Laura). **Le rituel** = le pas à pas, dans l'ordre (repas, bain, dents, pyjama…), présenté comme **des repères qui installent la fin de journée dans son esprit**, jamais comme un mode d'emploi. **« Les 15 minutes vers le sommeil »** (nom choisi par Laura, 06/10) = les ≈ 15 minutes juste avant de dormir : où, quoi, comment, nourri par la boîte à outils (cartes Apaiser · Décharger · Lien, par tranche d'âge). On n'écrit pas « mode alpha » (rythme alpha atteint vers 3 ans seulement) ni « conditionnement ». Proposition complète : doc 27. **Tranches des cartes validées** (06/10) : M0-M4 · M5-M11 · M12-M17 · M18-M23 ; une carte peut revenir dans chaque tranche avec un angle qui suit l'âge (ex. l'histoire). **Focus confirmé M12-M23 seulement.**

✅ (06/10) **Sélecteur « Où en est-il ? » (personnalisation)** : gardé, **M12-M23 seulement** (2 choix M12-M15, 4 choix M16-M23, inchangés). Il quitte la 1re étape du rituel pour **« La fin de journée »**, sous-titre « Le moment à son image » : le parent est à la maison le soir, même avec un mode de garde. Le rituel reste identique chaque soir ; le script audio garde son `passage_par_theme`. Textes des variantes repris et corrigés (pas de cadratin ; « ton calme devient le sien » retiré, règle 28/09).

✅ (06/10) **Fichiers de travail Sommeil** : `content/sommeil/M{n}_sommeil.md`, un fichier par mois, slots 1 à 7 dans l'ordre (texte parent seulement, aucune note interne). Les blocs communs ont une **source unique**, `content/sommeil/_blocs_communs.md`, recopiée entre deux marqueurs par `scripts/recopie_communs_sommeil.py` : on ne modifie jamais les blocs communs dans un fichier de mois. Le script d'import ne lit que `mois-XX/` : ces fichiers n'entrent pas dans l'app tant qu'ils ne sont pas convertis en `02-coucher.json`. Faits : M3, M9, M20 (version complète, avant allègement). 🔁 (19/10) Ils entrent dans l'app autrement, voir ci-dessous.

✅ (19/10) **Nouvelle structure Sommeil dans l'app, en aperçu admin seulement** (Laura). Les `.md` sont convertis en `content/sommeil/sommeil.json` par `scripts/sommeil-md-vers-json.mjs` (lancé par `npm run dev` et `npm run build`, import statique, pas Supabase). Le nouvel écran (3 onglets, volets repliés, toujours accessibles en bas) **n'est visible que par les admins** pour M3, M9, M20 ; les parents gardent l'ancien Coucher tant que Laura n'a pas validé à l'écran. Réflexologie et berceuse : reprises de l'ancien `02-coucher.json`, inchangées. **Boîte à outils : ce qui n'est pas écrit s'affiche avec la mention « Bientôt »** (Les 15 minutes vers le sommeil ; Les cartes, avec leurs titres). Pour publier un mois : modifier le `.md`, pousser ; le build régénère les données.

## 3.2 Bloc d'intro « Son sommeil ce mois-ci » (29/09 → 30/09 soir)

| Date | Décision |
|---|---|
| 29/09 soir | ✅ **ADN : le sommeil est un processus neurologique.** Le cerveau change d'état ; les hormones donnent l'heure et arrivent tard. Objectif : l'empathie au lieu du reproche. |
| 30/09 soir | ✅ **Quatre temps** (titres validés le 06/10) : **Son sommeil aujourd'hui** (la photo : ce qui existe à cet âge, dont **ce qui n'est pas encore là**) · **Ce qui bouge en ce moment** (le film du mois : le mouvement et la vraie cause des turbulences) · **Ce que ça va donner à la maison** · **Ses repères, à X mois** (à partir de M3). |
| 06/10 | ✅ **Mise en forme des blocs : sous-titres ET gras.** Chaque bloc est découpé par des sous-titres courts qui disent de quoi il parle (« Bébé bouge pendant son sommeil », « Son horloge se met en route », « Ce que tu vas peut-être voir », « Ce que ça veut dire »…) ; l'essentiel est en gras, quelques mots par paragraphe, jamais une phrase sur deux. Dans le JSON : sous-titre `## …`, gras `**…**`. |
| 30/09 soir | ✅ **« Ses repères » distingue deux notions à ne jamais confondre** : **sur 24 heures**, le besoin de sommeil moyen de l'âge, avec sa part de nuit et sa part de jour, et sa dispersion (petits et gros dormeurs, 2 à 3 h d'écart normales) · **faire ses nuits**, enchaîner ses cycles pendant environ 5 h. Repères sur 24 h : 0-3 mois ≈ 14-17 h dont une dizaine la nuit · 4-11 mois ≈ 12-15 h, 10-12 h la nuit, 2-3 h de jour · 12-24 mois ≈ 11-14 h, ≈ 11 h la nuit, une sieste ≈ 2 h. Sans source dans le contenu (sommeil ordinaire). |
| 30/09 soir | ✅ **Faire ses nuits** : physiologiquement prêt (glycémie), pas encore neurologiquement. Repère toujours donné avec la part des bébés qui n'y sont pas encore. Environ 5 h d'affilée (M3-M5), environ 6 h (M6-M11), se rendormir seul (M12-M23). M3 : les besoins nutritionnels de nuit peuvent encore exister. **Pas de source dans le contenu** : les repères viennent des notes de formation (5 h à 3 mois ; le 9 h du livret n'est pas retenu). On dit que beaucoup de bébés n'y sont pas encore, sans chiffre. **À M3, on garde « n'en attends pas davantage pour l'instant »** (décision du 30/09 soir) : physiologiquement, beaucoup de bébés ont encore besoin de manger la nuit. **Le ton** : « 5 heures d'affilée, c'est merveilleux, c'est déjà une vraie nuit, n'en attends pas davantage pour l'instant, c'est normal et très bien. » C'est un approximatif. On ne parle pas de glycémie : les 5 h ne sont pas un seuil de glycémie mesuré. |
| 30/09 soir | ✅ **Intro M0-M2** : expliquer que chez le nouveau-né, le corps et l'état d'éveil s'organisent ensemble (*Als*, repris dans la formation). Formulation à valider : « Quand ses bras et ses jambes partent dans tous les sens, il a du mal à rester calme ou à s'endormir. Quand tu l'aides à se regrouper, mains vers le milieu, jambes repliées, son corps se pose, et son état se pose avec lui. » C'est aussi ce qui explique que la contenance apaise. |
| 30/09 soir | ✅ **Le moral de la mère est un sujet important**, qui a sa place (Prendre soin de moi, Parents submergés, et partout où il aide). Ce qui a été retiré, c'est **une phrase culpabilisante** : « sans lien avec son développement ni avec le moral de sa mère », glissée dans un repère sur le sommeil du bébé. Règle : on ne relie jamais le sommeil du bébé au moral de la mère sous forme de conséquence ou d'absence de conséquence. |
| 30/09 soir | ✅ **Exergue fixe sur 24 mois** : « S'endormir, c'est descendre les marches une à une. Entre deux cycles, tout le monde remonte près de la surface. Se réveiller, c'est remonter une marche **de plus**. » (« de plus », pas « de trop » : pouvoir se réveiller est important.) |
| 30/09 soir | ✅ **Vocabulaire des états** : sommeil agité → **sommeil paradoxal**, qui répare surtout le cerveau · sommeil calme → se divise à partir de 3 mois en **sommeil léger** et **sommeil profond** ; c'est le **sommeil profond** qui répare surtout le corps. **On distingue toujours sommeil léger et sommeil profond, et on n'écrit pas « sommeil lent »** dans le contenu, pour éviter les confusions (décision du 30/09 soir). « Sommeil léger » jamais avant M3. « Sommeil de rêve » abandonné. |
| 30/09 soir | ✅ **Progression visible** : dater chaque repère (« à 3 mois », « à présent »). **Personnalisation** : `[il/elle]`, parfois `{prenom}` ; « bébé », « les bébés » pour les généralités ; « Chez beaucoup de bébés » validé. |
| 30/09 soir | ✅ **« C'est le cerveau qui gère le sommeil, pas l'estomac » : réservé à M0-M1**, avec son vrai sens : un bébé peut avoir faim et rester endormi. Cadre de sécurité (ORÉHANE 2025, référentiels de périnatalité) : l'hypoglycémie concerne les **48 premières heures** et les **bébés à risque** (prématurés, petit ou gros poids, mère diabétique, hypothermie) : pour eux, **3 h maximum entre deux repas**, on réveille. Au-delà, chez un bébé à terme en bonne santé, l'enjeu est la prise de poids : un nouveau-né très dormeur qui ne réclame pas assez se montre à la sage-femme ou au médecin. ⚠️ Le « risque jusqu'à 3 mois » n'est pas dans les sources (probable confusion avec « 3 heures »). **Plus grand (M3 et après)** : il se réveille à la fin d'un cycle, et c'est là qu'il peut sentir qu'il a faim ; avoir encore besoin de manger la nuit à 3 mois est normal. |
| 06/10 | ✅ **Rythme circadien : simple, concret, applicable.** Les parents ne connaissent pas le mot : on part de l'association **lumière = jour = éveil ; pénombre = nuit = sommeil**, puis on nomme le terme. Pas de « 24 heures », pas de phrase technique. M3 : « Son corps commence aussi à faire le lien : la lumière signale le jour et la période d'éveil ; la pénombre indique la nuit et appelle le sommeil. C'est ce qu'on appelle le rythme circadien, et il se met en place maintenant. » M9 : « Son corps a bien fait le lien… Son rythme circadien est installé. » 🔁 remplace la formulation du 30/09. |
| 30/09 soir | ✅ **À partir de 6 mois, on ne parle plus de « sommeil agité » mais de sommeil paradoxal** (≈ un cinquième du sommeil de 6 mois à 1 an, Inserm, Challamel & Franco) ; « sommeil agité » reste le mot du nouveau-né. |
| 30/09 soir | ✅ **Le rythme du cortisol n'est pas mentionné dans l'intro M3** (ni dans les intros avant M6) : ça surcharge, et « pas encore de rythme » pourrait se lire « je peux stresser mon bébé, ça ne change rien ». Il apparaît quand il s'installe (M6-M9). À la place, M3 dit pourquoi le rythme jour/nuit donné par le parent compte : il fait le travail que l'horloge ne sait pas encore faire seule. |
| 30/09 soir | ✅ L'image de l'**escalier** est gardée (l'hypnogramme se dessine en escalier). |
| 30/09 | 🟠 Structure proposée après les mois-tests : temps 1 par tranche physiologique (M0-M2 · M3-M5 · M6-M11 · M12-M17 · M18-M23), temps 2 et 3 par mois. Contenu de référence : `analyse_sommeil/19_intro_son_sommeil_M3_M9_M20.md`. |

## 3.3 Siestes et rythmes (29/09)

✅ **Le repère, sa dispersion, jamais l'injonction** : on donne l'âge, la durée, la fourchette ; la variabilité dans la même phrase ; jamais « il ne doit pas », « il faut le coucher à ». Un contenu sans repère est inutilisable.
- ✅ Dispersion en chiffres qu'on se représente : à 6 mois, sommeil de jour ≈ 3 h, deux tiers des bébés entre 2 h et 5 h. Cadre « petits et gros dormeurs ». Jamais de percentiles extrêmes.
- ✅ **On raisonne en éveil calme, pas en temps d'éveil total.** Repères de la formation en ordre de grandeur : 5-10 min à la naissance, environ 30 min vers la fin du 1er mois, **à 3 mois : 30 minutes, 4 fois par jour, soit environ 2 h cumulées** (tranché le 30/09 soir : le « près de 2 h » du livret est un cumul) + ce que le parent observe. Les « fenêtres d'éveil max » du corpus deviennent la fin de l'éveil calme.
- ✅ Heure du coucher qui bouge avec l'âge : M0-M2 pas d'heure · M3-M11 heure régulière, on suit ses signes, on avance si ça dérape · M12-M23 fenêtre indicative 18 h-20 h, et un endormissement qui traîne chez un enfant qui réclame sans être fatigué signale souvent un coucher **trop tôt** pour son horloge.
- ✅ (06/10) **Heure du coucher.** M4-M23 : « le plus souvent entre 18 h et 20 h », jamais à tenir à la minute (ce sont les signaux de fatigue qui donnent le signal). **M3 à part** : pas d'heure, **on observe la fin de l'éveil calme pour proposer la nuit** ; le pic de pleurs du soir peut repousser le coucher ; 18 h-20 h seulement comme repère vers lequel on va. M3 (et surtout M0-M2) : la mise au lit du soir et la tétée de fin de soirée (23 h-minuit) sont deux moments différents, le parent n'a pas à l'attendre pour aller dormir. M9 et M20, phrase de Laura : « Si tu veux partager le dîner en famille, ce sont les adultes qui se calent sur l'heure de son repas. » **Adams 2020 n'est cité nulle part** (l'étude s'arrête à 6 mois ; Laura ne veut pas la poser sur des bébés qui ne font pas encore de longues nuits). Placé dans « La fin de journée ».
- ✅ (06/10) **Personnalisation** : [il/elle] et {prenom} ne portent que le genre et le prénom du profil. La situation du bébé n'est jamais affirmée : « si… », « peut-être », « chez beaucoup de bébés ».
- ✅ (06/10) **Bâillements** : on ne les donne pas comme repère de timing. (L'idée qu'ils « réoxygènent le cerveau » n'est pas retenue : non démontrée.)
- ✅ (06/10) **Temps calme (M12-M23)** : il ne remplace jamais la sieste, qui reste nécessaire. Il la prépare, et il est gardé à la même heure les jours où elle ne passe pas. Pas de durée chiffrée. Conseil d'usage, sans étude.
- ✅ « Coucher plus tôt donne plus de sommeil » : vrai, mais non écrit dans l'app (06/10, voir Adams ci-dessus) ; « le sommeil appelle le sommeil » : pour le coucher, pas pour les siestes du plus grand. On protège le coucher, on surveille la fin des siestes.
- ✅ Une sieste longue ou tardive **peut** décaler le coucher (jamais « après 15 h ce n'est plus réparateur », jamais « le cortisol le réveille »).
- ✅ Réveiller en douceur : on ne réveille pas un bébé en sommeil agité ; porte ouverte, lumière, bruits de la maison, voix, et il sort du sommeil quand il est prêt. (06/10) Sous-titre « Réveiller en douceur » présent **de M3 à M23**, et il vaut aussi pour le réveil du matin.
- ✅ La carte « sieste de 45 minutes » s'ouvre sur « est-ce qu'il est vraiment réveillé ? » (le sommeil agité qu'on prend pour un réveil).
- ✅ Micro-siestes (28/08) : terme unique « micro-siestes », sujet durable sur douze mois, l'humeur est le fil commun ; M8 *Les micro-siestes à huit mois* ajoutée.
- ✅ Régressions (29/09) : le terme est désamorcé dans la phrase suivante ; les turbulences suivent **son** acquisition, pas son âge. Formulation : « rien ne régresse… c'est son cerveau qui travaille ailleurs ». Jamais de calendrier ni de « semaines miracles ».
- ✅ Associations d'endormissement : reformulation de Laura retenue (« n'a pas toujours les capacités pour s'apaiser à nouveau… lui donner la chance de se rendormir avant d'agir, sans le laisser pleurer »).
- ✅ Trame des siestes : les transitions deviennent des situations datées du thème Sommeil ; le permanent vit dans « La journée ». 🔁 La question « thème Siestes à part ? » est close par la structure A.
- ✅ La chambre : bébé **l'habite avant d'y dormir** ; ni lieu de punition ni lieu réservé au coucher. On ne reprend pas les « dix minutes max dans la chambre » de la concurrente.
- ✅ Chronotype : M12-M23 uniquement (formulation validée « Il semble du soir ? Avant de conclure, regarde deux heures… »), jamais en M0-M11.

---

# 4. Écriture : ton, vocabulaire, typographie

## 4.1 Ton

| Date | Décision |
|---|---|
| 26/08 | ✅ **Positif partout**, sauf `erreurs_a_eviter` (négatif assumé : le geste et sa conséquence) et `consulter_si` (descriptif). L'interdit (« jamais ») est réservé au danger vital. |
| 15/10 | ✅ **Posture de l'app : « Être ferme sur les repères, précise sur les gestes, honnête sur les limites. »** Appliquée dans `SKILL_contenu` § Voix et ton. |
| 15/10 | ✅ **Le « non » n'est pas réservé au danger réel.** Une limite tenue a trois fondements, tous légitimes : la **sécurité**, le **respect d'autrui**, les **besoins de la famille** (parent compris). « Réserver le non au danger réel » est une formule trop étroite, à ne jamais écrire : la règle du « jamais » ne vise que le **vocabulaire de l'interdit**, pas l'existence des limites. Ce qui n'entre dans aucun des trois fondements est un réglage : choix cadré, « oui » possible, ou on lâche. Formulation : « Garde tes non pour ce qui compte : sa sécurité, le respect des autres, ce dont la famille a besoin. » Vu en réécrivant M11 « pleurs / opposition ». |
| 15/10 | ✅ **Une limite se tient, et elle peut se revoir** : on la tient même si l'enfant proteste ; accueillir sa colère n'oblige pas à changer la décision ; on peut l'ajuster quand elle n'est plus adaptée, **à froid et pour une raison, jamais en pleine crise**. Formulation de référence : « Garde une limite importante, même si ton enfant proteste. Accueillir sa colère ne signifie pas devoir changer ta décision. En revanche, tu peux ajuster une limite si elle n'est plus adaptée. » |
| 15/10 | ✅ **On ne justifie jamais une limite par un apprentissage prêté à l'enfant** (« sinon il apprend que la crise fonctionne », « ne pas céder après la crise : cela apprendrait que… ») : raisonnement de conditionnement, trop catégorique pour un jeune enfant, et il fait porter au parent la faute d'avoir cédé. On dit ce que la limite protège. |
| 15/10 | ✅ **Toujours une direction très claire : tenir les limites importantes sans entrer dans un rapport de force.** Ce qu'on tient, ce qu'on laisse, ce qu'on n'engage pas (bras de fer, victoire à obtenir, dernière parole). |
| 16/10 | ✅ **Une formule certaine sur un comportement qui peut avoir plusieurs explications est reformulée** (« ce n'est pas un problème d'éducation », « il fait ça parce que »). On nomme une cause possible parmi d'autres (fatigue, faim, dents, journée chargée), avec « souvent », « beaucoup d'enfants », et sans culpabiliser le parent. Pour la limite à tenir, formulation de Laura : « Si la limite reste nécessaire, essaie de la maintenir calmement. Tu peux aussi adapter ta réponse à l'âge, aux besoins et à l'état de fatigue de ton enfant. » |
| 16/10 | ✅ **Jamais « scientifiquement validé »**, ni pour Guide-moi dans son ensemble ni pour une fiche ou un geste. On écrit : « informations documentées, sources consultables et conseils pratiques », seulement quand c'est effectivement le cas. Même famille d'interdits : « prouvé scientifiquement », « démontré » sans étude citée, « la science dit ». Une affirmation de développement porte une source pertinente et sa nuance. |
| 16/10 | ✅ **Le mot « protocole » ne s'affiche pas au parent** : il suggère une procédure validée et standardisée, ce que l'app n'est pas. On écrit « repères et gestes » (ou « fiche », « situation »). Il reste en interne (champs JSON, fichiers, skills, code). 🔁 complète la règle du 26/08 (« protocole » jamais pour dire « marche à suivre »). Reste à renommer : sous-titre « Protocoles » du dashboard, alt des visuels du lecteur de réflexologie, 11 occurrences dans le contenu vivant (dont M11 surstimulation). |
| 17/10 | ✅ **Le bébé est une personne unique dès sa naissance.** On n'écrit jamais qu'il « devient quelqu'un », « naît comme sujet » ou « construit son je » à tel âge. Ce qui évolue, c'est ce qu'il exprime : sa volonté, ses envies, ses refus. M11 *L'opposition qui arrive* : titre 🔁 « La naissance du “je” » → « Une volonté qui s'affirme ». |
| 26/08 | ✅ Vocabulaire de jugement (caprice, manipulation, faire exprès…) : seulement dans une carte dont c'est le sujet, attribué à celui qui le prononce, une fois par bloc, jamais dans l'ancrage ni le principe. L'affirmation plutôt que la négation. |
| 26/08 | ✅ **Précision n'est pas jargon** : on garde un terme précis s'il est compris par une mère fatiguée **et** qu'il travaille (caution physiologique, mot réutilisable). « Développement » se garde toujours. |
| 26/08 | ✅ Pas de ton hautain ni de métaphore de tableur ; test de lecture à voix haute. « Protocole » jamais employé dans une fiche pour dire « marche à suivre » (voir 16/10). |
| 26/08 · 22/09 | ✅ **Nommer ce que le parent traverse** dans les situations exténuantes (3 critères sur 4, ≈ une sur huit), attribué aux autres parents, avec un vrai mot ; ancrage jusqu'à 55 mots. Si l'émotion nommée est la colère : **l'issue dans la même fiche** (poser bébé sur le dos dans son lit, sortir, appeler). 22/09 : émotions du parent là où c'est propice, pas partout ; le parent peut s'excuser et se montrer vulnérable. |
| 08/09 | ✅ **Test de genre à l'échelle du protocole** : si l'explication a déjà désigné à qui elle parle, les accords suivent. Ne pas refroidir un texte par une neutralisation inutile. |
| 02/09 | ✅ À deux ans, **on pose le cadre ET on reste** : aucun enfant de 18-24 mois ne se débrouille seul avec ses émotions ou l'endormissement. |
| 28/09 | ✅ **On ne laisse jamais entendre qu'un enfant attend seul** (« consoler d'abord, proposer le geste ensuite »). |
| 22/09 | ✅ Une comparaison n'est jamais un sujet de motricité seule. |
| 29/09 | ✅ On ramène le parent à **l'observation de son bébé** : les pleurs sont le signal le plus fort, pas le seul ; le langage corporel d'abord (« Ton bébé te parle bien avant de pleurer… »). |

## 4.2 Typographie et formes

| Date | Décision |
|---|---|
| — | ✅ **Aucun tiret cadratin** dans le contenu ; demi-cadratin seulement dans une fourchette chiffrée. Ponctuation de remplacement variée. |
| — | ✅ Insécables avant `: ; ! ?` et `»`, après `«` ; guillemets français ; tutoiement ; « ton enfant » ; pas d'écriture inclusive typographique ; « dépression post-partum » et « réflexologie » en toutes lettres. |
| 09/09 | ✅ **Deux marques** : `*italique*` réservé à la citation d'une étude ; `**gras**` pour accentuer quelques mots. |
| 08/09 → 09/09 | ✅ **Toute durée chronométrée en chiffres** (30 secondes, 10 minutes, 4 heures d'affilée), heures d'horloge en chiffres. En lettres : jours, semaines, mois ; « une heure », « une seconde » ; minuit, midi ; les figures de style (« il ne tient pas en place une minute »). |
| 30/09 soir | ✅ Personnalisation de la rubrique sommeil : `[masculin/féminin]`, `{prenom}` avec parcimonie (1-2 par fichier). |
| 16/10 | ✅ Les étapes d'action ont une **amorce avant le premier deux-points** (rendue en gras par l'app). Une phrase de Laura qui n'a pas d'amorce en reçoit une (« Tenir et adapter : … »), sans toucher à ses mots. |

---

# 5. Sources et chiffres

## 5.1 Sources

| Date | Décision |
|---|---|
| 28/08 | ✅ **Les faits sont libres, la forme ne l'est pas.** Un contenu payant (formation, cahier de concurrente) ne devient jamais la base d'un contenu : liste de vérification, jamais brouillon. Chaque affirmation est re-sourcée publiquement. |
| 01/09 | ✅ Formation EDPP : savoirs réutilisables avec ses propres mots ; interdit de copier, diffuser les supports, reproduire une séquence détaillée originale, laisser croire à un partenariat. Sécurité du sommeil : recommandations officielles françaises uniquement. |
| 25/09 → 28/09 | ✅ **Institutions françaises d'abord** (HAS, Santé publique France / 1000 premiers jours, ameli, mpedia/AFPA, Inserm, HCSP, ANSES, Réseau Morphée, INSV, SFP…), **étude publiée** (même étrangère) quand la France est muette ou n'a pas le repère. Étude identifiable, résumé lu, conclusion sans déformation. Jamais de blog, cabinet privé, site commercial, support de formation, concurrent. Suivi dans `bibliographie_etudes.md`. 🔁 remplace « pas de source étrangère ». |
| 30/09 soir | ✅ Sur la physiologie, **on cite l'étude dans la phrase en priorité** (plus crédible), l'institution dans le champ `source`. |
| 30/09 soir | ✅ **Toutes les idées sourcées vivent dans `claude/banque_idees_sourcees.md`** : un tableau par thème, « en simple » + « le détail exact » + étude + statut (✅ citable, 🟠 à manier, ❌ écarté, 🔍 non lu). On écrit simple, à partir du détail exact : on ne perd rien en richesse. `bibliographie_etudes.md` garde les fiches détaillées. |
| 30/09 soir | ✅ **Le Réseau Morphée est citable** : association à but non lucratif, réseau de santé financé par l'ARS Île-de-France, qui ne vend rien. Ce n'est ni un cabinet privé ni un site commercial. Mais sur le sommeil ordinaire, on ne le met nulle part : ni dans la phrase, ni dans la ligne `source`. |
| 30/09 soir | ✅ **La ligne `source` ne porte que deux choses** : la référence complète des études **citées dans la phrase**, et la source officielle quand on doit se protéger (sécurité, conduite médicale, seuil de dépistage). Rien d'autre : pas d'institution « pour faire sérieux ». Une fiche de sommeil ordinaire sans étude citée n'a pas de ligne `source`. (Concilie la règle du 08/09 et celle du 28/09.) |
| 30/09 soir | ✅ **Chaque source en bas de fiche dit ce qu'elle source.** Une ligne `source` générique laisserait croire que toute la page vient de ces références, alors que l'app crée aussi son contenu. Format : « ce qu'elle appuie : référence », entrées séparées par un point-virgule, une entrée par idée citée dans le texte. Marqueur : voir la règle suivante. |
| 30/09 soir | ✅ **Appels de note en exposant, pas de nom de chercheur dans la phrase.** Les études donnent de la crédibilité, mais la maman n'a pas à retenir un nom : la phrase reste légère (« les enregistrements du sommeil des bébés le montrent³ », « d'après une analyse portant sur près de 2 000 bébés² »), le chiffre ¹ ² ³ (caractères Unicode, aucun code à changer) renvoie à la ligne `source`, écrite « ¹ ce qu'elle appuie : référence ; ² … ». 🔁 Remplace « citation en italique dans la phrase » (28/09) et le marqueur `*` (conflit avec l'italique). |
| 30/09 soir | ✅ **Une source qui explique une évolution se cite à chaque étape**, tous les mois où elle sert (ex. les états de vigilance de Brazelton) : les parents n'arrivent pas tous à M0. |
| 30/09 soir | ✅ **Ce qui compte pour le parent, c'est ce qu'il voit.** Le sommeil agité est l'ancêtre du sommeil paradoxal ; chez l'adulte le corps y est immobile, chez le bébé il s'accompagne de petits mouvements (grimaces, sursauts, doigts) qui diminuent mois après mois ; ce ne sont pas des réveils, et des chercheurs pensent qu'ils aident le cerveau à faire connaissance avec le corps (*Sokoloff et al., Developmental Psychobiology*, 2020, 16 bébés de 2 semaines à 7 mois ; rôle = hypothèse des auteurs). Le nom « paradoxal » donné par Jouvet en 1959 n'est pas retenu : sans intérêt pour le parent. Formulation : le sommeil agité est « un sommeil paradoxal en construction » (jamais « l'ancêtre », qui laisse croire à une forme disparue). |
| 30/09 soir | ✅ **Sur la physiologie et la neurologie du sommeil, on cite les études de neurologie**, pas ameli ni les sites grand public : citer ameli sur ces sujets donne l'impression de revendre du contenu gratuit. **ameli et les institutions se citent pour la sécurité officielle** (couchage, alertes, santé). Exemples retenus : l'évolution du sommeil agité vers le sommeil paradoxal (*Sokoloff et al.*, 2020) ; l'hormone de croissance libérée à l'entrée dans le sommeil profond (*Takahashi, Kipnis & Daughaday, J Clin Invest, 1968*, adultes) ; les états de vigilance de *T. Berry Brazelton* (NBAS) et *Prechtl, Brain Research, 1974* — à placer dans l'intro M0-M2. Une citation par bloc au plus. |
| 08/09 | ✅ La ligne `source` en bas de carte ne sert **qu'à se protéger légalement** (danger, geste interdit, conduite médicale, seuil de dépistage). Un chiffre porte sa source **dans la phrase**, en italique. |
| 22/09 | ✅ **Aucun nom de praticien** dans le contenu (« les kinésithérapeutes et les psychomotriciens »). |
| 28/09 | ✅ Le PDF « réflexes archaïques » n'est pas une source : repérage seulement. |
| 08/09 · 09/09 | ✅ Pas de référence juridique précise (numéro d'article, durée légale) : on évoque et on oriente (service-public.fr). **Seule exception** : la loi de 2019 sur les violences éducatives ordinaires, à M13 carte des avis extérieurs, **jamais** sur les cartes de colère parentale. |
| 17/10 | ✅ **Sources citées en entier, reliées à la phrase par un numéro.** Partout (Guide-moi comme sommeil), toute source citée porte sa référence complète dans la ligne `source` (auteurs, titre exact, revue ou institution, année, volume si étude) et un petit numéro en exposant (¹ ² ³) placé à la fin de la phrase qu'elle appuie. Format : « Source : ¹ ce qu'elle appuie, référence complète ; ² … ». Pas de nom de chercheur dans la phrase. Une source dont on n'a pas lu le contenu n'est pas citée. |
| 16/10 → 17/10 | ✅ **Opposition et affirmation de soi** : source *mpedia.fr (AFPA), « Apprendre à s'affirmer », mis à jour le 7 février 2022* (🔁 titre et date corrigés le 17/10). **Texte lu en entier le 17/10** (collé par Laura en plusieurs morceaux : la page est bloquée pour Claude, 403). Il dit : le nourrisson s'affirme dès la naissance par son langage propre (pleurs, regards, gestes) ; il découvre vers 8 mois qu'il est distinct de ses parents ; entre 1 et 3 ans, « l'âge du non » pose les bases de l'affirmation de soi ; « marquer son refus est un moyen de tester sa puissance » ; le « non » peut chercher à susciter l'attention, tester la réaction de l'adulte, éprouver les limites ; l'enfant a besoin de limites, elles le rassurent ; « conseil du pédiatre » : l'enfant ne rejette pas ses parents, on lui montre les limites en réaffirmant l'affection, l'étape est douce ou tumultueuse selon les enfants. **À M11 carte 1, la fiche cite 5 points (¹ à ⁵).** ⚠️ L'imitation comme origine du « non » (idée de Laura) n'est PAS dans cet article : à n'écrire qu'avec une source lue. |
| 17/10 | ✅ **Une source bloquée pour Claude (403, robots) se lit par copier-coller de Laura**, ou ne se cite pas. L'outil de lecture web ne rend qu'un résumé, jamais le texte entier. |
| 17/10 | ✅ **M11 carte 1 recadrée en « pleurs et frustration »** (Laura) : à 11 mois ce sont les premiers refus d'un bébé qui n'a pas les mots, pas l'opposition installée. Situation « Le refus qui fait hurler », titre « Il refuse, et il n'a que ses cris ». Angle propre à cette carte : **décoder ce qu'il veut/refuse** (regard, main, deux choix désignables). Elle ne reprend pas les cartes voisines : *colère du corps entier* (M10 N1 c.3), *interdit qui révolte* (M8 N1 c.2, M10 N1 c.2), *limite qui déclenche la crise* (M11 N6 c.2), *premières colères* (M12 N1 c.0). Sources mpedia ¹ à ⁴ ; « test de la réaction » retiré (réservé à M14). |
| 17/10 | ✅ **Opposition / affirmation de soi : trois fiches, trois âges** (Laura). **M11** `M11_guide_moi_N1_pleurs` c.1 = premiers refus, frustration sans mots. **M14** `M14_guide_moi_N1_emotion.json` (nouveau, 1 carte) *Les premiers « non »* = début de l'âge du « non » : chercher le pourquoi, entendre son refus, dire le sien, laisser des oui ; sources mpedia ¹ à ⁵ (dont « test de la réaction » et « dire non pour mieux dire oui »). **M18** `M18_guide_moi_N1_emotion.json` (nouveau, 1 carte) *Le non à tout* = trier le non réflexe du vrai refus, marquer vers 18 mois, « tester sa puissance » ; sources mpedia ¹ à ³. Les fichiers sont écrits, **l'import n'a pas été lancé** (M14 et M18 n'ont encore que N2/N9 en nouveau format). ⚠️ Ancienne carte « PHASE D'OPPOSITION SYSTÉMATIQUE » toujours dans `mois-14/01-guide.json` (cadratins, « cortex préfrontal », « il imite tout » non sourcés) : à retirer quand M14 migre. ⚠️ Recoupements à surveiller : M18 N9 c.3 *L'enfant que je ne reconnais plus* (angle parent) et M23 N1 c.2 *Le non permanent* (choix cadrés, faire seul) ; M18 N1 s'en distingue par le tri des non réflexes/vrais refus. L'imitation comme origine du « non » : seulement avec une source lue. |
| 17/10 | ✅ **M23 N1 émotion, cartes 1 à 4 réécrites** (Laura) : *La grande colère*, *La frustration du non*, ***Le « moi tout seul » / Il refuse mon aide*** (ex *Le non permanent*, recadré : le « faire seul » hors repas n'avait aucune fiche, les repas sont à M12, M15, M18, M22), *La morsure*. Cadratins retirés, « tempête neurologique », « la crise finit toujours », « la frustration est un muscle » reformulés avec des tournures prudentes ; plus aucune formule « céder = la crise fonctionne » (principe de la limite repris de la formulation du 15/10). Sources mpedia sur la frustration (¹ ²) et le moi tout seul (¹ à ⁴). Sauvegarde `_sauvegardes/2026-10-17/avant_M23_N1/`. ⚠️ Cartes 5 à 7 du même fichier (fin de journée, après-écran, jalousie) pas reprises : cadratins et « soigner » à corriger. |
| 17/10 | ✅ **Ne pas prêter d'intention à l'enfant** (Laura, exemple M18) : jamais « il teste sa puissance » / « il cherche à te défier » écrit comme une certitude. On écrit « à cet âge, ton enfant peut exprimer plus fortement ses préférences » et « ses refus ne signifient pas forcément qu'il cherche à te défier ». Appliqué à M18 N1 (titre devenu « Un non qui n'est pas un défi ») et M14 N1 (« il peut chercher ton attention, tester ta réaction… »). Règle ajoutée à SKILL_contenu. ⚠️ À rechercher dans les autres fiches : « teste », « défie », « fait exprès », « manipule ». |
| 17/10 | ✅ **Lot « intentions prêtées à l'enfant » repris** (Laura : analyser chaque situation pour éviter les non-sens). **15 cartes** : M3 N1 c.3, M5 N6 c.1, M6 N1 c.4, M6 N7 c.1, M7 N1 c.2, M8 N1 c.1 (« lire comme de la manipulation » → « penser qu'il pleure pour te retenir : il t'appelle plutôt qu'il ne calcule » ; ⚠️ « à trois/huit mois il ne sait pas prévoir l'effet de ce qu'il fait » retiré : contredit l'étude Zaadnoordijk, sentiment d'agentivité dès 3-4 mois) ; M9 N5 c.2 (morsure), M12 N3 c.3 (« tester où se situe la limite » → « découvrir »), M13 N9 c.1, M14 N9 c.4, M18 N9 c.4 (titre « Un enfant qui s'affirme », principe, erreurs, source mpedia ajoutée ; retiré « le jour où elle n'arrive pas, c'est cela qui inquiète les professionnels », non sourcé), M21 N9 c.4, M23 N1 c.5 (fin de journée : « neurochimie pure » et « glycémie chute » retirés), M23 N1 c.7 (jalousie), M23 N3 c.2. Sauvegardes `_sauvegardes/2026-10-17/avant_lot_intentions/`. ⚠️ **Non traité, à trancher** : ~15 « ce n'est pas un caprice / pas de la manipulation » dans des cartes dont ce n'est pas le sujet (règle du 26/08 : ce vocabulaire seulement dans la carte dont c'est le sujet) ; et les cadratins restants dans M23 N3 et N1 c.6 à c.7. |
| 17/10 | ✅ **Plus aucun tiret cadratin dans l'app** (Laura : toutes les cartes, et « Vivre la saison » aussi). **1 614 textes réécrits** dans `content/**/*.json` (guide, coucher, soin, saison, jeux, SOS), hors archives (`_avant_*`, `*anciens*`, `ancien/`), via `scripts/retirer_cadratins.py` (mode simulation par défaut, `--ecrire` pour appliquer, journal dans `scripts/retirer_cadratins_journal.jsonl`). Règles : « Action immédiate — X » → « Action immédiate : X » ; `[Pause — 5 secondes]` → `[Pause de 5 secondes]` ; incise entre deux cadratins → virgules (parenthèses si elle contient déjà une virgule) ; dans une liste (étapes, erreurs, repères) « Amorce — explication » → « Amorce : explication » (l'amorce reste en gras) ; dans un texte suivi → virgule, deux-points si la suite explique, point + majuscule si la suite est une consigne ; « Source : site, titre ». **Code** : 9 textes visibles corrigés (abonnement, saison, titre de page, accueil, challenge du mois, saison-view, voice-recorder, durée vide `–`). Restent des cadratins uniquement dans les commentaires de code et les migrations SQL (invisibles), et deux expressions régulières qui tolèrent encore l'ancien format (`protocole-view`, `coucher-view`). Sauvegardes : `_sauvegardes/2026-10-17/avant_cadratins/` et `avant_cadratins_code/`. ⚠️ **La base de données n'est pas mise à jour** : les textes de l'app viennent de Supabase, il faut relancer les imports (`import-guide-mois.mjs` par mois, et les imports saison/coucher/soin/jeux/SOS) pour que l'app les affiche. ⚠️ Une relecture visuelle par Laura des textes les plus touchés (saison, coucher) reste à faire : la réécriture est automatique et prudente, pas éditoriale. |
| 19/10 | ✅ **S.O.S plus doux** (Laura) : couleurs passées en pastel (jaune, orange, orange sanguine moins saturés ; le jaune et le corail des numéros étaient trop vifs), bandeau en corail clair avec numéros en pastilles blanches. **Les numéros d'urgence ne s'affichent plus qu'en haut de la page d'ouverture**, plus en tête de chaque maladie. Page d'ouverture : titre « Dois-je consulter ? » sans la mention « S.O.S » ; « En cas de doute, appelez le 15. » en bas de page, comme la mention de protection de Guide-moi. Détail : `content/sos-faut-il-consulter/README.md` §6, §11, §15. |
| 19/10 | ✅ **M11 carte 1 reprise (Laura)** : situation « Les hurlements du refus / Il s'affirme en criant » (l'ancienne « Le refus qui hurle / Il refuse et hurle pour tout » ne voulait rien dire), titre « Entendre son refus, tenir le cadre ». **L'affirmation de soi est aussi dans « Pour toi, parent »** (champ `ancrage`). **Âge du « non » = âge de l'affirmation de soi par le refus, de un à trois ans** : « qui vient plus tard » retiré. **Le « non » peut aussi être une imitation** de ce qu'il entend : conséquence pour le parent = varier les mots (« stop », « c'est interdit »…), étape 4 + pour aller plus loin. ⚠️ L'imitation n'a pas de source lue : écrite au conditionnel (« peut aussi »), sans numéro. **Une seule source mpedia, numérotée ¹ à chaque phrase concernée** (plus de ¹ ² ³ ⁴ pour un même article) ; « ne te rejette pas » et « plus ou moins tumultueuse » sans numéro. « Revoir une limite à froid : … pour une bonne raison, et non en pleine crise » (mot « bonne » ajouté, remis en 4ᵉ item à la place de « Se relayer »). **Principe recentré sur l'autonomie** (Laura : « on est trop dans la limite ») : « Anticipe le besoin d'autonomie qui arrive… », la limite ne vient qu'en seconde phrase ; verbes ramenés à l'envie (« montre l'envie d'essayer et de choisir ») car le « moi tout seul » complet est à M18 et M23. Règle ajoutée à SKILL_contenu (« une même source garde le même numéro »). |
| 17/10 | ✅ **Le libellé `situation` fait 55 caractères au maximum (cible 50)**, règle déjà non négociable dans SKILL_contenu et **non contrôlée par la QA** : j'ai écrit des libellés de 56 et 55 caractères sans alerte. Corrigé : `qa_contenu.py` signale maintenant tout libellé au-delà de 50 (alerte) ou de 55. **231 libellés existants dépassent 55 caractères** : chantier à ouvrir. Libellés des trois nouvelles cartes : 49, 49, 46 caractères. |
| 17/10 | ✅ **Neurosciences : *Zaadnoordijk et al. 2020* citée en M3 « La découverte des mains »** (validé par Laura). *« From movement to action: An EEG study into the emerging sense of agency in early infancy », Developmental Cognitive Neuroscience, vol. 42, 2020* : bébés de 3 à 4,5 mois, 22 analysés en EEG, sens de l'agentivité en émergence, **pas chez tous** (on écrit « le cerveau de certains bébés commence à repérer… »). Elle ne parle ni de mains en particulier, ni de « non », ni de frustration : **non citée sur M11, M4, M5**. Le protocole (écran) n'est pas décrit. Repérée, non lue (page bloquée) : PMC4585515. |

## 5.2 Chiffres — règle définitive (30/09)

✅ **Le chiffre qui récompense un geste s'écrit. Le chiffre qui fait peur ou qui fait se compter ne s'écrit pas.**
- On écrit : l'effet d'un geste (portage ≥ 3 h/jour : −43 % de pleurs à 6 semaines), un repère avec sa dispersion, un mécanisme qui justifie un geste, la taille de l'étude, un ordre de grandeur qui émerveille.
- On n'écrit pas : mortalité, traumatisme, maltraitance (**Q11, absolu**) ; prévalence d'un trouble chez le lecteur ; risque à long terme ; chiffre trop précis ou trop dispersif ; effet trop mince pour l'effort demandé.
- Présentation : **arrondi** (29/09 : « en mois », « un peu plus de 4 sur 10 », jamais de r ni de décimales) ; population toujours nommée ; source en italique dans la phrase ; **un seul chiffre par idée**.
- Un repère « faire ses nuits » se donne avec la part qui n'y est pas encore (28/09).

Historique : 🔁 28/08 « seuls les critères de dépistage » → 🔁 08/09 prévalences gardées si sourçables (baby blues 50 à 80 % *ameli* ; dépression post-partum 16,7 % des femmes à deux mois *ENP 2021* ; plus de 10 % des pères *Inserm 2023*) → 🔁 29/09 « le mécanisme se nomme, le chiffre ne se donne pas » → **30/09 règle ci-dessus**. Les trois formulations de prévalence du 08/09 restent valables dans *Prendre soin de moi*.

| Date | Décision |
|---|---|
| 02/09 · 03/09 | ✅ **Aucun chiffre sur les aides, remboursements, dispositifs** (montant, plafond, nombre de séances, durée de droit). Le nom, l'usage, où vérifier. « **Mon soutien psy** : des séances de psychologue prises en charge par l'Assurance Maladie, sur rendez-vous direct ou après avis d'un médecin. » (🔁 MonParcoursPsy.) |
| 09/09 | ✅ Une **fourchette d'acquisition** se donne en entier ou pas du tout, pour élargir, jamais pour situer (marche : fourchette OMS 8 à 18 mois). |
| 08/09 | ⚠️ Tout chiffre déjà présent dans le corpus est non vérifié tant qu'il ne porte pas sa source dans la phrase. |
| 28/09 | ✅ Chiffres de la formation écartés : 29 % couche souillée, 40 % des pleurs le soir, micro-réveil de 3 min, 8 secondes de Bullinger, ondes à 3 mètres, bols tibétains, pic des neurones miroirs, 20 min de lumière → cortisol, horloge de 25 h, deux pics de cortisol, 21 jours pour une habitude. |

---

# 6. Cadre légal, santé, sécurité

## 6.1 Cadre légal

| Date | Décision |
|---|---|
| — | ✅ Information générale, jamais de diagnostic individualisé ; le parent est le seul acteur sur son enfant ; non-substitution + renvoi au professionnel nommé. Vocabulaire médical réservé interdit. |
| 29/08 | ✅ **Massage bien-être autorisé, thérapeutique interdit** : ce n'est pas le geste, c'est ce qu'on lui promet. **On écrit « massage », « massage doux », jamais une périphrase (« moment de toucher »)** : rappel de Laura le 06/10. |
| 26/08 | ✅ **« Se soigne »** : gardé quand la phrase envoie vers un professionnel, reformulé quand elle laisse entendre que ça se résout seul. « Soigner » au sens de « faire avec soin » → veiller à, peaufiner. |
| 26/08 | ✅ **On ne prend pas position sur un remède** (ni efficacité, ni contre-indication) : renvoi au pharmacien. Exception : le danger physique d'un objet (collier de dentition), traité dans le couchage : « Un collier de dentition autour du cou : la ficelle peut s'enrouler, les perles se détacher. Rien ne se porte au cou d'un bébé, ni le jour ni la sieste. » (M5 et M7). Rappel court : « couchage sur le dos, matelas ferme, lit vide, rien autour du cou, chambre des parents les six premiers mois ». |
| 09/09 | ✅ Huiles essentielles : amorce identique « Utiliser des huiles essentielles : contre-indiquées chez le nourrisson », suite adaptée au sujet. 🔁 remplace le « en parler au pharmacien » du 01/09. |
| 28/09 | ✅ **Ostéopathie : l'app n'en parle pas**, ni pour ni contre. Torticolis, asymétrie, tête plate : médecin, puis kinésithérapeute si besoin. |
| 28/09 | ✅ Motricité : on peut installer, varier les positions, porter avec des appuis, accompagner un mouvement que bébé amorce, aménager. On n'écrit pas : mobiliser une articulation, étirer, exercices en série, geste présenté comme corrigeant un signe. Le critère est la **finalité**. Les mots (contenance, enroulement) sont libres, les actes et les titres sont protégés. |

## 6.2 Alertes et sécurité

| Date | Décision |
|---|---|
| 06/10 | ✅ **Co-parent au coucher (M0-M23)** : le parent habituel s'en va en le disant, reste hors de vue et hors de portée de voix, **n'intervient pas** ; **le co-parent traverse lui-même la tempête émotionnelle**, sans laisser bébé pleurer seul : c'est là que le lien se crée. **Si vraiment rien n'apaise, appeler l'autre n'est pas un échec** (même si c'est vécu comme tel), et si le co-parent est à bout : bébé sur le dos dans son lit, il sort, respire, appelle. **D'où l'essentiel : le co-parent prend le coucher régulièrement dès la naissance (M0)**, et le parent habituel n'interfère pas, pour le lien co-parent / bébé et pour la confiance du co-parent. Pas de « doit », pas de quota de soirs. Les champs `co_parent` de M0-M2 sont à revoir dans ce sens. |
| 30/09 | ✅ **Une alerte ne se nuance pas** : « Un bébé ne se secoue jamais, même une seconde, même doucement. » Point. La distinction secouer / bercer se fait ailleurs, positivement, dans le contenu sur le bercement. |
| 01/09 | ✅ **Le cadre de sécurité se répète mot pour mot** partout où le même risque se présente (refrain). Jamais deux fois dans le même protocole ; refrain neutre, qui peut voyager. Exclu de la mesure de recopie. |
| 28/09 | ✅ Un sujet à risque se protège : signes d'alerte en action immédiate ; ne pas mobiliser si nuque ou dos peuvent être touchés ; aucun médicament sans avis ; modalités de surveillance. Jamais « sans être médecin ». |
| 29/09 | ✅ **Laisser pleurer : jamais, en deux temps.** Quand on va bien, on n'abandonne pas un bébé à sa détresse. Quand le parent est au bout : bébé sur le dos dans son lit, on sort quelques minutes, on respire, on appelle (HAS 2017, Santé publique France, ameli). On nomme simplement le risque de débordement, jamais son chiffre. |
| 28/09 · 29/09 · 06/10 | ⚠️ Prévention du bébé secoué dans la rubrique sommeil **dès la naissance (M0)** (Laura, 06/10), placée dans « La fin de journée » sous « Quand tu es à bout » : phrase d'alerte non nuancée + conduite à tenir + Allo Parents Bébé + 15. Écrite pour M3 et M9 ; P0 pour les autres mois. **De M0 à M11** (tranché le 06/10) ; après, seule la conduite à tenir quand le parent est à bout reste. |
| 28/09 | ✅ **Couchage** : à plat sur le dos, **y compris en cas de reflux** (on explique : ça ne réduit pas le reflux, et à plat sur le dos une régurgitation n'expose pas à un sur-risque). Pas d'inclinaison, pas de cale-bébé, cocon, réducteur. Partage de chambre formulé à l'endroit (il protège). Jamais de sommeil partagé sur canapé ou fauteuil. |
| 28/09 | ✅ **Emmaillotage retiré de l'app**, remplacé par la **contenance** (mains enveloppantes, bras vers le milieu, jambes fléchies, portage, peau à peau). Jamais dans le lit. |
| 28/09 | ✅ **Doudou hors du lit avant 12 mois** (version la plus prudente, en assumant qu'ameli est plus permissif) ; doudou câlin en journée. |
| 28/09 | ✅ **Tétine** : formulation ameli (au coucher, sans forcer, jamais attachée, une fois l'allaitement installé), sans expliquer le mécanisme. |
| 28/09 | ✅ **Bain enveloppé** gardé (M0-M4) : bébé peut s'assoupir, toujours tenu, **visage hors de l'eau** ; **« la fin du bain se décide avant qu'il se refroidisse »** (formulation de Laura, 06/10), **c'est le parent qui décide de la fin du bain**, avant qu'il se refroidisse ; jamais d'eau chaude rajoutée ; rien d'autre dans l'eau ; pas de photo ni de téléphone ; réflexe des points cardinaux expliqué ; on écrit « lange », jamais dans le lit ; jamais qu'un réflexe protégerait de l'eau. |
| 28/09 | ✅ **Biberon de nuit** : préparé au moment de le donner (ANSES), pas de thermos d'eau tiède. |
| 06/10 | ✅ **Bain, selon l'âge** (Laura) : **M0-M8 : « Ne le lâche jamais dans le bain, même une seconde »** (il ne tient pas encore assis : c'est plus que ne pas le laisser seul) ; **M9-M23 : « Ne le laisse jamais seul dans le bain, même une seconde »**. **M0-M4 : le réflexe des points cardinaux** (ou de fouissement), expliqué : on touche sa joue ou le coin de sa bouche, il tourne la tête pour chercher à téter ; dans le bain, ne pas toucher son visage, il pourrait tourner la tête vers l'eau et en aspirer ; s'intègre généralement vers 3 à 4 mois. |
| 28/09 | ✅ **Bruit blanc** : volume bas, loin du lit, pas toute la nuit, à chaque mention. |
| 28/09 | ✅ **Peau à peau** : parent semi-assis, éveillé, sans téléphone, visage de bébé visible, nez et bouche dégagés ; M0-M2 surtout. |
| 28/09 | ✅ **Écrans** : aucun avant 3 ans (règle officielle, autorité nommée) ; l'écran accompagné dès M19-M20 comme réduction des risques, pas comme recommandation. |
| 06/10 | ✅ **Écrans dans la rubrique sommeil** : on n'y parle que de **lumière et de surstimulation** (télévision en fond comprise) ; la règle « aucun écran avant 3 ans » et l'écran accompagné relèvent d'un autre sujet, pas de la fin de journée. On n'écrit jamais « le soir, éteins-les » (ça laisserait entendre que c'est bon en journée) : « Éteins-les dans la pièce où [il/elle] est. » |
| 28/09 | ✅ **Tummy time** : dans Motricité seulement, temps d'éveil surveillé et accompagné ; « le port de tête résulte aussi d'une maturité cérébrale, qui ne se force pas » (principe de l'app). |
| 28/09 | ✅ Langue et voies respiratoires : **aucun exercice lingual** ; on traite le sujet respiratoire (ronfle, dort bouche ouverte : signes, entretien du nez, le médecin tranche). |
| 28/08 · 01/09 | ✅ Choc à la tête, signes d'alerte : carte M13 gardée avec seuils (M12 restructurée le 28/09 : 6 signes qui font appeler le 15). |

---

# 7. Numéros et relais

| Date | Décision |
|---|---|
| 02/09 | ✅ Relais par défaut : **Allo Parents Bébé, 0 800 00 34 56** (gratuit, des psychologues au bout du fil). Tristesse qui dure : médecin, sage-femme, PMI, entretien postnatal précoce. Violences dans le couple : 3919 (danger immédiat : 17). Danger immédiat, bébé secoué : 15. |
| 02/09 → 08/09 | ✅ **Le 3114 et le vocabulaire du suicide sortent de l'app**, sauf **M0, M3 et M7**, les seuls mois qui nomment les pensées noires : « Si les pensées noires s'installent, le 3114 répond jour et nuit. » après les professionnels. 🔁 retrait total du 02/09 révisé le 08/09. |
| 09/09 | ✅ **Le 119** ne s'annonce jamais sans son introduction : « Et si tu as besoin de parler de ce que tu ressens envers ton enfant, le 119 répond aussi aux parents, jour et nuit, et il n'apparaît sur aucun relevé de téléphone. » Cas d'un tiers qui frappe : « malgré tes avertissements ». |
| 08/09 | ✅ **Aucun horaire** d'aucune ligne d'écoute dans le contenu (la boîte vocale les donne). ⚠️ À vérifier une fois : le répondeur d'Allo Parents Bébé annonce-t-il bien ses plages ? |

---

# 8. Réflexologie

| Date | Décision |
|---|---|
| 09/09 · 22/09 | ✅ **On n'invente jamais une séquence** (plantaire, palmaire ou autre) : soit `lien_reflexologie` vers un protocole validé, soit pas de réflexologie et un vrai geste d'apaisement ou un titre du thème. Toutes les réflexologies inventées retirées (180 `geste_doux` Guide-moi, 23 fichiers Coucher → renvoi « Sommeil agité », Jeux M0 et M6). |
| — | ✅ Vocabulaire : jamais d'échelle de pression chiffrée, jamais « caresse », « Réflexologie » en toutes lettres, pression décrite qualitativement. |
| 22/09 | ✅ Plus de préfixe « Geste doux » dans les titres du bloc. Titres transverses : `Réflexologie : …`, `Observer bébé : …`, `Si ça arrive : …` (danger vital) ; titres thématisés : `Hors du repas` (Alimentation M6+), `Au moment du lait` (Ventre & digestion M0-M5), `Retrouver le contact` (Parents submergés). Un titre ne sort pas de son thème. |
| 28/09 | ✅ Un bloc qui n'est plus un geste doux ne garde pas les gestes d'apaisement : vérifier que le contenu correspond au sujet. |
| 01/09 · 09/09 | ✅ Bornes d'âge : **Coliques M0-M3**, **Inconfort digestif M4-M12**, **Constipation M1-M23**, **Reflux M0-M8** (🔁 M0-M5 le 01/09), **Diarrhée M13-M23**. ⚠️ Le filtre par âge n'est pas branché dans le code : règle éditoriale seulement. |
| 28/09 | ✅ Pas de protocole de réflexologie « Chutes » ni « Énurésie ». |
| 22/09 | ✅ *Prendre soin de moi* : rubrique masquée pour l'instant, non touchée par la passe réflexologie. |

---

# 9. Contenu par domaine

## 9.1 Physiologie du sommeil et des pleurs (tranché)

- ✅ **États de vigilance** (Q1, 28/09) : 4 états + les pleurs (état 6 de Brazelton) : sommeil calme, sommeil agité, éveil calme, éveil agité, pleurs. Phrase de transparence : « Tu liras parfois 4 états, parfois 6… Rien de contradictoire. » Test : « est-ce qu'il interagit avec toi ? Si non, il dort. »
- ✅ **Endormissement** : le nouveau-né s'endort par le sommeil agité ; bascule **progressive** vers le sommeil calme, qui commence vers 2-3 mois et devient majoritaire vers 6 mois (30/09 soir).
- ✅ **Mélatonine, trois niveaux, trois âges** (28/09) : il en **reçoit** (placenta, lait maternel dès le 3e jour) · il en **fabrique** vers 3 mois · elle **agit pleinement** entre 5-6 et 9-12 mois. Jamais « il sécrète mal », jamais un âge unique.
- ✅ **Cortisol en trois temps** (29/09) : la réponse de stress existe dès la naissance ; le rythme sur 24 h ne s'installe qu'entre 6 et 9 mois ; un seul pic, au réveil. Jamais « le cortisol empêche l'endormissement » ni « cortisol et mélatonine s'opposent » : pour s'endormir, il faut **redescendre**, c'est à ça que sert la routine.
- ✅ **Lumière du soir** (29/09) : « la montée de mélatonine est **freinée** » (jamais « supprimée », « détruite ») ; lumière **chaude et basse** ; veilleuse rouge ou ambrée faible pour un soin de nuit ; le moment du parent qui rentre tard compte, on baisse la lumière et on ne culpabilise pas. Écrire « chez le jeune enfant », jamais « chez le bébé » (aucune mesure avant 24 mois). Chiffres Hartstein publiables (erratum sans incidence).
- ✅ **Pleurs** (29/09) : option 1, l'expression, l'accompagnement, la déculpabilisation, **sans le mécanisme de décharge**. « Ce n'est pas le fait de pleurer qui soulage, c'est le fait d'être accompagné. » Jamais « il a besoin de pleurer », « il évacue », « il décharge », « laisse-le aller au bout ». Les pleurs ne sont pas sa seule langue : le langage corporel d'abord.
- ✅ Phrases retenues : le cerveau reconnaît un cri en 100 à 200 millisecondes ; personne ne peut deviner la cause d'un pleur en l'écoutant (*39 201 pleurs analysés*) ; certains pleurs ne s'arrêtent pas, quoi qu'on fasse ; accompagner sans réussir n'est pas échouer.
- ✅ Portage : Hunziker & Barr 1986 (≥ 3 h/jour, −43 %) pour le contenu ; Barr 1991 (3 minutes) reste en note interne.
- ✅ **Semaines miracles** : calendrier non confirmé ; on écrit que les turbulences suivent les acquisitions de chaque bébé. Ni « bonds prouvés », ni « les bonds n'existent pas ».
- ✅ **Le 8e mois** (Q9) : pas « angoisse de séparation » (libellé d'un diagnostic) ; pas « il croit que tu as disparu » ; pas « bébé ne souffre pas » → un désagrément réel, bref, accompagné, sans trace.
- ✅ **Terreurs nocturnes** (29/09) : ne pas réveiller, sécuriser, attendre, ne pas en reparler ; prévention = régularité et sommeil suffisant ; les sources françaises divergent sur l'âge, on écrit une fourchette. Cauchemars : rien avant 2 ans et demi-3 ans (§12 pour la phrase de la formation).
- ✅ Imitation (29/09) : pas d'imitation néonatale affirmée ; M2 **« Le face-à-face »** (réciprocité) ; imitation à M9, M11 « L'Imitateur », M14 (la lampe allumée avec le front). Jamais les neurones miroirs ou en fuseau comme explication.
- ✅ Empathie du bébé (28/09) : « Ton bébé capte l'ambiance… » ; jamais « il est une éponge », « si tu es calme il sera calme ».
- ✅ Nerf vague (Q6, 29/09) : on décrit **l'effet ressenti**, jamais la cible anatomique. Oscillation et bercement décrits avec la douceur au premier plan.
- ✅ Bols tibétains : jamais ; remplacés par le chant de la mère.
- ✅ Manque de sommeil : on parle des **bienfaits** du sommeil, jamais des désagréments du manque.
- ✅ Endormissement au sein (Q2) : physiologique ; rien de pressé avant 2 mois ; à partir de 2 mois, on peut **varier** les conditions, sans calendrier. Jamais « mauvaise habitude ».
- ✅ Allaitement et mort inattendue (Q10) : on n'en parle pas, ni dans un sens ni dans l'autre. **Mère non allaitante** : jamais de « risque », jamais de phrase sur le lien ; pas de distinction de contenu (Q16), les conseils valent pour tous.
- ✅ Horloge interne : repères sur 24 h ; le 25 h est faux.

## 9.2 Alimentation et digestion

- ✅ Régurgitations jusqu'à **M8** (01/09).
- ✅ Biberon : mélanger en **roulant** (choix éditorial assumé, ameli dit « agitez ») ; biberon au rythme du bébé (Q5) : semi-assis, pauses, réflexe d'orientation, réservoir non plein, sans source institutionnelle et sans promesse.
- ✅ Selles espacées du bébé allaité : « une semaine », pas « 8 à 14 jours ».
- ✅ Microbiote : de la connaissance, jamais un produit ; une facette par mois (M4, M5, M6, M7, M9, M10).
- ✅ Huile de massage : « une huile végétale adaptée au bébé », sans exemple (l'huile d'olive disparaît).
- ✅ M12 : cuillère en dehors des repas ; carte « L'allaitement après un an / je continue et ça dérange ».
- ✅ Allaiter ne fatigue pas (hormones du repos).

## 9.3 Motricité et corps

- ✅ Portage minimum jusqu'à M5 ; face au monde traité M3-M5 comme non conseillé, avec ce qu'on favorise (hanche, dos).
- ✅ Quatre pattes : pas obligatoire, important, on dit pourquoi (4,3 % ne le font jamais, OMS 2006).
- ✅ Retournement accompagné autorisé ; pas de retournement à 9 mois = médecin.
- ✅ Enroulement dans les gestes du quotidien ; un bébé en extension habituelle se montre au médecin.
- ✅ Repères OMS distribués sujet par sujet, gardés pour une infographie.
- ✅ Ajouts : réflexes du nouveau-né (M0), prendre et poser (M1), accouchement médicalisé (M0 Parents submergés), temps sur le ventre (M2), quatre-pattes de travers (M9), position en W (M12), ballon (M19), pieds plats (M20), heures dans la coque (M1), premier massage (M3), bébé calé assis (M6), siestes à la crèche (M7), journées trop calmes (M9), retour au calme par le corps (M16), ronflement (M20).
- ✅ Déplacement sur les fesses (22/09) : relié au peu de temps sur le ventre et à une assise installée trop tôt ; *Majnemer et Barr, 2005*.
- ✅ Pas de maladies de peau (peau atopique, plaques qui grattent retirées).
- ✅ Siège auto : M18 gardée (Motricité), M20 libérée.

## 9.4 Dents

- ✅ Les dents se traitent après 15 mois (molaires 13-19, canines 16-23 mois) ; ajouts M13 joues rouges et fièvre, M22 dentiste, M23 dents du fond.

## 9.5 Lien, séparation, langage, tempérament

- ✅ Lien M0-M5 : quatre remplacements (peau à peau, premiers face-à-face, lien après un début difficile, jeu avec un tout-petit).
- ✅ Séparation : les cinq fils gardés ; jeu parallèle à M13, M16, M21 ; méfiance M19 et M22 ; audition M12, M16, M19 ; M15 *Les autres adultes de sa journée*, M21 *Le changement qu'il faut annoncer*, M21 *Le premier copain*.
- ✅ Langage : pas de carte « comment l'aider à parler » ni « bilan d'orthophonie » ; le bilan et ses délais en « pour aller plus loin » des cartes « il parle peu ».
- ✅ Tempérament : M4 *Le caractère qui se dessine*, M14 *La manière d'être qui ne change pas*. Jeu libre : M8 *Le jeu tout seul*.
- ✅ Signaux de fatigue en trois endroits sans répétition : liste dans le coucher, crise à M7, déplacement des signaux à M14.
- ✅ Le geste qui part : les dix occurrences gardées.

## 9.6 Parents submergés et Prendre soin de moi

- ✅ Quatre permutations de mois pour éviter la redite avec *Prendre soin de moi* (M14↔M17, M19↔M22, M20↔M21 ; M23 gardé).
- ✅ Un dispositif trouvé à la source **s'ajoute** (5e point), il ne remplace pas.
- ✅ Le plafond de 800 mots ne coupe pas une carte validée (le `consulter_si` n'est pas de la rédaction).
- ✅ Cohérence cardiaque : l'action, le minuteur, l'activable, cadré « pour toi, pas pour bébé » (chiffre : §12).

---

# 10. Design, UI, code

- ✅ Palette : dernière case bleue `#D5E7EB` ; carte Parents submergés lavande `#DBD7EA`, attribuée **par identifiant** (`slotForCategorie`).
- ✅ `protocole-view.tsx` rend `*italique*` et `**gras**` ; bouton « Ouvrir la séquence » vers `lien_reflexologie` (Guide-moi et Coucher).
- ✅ `soin-detail.tsx` met en gras tout numéro d'appel de l'encart d'urgence.
- ✅ Scripts : `qa_contenu.py` (titres transverses et thématisés, mots interdits insensibles à la casse, remèdes, « se soigne » en alerte) ; `recopie_protocoles.py` (refrains de sécurité et institutionnels exclus) ; `minutes_en_chiffres.py`.

---

# 11. Chantiers décidés, pas encore faits

- Prévention du bébé secoué dans la rubrique sommeil de M0 à M11 (P0) ; faite à M3 et M9.
- Bloc commun « La sécurité » (06/10) : **pas de partie lit / sommier / cordons** (pas notre rôle, lits à barreaux ou au sol) ; une seule phrase `[M6-M11]` : « Avant qu'il se hisse : si son lit a des barreaux, pense à baisser le sommier. » Plusieurs tétines dans le lit : **à partir de M12**. Dents : « quelques jours autour de la sortie », « tous les réveils ne sont pas dus aux dents » (Macknin 2000) ; pas de « 3 nuits ». Repères d'usage gardés sans source : nuque chaude et moite, nuits agitées après un vaccin.
- Guide-moi Sommeil : créer ou enrichir les situations sorties de la rubrique (tétine perdue, terreurs nocturnes, dents, nez bouché, reflux, oreilles, respiration).
- M20 « La journée » : partie « Ses signaux de fatigue » ajoutée le 06/10 (manquait).
- Motricité M9 : développer « redescendre quand on s'est hissé » (plier les genoux, poser les fesses). Évoqué seulement dans « La nuit » M9 du Sommeil (06/10 : un sujet peut vivre dans deux rubriques, évoqué dans l'une, développé dans l'autre).
- Cadre de sécurité du couchage absent de M4 à M11 : réparé par la version unique appelée.
- Les 319 lignes `source` des onze autres thèmes (09/09 : on commence par ça).
- Guillemets et cadratins restants, avec la passe de ton et de chaleur.
- 52 occurrences du 3114 dans 23 fichiers Guide-moi, hors M0, M3, M7.
- Ramener les blocs `geste_doux` de Parents submergés aux trois titres.
- Vocabulaire de la thérapie dans *Prendre soin de moi* (≈ une dizaine de formulations).
- « Pression 0/10 » dans les rituels du coucher et Jeux M0. (06/10 : le mot « massage » n'est **pas** un chantier, il est autorisé ; corrigé dans SKILL_protocole, SKILL_rubriques, SKILL_contenu, CONTENT_INDEX et qa_contenu.py.)
- `signaux_de_fatigue` qui stagnent de M15 à M23.
- Scan « nommer ce que le parent traverse » sur M7-M12 et M23.
- `GUIDE1.XLS` périmé, et reports au tableau maître.
- **Frise du sommeil par âge dessinée en escalier** (hypnogramme simplifié, marches par tranche d'âge) — validé le 30/09 soir, dans la to-do P3.
- Bibliographie : ajouter O'Connor 2026, Jouvet 1959, Takahashi 1968, Edraki 2014, revue *Children* 2024, et la fiche *Zaadnoordijk 2020* (citée en M3 mains, voir §5.1 du 17/10) ; ajouter aussi la fiche *HAS, Prévenir la tête plate, 2021* (limiter le matériel de puériculture, laisser libre de bouger).
- **M11 « pleurs / opposition »** : ✅ carte 1 *L'opposition qui arrive* réécrite les 16-17/10 (sauvegarde `_sauvegardes/2026-10-16/avant_reecriture_M11_opposition/`). ⬜ Cartes 2 à 4 du fichier (*L'épuisement de la marche*, *L'habillage*, *Les pleurs du sevrage*) : cadratins, « jamais », « compenser », à passer aux règles du 15-17/10.
- **« Protocole » côté parent** (16/10) : renommer le sous-titre du dashboard, l'alt des visuels du lecteur de réflexologie, les 11 occurrences du contenu vivant (dont M11 surstimulation, ligne « le relais fait partie du protocole »).
- **Fusion des skills** (17/10) : `skills/SKILL_contenu.md` de l'ordinateur est la version de référence (sections du 06/10 + 15/10 + 16/10 + 17/10). `SKILL_protocole.md` et `SKILL_rubriques.md` restent à relire face aux règles du 15-17/10 (limites, « protocole », « scientifiquement validé »). Les copies du projet Claude sont écrasées par celles de l'ordinateur.

---

# 12. Questions ouvertes, à trancher par Laura

| Depuis | Question |
|---|---|
| 29/09 → 06/10 | ✅ **Cauchemars** : on en parle à M20 (les parents se posent la question), sans affirmer : personne ne peut savoir avant qu'il sache raconter, les cauchemars reconnaissables vers 2 ans et demi-3 ans ; un réveil en pleurs de fin de nuit où il te reconnaît « ressemble à un mauvais rêve » → consoler. La phrase de la formation (« reflet de l'état émotionnel au coucher ») n'est **pas** écrite comme une cause : on écrit seulement ce qui aide à s'endormir apaisé. |
| 28/09 | **Cohérence cardiaque** : garder −20 % (non sourcé) ou passer au mécanisme ? La règle du 30/09 ne l'autorise que sourcé. |
| 29/09 | **Nom de la rubrique sommeil** : proposition « Ses nuits, tes journées ». |
| 30/09 | **Vue d'ensemble « Où en êtes-vous ? »** : propre au sommeil, ou transversale ? |
| 30/09 soir | **Étude neurologique de la formation** sur l'endormissement en sommeil agité : référence à retrouver. |
| 30/09 soir → 06/10 | ✅ **Veilleuse** : **jamais avant 18 mois**. **De 18 à 24 mois, acceptée seulement si besoin** : peur du noir exprimée par l'enfant, ou besoin de se repérer au réveil (attraper sa gourde, son doudou). Alors **lumière orange, très très faible, hors de son regard** ; on écrit que la lumière « freine » la mélatonine, jamais « bloque ». Toujours au conditionnel (« si »), jamais conseillée d'office. Reste la lumière ambrée faible du parent pour un soin de nuit. |
| 30/09 soir | **Structure de l'intro** : temps 1 par tranche, temps 2-3 par mois ? Fil conducteur « l'escalier se construit → le cerveau travaille ailleurs → ce qu'il emporte en le descendant » ? |
| 09/09 | **`content/mois-14/01-guide.json`** : le sortir de `content/` et garder ses 32 situations comme matière ? |
| 01/09 | **Diarrhée et déshydratation** absentes du corpus : une place était libre à M5 Ventre & digestion. *(À vérifier : peut-être déjà traité.)* |
| 01/09 | Libellés M0 *Le rot* et M1 *Les gaz* : « après la tétée » au lieu de « après le repas » ? *(Proposition non contredite, donc probablement acquise.)* |
| 28/09 | Allaitement semi-allongé : « on verra plus tard ». |
| 15/10 | **Posture « Être ferme sur les repères, précise sur les gestes, honnête sur les limites »** : la glose écrite dans `SKILL_contenu` (repères = seuils et sécurité ; gestes = concrets ; limites = celles de l'app et d'un geste) est une proposition de Claude, à valider. |
| 17/10 | **M3 « La découverte des mains »** : réécrite le 17/10 (étude citée, source HAS réattachée à la ligne transat/coque, « apprend plus vite » adouci). À relire par Laura. |
| 17/10 | **Titre de la carte M11 « Une volonté qui s'affirme »** : proposé par Claude après le rejet de « La naissance du “je” » ; à confirmer ou remplacer. |

---

# Archives : les documents d'origine

Ces documents restent consultables pour l'argumentaire, les sources et les chiffres détaillés. **Ils ne font plus foi.**

`decisions_tranchees.md` (26/08) · `decisions_tranchees_28_aout.md` · `decisions_tranchees_01_sept.md` · `decisions_bornes_reflexologie.md` (01/09) · `decisions_tranchees_02_sept.md` · `decision_chiffres_aides_et_dispositifs.md` (03/09) · `decision_3114_pensees_noires.md` (02-08/09) · `decision_pourcentages_prevalence.md` (08/09) · `decisions_tranchees_08_sept_soir.md` · `decisions_tranchees_09_sept.md` · `decision_jamais_inventer_une_sequence_reflexologie.md` (09/09) · `decisions_tranchees_14_sept.md` · `decisions_tranchees_22_sept.md` · `decision_sources_etudes_scientifiques.md` (28/09) · `decisions_tranchees_28_sept.md` · `decisions_tranchees_28_sept_soir.md` · `analyse_sommeil/15_arbitrages_tranches_28_sept.md` · `decisions_tranchees_29_sept.md` · `decisions_tranchees_29_sept_soir.md` · `decisions_tranchees_29_sept_3.md` · `decisions_tranchees_30_sept.md` · `decisions_tranchees_30_sept_soir.md` · `regle_caprice_et_negations.md` (26/08) · `regle_nommer_ce_que_le_parent_traverse.md` (26/08) · `regles_datation_et_mode_de_garde.md` (28/08) · `regles_usage_connaissances_formations.md` (01/09) · `regle_rangement_des_situations.md` (28/09)

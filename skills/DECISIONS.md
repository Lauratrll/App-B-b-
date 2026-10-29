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

Dernière mise à jour : 27 octobre 2026.

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
| 14/09 | ✅ **L'app ne demande rien à saisir.** Pas de tracking, pas de journal. Elle donne, elle ne réclame pas. 🔁 **Précisé le 27/10** : l'app ne réclame rien et ne diagnostique pas, mais elle peut **offrir** au parent un outil facultatif pour se faire un bilan visuel du sommeil de son bébé (la roue des 24 h, une fois par mois, voir §3.4). Le parent saisit s'il le souhaite : ce n'est ni du tracking, ni un journal quotidien, ni un diagnostic. |
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
- ✅ (06/10) **Heure du coucher.** M4-M23 : « le plus souvent entre 18 h et 20 h », jamais à tenir à la minute (ce sont les signaux de fatigue qui donnent le signal). ~~**M3 à part** : pas d'heure, **on observe la fin de l'éveil calme pour proposer la nuit** ; le pic de pleurs du soir peut repousser le coucher ; 18 h-20 h seulement comme repère vers lequel on va.~~ 🔁 **27/10 : M3 a une heure de coucher, comme tous les autres mois : 19 h 45** (voir §3.4). On garde l'idée d'observer la fin de l'éveil calme et de laisser le pic de pleurs du soir repousser parfois le coucher, sans dire « pas d'heure ». M3 (et surtout M0-M2) : la mise au lit du soir et la tétée de fin de soirée (23 h-minuit) sont deux moments différents, le parent n'a pas à l'attendre pour aller dormir. M9 et M20, phrase de Laura : « Si tu veux partager le dîner en famille, ce sont les adultes qui se calent sur l'heure de son repas. » **Adams 2020 n'est cité nulle part** (l'étude s'arrête à 6 mois ; Laura ne veut pas la poser sur des bébés qui ne font pas encore de longues nuits). Placé dans « La fin de journée ».
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

## 3.4 Dispositifs visuels du sommeil : frise et roues des 24 h (26-27/10)

Fichiers : `docs/sommeil-schemas/frise_sommeil.html` (frise chronologique par âge, finie) et `docs/sommeil-schemas/sommeil_24h.html` (roues des 24 h : données dans `SRC.refs`, une entrée par mois ; publiés aussi comme pages en ligne). Fiche d'explication dans le projet : `claude/schemas_sommeil_sources_html/README.md`.

| Date | Décision |
|---|---|
| 27/10 | ✅ **On construit d'abord les dispositifs qui enrichissent la catégorie Sommeil** ; la configuration dans l'app (où, comment le parent y accède) se décide ensuite. |
| 27/10 | ✅ **23 roues d'exemple de rythme, de 1 à 23 mois, validées par Laura** (chiffres du 27/10 dans le fichier `sommeil_24h.html`). Elles iront sans doute dans les **contenus mensuels** de la catégorie Sommeil. Support d'accompagnement : des repères, pas des consignes ni une note. |
| 27/10 | ✅ **Roue modifiable pour le parent** : donner au parent la possibilité de **se créer un bilan** et de visualiser le sommeil de son bébé. Une fois par mois suffit (« un repère, pas une note »), pas de suivi quotidien. **Ce n'est pas un diagnostic.** 🟠 Accès à décider plus tard : piste de Laura = un bouton **à côté de « cohérence cardiaque », en bas**, pour y accéder facilement, en **gardant en mémoire les roues des mois précédents** pour voir l'évolution. |
| 26/10 | ✅ **Modèle de la roue** : la journée commence au **coucher de la veille** (la nuit reste entière) et finit au coucher du soir ; vraie horloge, **minuit en haut, midi en bas** ; trait rouge = coucher ; au-delà de 24 h, anneau extérieur superposé. Le parent écrit des **périodes de sommeil libres** (je m'endors à / je me réveille à) ; l'**éveil se calcule** entre deux sommes. On peut modifier toute heure et supprimer une ligne de réveil de nuit ou d'éveil (les deux sommes voisines fusionnent). |
| 21/10 | ✅ **Éveil et réveil de nuit** : en journée, bébé est en **éveil** ; entre deux sommes de nuit, c'est un **réveil** (bébé a besoin d'aide pour se rendormir). Même couleur, seule l'étiquette change. |
| 21/10 | ✅ **Cycles** : **45 min à la naissance, 60 min à 3 mois, 70 min de 1 an à 23 mois**. Pas de chiffre intermédiaire (chaque enfant est différent), le cycle « s'allonge peu à peu ». |
| 21/10 | ✅ **Nombre de siestes** : 4 à 5 à 1-2 mois · **3 de 3 à 8 mois** · **2 de 9 à 17 mois** · **1 de 18 à 23 mois**. Durées en cycles, comme repères et jamais en multiples exacts : 3 mois 2-2-1 · 6 mois 2+2+0,5 · 9 mois 1,5-2 · 12 mois 1-2 · 15 mois 0,5-2 · 18 mois X-2 · 23 mois X-1,5 ; horaires souples, pas de 15 en 15 min. |
| 27/10 | ✅ **Heure du coucher selon le nombre de siestes** : 1 mois 21 h 45 · 2 mois 20 h 45 · **3 siestes : 19 h 45** · **2 siestes : 19 h 30** · **1 sieste : 19 h** (18 à 21 mois) puis **19 h 30 à partir de 22 mois**. Le coucher avance surtout les mois où l'on enlève une sieste. |
| 26/10 | ✅ **Réveils de nuit dessinés jusqu'à 8 mois** (2 à 1-2 mois, 1 de 3 à 7 mois, très bref à 8 mois). **À partir de 9 mois, plus aucun réveil de nuit dans les roues** : le rythme circadien est installé et il n'y a plus de prise alimentaire la nuit. Les perturbations et l'aide à l'endormissement se traiteront plus tard. Une nuit d'environ 11 h à 9 mois (repère du §3.2 ; la formation dit seulement qu'à 9 mois bébé est capable d'une nuit complète). |
| 27/10 | ✅ **Les roues se ressemblent d'un mois à l'autre, c'est voulu.** Le total de sommeil décroît régulièrement entre les roues validées voisines (16 h 15 à 1 mois, 13 h 15 à 23 mois). |
| 21/10 | ✅ **Règles pour le texte** (pas pour les roues) : une sieste tardive après 16 h **peut** décaler le coucher, mais mieux vaut une petite sieste tardive qu'une sur-fatigue quand les horaires sont cadrés par le travail (crèche) ; la première sieste n'est pas avant 9 h, « X h environ après le réveil précédent » ; paragraphe « Quand les journées sont cadrées par le travail ». |
| 27/10 | ✅ **M3 a une heure de coucher, comme tous les autres mois : 19 h 45.** 🔁 remplace « M3 : pas d'heure de coucher » (06/10, §3.3). ⚠️ `content/sommeil/M3_sommeil.md` est à aligner (il dit encore « pas d'heure »). |

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
| 19/10 | ✅ **S.O.S plus doux** (Laura) : couleurs passées en pastel (jaune, orange, orange sanguine moins saturés ; le jaune et le corail des numéros étaient trop vifs), bandeau en corail clair avec numéros en pastilles blanches. 🔁 Puis réchauffé : jaune des blocs plus ensoleillé, **écriture en terre cuite et corail, jamais en marron** (Laura : « c'est caca »). **Les numéros d'urgence ne s'affichent plus que sur la page d'ouverture**, plus en tête de chaque maladie, **et sous les slots des maladies, pas au-dessus**. **La page d'ouverture doit tenir sur un écran sans défiler** : les trois numéros sur une seule ligne avec un nom court (SAMU, Urgence européenne, Urgence par SMS), sans sous-texte ; pas de source sous l'encadré « Avant 3 mois ». Source de la Fièvre (à partir de 3 mois) déplacée en bas de page ; les autres maladies gardent une source sous chaque bloc. Page d'ouverture : titre « Dois-je consulter ? » sans la mention « S.O.S » ; « En cas de doute, appelez le 15. » en bas de page, comme la mention de protection de Guide-moi. Détail : `content/sos-faut-il-consulter/README.md` §6, §11, §15. |
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
- ~~✅ Allaiter ne fatigue pas (hormones du repos).~~ 🔁 **27/10 : INTERDIT d'écrire « allaiter ne fatigue pas ».** Formulation de Laura : allaiter puise dans toutes les ressources de la maman ; son sommeil est modifié pour s'adapter. **Principe posé par Laura (27/10) : on part du principe que toute maman a le droit de se sentir fatiguée.** Vaut pour tous les contenus, y compris `Prendre soin de moi` ; le doc 11 du projet (ligne « Allaiter ne fatigue pas… CORRIGER prioritaire » et « Arrêter d'allaiter n'améliore pas la fatigue ») est périmé sur ce point.

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

- ✅ (20/10) **Sommeil : moins de déroulants** (Laura). Tous les volets des parties sont **ouverts**, sans chevron ni fermeture, et sans phrase d'aperçu. Dans « Toujours accessible », **seul « La sécurité » reste repliable** ; les autres blocs sont ouverts. Code : `components/modules/sommeil-view.tsx`. 🔁 remplace « volets repliés » du 19/10 (§3).
- ✅ (20/10) **Fiche Guide-moi à mise en page libre** : un protocole peut porter `sections` (titre libre + thème de couleur : intro, info, action, geste, parent, cadre), affichées dans l'ordre du JSON à la place des rubriques fixes. Première utilisation : « L'épuisement après la tétée » (Parents submergés, M0-M3). Code : `components/modules/protocole-view.tsx`, type `SectionLibre` dans `lib/content.ts`.

- ✅ (20/10, fin) **Retour avec son mot** (Laura) : « ‹ Guide-moi ! », « ‹ Alimentation »… dans une pastille blanche qui englobe le texte, typo du sous-titre « Dans quelles situations ? ». **Épinglés : entrée seulement sur l'accueil.** Ailleurs, à droite : rien, ou « épingler » (épingle +) là où l'on a décidé qu'on peut épingler, **dont les fiches de Réflexologie plantaire** (rendues épinglables : une ligne `content` par fiche, `scripts/import-reflexo-plantaire.mjs`).

- ✅ (20/10, suite) **Barre du bas selon l'écran** (Laura) : cohérence cardiaque et SOS sont des portes d'entrée de rubrique, **ils ne s'affichent que sur l'accueil**. Partout ailleurs, leurs places reçoivent le **Retour** (la flèche « ‹ Guide-moi ! », « ‹ Alimentation »… retirée du haut des pages) et le bouton **Épingler** (épingle + plus), à côté des Épinglés. Plus aucun bouton en haut des pages. **Bandeau du haut supprimé** et « Bonjour » retiré : le prénom et l'âge ne s'écrivent qu'une fois, sur l'accueil, avec le picto « 3 traits » calé à droite sur la même ligne.

- ✅ (20/10) **S.O.S, page 1** (Laura) : « Repères officiels » retiré du bas de l'écran, il est déjà écrit en sous-titre. Reste en bas : « En cas de doute, appelez le 15. »

- ✅ (20/10) **Nouvel accueil** (Laura). Grille : Préparer le coucher (nom à changer) · Guide-moi ! / Gestes d'apaisement, sous-titre *Boîte à outils* (vide, à construire) · Prendre soin de moi / Réflexologie · Vivre la saison. **Barre du bas réduite à 4 entrées** : Accueil · Cohérence cardiaque · SOS · Épinglés. Cohérence (2e) et SOS (au centre) = **boutons ronds, 2/3 sur la barre, 1/3 au-dessus sur le fond, visibles mais pas principaux** ; cohérence = picto cœur traversé d'une onde (contenu à créer) ; SOS = juste écrit « SOS », c'est sa nouvelle porte d'entrée (plus de case à l'accueil). Accueil et Épinglés = pictos seuls, sans mot, dans le style des pictos des slots. **Menu « 3 traits » en haut à gauche = réglages** : Mon bébé · Mes informations · Mon abonnement, + Nous contacter et Mentions légales (cases placées, à remplir), + Se déconnecter. Détail : `SKILL_ui.md`, « Navigation principale » et « Structure de la page d'accueil ».
- ✅ (26/10) **Accueil, case « Prendre soin de moi »** (Laura) : titre sur deux lignes, « Prendre soin / de moi » ; sous-titre « Gestes parentaux » remplacé par **« Post-partum »**. Code : `app/(app)/dashboard/page.tsx`.
- ✅ (26/10, revu le 27/10) **Vivre la saison : une seule saison, sans sélecteur** (Laura). Les parents voient uniquement la saison du moment. 🔁 (27/10) Les 4 boutons de saison sont retirés de la page, y compris pour les admins : **les admins choisissent la saison dans le bandeau « Aperçu admin »**, à côté du mois et du genre (cookie `apercu_saison`, « Saison du moment » par défaut) ; elle s’applique à la page et au libellé de l’accueil. Les visuels de la page seront retravaillés plus tard. Code : `app/(app)/saison/page.tsx`.
- ✅ (27/10) **Bandeau admin sur une seule ligne** (Laura) : « Admin » · mois · genre (Garçon / Fille, plus de « Non renseigné ») · saison (« Présent » = la saison du moment, puis les 4 saisons). **Plus de bouton « Voir »** : l'aperçu change dès qu'on choisit une option. Code : `components/modules/apercu-admin-bar.tsx`, `apercu-auto-form.tsx`.
- ✅ (26/10) **Vivre la saison : structure allégée, sans conseil de santé** (Laura). Le bloc « À savoir cette saison » est supprimé (redondant sur les 3 mois d'une saison, et il portait des conseils de santé, hors sujet). Chaque saison = une intro (`ambiance`, liée au thème de bébé du mois) + 2 idées d'éveil, créatives et sensorielles. Les idées ne sont pas des règles de sécurité : au plus une précision de bon sens glissée dans le geste (« à l'ombre », « tu restes tout près »). Plus de virus, vitamine D, température, humidité, allergies, diversification. Aliments : au plus une idée par mois, en jeu sensoriel seulement. Si un conseil de saison revient un jour, il sera travaillé avec un professionnel. 24 fichiers `04-saison.json` réécrits (192 idées). Sauvegarde : `_sauvegardes/2026-10-26_avant_saison_sans_a_savoir`. À faire : `npm run import-content` pour publier dans la base.
- ✅ Palette : dernière case bleue `#D5E7EB` ; carte Parents submergés lavande `#DBD7EA`, attribuée **par identifiant** (`slotForCategorie`).
- ✅ `protocole-view.tsx` rend `*italique*` et `**gras**` ; bouton « Ouvrir la séquence » vers `lien_reflexologie` (Guide-moi et Coucher).
- ✅ `soin-detail.tsx` met en gras tout numéro d'appel de l'encart d'urgence.
- ✅ Scripts : `qa_contenu.py` (titres transverses et thématisés, mots interdits insensibles à la casse, remèdes, « se soigne » en alerte) ; `recopie_protocoles.py` (refrains de sécurité et institutionnels exclus) ; `minutes_en_chiffres.py`.

---

# 11. Chantiers décidés, pas encore faits

- **Gestes d'apaisement épinglables** (20/10, Laura) : quand la rubrique *Gestes d'apaisement* (boîte à outils, `/apaisement`) sera construite, ses outils pourront s'épingler. Il faudra alors : un module épinglable et son quota dans `lib/pinned.ts` (`PIN_QUOTAS`, `PINNABLE_MODULES`), des lignes `content` pour chaque outil, `<NavPin />` sur la page de l'outil, et une section dans `/epingles`.

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
- **Frise du sommeil par âge dessinée en escalier** (hypnogramme simplifié, marches par tranche d'âge) — validé le 30/09 soir, dans la to-do P3. Frise chronologique faite le 21/10 (voir §3.4).
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

- (26/10) Rangement de /content par catégorie : `content/guide-moi/mois-XX/` (guide M{n}_guide_moi_N{slot}_….json), `content/coucher/M{n}_coucher.json`, `content/prendre-soin/M{n}_soin.json`, `content/SAISON/M{n}_saison.json`, `content/jeux/M{n}_jeux.json`. `sommeil/`, `sos-faut-il-consulter/` et les `_avant_*` ne bougent pas. `scripts/import-content.mjs` (et minutes_en_chiffres.py, recopie_protocoles.py, sync_tableau.py) adaptés. Les anciens scripts `import-coucher*.mjs`, `import-guide*.mjs` lisent encore l'ancien emplacement : ne plus les utiliser. 🔁 **28/10 : `import-soin.mjs` est réparé** : il lit `content/prendre-soin/` et met à jour les lignes en place (les épingles restent). C'est la voie pour publier Prendre soin.

- (27/10) Frise du sommeil, corrections de Laura : ligne « Nuit d'affilée » renommée « Heures de sommeil consécutives », rien avant M3, M3 environ 5 h, M9 environ 10 h et M12 environ 12 h, avec environ 3 réveils par nuit : savoir se rendormir (le texte M9 validé à 6 h d'affilée est à aligner). Mélatonine : par le lait, puis à partir de M9 celle de bébé fait effet. Capacité de nuit : physiologique à M3 (moins de risque d'hypoglycémie), neurologique à M9 (hormones et circadien installés). Éveil calme : 5-10 min à la naissance, environ 30 min vers 1 mois, environ 2 h à 3 mois ; ce sont des capacités moyennes entre deux bonnes périodes de sommeil, on n'écrit ni n'explique « 4 × 30 min » (le texte M3 validé qui le dit est à aligner). Siestes sans durée : M0-M1 poly-séquentiel, on ne compte pas ; M2 : 5 ; M3 : 3 à 4 (on n'affirme pas un nombre) ; M4 : 3 (le texte M3 « d'une à cinq » est à aligner). Séparation : nouvelle vague vers 18 mois. Marche dans un bloc Motricité dès M12. Langage sur sa propre ligne : M12-M17 premiers mots, M18-M23 développement du langage. L'affirmation de soi ne perturbe pas le sommeil, elle se traite dans les rituels (adapter le rituel). Le côté parent sort de la frise. Cortisol (précisé le jour même) : pic du matin vers 7 h et pic vers 11 h, puis il redescend dès 17 h pour laisser place à la montée de la mélatonine (notes EDPP : mélatonine dès 17 h, cortisol au plus bas à 20 h) ; pas de pic à 17 h. À sourcer : le pic de 11 h vient d'une diapositive du livret sans étude, les études lues décrivent un seul pic au réveil.
- (27/10) Frise, ligne Ultradien → circadien : M4 est relié à la phase d'installation, une seule barre M4-M8 « Transition : le circadien s'installe » (au lieu d'une bascule isolée à M4).
- (27/10) Frise, siestes : 3 siestes de M4 à M6, passage de 3 à 2 siestes à M7-M8, 2 siestes de M9 à M14, puis 2 → 1 entre 15 et 18 mois (remplace « 3 jusqu'à 9 mois, 3 → 2 entre 9 et 12 mois »).

## 27/10 — Poussées de croissance / réveils de faim (frise)
- Décision de Laura : aucun âge de poussée de croissance sur la frise (ni les institutions françaises ni les études ne les soutiennent ; les âges 3 et 6 semaines, 3 et 6 mois sont un avis d'expert mpedia, sans référence).
- Frise : nouvelle ligne « Réveils de faim », M0–M5 : « Tétées groupées possibles : passager, normal » (source : Santé publique France, Guide de l'allaitement 2023).
- Les âges « souvent décrits, non démontrés » pourront figurer dans la rubrique du texte parent, formulés comme avis d'expert.
- (27/10, annule le point « sans âge » ci-dessus) Laura accepte les âges sur la frise : ligne « Réveils de faim », repères « vers 3 et 6 semaines », « vers 3 mois », « vers 6 mois », présentés comme observation d'expert (mpedia, Dr Werner, AFPA), « chaque bébé est différent ». But : rester attentif aux besoins de bébé, ne pas supprimer la prise alimentaire de nuit « pour ne pas prendre de mauvaise habitude ». Source institutionnelle : SPF (« jours de pointe », sans âge).
- (27/10) Frise : la ligne « Réveils de faim » devient « Prise alimentaire nocturne » ; intitulé des repères : « Poussées de croissance observées à 3 et 6 semaines, 3 et 6 mois » (libellés courts sur la barre : « 3 et 6 sem. », « 3 mois », « 6 mois »).
- (27/10) Frise, « Prise alimentaire nocturne » : bandeau « établi » M0–M6 « Prise alimentaire normale, sans culpabilité » (validation de l'alimentation de nuit sur 6 mois, pour déculpabiliser les parents et garder de la bienveillance envers bébé ; sources SPF, 1000 premiers jours, mpedia). Les pics « Poussées de croissance observées à 3 et 6 semaines, 3 et 6 mois » sont sur la ligne juste dessous (« Poussées observées »).
- (27/10) Frise, alimentation de nuit : deux lignes séparées (pas de superposition). « Prise alimentaire nocturne » : bandeau établi M0 à M6 inclus, « Prise alimentaire normale, sans culpabilité ». « Poussées de croissance observées » : repères « 3 et 6 sem. », « 3 mois », « 6 mois » (observation d'expert mpedia, chaque bébé est différent ; pas d'âge validé par les institutions françaises ni par les études).
- (27/10, tranché) Frise, heures de sommeil consécutives : environ 10 h à partir de M6 (entrecoupées de réveils nocturnes) ; environ 12 h à partir de M9 ; il y a toujours des réveils nocturnes et il faut toujours accompagner le rendormissement (c'est pour qu'il y arrive seul qu'on travaille). Le nombre de réveils (« environ 3 ») n'est plus chiffré. Remplace « ≈ 10 h à M9 » et « ≈ 12 h à M12 ». M4 à M5 : vide. Siestes : M2 « environ 5 » ; M4–M6 « 3 siestes » inchangé.
- (27/10) Frise : la colonne « Étape pour le parent » est supprimée du tableau des tranches (Laura).
- (27/10) ✅ **Textes M3, M9, M20 alignés sur la frise** (`content/sommeil/M{n}_sommeil.md`, sauvegarde `_sauvegardes/2026-10-27_sommeil_avant_alignement_frise/`, `sommeil.json` régénéré). M3 : éveil calme « environ 2 heures » (plus de « 4 × 30 min ») ; siestes « souvent trois à quatre, d'un bébé à l'autre ça varie » ; « une dizaine d'heures la nuit » remplacé par « une grande partie la nuit » ; ajout d'une phrase sur les tétées plus rapprochées vers 3 mois (observation, pas une règle, pas une mauvaise habitude). M9 : « Faire ses nuits » = environ 10 h entrecoupées de réveils dès 6 mois, environ 12 h vers 9 mois, toujours des réveils à accompagner (plus de « 6 h d'affilée ») ; repères 24 h « environ 12 heures la nuit, deux siestes » ; siestes « deux par jour » (plus de « d'une à trois »), passage de trois à deux « vers 7-8 mois » ; cortisol « haut le matin, redescend dès la fin d'après-midi » (les pics 7 h et 11 h ne sont pas écrits côté parent, 11 h sans source). M20 : « autour de 12 heures la nuit », réveils « plusieurs fois » (plus « environ 3 fois »), sieste sans durée.
- ⚠️ Non traité : M3 « heure du coucher 19 h 45 » (décision du 27/10, ligne ci-dessus) reste à aligner ; seuils de ronflement du M20 (« plus de 3 nuits par semaine, audible porte fermée ») absents de la recommandation SFORL 2017 lue : à resourcer.

## 27/10/2026 (3e passage) — Tranches redéfinies, tableau corrigé, inventaire par mois
- Tableau des tranches de la frise audité : « cycle de 50 à 60 min » → environ 45 min (M0–M2) ; « environ 5 siestes à M2 » sorti de M3–M4 ; « mélatonine élevée et stable dès 6 mois » retiré (effet retenu à M9) ; « séparation à sourcer » retiré ; séparation, marche, mots, terreurs, prise alimentaire et poussées de croissance ajoutés.
- PROPOSITION (à valider par Laura) : huit tranches M0–M1 / M2 / M3–M5 / M6–M8 / M9–M11 / M12–M14 / M15–M17 / M18–M23, chaque frontière adossée à un changement de la frise. Tranches des cartes de rituel : M0–M5 / M6–M11 / M12–M17 / M18–M23 proposées (à trancher).
- Inventaire mois par mois (connaître / distinguer / travailler / vigilance) : docs/sommeil-schemas/inventaire_sommeil_par_mois.md. Aucune correction de contenu avant validation de la structure.
- Corrections de texte : M3 et M9 « ça varie » → « cela varie » ; M3 « une grande partie la nuit » → « une dizaine d'heures la nuit, entrecoupées de réveils » (retour au texte validé : on ajuste avec les données validées, on ne rend pas flou).
- À corriger (contenu, après validation) : M20 « son horloge n'est pas encore marquée » (elle est installée dès M9, elle s'ancre de plus en plus).
- Cortisol : formulation à exprimer, accompagner la descente dès 17 h pour laisser monter la mélatonine (frise et inventaire mis à jour).

## 27/10/2026 (4e passage) — Coucher à M3
- ✅ M3 : pas d'heure unique (19 h 45 n'était qu'un exemple du graphique). On donne une tranche horaire, « le plus souvent entre 18 h et 20 h », qui dépend du bébé et surtout de la famille (travail, journées). Un bébé qui boit encore la nuit ou fait une sieste tardive peut se coucher plus tard. 🔁 remplace « M3 : 19 h 45 » (27/10). `M3_sommeil.md` aligné ; les notes du graphique `sommeil_24h.html` gardent « vers 19 h 45, un exemple ».

## 27/10/2026 (5e passage) — Coucher M3, faux refus, chronotype, cartes de rituel
- ✅ **M3 : coucher « le plus souvent entre 19 h et 21 h »** (Laura, 27/10), tranche horaire et non une heure : elle dépend du bébé et surtout de la famille. Un bébé qui boit la nuit ou fait une sieste tardive peut se coucher plus tard. Remplace « 18 h–20 h » écrit à tort ce jour pour M3 (M4–M23 restent « entre 18 h et 20 h », décision du 06/10). Cohérent avec les roues : 21 h 45 à 1 mois, 20 h 45 à 2 mois, 19 h 45 à 3 mois.
- ✅ **Faux refus de la sieste du matin (M12–M14)** : on en parle, pour dire d'observer sur plusieurs jours, voire plusieurs semaines, sans se précipiter. Formulation à écrire, source à confirmer. La transition de sieste appartient à la tranche M12–M14 (tranche gardée).
- ✅ **Ligne de frise « Nuit : durée repère »** (remplace « Heures de sommeil consécutives »).
- ✅ **Ne pas écrire** tant que non sourcé : pic de cortisol de 11 h ; rythme endogène de 25 h du livret.
- ✅ **Pas de chronotype (« du matin ou du soir ») dans l'app.** ⚠️ À retirer du contenu : M20 (« son horloge à lui, du matin ou du soir… » l. 21 ; « Il te semble « du soir » ? » l. 83).
- ✅ **M18–M23 gardée en six mois** : on y fait des réajustements selon l'évolution de bébé.
- ✅ **Cartes de rituel : cinq tranches M0–M1 / M2–M5 / M6–M11 / M12–M17 / M18–M23** (Laura) ; remplace M0–M4 / M5–M11 / M12–M17 / M18–M23.

## 27/10/2026 (6e passage) — Tranches horaires du coucher (validées par Laura)
- ✅ **1 mois : entre 21 h et 22 h · 2 mois : entre 20 h et 21 h · 3 mois : entre 19 h et 20 h 30 · puis M4–M23 : « le plus souvent entre 18 h et 20 h »** (06/10). Tranches horaires, jamais une heure à tenir : elles dépendent du bébé et surtout de la famille (travail, journées). Plus tard possible à M3 si tétée de nuit ou sieste tardive. 🔁 remplace « M3 : entre 19 h et 21 h » (même jour). `M3_sommeil.md` aligné. M1 et M2 n'ont pas de texte mensuel : repères à garder pour les contenus M1–M2. Les heures des roues (21 h 45, 20 h 45, 19 h 45) restent des exemples dans la tranche.

## 27/10/2026 (7e passage) — Structure du sommeil validée : sept tranches
- ✅ **Sept tranches (Laura)** : M0–M1 / M2–M5 / M6–M8 / M9–M11 / M12–M14 / M15–M17 / M18–M23. M2 est fusionné avec M3–M5 (« Réorganisation »). Mois-tests : M3 dans M2–M5, M9 dans M9–M11, M20 dans M18–M23. Frise et inventaire (`docs/sommeil-schemas/`) mis à jour. 🔁 remplace les six tranches du tableau d'origine et les huit tranches proposées plus tôt.
- ✅ **Structure validée : la phase de correction des contenus peut commencer.** Premiers chantiers : M20 (horloge installée dès M9, retirer le chronotype), puis alignements restants.

## 27/10/2026 (8e passage) — M20 corrigé
- ✅ M20 : « son horloge à lui, du matin ou du soir, n'est pas encore marquée » → « Son horloge, elle, est installée depuis ses 9 mois : elle s'ancre un peu plus chaque mois ». Chronotype retiré (« Il te semble « du soir » ? » → « Si le coucher recule, regarde deux heures… » ; fin de paragraphe : « installée depuis ses 9 mois, s'ancre de plus en plus »). Sauvegarde : `_sauvegardes/2026-10-27_M20_avant_chronotype/`. `sommeil.json` régénéré.

## 27/10/2026 (9e passage) — Notes de formation à intégrer + tableau à cocher
- ✅ **Consigne de Laura : bien intégrer dans les contenus les notes et la formation** (EDPP, livret). Exemple donné : « la chambre de bébé est un lieu vivant, que l'on s'approprie bien avant le passage de bébé dans sa chambre pour la nuit, un lieu où l'on aime être, pas un lieu de punition ».
- ✅ **Boîte à outils : la réponse progressive aux pleurs** (paliers, inspirée de l'échelle de consolabilité de Brazelton, origine dite, garde-fou « gros chagrin : dans les bras ») à intégrer dans les cartes.
- Tableau à cocher publié (artefact « Inventaire sommeil à développer », 221 éléments dont 26 issus de la formation) : Laura coche les éléments à développer, Claude relit les choix dans la base de la page. Les contenus se développeront sur ces choix.

## 27/10/2026 (10e passage) — Vocabulaire de l'inventaire et catégorie « On travaille quoi ce mois-ci ? »
- ✅ **Plus de « connaître / distinguer / travailler »** (Laura n'aime pas ces termes). La nature de chaque élément s'écrit **à la fin du sujet**, au besoin : **connaissance / distinction / action** (puis vigilance, carte à créer, transversal).
- ✅ **Tout ce qui est écrit dans l'inventaire sera expliqué.** Les cases et notes de Laura servent à marquer les thèmes où l'on développe un **contenu plus étoffé** pour aider le parent.
- 🟠 **Idée de Laura : une catégorie « On travaille quoi ce mois-ci ? »** dans l'app, alimentée par ces thèmes choisis. À cadrer (contenu, place dans la navigation) après son tri.

## 27/10/2026 (11e passage) — Allaitement et fatigue : formulation interdite
- ❌ **Ne jamais écrire « allaiter ne fatigue pas »** (ni « arrêter d'allaiter n'améliore pas la fatigue »). ✅ Dire : allaiter puise dans toutes les ressources de la maman ; son sommeil est modifié pour s'adapter. Retiré du tableau « Inventaire sommeil à développer » (ligne issue du doc 11). À vérifier dans les contenus `Prendre soin de moi` avant d'écrire.
- ✅ **Faim nocturne (27/10)** : jamais « sans culpabiliser » à propos de la faim à cet âge ; on écrit « à cet âge, on doit répondre à la faim ». Il se réveille parce que le cycle finit, pas forcément parce qu'il a faim (livret), mais la faim se satisfait.
- ✅ **Fatigue de la maman (27/10)** : principe de Laura, toute maman a le droit de se sentir fatiguée. Formulation retenue : « allaiter puise dans toutes les ressources de la maman, son sommeil est modifié pour s'adapter ». Jamais « allaiter ne fatigue pas ».
- ✅ **Prise alimentaire nocturne et culpabilité (27/10)** : avant M3, on répond à la faim (pas de formule « sans culpabilité »). **À partir de M3**, quand on dit que bébé est physiologiquement apte à ne plus être nourri la nuit, la phrase s'écrit **avec des pincettes** : on ne culpabilise pas de nourrir bébé si la faim est là, surtout en poussée de croissance. Frise : barre « Prise alimentaire normale : on répond à la faim » (M0–M6). ⚠️ Vérifier que le texte M3 (« Reste à l'écoute de ton bébé… ») suit cette formulation avant les corrections de contenu.
- ✅ **Étapes de transition d'endormissement : la formation fait foi (27/10, Laura).** Pour la future partie « conditions d'endormissement » (au sein, bras et bercement, portage, voiture, tétine, contact), les étapes de transition douce viennent de la formation (relais du co-parent, parent qui dort dans la chambre de bébé, bercement comme fil conducteur, variation dès M2) ; aucune n'est testée par une étude, donc toujours « tu peux », jamais « il faut ». ⚠️ Les étapes que Claude a découpées par logique (document `analyse_sommeil/29_conditions_endormissement_et_tetine.md`) sont à rapprocher du livret avant écriture.
- ✅ **Langue et respiration buccale : pas dans la fiche tétine, dans les perturbateurs extérieurs (27/10, Laura).** On n'écrit pas que la tétine « favorise une langue basse » ni une respiration buccale (aucune source chez le nourrisson). Le sujet vit dans le bloc « Ce qui peut le réveiller » / facteurs extérieurs du sommeil, limité à ce qui est sourcé : nez bouché (lavage de nez), ronflement, bouche ouverte, oreiller mouillé le matin (SFORL, CHU de Nantes), orientation vers un professionnel ; aucun exercice lingual (28/09). La fiche tétine porte dents, otite, allaitement.
- ✅ **Tétine (27/10, Laura)** : **aucun conseil d'arrêt avant 2 ans** (ce n'est pas le rôle de l'app, pression de plus ; on y reviendra peut-être plus tard). **« Ne pas la remettre » gardé** avec la nuance : s'il dort et ne la réclame pas, on le laisse s'habituer à dormir sans. La fiche tétine porte dents, otite, allaitement, sans âge d'arrêt.
- 🟠 **Architecture (27/10, à réfléchir)** : distinguer (1) la catégorie entière **Boîte à outils / Gestes d'apaisement** (où bascule une grande partie des cartes aujourd'hui dans le rituel) et (2) une nouvelle partie **« Changer de conditions d'endormissement »** (titre à revoir), **à partir de M2**. Forme (une carte par situation ou une carte à onglets) non tranchée. Contenu de base : `analyse_sommeil/29_conditions_endormissement_et_tetine.md`.
- ✅ **Inventaire à développer : premières sélections de Laura (27/10)**, 14 lignes cochées dans l'inventaire en ligne. Notes retenues : fin de l'éveil calme pour proposer la sieste avant la sur-fatigue (M0-M1) ; **schéma évolutif de la courbe des pleurs**, pour accueillir les pleurs sans les vivre comme un échec ; **2 vidéos** sommeil agité / éveil agité (« interagit-il avec moi ? ») ; **fiche visuelle des pleurs** (peut-être un cadeau pour attirer les clients, lieu à voir) ; **carte « réponse progressive aux pleurs » visuelle, dans la boîte à outils** ; **cartes de soins et d'apaisement : toutes à travailler, mais le tummy time n'est pas une carte d'apaisement, il sort de cette liste** ; distinguer **rituel du soir (environ 1 h)** et **conditions d'endormissement (environ 10 min)** ; un bon rituel = 4 familles de gestes (alimentation, soin, dialogue, contact physique) ; ne pas mettre tous les réveils sur la faim ou les dents (à cet âge, le travail des gencives) ; caler de vraies siestes ; consolider le rituel avant M6 ; **animation de l'évolution neurologique du sommeil** (M6) ; se préparer au « bazar » de M6. ⚠️ « Onde alpha » dans une note : à ne pas écrire (décision 06/10, doc 27). Fichier de travail : l'inventaire **en ligne** (lien de l'artifact), lisible par Claude.


## 28/10/2026 — Relecture « Prendre soin de moi » M0–M23 (règles du 27/10)
- ✅ **Sauvegarde** : `_sauvegardes/2026-10-28_prendre_soin_avant_relecture/` (24 fichiers + `DECISIONS.md.avant`). 13 fichiers modifiés (M0, M1, M2, M3, M4, M6, M8, M9, M10, M12, M14, M19, M23), 28 champs, JSON valides, `qa_contenu.py --check-only` sans erreur. **Aucun bloc de réflexologie modifié.**
- ✅ **Réflexologie : on n'y touche pas** (Laura, 28/10) : les contenus de réflexologie de « Prendre soin de moi » sont à l'arrêt. Erreurs repérées et laissées en l'état pour la reprise : `M9` et `M19` rattachent la mélatonine à l'hypophyse (« pituitaire régule la mélatonine et le cortisol ») alors que la mélatonine vient de la glande pinéale et le cortisol des surrénales commandées par l'ACTH hypophysaire (Inserm, *médecine/sciences*, 1996 ; Société française d'endocrinologie, item 245). `M0:17` (« baby blues J3-J10 ») est dans les indications de l'auto-massage : non modifié. **Pas de mention de la mélatonine dans les textes** (Laura).
- ✅ **« Fatigue cellulaire » retirée** (`M0`, `M2`, `M12` ; `M1` avec la phrase sur la prolactine). Formulation retenue : « La fatigue du post-partum n'est pas qu'un manque de sommeil : ton corps répare, tes hormones se rééquilibrent, et tes nuits sont hachées. » Terme non médical, aucune source. La maman n'est pas forcément allaitante dans ces blocs : on ne développe pas l'allaitement (`M8` : « Allaiter, si tu allaites encore, continue de puiser dans tes ressources, à ton rythme »).
- ✅ **`M14`** : le « test d'une semaine de sommeil » (auto-diagnostic) est remplacé par « Si la fatigue ne s'allège pas malgré du repos, parles-en à ton médecin. »
- ✅ **Baby blues** (`M0`) : 50 à 80 %, 2 à 4 jours après l'accouchement, de quelques heures à quelques jours, à consulter au-delà de 2 semaines, avec exposant et source en pied (Psycom, brochure *Santé mentale, grossesse et parentalité*, mars 2025, pages 6-7, lue en entier). 🔁 Remplace « J3-J10 » et « ameli » : la page ameli n'a été lue que par un résumé d'outil (règle du 17/10 : une source non lue n'est pas citée). Chute hormonale gardée (Laura). « Chute plus brutale qu'à la ménopause » supprimée (aucune source).
- ✅ **Lochies et césarienne : durées retirées** (`M0`, `M1`) : trop médical pour cette rubrique, et les sources trouvées se contredisent. Remplacées par l'orientation (sage-femme, médecin) et la consultation postnatale dans les 6 à 8 semaines (Psycom, page 10).
- ✅ **Énergie de l'allaitement** (`M0`) : « 500 calories » supprimé. « Tes besoins en énergie augmentent » sans exposant : la page ANSES (repères 2019, page 12) n'a pas pu être relue en entier ; à sourcer quand elle sera ouverte.
- ✅ **Prolactine retirée** (`M1`, `M2`, `M4`, `M8`, `M10`) : sans effet pour la maman, aucune source. Le bloc co-parent de `M12` (hausse de la prolactine chez les pères) reste : « pères : on laisse l'existant ».
- ✅ **Dépression post-partum : principe de Laura** — elle peut survenir à tout moment ; on n'écrit jamais « c'est bon, c'est passé » ; on affirme qu'il existe des dépressions tardives. Dates sourcées (Psycom pages 5-7) : tout au long de la première année, pic de fréquence entre 2 et 4 mois puis entre 6 et 9 mois (`M3`, `M6`, `M9`, `M12`) ; « à différents moments, jusqu'aux premières années après la naissance » (`M12`, `M23`). Supprimés : « pic clinique », « jusqu'à 12 mois minimum », « précoce vers M3-M4 », « fin de la période à haut risque à 2 ans » (aucune source). Chiffre à 2 mois : 16,7 % (ENP 2021) non repris, la brochure donne 20 % pour la dépression périnatale grossesse comprise.
- ✅ **Sommeil des parents** (`M3`) : « au plus bas durant les trois premiers mois » (Richter et al., *Sleep*, 2019). Les formules « pic », « au plus haut » de la fatigue retirées (`M6`, `M9`).
- ✅ **Méditations en sécurité** (`M0`, `M1`) : « pendant que bébé dort en sécurité » ; « canapé » et « si bébé est sur toi, c'est ok » retirés.
- ✅ **Chronotype retiré** (`M19` : section « Tu peux avoir ton propre rythme » et lecture Roenneberg) ; titre suivant renommé « Tu peux réaligner ton rythme maintenant ».
- ✅ **Pères inchangés** (Laura) : « plus de 10 % (Inserm, 2023) » et les dates de pic paternel.
- ⚠️ **À faire avant l'import** : les écrans `soin-detail.tsx` (bloc B4) et `conseil-view.tsx` n'affichent aucune ligne `source`. Les numéros ¹ ² sont dans le texte et le champ `source` existe dans le JSON du bloc « realite_post_partum » (M0, M3, M6, M9, M12, M23) : **ne pas importer avant que l'affichage du bas de page soit ajouté** (prompt à donner à Claude Code).
- ⚠️ **Source hors liste** : Psycom (organisme public, financé par les ARS et Santé publique France, relu par la Direction générale de la santé) n'est pas dans la liste du `SKILL_contenu`. À valider ou à ajouter. Vidal écarté (non institutionnel).
- 🟠 **Repérés, non modifiés (hors périmètre validé)** : `M23` intro « la fin du post-partum tardif » ; `M1` « il ne reviendra pas avant des mois » ; `M3` « ne reviendront pas avant 6-12 mois » ; `M12` « une dépression tardive non traitée peut devenir chronique » ; `M6` « 2,5× INED 2019 » ; `M8` « chute de la satisfaction conjugale » ; `M0` nerf vague, ocytocine ; HAS non consultée sur le moment d'apparition.

## 28/10 — Contenus Sommeil des 7 tranches, onglet « Ce mois-ci », gestes d'apaisement
- ✅ **Sept textes Sommeil écrits (brouillons)** pour M0–M1 / M2–M5 / M6–M8 / M9–M11 / M12–M14 / M15–M17 / M18–M23, structure de M3 (parties 1 et 2 ; boîte à outils et co-parent hors lot). Fichiers `content/sommeil/T1…T7` ; index, liste « Ce mois-ci » et plan des gestes dans `docs/sommeil-contenus/30_INDEX`, `31`, `32`. **M3, M9, M20 déplacés (non supprimés)** dans `content/sommeil/_sauvegardes/2026-10-28_M3_M9_M20_avant_7_tranches/` ; `sommeil.json` non touché.
- 🟠 **À valider** : 14 points listés dans `30_INDEX` (cycle 45 min vs sources 50–60, éveil calme chiffré, siestes 3→2, faim nocturne après 6 mois, séparation 17–18 mois sans source française, seuils de ronflement retirés, etc.).
- 🟠 **Onglet « Ce mois-ci »** : titre recommandé, types de supports et thèmes M0–M23 proposés dans `31_ce_mois_ci_themes_a_valider.md`. Thèmes à valider avant tout développement.
- 🟠 **Gestes d'apaisement** : « apaiser » quitte le rituel, « décharger » et « créer du lien » restent (`32_gestes_apaisement_deplacement.md`). 11 cartes déplacées **au niveau du plan** (la page `/apaisement` est vide, rien d'écrit à déplacer) ; 3 cartes à trancher (bonne nuit au corps, respiration du doudou, coucher le doudou) ; « Bercer » une ou deux cartes ; « Ta respiration lente ».
- ✅ `banque_idees_sourcees.md` : on garde l'ancienne version (Laura), aucune section ajoutée.

- (28/10) **Sommeil ouvert à tous les parents** (Laura : pas encore de clients, on peut tester librement). Le contenu vient des 7 tranches `content/sommeil/T{n}_M{a}-M{b}_sommeil.json` ; « La boîte à outils » et « Toujours accessible » sont empruntées temporairement à `sommeil.json` (M3, M9, M20), à retirer dans `lib/sommeil.ts` (`EMPRUNT_ACTIF`). À 24 mois, l'ancien écran Préparer le coucher reste affiché.
- (28/10) **Prendre soin : la ligne `source` s'affiche** en bas de la fiche, en petit italique, comme dans Guide-moi !

## 28/10 (suite) — Affichage Sommeil
- ✅ **Pas de paragraphe replié** dans la rubrique Sommeil (Laura) : tout reste ouvert, sauf « La sécurité » et « Il se réveille plus que d'habitude ? ». Ces deux blocs communs sont à déplacer ailleurs plus tard (à voir).
- ✅ **Titre de la partie 1** : « Sommeil de X à Y mois » (id `comprendre-son-sommeil` conservé par le script). Volet « Ce qui n'est pas encore là » retiré des tranches (redondant) ; ses faits utiles repris dans le premier volet.
- ✅ **« Ce qu'il se passe »** (ex-`description` des fichiers `coucher`) : un paragraphe **par mois**, avec le thème du mois (imitateur, explorateur…), cohérent avec les tranches validées. 🟠 Les anciennes descriptions contiennent des formulations écartées (« régression », « angoisse de séparation », « fenêtre », mélatonine « 6 à 12 semaines ») et M17 = M18 (doublon) : à ne pas reprendre telles quelles.
- ✅ **Titre de la catégorie : « Sommeil et Rituels »** (remplace « Préparer le coucher », carte du tableau de bord + titre de page). Première page avec des **slots** (cartes d'entrée) comme les autres catégories : 🟠 maquette à préciser (Laura).
- ✅ **Pas de frise du sommeil dans la page** (elle donne toute l'évolution d'un coup) : la page dit comment est le bébé **maintenant**. La frise servira plus tard d'argument de vente.
- ✅ **Phrases phares par tranche : gardées en brouillon** (`docs/sommeil-contenus/Sommeil_ce_qu_il_se_passe_M0-M23.md`), à placer ailleurs ; elles ne vont pas dans les JSON de tranche.
- ✅ **Règle anti-doublon** : les situations du thème Sommeil de Guide-moi (ex. « Le lit devenu barre », M11) ne sont pas répétées dans la page Sommeil (ex. volet « Debout contre les barreaux »). Sommeil = comment est bébé maintenant (repères, explications) ; Guide-moi = que faire dans la situation. 🟠 audit des volets des tranches proposé à Laura, rien supprimé.

## 28/10 (soir) — Sommeil et endormissement : slots, pilote M2–M5
- ✅ Catégorie « Sommeil et endormissement », sous-titre « Rythme et Rituels ». Première page en slots (par tranche d'âge), pas d'onglets, codes couleur de regroupement seulement (pas de blocs).
- ✅ Slots : Repères clés (roue du sommeil du MOIS, repères chiffrés, bouton « construire ma roue » plus tard) · Comprendre son sommeil (contient « Ce qu'il se passe » puis « Ce que tu observes », puis le pourquoi) · Journée et siestes · Fin de journée (« fin d'après-midi », heure du coucher en tranches) · Endormissement · Réveils nocturnes (« Il se réveille plus que d'habitude ? » fusionné) · Mon rituel · Ce mois-ci (= l'ancien onglet) · dès M12 : Le moment à son image.
- ✅ Pas de slot sécurité (blocs sécurité ailleurs), aucun renvoi vers SOS depuis Sommeil.
- ✅ Co-parent intégré : Mon rituel, Endormissement, Réveils nocturnes (relais de nuit), une ligne en Fin de journée.
- ✅ Durées d'éveil : moyennes observées, pas de norme, cohérence d'un mois à l'autre (naissance 10 min · M0 10-30 min · M1 ~1 h · M2 ~1 h 30 · M3 1 h 30-2 h · M4 1 h 30-2 h 30 · M5 2-3 h). Document d'Élodie Da Silva = ordre d'idée, non repris tel quel. M6 et suivants à construire de la même façon.
- ✅ Signes de faim : la formation fait foi.
- ✅ Guide-moi n'est pas touché ; tableau d'incohérences à corriger PLUS TARD : docs/sommeil-contenus/33_...
- ✅ Fichiers : un dossier par tranche (content/sommeil/T2_M2-M5/), un fichier par slot, `_tranche_complete.md` généré pour la relecture. Pilote = M2–M5 ; les autres tranches ne bougent pas avant relecture.
- ✅ (28/10, 18 h) « Ce mois-ci » devient le slot « Thème du mois » (affiché « Thème du mois 3 »), sous-titre « Ce qu'on travaille en ce moment ». Slot présent en brouillon (volets « À rédiger »), à remplir après validation des thèmes.

- (28/10) **« Sommeil et endormissement », sous-titre « Rythme et Rituels »** : nouveau nom de la rubrique (case de l'accueil, page /coucher, épingles). Remplace « Préparer le coucher ».
- (28/10) **Sommeil en slots, pilote M2-M5** (`docs/sommeil-contenus/34_prompt_code_slots_sommeil.md`) : première page en grille de 8 cartes (titre du slot + « 2 - 5 mois »), deux par ligne, une couleur par groupe de deux slots, sans titre de groupe : Repères clés + Comprendre son sommeil (bleu pluie) · Journée et siestes + Fin de journée (sable) · Endormissement + Réveils nocturnes (pêche) · Mon rituel + Thème du mois (sauge). Un clic ouvre le slot, le Retour de la barre du bas ramène à la grille. Plus d'onglets, volets tous ouverts, sources par slot. Les autres tranches gardent les onglets.
- (28/10) **Un mois à la fois dans la tranche** : « Ce qu'il se passe » ne montre que le volet du mois (le repère « M3 · » du titre n'est pas affiché) ; le slot « Thème du mois » devient « Thème du mois 3 », sous-titre « Ce qu'on travaille en ce moment », et ne montre que la section du mois.
- (28/10) **Repères clés** : roue du sommeil sur 24 h, forme figée sans heure écrite (lune en haut, soleil en bas, trait rouge du coucher), tracée d'après les journées types validées le 27/10 (`sommeil_24h.html`), + cartes des repères de `reperes_cles.json`. Le bouton « Construire ma roue » viendra plus tard.
- (28/10) **Plus d'emprunt pour M2-M5** (Boîte à outils et Toujours accessible de M3) ; les autres tranches gardent l'emprunt.
- ✅ (29/10) Slots Sommeil, couleurs validées (pastels) : Repères clés `#FBE9BE` et Comprendre son sommeil `#F8D49E` (soleil levant) · quatre bleus du ciel à la nuit `#D2EAFB` `#B8DAF7` `#9EC7F1` `#8FB2EB` (Journée et siestes → Réveils nocturnes) · Mon rituel `#EDC6D6` et Thème du mois `#D8A6C6` (soleil couchant). Code : `sommeil-slots.tsx` (cartes) et `sommeil-view.tsx` (THEME_SLOT). Grille en une colonne, tranche d'âge masquée sur les 4 slots mensuels. Repères clés : carte « nuit » retirée, libellé « Fenêtre d'éveil », titre du schéma « Éveil / Sommeil sur 24 h », « ≈ » pour « environ ».
- ✅ (29/10) Heures et durées écrites sans espace : 12h, 12h30, 1h30, 24h (et non « 12 h », « 1 h 30 »). Appliqué à la tranche M2–M5 (textes, repères, roue) ; les autres tranches et Guide-moi à harmoniser plus tard.
- ✅ (29/10, soir) **Sommeil, design des cartes** : mêmes cartes que la page 1 de Guide-moi (taille, petit rond du picto, flèche à droite, largeur commune centrée). La tranche d'âge suit le titre sur la même ligne, en majuscules : « Fin de journée / 2 À 5 MOIS » (« à » sur les cartes ; le haut de page du slot garde « 2 - 5 mois »). Code : `sommeil-slots.tsx` (Grille).
- ✅ (29/10, soir) **Repères clés tient sur un seul écran** : pas de picto en haut ; grand titre « Repères clés / X MOIS » ; sous-titre « Une journée type, pas un objectif : chaque bébé a son rythme. » (plus de « X mois » en sous-titre). « Éveil / Sommeil sur 24h » passe au centre de la roue (à la place du mois). Roue sans lune ni soleil, les 4 repères d'heure suffisent. Repères sur 3 colonnes, contenu centré dans les ovales, libellé « Sommeil sur 24h ». Code : `sommeil-slots.tsx` et `sommeil-roue.tsx`.

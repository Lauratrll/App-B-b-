# Schéma d'un protocole de « Réflexologie » — modèle à dupliquer

Réf. concrète : `protocole-sommeil.json` (protocole Sommeil entièrement rempli).

Ce schéma **fusionne deux sources** qu'on avait séparées jusqu'ici :

1. **Le protocole du PDF EDPP** — la suite précise et ordonnée des zones anatomiques (ce qui pilote l'**animation**).
2. **Mes textes de réflexologie déjà écrits** (blocs « Réflexologie : … » du contenu Guide-moi, ex. `M23_guide_moi_sommeil.json`) — le **ton** et l'intention, côté parent.

Le PDF donne la **rigueur** (quelles zones, dans quel ordre) ; mes textes donnent la **voix** (chaleureuse, tutoiement, sécurité, geste-plaisir). Le protocole app prend le meilleur des deux.

---

## Structure

```
{
  "id": "sommeil",
  "titre": "Sommeil",
  "categorie_guide_moi": "Sommeil",
  "lien_pathologie": false,
  "intro": "…",              ← accueil chaleureux, pose le décor (2-3 phrases)
  "emotion": "…",            ← registre émotionnel autorisé (facultatif)
  "sequence": [ {étape}, … ],
  "variante": { … },         ← facultatif, conditionnée par l'ÂGE
  "note_fin": "…",           ← consentement + sortie en douceur (toujours)
  "disclaimer": "…"          ← ne se substitue pas à un avis médical (toujours)
}
```

> **Pas de champ symbolique / médecine traditionnelle chinoise.** Les lectures du type « la nuit = la grossesse », « pancréas = père », « côlon = tristesse » présentes dans le PDF **ne sont pas reprises** : elles relèvent de croyances qu'on n'affiche pas. On garde en revanche le **registre émotionnel** (l'apaisement du parent, les émotions de la journée du bébé) dans le champ `emotion`.

> **Les zones sont EXACTEMENT celles du PDF EDPP**, jamais celles de mes anciens textes Guide-moi (qui parlaient de « voûte / talon » en grand public). Mes textes ne servent qu'au **ton**, pas au choix des zones.

### Une étape de la séquence

```
{
  "ordre": 1,
  "designation": "la tête",          ← libellé côté parent (avec article, minuscules)
  "intention": "On commence tout…",  ← une phrase chaleureuse : le pourquoi du geste
  "zones": [ {zone}, … ]             ← 1 ou plusieurs zones DU PDF, jouées dans cet ordre
}
```

### Les variantes sont conditionnées par l'âge

Certains cas ne concernent le bébé qu'à partir d'un certain âge (ex. les cauchemars, à partir du mois 12). La variante porte donc un `age_min_mois` ; l'app ne la propose qu'aux tranches d'âge concernées. Pas de justification symbolique, juste la pertinence liée au développement.

### Une zone (reprise telle quelle du catalogue)

```
{
  "zone": "tete",
  "designation": "la tête",
  "mouvement": "pression-circulaire",
  "description_mouvement": "Exercez une pression circulaire sur les orteils"
}
```

Les 4 derniers champs viennent **automatiquement** de `zones-mouvements.json` : on ne les ressaisit jamais, on référence le `zone` et le code va chercher le reste. C'est ce qui garantit que l'animation et le texte restent cohérents.

---

## Le point important : étape ≠ zone

Une étape du PDF regroupe parfois **plusieurs zones voisines** (ex. « 1. Tête – Épiphyse – Hypophyse » = 3 zones sur le gros orteil). Dans l'app :

- l'étape porte **un seul libellé parent** (`designation`) et **une seule intention** ;
- mais elle enchaîne **les animations des zones** qu'elle contient, l'une après l'autre.

Le parent lit une intention simple ; l'écran, lui, déroule les gestes précis. C'est exactement l'articulation qu'on cherchait.

---

## Règles de rédaction (ton)

Repris de mes textes validés (M23) :

- **Tutoiement du parent**, voix posée. Le bébé est « il ».
- Chaque intention = **le pourquoi**, jamais une promesse médicale. On accompagne, on ne traite pas.
- Vocabulaire autorisé uniquement : *pression douce, appui doux et maintenu, toucher léger et constant, balayage, cercles lents, geste doux*.
- **« massage »** : autorisé uniquement en contexte bien-être, **avec parcimonie** (feu vert de Laura). **Interdits** : « caresse » (même niée), toute échelle de pression chiffrée. « Réflexologie » toujours en toutes lettres, guillemets français « ».
- **`note_fin` toujours présente** : consentement (« s'il retire son pied, on s'arrête sans insister ») + sortie en douceur.
- **`disclaimer` toujours présent**.

---

## Comparaison Sommeil : PDF ↔ mes textes ↔ protocole app

| Source | Ce qu'elle apporte | Ce qu'on écarte |
|---|---|---|
| **PDF EDPP** | Ordre des zones : tête/épiphyse/hypophyse → diaphragme → plexus → surrénales → thyroïde/thymus. La variante « cauchemars ». | La lecture symbolique « la nuit = la grossesse » (MTC) — **non reprise**. |
| **Mes textes M23** | Le ton : « lentement », « cercles lents », « appui doux et maintenu », « si l'enfant retire son pied, on s'arrête ». Sécurité, geste-plaisir. | Les **zones** grand public (voûte, talon) — on garde la voix, pas les zones. |
| **Protocole app** (`protocole-sommeil.json`) | La séquence exacte du PDF, habillée du ton de mes textes : intro, note émotionnelle, intention par étape, variante âgée, note de fin, disclaimer. | — |

---

## Décisions validées (Sommeil)

- ✅ **Structure** retenue.
- ✅ **Zones = celles du PDF**, strictement.
- ✅ **Éclairage symbolique / MTC retiré** ; registre **émotionnel** conservé (champ `emotion`).
- ✅ **Ton** des intentions validé.
- ✅ **Variantes conditionnées par l'âge** (cauchemars proposés à partir de `age_min_mois`).

**Ouverture commune** (validée) : chaque protocole démarre par un bloc `ouverture` identique — parler à bébé, vérifier les conditions et son accord, réchauffer les pieds entre ses mains, appliquer une huile végétale douce. Défini dans `_ouverture-commune.json`. Pas de « massage » préliminaire.

**Âge de la variante cauchemars :** fixé à **12 mois** (choix Laura).

Prêt à dupliquer le schéma sur les 20 protocoles restants.

# CONSIGNES CLAUDE CODE — Écran « Préparer le coucher »

_(Rubrique mensuelle. Fichier source : `mois_NN_-_02_coucher.json`.)_

> **Référence visuelle : `apercu_coucher_M12_variante.html`** (format de référence, mois avec variantes).
> Se fier à M12 + ce document. L'aperçu M3 illustre un mois sans variantes.

---

## 1. Ordre des blocs

1. **Ce qui se passe** — `description`
2. **Repères clés** — `reperes_cles` (amorce en gras)
3. **Signaux de fatigue** — `signaux_de_fatigue` (sans amorce)
4. _(si présent)_ **Sélecteur de variante** — `variantes_developpementales`
5. **Rituel pas à pas** — `rituel_etapes` (camaïeu bleu · toujours ouvert)
6. **Réflexologie du soir** — `reflexologie_du_coucher` (déroulant, fermé par défaut)
7. **Berceuse-rituel** — `script_audio_du_soir` (déroulant, fermé par défaut)
8. _(si présent)_ **La place du co-parent** — `co_parent`
9. **Erreurs à éviter** — `erreurs_a_eviter`
10. _(si présent)_ **Consulter si** — `consulter_si` (ligne sobre, PAS d'encadré rouge d'alerte)

> Blocs **optionnels selon le mois** : `variantes_developpementales` (à partir de M12), `co_parent`, `consulter_si`. Afficher un bloc uniquement si la clé existe dans le JSON. Aux mois où ils manquent (ex. M12 n'a ni `co_parent`), ne rien afficher à la place.

---

## 2. Déroulant vs toujours ouvert

- **Déroulants = Réflexologie + Berceuse uniquement.** Fermés par défaut.
  - En-tête : à gauche **picto + titre + teaser** (mini-phrase italique) ; à droite **flèche seule**.
  - **Flèche seule** = cercle 25px, bord `1.6px solid` (couleur du bloc), fond `rgba(255,255,255,.55)`, chevron ▾ qui pivote 180° à l'ouverture. **Aucun texte.**
  - À l'ouverture : **tout le contenu d'un coup, sans scroll interne.**
- **Rituel pas à pas = toujours ouvert.** Pas de flèche, aucune mention « toujours ouvert ».
- Autres blocs : ouverts en permanence.

### Teasers (en-tête replié)
- Réflexologie → _« Six points sur ses pieds pour relâcher tout son petit corps. »_ (couleur `#5E7A48`)
- Berceuse → _« Quelques mots à murmurer pour refermer la journée. »_ (couleur `#9A5A48`)

---

## 3. Sélecteur de variante (`variantes_developpementales`, M12+)

Carte unique, **fond vert réflexologie `#DCE9CF`**, bord `1px #B8CDA8`, radius 13px. Contient, dans l'ordre :

1. **Le principe** (`intro`) en haut : texte **12px**, couleur `#33452C`, suivi d'un filet `1px #C3D6B0`. _(Phrase importante : ne pas la rendre trop petite. Pas de bleu.)_
2. **La question** (`question_selecteur`, avec `[prénom]` résolu) : **EN CAPITALES**, centrée, `#2F4A2A`, 10.5px, letter-spacing .03em.
3. **Les boutons de thème** (`themes[]`) : empilés verticalement, **largeur ~78 %, centrés**.
   - Chaque bouton : **picto à gauche**, puis titre + sous-titre ferrés à gauche.
   - **Titre = style catégorie Guide-moi : Playfair Display 600 / 14px / `#3A3228`.**
   - Sous-titre (`sous_titre`, genré `[Il/Elle]`) : 9.5px, `#5E6A52`.
   - Fond **blanc translucide** `rgba(255,255,255,.5)`, bord `rgba(255,255,255,.55)`.
   - **Sélectionné** : fond `rgba(255,255,255,.92)`, bord `1.5px #5E7A48`.
   - Pictos des thèmes : **même couleur pour les deux** (`#5E7A48`), au trait. Pas de marron, pas de bleu.
   - **Cliquables, bascule au tap** (un seul thème actif à la fois).

**Le thème actif pilote trois zones :**
1. **L'étape de focus du rituel** (étape 1, encadrée) — voir §4.
2. **Le focus réflexo** — `reflexologie_du_coucher.focus_par_theme[thème]`, affiché DANS le module réflexo.
3. **Le passage de la berceuse** — `passage_par_theme[thème]` (voir §7).

---

## 4. Rituel pas à pas + étape de focus

- Le nombre d'étapes **varie selon le mois** (ex. M12 = 7). Toujours développer chaque étape, même si le contenu se répète d'un mois à l'autre (nouveaux utilisateurs chaque mois).
- **Camaïeu bleu**, clair → foncé (progression du soir). Pastilles numérotées pleines (fond = accent, chiffre blanc, 700). Exemple 7 crans (M12) :

| Étape | Fond | Accent |
|------|------|--------|
| 1 (focus) | `#ECF2F5` | bordure **`#1F4456`** (voir ci-dessous) |
| 2 | `#E0EAEF` | `#628D9E` |
| 3 | `#D3E1E8` | `#568397` |
| 4 | `#C6D8E1` | `#4A7990` |
| 5 | `#B7CEDB` | `#3E6F89` |
| 6 | `#A8C3D4` | `#326582` |
| 7 | `#98B4C9` | `#2A5673` |

- **Étape 1 = étape de focus** (si `rituel_etapes[0].focus_theme === true`) :
  - **Encadrée d'un filet bleu foncé** : `border: 2px solid #1F4456`, `borderRadius: 11`.
  - Petit tag « Focus du soir · [Thème] » en haut (fond `#1F4456`, texte blanc).
  - Son **titre / durée / description sont pilotés par le thème actif** : `variantes_developpementales.themes[theme_actif].etape_rituel`. Au changement de thème, cette étape se met à jour.
  - S'il n'y a pas de variantes au mois donné, l'étape 1 est une étape normale du `rituel_etapes`.
- La **note d'horaire/durée** peut intégrer l'ambiance lumineuse (ex. « lumière tamisée · 10 min », « pénombre · 5–10 min »).

---

## 5. Couleurs des blocs (Coucher uniquement — ne pas toucher au protocole Guide-moi)

| Bloc | Fond | Bordure gauche 3px | Texte label |
|------|------|--------------------|-------------|
| Ce qui se passe | `#F8E0D8` | `#E0A48E` | `#8A4030` |
| Repères clés | `#EDE0D4` | `#C89878` | `#7A5038` |
| Signaux de fatigue | `#F8DBC8` | `#DB936B` | `#9A4F2A` |
| Sélecteur de variante | `#DCE9CF` (carte) | `1px #B8CDA8` | — |
| Réflexologie | `#DCE9CF` | `#82A56A` | `#3F5C2E` |
| Berceuse | `#F8E0D8` | `#E0A48E` | `#8A4030` |
| Co-parent | `#D4E0DC` | `#8A9E98` | `#384E48` |
| Erreurs à éviter | `#E4DDD6` | `#B4A89C` | `#5A4A40` + croix ✕ `#D4604A` |

- « Ce qui se passe » reprend la couleur **« Pour toi, parent »** du protocole (`#F8E0D8`), **uniquement dans le Coucher**. Ne pas l'appliquer au protocole (où « Ce qui se passe » reste `#E8F0F2`).
- « Ce qui se passe » et « Berceuse » partagent volontairement la même pêche (ouverture / clôture en miroir chaud).
- **Bleu réservé au Rituel pas à pas.**
- « Consulter si » (si présent) = **ligne sobre**, pas d'encadré rouge d'alerte.
- TopBar Cream `#F2EDE8`, séparation `0.5px solid #E4DDD6`.
- Tous blocs : `borderRadius: '0 12px 12px 0'`.

---

## 6. Pictos (au trait, stroke = couleur indiquée)

| Bloc | Picto | Stroke |
|------|-------|--------|
| En-tête de page | lune croissant + petite étoile | `#4A7990` / `#7BA6B6` |
| Ce qui se passe | cercle d'info (ⓘ) | `#E0A48E` |
| Repères clés | étoile ★ | `#C89878` |
| Signaux de fatigue | trois ondulations | `#DB936B` |
| Rituel pas à pas | horloge | `#4A7990` |
| Réflexologie | **empreinte de pied** | `#82A56A` |
| Berceuse | note de musique ♪ | `#E0A48E` |
| Co-parent | deux silhouettes | `#8A9E98` |

Tous au même style trait fin. **Pas d'emoji.** Tracés SVG exacts dans `apercu_coucher_M12_variante.html`.

---

## 7. Berceuse

- **Police : Nunito italique** (`Nunito:ital`). Pas de serif.
- **Paragraphes, pas de boîte interne.** Découper `texte` sur les lignes vides (`\n\n`) ; chaque strophe = un paragraphe (`font-size:12.5px; line-height:1.3; margin-bottom:6px`), directement dans le cadre déroulant (comme les zones de la réflexo).
- **Pas de marqueur de pause** : une ligne vide marque le temps.
- **Titre « Berceuse » + teaser conservés** tels quels (« Quelques mots à murmurer pour refermer la journée. »).
- **Ne pas afficher le champ `instruction`** : c'est une consigne d'usage (logique), inutile à l'écran. Afficher directement le `texte`, sans figure de tempo. _(Le champ peut rester dans le JSON comme métadonnée d'auteur ; il n'est simplement jamais rendu.)_
- **Couleur du `texte` de la berceuse : noir.** Le texte (qui commence par `[Prénom]`) s'affiche en **noir** — `#3A3228` (noir chaud du design system, recommandé pour la cohérence) — et **non** dans la couleur d'accent pêche du bloc (`#8A4030`). _(NB : valeur « 2222 » indiquée par la fondatrice ; basculer sur `#222222` si elle préfère un noir plus franc.)_
- Placeholders : `[prénom]` ; genre `[masculin/féminin]` → forme selon le genre (**masculin en premier**). Jamais d'écriture inclusive.
- **Passage variable (M12+)** : `[passage_theme]` dans `texte` est remplacé par `passage_par_theme[thème actif]`, **rendu en couleur `#8A4030`** (couleur du titre Berceuse) — **PAS en gras**, pour rester léger.

---

## 8. Réflexologie — consentement

En tête du module réflexo (avant les zones), afficher le champ **`consentement`** dans un encadré doux (fond `#E8F0DF`, filet pointillé `#82A56A`) : observer les réactions, accord de l'enfant, ne pas forcer. Reprendre aussi l'esprit dans l'étape massage du rituel.

(Le module réflexo affiche également `focus_par_theme[thème]` quand un thème est actif — voir §3.)

---

## 9. Typographie transverse

- **Sous-titre de page** (`sous_titre`) : **gris Eucalyptus `#8A9E98`**, 9px, uppercase, centré. **Jamais** la couleur d'un bloc.
- **Amorce en gras** : sur **Repères clés** (`reperes_cles[]`) et **Co-parent** (`co_parent.actions[]`). Aucune balise `**` dans le JSON : le composant coupe sur le **premier `:` ou `—`** et met l'amorce en **700**. **NE PAS** appliquer aux Signaux de fatigue.
- **Espace insécable** (U+00A0) avant `: ; ! ?` et dans les guillemets `« … »` (déjà dans les JSON, ne pas le retirer).
- H1 + titres de catégorie : Playfair Display.

```tsx
function LigneAvecAmorce({ texte }: { texte: string }) {
  const m = texte.match(/^(.*?)(\s*[:—])(\s*)(.*)$/s);
  if (!m) return <span>{texte}</span>;
  return <span><strong>{m[1]}</strong>{m[2]}{m[3]}{m[4]}</span>;
}
```

---

## 10. Checklist

- [ ] Réflexologie + Berceuse = seuls déroulants (fermés par défaut, flèche seule sans texte, contenu intégral à l'ouverture).
- [ ] Rituel pas à pas toujours ouvert, sans mention.
- [ ] Étape 1 = focus encadré filet `#1F4456` + tag, piloté par le thème (si variantes).
- [ ] Sélecteur : carte verte, principe 12px, question EN CAPITALES centrée, boutons Playfair 600/14px picto-à-gauche, 78% centrés, blanc translucide, actif liseré `#5E7A48`.
- [ ] Thème actif pilote : étape focus + focus réflexo + passage berceuse.
- [ ] Passage berceuse en `#8A4030`, **pas en gras**.
- [ ] « Ce qui se passe » en pêche `#F8E0D8` (Coucher seulement).
- [ ] Bleu uniquement sur le Rituel.
- [ ] Note de consentement en tête du module réflexo.
- [ ] Berceuse en Nunito italique, paragraphes directs, sans pause, **sans le champ `instruction` affiché**, **texte en noir `#3A3228`**.
- [ ] Amorce en gras sur Repères + Co-parent (jamais Signaux).
- [ ] Sous-titre gris `#8A9E98`.
- [ ] Pictos au trait conformes (pied pour réflexo, note pour berceuse). Pas d'emoji.
- [ ] Blocs optionnels (variantes, co-parent, consulter_si) affichés seulement si présents dans le JSON.

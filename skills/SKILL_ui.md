# SKILL_ui.md — Design System & Composants UI

> Lire ce fichier avant de créer ou modifier tout composant visuel.
> Toutes les couleurs, typographies, espacements et composants sont définis ici.
> Ne jamais inventer une couleur ou un composant — les chercher ici d'abord.

---

## Palette de couleurs officielle — validée par la fondatrice

6 couleurs de base extraites de la gamme choisie. Toujours utiliser ces codes hex — jamais d'approximation.

| Nom | Hex | Usage principal |
|-----|-----|-----------------|
| **Cream** | `#F2EDE8` | Fond général de l'app, fond des pages |
| **Peach** | `#F0B8A8` | Topbar, accents doux, badges, hover |
| **Coral** | `#D4604A` | Action immédiate, alertes, CTA principal |
| **Latte** | `#C89878` | Explications, éléments neutres chauds, icônes |
| **Rain** | `#C8D8DC` | Geste réflexo, éléments doux, fond module coucher |
| **Eucalyptus** | `#8A9E98` | Action parent, éléments naturels, nav active |

### Déclinaisons par couleur

```css
/* CREAM */
--cream:      #F2EDE8;   /* fond principal */
--cream-dark: #E4DDD6;   /* fond secondaire, séparateurs */

/* PEACH */
--peach:      #F0B8A8;   /* accents, topbar, hover */
--peach-dark: #C8806A;   /* texte sur fond peach, bordures */
--peach-text: #7A3E2E;   /* texte foncé sur fond peach clair */

/* CORAL */
--coral:      #D4604A;   /* action immédiate, CTA, urgence */
--coral-light:#F5D0C8;   /* fond bloc action immédiate */
--coral-dark: #8A3020;   /* texte sur fond coral clair */

/* LATTE */
--latte:      #C89878;   /* explication, neutre chaud */
--latte-light:#EDE0D4;   /* fond bloc explication */
--latte-dark: #7A5038;   /* texte sur fond latte clair */

/* OCRE — action immédiate (remplace l'ancien Coral/rouge, signal moins urgent) */
--ocre:       #C77B3C;   /* bordure gauche action immédiate */
--ocre-light: #F4E2CE;   /* fond bloc action immédiate */
--ocre-dark:  #8A4E1C;   /* texte sur fond ocre clair */

/* SAUGE — geste doux (vert naturel A1, validé fondatrice) */
--sauge:       #82A56A;  /* bordure gauche + pastilles geste doux */
--sauge-light: #DCE9CF;  /* fond bloc geste doux */
--sauge-dark:  #3F5C2E;  /* texte sur fond sauge clair */

/* TERRACOTTA — pour aller plus loin (orangé chaud, validé fondatrice) */
--terracotta:       #DB936B;  /* bordure gauche pour aller plus loin */
--terracotta-light: #F8DBC8;  /* fond bloc pour aller plus loin */
--terracotta-dark:  #9A4F2A;  /* texte sur fond terracotta clair */

/* RAIN */
--rain:       #C8D8DC;   /* réflexo, éléments doux */
--rain-light: #E8F0F2;   /* fond bloc réflexo */
--rain-dark:  #486878;   /* texte sur fond rain clair */

/* EUCALYPTUS */
--eucal:      #8A9E98;   /* action parent, nav active */
--eucal-light:#D4E0DC;   /* fond bloc action parent */
--eucal-dark: #384E48;   /* texte sur fond eucalyptus clair */
```

### Couleurs des blocs de protocole

| Bloc | Fond | Texte | Bordure gauche |
|------|------|-------|----------------|
| Ce qui se passe (explication) | `#E8F0F2` | `#3A5A64` | `#8FB4BC` (Rain) |
| Pour toi parent (ancrage) | `#F8E0D8` | `#8A4030` | `#E0A48E` (Peach) |
| Action immédiate | `#F5D0C8` | `#8A3020` | `#D4604A` (Corail) |
| Pour aller plus loin | `#F8DBC8` | `#9A4F2A` | `#DB936B` (Terracotta) |
| Geste doux | `#DCE9CF` | `#3F5C2E` | `#82A56A` (Sauge) |
| Principe à retenir | `#E8F0F2` | `#384E48` | `#8A9E98` (Eucalyptus) |
| Erreurs à éviter | `#E4DDD6` | `#5A4A40` | `#B4A89C` (Gris) + croix ✕ `#D4604A` |
| Cadre de sécurité | `#EDE9E4` | `#8A3020` | cadre complet `#D4604A` (Corail) |

### Couleurs des modules (cases d'accueil)

| Module | Fond de case | Accent |
|--------|-------------|--------|
| 🧭 Guide-moi ! | `#EDE0D4` | `#C89878` |
| 🌙 Préparer le coucher | `#E8F0F2` | `#8A9E98` |
| 🌸 Prendre soin de moi | `#F5D0C8` | `#D4604A` |
| 🌿 Conseil de saison | `#D4E0DC` | `#8A9E98` |
| 💜 Partager & rassurer | `#E8F0F2` | `#C8D8DC` |
| 🎯 Jeux & stimulation | `#EDE0D4` | `#C89878` |

---

## Contraintes de format

```
Format cible    : Mobile-first portrait
Largeur max app : 390px (iPhone standard)
Padding latéral : 16px (1rem)
Border radius   : 14px (cards), 9px (boutons), 6px (tags)
Fond général    : #F2EDE8 (Cream)
```

L'app est conçue pour être utilisée **d'une main, la nuit, avec un bébé dans l'autre bras.**
- Boutons larges (min 44px de hauteur)
- Texte lisible sans zoom (min 11px, préférer 12–14px)
- Contrastes suffisants sur tous les fonds
- Zones de tap généreuses (min 44×44px)

---

## Typographie

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

--text-xl   : 16px / font-weight 500  /* titre de page */
--text-lg   : 14px / font-weight 500  /* titre de section */
--text-md   : 13px / font-weight 500  /* titre de card */
--text-base : 12px / font-weight 400  /* corps principal */
--text-sm   : 11px / font-weight 400  /* contenu des protocoles */
--text-xs   : 10px / font-weight 400  /* métadonnées, labels */
--text-xxs  : 9px  / font-weight 600  /* labels uppercase */

/* Labels de section */
letter-spacing: 0.07em
text-transform: uppercase
font-size: 9px
font-weight: 600
color: #8A9E98  /* Eucalyptus — toujours pour les labels de section */
```

---

## Composants de base

### TopBar

```tsx
<div style={{
  background: '#F0B8A8',  /* Peach */
  padding: '14px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  borderBottom: '0.5px solid #C8806A'
}}>
  <div style={{
    width: 36, height: 36, borderRadius: '50%',
    background: '#D4604A',  /* Coral */
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  }}>
    {/* Avatar bébé SVG illustré */}
  </div>
  <div style={{flex: 1}}>
    <div style={{fontSize: 13, fontWeight: 500, color: '#7A3E2E'}}>
      {babyName}
      <span style={{
        fontSize: 9, padding: '2px 7px', borderRadius: 4,
        background: '#F2EDE8', color: '#7A3E2E',
        marginLeft: 5, border: '0.5px solid #C8806A'
      }}>
        {babyMonth} mois · {season}
      </span>
    </div>
    <div style={{fontSize: 10, color: '#C8806A', marginTop: 2}}>{subtitle}</div>
  </div>
</div>
```

### BreadcrumbBar

```tsx
<div style={{display: 'flex', alignItems: 'center', gap: 4, marginBottom: 9, flexWrap: 'wrap'}}>
  {items.map((item, i) => (
    <React.Fragment key={i}>
      {i > 0 && <span style={{fontSize: 9, color: '#8A9E98'}}>›</span>}
      {i === items.length - 1
        ? <span style={{fontSize: 9, fontWeight: 500, color: '#3A3228'}}>{item.label}</span>
        : <button onClick={item.onClick} style={{
            fontSize: 9, color: '#8A9E98', background: 'none',
            border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0
          }}>{item.label}</button>
      }
    </React.Fragment>
  ))}
</div>
```

### Affichage d'un protocole — ordre et encarts des 8 rubriques

**Règle absolue : chaque rubrique est un encart coloré distinct.** Aucune rubrique en texte nu. Toujours dans cet ordre :

| # | Rubrique | Champ JSON | Fond | Bordure | Texte label |
|---|----------|-----------|------|---------|-------------|
| 1 | Ce qui se passe | `explication` | `#E8F0F2` | gauche 3px `#8FB4BC` | `#3A5A64` |
| 2 | Pour toi, parent | `ancrage` | `#F8E0D8` | gauche 3px `#E0A48E` | `#8A4030` (italique) |
| 3 | Action immédiate | `action_immediate` | `#F5D0C8` | gauche 3px `#D4604A` | `#8A3020` |
| 4 | Pour aller plus loin | `pour_aller_plus_loin` | `#F8DBC8` | gauche 3px `#DB936B` | `#9A4F2A` |
| 5 | Geste doux | `geste_doux` | `#DCE9CF` | gauche 3px `#82A56A` | `#3F5C2E` |
| 6 | Principe à retenir | `principe` | `#E8F0F2` | gauche 3px `#8A9E98` | `#384E48` |
| 7 | Erreurs à éviter | `erreurs_a_eviter` | `#E4DDD6` | gauche 3px `#B4A89C` | `#5A4A40` |
| 8 | Cadre de sécurité | `consulter_si` | `#EDE9E4` | **cadre complet 1px `#D4604A`** | `#8A3020` |

**Règles transverses :**
- Bordure gauche 3px + `borderRadius: '0 12px 12px 0'` pour les rubriques 1 à 7. **Exception rubrique 8** : bordure complète `1px solid #D4604A` + `borderRadius: 10` (cadre fermé, signal d'alerte).
- Label de section : 9px, uppercase, `letter-spacing: .07em`, **font-weight 700**, couleur = texte du tableau.
- **Démarcation forte avant le `:`** (font-weight 700) sur Action immédiate, Geste doux ET Pour aller plus loin.
- **Pastilles numérotées pleines** (fond = couleur de bordure, chiffre `#FFFFFF`, poids 700) sur Action immédiate et Geste doux.
- **Compléments de titre** : Action immédiate et Geste doux affichent leur `titre` complet (ex. « Action immédiate — désamorcer le moment du repas »). Les autres rubriques ont un label fixe.
- **Erreurs à éviter** : chaque erreur précédée d'une croix `✕` rouge `#D4604A` (poids 700), pas de pastille numérotée.
- **Ne JAMAIS réafficher le champ `situation`** sur l'écran d'un protocole ouvert : il fait doublon avec le `titre`. Le champ `situation` ne sert que de libellé de bouton dans la liste d'une catégorie.

### Helper de rendu — gras avant le `:`

```tsx
/* Réutilisé par Action immédiate, Geste doux et Pour aller plus loin */
function ligneAvecAmorce(texte: string) {
  const i = texte.indexOf(':');
  if (i === -1) return <>{texte}</>;
  return <><strong style={{fontWeight: 700}}>{texte.slice(0, i).trim()} :</strong>{texte.slice(i + 1)}</>;
}
```

### Encart simple (Ce qui se passe / Pour toi parent / Principe)

```tsx
<div style={{
  background: BG, borderLeft: `3px solid ${ACCENT}`,
  borderRadius: '0 12px 12px 0', padding: '11px 13px', marginBottom: 8
}}>
  <div style={{fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
               letterSpacing: '.07em', color: TEXT, marginBottom: 5}}>{label}</div>
  <div style={{fontSize: 11, color: TEXT, lineHeight: 1.55 /* italic pour "Pour toi parent" */}}>
    {contenu}
  </div>
</div>
```

### Encart à étapes numérotées (Action immédiate = Corail / Geste doux = Sauge)

```tsx
/* AI: BG #F5D0C8, ACCENT #D4604A, TEXT #8A3020
   GD: BG #DCE9CF, ACCENT #82A56A, TEXT #3F5C2E */
<div style={{
  background: BG, borderLeft: `3px solid ${ACCENT}`,
  borderRadius: '0 12px 12px 0', padding: '11px 13px', marginBottom: 8
}}>
  <div style={{fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
               letterSpacing: '.07em', color: TEXT, marginBottom: 7}}>
    {bloc.titre}  {/* titre complet du JSON, avec son complément après le tiret */}
  </div>
  {bloc.etapes.map((step, i) => (
    <div key={i} style={{display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 5}}>
      <div style={{
        width: 17, height: 17, borderRadius: '50%', fontSize: 9, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 1, background: ACCENT, color: '#FFFFFF'
      }}>{i + 1}</div>
      <div style={{fontSize: 11, color: '#3A3228', lineHeight: 1.5}}>{ligneAvecAmorce(step)}</div>
    </div>
  ))}
</div>
```

### Encart « Pour aller plus loin » (Terracotta) — gras avant le `:`

```tsx
<div style={{
  background: '#F8DBC8', borderLeft: '3px solid #DB936B',
  borderRadius: '0 12px 12px 0', padding: '11px 13px', marginBottom: 8
}}>
  <div style={{fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
               letterSpacing: '.07em', color: '#9A4F2A', marginBottom: 7}}>
    Pour aller plus loin
  </div>
  {points.map((pt, i) => (
    <div key={i} style={{fontSize: 11, color: '#3A3228', lineHeight: 1.5, marginBottom: 5}}>
      {ligneAvecAmorce(pt)}
    </div>
  ))}
</div>
```

### Encart « Erreurs à éviter » (Gris + croix rouges)

```tsx
<div style={{
  background: '#E4DDD6', borderLeft: '3px solid #B4A89C',
  borderRadius: '0 12px 12px 0', padding: '11px 13px', marginBottom: 8
}}>
  <div style={{fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
               letterSpacing: '.07em', color: '#5A4A40', marginBottom: 7}}>
    Erreurs à éviter
  </div>
  {erreurs.map((err, i) => (
    <div key={i} style={{display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 5}}>
      <span style={{color: '#D4604A', fontWeight: 700, fontSize: 12, lineHeight: 1.4, flexShrink: 0}}>✕</span>
      <div style={{fontSize: 11, color: '#5A4A40', lineHeight: 1.5}}>{err}</div>
    </div>
  ))}
</div>
```

### Encart « Cadre de sécurité » (Gris clair + cadre rouge complet)

```tsx
<div style={{
  background: '#EDE9E4', border: '1px solid #D4604A',
  borderRadius: 10, padding: '11px 13px', marginBottom: 0
}}>
  <div style={{fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
               letterSpacing: '.07em', color: '#8A3020', marginBottom: 5}}>
    Cadre de sécurité
  </div>
  <div style={{fontSize: 11, color: '#5A4A40', lineHeight: 1.55}}>{consulterSi}</div>
</div>
```

### TopBar du protocole — dégrisée

La bande du haut (prénom + mois + saison) reste sur le **fond Cream** (`#F2EDE8`), pas en Peach. Une simple séparation basse `0.5px solid #E4DDD6` suffit. Cela allège l'écran et laisse les 8 blocs porter la couleur.


### Boutons

```tsx
/* Retour */
<button style={{
  fontSize: 9, color: '#8A9E98',
  background: '#F2EDE8', border: '0.5px solid #C8D8DC',
  borderRadius: 5, padding: '3px 8px', cursor: 'pointer'
}}>← Retour</button>

/* Épingler */
<button style={{
  fontSize: 9, color: '#384E48',
  background: '#D4E0DC', border: 'none',
  borderRadius: 5, padding: '3px 8px', cursor: 'pointer'
}}>☆ Épingler</button>

/* Rapide */
<button style={{
  fontSize: 9, color: '#8A3020',
  background: '#F5D0C8', border: 'none',
  borderRadius: 5, padding: '3px 8px', cursor: 'pointer'
}}>⚡ Rapide</button>

/* Primaire (CTA abonnement) */
<button style={{
  width: '100%', padding: '13px',
  background: '#D4604A',  /* Coral */
  color: '#F2EDE8',
  fontSize: 13, fontWeight: 500,
  borderRadius: 12, border: 'none', cursor: 'pointer'
}}>S'abonner</button>

/* Catégorie (grille 2 colonnes) */
<button style={{
  padding: '10px 9px', borderRadius: 10,
  border: '0.5px solid #C8D8DC',
  background: '#F2EDE8', cursor: 'pointer', textAlign: 'left'
}}>
  <div style={{fontSize: 11, fontWeight: 500, color: '#3A3228'}}>{name}</div>
  <div style={{fontSize: 9, color: '#8A9E98', marginTop: 2}}>{subtitle}</div>
</button>

/* Situation (pleine largeur) */
<button style={{
  width: '100%', padding: '9px 11px', borderRadius: 9,
  border: '0.5px solid #C8D8DC', background: '#F2EDE8',
  cursor: 'pointer', textAlign: 'left',
  fontSize: 11, color: '#3A3228', marginBottom: 5
}}>
  {situationText}
</button>
```

### Cases modules (accueil) — avec pattern SVG

Chaque case module a un fond coloré + un pattern SVG illustré en arrière-plan (opacité 0.15–0.20). Pattern unique par module — jamais d'emoji seul.

```tsx
<button style={{
  borderRadius: 14, border: '0.5px solid #C8D8DC',
  cursor: 'pointer', overflow: 'hidden',
  aspectRatio: '1', display: 'flex',
  flexDirection: 'column', alignItems: 'flex-start',
  justifyContent: 'flex-end', padding: 12,
  position: 'relative',
  background: '#EDE0D4'  /* couleur selon module */
}}>
  <svg style={{position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', opacity: 0.18}}>
    {/* pattern spécifique au module */}
  </svg>
  <div style={{fontSize: 11, fontWeight: 500, color: '#3A3228', position: 'relative', zIndex: 1}}>{name}</div>
  <div style={{fontSize: 9, color: '#8A9E98', marginTop: 2, position: 'relative', zIndex: 1}}>{subtitle}</div>
</button>
```

### Navigation principale (5 onglets)

```tsx
<nav style={{
  background: '#F2EDE8',
  borderTop: '0.5px solid #C8D8DC',
  display: 'flex', justifyContent: 'space-around',
  padding: '9px 0 5px'
}}>
  {/* Icônes SVG outline — jamais d'emoji dans la nav */}
  {/* Couleur inactive : #8A9E98 (Eucalyptus) */}
  {/* Couleur active : #D4604A (Coral) */}
</nav>
```

### Badge / tag

```tsx
/* Badge dans la topbar */
<span style={{
  fontSize: 9, padding: '2px 7px', borderRadius: 4,
  background: '#F2EDE8', color: '#7A3E2E',
  border: '0.5px solid #C8806A'
}}>14 mois · Printemps</span>

/* Tag catégorie (jeux, stimulation) */
<span style={{
  display: 'inline-block', fontSize: 9, padding: '2px 7px',
  borderRadius: 4, fontWeight: 600, marginRight: 4,
  background: '#E8F0F2', color: '#486878'
}}>Motricité</span>
```

### Message état vide

```tsx
<div style={{textAlign: 'center', padding: '32px 16px', color: '#8A9E98'}}>
  <div style={{fontSize: 24, marginBottom: 8}}>☆</div>
  <div style={{fontSize: 12, fontWeight: 500, color: '#3A3228', marginBottom: 4}}>
    Aucun protocole épinglé
  </div>
  <div style={{fontSize: 11, lineHeight: 1.6}}>
    Explore le Guide-moi ! et épingle les protocoles que tu utilises souvent.
  </div>
</div>
```

---

## Structure de la page d'accueil (Dashboard)

```
TopBar (Peach — prénom bébé + mois + saison)
↓
Card "Mois X" (Cream — illustration bébé + progression)
↓
Grille 6 modules (2 colonnes — cases illustrées avec pattern SVG)
↓
Card "Épinglé récemment" (Cream + bordure Coral à gauche)
↓
Navigation fixe (5 onglets — icônes SVG outline)
```

---

## Règles absolues UI

1. **Jamais de largeur fixe > 390px** sur les éléments de contenu
2. **Toujours un padding-bottom de 80px** sur les pages avec nav fixe
3. **Toujours border-radius: 0** sur le côté gauche des cards avec bordure colorée gauche
4. **Les boutons de retour** sont toujours présents sur toutes les pages internes
5. **Le fil d'Ariane** est cliquable sur tous les niveaux sauf le dernier
6. **Pas de scroll horizontal** — jamais
7. **Icônes SVG outline uniquement** dans la navigation — jamais d'emoji
8. **Les patterns SVG des modules** ont toujours une opacité entre 0.15 et 0.20
9. **Fond général systématique** : #F2EDE8 (Cream) — jamais de blanc pur
10. **Couleur active de la nav** : #D4604A (Coral) — inactive : #8A9E98 (Eucalyptus)
11. **Ordre des rubriques d'un protocole** (jamais réordonner) : Ce qui se passe → Pour toi parent → Action immédiate → Pour aller plus loin → Geste doux → Principe → Erreurs à éviter → Cadre de sécurité
12. **Toutes les rubriques sont des encarts colorés** — même codes graphiques (fond clair + bordure gauche 3px + radius `0 12px 12px 0`)
13. **Action immédiate = Ocre #C77B3C**, jamais rouge/Coral — l'urgence reste douce, pas anxiogène
14. **Action immédiate = Corail `#D4604A`** (fond `#F5D0C8`) — décision fondatrice assumée
15. **Démarcation forte avant le `:`** (font-weight 700) sur Action immédiate, Geste doux ET Pour aller plus loin — pour une lecture rapide de l'essentiel
16. **Pastilles numérotées pleines** (fond coloré + chiffre blanc) sur Action immédiate et Geste doux — jamais en contour
17. **8 blocs colorés, aucune rubrique en texte nu** ; ordre fixe : Ce qui se passe → Pour toi parent → Action immédiate → Pour aller plus loin → Geste doux → Principe → Erreurs → Cadre
18. **Ne jamais réafficher le champ `situation`** sur l'écran d'un protocole (doublon du titre) ; il ne sert que de libellé de bouton dans la liste d'une catégorie
19. **Cadre de sécurité = cadre rouge complet** (`1px solid #D4604A`, radius 10) ; **Erreurs à éviter = croix ✕ rouges** devant chaque ligne
20. **TopBar du protocole dégrisée** : fond Cream `#F2EDE8`, pas de Peach
21. **Bouton Épingler réservé aux blocs réflexologie dédiés** (`reflexologie_du_coucher`) — jamais sur le Geste doux des protocoles Guide-moi

---

## Récapitulatif palette — référence rapide

```
Cream      #F2EDE8   → fond général + topbar protocole
Peach      #F0B8A8   → accents ; bloc « Pour toi parent » (fond #F8E0D8 / bord #E0A48E)
Coral      #D4604A   → action immédiate, croix erreurs, cadre sécurité, CTA, nav active
Terracotta #DB936B   → pour aller plus loin (fond #F8DBC8 / texte #9A4F2A)
Sauge      #82A56A   → geste doux (fond #DCE9CF / texte #3F5C2E)
Rain       #8FB4BC   → ce qui se passe (fond #E8F0F2 / texte #3A5A64) + module coucher
Eucalyptus #8A9E98   → principe à retenir, nav, labels
Gris       #B4A89C   → erreurs à éviter (fond #E4DDD6) ; cadre sécurité (fond #EDE9E4)
```

> Note : l'ancien Ocre et l'ancien Latte ne sont plus utilisés sur les blocs de protocole (remplacés par Corail et Terracotta).


---

## Composant cases modules — validé

### Spécifications

```
Hauteur       : 130px
Border-radius : 14px
Border        : 0.5px solid rgba(0,0,0,.07)
Alignement    : centré (texte + contenu)
Typographie   : Playfair Display 600 — 17px — line-height 1.15
Sous-titre    : 9px uppercase — couleur Eucalyptus #8A9E98
Pattern SVG   : position absolute, top 0 left 0, 100% width/height, z-index 1
Contenu       : z-index 2 — toujours au-dessus du pattern
```

### Typographie des titres de modules

```css
font-family: 'Playfair Display', Georgia, serif;
font-size: 17px;
font-weight: 600;
line-height: 1.15;
color: #3A3228;
letter-spacing: -.01em;
text-align: center;
```

### Style des patterns SVG par module

Chaque pattern est **organique et illustré** — jamais géométrique pur.
Opacité globale : 0.15 à 0.32. Le texte prévaut toujours.

| Module | Fond | Pattern |
|--------|------|---------|
| Guide-moi ! | `#EDE0D4` | Feuilles tropicales, tiges souples — tons Latte |
| Préparer le coucher | `#E4EEF0` | Lune croissant, nuages doux, étoiles filantes — tons Rain |
| Prendre soin de moi | `#F5E4DE` | Fleurs botaniques, pétales courbés, tiges — tons Coral |
| Conseil de saison | `#DCE8E4` | Branches avec baies, herbes, feuilles — tons Eucalyptus |
| Partager & rassurer | `#E8EEF2` | Volutes, plumes, ondes douces, petits cœurs — tons Rain |
| Jeux & stimulation | `#EDE4D4` | Rubans souples, confettis organiques, ronds — tons Latte/Coral |

### Règle absolue patterns

Les patterns sont **illustrés et organiques** — courbes, feuilles, volutes, fleurs.
Jamais de formes purement géométriques (cercles concentriques seuls, grilles, triangles répétés).
Les SVG utilisent des `<path>` avec courbes de Bézier — pas uniquement des `<polygon>` ou `<circle>`.

### Statut design

✅ Palette validée (Cream / Peach / Coral / Latte / Rain / Eucalyptus)
✅ Typographie validée (Playfair Display pour les titres de modules)
✅ Cases modules validées (pattern organique + titre centré)
⏳ À affiner plus tard — design non bloquant pour la création de contenu

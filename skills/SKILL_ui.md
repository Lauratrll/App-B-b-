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
| Explication | `#EDE0D4` | `#7A5038` | `#C89878` (Latte) |
| Phrase d'ancrage | `#E8F0F2` | `#384E48` | `#8A9E98` (Eucalyptus) |
| Action immédiate | `#F5D0C8` | `#8A3020` | `#D4604A` (Coral) |
| Geste réflexo | `#E8F0F2` | `#486878` | `#C8D8DC` (Rain) |
| Action parent | `#D4E0DC` | `#384E48` | `#8A9E98` (Eucalyptus) |
| Conseil préventif | `#EDE0D4` | `#7A5038` | `#C89878` (Latte) |
| Erreurs à éviter | `#F5D0C8` | `#8A3020` | `#D4604A` (Coral) |
| Cadre de sécurité | `#E4DDD6` | `#5A4A40` | `#B4A89C` |

### Couleurs des modules (cases d'accueil)

| Module | Fond de case | Accent |
|--------|-------------|--------|
| 🧭 Guide-moi ! | `#EDE0D4` | `#C89878` |
| 🌙 Préparer le coucher | `#E8F0F2` | `#8A9E98` |
| 🌸 Prendre soin de moi | `#F5D0C8` | `#D4604A` |
| 🌿 Conseil de saison | `#D4E0DC` | `#8A9E98` |
| 💜 Partager & rassurer | `#E8F0F2` | `#C8D8DC` |
| 🎯 Jeux & stimulation | `#EDE0D4` | `#C89878` |

### Couleurs des pages de détail — Prendre soin de moi (familles A / B)

Les blocs des pages de détail (« Comment faire », « Si tu bloques », « À retenir »…) sont ré-ancrés sur les **teintes des cartes page 1** (les beiges quasi-blancs se noyaient dans le crème). Deux familles + un beige de clôture unifié :

| Rôle du bloc | Famille A — Auto-reconnaissance & Challenge | Famille B — Auto-massage, Méditation, Post-partum |
|---|---|---|
| Bloc principal | `#ECC8B3` | `#EABDB1` |
| Bloc secondaire / aide | `#F1D8C8` | `#F5D0C8` |
| Clôture (« À retenir » / « Pourquoi ça marche ») | `#F8DBC9` (beige Méditation) | `#F8DBC9` (beige Méditation) |

- **Beige `#F8DBC9` (carte Méditation) unifié** : tout bloc de clôture le porte, sur toutes les pages.
- **Labels de section** en brun chaud `#8A4030` (et non eucalyptus) sur ces fonds pêche, pour le contraste.
- **Post-partum** : ses 3 blocs neutres prennent la gamme B (Ce qui se passe `#EABDB1` / Côté maman `#F5D0C8` / Côté co-parent `#F8DBC9`), mais ses **cadres sémantiques restent inchangés** : Signaux en **gris** `#E4DDD6`, Urgence en **cadre rouge** (`#EDE9E4` / bord `#D4604A`, 3114 en gras `#8A3020`), Qui consulter en **gris clair** `#EFEBE6`.
- Carte « gabarit » d'auto-reconnaissance : fond papier `#FBF6F1` + filet `#E0CDBC`.

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

### Card protocole

```tsx
/* Exemple — action immédiate */
<div style={{
  background: '#F5D0C8',
  borderLeft: '3px solid #D4604A',
  borderRadius: '0 12px 12px 0',
  padding: '11px 13px',
  marginBottom: 6
}}>
  <div style={{fontSize: 9, fontWeight: 600, textTransform: 'uppercase',
               letterSpacing: '.07em', color: '#8A3020', marginBottom: 5}}>
    Action immédiate
  </div>
  {steps.map((step, i) => (
    <div key={i} style={{display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 4}}>
      <div style={{
        width: 17, height: 17, borderRadius: '50%', fontSize: 9, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 1,
        background: '#F5D0C8', color: '#8A3020',
        border: '0.5px solid #D4604A'
      }}>{i + 1}</div>
      <div style={{fontSize: 11, color: '#3A3228', lineHeight: 1.5}}>{step}</div>
    </div>
  ))}
</div>
```

### Phrase d'ancrage

```tsx
<div style={{
  background: '#E8F0F2',
  borderRadius: 8,
  padding: '9px 11px',
  fontSize: 11,
  color: '#384E48',
  fontStyle: 'italic',
  borderLeft: '2px solid #8A9E98',
  lineHeight: 1.6,
  marginBottom: 7
}}>
  {anchorText}
</div>
```

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

---

## Récapitulatif palette — référence rapide

```
Cream      #F2EDE8   → fond général
Peach      #F0B8A8   → topbar, accents
Coral      #D4604A   → action, CTA, urgence
Latte      #C89878   → explication, neutre
Rain       #C8D8DC   → réflexo, doux
Eucalyptus #8A9E98   → parent, nav, labels
```


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

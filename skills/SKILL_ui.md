# SKILL_ui.md — Design System & Composants UI

> Lire ce fichier avant de créer ou modifier tout composant visuel.
> Toutes les couleurs, typographies, espacements et composants sont définis ici.
> Ne jamais inventer une couleur ou un composant — les chercher ici d'abord.

---

## Contraintes de format

```
Format cible    : Mobile-first portrait
Largeur max app : 390px (iPhone standard)
Padding latéral : 16px (1rem)
Border radius   : 12px (cards), 8px (boutons), 6px (tags)
```

L'app est conçue pour être utilisée **d'une main, la nuit, avec un bébé dans l'autre bras.**
Cela impose :
- Boutons larges (min 44px de hauteur)
- Texte lisible sans zoom (min 11px, préférer 12–14px)
- Contrastes élevés (fond clair / texte foncé)
- Zones de tap généreuses (min 44×44px)

---

## Palette de couleurs

### Couleurs de fond

```css
--bg-app      : #EFF4F1  /* fond général de l'app */
--bg-card     : #FFFFFF  /* fond des cards */
--bg-section  : #E8EDE9  /* fond des sections (remplace les dividers) */
```

### Couleurs des modules (topbar et accents)

```css
/* Mois 0 — tons lavande/vert doux */
--mois0-gradient : linear-gradient(135deg, #E1F5EE, #EEEDFE)
--mois0-accent   : #AFA9EC

/* Mois 14+ — tons pêche/doré */
--mois14-gradient : linear-gradient(135deg, #FAEEDA, #FBEAF0)
--mois14-accent   : #EF9F27
```

### Couleurs des blocs de protocole

```css
/* Action immédiate */
--action-immediate-bg    : #FCEBEB
--action-immediate-text  : #A32D2D
--action-immediate-border: #E24B4A

/* Réflexologie / Geste doux */
--reflexo-bg    : #E1F5EE
--reflexo-text  : #085041
--reflexo-border: #1D9E75

/* Action parent */
--parent-bg    : #FBEAF0
--parent-text  : #72243E
--parent-border: #D4537E

/* Conseil préventif */
--preventif-bg    : #FAEEDA
--preventif-text  : #854F0B
--preventif-border: #BA7517

/* Cadre de sécurité */
--securite-bg    : #F1EFE8
--securite-text  : #444441
--securite-border: #888780

/* Explication (neutre) */
--explication-bg    : #FFFFFF
--explication-border: #EF9F27
--explication-label : #633806
```

### Couleurs des bordures de gauche (cards)

```css
--border-left-red    : 3px solid #E24B4A
--border-left-green  : 3px solid #1D9E75
--border-left-pink   : 3px solid #D4537E
--border-left-amber  : 3px solid #BA7517
--border-left-grey   : 3px solid #888780
--border-left-purple : 3px solid #7F77DD
--border-left-orange : 3px solid #EF9F27
```

### Couleurs de texte

```css
--text-primary   : #1A1916  /* titres, corps principal */
--text-secondary : #888780  /* sous-titres, métadonnées */
--text-tertiary  : #C5C3B9  /* séparateurs breadcrumb */
--text-link      : #534AB7  /* liens cliquables */
--text-brand     : #412402  /* texte sur fond brand */
```

### Couleurs d'interface

```css
--border-card    : 0.5px solid #D8D6CC
--border-input   : 0.5px solid #D8D6CC
--border-focus   : 1px solid #534AB7
```

---

## Typographie

```css
/* Police système — toujours en premier */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* Hiérarchie */
--text-xl   : 16px / font-weight 600  /* titre de page */
--text-lg   : 14px / font-weight 600  /* titre de section */
--text-md   : 13px / font-weight 500  /* titre de card */
--text-base : 12px / font-weight 400  /* corps principal */
--text-sm   : 11px / font-weight 400  /* contenu des protocoles */
--text-xs   : 10px / font-weight 400  /* métadonnées, labels */
--text-xxs  : 9px  / font-weight 700  /* labels uppercase */

/* Labels de section (uppercase) */
letter-spacing: 0.06em
text-transform: uppercase
font-size: 9px
font-weight: 700
```

---

## Composants de base

### TopBar (en-tête de page)

```tsx
// Utilisée sur toutes les pages de l'app
<div className="flex items-center gap-2 rounded-xl p-3 mb-3"
     style={{background: 'linear-gradient(135deg, #FAEEDA, #FBEAF0)'}}>
  <div className="w-8 h-8 rounded-full bg-[#EF9F27] flex items-center justify-content text-sm flex-shrink-0">
    👶
  </div>
  <div className="flex-1">
    <div className="text-xs font-semibold text-[#412402]">
      {babyName}
      <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded bg-[#FAEEDA]
                       text-[#633806] border border-[#EF9F27]">
        {babyMonth} mois · {season}
      </span>
    </div>
    <div className="text-[10px] text-[#633806] mt-0.5">{subtitle}</div>
  </div>
</div>
```

### BreadcrumbBar (fil d'Ariane)

```tsx
// Navigation retour — présente sur toutes les pages internes
<div className="flex items-center gap-1 mb-2 bg-white rounded-lg px-2 py-1 flex-wrap">
  {items.map((item, i) => (
    <React.Fragment key={i}>
      {i > 0 && <span className="text-[10px] text-[#C5C3B9]">›</span>}
      {i === items.length - 1
        ? <span className="text-[10px] font-medium text-[#1A1916]">{item.label}</span>
        : <button onClick={item.onClick}
                  className="text-[10px] text-[#534AB7] underline bg-transparent border-0">
            {item.label}
          </button>
      }
    </React.Fragment>
  ))}
</div>
```

### Card protocole (structure)

```tsx
<div className="bg-white border border-[#D8D6CC] rounded-xl p-3 mb-2"
     style={{borderLeft: '3px solid #E24B4A', borderRadius: '0 10px 10px 0'}}>
  <div className="text-[9px] font-bold uppercase tracking-wider text-[#A32D2D] mb-1">
    {labelText}
  </div>
  <div className="flex flex-col gap-1 mt-1">
    {steps.map((step, i) => (
      <div key={i} className="flex gap-1.5 items-start">
        <div className="w-4 h-4 rounded-full flex items-center justify-center
                        text-[9px] font-bold flex-shrink-0 mt-0.5"
             style={{background: '#FCEBEB', color: '#A32D2D'}}>
          {i + 1}
        </div>
        <div className="text-[11px] text-[#1A1916] leading-snug">{step}</div>
      </div>
    ))}
  </div>
</div>
```

### Phrase d'ancrage

```tsx
<div className="rounded-lg p-3 mb-2 text-[11px] italic leading-relaxed"
     style={{
       background: '#EEEDFE',
       color: '#26215C',
       borderLeft: '2px solid #AFA9EC'
     }}>
  {anchorText}
</div>
```

### Boutons

```tsx
// Bouton retour (petit, neutre)
<button className="text-[10px] text-[#888780] bg-white border border-[#D8D6CC]
                   rounded-md px-2 py-1 cursor-pointer">
  ← Retour
</button>

// Bouton épingler (violet doux)
<button className="text-[10px] text-[#534AB7] bg-[#EEEDFE] border-0
                   rounded-md px-2 py-1 cursor-pointer">
  ☆ Épingler
</button>

// Bouton rapide (vert doux)
<button className="text-[10px] text-[#085041] bg-[#E1F5EE] border-0
                   rounded-md px-2 py-1 cursor-pointer">
  ⚡ Rapide
</button>

// Bouton primaire (action principale)
<button className="w-full py-3 bg-[#534AB7] text-white text-sm font-semibold
                   rounded-xl border-0 cursor-pointer">
  {label}
</button>

// Bouton catégorie (grille 2 colonnes)
<button className="p-2 rounded-xl border border-[#D8D6CC] bg-white
                   cursor-pointer text-left hover:bg-[#EEEDFE]
                   hover:border-[#AFA9EC]">
  <div className="text-[11px] font-semibold text-[#1A1916]">{name}</div>
  <div className="text-[9px] text-[#888780] mt-0.5">{subtitle}</div>
</button>

// Bouton situation (pleine largeur)
<button className="w-full px-2.5 py-2 rounded-lg border border-[#D8D6CC]
                   bg-white cursor-pointer text-left text-[11px]
                   text-[#1A1916] mb-1.5 block
                   hover:bg-[#EEEDFE] hover:border-[#AFA9EC]">
  {situationText}
</button>
```

### Grille de catégories

```tsx
<div className="grid grid-cols-2 gap-1.5 mb-2">
  {categories.map(cat => (
    <CategoryButton key={cat.id} {...cat} />
  ))}
</div>
```

### Tag badge

```tsx
// Tag de module (dans la topbar)
<span className="text-[9px] px-1.5 py-0.5 rounded bg-[#EEEDFE]
                 text-[#3C3489] border border-[#AFA9EC] ml-1">
  {tagText}
</span>

// Tag de catégorie (dans les jeux/stimulation)
<span className="inline-block text-[9px] px-1.5 py-0.5 rounded
                 font-semibold mr-1 mb-1 bg-[#EEEDFE] text-[#534AB7]">
  {tagText}
</span>
```

### Message d'état vide

```tsx
<div className="text-center py-8 text-[#888780]">
  <div className="text-2xl mb-2">☆</div>
  <div className="text-sm font-medium text-[#1A1916] mb-1">
    Aucun protocole épinglé
  </div>
  <div className="text-[11px] leading-relaxed">
    Explore le Guide-moi ! et épingle les protocoles que tu utilises souvent.
  </div>
</div>
```

### Alerte / avertissement

```tsx
// Avertissement médical (fond ambre)
<div className="rounded-xl p-3 mb-2 text-[11px] leading-relaxed"
     style={{background: '#FAEEDA', color: '#633806'}}>
  {warningText}
</div>

// Alerte urgence (fond rouge doux)
<div className="rounded-xl p-3 mb-2 text-[11px] leading-relaxed
                border border-[#F09595]"
     style={{background: '#FCEBEB', color: '#A32D2D'}}>
  {urgencyText}
</div>

// Astuce (fond violet doux)
<div className="rounded-xl p-3 mb-2 text-[11px] leading-relaxed"
     style={{background: '#EEEDFE', color: '#26215C'}}>
  {tipText}
</div>
```

---

## Navigation principale (onglets fixes)

```tsx
// 5 onglets fixes en bas de l'écran
const NAV_TABS = [
  { id: 'home',    icon: '🏠', label: 'Accueil',    href: '/dashboard' },
  { id: 'pinned',  icon: '📌', label: 'Épinglés',   href: '/epingles' },
  { id: 'profile', icon: '👶', label: 'Profil',     href: '/profil' },
  { id: 'plan',    icon: '💳', label: 'Abonnement', href: '/abonnement' },
  { id: 'account', icon: '👤', label: 'Mon compte', href: '/compte' },
]

<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D8D6CC]
                flex justify-around items-center py-2 px-4 z-50">
  {NAV_TABS.map(tab => (
    <Link key={tab.id} href={tab.href}
          className="flex flex-col items-center gap-0.5 text-center min-w-[44px]">
      <span className="text-lg">{tab.icon}</span>
      <span className={`text-[9px] ${isActive ? 'text-[#534AB7] font-semibold' : 'text-[#888780]'}`}>
        {tab.label}
      </span>
    </Link>
  ))}
</nav>
```

---

## Page d'accueil (Dashboard)

Structure de la page principale après connexion :

```
TopBar (prénom bébé + âge + saison)
↓
Card "Mois X" (progression + mois suivant)
↓
6 modules en grille ou liste
↓
Card "Protocole épinglé en accès rapide" (dernier épinglé)
↓
Navigation fixe (5 onglets)
```

---

## Animations et transitions

```css
/* Transitions douces — systématiques */
transition: all 0.15s ease;

/* Hover sur les cards */
hover:scale-[1.01]
hover:shadow-sm

/* Apparition des protocoles */
animate-in: fade-in slide-in-from-bottom-2 duration-200
```

---

## Accessibilité

- Toutes les images ont un `alt`
- Tous les boutons icônes ont un `aria-label`
- Contraste minimum 4.5:1 sur tous les textes
- Focus visible sur tous les éléments interactifs
- Pas de contenu uniquement par couleur (icône + couleur systématiquement)

---

## Règles absolues UI

1. **Jamais de largeur fixe > 390px** sur les éléments de contenu
2. **Toujours un padding-bottom de 80px** sur les pages avec nav fixe (éviter le chevauchement)
3. **Toujours border-radius de 0 sur le côté gauche** des cards avec bordure colorée à gauche
4. **Les boutons de retour** sont toujours présents sur toutes les pages internes
5. **Le fil d'Ariane** est toujours cliquable sur tous les niveaux sauf le dernier
6. **Pas de scroll horizontal** — jamais déborder du viewport
7. **Toujours tester** sur une fenêtre de 390px de large avant de valider un composant

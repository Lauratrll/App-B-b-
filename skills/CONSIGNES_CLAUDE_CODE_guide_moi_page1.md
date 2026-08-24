# CONSIGNES CLAUDE CODE — Page 1 Guide-moi !

> **Slot 5 (vert) poudré le 24/08/2026** — demande de Laura : il ressortait un peu plus que ses voisins. Intensité 0,068 → 0,053, teinte et clarté inchangées ; le camaïeu suit le même facteur. Les valeurs ci-dessous sont déjà à jour.

**Statut : VALIDÉ V10 — design figé, ne pas modifier sans validation explicite de la fondatrice.**

Cette fiche est autoportée : elle contient tout le nécessaire pour implémenter la page d'accueil "Guide-moi !" sans avoir à interpréter d'autres documents.

---

## 1. Contexte fonctionnel

La page "Guide-moi !" est la page d'entrée du module principal de l'app. Elle présente les 8 catégories d'inconfort/situation, chacune menant vers une page "situations" qui liste les 4 protocoles disponibles pour le mois en cours.

L'utilisatrice (jeune maman) y arrive depuis le dashboard quand elle veut savoir quoi faire face à un comportement de son bébé. La page doit :

- Tenir intégralement sur un écran de téléphone standard (pas de scroll)
- Être lisible et tappable d'une main, la nuit, bébé dans l'autre bras
- Présenter les 8 catégories par ordre chromatique du chaud au frais (sémantique : du corporel/intense vers le global/calme)

---

## 2. Stack et hypothèses

- Framework : **React** (Next.js ou Vite — composant fonctionnel)
- Style : **inline styles** (cohérence avec les autres pages déjà produites)
- Pas de librairie d'icônes — **tous les pictos sont en SVG inline** dans le composant
- Police titre : **Playfair Display** (Google Fonts)

Si le projet n'a pas encore Playfair Display chargée, ajouter dans `_app.tsx`, `layout.tsx` ou équivalent :

```tsx
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap"
  rel="stylesheet"
/>
```

---

## 3. Données — Configuration des 8 catégories

```ts
// types/category.ts
export type CategoryKey =
  | 'pleurs'
  | 'alim'
  | 'sommeil'
  | 'corps'
  | 'stimu'
  | 'sepa'
  | 'sante'
  | 'parent';

export interface Category {
  key: CategoryKey;
  name: string;
  bg: string;             // couleur de fond de la case
  avatarBg: string;       // couleur du cercle qui contient le picto
}

export const CATEGORIES: Category[] = [
  { key: 'pleurs',  name: 'Pleurs & inconfort',  bg: '#F0B8A8', avatarBg: 'rgba(255,255,255,.40)' },
  { key: 'alim',    name: 'Alimentation',        bg: '#F5D0C8', avatarBg: 'rgba(255,255,255,.50)' },
  { key: 'sommeil', name: 'Sommeil',             bg: '#F8DBC9', avatarBg: 'rgba(255,255,255,.55)' },
  { key: 'corps',   name: 'Corps & soins',       bg: '#EDE0D4', avatarBg: 'rgba(255,255,255,.55)' },
  { key: 'stimu',   name: 'Sur-stimulation',     bg: '#BECEA9', avatarBg: 'rgba(255,255,255,.45)' },
  { key: 'sepa',    name: 'Lien & attachement',  bg: '#B0C0AC', avatarBg: 'rgba(255,255,255,.45)' },
  { key: 'sante',   name: 'Santé',               bg: '#C8D8DC', avatarBg: 'rgba(255,255,255,.50)' },
  { key: 'parent',  name: 'Parent dépassé',      bg: '#E8F0F2', avatarBg: 'rgba(255,255,255,.60)' },
];
```

> ⚠️ **L'ordre des catégories ne doit pas être modifié.** Il définit le dégradé chromatique validé.
> ⚠️ Les `key` correspondent aux clés utilisées dans les fichiers JSON `01_protocoles.json` (champ `categorie`). Ne pas renommer.

---

## 4. Composant complet — `<GuideMoiPage />`

```tsx
// pages/guide-moi/index.tsx
import React from 'react';

interface Props {
  babyName: string;        // ex: "Léa"
  babyMonth: number;       // ex: 2
  season: string;          // ex: "Printemps"
  monthAdjective: string;  // ex: "Le Communicant"
  onSelectCategory: (key: CategoryKey) => void;
  onBack?: () => void;
}

export const GuideMoiPage: React.FC<Props> = ({
  babyName,
  babyMonth,
  season,
  monthAdjective,
  onSelectCategory,
}) => {
  return (
    <div style={{
      background: '#F2EDE8',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    }}>

      {/* TOPBAR */}
      <TopBar
        babyName={babyName}
        babyMonth={babyMonth}
        season={season}
        monthAdjective={monthAdjective}
      />

      {/* CONTENU */}
      <div style={{padding: '0 16px', flex: 1, display: 'flex', flexDirection: 'column'}}>

        {/* TITRE ÉDITORIAL CENTRÉ */}
        <div style={{padding: '28px 0 24px', textAlign: 'center'}}>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontSize: 26,
            color: '#3A3228',
            letterSpacing: '-.015em',
            margin: '0 0 8px 0',
            lineHeight: 1.1,
          }}>Guide-moi !</h1>
          <div style={{
            fontSize: 9,
            color: '#8A9E98',
            letterSpacing: '.07em',
            textTransform: 'uppercase',
            fontWeight: 600,
            lineHeight: 1.4,
          }}>
            Mais n'oublie jamais que chaque bébé est unique.
          </div>
        </div>

        {/* 8 CASES — 75% LARGEUR CENTRÉES */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          alignItems: 'center',
        }}>
          {CATEGORIES.map(cat => (
            <CategoryButton
              key={cat.key}
              category={cat}
              onClick={() => onSelectCategory(cat.key)}
            />
          ))}
        </div>

        {/* ESPACEMENT BAS + MENTION PRÉVENTIVE */}
        <div style={{flex: 1, minHeight: 24}} />
        <div style={{
          padding: '0 4px 36px',
          fontSize: 9,
          color: '#8A9E98',
          lineHeight: 1.4,
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          En cas de doute médical, contacte le 15 ou ton pédiatre.
        </div>

      </div>
    </div>
  );
};
```

---

## 5. Sous-composants

### 5.1 `<TopBar />`

```tsx
const TopBar: React.FC<{
  babyName: string;
  babyMonth: number;
  season: string;
  monthAdjective: string;
}> = ({babyName, babyMonth, season, monthAdjective}) => (
  <div style={{
    background: '#F2EDE8',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderBottom: '.5px solid #E4DDD6',
    flexShrink: 0,
  }}>
    {/* Avatar bébé */}
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: '#D4604A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
           stroke="#F2EDE8" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="9" r="4"/>
        <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/>
      </svg>
    </div>
    {/* Infos */}
    <div style={{flex: 1}}>
      <div style={{
        fontSize: 13, fontWeight: 500, color: '#3A3228',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        {babyName}
        <span style={{
          fontSize: 9, padding: '2px 7px', borderRadius: 4,
          background: '#F2EDE8', color: '#3A3228',
          border: '.5px solid #C8806A',
        }}>{babyMonth} mois · {season}</span>
      </div>
      <div style={{fontSize: 10, color: '#8A9E98', marginTop: 2}}>{monthAdjective}</div>
    </div>
  </div>
);
```

### 5.2 `<CategoryButton />`

```tsx
const CategoryButton: React.FC<{
  category: Category;
  onClick: () => void;
}> = ({category, onClick}) => (
  <button
    onClick={onClick}
    style={{
      background: category.bg,
      border: 'none',
      borderRadius: 11,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '9px 14px',
      textAlign: 'left',
      width: '75%',
    }}
  >
    <div style={{
      width: 26, height: 26, borderRadius: '50%',
      background: category.avatarBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <CategoryIcon categoryKey={category.key} />
    </div>
    <div style={{
      flex: 1,
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 600,
      fontSize: 14,
      color: '#3A3228',
      letterSpacing: '-.01em',
    }}>{category.name}</div>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="#3A3228" strokeWidth="1.7" strokeLinecap="round">
      <path d="M9 6l6 6-6 6"/>
    </svg>
  </button>
);
```

### 5.3 `<CategoryIcon />` — pictos SVG inline

```tsx
const CategoryIcon: React.FC<{categoryKey: CategoryKey}> = ({categoryKey}) => {
  const common = {
    fill: 'none' as const,
    stroke: '#3A3228',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (categoryKey) {

    case 'pleurs':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="9"/>
          <path d="M8 16c1-1.5 2.5-2.2 4-2.2s3 .7 4 2.2"/>
          <circle cx="9" cy="10" r=".9" fill="#3A3228"/>
          <circle cx="15" cy="10" r=".9" fill="#3A3228"/>
          <path d="M9 17.5l-.3 1.5M15 17.5l.3 1.5"/>
        </svg>
      );

    case 'alim':
      // Biberon : tétine cloche + col + corps + 2 graduations
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" {...common} strokeWidth={1.5}>
          <path d="M10 4c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v1.5c.8.3 1.5.9 1.5 1.8H8.5c0-.9.7-1.5 1.5-1.8V4z"/>
          <path d="M8.5 7.3v1.4h7V7.3"/>
          <path d="M8.5 8.7c-.2.6-.5 1.2-.5 1.8v8c0 1.4 1.1 2.5 2.5 2.5h3c1.4 0 2.5-1.1 2.5-2.5v-8c0-.6-.3-1.2-.5-1.8"/>
          <path d="M9 13h2M9 16h2"/>
        </svg>
      );

    case 'sommeil':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" {...common}>
          <path d="M17 13a6 6 0 11-7-7 4.5 4.5 0 007 7z"/>
        </svg>
      );

    case 'corps':
      // Main : 5 doigts séparés (pouce écarté + 4 doigts)
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" {...common} strokeWidth={1.4}>
          <path d="M7.5 13.5L5.5 12c-.6-.5-1.5-.2-1.5.7v.3c0 .6.3 1.2.8 1.6L7 16"/>
          <path d="M8.2 13V5.2c0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2V12"/>
          <path d="M10.6 12V4c0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2v8"/>
          <path d="M13 12V4.5c0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2V12"/>
          <path d="M15.4 12V6c0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2v7"/>
          <path d="M7.5 13.5c0 4 2.5 7.5 6 7.5h0c2.5 0 4.3-1.8 4.3-4.3V13"/>
        </svg>
      );

    case 'stimu':
      // Soleil rayonnant
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>
        </svg>
      );

    case 'sepa':
      // Cœur
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" {...common}>
          <path d="M12 20s-7-4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 6-7 10-7 10z"/>
        </svg>
      );

    case 'sante':
      // Croix médicale dans cercle
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" {...common}>
          <path d="M12 8v8M8 12h8"/>
          <circle cx="12" cy="12" r="9"/>
        </svg>
      );

    case 'parent':
      // Éclair
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" {...common}>
          <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>
        </svg>
      );
  }
};
```

---

## 6. Routage — pages connectées

Au clic sur une case, naviguer vers la page "Liste des situations" de la catégorie sélectionnée, en passant la `key` :

```ts
// Exemple Next.js App Router
const router = useRouter();
const handleSelect = (key: CategoryKey) => {
  router.push(`/guide-moi/${key}`);
};
```

Sur la page `[category]`, lire le fichier `mois_${babyMonth.toString().padStart(2, '0')}_-_01_protocoles.json` et filtrer les 4 protocoles dont `categorie === key`.

---

## 7. Tests visuels obligatoires

Avant validation de l'intégration, vérifier sur **iPhone 13/14 (390×844) et iPhone SE (375×667)** :

- [ ] Aucun scroll vertical sur iPhone 13 standard
- [ ] Sur iPhone SE, scroll très léger acceptable mais les 8 cases doivent rester visibles à 90% au premier coup d'œil
- [ ] Toutes les cases ont exactement 75% de largeur, parfaitement centrées
- [ ] Le titre "Guide-moi !" est centré horizontalement
- [ ] La phrase "Mais n'oublie jamais..." est centrée et lisible mais discrète (9px, gris Eucalyptus)
- [ ] La TopBar a bien le même fond que la page (`#F2EDE8`) — pas de bandeau pêche
- [ ] Tous les noms de catégories sont en Playfair Display, noir `#3A3228`
- [ ] Le picto biberon est identifiable (tétine + corps + graduations)
- [ ] Le picto main montre 5 doigts séparés
- [ ] L'ordre chromatique correspond exactement à la table section 3
- [ ] La mention "En cas de doute médical..." est en bas, 9px, italique, discrète

---

## 8. Points de vigilance

- **Ne PAS ajouter** de border, shadow, ou outline sur le conteneur de page : la page doit être edge-to-edge sans cadre décoratif.
- **Ne PAS centrer le texte dans les cases** : le texte du nom de catégorie reste aligné à gauche après l'avatar (le `flex: 1` et `text-align: left` du `<button>` s'en chargent).
- **Ne PAS utiliser de fonte ou poids différents** pour le nom de catégorie : c'est Playfair Display 600 / 14px / `#3A3228` partout.
- **Ne PAS modifier les fonds des cases** : les hex sont validés et doivent être copiés tels quels.
- **Pas d'animation au hover/active** sur cette V10 — la page est volontairement statique. Si une animation est ajoutée plus tard, elle devra être validée séparément.

---

## 9. Fichiers de données liés

Le composant ne lit aucun fichier JSON directement (la page 1 est purement statique). Les fichiers JSON `mois_XX_-_01_protocoles.json` sont consommés par la page suivante (liste des situations par catégorie), pas par celle-ci.

---

## 10. Version

- **V10** — design figé le 28 mai 2026
- **Modifs autorisées sans nouvelle validation** : aucune
- **Validation requise pour** : changement de couleur, d'ordre, de typographie, de structure, de picto
- **Référence design** : conversation Claude "M2 protocoles + design Page 1"

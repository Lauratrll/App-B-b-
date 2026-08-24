# CONSIGNES CLAUDE CODE — Page 2 Situations

> **Slot 5 (vert) poudré le 24/08/2026** — demande de Laura : il ressortait un peu plus que ses voisins. Intensité 0,068 → 0,053, teinte et clarté inchangées ; le camaïeu suit le même facteur. Les valeurs ci-dessous sont déjà à jour.

**Statut : VALIDÉ V2 — design figé, ne pas modifier sans validation explicite de la fondatrice.**

Cette fiche est autoportée : elle contient tout le nécessaire pour implémenter la page "Situations" (liste des 4 situations d'une catégorie) sans avoir à interpréter d'autres documents.

---

## 1. Contexte fonctionnel

La page "Situations" s'affiche quand l'utilisatrice clique sur l'une des 8 catégories de la page 1 "Guide-moi !". Elle présente les 4 situations différenciées disponibles pour le mois en cours, dans la catégorie sélectionnée. Au clic sur une case, on bascule vers la page 3 (détail du protocole).

Comme la page 1, elle doit tenir intégralement sur un écran de téléphone standard, sans scroll.

---

## 2. Stack et hypothèses

- Framework : **React** (Next.js ou Vite — composant fonctionnel)
- Style : **inline styles**
- Lecture du JSON : le fichier `mois_${babyMonth.toString().padStart(2, '0')}_-_01_protocoles.json` est chargé côté client ou via fetch
- Police titre : **Playfair Display** (déjà chargée via Google Fonts dans la page 1)
- Hook React pour la détection du wrap : `useEffect` + `useRef` + `useState`

---

## 3. Source de données — Structure du JSON

```json
{
  "categorie": "sommeil",
  "situation": "RÉVEILS RAPPROCHÉS / malgré un bon début de nuit",
  "titre": "Réveils rapprochés en deuxième partie de nuit",
  ...
}
```

Le composant filtre les 32 entrées par `categorie === selectedKey` pour obtenir les 4 situations à afficher.

---

## 4. Convention de parsing du champ `situation`

Le libellé contient toujours un séparateur ` / ` (espace + slash + espace) :

```ts
function parseSituation(situation: string): {firstPart: string; secondPart: string} {
  const parts = situation.split(' / ');
  if (parts.length >= 2) {
    return {
      firstPart: parts[0].trim(),
      secondPart: parts.slice(1).join(' / ').trim(),
    };
  }
  // Fallback : pas de séparateur — tout en majuscules sans saut
  return {firstPart: situation, secondPart: ''};
}
```

---

## 5. Camaïeux et métadonnées des 8 catégories

```ts
// data/categories-page2.ts
export type CategoryKey =
  | 'pleurs' | 'alim' | 'sommeil' | 'corps'
  | 'stimu' | 'sepa' | 'sante' | 'parent';

/** Nom affichable de la catégorie */
export const CATEGORY_NAMES: Record<CategoryKey, string> = {
  pleurs:  'Pleurs & inconfort',
  alim:    'Alimentation',
  sommeil: 'Sommeil',
  corps:   'Corps & soins',
  stimu:   'Sur-stimulation',
  sepa:    'Lien & attachement',
  sante:   'Santé',
  parent:  'Parent dépassé',
};

/** Couleur de la catégorie sur la page 1 — utilisée pour le trait du picto */
export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  pleurs:  '#F0B8A8',
  alim:    '#F5D0C8',
  sommeil: '#F8DBC9',
  corps:   '#EDE0D4',
  stimu:   '#BECEA9',
  sepa:    '#B0C0AC',
  sante:   '#C8D8DC',
  parent:  '#E8F0F2',
};

/** 4 nuances ordonnées pour les 4 cases (slot 0 → slot 3) */
export const CAMAIEUX: Record<CategoryKey, [string, string, string, string]> = {
  pleurs:  ['#E4A894', '#F1D5CB', '#DB9C86', '#F0B8A8'],
  alim:    ['#EABDB1', '#F3DFD9', '#E3AFA0', '#F5D0C8'],
  sommeil: ['#EEC7B0', '#F4E4DA', '#E7B99F', '#F8DBC9'],
  corps:   ['#E0CFBE', '#EFE7DF', '#D7C3AE', '#EDE0D4'],
  stimu:   ['#A9BE93', '#DADECC', '#9AB283', '#BECEA9'],
  sepa:    ['#9CB098', '#D4D8CD', '#8EA48A', '#B0C0AC'],
  sante:   ['#B2C6CC', '#DFE3E2', '#A2B9C0', '#C8D8DC'],
  parent:  ['#D0DEE1', '#EDEEEC', '#BFD1D5', '#E8F0F2'],
};
```

⚠️ **L'ordre des nuances dans le tableau n'est PAS un dégradé.** C'est l'ordre `[slot 1, slot 2, slot 3, slot 4]` à appliquer aux 4 cases telles qu'elles apparaissent dans le JSON. Ne pas trier.

---

## 6. Pictos SVG par catégorie (paths)

Réutilisable depuis la page 1. Les paths à utiliser pour le picto 32px au-dessus du titre :

```tsx
const CATEGORY_ICONS: Record<CategoryKey, React.ReactNode> = {
  pleurs: (
    <>
      <circle cx="12" cy="12" r="9"/>
      <path d="M8 16c1-1.5 2.5-2.2 4-2.2s3 .7 4 2.2"/>
      <circle cx="9" cy="10" r=".9" fill="currentColor"/>
      <circle cx="15" cy="10" r=".9" fill="currentColor"/>
      <path d="M9 17.5l-.3 1.5M15 17.5l.3 1.5"/>
    </>
  ),
  alim: (
    <>
      <path d="M10 4c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v1.5c.8.3 1.5.9 1.5 1.8H8.5c0-.9.7-1.5 1.5-1.8V4z"/>
      <path d="M8.5 7.3v1.4h7V7.3"/>
      <path d="M8.5 8.7c-.2.6-.5 1.2-.5 1.8v8c0 1.4 1.1 2.5 2.5 2.5h3c1.4 0 2.5-1.1 2.5-2.5v-8c0-.6-.3-1.2-.5-1.8"/>
      <path d="M9 13h2M9 16h2"/>
    </>
  ),
  sommeil: <path d="M17 13a6 6 0 11-7-7 4.5 4.5 0 007 7z"/>,
  corps: (
    <>
      <path d="M7.5 13.5L5.5 12c-.6-.5-1.5-.2-1.5.7v.3c0 .6.3 1.2.8 1.6L7 16"/>
      <path d="M8.2 13V5.2c0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2V12"/>
      <path d="M10.6 12V4c0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2v8"/>
      <path d="M13 12V4.5c0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2V12"/>
      <path d="M15.4 12V6c0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2v7"/>
      <path d="M7.5 13.5c0 4 2.5 7.5 6 7.5h0c2.5 0 4.3-1.8 4.3-4.3V13"/>
    </>
  ),
  stimu: (
    <>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>
    </>
  ),
  sepa: <path d="M12 20s-7-4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 6-7 10-7 10z"/>,
  sante: (
    <>
      <path d="M12 8v8M8 12h8"/>
      <circle cx="12" cy="12" r="9"/>
    </>
  ),
  parent: <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>,
};
```

---

## 7. Composant complet `<SituationsPage />`

```tsx
// pages/guide-moi/[category]/index.tsx
import React, {useEffect, useRef, useState} from 'react';
import {
  CAMAIEUX, CATEGORY_NAMES, CATEGORY_COLORS, CategoryKey,
} from '@/data/categories-page2';

interface Protocole {
  categorie: CategoryKey;
  situation: string;
  // ... autres champs non utilisés ici
}

interface Props {
  babyName: string;
  babyMonth: number;
  season: string;
  monthAdjective: string;
  category: CategoryKey;
  protocoles: Protocole[];
  onSelectSituation: (protocole: Protocole) => void;
  onBack: () => void;
}

export const SituationsPage: React.FC<Props> = ({
  babyName, babyMonth, season, monthAdjective,
  category, protocoles, onSelectSituation, onBack,
}) => {
  const situations = protocoles.filter(p => p.categorie === category);
  const camaieu = CAMAIEUX[category];
  const categoryName = CATEGORY_NAMES[category];
  const categoryColor = CATEGORY_COLORS[category];

  return (
    <div style={{
      background: '#F2EDE8',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    }}>

      <TopBar
        babyName={babyName}
        babyMonth={babyMonth}
        season={season}
        monthAdjective={monthAdjective}
      />

      {/* Breadcrumb retour */}
      <div style={{padding: '14px 16px 0', flexShrink: 0}}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4, padding: 0,
          color: '#8A9E98', fontSize: 11,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="#8A9E98" strokeWidth="1.8" strokeLinecap="round">
            <path d="M15 6l-6 6 6 6"/>
          </svg>
          <span>Guide-moi !</span>
        </button>
      </div>

      {/* Bloc principal centré, ratio 3/7 */}
      <div style={{padding: '0 16px', flex: 1, display: 'flex', flexDirection: 'column'}}>

        <div style={{flex: 3, minHeight: 24}} />

        {/* Bloc titre : picto au-dessus + nom catégorie + sous-titre */}
        <div style={{textAlign: 'center', marginBottom: 32}}>
          <CategoryPictogram categoryKey={category} color={categoryColor} />
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontSize: 26,
            color: '#3A3228',
            letterSpacing: '-.015em',
            margin: '0 0 8px 0',
            lineHeight: 1.1,
          }}>{categoryName}</h1>
          <div style={{
            fontSize: 9,
            color: '#8A9E98',
            letterSpacing: '.07em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Dans quelles situations ?
          </div>
        </div>

        {/* 4 cases — camaïeu en ordre alterné */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 11,
          alignItems: 'center',
        }}>
          {situations.map((proto, i) => (
            <SituationButton
              key={proto.situation}
              situation={proto.situation}
              bgColor={camaieu[i]}
              onClick={() => onSelectSituation(proto)}
            />
          ))}
        </div>

        <div style={{flex: 7, minHeight: 32}} />
      </div>

      <div style={{
        padding: '0 4px 36px',
        fontSize: 9,
        color: '#8A9E98',
        lineHeight: 1.4,
        textAlign: 'center',
        fontStyle: 'italic',
        flexShrink: 0,
      }}>
        En cas de doute médical, contacte le 15 ou ton pédiatre.
      </div>
    </div>
  );
};
```

---

## 8. Sous-composant `<CategoryPictogram />` — picto au-dessus du titre

```tsx
const CategoryPictogram: React.FC<{
  categoryKey: CategoryKey;
  color: string;
}> = ({categoryKey, color}) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
       stroke={color} strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round"
       style={{display: 'block', margin: '0 auto 10px'}}>
    {CATEGORY_ICONS[categoryKey]}
  </svg>
);
```

**Note** : sur les catégories à couleur très pâle (Sommeil, Parent dépassé), le picto est volontairement subtil. C'est cohérent avec l'esprit doux de ces rubriques.

---

## 9. Sous-composant `<SituationButton />` avec saut conditionnel

C'est le composant le plus subtil de la page. Il applique la règle suivante :
- **Par défaut** : ligne 1 et ligne 2 dans deux blocs empilés (saut de ligne visuel)
- **Si la ligne 1 wrap sur 2 lignes ou +** : ligne 2 enchaînée en flux continu inline (pas de saut artificiel supplémentaire)

```tsx
const SITUATION_STYLES = {
  first: {
    fontSize: 12,
    color: '#3A3228',
    letterSpacing: '.06em',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    lineHeight: 'normal' as const,
  },
  second: {
    fontSize: 14,
    color: '#3A3228',
    fontWeight: 400,
    fontStyle: 'italic' as const,
    lineHeight: 'normal' as const,
  },
};

const SituationButton: React.FC<{
  situation: string;
  bgColor: string;
  onClick: () => void;
}> = ({situation, bgColor, onClick}) => {
  const {firstPart, secondPart} = parseSituation(situation);
  const probeRef = useRef<HTMLDivElement>(null);
  const [firstWraps, setFirstWraps] = useState(false);

  useEffect(() => {
    if (!probeRef.current) return;
    const el = probeRef.current;
    const cs = window.getComputedStyle(el);
    const fontSize = parseFloat(cs.fontSize);
    const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.2;
    // Détecte si la hauteur dépasse une ligne et demie
    setFirstWraps(el.offsetHeight > lineHeight * 1.5);
  }, [firstPart]);

  return (
    <button onClick={onClick} style={{
      background: bgColor,
      border: 'none',
      borderRadius: 12,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 18px',
      textAlign: 'left',
      width: '78%',
    }}>
      <div style={{flex: 1, color: '#3A3228'}}>
        {/* Probe invisible : mesure la hauteur réelle de la ligne 1 seule */}
        <div ref={probeRef} style={{
          ...SITUATION_STYLES.first,
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          width: 'inherit',
        }}>
          {firstPart} /
        </div>

        {/* Rendu final */}
        {!secondPart ? (
          // Pas de seconde partie : tout en capitales
          <div style={SITUATION_STYLES.first}>{firstPart}</div>
        ) : firstWraps ? (
          // Ligne 1 wrap : on enchaîne en flux continu inline
          <div>
            <span style={SITUATION_STYLES.first}>{firstPart} / </span>
            <span style={SITUATION_STYLES.second}>{secondPart}</span>
          </div>
        ) : (
          // Cas standard : deux blocs empilés, saut de ligne visuel
          <>
            <div style={SITUATION_STYLES.first}>{firstPart} /</div>
            <div style={{...SITUATION_STYLES.second, marginTop: 2}}>{secondPart}</div>
          </>
        )}
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="#3A3228" strokeWidth="1.7" strokeLinecap="round"
           style={{flexShrink: 0}}>
        <path d="M9 6l6 6-6 6"/>
      </svg>
    </button>
  );
};

function parseSituation(situation: string): {firstPart: string; secondPart: string} {
  const parts = situation.split(' / ');
  if (parts.length >= 2) {
    return {
      firstPart: parts[0].trim(),
      secondPart: parts.slice(1).join(' / ').trim(),
    };
  }
  return {firstPart: situation, secondPart: ''};
}
```

**Note technique sur le probe** : pour mesurer correctement le wrap, le probe doit hériter de la même largeur que le bloc final. La technique `position: absolute; visibility: hidden; width: inherit;` fonctionne dans la plupart des cas. Si le wrap n'est pas correctement détecté en pratique, alternative : utiliser `ResizeObserver` ou faire un mount-test au montage du composant.

---

## 10. Réutilisation du `<TopBar />` de la page 1

Importer le sous-composant déjà documenté dans `CONSIGNES_CLAUDE_CODE_page1_guide_moi.md` section 5.1.

---

## 11. Routage

```ts
// app/guide-moi/[category]/page.tsx
const VALID_CATEGORIES: CategoryKey[] = [
  'pleurs','alim','sommeil','corps','stimu','sepa','sante','parent',
];

export default function Page({params}: {params: {category: string}}) {
  if (!VALID_CATEGORIES.includes(params.category as CategoryKey)) {
    notFound();
  }
  // Charger les protocoles du mois courant et rendre <SituationsPage />
}
```

---

## 12. Tests visuels obligatoires

Sur **iPhone 13/14 (390×844)** et **iPhone SE (375×667)** :

- [ ] Aucun scroll vertical sur iPhone 13 standard
- [ ] Le bloc {picto + titre + sous-titre + 4 cases} est positionné dans le tiers supérieur
- [ ] Le picto catégorie (32px) est centré au-dessus du titre, trait dans la couleur de la catégorie page 1
- [ ] Le titre catégorie reste parfaitement centré (le picto ne le décale pas)
- [ ] Les 4 cases ont 78% de largeur, centrées
- [ ] Pour les situations courtes (ligne 1 sur 1 ligne) : ligne 2 en italique apparaît **dessous** avec un saut visuel
- [ ] Pour les situations longues (ligne 1 wrap sur 2 lignes) : ligne 2 en italique enchaîne **dans le flux**, sans saut artificiel
- [ ] Le slash `/` est en noir, intégré à la ligne capitales
- [ ] Les 4 nuances de camaïeu respectent l'ordre alterné `[3, 1, 4, 2]`
- [ ] L'interlignage est naturel (line-height: normal) — pas serré, pas étiré

---

## 13. Points de vigilance

- **Le saut conditionnel est crucial** : sans ce mécanisme, certaines situations longues produisent 3+ lignes empilées qui cassent l'équilibre visuel. Toujours mesurer la hauteur réelle avant de choisir le rendu.
- **Le probe DOM doit être au même niveau de largeur** que le bloc final pour mesurer correctement. Si le wrap est mal détecté, vérifier que `width: inherit` propage bien depuis le parent flex.
- **Ne PAS trier les situations** : elles arrivent dans l'ordre du JSON et reçoivent les nuances dans l'ordre `camaieu[0]` à `camaieu[3]`. C'est l'auteure qui décide de l'ordre des protocoles dans le JSON.
- **Ne PAS modifier les hex des camaïeux** : ils sont calculés selon une formule de mix précise (voir section 14).
- **Ne PAS faire de gradient CSS** : chaque case est un aplat de couleur uniforme.
- **Le slash doit être présent uniquement si `secondPart` existe** : pour les situations sans `/`, ne pas afficher de slash orphelin.

---

## 14. Formule de génération des camaïeux (pour réutilisation)

```ts
function generateCamaieu(baseHex: string, deepHex: string): [string, string, string, string] {
  const CREAM = hexToRgb('#F2EDE8');
  const base = hexToRgb(baseHex);
  const deep = hexToRgb(deepHex);

  const cran1 = mix(base, CREAM, 0.55);
  const cran2 = base;
  const cran3 = mix(base, deep, 0.50);
  const cran4 = mix(base, deep, 0.85);

  // Ordre alterné pour les 4 cases
  return [
    rgbToHex(cran3), rgbToHex(cran1),
    rgbToHex(cran4), rgbToHex(cran2),
  ];
}
```

Couleurs "deep" par catégorie :

| Catégorie | Base (page 1) | Deep (pour mix) |
|-----------|---------------|-----------------|
| Pleurs | `#F0B8A8` | `#D89880` |
| Alim | `#F5D0C8` | `#E0AA9A` |
| Sommeil | `#F8DBC9` | `#E5B498` |
| Corps | `#EDE0D4` | `#D4BFA8` |
| Stimu | `#BECEA9` | `#90B070` |
| Sepa | `#B0C0AC` | `#88A084` |
| Santé | `#C8D8DC` | `#9CB4BC` |
| Parent | `#E8F0F2` | `#B8CCD0` |

---

## 15. Version

- **V2 validée** le 28 mai 2026 — ajout du picto au-dessus du titre, règle de saut conditionnel, interlignage automatique
- **Modifs autorisées sans nouvelle validation** : aucune
- **Validation requise pour** : changement de camaïeu, d'ordre des nuances, de typographie, de structure, de comportement du saut conditionnel
- **Référence design** : conversation Claude "M2 protocoles + design Page 2"

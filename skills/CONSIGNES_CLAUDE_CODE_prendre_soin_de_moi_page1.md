# CONSIGNES CLAUDE CODE — Page « Prendre soin de moi » (accueil de la rubrique)

**Statut : VALIDÉ V1 — design figé, ne pas modifier sans validation explicite de la fondatrice.**

Cette fiche est autoportée : elle contient tout le nécessaire pour implémenter l'écran d'accueil de la rubrique « Prendre soin de moi » (grand titre du mois + intro + les 5 conseils), sans avoir à interpréter d'autres documents.

---

## 1. Contexte fonctionnel

C'est l'écran d'entrée de la rubrique « Prendre soin de moi » (le 3ᵉ module de l'app). Il présente, pour le mois en cours :
- le **thème du mois** en grand titre (il change chaque mois),
- un **paragraphe d'intro**,
- les **5 conseils** sous forme de cases cliquables. Au clic sur une case, on bascule vers l'écran de détail du conseil.

**Règle d'or : l'écran tient intégralement sur un téléphone standard, sans scroll** (comme la page 1 et la page 2 de Guide-moi). On doit avoir la vue d'ensemble — titre, intro et 5 cases — d'un seul coup d'œil.

---

## 2. Stack et hypothèses

- Framework : **React** (composant fonctionnel, Next.js ou Vite)
- Style : **inline styles**
- Données : le fichier `mois_${babyMonth.toString().padStart(2,'0')}_-_03_prendre_soin_de_moi.json` est chargé côté client ou via fetch
- Police titre : **Playfair Display** (déjà chargée via Google Fonts en page 1 ; poids 600 et 700)
- Bandeau du haut : **réutiliser le composant TopBar de la page 1** (voir § 5.1)

---

## 3. Source de données — structure du JSON

Clés racine utilisées par cet écran :

```json
{
  "mois": 15,
  "nom_rubrique": "Prendre soin de moi",
  "promesse_du_mois": "Poser tes limites avec sérénité",
  "intention_du_mois": "À 15 mois, ton enfant teste tout…",
  "conseils": [
    { "numero": 1, "id": "auto_massage_aplomb",          "nom_outil": "Auto-massage de réflexologie", "promesse": "Renforcer ton aplomb intérieur…" },
    { "numero": 2, "id": "meditation_lumiere_choisie",   "nom_outil": "Méditation audio",             "promesse": "Choisir consciemment…" },
    { "numero": 3, "id": "auto_reconnaissance_oui_non",  "nom_outil": "Auto-reconnaissance",          "promesse": "Cartographier tes oui et tes non…" },
    { "numero": 4, "id": "realite_post_partum_M15",      "nom_outil": "La réalité du post-partum",    "promesse": "Poser des limites sans culpabiliser…" },
    { "numero": 5, "id": "challenge_couple_menu_limites","nom_outil": "Challenge couple",             "promesse": "Composez votre menu des limites…" }
  ]
}
```

> ⚠️ Le champ `id` **change chaque mois** : ne jamais l'utiliser pour styler ou ordonner. Le champ **`numero` (1 à 5) est stable** et sert de clé pour la couleur, le picto et le titre court de chaque case.

### Mapping hiérarchie → écran (hiérarchie de texte VALIDÉE, ne pas inverser)

| Source JSON | Rôle à l'écran | Style |
|---|---|---|
| `promesse_du_mois` | **Grand titre** (change chaque mois) | Playfair 700, 25 px, `#3A3228`, centré |
| `nom_rubrique` (« Prendre soin de moi ») | **Label SOUS le grand titre** | Eucalyptus `#8A9E98`, 9 px, 600, UPPERCASE, `letter-spacing:.16em`, centré |
| `intention_du_mois` | **Paragraphe d'intro** (tronqué, voir § 6) | 12,5 px, `#5A4A40`, centré, `line-height:1.62` |
| `conseils[].nom_outil` | **Titre de case** (affiché en version courte, voir § 5.4) | Playfair 600, 14 px, `#3A3228` |
| `conseils[].promesse` | **Phrase explicative sous le titre de case** | 11,5 px, **italique**, **`#3A3228` (noir)**, `line-height:1.3` |

---

## 4. Palette de l'écran (sous-ensemble VALIDÉ)

On **n'utilise pas toute la gamme** de l'app : cet écran parle du soin de la maman, on reste sur des **tons chauds et féminins**.

| Token | Hex | Usage |
|---|---|---|
| Cream | `#F2EDE8` | Fond de l'écran **ET fond du bandeau** (même couleur) |
| Cream-dark | `#E4DDD6` | Séparateur bas du bandeau, bord haut de la nav |
| Ink (noir) | `#3A3228` | Grand titre, titres de cases, **phrase + picto + flèche des cases** |
| Eucalyptus | `#8A9E98` | Label « Prendre soin de moi », adjectif du mois (bandeau), nav active |
| Peach-dark | `#C8806A` | Trait décoratif sous le label, bord du badge mois |
| Texte intro | `#5A4A40` | Paragraphe d'intro |

### Fonds des 5 cases — gamme dérivée d'Alimentation + Sommeil (PAS de Pleurs)

Construite **uniquement** à partir des camaïeux Alimentation et Sommeil de la page 2, **alternée profond / clair pour éviter tout effet de dégradé**. Ordre **fixe par `numero`** :

```ts
// fond de case par numéro de conseil (1→5) — ne pas trier, ne pas dégrader
const FOND_CASE: Record<number, string> = {
  1: '#EABDB1', // alim — profond
  2: '#F8DBC9', // sommeil — clair
  3: '#E7B99F', // sommeil — profond
  4: '#F5D0C8', // alim — clair
  5: '#EEC7B0', // sommeil — médian
};
```

> Aucune bordure ni contour sur les cases (comme la page 1). Le cercle sous le picto est en **blanc transparent** : `rgba(255,255,255,.48)` sur fond profond, `rgba(255,255,255,.55)` sur fond clair.

---

## 5. Composants et layout

### 5.1 Bandeau (TopBar) — INCHANGÉ

**Réutiliser tel quel le TopBar de la page 1** : fond **Cream `#F2EDE8`** (jamais Peach), séparation basse `0.5px solid #E4DDD6`, avatar bébé (cercle Coral `#D4604A` + picto silhouette stroke Cream), `{babyName}` 13 px/500/`#3A3228`, badge `{babyMonth} mois · {season}` (9 px, fond Cream, bord `.5px #C8806A`), et `{monthAdjective}` 10 px en Eucalyptus dessous.

**Pas de fil d'Ariane** sous le bandeau (pas de « Accueil › 15 mois › Prendre soin »).

### 5.2 En-tête éditorial (ordre VALIDÉ)

1. **Grand titre** = `promesse_du_mois` (Playfair 700, 25 px, centré, `#3A3228`).
2. **Label** = « Prendre soin de moi » **juste en dessous** (eucalyptus, 9 px, 600, uppercase, letter-spacing .16em, centré).
3. **Trait décoratif** : 34 × 1 px, `#C8806A`, opacity .55, centré.
4. **Intro** = `intention_du_mois` tronquée (§ 6).

### 5.3 Liste des 5 cases

- Conteneur **largeur 82 %, centré** (`margin:0 auto`) — plus étroit que la pleine largeur, dans l'esprit des cases de la page 1.
- `gap: 8px`, `border-radius: 11px`, padding `10px 12px`, **sans bordure**.
- Layout d'une case (flex, `align-items:center`, `gap:13px`) :
  - **Cercle picto** 38 px, blanc transparent (voir § 4), picto **SVG au trait noir `#3A3228`** (`stroke-width:1.6`, 21 px).
  - **Bloc texte** `flex:1` : titre court (Playfair 600/14/`#3A3228`) puis promesse (11,5 px italique **noir `#3A3228`**).
  - **Chevron droit** : SVG `#3A3228`, opacity .85, 16 px.

### 5.4 Titres courts des cases (affichage)

Le `nom_outil` reste la valeur canonique dans le JSON, mais l'affichage en case utilise un **titre court tenant sur une ligne**, mappé par `numero` :

```ts
const TITRE_CASE: Record<number, string> = {
  1: 'Auto-massage',
  2: 'Méditation audio',
  3: 'Auto-reconnaissance',
  4: 'Réalité du post-partum',
  5: 'Challenge couple',
};
```

### 5.5 Pictos des 5 cases (au trait noir, stables par `numero`)

```tsx
// stroke="#3A3228" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round", viewBox 0 0 24 24
const PICTO_CASE: Record<number, JSX.Element> = {
  1: <><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 11V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M17 12V8a1.5 1.5 0 0 1 3 0v6a6 6 0 0 1-6 6h-2.5a5 5 0 0 1-3.9-1.9L4 13.5a1.6 1.6 0 0 1 2.5-2L8 13.5"/></>, // main (réflexologie)
  2: <><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="7" rx="2"/><rect x="17" y="13" width="4" height="7" rx="2"/></>, // casque (méditation)
  3: <><path d="M12 3v18"/><path d="M5 7l-2.5 5a2.5 2.5 0 0 0 5 0L5 7z"/><path d="M19 7l-2.5 5a2.5 2.5 0 0 0 5 0L19 7z"/><path d="M5 7l7-2 7 2"/><path d="M8 21h8"/></>, // balance (auto-reconnaissance)
  4: <path d="M12 20s-7-4.4-7-9.5A3.6 3.6 0 0 1 12 7a3.6 3.6 0 0 1 7 3.5C19 15.6 12 20 12 20z"/>, // cœur (réalité post-partum)
  5: <><path d="M9.5 16s-4.5-2.9-4.5-6.2A2.4 2.4 0 0 1 9.5 8a2.4 2.4 0 0 1 4.5 1.8C14 13.1 9.5 16 9.5 16z"/><path d="M15.5 19s-3.6-2.3-3.6-5A1.9 1.9 0 0 1 15.5 12a1.9 1.9 0 0 1 3.6 1.5c0 2.7-3.6 5-3.6 5z"/></>, // deux cœurs (challenge couple)
};
```

### 5.6 Nav du bas

5 entrées (Accueil · Guide-moi · Coucher · Soin de moi · Jeux), icônes au trait. Inactives `#B4A89C`, **active (« Soin de moi ») en Eucalyptus `#8A9E98`**. Bord haut `.5px #E4DDD6`, fond Cream.

---

## 6. Règle de l'intro (mois à intro longue)

`intention_du_mois` peut être longue (jusqu'à ~90 mots certains mois). Pour préserver la vue d'ensemble sans scroll, **l'intro de cet écran est tronquée à ~210 caractères**, coupée sur un mot, suivie de « … » seulement si réellement tronquée. Le texte intégral reste disponible (champ `intention_du_mois`) pour l'écran de détail / un éventuel « lire plus ».

```ts
function introCourte(t: string, max = 210): string {
  if (t.length <= max) return t;
  const coupe = t.slice(0, max);
  return coupe.slice(0, coupe.lastIndexOf(' ')).trimEnd() + '…';
}
```

---

## 7. Composant React de référence

```tsx
import data from `@/data/mois_${String(babyMonth).padStart(2,'0')}_-_03_prendre_soin_de_moi.json`;

const FOND_CASE  = {1:'#EABDB1',2:'#F8DBC9',3:'#E7B99F',4:'#F5D0C8',5:'#EEC7B0'} as Record<number,string>;
const CERCLE     = {1:.48,2:.55,3:.48,4:.55,5:.48} as Record<number,number>;
const TITRE_CASE = {1:'Auto-massage',2:'Méditation audio',3:'Auto-reconnaissance',4:'Réalité du post-partum',5:'Challenge couple'} as Record<number,string>;

export default function PrendreSoinDeMoi() {
  const conseils = [...data.conseils].sort((a,b)=>a.numero-b.numero);

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',background:'#F2EDE8',
                 fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif",color:'#3A3228'}}>

      <TopBar /> {/* composant identique à la page 1 — fond Cream, pas de fil d'Ariane */}

      <div style={{flex:1,display:'flex',flexDirection:'column',padding:'20px 18px 0',overflow:'hidden'}}>

        {/* En-tête : grand titre, puis label dessous */}
        <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:700,fontSize:25,
                    lineHeight:1.15,color:'#3A3228',textAlign:'center',margin:'0 0 8px'}}>
          {data.promesse_du_mois}
        </h1>
        <div style={{textAlign:'center',fontSize:9,fontWeight:600,letterSpacing:'.16em',
                     textTransform:'uppercase',color:'#8A9E98',marginBottom:12}}>
          {data.nom_rubrique}
        </div>
        <div style={{width:34,height:1,background:'#C8806A',opacity:.55,margin:'0 auto 14px'}}/>

        <p style={{fontSize:12.5,lineHeight:1.62,color:'#5A4A40',textAlign:'center',
                   margin:'0 auto 18px',maxWidth:316}}>
          {introCourte(data.intention_du_mois)}
        </p>

        {/* 5 cases — 82% centrées */}
        <div style={{display:'flex',flexDirection:'column',gap:8,width:'82%',margin:'0 auto'}}>
          {conseils.map(c=>(
            <a key={c.numero} href={`/soin-de-moi/${c.id}`}
               style={{display:'flex',alignItems:'center',gap:13,borderRadius:11,
                       padding:'10px 12px',background:FOND_CASE[c.numero],textDecoration:'none'}}>
              <span style={{width:38,height:38,borderRadius:'50%',flexShrink:0,display:'flex',
                            alignItems:'center',justifyContent:'center',
                            background:`rgba(255,255,255,${CERCLE[c.numero]})`}}>
                <svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke="#3A3228"
                     strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  {PICTO_CASE[c.numero]}
                </svg>
              </span>
              <span style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
                <span style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:600,
                              fontSize:14,color:'#3A3228',lineHeight:1.18}}>
                  {TITRE_CASE[c.numero]}
                </span>
                <span style={{fontSize:11.5,fontStyle:'italic',lineHeight:1.3,marginTop:2,color:'#3A3228'}}>
                  {c.promesse}
                </span>
              </span>
              <span style={{flexShrink:0,display:'flex',color:'#3A3228',opacity:.85}}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 6 15 12 9 18"/>
                </svg>
              </span>
            </a>
          ))}
        </div>

        <BottomNav active="soin" /> {/* active en Eucalyptus #8A9E98 */}
      </div>
    </div>
  );
}
```

---

## 8. Espaces insécables (rappel transverse)

Tous les textes affichés (`promesse_du_mois`, `intention_du_mois`, `promesse`) proviennent du JSON et contiennent déjà les **espaces insécables U+00A0** avant `: ; ! ?` et `»`, après `«`. Ne pas les retirer au rendu, ne pas les remplacer par des espaces normales.

---

## 9. Checklist avant validation de l'écran

- [ ] Tout tient sur un écran de téléphone standard, **sans scroll**.
- [ ] Le bandeau est sur fond **Cream `#F2EDE8`** (jamais Peach) et **n'est pas modifié** (avatar + prénom + badge mois·saison + adjectif eucalyptus).
- [ ] **Pas de fil d'Ariane** sous le bandeau.
- [ ] Le **grand titre** affiche `promesse_du_mois` (Playfair 700/25), et « Prendre soin de moi » est **juste en dessous** (eucalyptus 9 px uppercase).
- [ ] L'intro est tronquée proprement (coupe sur un mot, « … » seulement si nécessaire).
- [ ] Les 5 cases sont à **82 % de largeur, centrées**, sans bordure.
- [ ] Cercle picto en **blanc transparent** ; picto, phrase explicative et **flèche** sont **tous noirs `#3A3228`**.
- [ ] Titres de cases en **Playfair 600/14** ; « Auto-massage » et « Réalité du post-partum » tiennent **sur une ligne**.
- [ ] Fonds des cases = gamme **alim/sommeil alternée** par `numero` (1:`#EABDB1` 2:`#F8DBC9` 3:`#E7B99F` 4:`#F5D0C8` 5:`#EEC7B0`) — **aucun ton Pleurs, aucun marron-gris, aucun dégradé**.
- [ ] Chevron droit présent sur chaque case.
- [ ] Eucalyptus réservé au label, à l'adjectif du mois et à la nav active.
- [ ] Les espaces insécables du JSON sont préservées au rendu.
```

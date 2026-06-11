# CONSIGNES CLAUDE CODE — Page 3 Protocole

_(Détail d'un protocole Guide-moi — écran ouvert après le clic sur une situation en page 2.)_

> À coller dans Claude Code. Objectif : corriger l'affichage d'un protocole pour qu'il respecte
> le design validé. Ce document remplace l'ancien composant d'affichage du protocole.

## Les 3 problèmes à corriger

1. **Toutes les rubriques doivent être des encarts colorés** (8 blocs). Aujourd'hui certaines
   s'affichent en texte nu. → Chaque rubrique a son propre encart (fond + bordure + radius).
2. **Le gras avant les `:` ne s'affiche pas.** C'est normal : les JSON ne contiennent AUCUNE
   balise de gras. C'est le composant qui doit couper sur le premier `:` et mettre l'amorce en
   gras (font-weight 700). → utiliser le helper `LigneAvecAmorce` ci-dessous.
3. **Le champ `situation` est réaffiché en sous-titre, en doublon du `titre`.** → NE PAS afficher
   `situation` sur l'écran d'un protocole ouvert. Ce champ ne sert que de libellé de bouton dans
   la liste d'une catégorie.

## Ordre imposé des 8 blocs (ne jamais réordonner)

1. Ce qui se passe — `protocole.explication`
2. Pour toi, parent — `protocole.ancrage` (italique)
3. Action immédiate — `protocole.action_immediate` (titre complet + étapes numérotées)
4. Pour aller plus loin — `protocole.pour_aller_plus_loin` (liste)
5. Geste doux — `protocole.geste_doux` (titre complet + étapes numérotées)
6. Principe à retenir — `protocole.principe`
7. Erreurs à éviter — `protocole.erreurs_a_eviter` (croix rouges)
8. Cadre de sécurité / consulter si — `protocole.consulter_si` (cadre rouge complet)

## Couleurs des 8 blocs

| Bloc | Fond | Bordure | Texte label |
|------|------|---------|-------------|
| Ce qui se passe | `#E8F0F2` | gauche 3px `#8FB4BC` | `#3A5A64` |
| Pour toi, parent | `#F8E0D8` | gauche 3px `#E0A48E` | `#8A4030` |
| Action immédiate | `#F5D0C8` | gauche 3px `#D4604A` | `#8A3020` |
| Pour aller plus loin | `#F8DBC8` | gauche 3px `#DB936B` | `#9A4F2A` |
| Geste doux | `#DCE9CF` | gauche 3px `#82A56A` | `#3F5C2E` |
| Principe à retenir | `#E8F0F2` | gauche 3px `#8A9E98` | `#384E48` |
| Erreurs à éviter | `#E4DDD6` | gauche 3px `#B4A89C` | `#5A4A40` + croix ✕ `#D4604A` |
| Cadre de sécurité / consulter si | `#EDE9E4` | **complète 1px `#D4604A`** | `#8A3020` |

- Blocs 1 à 7 : `borderRadius: '0 12px 12px 0'`.
- Bloc 8 (Cadre) : `border: '1px solid #D4604A'` + `borderRadius: 10` (cadre fermé d'alerte).
- Pastilles numérotées **pleines** (fond = couleur de bordure, chiffre blanc, poids 700) sur
  Action immédiate et Geste doux.
- Action immédiate et Geste doux affichent leur `titre` complet du JSON (avec le complément
  après le tiret, ex. « Action immédiate — désamorcer le moment du repas »).
- TopBar de l'écran sur fond Cream `#F2EDE8` (pas de Peach), séparation basse `0.5px solid #E4DDD6`.

## Composant React prêt à coller

```tsx
import React from 'react';

const C = {
  text: '#3A3228',
  cequisepasse:  { bg: '#E8F0F2', accent: '#8FB4BC', label: '#3A5A64' },
  pourtoiparent: { bg: '#F8E0D8', accent: '#E0A48E', label: '#8A4030' },
  actionimm:     { bg: '#F5D0C8', accent: '#D4604A', label: '#8A3020' },
  pourallerplus: { bg: '#F8DBC8', accent: '#DB936B', label: '#9A4F2A' },
  gestedoux:     { bg: '#DCE9CF', accent: '#82A56A', label: '#3F5C2E' },
  principe:      { bg: '#E8F0F2', accent: '#8A9E98', label: '#384E48' },
  erreurs:       { bg: '#E4DDD6', accent: '#B4A89C', label: '#5A4A40', croix: '#D4604A' },
  cadre:         { bg: '#EDE9E4', accent: '#D4604A', label: '#8A3020', textBody: '#5A4A40' },
};

/* Met en gras la partie avant le premier ":" — l'amorce. */
function LigneAvecAmorce({ texte }: { texte: string }) {
  const i = texte.indexOf(':');
  if (i === -1) return <>{texte}</>;
  return (
    <>
      <strong style={{ fontWeight: 700 }}>{texte.slice(0, i).trim()} :</strong>
      {texte.slice(i + 1)}
    </>
  );
}

const labelStyle = (color: string): React.CSSProperties => ({
  fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '.07em', color, marginBottom: 6,
});

function EncartSimple({ label, color, accent, bg, italic, children }: any) {
  return (
    <div style={{
      background: bg, borderLeft: `3px solid ${accent}`,
      borderRadius: '0 12px 12px 0', padding: '11px 13px', marginBottom: 8,
    }}>
      <div style={labelStyle(color)}>{label}</div>
      <div style={{ fontSize: 11, color, lineHeight: 1.55, fontStyle: italic ? 'italic' : 'normal' }}>
        {children}
      </div>
    </div>
  );
}

function EncartEtapes({ titre, etapes, theme }: any) {
  return (
    <div style={{
      background: theme.bg, borderLeft: `3px solid ${theme.accent}`,
      borderRadius: '0 12px 12px 0', padding: '11px 13px', marginBottom: 8,
    }}>
      <div style={{ ...labelStyle(theme.label), marginBottom: 7 }}>{titre}</div>
      {etapes.map((step: string, i: number) => (
        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 5 }}>
          <div style={{
            width: 17, height: 17, borderRadius: '50%', fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 1, background: theme.accent, color: '#FFFFFF',
          }}>{i + 1}</div>
          <div style={{ fontSize: 11, color: C.text, lineHeight: 1.5 }}>
            <LigneAvecAmorce texte={step} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProtocolView({ protocole }: { protocole: any }) {
  const p = protocole;
  return (
    <div style={{ padding: '14px 16px 80px' }}>
      {/* Titre seul — NE PAS afficher p.situation ici (doublon) */}
      <h1 style={{
        fontSize: 17, fontWeight: 600, color: C.text, lineHeight: 1.25,
        margin: '0 0 14px', fontFamily: 'Georgia, serif',
      }}>{p.titre}</h1>

      {/* 1. Ce qui se passe */}
      <EncartSimple label="Ce qui se passe" {...C.cequisepasse} color={C.cequisepasse.label}
        bg={C.cequisepasse.bg} accent={C.cequisepasse.accent}>
        {p.explication}
      </EncartSimple>

      {/* 2. Pour toi, parent */}
      <EncartSimple label="Pour toi, parent" color={C.pourtoiparent.label}
        bg={C.pourtoiparent.bg} accent={C.pourtoiparent.accent} italic>
        {p.ancrage}
      </EncartSimple>

      {/* 3. Action immédiate */}
      <EncartEtapes titre={p.action_immediate.titre} etapes={p.action_immediate.etapes}
        theme={C.actionimm} />

      {/* 4. Pour aller plus loin */}
      <div style={{
        background: C.pourallerplus.bg, borderLeft: `3px solid ${C.pourallerplus.accent}`,
        borderRadius: '0 12px 12px 0', padding: '11px 13px', marginBottom: 8,
      }}>
        <div style={{ ...labelStyle(C.pourallerplus.label), marginBottom: 7 }}>Pour aller plus loin</div>
        {p.pour_aller_plus_loin.map((pt: string, i: number) => (
          <div key={i} style={{ fontSize: 11, color: C.text, lineHeight: 1.5, marginBottom: 5 }}>
            <LigneAvecAmorce texte={pt} />
          </div>
        ))}
      </div>

      {/* 5. Geste doux */}
      <EncartEtapes titre={p.geste_doux.titre} etapes={p.geste_doux.etapes}
        theme={C.gestedoux} />

      {/* 6. Principe à retenir */}
      <EncartSimple label="Principe à retenir" color={C.principe.label}
        bg={C.principe.bg} accent={C.principe.accent}>
        {p.principe}
      </EncartSimple>

      {/* 7. Erreurs à éviter — croix rouges */}
      <div style={{
        background: C.erreurs.bg, borderLeft: `3px solid ${C.erreurs.accent}`,
        borderRadius: '0 12px 12px 0', padding: '11px 13px', marginBottom: 8,
      }}>
        <div style={{ ...labelStyle(C.erreurs.label), marginBottom: 7 }}>Erreurs à éviter</div>
        {p.erreurs_a_eviter.map((err: string, i: number) => (
          <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 5 }}>
            <span style={{ color: C.erreurs.croix, fontWeight: 700, fontSize: 12, lineHeight: 1.4, flexShrink: 0 }}>✕</span>
            <div style={{ fontSize: 11, color: C.erreurs.label, lineHeight: 1.5 }}>{err}</div>
          </div>
        ))}
      </div>

      {/* 8. Cadre de sécurité / consulter si — cadre rouge complet */}
      <div style={{
        background: C.cadre.bg, border: `1px solid ${C.cadre.accent}`,
        borderRadius: 10, padding: '11px 13px', marginBottom: 0,
      }}>
        <div style={labelStyle(C.cadre.label)}>Cadre de sécurité / consulter si</div>
        <div style={{ fontSize: 11, color: C.cadre.textBody, lineHeight: 1.55 }}>
          {p.consulter_si}
        </div>
      </div>
    </div>
  );
}
```

## Checklist de vérification après intégration

- [ ] Les 8 blocs s'affichent, chacun avec son fond coloré (aucun en texte nu).
- [ ] L'amorce avant le « : » est en gras sur Action immédiate, Geste doux et Pour aller plus loin.
- [ ] Le titre de la situation (`situation`) n'apparaît PAS sous le titre du protocole.
- [ ] Action immédiate et Geste doux affichent leur titre complet (avec complément après le tiret).
- [ ] Pastilles numérotées pleines (chiffre blanc) sur Action immédiate (corail) et Geste doux (vert).
- [ ] Erreurs à éviter : croix ✕ rouges devant chaque ligne.
- [ ] Cadre de sécurité / consulter si : encadré complet fin rouge, coins arrondis sur tout le pourtour.
- [ ] TopBar sur fond Cream (#F2EDE8), pas en Peach.

## Note sur les JSON

Les champs `couleur_fond` / `couleur_texte` présents dans `action_immediate` et `geste_doux`
des fichiers JSON sont à IGNORER : les couleurs sont désormais pilotées par ce composant.
(On pourra les supprimer des JSON dans une passe ultérieure de nettoyage.)

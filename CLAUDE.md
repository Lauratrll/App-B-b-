# CLAUDE.md — Contexte projet BeSerene (ou nom définitif à préciser)

> Ce fichier est lu par Claude Code à chaque session. Ne pas supprimer.
> Mis à jour au fur et à mesure du développement.

---

## 🎯 Vision du projet

Application web d'accompagnement pour une parentalité consciente. Pour les parents de bébés de **0 à 24 mois**.
Centrée sur la **réflexologie émotionnelle bébé** et la **régulation émotionnelle parentale, ainsi que sur le bien-être au naturel**.
Positionnement : zéro jargon médical, parentalité consciente, solutions actionnables immédiatement, bien-être au naturel, observation et écoute du bébé.

**Fondatrice :** Ancienne planneuse stratégique reconvertie, micro-entrepreneuse, en formation de réflexologie émotionnelle bébé. Pas de compétences techniques — Claude Code est le bras armé du développement.

**Modèle économique :**
- Abonnement mensuel : 5,90 €/mois
- Abonnement annuel : 50,90 €/an (4,24 €/mois)
- Aucune pub, aucun partenariat commercial dans l'app

---

## 🛠️ Stack technique

```
Framework       : Next.js 14 (App Router)
Hébergement     : Vercel (plan gratuit)
Base de données : Supabase (PostgreSQL)
Auth            : Supabase Auth (email + Google)
Paiements       : Stripe (abonnements récurrents)
Emails          : Resend
Styling         : Tailwind CSS
Langue          : Français uniquement
Format cible    : Mobile-first, max-width 390px
```

**Repo GitHub :** [à compléter]
**URL Vercel :** [à compléter]
**Supabase project URL :** [à compléter]

---

## 📁 Structure du projet

```
/app
  /api              → Routes API Next.js (Stripe webhooks, Supabase)
  /(auth)           → Pages login, register, reset
  /(app)            → Pages protégées (abonnement requis)
    /dashboard      → Accueil personnalisé
    /guide          → Module Guide-moi !
    /soin           → Module Prends soin de toi
    /saison         → Module Conseil de saison
    /coucher        → Module Préparer le coucher
    /audio          → Module Partager & rassurer
    /jeux           → Module Jeux & stimulation
    /profil         → Profil bébé
    /epingles       → Protocoles épinglés
    /abonnement     → Gestion abonnement Stripe
/components
  /ui               → Composants réutilisables (boutons, cards, navigation)
  /modules          → Composants spécifiques aux 6 modules
/lib
  /supabase.ts      → Client Supabase
  /stripe.ts        → Client Stripe
  /utils.ts         → Fonctions utilitaires (calcul mois bébé, saison, etc.)
/skills             → Fichiers SKILL_*.md (référence éditoriale et technique)
/content            → Fichiers JSON des protocoles par mois
```

---

## 🗄️ Schéma base de données Supabase

> Toujours vérifier ce schéma avant de créer ou modifier une table.
> Ne jamais inventer une colonne — la chercher ici d'abord.

```sql
-- Utilisateurs (géré par Supabase Auth)
auth.users (id, email, created_at)

-- Profils bébé
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  baby_name TEXT NOT NULL,
  birthdate DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- baby_name et birthdate permettent de calculer côté client :
-- mois_actuel = différence en mois entre birthdate et aujourd'hui
-- saison = selon le mois calendaire actuel

-- Abonnements
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT CHECK (plan IN ('monthly', 'annual')),
  status TEXT CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contenu (protocoles, modules — alimenté hors ligne, pas par les users)
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mois INTEGER CHECK (mois BETWEEN 0 AND 24),
  module TEXT CHECK (module IN ('guide', 'soin', 'saison', 'coucher', 'audio', 'jeux')),
  categorie TEXT,
  situation TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Épinglés
CREATE TABLE pinned (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, content_id)
);
```

---

## 🧭 Les 6 modules de l'app

Chaque mois contient les mêmes 6 modules — seul le contenu change.

| # | Module | Description |
|---|--------|-------------|
| 1 | 🧭 Guide-moi ! | 8 catégories × 4 situations = 32 protocoles différenciés par mois |
| 2 | 🌸 Prends soin de toi | 6 gestes parentaux (réflexo, méditation, écriture, réalité, couple, soin) |
| 3 | 🌿 Conseil de saison | 2 conseils adaptés à l'âge + saison en cours |
| 4 | 🌙 Préparer le coucher | Rituel personnalisé selon thème développemental |
| 5 | 💜 Partager & rassurer | 3 scripts audio par trimestre |
| 6 | 🎯 Jeux & stimulation | 3 activités adaptées à l'âge |

### Structure d'un protocole Guide-moi ! (JSONB)

```json
{
  "titre": "Crise de colère intense depuis 20 min",
  "explication": "...",
  "ancrage": "...",
  "action_immediate": {
    "titre": "Action immédiate",
    "couleur": "#FCEBEB",
    "couleur_texte": "#A32D2D",
    "etapes": ["...", "..."]
  },
  "action_complementaire": {
    "titre": "Geste doux — réflexologie",
    "couleur": "#E1F5EE",
    "couleur_texte": "#085041",
    "etapes": ["...", "..."]
  },
  "action_parent": {
    "etapes": ["...", "..."]
  },
  "preventif": "...",
  "erreurs": ["...", "..."],
  "cadre_securite": "..."
}
```

---

## ⚙️ Fonctions utilitaires clés

```typescript
// Calcul du mois de bébé
function getBabyMonth(birthdate: Date): number {
  const today = new Date()
  const months = (today.getFullYear() - birthdate.getFullYear()) * 12
    + today.getMonth() - birthdate.getMonth()
  return Math.max(0, Math.min(24, months))
}

// Calcul de la saison (hémisphère nord)
function getSeason(date: Date): 'printemps' | 'ete' | 'automne' | 'hiver' {
  const month = date.getMonth() + 1
  if (month >= 3 && month <= 5) return 'printemps'
  if (month >= 6 && month <= 8) return 'ete'
  if (month >= 9 && month <= 11) return 'automne'
  return 'hiver'
}

// Vérification abonnement actif
function isSubscriptionActive(subscription: Subscription): boolean {
  return subscription.status === 'active'
    && new Date(subscription.current_period_end) > new Date()
}
```

---

## 🔐 Règles de sécurité Supabase (Row Level Security)

Toujours activer RLS sur toutes les tables utilisateur.

```sql
-- profiles : utilisateur voit uniquement son propre profil
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON profiles
  FOR ALL USING (auth.uid() = user_id);

-- subscriptions : idem
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own subscription" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- pinned : idem
ALTER TABLE pinned ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own pinned" ON pinned
  FOR ALL USING (auth.uid() = user_id);

-- content : lecture authentifiée (protégée par vérification abonnement côté app)
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content readable" ON content
  FOR SELECT USING (true);
```

---

## 🚫 Règles absolues pour Claude Code

1. **Ne jamais exposer les clés API** dans le code — toujours via `.env.local`
2. **Ne jamais modifier le schéma Supabase** sans le mettre à jour dans ce CLAUDE.md
3. **Toujours lire le SKILL correspondant** avant de générer du contenu ou un composant UI
4. **Format mobile-first systématique** — max-width 390px, tester sur petits écrans
5. **Langue française uniquement** dans tous les textes de l'app
6. **Jamais de conseil médical direct** — toujours renvoyer vers le médecin dans le cadre de sécurité
7. **Vérifier l'abonnement actif** avant d'afficher tout contenu protégé

---

## 📅 État d'avancement

| Mois  | Guide-moi ! | Soin | Saison | Coucher | Audio | Jeux |
|-------|-------------|------|--------|---------|-------|------|
| 0     | ✅ complet  | ✅   | ✅     | ✅      | ✅    | ✅   |
| 14    | ✅ complet  | ✅   | ✅     | ✅      | ✅    | ✅   |
| 1–13  | ⏳ à faire  | ⏳   | ⏳     | ⏳      | ⏳    | ⏳   |
| 15–24 | ⏳ à faire  | ⏳   | ⏳     | ⏳      | ⏳    | ⏳   |

---

## 🔗 Ressources

- Skills éditoriaux : `/skills/SKILL_protocole.md`, `/skills/SKILL_contenu.md`
- Skills techniques : `/skills/SKILL_bdd.md`, `/skills/SKILL_ui.md`
- Contenu JSON : `/content/mois-00/`, `/content/mois-14/`
- Doc Supabase : https://supabase.com/docs
- Doc Stripe : https://stripe.com/docs
- Doc Next.js : https://nextjs.org/docs

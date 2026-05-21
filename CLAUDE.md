# CLAUDE.md — Contexte projet BeSerene (ou nom définitif à préciser)

> Ce fichier est lu par Claude Code à chaque session. Ne pas supprimer.
> Mis à jour au fur et à mesure du développement.

\---

## 🎯 Vision du projet

Application web d'accompagnement pour une parentalité consciente. Pour les parents de bébés de **0 à 24 mois**.
Centrée sur la **réflexologie émotionnelle bébé** et la **régulation émotionnelle parentale, ainsi que sur le bien-être au naturel**.
Positionnement : zéro jargon médical, parentalité consciente, solutions actionnables immédiatement, bien-être au naturel, observation et écoute du bébé.

**Fondatrice :** Ancienne planneuse stratégique reconvertie, micro-entrepreneuse, en formation de réflexologie émotionnelle bébé. Pas de compétences techniques — Claude Code est le bras armé du développement.

**Modèle économique :**

* Abonnement mensuel : 5,90 €/mois
* Abonnement annuel : 50,90 €/an (4,24 €/mois)
* Aucune pub, aucun partenariat commercial dans l'app

\---

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

**Repo GitHub :** https://github.com/Lauratrll/App-B-b-
**URL Vercel :** https://app-b-b-i6ai.vercel.app
**Supabase project URL :** https://lhwbnfkmpglygttxzyib.supabase.co

\---

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
    /audio          → Module Partager \& rassurer
    /jeux           → Module Jeux \& stimulation
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
/skills             → Fichiers SKILL\_\*.md (référence éditoriale et technique)
/content            → Fichiers JSON des protocoles par mois
```

\---

## 🗄️ Schéma base de données Supabase

> Toujours vérifier ce schéma avant de créer ou modifier une table.
> Ne jamais inventer une colonne — la chercher ici d'abord.

```sql
-- Utilisateurs (géré par Supabase Auth)
auth.users (id, email, created\_at)

-- Profils bébé
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),
  user\_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  baby\_name TEXT NOT NULL,
  birthdate DATE NOT NULL,
  created\_at TIMESTAMPTZ DEFAULT now(),
  updated\_at TIMESTAMPTZ DEFAULT now()
);
-- baby\_name et birthdate permettent de calculer côté client :
-- mois\_actuel = différence en mois entre birthdate et aujourd'hui
-- saison = selon le mois calendaire actuel

-- Abonnements
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),
  user\_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe\_customer\_id TEXT UNIQUE,
  stripe\_subscription\_id TEXT UNIQUE,
  plan TEXT CHECK (plan IN ('monthly', 'annual')),
  status TEXT CHECK (status IN ('active', 'cancelled', 'past\_due', 'trialing')),
  current\_period\_end TIMESTAMPTZ,
  created\_at TIMESTAMPTZ DEFAULT now(),
  updated\_at TIMESTAMPTZ DEFAULT now()
);

-- Contenu (protocoles, modules — alimenté hors ligne, pas par les users)
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),
  mois INTEGER CHECK (mois BETWEEN 0 AND 24),
  module TEXT CHECK (module IN ('guide', 'soin', 'saison', 'coucher', 'audio', 'jeux')),
  categorie TEXT,
  situation TEXT,
  data JSONB NOT NULL,
  created\_at TIMESTAMPTZ DEFAULT now(),
  updated\_at TIMESTAMPTZ DEFAULT now()
);

-- Épinglés
CREATE TABLE pinned (
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),
  user\_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content\_id UUID REFERENCES content(id) ON DELETE CASCADE,
  created\_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user\_id, content\_id)
);
```

\---

## 🧭 Les 6 modules de l'app

Chaque mois contient les mêmes 6 modules — seul le contenu change.

|#|Module|Description|
|-|-|-|
|1|🧭 Guide-moi !|8 catégories × 4 situations = 32 protocoles différenciés par mois|
|2|🌸 Prends soin de toi|6 gestes parentaux (réflexo, méditation, écriture, réalité, couple, soin)|
|3|🌿 Conseil de saison|2 conseils adaptés à l'âge + saison en cours|
|4|🌙 Préparer le coucher|Rituel personnalisé selon thème développemental|
|5|💜 Partager \& rassurer|3 scripts audio par trimestre|
|6|🎯 Jeux \& stimulation|3 activités adaptées à l'âge|

### Structure d'un protocole Guide-moi ! (JSONB)

```json
{
  "titre": "Crise de colère intense depuis 20 min",
  "explication": "...",
  "ancrage": "...",
  "action\_immediate": {
    "titre": "Action immédiate",
    "couleur": "#FCEBEB",
    "couleur\_texte": "#A32D2D",
    "etapes": \["...", "..."]
  },
  "action\_complementaire": {
    "titre": "Geste doux — réflexologie",
    "couleur": "#E1F5EE",
    "couleur\_texte": "#085041",
    "etapes": \["...", "..."]
  },
  "action\_parent": {
    "etapes": \["...", "..."]
  },
  "preventif": "...",
  "erreurs": \["...", "..."],
  "cadre\_securite": "..."
}
```

\---

## ⚙️ Fonctions utilitaires clés

```typescript
// Calcul du mois de bébé
function getBabyMonth(birthdate: Date): number {
  const today = new Date()
  const months = (today.getFullYear() - birthdate.getFullYear()) \* 12
    + today.getMonth() - birthdate.getMonth()
  return Math.max(0, Math.min(24, months))
}

// Calcul de la saison (hémisphère nord)
function getSeason(date: Date): 'printemps' | 'ete' | 'automne' | 'hiver' {
  const month = date.getMonth() + 1
  if (month >= 3 \&\& month <= 5) return 'printemps'
  if (month >= 6 \&\& month <= 8) return 'ete'
  if (month >= 9 \&\& month <= 11) return 'automne'
  return 'hiver'
}

// Vérification abonnement actif
function isSubscriptionActive(subscription: Subscription): boolean {
  return subscription.status === 'active'
    \&\& new Date(subscription.current\_period\_end) > new Date()
}
```

\---

## 🔐 Règles de sécurité Supabase (Row Level Security)

Toujours activer RLS sur toutes les tables utilisateur.

```sql
-- profiles : utilisateur voit uniquement son propre profil
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON profiles
  FOR ALL USING (auth.uid() = user\_id);

-- subscriptions : idem
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own subscription" ON subscriptions
  FOR ALL USING (auth.uid() = user\_id);

-- pinned : idem
ALTER TABLE pinned ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own pinned" ON pinned
  FOR ALL USING (auth.uid() = user\_id);

-- content : lecture authentifiée (protégée par vérification abonnement côté app)
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content readable" ON content
  FOR SELECT USING (true);
```

\---

## 🚫 Règles absolues pour Claude Code

1. **Ne jamais exposer les clés API** dans le code — toujours via `.env.local`
2. **Ne jamais modifier le schéma Supabase** sans le mettre à jour dans ce CLAUDE.md
3. **Toujours lire le SKILL correspondant** avant de générer du contenu ou un composant UI
4. **Format mobile-first systématique** — max-width 390px, tester sur petits écrans
5. **Langue française uniquement** dans tous les textes de l'app
6. **Jamais de conseil médical direct** — toujours renvoyer vers le médecin dans le cadre de sécurité
7. **Vérifier l'abonnement actif** avant d'afficher tout contenu protégé
8. **Droits d'auteur — règle absolue** : tout le contenu de l'app est original et créé spécifiquement pour ce projet. Ne jamais reproduire, paraphraser ou s'inspirer directement de textes existants protégés (livres, articles, méthodes brevetées, protocoles d'autres praticiens). Les approches générales (réflexologie, attachement, neurosciences) s'appuient sur des connaissances scientifiques du domaine public — les formulations sont toujours originales. En cas de doute sur une source, ne pas l'utiliser.
9. Prévoir une plateforme adaptée pour un très grand nombre d'utilisateurs

\---

## 📅 État d'avancement

|Mois|Guide-moi !|Soin|Saison|Coucher|Audio|Jeux|
|-|-|-|-|-|-|-|
|0|✅ complet|✅|✅|✅|✅|✅|
|14|✅ complet|✅|✅|✅|✅|✅|
|1–13|⏳ à faire|⏳|⏳|⏳|⏳|⏳|
|15–24|⏳ à faire|⏳|⏳|⏳|⏳|⏳|

\---

## 🔗 Ressources

* Skills éditoriaux : `/skills/SKILL\_protocole.md`, `/skills/SKILL\_contenu.md`
* Skills techniques : `/skills/SKILL\_bdd.md`, `/skills/SKILL\_ui.md`
* Contenu JSON : `/content/mois-00/`, `/content/mois-14/`
* Doc Supabase : https://supabase.com/docs
* Doc Stripe : https://stripe.com/docs
* Doc Next.js : https://nextjs.org/docs


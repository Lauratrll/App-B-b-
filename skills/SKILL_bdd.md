# SKILL_bdd.md — Base de données Supabase

> Lire ce fichier avant toute opération sur la base de données :
> création de table, requête, migration, insertion de données.
> Ne jamais inventer un nom de colonne — toujours le vérifier ici.

---

## Connexion et configuration

```typescript
// /lib/supabase.ts — Client côté serveur (Server Components, API Routes)
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // clé secrète — jamais exposée côté client
)

// /lib/supabase-browser.ts — Client côté navigateur
import { createBrowserClient } from '@supabase/ssr'

export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // clé publique — OK côté client
  )
}
```

**Variables d'environnement requises dans `.env.local` :**
```
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## Schéma complet des tables

### Table : `profiles`
Profil du bébé lié à l'utilisateur.

```sql
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  baby_name   TEXT NOT NULL,
  birthdate   DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id) -- un seul profil bébé par compte pour l'instant
);

-- Index
CREATE INDEX profiles_user_id_idx ON public.profiles(user_id);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can manage own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**Colonnes :**
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Clé primaire |
| user_id | UUID | Référence auth.users |
| baby_name | TEXT | Prénom du bébé |
| birthdate | DATE | Date de naissance (calcul du mois côté client) |
| created_at | TIMESTAMPTZ | Date de création |
| updated_at | TIMESTAMPTZ | Date de dernière modification |

---

### Table : `subscriptions`
État de l'abonnement Stripe.

```sql
CREATE TABLE public.subscriptions (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id     TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan                   TEXT CHECK (plan IN ('monthly', 'annual')),
  status                 TEXT NOT NULL CHECK (status IN (
                           'active', 'cancelled', 'past_due',
                           'trialing', 'incomplete', 'unpaid'
                         )),
  current_period_end     TIMESTAMPTZ,
  cancel_at_period_end   BOOLEAN DEFAULT false,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX subscriptions_stripe_customer_idx ON public.subscriptions(stripe_customer_id);

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);
-- Seule la service_role key peut écrire (webhook Stripe)

-- Trigger updated_at
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**Valeurs de `status` :**
| Valeur | Signification |
|--------|--------------|
| `active` | Abonnement actif — accès complet |
| `trialing` | Période d'essai en cours — accès complet |
| `past_due` | Paiement en retard — accès limité |
| `cancelled` | Annulé — accès jusqu'à `current_period_end` |
| `incomplete` | Paiement initial échoué |
| `unpaid` | Plusieurs échecs de paiement |

---

### Table : `content`
Contenu de l'app — alimenté manuellement ou via scripts, jamais par les utilisateurs.

```sql
CREATE TABLE public.content (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mois        INTEGER NOT NULL CHECK (mois BETWEEN 0 AND 24),
  module      TEXT NOT NULL CHECK (module IN (
                'guide', 'coucher', 'soin', 'saison', 'audio', 'jeux'
              )),
  categorie   TEXT,
  situation   TEXT,
  ordre       INTEGER DEFAULT 0,
  data        JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les requêtes fréquentes
CREATE INDEX content_mois_module_idx ON public.content(mois, module);
CREATE INDEX content_categorie_idx ON public.content(categorie);

-- RLS — lecture publique (vérification abonnement côté app)
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content is readable by authenticated users"
  ON public.content FOR SELECT
  TO authenticated
  USING (true);
```

**Structure du champ `data` (JSONB) selon le module :**

Pour `module = 'guide'` :
```json
{
  "titre": "string",
  "explication": "string",
  "ancrage": "string",
  "action_immediate": {
    "titre": "string",
    "couleur": "#FCEBEB",
    "couleur_texte": "#A32D2D",
    "etapes": ["string"]
  },
  "action_complementaire": {
    "titre": "string",
    "couleur": "#E1F5EE",
    "couleur_texte": "#085041",
    "etapes": ["string"]
  },
  "action_parent": {
    "couleur": "#FBEAF0",
    "couleur_texte": "#72243E",
    "etapes": ["string"]
  },
  "preventif": "string",
  "erreurs": ["string"],
  "cadre_securite": "string"
}
```

Pour `module = 'audio'` :
```json
{
  "titre": "string",
  "duree_minutes": 8,
  "theme": "string",
  "trimestre": 1,
  "script": ["string (paragraphe)"]
}
```

Pour `module = 'jeux'` :
```json
{
  "titre": "string",
  "tags": ["Motricité", "Lien"],
  "age_minimum_jours": 10,
  "description": "string",
  "comment_faire": "string",
  "materiel": "string",
  "duree_recommandee": "string"
}
```

---

### Table : `pinned`
Protocoles épinglés par les utilisateurs.

```sql
CREATE TABLE public.pinned (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id  UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Index
CREATE INDEX pinned_user_id_idx ON public.pinned(user_id);

-- RLS
ALTER TABLE public.pinned ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can manage own pinned"
  ON public.pinned FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## Requêtes TypeScript fréquentes

### Récupérer le profil bébé
```typescript
const { data: profile, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .single()
```

### Vérifier l'abonnement actif
```typescript
const { data: subscription } = await supabase
  .from('subscriptions')
  .select('status, current_period_end')
  .eq('user_id', userId)
  .single()

const isActive = subscription?.status === 'active'
  && new Date(subscription.current_period_end) > new Date()
```

### Récupérer les protocoles d'un mois et module
```typescript
const { data: protocols } = await supabase
  .from('content')
  .select('id, categorie, situation, data')
  .eq('mois', babyMonth)
  .eq('module', 'guide')
  .order('categorie')
  .order('ordre')
```

### Récupérer un protocole spécifique
```typescript
const { data: protocol } = await supabase
  .from('content')
  .select('*')
  .eq('mois', babyMonth)
  .eq('module', 'guide')
  .eq('categorie', categorie)
  .eq('situation', situation)
  .single()
```

### Épingler / désépingler
```typescript
// Épingler
await supabase.from('pinned').insert({ user_id: userId, content_id: contentId })

// Désépingler
await supabase.from('pinned').delete()
  .eq('user_id', userId)
  .eq('content_id', contentId)

// Récupérer les épinglés avec le contenu
const { data: pinned } = await supabase
  .from('pinned')
  .select('id, content_id, content(mois, module, categorie, situation, data)')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

---

## Webhook Stripe — mise à jour abonnement

```typescript
// /app/api/stripe/webhook/route.ts
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return new Response('Webhook error', { status: 400 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await supabaseAdmin.from('subscriptions').upsert({
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        plan: subscription.items.data[0].price.recurring?.interval === 'year'
          ? 'annual' : 'monthly',
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'stripe_subscription_id' })
      break
    }
  }

  return new Response('OK', { status: 200 })
}
```

---

## Règles absolues base de données

1. **Toujours activer RLS** sur toutes les tables — sans exception
2. **Ne jamais exposer la service_role key** côté client
3. **Toujours utiliser des UUID** comme clés primaires
4. **Toujours ajouter `created_at` et `updated_at`** sur toutes les tables
5. **Les migrations sont irréversibles** — tester en local d'abord
6. **Le contenu n'est jamais modifié par les utilisateurs** — utiliser la service_role key pour les insertions de contenu
7. **Vérifier l'abonnement côté serveur** pour les routes API sensibles, pas seulement côté client

-- ============================================================
-- BeSerene — migration initiale
-- ============================================================
-- À exécuter dans le SQL Editor Supabase (dashboard.supabase.com)
-- Crée : 4 tables, index, trigger updated_at, politiques RLS.
-- ============================================================

-- ============================================================
-- 1. Fonction utilitaire — trigger updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. Table profiles — un profil bébé par utilisateur
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  baby_name   TEXT NOT NULL,
  birthdate   DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS profiles_user_id_idx
  ON public.profiles(user_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can manage own profile" ON public.profiles;
CREATE POLICY "users can manage own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 3. Table subscriptions — état d'abonnement Stripe
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  plan                    TEXT CHECK (plan IN ('monthly', 'annual')),
  status                  TEXT NOT NULL CHECK (status IN (
                            'active', 'cancelled', 'past_due',
                            'trialing', 'incomplete', 'unpaid'
                          )),
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN DEFAULT false,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx
  ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_idx
  ON public.subscriptions(stripe_customer_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can read own subscription" ON public.subscriptions;
CREATE POLICY "users can read own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);
-- Écriture uniquement via service_role (webhook Stripe).

DROP TRIGGER IF EXISTS subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 4. Table content — protocoles et contenu des 6 modules
-- ============================================================
CREATE TABLE IF NOT EXISTS public.content (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mois        INTEGER NOT NULL CHECK (mois BETWEEN 0 AND 24),
  module      TEXT NOT NULL CHECK (module IN (
                'guide', 'soin', 'saison', 'coucher', 'audio', 'jeux'
              )),
  categorie   TEXT,
  situation   TEXT,
  ordre       INTEGER DEFAULT 0,
  data        JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS content_mois_module_idx
  ON public.content(mois, module);
CREATE INDEX IF NOT EXISTS content_categorie_idx
  ON public.content(categorie);

ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "content is readable by authenticated users" ON public.content;
CREATE POLICY "content is readable by authenticated users"
  ON public.content FOR SELECT
  TO authenticated
  USING (true);
-- Écriture du contenu : uniquement via service_role.

DROP TRIGGER IF EXISTS content_updated_at ON public.content;
CREATE TRIGGER content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 5. Table pinned — protocoles épinglés par l'utilisateur
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pinned (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id  UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id)
);

CREATE INDEX IF NOT EXISTS pinned_user_id_idx
  ON public.pinned(user_id);

ALTER TABLE public.pinned ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can manage own pinned" ON public.pinned;
CREATE POLICY "users can manage own pinned"
  ON public.pinned FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

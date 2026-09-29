-- ============================================================
-- Migration : comptes admin + verrouillage du profil bébé
-- ============================================================
-- À exécuter dans le SQL Editor Supabase
-- https://supabase.com/dashboard/project/lhwbnfkmpglygttxzyib/sql/new
-- ============================================================
-- 1. Table `admins` : liste d'e-mails qui ont le mode « aperçu »
--    (naviguer entre les mois, changer le genre) et peuvent modifier
--    leur profil. Gérée uniquement depuis le dashboard Supabase :
--    RLS activée SANS policy → illisible et inmodifiable depuis l'app.
-- 2. Profil bébé verrouillé : un utilisateur peut créer son profil et
--    le lire, mais plus le modifier ni le supprimer. Seuls les admins
--    modifient le leur. Les corrections demandées par les parents se
--    font depuis le dashboard Supabase (Table Editor), qui passe outre
--    la RLS.
-- ============================================================

-- ----- 1. Admins --------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
  email      TEXT PRIMARY KEY CHECK (email = lower(email)),
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
-- Volontairement aucune policy.

-- L'utilisateur connecté est-il admin ? SECURITY DEFINER pour lire
-- `admins` et `auth.users` sans les exposer.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins a
    JOIN auth.users u ON lower(u.email) = a.email
    WHERE u.id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

INSERT INTO public.admins (email, note)
VALUES
  ('laura.treuillier@gmail.com', 'Laura, fondatrice'),
  ('camille.arnoult29.11@gmail.com', 'Camille, sœur'),
  ('clairearnoult4@gmail.com', 'Claire, sœur'),
  ('juliencatteau74@gmail.com', 'Julien'),
  ('treuillier.marie@orange.fr', 'Marie, sœur')
ON CONFLICT (email) DO NOTHING;

-- ----- 2. Verrou du profil ----------------------------------
DROP POLICY IF EXISTS "users can manage own profile" ON public.profiles;
DROP POLICY IF EXISTS "own profile" ON public.profiles;

DROP POLICY IF EXISTS "profile select own" ON public.profiles;
CREATE POLICY "profile select own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "profile insert own" ON public.profiles;
CREATE POLICY "profile insert own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "profile update admin" ON public.profiles;
CREATE POLICY "profile update admin"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id AND public.is_admin())
  WITH CHECK (auth.uid() = user_id AND public.is_admin());

-- Pas de policy DELETE : supprimer puis recréer son profil pour changer
-- la date est impossible. (La suppression du compte efface toujours le
-- profil via ON DELETE CASCADE.)

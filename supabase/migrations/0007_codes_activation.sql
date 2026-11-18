-- ============================================================
-- Migration : codes d'activation à l'inscription (18/11/2026)
-- ============================================================
-- À exécuter dans le SQL Editor Supabase
-- https://supabase.com/dashboard/project/lhwbnfkmpglygttxzyib/sql/new
-- ============================================================
-- Pendant la phase de test, l'inscription n'est ouverte qu'avec un code
-- d'activation (Laura, 18/11/2026). Premier code : BONNENUIT.
--
-- 1. `codes_activation` : la liste des codes. Laura les gère dans le
--    Table Editor : ajouter une ligne = nouveau code ; décocher `actif`
--    = code fermé (les comptes déjà créés avec ce code restent ouverts).
-- 2. `inscriptions` : qui s'est inscrit, avec quel code, quand.
--    Remplie par l'app (clé service), lisible dans le Table Editor.
--
-- Les deux tables ont la RLS activée SANS policy : l'app n'y accède
-- qu'avec la clé service, côté serveur. Un parent ne peut ni lire la
-- liste des codes ni s'ajouter lui-même.
--
-- Ce fichier peut être relancé sans risque.
-- ============================================================

-- ----- 1. Codes ---------------------------------------------
CREATE TABLE IF NOT EXISTS public.codes_activation (
  code       TEXT PRIMARY KEY CHECK (code = upper(code) AND code <> ''),
  actif      BOOLEAN NOT NULL DEFAULT true,
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.codes_activation ENABLE ROW LEVEL SECURITY;
-- Volontairement aucune policy.

INSERT INTO public.codes_activation (code, note)
VALUES ('BONNENUIT', 'Premier code, parents testeurs (novembre 2026)')
ON CONFLICT (code) DO NOTHING;

-- ----- 2. Inscriptions --------------------------------------
CREATE TABLE IF NOT EXISTS public.inscriptions (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT,
  nom        TEXT,
  prenom     TEXT,
  code       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Si une première version de ce fichier a déjà été lancée (sans « nom »).
ALTER TABLE public.inscriptions ADD COLUMN IF NOT EXISTS nom TEXT;

CREATE INDEX IF NOT EXISTS inscriptions_code_idx ON public.inscriptions (code);

ALTER TABLE public.inscriptions ENABLE ROW LEVEL SECURITY;
-- Volontairement aucune policy.

-- Les comptes créés avant les codes gardent leur accès.
INSERT INTO public.inscriptions (user_id, email, code, created_at)
SELECT id, email, 'AVANT_LES_CODES', created_at
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- ----- 3. Vue pratique : combien d'inscrits par code --------
CREATE OR REPLACE VIEW public.inscriptions_par_code
WITH (security_invoker = true) AS
SELECT code, count(*) AS inscrits, max(created_at) AS derniere_inscription
FROM public.inscriptions
GROUP BY code
ORDER BY code;

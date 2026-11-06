-- ============================================================
-- Migration : journées de rythme enregistrées par le parent (06/11/2026)
-- ============================================================
-- À exécuter dans le SQL Editor Supabase
-- https://supabase.com/dashboard/project/lhwbnfkmpglygttxzyib/sql/new
-- ============================================================
-- Outil « Enregistrer le rythme de mon bébé » (bouton de Repères clés,
-- page /rythme). Une ligne = un jour du calendrier (0h à 24h) d'un parent.
-- Autant de journées qu'il veut, sans rappel (Laura, 06/11/2026).
--
-- evenements : les moments notés, par ex.
--   [{"t":"endormi","h":"19:45","veille":true},   ← repris de la veille
--    {"t":"reveil","h":"06:30"}, {"t":"endormi","h":"08:30"}, …]
--
-- Ce fichier peut être relancé sans risque. S'il a déjà été lancé dans sa
-- première version (colonnes coucher_soir et sommeils, jamais utilisées),
-- il passe la table au nouveau format.

CREATE TABLE IF NOT EXISTS public.journees_rythme (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  jour        DATE NOT NULL,
  mois_bebe   INTEGER CHECK (mois_bebe BETWEEN 0 AND 23),
  evenements  JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(evenements) = 'array'),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, jour)
);

-- Passage depuis la première version, si elle a été lancée.
ALTER TABLE public.journees_rythme
  ADD COLUMN IF NOT EXISTS evenements JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.journees_rythme DROP COLUMN IF EXISTS coucher_soir;
ALTER TABLE public.journees_rythme DROP COLUMN IF EXISTS sommeils;

CREATE INDEX IF NOT EXISTS journees_rythme_user_jour_idx
  ON public.journees_rythme (user_id, jour DESC);

ALTER TABLE public.journees_rythme ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own journees rythme" ON public.journees_rythme;
CREATE POLICY "own journees rythme"
  ON public.journees_rythme FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

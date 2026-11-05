-- ============================================================
-- Migration : ajouter 'apaisement' comme module valide (05/11/2026)
-- ============================================================
-- À exécuter dans le SQL Editor Supabase
-- https://supabase.com/dashboard/project/lhwbnfkmpglygttxzyib/sql/new
-- ============================================================
-- Permet d'épingler les gestes de la rubrique « Gestes d'apaisement ».
-- Les fiches sont lues dans content/apaisement/gestes_apaisement.json ; la
-- table `content` ne porte qu'une ligne par geste (situation = id du geste),
-- créée par scripts/import-apaisement.mjs.

ALTER TABLE public.content
  DROP CONSTRAINT IF EXISTS content_module_check;

ALTER TABLE public.content
  ADD CONSTRAINT content_module_check
  CHECK (module IN (
    'guide',
    'soin',
    'saison',
    'coucher',
    'audio',
    'jeux',
    'reflexo',
    'apaisement'
  ));

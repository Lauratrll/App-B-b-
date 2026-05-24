-- ============================================================
-- Migration : ajouter 'reflexo' comme nouveau module valide
-- ============================================================
-- À exécuter dans le SQL Editor Supabase
-- https://supabase.com/dashboard/project/lhwbnfkmpglygttxzyib/sql/new
-- ============================================================
-- Permet d'épingler les sections "réflexologie" extraites des modules
-- Coucher, Soin et Jeux comme contenus indépendants.

-- Supprimer l'ancien CHECK constraint sur le module
ALTER TABLE public.content
  DROP CONSTRAINT IF EXISTS content_module_check;

-- Recréer avec 'reflexo' ajouté à la liste autorisée
ALTER TABLE public.content
  ADD CONSTRAINT content_module_check
  CHECK (module IN (
    'guide',
    'soin',
    'saison',
    'coucher',
    'audio',
    'jeux',
    'reflexo'
  ));

-- ============================================================
-- Migration : ajouter le champ `genre` au profil bébé
-- ============================================================
-- À exécuter dans le SQL Editor Supabase
-- https://supabase.com/dashboard/project/lhwbnfkmpglygttxzyib/sql/new
-- ============================================================
-- Permet de personnaliser les contenus genrés (berceuse, formulations
-- [Il/Elle], [aimé/aimée]…). Nullable : les profils existants restent
-- valides ; l'app retient la forme masculine par défaut tant que le genre
-- n'est pas renseigné.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS genre TEXT
  CHECK (genre IN ('garcon', 'fille'));

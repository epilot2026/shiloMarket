-- Migration 000007 : ajout de video_poster pour les shorts

ALTER TABLE public.shorts 
ADD COLUMN IF NOT EXISTS video_poster text;

COMMENT ON COLUMN public.shorts.video_poster IS 'URL de la vignature (poster) de la vidéo short';

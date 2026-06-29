-- Migration 000004 : buckets Supabase Storage pour les médias

-- Création des buckets
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, false, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('annonces', 'annonces', true, false, 20971520, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'application/pdf']),
  ('shorts', 'shorts', true, false, 104857600, ARRAY['video/mp4', 'video/webm'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================
-- RLS Storage : lecture publique pour les buckets publics
-- ============================================================
CREATE POLICY "avatars_public_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_owner_all"
  ON storage.objects FOR ALL
  USING (bucket_id = 'avatars' AND auth.uid() = owner);

CREATE POLICY "annonces_public_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'annonces');

CREATE POLICY "annonces_authenticated_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'annonces' AND auth.role() = 'authenticated');

CREATE POLICY "annonces_owner_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'annonces' AND auth.uid() = owner);

CREATE POLICY "shorts_public_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'shorts');

CREATE POLICY "shorts_authenticated_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'shorts' AND auth.role() = 'authenticated');

CREATE POLICY "shorts_owner_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'shorts' AND auth.uid() = owner);

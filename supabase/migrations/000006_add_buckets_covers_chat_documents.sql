-- Migration 000006 : buckets Supabase Storage supplémentaires (covers, chat, documents)

-- Ajout des buckets manquants
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES
  ('covers', 'covers', true, false, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('chat', 'chat', true, false, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'application/pdf']),
  ('documents', 'documents', true, false, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS pour covers
CREATE POLICY "covers_public_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

CREATE POLICY "covers_owner_all"
  ON storage.objects FOR ALL
  USING (bucket_id = 'covers' AND auth.uid() = owner);

-- RLS pour chat
CREATE POLICY "chat_public_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chat');

CREATE POLICY "chat_authenticated_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'chat' AND auth.role() = 'authenticated');

CREATE POLICY "chat_owner_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'chat' AND auth.uid() = owner);

-- RLS pour documents
CREATE POLICY "documents_public_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

CREATE POLICY "documents_authenticated_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "documents_owner_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents' AND auth.uid() = owner);

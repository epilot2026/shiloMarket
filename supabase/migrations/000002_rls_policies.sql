-- Migration 000002 : Row Level Security (RLS) pour ShiloMarket

-- ============================================================
-- Activation RLS sur toutes les tables métier
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annonces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annonce_medias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Profils
-- ============================================================
CREATE POLICY "profiles_public_read"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_self_insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_self_update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================
-- Phone mappings (lecture publique pour authentification)
-- ============================================================
CREATE POLICY "phone_mappings_public_read"
  ON public.phone_mappings FOR SELECT
  USING (true);

-- ============================================================
-- Pages
-- ============================================================
CREATE POLICY "pages_public_read"
  ON public.pages FOR SELECT
  USING (true);

CREATE POLICY "pages_owner_all"
  ON public.pages FOR ALL
  USING (auth.uid() = owner_id);

-- ============================================================
-- Annonces
-- ============================================================
CREATE POLICY "annonces_public_read"
  ON public.annonces FOR SELECT
  USING (true);

CREATE POLICY "annonces_owner_all"
  ON public.annonces FOR ALL
  USING (auth.uid() = author_id);

-- ============================================================
-- Médias des annonces
-- ============================================================
CREATE POLICY "annonce_medias_public_read"
  ON public.annonce_medias FOR SELECT
  USING (true);

CREATE POLICY "annonce_medias_owner_all"
  ON public.annonce_medias FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.annonces
      WHERE annonces.id = annonce_medias.annonce_id
        AND annonces.author_id = auth.uid()
    )
  );

-- ============================================================
-- Shorts
-- ============================================================
CREATE POLICY "shorts_public_read"
  ON public.shorts FOR SELECT
  USING (true);

CREATE POLICY "shorts_owner_all"
  ON public.shorts FOR ALL
  USING (auth.uid() = author_id);

-- ============================================================
-- Réactions
-- ============================================================
CREATE POLICY "reactions_public_read"
  ON public.reactions FOR SELECT
  USING (true);

CREATE POLICY "reactions_self_all"
  ON public.reactions FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- Commentaires
-- ============================================================
CREATE POLICY "comments_public_read"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "comments_self_all"
  ON public.comments FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- Signets
-- ============================================================
CREATE POLICY "bookmarks_self_all"
  ON public.bookmarks FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- Abonnements
-- ============================================================
CREATE POLICY "follows_public_read"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "follows_self_all"
  ON public.follows FOR ALL
  USING (auth.uid() = follower_id);

-- ============================================================
-- Conversations (lecture seulement si participant)
-- ============================================================
CREATE POLICY "conversations_participant_read"
  ON public.conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants
      WHERE conversation_participants.conversation_id = conversations.id
        AND conversation_participants.user_id = auth.uid()
    )
  );

-- ============================================================
-- Participants aux conversations
-- ============================================================
CREATE POLICY "conversation_participants_participant_read"
  ON public.conversation_participants FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.conversation_participants AS cp
      WHERE cp.conversation_id = conversation_participants.conversation_id
        AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "conversation_participants_self_insert"
  ON public.conversation_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "conversation_participants_self_update"
  ON public.conversation_participants FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- Messages
-- ============================================================
CREATE POLICY "messages_participant_read"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
        AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "messages_sender_insert"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "messages_sender_update"
  ON public.messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- ============================================================
-- Notifications
-- ============================================================
CREATE POLICY "notifications_self_read"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_self_update"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Migration 000001 : schéma de base ShiloMarket
-- Tables, types, indexes et publication realtime.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- Types de comptes, catégories et transactions (checks textuels)
-- ============================================================

-- ============================================================
-- Profils utilisateurs (liés à auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text UNIQUE NOT NULL,
  account_type text NOT NULL CHECK (account_type IN ('client', 'proprietaire', 'prestataire', 'agence', 'entreprise')),
  avatar_url text,
  bio text,
  location text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Mapping téléphone <-> email dérivé, pour lookup rapide et unicité
CREATE TABLE IF NOT EXISTS public.phone_mappings (
  phone text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- Pages (agence / entreprise / propriétaire)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('agence', 'entreprise', 'proprietaire')),
  description text,
  avatar_url text,
  cover_url text,
  verified boolean DEFAULT false,
  followers_count integer DEFAULT 0,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- Annonces
-- ============================================================
CREATE TABLE IF NOT EXISTS public.annonces (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  page_id uuid REFERENCES public.pages(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('maisons', 'vehicules', 'services', 'immobilier', 'terrains', 'solutions-it')),
  transaction text NOT NULL CHECK (transaction IN ('louer', 'vendre', 'devis')),
  price integer NOT NULL,
  price_suffix text,
  currency text DEFAULT 'FCFA',
  location text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'louee', 'vendue', 'en_attente')),
  certified boolean DEFAULT false,
  available boolean DEFAULT true,
  reactions_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Médias des annonces
CREATE TABLE IF NOT EXISTS public.annonce_medias (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  annonce_id uuid NOT NULL REFERENCES public.annonces(id) ON DELETE CASCADE,
  url text NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'video', 'document')),
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- Shorts vidéos
-- ============================================================
CREATE TABLE IF NOT EXISTS public.shorts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  page_id uuid REFERENCES public.pages(id) ON DELETE SET NULL,
  video_url text NOT NULL,
  caption text,
  annonce_id uuid REFERENCES public.annonces(id) ON DELETE SET NULL,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- Réactions, commentaires, signets, abonnements
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('annonce', 'short', 'comment')),
  target_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'like' CHECK (type IN ('like', 'love', 'wow')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('annonce', 'short')),
  target_id uuid NOT NULL,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookmarks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  annonce_id uuid NOT NULL REFERENCES public.annonces(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, annonce_id)
);

CREATE TABLE IF NOT EXISTS public.follows (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  page_id uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (follower_id, page_id)
);

-- ============================================================
-- Messagerie
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  annonce_id uuid REFERENCES public.annonces(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_read_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'voice', 'image', 'location', 'document')),
  content text NOT NULL,
  media_url text,
  read_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- Notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('reaction', 'comment', 'message', 'follow', 'new_annonce', 'certification', 'system')),
  payload jsonb NOT NULL DEFAULT '{}',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- Indexes pour la performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_annonces_author_id ON public.annonces(author_id);
CREATE INDEX IF NOT EXISTS idx_annonces_page_id ON public.annonces(page_id);
CREATE INDEX IF NOT EXISTS idx_annonces_category ON public.annonces(category);
CREATE INDEX IF NOT EXISTS idx_annonces_transaction ON public.annonces(transaction);
CREATE INDEX IF NOT EXISTS idx_annonces_status ON public.annonces(status);
CREATE INDEX IF NOT EXISTS idx_annonces_created_at ON public.annonces(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_annonces_certified ON public.annonces(certified) WHERE certified = true;
CREATE INDEX IF NOT EXISTS idx_annonces_location_trgm ON public.annonces USING gin (location gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_annonces_search ON public.annonces USING gin ((title || ' ' || description || ' ' || location) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_annonce_medias_annonce_id ON public.annonce_medias(annonce_id);
CREATE INDEX IF NOT EXISTS idx_reactions_target ON public.reactions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_comments_target ON public.comments(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_annonce ON public.bookmarks(annonce_id);
CREATE INDEX IF NOT EXISTS idx_follows_page ON public.follows(page_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, created_at DESC) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_phone_mappings_phone ON public.phone_mappings(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- ============================================================
-- Publication realtime pour les fonctionnalités temps réel
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.follows;
ALTER PUBLICATION supabase_realtime ADD TABLE public.annonces;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shorts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;

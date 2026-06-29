-- Migration 000003 : triggers, fonctions et notifications automatiques

-- ============================================================
-- Mise à jour automatique de updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER annonces_updated_at
  BEFORE UPDATE ON public.annonces
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER shorts_updated_at
  BEFORE UPDATE ON public.shorts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Création automatique du profil à l'inscription
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_phone text;
  v_account_type text;
  v_email text;
BEGIN
  v_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  v_account_type := COALESCE(NEW.raw_user_meta_data->>'account_type', 'client');
  v_email := COALESCE(NEW.email, v_phone || '@shilomarket.com');

  INSERT INTO public.profiles (id, full_name, phone, account_type, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur'),
    v_phone,
    v_account_type,
    'user'
  )
  ON CONFLICT (id) DO NOTHING;

  IF v_phone <> '' THEN
    INSERT INTO public.phone_mappings (phone, user_id, email)
    VALUES (v_phone, NEW.id, v_email)
    ON CONFLICT (phone) DO UPDATE SET user_id = EXCLUDED.user_id, email = EXCLUDED.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Compteurs de réactions
-- ============================================================
CREATE OR REPLACE FUNCTION public.reactions_counter()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.target_type = 'annonce' THEN
      UPDATE public.annonces SET reactions_count = reactions_count + 1 WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'short' THEN
      UPDATE public.shorts SET likes_count = likes_count + 1 WHERE id = NEW.target_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.target_type = 'annonce' THEN
      UPDATE public.annonces SET reactions_count = reactions_count - 1 WHERE id = OLD.target_id;
    ELSIF OLD.target_type = 'short' THEN
      UPDATE public.shorts SET likes_count = likes_count - 1 WHERE id = OLD.target_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reactions_counter_trigger ON public.reactions;
CREATE TRIGGER reactions_counter_trigger
  AFTER INSERT OR DELETE ON public.reactions
  FOR EACH ROW EXECUTE FUNCTION public.reactions_counter();

-- ============================================================
-- Compteurs de commentaires
-- ============================================================
CREATE OR REPLACE FUNCTION public.comments_counter()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.target_type = 'annonce' THEN
      UPDATE public.annonces SET comments_count = comments_count + 1 WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'short' THEN
      UPDATE public.shorts SET comments_count = comments_count + 1 WHERE id = NEW.target_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.target_type = 'annonce' THEN
      UPDATE public.annonces SET comments_count = comments_count - 1 WHERE id = OLD.target_id;
    ELSIF OLD.target_type = 'short' THEN
      UPDATE public.shorts SET comments_count = comments_count - 1 WHERE id = OLD.target_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS comments_counter_trigger ON public.comments;
CREATE TRIGGER comments_counter_trigger
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.comments_counter();

-- ============================================================
-- Compteurs d'abonnements
-- ============================================================
CREATE OR REPLACE FUNCTION public.follows_counter()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.pages SET followers_count = followers_count + 1 WHERE id = NEW.page_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.pages SET followers_count = followers_count - 1 WHERE id = OLD.page_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS follows_counter_trigger ON public.follows;
CREATE TRIGGER follows_counter_trigger
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.follows_counter();

-- ============================================================
-- Mise à jour du timestamp de conversation à chaque message
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations SET updated_at = now() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS messages_update_conversation_trigger ON public.messages;
CREATE TRIGGER messages_update_conversation_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_timestamp();

-- ============================================================
-- Notifications automatiques
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  recipient_id uuid;
  sender_name text;
BEGIN
  SELECT full_name INTO sender_name FROM public.profiles WHERE id = NEW.sender_id;

  FOR recipient_id IN
    SELECT user_id FROM public.conversation_participants
    WHERE conversation_id = NEW.conversation_id AND user_id <> NEW.sender_id
  LOOP
    INSERT INTO public.notifications (user_id, type, payload)
    VALUES (recipient_id, 'message', jsonb_build_object(
      'conversation_id', NEW.conversation_id,
      'sender_id', NEW.sender_id,
      'sender_name', sender_name,
      'preview', NEW.content,
      'type', NEW.type
    ));
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_new_message_trigger ON public.messages;
CREATE TRIGGER notify_new_message_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_message();

CREATE OR REPLACE FUNCTION public.notify_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  author_id uuid;
  commenter_name text;
  target_title text;
BEGIN
  SELECT full_name INTO commenter_name FROM public.profiles WHERE id = NEW.user_id;

  IF NEW.target_type = 'annonce' THEN
    SELECT author_id, title INTO author_id, target_title FROM public.annonces WHERE id = NEW.target_id;
  ELSIF NEW.target_type = 'short' THEN
    SELECT author_id, caption INTO author_id, target_title FROM public.shorts WHERE id = NEW.target_id;
  END IF;

  IF author_id IS NOT NULL AND author_id <> NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, payload)
    VALUES (author_id, 'comment', jsonb_build_object(
      'target_type', NEW.target_type,
      'target_id', NEW.target_id,
      'target_title', target_title,
      'comment_id', NEW.id,
      'commenter_id', NEW.user_id,
      'commenter_name', commenter_name,
      'content', NEW.content
    ));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_new_comment_trigger ON public.comments;
CREATE TRIGGER notify_new_comment_trigger
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_comment();

CREATE OR REPLACE FUNCTION public.notify_new_reaction()
RETURNS TRIGGER AS $$
DECLARE
  author_id uuid;
  reactor_name text;
  target_title text;
BEGIN
  SELECT full_name INTO reactor_name FROM public.profiles WHERE id = NEW.user_id;

  IF NEW.target_type = 'annonce' THEN
    SELECT author_id, title INTO author_id, target_title FROM public.annonces WHERE id = NEW.target_id;
  ELSIF NEW.target_type = 'short' THEN
    SELECT author_id, caption INTO author_id, target_title FROM public.shorts WHERE id = NEW.target_id;
  END IF;

  IF author_id IS NOT NULL AND author_id <> NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, payload)
    VALUES (author_id, 'reaction', jsonb_build_object(
      'target_type', NEW.target_type,
      'target_id', NEW.target_id,
      'target_title', target_title,
      'reactor_id', NEW.user_id,
      'reactor_name', reactor_name,
      'reaction_type', NEW.type
    ));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_new_reaction_trigger ON public.reactions;
CREATE TRIGGER notify_new_reaction_trigger
  AFTER INSERT ON public.reactions
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_reaction();

CREATE OR REPLACE FUNCTION public.notify_new_follow()
RETURNS TRIGGER AS $$
DECLARE
  page_owner_id uuid;
  follower_name text;
  page_name text;
BEGIN
  SELECT owner_id, name INTO page_owner_id, page_name FROM public.pages WHERE id = NEW.page_id;
  SELECT full_name INTO follower_name FROM public.profiles WHERE id = NEW.follower_id;

  IF page_owner_id IS NOT NULL AND page_owner_id <> NEW.follower_id THEN
    INSERT INTO public.notifications (user_id, type, payload)
    VALUES (page_owner_id, 'follow', jsonb_build_object(
      'page_id', NEW.page_id,
      'page_name', page_name,
      'follower_id', NEW.follower_id,
      'follower_name', follower_name
    ));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_new_follow_trigger ON public.follows;
CREATE TRIGGER notify_new_follow_trigger
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_follow();

CREATE OR REPLACE FUNCTION public.notify_new_annonce()
RETURNS TRIGGER AS $$
DECLARE
  follower_id uuid;
  page_name text;
BEGIN
  IF NEW.page_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT name INTO page_name FROM public.pages WHERE id = NEW.page_id;

  FOR follower_id IN
    SELECT follower_id FROM public.follows WHERE page_id = NEW.page_id
  LOOP
    INSERT INTO public.notifications (user_id, type, payload)
    VALUES (follower_id, 'new_annonce', jsonb_build_object(
      'annonce_id', NEW.id,
      'page_id', NEW.page_id,
      'page_name', page_name,
      'title', NEW.title
    ));
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_new_annonce_trigger ON public.annonces;
CREATE TRIGGER notify_new_annonce_trigger
  AFTER INSERT ON public.annonces
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_annonce();

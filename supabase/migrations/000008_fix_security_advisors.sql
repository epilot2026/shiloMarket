-- Migration 000008 : correction des avertissements de sécurité Supabase

-- 1. Fix search_path mutable sur toutes les fonctions
ALTER FUNCTION public.set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.reactions_counter() SET search_path = public, pg_temp;
ALTER FUNCTION public.comments_counter() SET search_path = public, pg_temp;
ALTER FUNCTION public.follows_counter() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_conversation_timestamp() SET search_path = public, pg_temp;
ALTER FUNCTION public.notify_new_message() SET search_path = public, pg_temp;
ALTER FUNCTION public.notify_new_comment() SET search_path = public, pg_temp;
ALTER FUNCTION public.notify_new_reaction() SET search_path = public, pg_temp;
ALTER FUNCTION public.notify_new_follow() SET search_path = public, pg_temp;
ALTER FUNCTION public.notify_new_annonce() SET search_path = public, pg_temp;
ALTER FUNCTION public.get_conversations(uuid) SET search_path = public, pg_temp;

-- 2. Revoke EXECUTE on handle_new_user from anon and authenticated (trigger-only function)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- 3. Revoke EXECUTE on get_conversations from anon (keep authenticated)
REVOKE EXECUTE ON FUNCTION public.get_conversations(uuid) FROM anon;

-- 4. Correction du bug follower_id ambigu dans notify_new_annonce
CREATE OR REPLACE FUNCTION public.notify_new_annonce()
RETURNS TRIGGER AS $$
DECLARE
  v_follower_id uuid;
  v_page_name text;
BEGIN
  IF NEW.page_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT name INTO v_page_name FROM public.pages WHERE id = NEW.page_id;

  FOR v_follower_id IN
    SELECT f.follower_id FROM public.follows f WHERE f.page_id = NEW.page_id
  LOOP
    INSERT INTO public.notifications (user_id, type, payload)
    VALUES (v_follower_id, 'new_annonce', jsonb_build_object(
      'annonce_id', NEW.id,
      'page_id', NEW.page_id,
      'page_name', v_page_name,
      'title', NEW.title
    ));
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

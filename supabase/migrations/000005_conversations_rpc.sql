-- Migration 000005 : fonction RPC pour lister les conversations d'un utilisateur

CREATE OR REPLACE FUNCTION public.get_conversations(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  updated_at timestamptz,
  last_preview text,
  last_kind text,
  unread_count bigint,
  page jsonb,
  annonce_title text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.updated_at,
    COALESCE(m.content, '') AS last_preview,
    COALESCE(m.type, 'text') AS last_kind,
    (
      SELECT COUNT(*)::bigint
      FROM public.messages msg
      WHERE msg.conversation_id = c.id
        AND msg.sender_id <> p_user_id
        AND msg.read_at IS NULL
    ) AS unread_count,
    jsonb_build_object(
      'id', p.id,
      'name', p.full_name,
      'type', p.account_type,
      'description', p.bio,
      'avatar_url', p.avatar_url,
      'cover_url', NULL,
      'verified', p.verified,
      'followers_count', 0,
      'location', p.location
    ) AS page,
    a.title AS annonce_title
  FROM public.conversations c
  JOIN public.conversation_participants cp ON cp.conversation_id = c.id AND cp.user_id = p_user_id
  JOIN public.conversation_participants other ON other.conversation_id = c.id AND other.user_id <> p_user_id
  JOIN public.profiles p ON p.id = other.user_id
  LEFT JOIN public.annonces a ON a.id = c.annonce_id
  LEFT JOIN LATERAL (
    SELECT content, type
    FROM public.messages
    WHERE conversation_id = c.id
    ORDER BY created_at DESC
    LIMIT 1
  ) m ON true
  ORDER BY c.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

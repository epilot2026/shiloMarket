-- Migration 000009 : ajout du rôle super_admin et politiques RLS admin

-- 1. Ajouter la colonne role dans profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'super_admin'));

-- 2. Fonction pour vérifier si l'utilisateur courant est super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT COALESCE(
    (SELECT role = 'super_admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- 3. Politiques RLS super_admin sur toutes les tables sensibles
DROP POLICY IF EXISTS annonces_admin_all ON public.annonces;
CREATE POLICY annonces_admin_all
  ON public.annonces FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS pages_admin_all ON public.pages;
CREATE POLICY pages_admin_all
  ON public.pages FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS shorts_admin_all ON public.shorts;
CREATE POLICY shorts_admin_all
  ON public.shorts FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS profiles_admin_all ON public.profiles;
CREATE POLICY profiles_admin_all
  ON public.profiles FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS comments_admin_all ON public.comments;
CREATE POLICY comments_admin_all
  ON public.comments FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS reactions_admin_all ON public.reactions;
CREATE POLICY reactions_admin_all
  ON public.reactions FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS annonce_medias_admin_all ON public.annonce_medias;
CREATE POLICY annonce_medias_admin_all
  ON public.annonce_medias FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS notifications_admin_read ON public.notifications;
CREATE POLICY notifications_admin_read
  ON public.notifications FOR SELECT
  USING (public.is_super_admin());

-- 4. Revoke EXECUTE sur is_super_admin de anon
REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM anon;

-- 5. Créer l'utilisateur super admin
-- Identifiants : phone = 061245789, mot de passe = shilomarket@2026!
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
SELECT
  gen_random_uuid(),
  '061245789@shilomarket.com',
  crypt('shilomarket@2026!', gen_salt('bf')),
  now(),
  now(),
  now(),
  jsonb_build_object('full_name', 'Super Admin', 'phone', '061245789', 'account_type', 'agence', 'role', 'super_admin')
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = '061245789@shilomarket.com');

-- 6. Mettre à jour le profil du super admin
UPDATE public.profiles SET
  role = 'super_admin',
  verified = true,
  avatar_url = 'https://i.pravatar.cc/300?img=68',
  bio = 'Super administrateur ShiloMarket',
  location = 'Brazzaville'
WHERE id = (SELECT id FROM auth.users WHERE email = '061245789@shilomarket.com');

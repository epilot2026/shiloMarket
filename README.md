# ShiloMarket — Documentation

## Identifiants par défaut

### Super Admin
- **Téléphone :** `061245789`
- **Mot de passe :** `shilomarket@2026!`

### Utilisateurs de test
| Nom | Téléphone | Type | Mot de passe |
|---|---|---|---|
| Moussa Kiba | 069865360 | proprietaire | ShiloMarket2026! |
| Aminata Diallo | 061234567 | client | ShiloMarket2026! |
| Patrick Ngoma | 067654321 | agence | ShiloMarket2026! |
| Grâce Makosso | 068765432 | entreprise | ShiloMarket2026! |
| Junior Mboumba | 069876543 | prestataire | ShiloMarket2026! |
| Christelle Loubelo | 062345678 | proprietaire | ShiloMarket2026! |
| Hervé Malonga | 063456789 | client | ShiloMarket2026! |
| Sephora Nguesso | 064567890 | agence | ShiloMarket2026! |

## Architecture

### Stack
- **Frontend :** React 19 + TypeScript + Vite + TailwindCSS
- **Backend :** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **PWA :** vite-plugin-pwa (service worker, offline, installable)

### Structure du projet
```
app/src/
  components/     # Composants UI réutilisables
  context/        # Contexts React (Auth, Data, Message, Toast)
  lib/            # Utils (supabase, phone, config, format)
  pages/          # Pages/routes de l'app
  services/       # Services Supabase (auth, annonces, messages, etc.)
  types/          # Types TypeScript
```

### Rôles utilisateurs
- **`user`** : utilisateur standard (client, proprietaire, prestataire, agence, entreprise)
- **`super_admin`** : accès complet au dashboard admin (`/admin`)

### Sécurité
- **RLS** activée sur toutes les tables
- **`is_super_admin()`** : fonction SQL SECURITY DEFINER
- Politiques admin sur 8 tables (annonces, pages, shorts, profiles, comments, reactions, medias, notifications)
- `handle_new_user()` : tout nouvel inscrit = `role = 'user'`

### Migrations SQL
1. `000001_init_schema.sql` — schéma de base
2. `000002_rls_policies.sql` — politiques RLS
3. `000003_triggers_functions.sql` — triggers et notifications
4. `000004_get_conversations_rpc.sql` — RPC messagerie
5. `000005_storage_buckets.sql` — buckets storage
6. `000006_add_buckets_covers_chat_documents.sql` — buckets supplémentaires
7. `000007_add_video_poster_to_shorts.sql` — colonne video_poster
8. `000008_fix_security_advisors.sql` — corrections sécurité
9. `000009_add_super_admin_role.sql` — rôle super_admin + RLS admin

### Services
- `auth.service.ts` — inscription, connexion, déconnexion, profil
- `annonces.service.ts` — CRUD annonces avec médias
- `messages.service.ts` — conversations, messages, realtime
- `notifications.service.ts` — notifications avec realtime
- `interactions.service.ts` — likes, saves, follows, comments
- `pages.service.ts` — pages (agences, entreprises, propriétaires)
- `shorts.service.ts` — shorts vidéo
- `storage.service.ts` — upload avec compression WebP < 120ko
- `admin.service.ts` — dashboard admin (stats, modération)

### Buckets Storage
- `avatars` (5MB, images)
- `covers` (5MB, images)
- `annonces` (20MB, images/vidéos/PDF)
- `shorts` (100MB, vidéos)
- `chat` (10MB, images/vidéos/PDF)
- `documents` (10MB, PDF/Word/images)

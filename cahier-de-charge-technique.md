# Cahier des charges — Volet technique (ShiloMarket)

> Complément du `cahier de charge.md`. Détaille l'architecture, la stack, le modèle de données
> et la stratégie de branchement Supabase **différé** (démo sans backend).

---

## 1. Stack technique

| Couche | Choix | Notes |
|--------|-------|-------|
| Build | **Vite** | Rapide, support PWA |
| UI | **React 18 + TypeScript** | Composants typés |
| Styles | **TailwindCSS** | Mobile-first, design tokens |
| Routage | **React Router v6** | SPA |
| Icônes | **lucide-react** | Cohérent, léger |
| Backend (futur) | **Supabase** | Auth, Postgres, Storage, Realtime |
| PWA | **vite-plugin-pwa** | Manifest + service worker |
| État | **React Context** | Auth + données démo |

---

## 2. Architecture du projet

```
shiloMarket/
├─ cahier de charge.md
├─ cahier-de-charge-technique.md
├─ maquettes/
├─ screenshot/
└─ app/                      ← application React (démo)
   ├─ index.html
   ├─ package.json
   ├─ vite.config.ts
   ├─ tailwind.config.js
   ├─ .env.example           ← clés Supabase (non utilisées en démo)
   └─ src/
      ├─ main.tsx
      ├─ App.tsx             ← routes
      ├─ index.css           ← Tailwind + tokens
      ├─ lib/
      │  ├─ supabase.ts      ← client placeholder (non connecté)
      │  └─ config.ts        ← DEMO_MODE = true
      ├─ types/index.ts      ← types métier
      ├─ data/               ← données mock
      │  ├─ users.ts
      │  ├─ annonces.ts
      │  ├─ pages.ts
      │  ├─ shorts.ts
      │  └─ messages.ts
      ├─ services/           ← couche d'accès (mock | supabase)
      │  ├─ auth.service.ts
      │  └─ annonces.service.ts
      ├─ context/
      │  └─ AuthContext.tsx
      ├─ components/
      │  ├─ layout/ (AppLayout, BottomNav, Sidebar, TopBar)
      │  └─ ui/ (Button, Badge, Chip, Avatar, Card…)
      └─ pages/
         ├─ auth/ (Login, Register)
         ├─ Feed, Marketplace, AnnonceDetail
         ├─ Shorts, Messages, Conversation
         └─ Profile
```

> Règle projet : **tout fichier > ~400 lignes est découpé** en sous-composants.

---

## 3. Stratégie « Supabase différé » (mode démo)

### 3.1 Principe

Un drapeau global **`DEMO_MODE`** (dans `lib/config.ts`) commande la source de données :

- `DEMO_MODE = true` → les **services** renvoient les **données mock** (en mémoire).
- `DEMO_MODE = false` (futur) → les **services** appellent **Supabase**.

Les écrans ne consomment **jamais** Supabase directement : ils passent par la couche `services/`.
Le branchement futur se fait donc **sans toucher aux écrans**.

### 3.2 Client Supabase (placeholder)

```ts
// lib/supabase.ts — non connecté en démo
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL ?? ''
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

// En démo, url/key sont vides : le client n'est pas réellement utilisé.
export const supabase = url && key ? createClient(url, key) : null
```

### 3.3 Variables d'environnement (`.env.example`)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_DEMO_MODE=true
```

---

## 4. Modèle de données (cible Supabase)

> Schéma prévu pour la phase P1. **Non créé en démo** (servira de référence aux migrations SQL).

### 4.1 Entités principales

| Table | Champs clés |
|-------|-------------|
| `profiles` | id, full_name, phone, account_type, avatar_url, bio, location, verified |
| `pages` | id, owner_id, name, type (agence/entreprise/proprietaire), cover_url, verified, followers_count |
| `annonces` | id, author_id, page_id, title, description, category, transaction (louer/vendre), price, currency, location, status, certified, available, created_at |
| `annonce_medias` | id, annonce_id, url, type (image/video), position |
| `shorts` | id, author_id, page_id, video_url, caption, annonce_id, likes, comments, shares |
| `reactions` | id, user_id, target_type, target_id, type (like/love/wow) |
| `comments` | id, user_id, target_type, target_id, content, created_at |
| `bookmarks` | id, user_id, annonce_id |
| `follows` | id, follower_id, page_id |
| `conversations` | id, participant_a, participant_b, annonce_id, last_message_at |
| `messages` | id, conversation_id, sender_id, type (text/voice/image), content, media_url, read_at, created_at |
| `notifications` | id, user_id, type, payload, read, created_at |

### 4.2 Énumérations

- `account_type` : `client | proprietaire | prestataire | agence | entreprise`
- `category` : `maisons | vehicules | services | immobilier | terrains`
- `transaction` : `louer | vendre`
- `annonce_status` : `active | louee | vendue | en_attente`

### 4.3 Sécurité (P1)

- **Supabase Auth** : OTP par téléphone (`+242`).
- **RLS** : un utilisateur ne modifie que ses `profiles`, `annonces`, `messages`.
- **Storage** : buckets `avatars`, `annonces`, `shorts` (lecture publique, écriture authentifiée).

---

## 5. Couche services (contrat)

```ts
// services/annonces.service.ts (extrait du contrat)
export interface AnnoncesService {
  list(filters?: AnnonceFilters): Promise<Annonce[]>
  getById(id: string): Promise<Annonce | null>
  certified(): Promise<Annonce[]>
}
```

Implémentations :

- `MockAnnoncesService` (démo) — lit `data/annonces.ts`.
- `SupabaseAnnoncesService` (P1) — requêtes `supabase.from('annonces')`.

Le choix se fait via `DEMO_MODE` dans un **factory**.

---

## 6. Scripts NPM

| Script | Action |
|--------|--------|
| `npm run dev` | Serveur de développement Vite |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualisation du build |

---

## 7. Plan de branchement Supabase (P1)

1. Créer le projet Supabase + renseigner `.env`.
2. Exécuter les migrations SQL (tables du §4) + politiques RLS.
3. Implémenter les `Supabase*Service`.
4. Basculer `VITE_DEMO_MODE=false`.
5. Activer Auth OTP, Storage, Realtime (messagerie).

> Aucune modification des écrans n'est nécessaire grâce à la couche `services/`.

---

## 8. Tests & qualité (recommandations)

- Tests de rendu des écrans clés (feed, marketplace, détail).
- Tests responsive (breakpoints 375 / 768 / 1280).
- Vérification de l'accessibilité (focus, contrastes, labels).

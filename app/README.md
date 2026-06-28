# ShiloMarket — Application (Démo)

PWA sociale & marketplace (React + TypeScript + Vite + TailwindCSS). **Mode démo** : données fictives en mémoire, **Supabase non connecté**.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir l'URL affichée (par défaut `http://localhost:5173`).

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run preview` — prévisualiser le build
- `npm run test` — lance les tests unitaires (Vitest)
- `npm run test:watch` — tests en mode watch

## Fonctionnalités interactives (démo, en mémoire)

Même sans backend, ces flux fonctionnent réellement (état en mémoire, perdu au rechargement) :

- **Publier une annonce** (`/publier`) : formulaire **validé** (titre, catégorie, prix, localisation, description) ; l'annonce créée apparaît en tête du feed et du marketplace.
- **J'aime / Enregistrer / Partager** : bascule réelle sur les cartes, compteurs mis à jour, **toasts** de confirmation, copie du lien.
- **Connexion / Inscription** : **validation** des champs, états de **chargement** et d'**erreur**.
- **Recherche & filtres** marketplace, **deep-link** `?cat=` depuis les catégories.
- **Shorts** navigables au **clavier** (flèches) avec boutons précédent/suivant.
- **États de chargement** (skeletons), **page 404** et **ErrorBoundary** global.

## Mode démo vs Supabase

Le drapeau `VITE_DEMO_MODE` (voir `.env.example`) commande la source de données :

- `true` (défaut) — les services lisent les **données mock** (`src/data`).
- `false` — branchera **Supabase** (phase P1) via `src/lib/supabase.ts`.

Les écrans ne consomment jamais Supabase directement : ils passent par `src/services/`,
ce qui permet de brancher la base plus tard **sans modifier l'interface**.

### Authentification (démo)

L'authentification est **simulée** (`src/context/AuthContext.tsx`). Sur les écrans Connexion /
Inscription, n'importe quelles valeurs connectent un utilisateur fictif (persisté dans `localStorage`).

## Structure

```
src/
├─ lib/          config (DEMO_MODE), client Supabase placeholder, formatage
├─ types/        types métier
├─ data/         données mock (users, pages, annonces, shorts, messages)
├─ services/     couche d'accès (mock | supabase à venir)
├─ context/      AuthContext (auth simulée)
├─ constants.tsx catégories, types de comptes, filtres
├─ components/   layout (Sidebar, BottomNav, AppLayout), ui, feed, marketplace
└─ pages/        auth (Login, Register), Feed, Marketplace, AnnonceDetail,
                 Shorts, Messages, Conversation, Profile
```

## Écrans

Accueil (feed), Marketplace + détail annonce, Shorts, Messages + conversation, Profil, Connexion, Inscription.

## Responsive

Mobile-first. Barre de navigation basse sur mobile/tablette, sidebar verticale sur desktop (`lg`).

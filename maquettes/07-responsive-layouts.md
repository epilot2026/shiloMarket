# Maquette — Layouts responsive (PWA)

> Déclinaison **mobile-first** de ShiloMarket vers tablette et desktop.
> Une seule base de code, adaptée par breakpoints.

---

## 1. Breakpoints

| Cible | Largeur | Navigation | Colonnes |
|-------|---------|------------|----------|
| **Mobile** | `< 768 px` | Barre inférieure 5 onglets + FAB | 1 |
| **Tablette** | `768–1023 px` | Barre inférieure, contenu max `720 px` | 1–2 |
| **Desktop** | `≥ 1024 px` | Sidebar verticale gauche | 2–4 + panneau droit |

---

## 2. Mobile (référence)

```
┌─────────────────────┐
│ En-tête / Titre     │
├─────────────────────┤
│                     │
│   Contenu           │
│   (1 colonne)       │
│                     │
│              ┌────┐ │
│              │ ✏️ │ │  ← FAB
│              └────┘ │
├─────────────────────┤
│ 🏠 🛒 ▶️ 💬 👤      │  ← barre nav
└─────────────────────┘
```

- Cibles tactiles ≥ 44 px, gestes de swipe (carrousels, Shorts).
- FAB « Publier » présent sur Accueil/Marketplace.
- Barre nav fixe en bas (safe-area respectée).

---

## 3. Tablette

```
┌───────────────────────────────────────┐
│ En-tête / Titre                        │
├───────────────────────────────────────┤
│        ┌───────────────────────┐       │
│        │   Contenu centré      │       │  ← max 720 px
│        │   (1–2 colonnes)      │       │
│        │                       │       │
│        └───────────────────────┘       │
├───────────────────────────────────────┤
│        🏠 🛒 ▶️ 💬 👤                  │
└───────────────────────────────────────┘
```

- Marketplace : grille **3 colonnes**.
- Feed : colonne centrée + « Pages suggérées » sur 3 cartes.
- Messages : split liste + conversation en mode paysage.

---

## 4. Desktop

```
┌────────────┬──────────────────────┬──────────────┐
│  SIDEBAR   │   CONTENU PRINCIPAL   │  PANNEAU      │
│            │                       │  DROIT        │
│ 🏪 Shilo   │   Feed / Marketplace  │  Pages        │
│ 🏠 Accueil │   (max 680 px)        │  suggérées    │
│ 🛒 Market  │                       │  Tendances    │
│ ▶️ Shorts  │                       │  Publicité    │
│ 💬 Messages│                       │               │
│ 👤 Profil  │                       │               │
│            │                       │               │
│ [Publier]  │                       │               │
└────────────┴──────────────────────┴──────────────┘
```

- **Sidebar gauche** (`240 px`) : logo + 5 items + bouton **Publier** (remplace le FAB et la barre du bas).
- **Colonne centrale** : feed `680 px` / Marketplace en grille `4 colonnes`.
- **Panneau droit** (`300 px`) : pages suggérées, tendances, espace promotionnel.
- **Shorts** : vidéo centrée pleine hauteur, navigation par flèches ▲▼.
- **Messages** : 3 zones (sidebar · liste conversations · conversation).

---

## 5. Adaptation des composants

| Composant | Mobile | Tablette | Desktop |
|-----------|--------|----------|---------|
| Navigation | Barre basse | Barre basse | Sidebar gauche |
| Publier | FAB ✏️ | FAB ✏️ | Bouton sidebar |
| Grille Marketplace | 2 col. | 3 col. | 4 col. |
| Feed | Pleine largeur | Centré 680 px | Centré + panneau droit |
| Détail annonce | Empilé | Empilé | 2 colonnes (galerie/infos) |
| Messages | Vue par pile | Split paysage | 3 panneaux |
| Shorts | Plein écran | Centré flouté | Centré + flèches |
| Auth | Pleine largeur | Carte centrée | Split branding/formulaire |

---

## 6. Règles PWA & performance

- **Manifest** : nom « ShiloMarket », thème `#1FA84D`, icône maison, mode `standalone`.
- **Service worker** : cache shell + feed récent + annonces consultées (offline-first).
- **Images** : `srcset` responsive, lazy-loading, format moderne (WebP/AVIF).
- **Installable** : bannière « Ajouter à l'écran d'accueil ».
- **Push** : messages, réactions, nouvelles annonces des pages suivies.
- **Safe areas** : respect des encoches/barres système (env(safe-area-inset-*)).
- **Mode sombre** : variante optionnelle (fonds sombres, vert conservé comme accent).

---

## 7. Récapitulatif visuel des breakpoints

```
< 768px        768–1023px            ≥ 1024px
┌──────┐       ┌────────────┐        ┌──┬──────┬──┐
│ ▤    │       │   ▤▤       │        │▥ │ ▤▤▤ │▥ │
│ ▤▤   │  →    │   ▤▤       │   →    │▥ │ ▤▤▤ │▥ │
│ ▤▤   │       │   ▤▤       │        │▥ │ ▤▤▤ │▥ │
│ ===  │       │   ===      │        └──┴──────┴──┘
└──────┘       └────────────┘        sidebar+contenu+panneau
nav bas        nav bas centré        nav latérale
```

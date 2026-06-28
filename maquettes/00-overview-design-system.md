# ShiloMarket — Maquettes & Design System

> PWA sociale & marketplace pour le Congo (Brazzaville). Langue : **français**. Devise : **FCFA**.
> Approche **mobile-first**, responsive **mobile / tablette / desktop**.
> Plateforme inédite — aucune référence à une autre application.

---

## 1. Concept

ShiloMarket combine **4 univers** dans une seule application :

- **Réseau social d'annonces** — un fil (feed) où l'on publie des annonces et services.
- **Marketplace** — recherche structurée de biens à louer / vendre (maisons, véhicules, etc.).
- **Shorts** — vidéos verticales courtes pour présenter biens et services.
- **Messagerie** — chat, messages vocaux et appels vidéo entre clients, propriétaires et prestataires.

**Promesse :** « Publiez, louez et discutez en toute confiance. »

---

## 2. Palette de couleurs

| Rôle | Nom | Hex | Usage |
|------|-----|-----|-------|
| Primaire | `vert-principal` | `#1FA84D` | Boutons, liens actifs, logo, accents |
| Primaire foncé | `vert-fonce` | `#178A40` | Survol / état pressé |
| Primaire clair | `vert-clair` | `#E6F4EA` | Fonds de catégories, badges doux, halos |
| Certifié | `violet-certifie` | `#7C3AED` | Badge « Certifié » des pages/annonces |
| Localisation | `bleu-loc` | `#2563EB` | Icône localisation |
| Vidéo / Live | `rouge-video` | `#E03131` | Icône vidéo, indicateur direct |
| Fond app | `blanc` | `#FFFFFF` | Arrière-plan principal |
| Fond doux | `gris-fond` | `#F2F3F5` | Champs, cartes, sections |
| Bordure | `gris-bordure` | `#E5E7EB` | Séparateurs, contours de champs |
| Texte principal | `noir-texte` | `#1A1A1A` | Titres, valeurs |
| Texte secondaire | `gris-texte` | `#6B7280` | Sous-titres, placeholders, méta |

**Réactions** (emoji) : 👍 bleu `#2563EB` · ❤️ rouge `#E03131` · 😍 jaune `#F5A623`.

```
Aperçu rapide
█ #1FA84D  vert-principal      █ #7C3AED  violet-certifie
█ #178A40  vert-fonce          █ #F2F3F5  gris-fond
█ #E6F4EA  vert-clair          █ #1A1A1A  noir-texte
```

---

## 3. Typographie

- **Police** : sans-serif géométrique (ex. *Inter*, *Poppins* ou system-ui).
- **Échelle (mobile-first)** :

| Token | Taille | Poids | Usage |
|-------|--------|-------|-------|
| `display` | 28 px | 800 | Titres d'écran d'accueil (« Rejoignez ShiloMarket ») |
| `h1` | 22 px | 700 | Titres de section |
| `h2` | 18 px | 700 | Titres de carte / prix |
| `body` | 15 px | 400 | Texte courant |
| `meta` | 13 px | 500 | Localisation, temps, compteurs |
| `caption` | 12 px | 500 | Tags, labels de badge |

---

## 4. Composants transverses

- **Boutons primaires** : fond `vert-principal`, texte blanc, rayon `12 px`, hauteur `52 px`, pleine largeur sur mobile.
- **Boutons secondaires** : contour `vert-principal`, texte vert, fond transparent.
- **Champs de saisie** : fond `gris-fond`, rayon `12 px`, icône à gauche, hauteur `56 px`.
- **Chips / filtres** : pilule, contour gris ; état actif = fond `vert-principal` + texte blanc (ou icône ✓).
- **Cartes** : fond blanc, rayon `16 px`, ombre douce, padding `16 px`.
- **Badges** : `Certifié` (violet, icône ✓), `Annonce certifiée` (vert clair + ✓ vert), `Vérifié` page (✓ violet ou vert).
- **FAB** (bouton flottant) : rond `56 px`, fond `vert-principal`, icône crayon ✏️, en bas à droite au-dessus de la barre.

---

## 5. Navigation

### Barre inférieure (mobile / tablette) — 5 onglets
```
┌───────────────────────────────────────────────┐
│  🏠        🛒          ▶️         💬        👤   │
│ Accueil  Marketplace  Shorts   Messages  Profil │
└───────────────────────────────────────────────┘
```
- Onglet actif : icône + label en `vert-principal`.
- Shorts : pastille centrale mise en avant (rond plein).

### En-tête (Accueil)
- Logo **ShiloMarket** (texte vert), 🔍 recherche, 🔔 notifications (pastille rouge), ☰ menu.

### Desktop — barre latérale gauche
Sur ≥ 1024 px, la barre inférieure devient une **sidebar verticale** à gauche (logo + 5 items + bouton « Publier »).

---

## 6. Breakpoints responsive (mobile-first)

| Cible | Largeur | Layout |
|-------|---------|--------|
| **Mobile** | `< 768 px` | 1 colonne, barre nav en bas, FAB visible |
| **Tablette** | `768–1023 px` | 1–2 colonnes, contenu centré max `720 px`, nav en bas |
| **Desktop** | `≥ 1024 px` | 3 zones : sidebar gauche · feed central (max `680 px`) · panneau droit (pages/pub) |

Principes :
- On dessine d'abord le mobile, puis on **étend** vers tablette/desktop.
- Les grilles passent de **1 → 2 → 3/4 colonnes** selon la largeur.
- Cibles tactiles ≥ `44 px`. Contraste AA minimum.

---

## 7. Capacités PWA

- **Installable** (manifest + icône maison verte sur fond vert dégradé).
- **Hors-ligne** : cache du feed récent et des annonces consultées (service worker).
- **Notifications push** : nouveaux messages, réactions, annonces de pages suivies.
- **Accès média** : caméra/micro pour Shorts, photos d'annonces, appels vidéo.
- **Splash screen** : logo maison + « ShiloMarket ».

---

## 8. Index des maquettes

| Fichier | Écran |
|---------|-------|
| `01-authentification.md` | Connexion + Inscription |
| `02-accueil-feed.md` | Accueil / fil d'annonces |
| `03-marketplace.md` | Marketplace + détail annonce |
| `04-shorts.md` | Shorts (vidéos verticales) |
| `05-messages.md` | Messagerie + conversation |
| `06-profil-pages.md` | Profil + Pages |
| `07-responsive-layouts.md` | Déclinaisons desktop / tablette / mobile |

---

## 9. Types de comptes

| Type | Icône | Description |
|------|-------|-------------|
| **Client** | 👤 | Recherche, contacte, réagit, enregistre des annonces |
| **Propriétaire** | 🔑 | Publie ses biens (maisons, véhicules, terrains) |
| **Prestataire** | 🛠️ | Propose des services |
| **Agence** | 🏢 | Gère un portefeuille de biens, page vérifiée |
| **Entreprise** | 🏬 | Vitrine commerciale, page vérifiée |

> Les pages **Agence / Entreprise / Propriétaire** peuvent obtenir un badge **Certifié** (violet) ou **Vérifié** (vert).

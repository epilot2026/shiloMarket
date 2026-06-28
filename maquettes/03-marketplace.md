# Maquette — Marketplace

> Recherche structurée des annonces. Mobile-first.
> Couleurs : titre & prix `vert-principal`, filtre actif vert plein, badges `Certifié` violet.

---

## 1. Liste Marketplace (mobile)

```
┌─────────────────────────────────────┐
│ Marketplace                    ⚙️    │  ← titre vert + filtres avancés
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🔍 Rechercher une maison, un    │ │  ← barre de recherche
│ │    véhic…                       │ │
│ └─────────────────────────────────┘ │
│ ┌────────┐┌────────────┐┌─────────┐ │
│ │✓ Tout  ││Maisons à   ││Véhicules│→│  ← chips filtres (Tout actif)
│ │        ││  louer     ││ à louer │ │
│ └────────┘└────────────┘└─────────┘ │
├─────────────────────────────────────┤
│ ⭐ Annonces certifiées               │  ← section mise en avant
│ ┌──────────────┐ ┌──────────────┐    │
│ │✔Certifié  🔖 │ │✔Certifié  🔖 │    │  ← badge + bookmark
│ │ [ image ]    │ │ [ image ]    │ →  │
│ │350 000 FCFA/m│ │180 000 FCFA/m│    │  ← prix vert gras
│ │Maison meublée│ │Appartement   │    │  ← titre
│ │4 pièces à lou│ │meublé Moungali│   │
│ │📍 Brazzaville│ │📍 Moungali   │    │  ← localisation
│ └──────────────┘ └──────────────┘    │
├─────────────────────────────────────┤
│ Toutes les annonces                  │
│ ┌──────────────┐ ┌──────────────┐    │  ← grille 2 colonnes
│ │✔Certifié  🔖 │ │✔Certifié  🔖 │    │
│ │ [ image ]    │ │ [ image ]    │    │
│ │350 000 FCFA/m│ │180 000 FCFA/m│    │
│ │Maison meublée│ │Appartement   │    │
│ └──────────────┘ └──────────────┘    │
│ ┌──────────────┐ ┌──────────────┐    │
│ │ …            │ │ …            │    │
├─────────────────────────────────────┤
│ 🏠   🛒    ▶️    💬    👤            │
└─────────────────────────────────────┘
```

### Éléments
- **Titre « Marketplace »** : vert, gras ; icône `⚙️` = filtres avancés (panneau).
- **Recherche** : champ `gris-fond`, recherche temps réel.
- **Chips filtres** (scroll horiz.) : `Tout` (actif = vert plein + ✓), `Maisons à louer`, `Véhicules à louer`, `Services`, `Terrains`, `À vendre`…
- **Section « ⭐ Annonces certifiées »** : carrousel horizontal de cartes prioritaires.
- **Section « Toutes les annonces »** : grille **2 colonnes** (mobile).
- **Carte annonce** : badge `✔ Certifié` (violet) en haut-gauche, `🔖` enregistrer en haut-droite, image 4:3, prix vert gras, titre 2 lignes max, localisation `📍`.

---

## 2. Filtres avancés (panneau)

```
┌─────────────────────────────────────┐
│ ←   Filtres                  Réinit. │
│                                      │
│ Catégorie                            │
│ [Maisons][Véhicules][Services]…      │  ← chips multi
│                                      │
│ Transaction                          │
│ ( ) À louer   ( ) À vendre  (•) Tout │
│                                      │
│ Localisation                         │
│ ┌─────────────────────────────────┐ │
│ │ 📍 Brazzaville, quartier…       │ │
│ └─────────────────────────────────┘ │
│                                      │
│ Budget (FCFA)                        │
│  Min [ 50 000 ]   Max [ 500 000 ]    │
│  |———●——————————————●———|            │  ← slider double
│                                      │
│ Options                              │
│ ☑ Annonces certifiées uniquement     │
│ ☑ Disponible immédiatement           │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │      Afficher 128 résultats     │ │  ← bouton vert
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 3. Détail d'une annonce

```
┌─────────────────────────────────────┐
│ ←                          🔖   ↗   │  ← retour, enregistrer, partager
│ ┌─────────────────────────────────┐ │
│ │ ▬▬▬ ─── ─── ───          1/3   │ │  ← galerie photos
│ │        [ photo du bien ]        │ │
│ └─────────────────────────────────┘ │
│ ✔ Certifié                           │  ← badge violet
│ Maison meublée 4 pièces à louer      │  ← titre h1
│ 350 000 FCFA / mois  [Disponible ✓]  │  ← prix vert + badge
│ 📍 Moungali, Brazzaville             │
│ 🏢 Appartements · Meublé · 4 pièces  │  ← attributs
│ ──────────────────────────────────── │
│ Description                          │
│ Belle maison moderne entièrement     │
│ meublée, quartier calme et sécurisé… │
│ ──────────────────────────────────── │
│ Publié par                           │
│ (👤) Shilo Immobilier ✔  4820 abonnés│
│      ┌──────────┐                    │
│      │Voir page │                    │
│      └──────────┘                    │
│ ──────────────────────────────────── │
│ 👍❤️😍 86   ·  12 commentaires        │
│ 👍 J'aime  💬 Commenter  ↗ Partager  │
├─────────────────────────────────────┤
│ ┌────────────────┐ ┌────┐ ┌────┐    │  ← barre d'action collée bas
│ │ 💬 Discuter     │ │ 📞 │ │ 🎥 │    │
│ └────────────────┘ └────┘ └────┘    │
└─────────────────────────────────────┘
```

### Interactions
- **Galerie** : swipe, plein écran au tap.
- **Discuter / 📞 / 🎥** : barre d'action sticky en bas (toujours visible).
- **Voir page** : ouvre la page de l'annonceur (autres annonces, Shorts, abonnés).
- **Annonce certifiée** : gage de confiance, mise en avant dans les listes.

---

## 4. États

- **Vide / aucun résultat** : illustration + « Aucune annonce ne correspond. Modifiez vos filtres. »
- **Chargement** : squelettes de cartes (placeholders gris).
- **Hors-ligne** : annonces déjà consultées affichées depuis le cache PWA.

---

## 5. Responsive

| Cible | Grille « Toutes les annonces » |
|-------|--------------------------------|
| **Mobile** | 2 colonnes |
| **Tablette** | 3 colonnes, filtres en barre latérale rétractable |
| **Desktop** | 4 colonnes + panneau de filtres permanent à gauche ; détail annonce en 2 colonnes (galerie gauche / infos droite) |

```
Desktop — détail annonce
┌───────────────────────┬───────────────────────┐
│  [ galerie photos ]   │ ✔ Certifié             │
│   ▢ ▢ ▢ ▢ (miniat.)   │ Maison meublée 4 pièces│
│                       │ 350 000 FCFA / mois    │
│                       │ 📍 Moungali            │
│                       │ Description…           │
│                       │ (👤) Shilo Immo ✔      │
│                       │ [💬 Discuter][📞][🎥]  │
└───────────────────────┴───────────────────────┘
```

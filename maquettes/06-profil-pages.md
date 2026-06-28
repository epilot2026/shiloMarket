# Maquette — Profil & Pages

> Gestion du profil utilisateur, des annonces, et des pages (Agence / Entreprise / Propriétaire). Mobile-first.
> Couleurs : accents `vert-principal`, badge `Certifié` violet, fonds `gris-fond`.

---

## 1. État non connecté

```
┌─────────────────────────────────────┐
│ Profil                               │  ← titre vert gras
├─────────────────────────────────────┤
│                                      │
│              👤 (vert)               │  ← avatar placeholder (halo vert clair)
│                                      │
│    Bienvenue sur ShiloMarket         │  ← titre gras
│                                      │
│   Connectez-vous pour gérer votre    │  ← gris-texte
│   profil, vos annonces et vos pages. │
│                                      │
│       ┌──────────────────┐           │
│       │   Se connecter   │           │  ← bouton vert
│       └──────────────────┘           │
│                                      │
├─────────────────────────────────────┤
│ 🏠   🛒    ▶️    💬    👤•           │
└─────────────────────────────────────┘
```

---

## 2. Profil connecté

```
┌─────────────────────────────────────┐
│ Profil                        ⚙️     │  ← paramètres
│                                      │
│           (👤 grande)                │  ← avatar
│        Melack Mabiala                │  ← nom
│        Client · +242 06 000 0000     │  ← type de compte + tel
│        ┌──────────────┐              │
│        │ Modifier      │             │  ← bouton contour vert
│        └──────────────┘              │
│   ─────────────────────────────────  │
│    12        4         86            │  ← stats
│  Annonces  Pages   Enregistrés       │
│   ─────────────────────────────────  │
│  📦 Mes annonces                  >  │
│  🏢 Mes pages                     >  │
│  🔖 Enregistrés                   >  │
│  ▶️ Mes Shorts                    >  │
│  🔔 Notifications                 >  │
│  💳 Paiements & abonnements       >  │
│  ⚙️ Paramètres                    >  │
│  ❓ Aide & support                >  │
│  ──────────────────────────────────  │
│  🚪 Déconnexion                      │  ← texte rouge
├─────────────────────────────────────┤
│ 🏠   🛒    ▶️    💬    👤•           │
└─────────────────────────────────────┘
```

### Sections
- **En-tête** : avatar, nom, type de compte (Client / Propriétaire / …), téléphone, bouton **Modifier**.
- **Statistiques** : annonces publiées, pages, enregistrés.
- **Mes annonces** : liste avec statut (`Active`, `Louée`, `En attente`), édition/suppression.
- **Mes pages** : pages possédées/gérées (créer une page Agence/Entreprise).
- **Enregistrés** : annonces sauvegardées (🔖).
- **Mes Shorts** : vidéos publiées.

---

## 3. Page (Agence / Entreprise / Propriétaire)

```
┌─────────────────────────────────────┐
│ ←   Shilo Immobilier            ↗   │
│ ┌─────────────────────────────────┐ │
│ │        [ cover image ]          │ │  ← bannière
│ └─────────────────────────────────┘ │
│   (👤)                               │  ← avatar chevauchant
│   Shilo Immobilier ✔(violet)         │  ← nom + Certifié
│   🏢 Agence immobilière · Brazzaville │
│   4820 abonnés · 56 annonces         │
│   ┌──────────┐ ┌──────────┐          │
│   │ S'abonner │ │ 💬 Contacter│       │  ← abonner (vert) + contacter
│   └──────────┘ └──────────┘          │
│   ─────────────────────────────────  │
│   [ Annonces ] [ Shorts ] [ À propos ]│  ← onglets
│   ─────────────────────────────────  │
│   ┌──────────────┐ ┌──────────────┐  │  ← grille annonces de la page
│   │✔ [ image ]   │ │✔ [ image ]   │  │
│   │350 000 FCFA/m│ │180 000 FCFA/m│  │
│   │Maison meublée│ │Appartement   │  │
│   └──────────────┘ └──────────────┘  │
└─────────────────────────────────────┘
```

### Onglets de page
- **Annonces** : grille des biens de la page.
- **Shorts** : vidéos de la page.
- **À propos** : description, horaires, localisation (carte), contacts, badge de certification.

---

## 4. Modifier le profil

```
┌─────────────────────────────────────┐
│ ←   Modifier le profil    Enregistrer│
│           (👤)  📷                   │  ← changer photo
│ Nom complet                          │
│ ┌─────────────────────────────────┐ │
│ │ Melack Mabiala                  │ │
│ └─────────────────────────────────┘ │
│ Téléphone (vérifié ✓)                │
│ ┌─────────────────────────────────┐ │
│ │ +242 06 000 0000                │ │
│ └─────────────────────────────────┘ │
│ Bio                                  │
│ ┌─────────────────────────────────┐ │
│ │ Parlez de vous…                 │ │
│ └─────────────────────────────────┘ │
│ Localisation                         │
│ ┌─────────────────────────────────┐ │
│ │ 📍 Brazzaville                  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 5. Menu latéral (☰ depuis l'Accueil)

```
┌──────────────────────┐
│ (👤) Melack Mabiala   │
│      Voir le profil   │
│ ──────────────────── │
│ 📦 Mes annonces       │
│ 🏢 Mes pages          │
│ 🔖 Enregistrés        │
│ 🔔 Notifications      │
│ 🌙 Thème              │
│ ⚙️ Paramètres         │
│ ❓ Aide               │
│ 🚪 Déconnexion        │
└──────────────────────┘
```

---

## 6. Responsive

| Cible | Layout |
|-------|--------|
| **Mobile** | 1 colonne, liste d'options verticale, nav en bas |
| **Tablette** | En-tête profil centré, options en 2 colonnes |
| **Desktop** | Sidebar nav à gauche · profil/page centré ; page avec cover large + grille 3–4 colonnes ; menu latéral remplacé par la sidebar |

```
Desktop — page
┌────────────┬──────────────────────────────────────┐
│ Sidebar    │ ┌──────── cover ────────┐             │
│ nav        │ (👤) Shilo Immo ✔  [S'abonner][💬]    │
│            │ [Annonces][Shorts][À propos]          │
│            │ ▢ ▢ ▢ ▢   (grille 4 col.)             │
│            │ ▢ ▢ ▢ ▢                               │
└────────────┴──────────────────────────────────────┘
```

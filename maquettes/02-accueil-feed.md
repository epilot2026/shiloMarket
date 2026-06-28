# Maquette — Accueil / Feed

> Fil d'annonces type réseau social. Mobile-first.
> Couleurs : logo & accents `vert-principal`, fonds catégories `vert-clair`, badges `Certifié` violet.

---

## 1. Vue d'ensemble (mobile)

```
┌─────────────────────────────────────┐
│ ShiloMarket     🔍   🔔•   ☰        │  ← en-tête (logo vert)
├─────────────────────────────────────┤
│ (👤) Publiez une annonce ou un       │  ← composer
│      service…                        │
│   🖼️ Photos   🎥 Vidéo   📍 Localis. │
├─────────────────────────────────────┤
│ ┌────┐┌────┐┌────┐┌────┐┌────┐       │  ← catégories (scroll horiz.)
│ │🏠  ││🚗  ││🧳  ││🏢  ││⛰️ │ →     │
│ │Mais││Véhi││Serv││Immo││Terr│       │
│ └────┘└────┘└────┘└────┘└────┘       │
├─────────────────────────────────────┤
│ Pages suggérées                      │
│ ┌──────────────┐ ┌──────────────┐    │
│ │ [cover img]  │ │ [cover img]  │    │
│ │  (👤)        │ │  (👤)        │    │
│ │ Shilo Immo ✔ │ │ Congo Auto ✔ │    │
│ │ 4820 abonnés │ │ 2640 abonnés │ →  │
│ │ ┌──────────┐ │ │ ┌──────────┐ │    │
│ │ │Voir page │ │ │ │Voir page │ │    │
│ │ └──────────┘ │ │ └──────────┘ │    │
│ └──────────────┘ └──────────────┘    │
├─────────────────────────────────────┤
│ ┌─── CARTE ANNONCE (voir §2) ───────┐│
│ │ ...                               ││
│ └───────────────────────────────────┘│
│                              ┌─────┐ │
│                              │ ✏️  │ │  ← FAB publier
│                              └─────┘ │
├─────────────────────────────────────┤
│ 🏠   🛒    ▶️    💬    👤            │  ← barre nav
│ Accueil Market Shorts Mess. Profil   │
└─────────────────────────────────────┘
```

---

## 2. Carte d'annonce (post)

```
┌───────────────────────────────────────┐
│ (👤) Shilo Immobilier ✔(violet)        │  ← nom + badge certifié
│      📍 Moungali, Brazzaville · 5 h     │  ← localisation + temps
│      🏢 Appartements                    │  ← tag catégorie (vert clair)
│                                         │
│  Maison meublée 4 pièces à louer        │  ← titre (h2 gras)
│  Belle maison moderne de 4 pièces       │  ← description (2-3 lignes…)
│  entièrement meublée, située dans un    │
│  quartier calme et sécurisé. Eau et     │
│  électricité disponibles, parking …     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ▬▬▬ ─── ─── ───          1/3   │   │  ← carrousel photos + indicateur
│  │        [ photo du bien ]        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  350 000 FCFA / mois   [Disponible ✓]   │  ← prix vert gras + badge dispo
│  ✔ Annonce certifiée                    │  ← badge vert clair
│                                         │
│  👍❤️😍 86      12 commentaires · Partages│  ← compteurs réactions
│  ─────────────────────────────────────  │
│  👍 J'aime   💬 Commenter  🔖 Enreg.  ↗ Partager│  ← barre d'actions
│  ─────────────────────────────────────  │
│  ┌──────────────────┐ ┌────┐ ┌────┐    │
│  │ 💬  Discuter      │ │ 📞 │ │ 🎥 │    │  ← contacter
│  └──────────────────┘ └────┘ └────┘    │
└───────────────────────────────────────┘
```

### Éléments & interactions
- **En-tête post** : tap sur avatar/nom → page de l'annonceur.
- **Badge certifié** : ✔ violet `#7C3AED` à côté du nom des pages vérifiées.
- **Tag catégorie** : pilule `vert-clair` (ex. `🏢 Appartements`).
- **Carrousel** : swipe horizontal, barres d'avancement en haut, compteur `1/3`.
- **Prix** : `vert-principal`, gras, format `350 000 FCFA / mois`.
- **Badge « Disponible immédiatement »** : pilule `vert-clair`, texte vert.
- **Réactions** : appui long sur 👍 ouvre le sélecteur (👍 ❤️ 😍 …). Compteur agrégé.
- **Barre d'actions** : `J'aime`, `Commenter`, `Enregistrer`, `Partager`.
- **Contacter** : `Discuter` (vert plein, ouvre la messagerie), `📞` appel, `🎥` appel vidéo (boutons `vert-clair`).

---

## 3. Composer (création rapide)

```
┌─────────────────────────────────────┐
│ (👤) Publiez une annonce ou un       │
│      service…                        │  ← ouvre l'éditeur complet au tap
│ ──────────────────────────────────── │
│  🖼️ Photos     🎥 Vidéo    📍 Localis.│
└─────────────────────────────────────┘
```
Au tap → éditeur plein écran : titre, description, catégorie, prix, photos/vidéo, localisation, type (à louer/à vendre/service), bouton **Publier** (vert).

---

## 4. En-tête — actions

- **🔍 Recherche** : ouvre la recherche globale (annonces, pages, lieux).
- **🔔 Notifications** : pastille rouge si non lues ; réactions, commentaires, messages, nouvelles annonces des pages suivies.
- **☰ Menu** : paramètres, mes annonces, mes pages, enregistrés, aide, déconnexion.

---

## 5. Catégories

`Maisons` 🏠 · `Véhicules` 🚗 · `Services` 🧳 · `Immobilier` 🏢 · `Terrains` ⛰️ (scroll horizontal, extensible).
Chaque catégorie : icône verte sur pastille `vert-clair`, libellé dessous. Tap → Marketplace filtré.

---

## 6. Responsive

| Cible | Layout du feed |
|-------|----------------|
| **Mobile** | 1 colonne, catégories en scroll horizontal, FAB visible, nav en bas |
| **Tablette** | Feed centré max `680 px` ; « Pages suggérées » en 3 cartes visibles |
| **Desktop** | 3 colonnes : sidebar nav (gauche) · feed central `680 px` · colonne droite (Pages suggérées + raccourcis) |

```
Desktop
┌────────────┬────────────────────┬──────────────┐
│ ShiloMarket│  Composer          │ Pages         │
│ 🏠 Accueil │  ┌──────────────┐  │ suggérées     │
│ 🛒 Market  │  │  Carte post  │  │ ┌──────────┐  │
│ ▶️ Shorts  │  │              │  │ │ Shilo ✔  │  │
│ 💬 Messages│  └──────────────┘  │ └──────────┘  │
│ 👤 Profil  │  ┌──────────────┐  │ Tendances     │
│ [Publier]  │  │  Carte post  │  │ #immobilier   │
└────────────┴────────────────────┴──────────────┘
```

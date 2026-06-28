# Maquette — Shorts

> Vidéos verticales courtes pour présenter biens et services. Plein écran, mobile-first.
> Couleurs : fond vidéo (média), texte blanc, accents `vert-principal`, badge `Vérifié` violet/vert.

---

## 1. Lecteur Shorts (mobile)

```
┌─────────────────────────────────────┐
│            Shorts                    │  ← titre centré (overlay haut)
│                                      │
│                                      │
│                                      │
│        [ vidéo verticale            │
│          plein écran ]              │
│                                  ❤️  │  ← rail d'actions (droite)
│                                 1240 │
│                                  💬  │
│                                   86 │
│                                  ↗   │
│                                   45 │
│                                  ⊕   │  ← Suivre
│                               Suivre │
│                                  💬  │
│                             Contacter│
│                                      │
│ (👤) Shilo Immobilier ✔              │  ← auteur + badge (bas gauche)
│ Visite express de cette villa        │  ← description
│ moderne 🏡✨ #immobilier             │
│ ┌────────────┐ ┌──────────────┐      │
│ │🏠 Maisons  │ │📍 Brazzaville│      │  ← tags
│ └────────────┘ └──────────────┘      │
├─────────────────────────────────────┤
│ 🏠   🛒    ▶️    💬    👤            │  ← nav (Shorts actif = pastille)
└─────────────────────────────────────┘
```

---

## 2. Rail d'actions (droite)

| Icône | Action | Compteur |
|-------|--------|----------|
| ❤️ | J'aime | `1240` |
| 💬 | Commentaires | `86` |
| ↗ | Partager | `45` |
| ⊕ **Suivre** | S'abonner à la page | — |
| 💬 **Contacter** | Ouvre la messagerie / appel | — |

- Tap ❤️ → like animé (cœur qui pulse, devient vert/rouge).
- Le bloc auteur + description vit en **bas à gauche**, lisible sur fond sombre (dégradé d'assombrissement bas).
- Tap sur l'auteur → page de l'annonceur.

---

## 3. Interactions

- **Swipe vertical** : haut/bas pour changer de Short.
- **Tap simple** : pause / lecture.
- **Double tap** : like rapide.
- **Tags** (`🏠 Maisons`, `📍 Brazzaville`) : pilules semi-transparentes, tap → filtre Marketplace correspondant.
- **Contacter** : lance une conversation liée au bien présenté.
- **Lecture auto** : le Short suivant se lance au scroll ; le son démarre au tap.

---

## 4. Création d'un Short

```
┌─────────────────────────────────────┐
│ ←   Nouveau Short            Publier │
│ ┌─────────────────────────────────┐ │
│ │       [ aperçu caméra ]         │ │
│ │                                 │ │
│ │   🔴 Enregistrer   📁 Galerie   │ │
│ └─────────────────────────────────┘ │
│ Légende                              │
│ ┌─────────────────────────────────┐ │
│ │ Décrivez votre bien… #hashtag   │ │
│ └─────────────────────────────────┘ │
│ 🔗 Lier une annonce  >               │
│ 🏷️ Catégorie : Maisons  >            │
│ 📍 Localisation : Brazzaville  >     │
└─────────────────────────────────────┘
```

- Vidéo verticale (9:16), durée 15–60 s.
- Possibilité de **lier une annonce** existante (le bouton « Contacter » pointera dessus).
- Catégorie + localisation pour le ciblage.

---

## 5. États

- **Non connecté** : lecture possible ; like/commentaire/contacter → invite « Se connecter ».
- **Pas de média** : placeholder image (icône 🖼️) si la vidéo charge ou est absente.
- **Hors-ligne** : derniers Shorts en cache, sinon message « Connexion requise ».

---

## 6. Responsive

| Cible | Layout |
|-------|--------|
| **Mobile** | Plein écran 9:16, rail d'actions à droite, nav en bas |
| **Tablette** | Vidéo centrée 9:16 avec marges latérales floutées (même vidéo agrandie) |
| **Desktop** | Vidéo centrée (hauteur viewport), rail d'actions collé au bord droit de la vidéo ; sidebar nav à gauche ; flèches ▲▼ pour naviguer |

```
Desktop
┌────────────┬───────────────────────────────┐
│ 🏠 Accueil │            ▲                   │
│ 🛒 Market  │     ┌───────────────┐  ❤️ 1240 │
│ ▶️ Shorts  │     │ vidéo 9:16    │  💬 86    │
│ 💬 Messages│     │               │  ↗ 45     │
│ 👤 Profil  │     └───────────────┘  ⊕ Suivre │
│            │            ▼                   │
└────────────┴───────────────────────────────┘
```

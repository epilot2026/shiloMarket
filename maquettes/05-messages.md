# Maquette — Messages

> Chat, messages vocaux et appels vidéo entre clients, propriétaires et prestataires. Mobile-first.
> Couleurs : titre `vert-principal`, bulles envoyées vertes, bulles reçues `gris-fond`.

---

## 1. État non connecté

```
┌─────────────────────────────────────┐
│ Messages                             │  ← titre vert gras
├─────────────────────────────────────┤
│                                      │
│              💬 (vert)               │  ← icône centrée
│                                      │
│   Connectez-vous pour discuter       │  ← titre gras
│                                      │
│  Envoyez des messages, vocaux et     │  ← gris-texte
│  lancez des appels vidéo avec les    │
│  propriétaires et prestataires.      │
│                                      │
│       ┌──────────────────┐           │
│       │   Se connecter   │           │  ← bouton vert
│       └──────────────────┘           │
│                                      │
├─────────────────────────────────────┤
│ 🏠   🛒    ▶️    💬    👤            │
└─────────────────────────────────────┘
```

---

## 2. Liste des conversations (connecté)

```
┌─────────────────────────────────────┐
│ Messages                       ✏️    │  ← nouveau message
│ ┌─────────────────────────────────┐ │
│ │ 🔍 Rechercher une conversation  │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ (👤) Shilo Immobilier ✔      14:32   │
│      Oui, la maison est dispo… ● 2   │  ← aperçu + non-lus (pastille verte)
│ ─────────────────────────────────── │
│ (👤) Congo Auto Location ✔   Hier    │
│      🎤 Message vocal (0:12)         │
│ ─────────────────────────────────── │
│ (👤) Jean Prestataire        Lun     │
│      Vous : Merci beaucoup 👍        │  ← « Vous : » = envoyé, lu (✓✓)
│ ─────────────────────────────────── │
│ (👤) Agence Plateau ✔        12 juin │
│      📷 Photo                        │
├─────────────────────────────────────┤
│ 🏠   🛒    ▶️    💬•   👤            │
└─────────────────────────────────────┘
```

### Éléments
- Avatar + nom (+ badge `✔` si page vérifiée), heure, aperçu du dernier message.
- **Non-lus** : pastille verte avec compteur, texte en gras.
- Types d'aperçu : texte, `🎤 vocal (durée)`, `📷 Photo`, `📍 Localisation`, accusés `✓ / ✓✓`.

---

## 3. Conversation (chat)

```
┌─────────────────────────────────────┐
│ ←  (👤) Shilo Immobilier ✔   📞  🎥 │  ← retour, nom, appel, vidéo
│        En ligne                      │
├─────────────────────────────────────┤
│ ┌─────────────────────────────┐      │
│ │ Annonce : Maison meublée 4  │      │  ← contexte annonce épinglé
│ │ pièces · 350 000 FCFA/mois  │      │
│ └─────────────────────────────┘      │
│                                      │
│  ┌───────────────────────┐           │  ← bulle reçue (gris-fond)
│  │ Bonjour, la maison     │  14:20   │
│  │ est-elle disponible ?  │          │
│  └───────────────────────┘           │
│            ┌───────────────────────┐ │  ← bulle envoyée (verte, droite)
│     14:22  │ Oui, disponible        │ │
│            │ immédiatement ! ✓✓     │ │
│            └───────────────────────┘ │
│  ┌───────────────────────┐           │
│  │ 🎤 ▶ ▬▬▬▬▬▬  0:12     │  14:25   │  ← message vocal
│  └───────────────────────┘           │
│            ┌───────────────────────┐ │
│            │ 📷 [ photo ]           │ │  ← image envoyée
│            └───────────────────────┘ │
├─────────────────────────────────────┤
│ ➕  ┌───────────────────────┐  🎤   │  ← barre de saisie
│     │ Écrire un message…    │        │
│     └───────────────────────┘        │
└─────────────────────────────────────┘
```

### Barre de saisie
- **➕** : joindre (photo, vidéo, fichier, localisation, annonce).
- **Champ texte** : `gris-fond`, multi-ligne.
- **🎤** : appui maintenu pour enregistrer un vocal ; bascule en **➤ envoyer** dès qu'on tape du texte.

### En-tête conversation
- Avatar + nom + badge, statut `En ligne` / `Vu à 14:30`.
- **📞** appel audio · **🎥** appel vidéo (WebRTC).
- Bandeau **contexte annonce** épinglé en haut quand la discussion vient d'une annonce.

---

## 4. Appel (audio / vidéo)

```
┌─────────────────────────────────────┐
│                                      │
│        [ flux vidéo distant ]        │
│                                      │
│                       ┌──────────┐   │
│                       │ vidéo moi│   │  ← incrustation locale
│                       └──────────┘   │
│   (👤) Shilo Immobilier              │
│        00:42                         │  ← durée
│                                      │
│   🔇      🎥       💬       ☎️(rouge) │  ← muet, caméra, chat, raccrocher
└─────────────────────────────────────┘
```

---

## 5. Responsive

| Cible | Layout |
|-------|--------|
| **Mobile** | 1 vue à la fois : liste → conversation (navigation par pile) |
| **Tablette** | Split possible en paysage : liste étroite + conversation |
| **Desktop** | 2 panneaux : liste (gauche `340 px`) + conversation (droite extensible) ; sidebar nav à gauche |

```
Desktop
┌────────────┬───────────────┬───────────────────────┐
│ Sidebar    │ Conversations │ (👤) Shilo Immo ✔ 📞🎥 │
│ nav        │ (👤) Shilo  ●2│ ┌────────────┐         │
│            │ (👤) Congo    │ │ bulle reçue│         │
│            │ (👤) Jean     │ │   bulle envoyée ✓✓   │
│            │ (👤) Agence   │ ➕ [ saisie… ] 🎤      │
└────────────┴───────────────┴───────────────────────┘
```

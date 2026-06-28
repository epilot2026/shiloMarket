# Cahier des charges — ShiloMarket

> **Version :** 1.0 · **Date :** Juin 2026 · **Statut :** Démo (sans base de données connectée)
> **Type :** PWA sociale & marketplace · **Marché :** Congo (Brazzaville) · **Langue :** Français · **Devise :** FCFA

> Document complémentaire : voir `cahier-de-charge-technique.md` (architecture, modèle de données, API).
> Maquettes détaillées : dossier `maquettes/`.

---

## 1. Présentation du projet

### 1.1 Contexte

**ShiloMarket** est une plateforme inédite combinant un **réseau social d'annonces**, une **marketplace** de
location/vente, des **vidéos courtes (Shorts)** et une **messagerie** (texte, vocal, appels vidéo). Elle cible
le marché congolais (Brazzaville) où la mise en relation de confiance entre clients, propriétaires, prestataires,
agences et entreprises est un besoin fort.

### 1.2 Promesse

> « Publiez, louez et discutez en toute confiance. »

### 1.3 Objectifs

- Permettre à tout utilisateur de **publier une annonce ou un service** en quelques secondes.
- Offrir une **recherche structurée** des biens (maisons, véhicules, services, immobilier, terrains).
- Créer la **confiance** via des annonces et pages **certifiées**.
- Faciliter la **mise en relation directe** (chat, vocal, appel audio/vidéo).
- Donner de la **visibilité** par le format vidéo court (Shorts).

### 1.4 Périmètre de la phase actuelle (Démo)

- Application **front-end React** fonctionnelle avec **données fictives (mock)**.
- **Aucune connexion réelle à Supabase** pour le moment : le client Supabase est présent mais non activé.
- Tous les écrans sont navigables ; authentification simulée ; pas de persistance serveur.
- Préparation de l'architecture pour un branchement Supabase ultérieur sans refonte.

---

## 2. Cibles & utilisateurs

### 2.1 Types de comptes

| Type | Icône | Rôle principal |
|------|-------|----------------|
| **Client** | 👤 | Recherche, contacte, réagit, enregistre des annonces |
| **Propriétaire** | 🔑 | Publie ses biens (maisons, véhicules, terrains) |
| **Prestataire** | 🛠️ | Propose des services |
| **Agence** | 🏢 | Gère un portefeuille de biens, page vérifiée |
| **Entreprise** | 🏬 | Vitrine commerciale, page vérifiée |

### 2.2 Personas

- **Client locataire** : cherche une maison/appartement à louer rapidement, veut contacter sans intermédiaire.
- **Propriétaire** : publie son bien, reçoit des demandes, discute et conclut.
- **Agence immobilière** : gère plusieurs annonces, soigne son image (page certifiée), publie des Shorts.
- **Prestataire de services** : se rend visible localement.

---

## 3. Identité visuelle

### 3.1 Palette de couleurs

| Rôle | Nom | Hex |
|------|-----|-----|
| Primaire | Vert principal | `#1FA84D` |
| Primaire foncé | Vert foncé (survol) | `#178A40` |
| Primaire clair | Vert clair (fonds doux) | `#E6F4EA` |
| Certifié | Violet | `#7C3AED` |
| Localisation | Bleu | `#2563EB` |
| Vidéo / Live | Rouge | `#E03131` |
| Fond app | Blanc | `#FFFFFF` |
| Fond doux | Gris clair | `#F2F3F5` |
| Bordure | Gris | `#E5E7EB` |
| Texte principal | Noir doux | `#1A1A1A` |
| Texte secondaire | Gris | `#6B7280` |

### 3.2 Typographie

- Police sans-serif géométrique (Inter / Poppins / system-ui).
- Hiérarchie : `display 28`, `h1 22`, `h2 18`, `body 15`, `meta 13`, `caption 12`.

### 3.3 Logo

- Icône **maison/boutique** blanche sur fond **vert** arrondi. Mot-symbole « ShiloMarket » en vert.

---

## 4. Fonctionnalités

### 4.1 Authentification

- **Inscription** : nom complet, numéro de téléphone (+242), mot de passe + confirmation, choix du **type de compte**.
- **Connexion** : numéro de téléphone + mot de passe, afficher/masquer le mot de passe, « Mot de passe oublié ».
- **Vérification OTP** par SMS (simulée en démo).
- En démo : authentification **factice** (n'importe quelles valeurs valides connectent un utilisateur mock).

### 4.2 Accueil / Feed

- En-tête : logo, recherche, notifications (pastille), menu.
- **Composer** rapide : « Publiez une annonce ou un service… » (Photos, Vidéo, Localisation).
- **Catégories** horizontales : Maisons, Véhicules, Services, Immobilier, Terrains.
- **Pages suggérées** : cartes avec couverture, avatar, badge vérifié, abonnés, « Voir la page ».
- **Fil d'annonces** : carte avec auteur + badge, localisation, tag catégorie, titre, description,
  carrousel photos, prix, badge « Annonce certifiée » / « Disponible immédiatement », réactions,
  compteurs (commentaires, partages), barre d'actions (J'aime, Commenter, Enregistrer, Partager),
  boutons **Discuter / Appel / Vidéo**.
- **FAB** « Publier » (crayon).

### 4.3 Marketplace

- Recherche + **filtres** (chips) : Tout, Maisons à louer, Véhicules à louer, Services, Terrains, À vendre.
- **Filtres avancés** : catégorie, transaction (louer/vendre), localisation, budget (min/max), options
  (certifiées uniquement, disponible immédiatement).
- Section **« Annonces certifiées »** (mise en avant) + **« Toutes les annonces »** (grille).
- **Carte annonce** : badge certifié, enregistrer (🔖), image, prix, titre, localisation.
- **Détail annonce** : galerie, prix, attributs, description, auteur (page), réactions, barre
  d'action sticky (Discuter / Appel / Vidéo).

### 4.4 Shorts

- Lecteur **vidéo verticale plein écran**, swipe vertical.
- Rail d'actions : J'aime, Commentaires, Partager, **Suivre**, **Contacter**.
- Bloc auteur (badge), description, tags (catégorie, localisation).
- **Création** : capture/galerie, légende, lien vers une annonce, catégorie, localisation.

### 4.5 Messages

- État non connecté : invitation à se connecter.
- **Liste des conversations** : avatar, nom + badge, aperçu (texte / vocal / photo), non-lus.
- **Conversation** : bulles envoyées (vert) / reçues (gris), contexte annonce épinglé,
  **messages vocaux**, pièces jointes, accusés (✓/✓✓).
- **Appels audio/vidéo** (WebRTC) — simulés en démo.

### 4.6 Profil & Pages

- État non connecté : invitation à se connecter.
- **Profil** : avatar, nom, type de compte, téléphone, statistiques, sections (Mes annonces, Mes pages,
  Enregistrés, Mes Shorts, Notifications, Paiements, Paramètres, Aide, Déconnexion).
- **Pages** (Agence/Entreprise/Propriétaire) : bannière, avatar, badge certifié, abonnés, onglets
  (Annonces, Shorts, À propos), bouton S'abonner / Contacter.
- **Modifier le profil**.

### 4.7 Transverses

- **Recherche globale** (annonces, pages, lieux).
- **Notifications** (réactions, commentaires, messages, nouvelles annonces des pages suivies).
- **Enregistrements** (bookmarks).
- **Certification** des pages/annonces (badge violet).

---

## 5. Exigences non fonctionnelles

### 5.1 Responsive (mobile-first)

| Cible | Largeur | Navigation | Colonnes |
|------|---------|------------|----------|
| Mobile | `< 768px` | Barre basse 5 onglets + FAB | 1 |
| Tablette | `768–1023px` | Barre basse, contenu centré | 1–2 |
| Desktop | `≥ 1024px` | Sidebar gauche + panneau droit | 2–4 |

### 5.2 PWA

- **Installable** (manifest + icônes), thème `#1FA84D`, mode `standalone`.
- **Hors-ligne** : cache du shell et des contenus récents (service worker).
- **Notifications push** (phase ultérieure).

### 5.3 Performance & accessibilité

- Lazy-loading des images, formats modernes, squelettes de chargement.
- Cibles tactiles ≥ 44px, contraste AA, focus visible, labels explicites.

### 5.4 Sécurité (phase production)

- Authentification par téléphone + OTP, hash des mots de passe (géré par Supabase Auth).
- Règles d'accès (RLS) côté Supabase. **Non actif en démo.**

---

## 6. Contraintes & hypothèses

- **Démo sans backend** : données mock en mémoire, aucune écriture serveur.
- Stack imposée : **React + Supabase** (Supabase non branché pour l'instant).
- Code **modulaire** : tout fichier dépassant ~400 lignes doit être découpé.
- Internationalisation prévue plus tard (FR par défaut).

---

## 7. Livrables

1. **Cahier des charges** (ce document + volet technique).
2. **Maquettes** `.md` (dossier `maquettes/`).
3. **Application React (démo)** fonctionnelle et responsive.
4. **Architecture prête** pour le branchement Supabase.

---

## 8. Phases & évolutions

| Phase | Contenu |
|------|---------|
| **P0 — Démo (actuelle)** | Front React + mock, tous les écrans navigables, sans backend |
| **P1 — Branchement Supabase** | Auth téléphone/OTP, tables, RLS, stockage médias |
| **P2 — Temps réel** | Messagerie temps réel, notifications push |
| **P3 — Médias avancés** | Upload Shorts, appels audio/vidéo (WebRTC) |
| **P4 — Monétisation** | Annonces sponsorisées, abonnements de pages, certification payante |

---

## 9. Critères d'acceptation (Démo)

- Tous les écrans des maquettes sont accessibles et responsives (mobile/tablette/desktop).
- La navigation par onglets et le routage fonctionnent.
- Les données mock s'affichent (feed, marketplace, shorts, messages, profil).
- L'authentification simulée bascule l'app entre états connecté/déconnecté.
- Aucune dépendance à un Supabase réel n'est requise pour faire tourner la démo.

# Maquette — Authentification

> Écrans : **Connexion** et **Inscription**. Mobile-first.
> Couleurs : bouton `vert-principal #1FA84D`, champs `gris-fond #F2F3F5`, liens `vert-principal`.

---

## 1. Connexion (mobile)

```
┌─────────────────────────────────────┐
│ ←                                    │
│                                      │
│            ┌──────────┐              │
│            │   🏪     │  logo maison │
│            │  (vert)  │              │
│            └──────────┘              │
│                                      │
│  Bon retour 👋                       │  ← display 28px, gras
│  Connectez-vous pour publier,        │  ← gris-texte
│  discuter et appeler.                │
│                                      │
│  Numéro de téléphone                 │  ← label gras
│  ┌─────────────────────────────────┐ │
│  │ 📞  +242 06 000 0000            │ │  ← champ gris-fond
│  └─────────────────────────────────┘ │
│                                      │
│  Mot de passe                        │
│  ┌─────────────────────────────────┐ │
│  │ 🔒  • • • • • •            👁️   │ │  ← afficher/masquer
│  └─────────────────────────────────┘ │
│                    Mot de passe oublié ?│  ← lien vert, aligné droite
│                                      │
│  ┌─────────────────────────────────┐ │
│  │         Se connecter            │ │  ← bouton vert plein
│  └─────────────────────────────────┘ │
│                                      │
│  ───────────── ou ─────────────     │
│                                      │
│  Pas encore de compte ? Créer un compte│  ← « Créer un compte » en vert gras
└─────────────────────────────────────┘
```

### Champs & règles
- **Numéro de téléphone** : préfixe pays `+242` figé, masque `06 000 0000`, clavier numérique.
- **Mot de passe** : min. 6 caractères, bouton 👁️ pour afficher/masquer.
- **Mot de passe oublié ?** → flux OTP par SMS.
- Validation : bouton désactivé tant que les 2 champs ne sont pas valides.

---

## 2. Inscription (mobile)

```
┌─────────────────────────────────────┐
│ ←   Créer un compte                  │  ← barre titre
│                                      │
│  Rejoignez ShiloMarket               │  ← display gras
│  Publiez, louez et discutez en       │  ← gris-texte
│  toute confiance.                    │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │ 👤  Nom complet                 │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ 📞  Numéro de téléphone         │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ 🔒  Mot de passe                │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ 🔒  Confirmer le mot de passe   │ │
│  └─────────────────────────────────┘ │
│                                      │
│  Type de compte                      │  ← label gras
│  ┌───────────┐ ┌──────────────┐      │
│  │●Client  ✓ │ │🔑 Propriétaire│     │  ← Client actif (vert plein)
│  └───────────┘ └──────────────┘      │
│  ┌─────────────┐ ┌───────────┐       │
│  │🛠️ Prestataire│ │🏢 Agence  │       │  ← chips contour
│  └─────────────┘ └───────────┘       │
│  ┌──────────────┐                    │
│  │🏬 Entreprise │                    │
│  └──────────────┘                    │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │          S'inscrire             │ │  ← bouton vert plein
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Champs & règles
- **Nom complet** : requis, 2 mots min.
- **Téléphone** : unique, format `+242`, vérifié par OTP après inscription.
- **Mot de passe / Confirmation** : doivent correspondre ; jauge de robustesse.
- **Type de compte** : sélection unique (chips). `Client` sélectionné par défaut (pilule verte + ✓).
  - Sélectionner Propriétaire / Prestataire / Agence / Entreprise révèle des champs additionnels à l'étape 2 (ex. nom de la page, secteur, localisation).

### États du chip « Type de compte »
```
Inactif :  ┌─ contour gris ─┐  icône + libellé noir
           │ 🔑 Propriétaire │
           └────────────────┘

Actif :    ┌── fond vert ──┐   icône blanche + libellé blanc + ✓
           │● Client      ✓│
           └───────────────┘
```

---

## 3. Vérification OTP (après inscription)

```
┌─────────────────────────────────────┐
│ ←   Vérification                     │
│                                      │
│  Entrez le code                      │
│  Envoyé au +242 06 000 0000          │
│                                      │
│   ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐      │  ← 6 cases OTP
│   │ 1│ │ 2│ │ 3│ │  │ │  │ │  │      │
│   └──┘ └──┘ └──┘ └──┘ └──┘ └──┘      │
│                                      │
│  Renvoyer le code (00:42)            │  ← compte à rebours
│                                      │
│  ┌─────────────────────────────────┐ │
│  │            Vérifier             │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 4. Responsive

| Cible | Comportement |
|-------|--------------|
| **Mobile** | Pleine largeur, champs empilés, bouton collé en bas |
| **Tablette** | Carte centrée max `480 px`, fond gris clair autour |
| **Desktop** | Écran scindé : illustration/branding à gauche (50%), formulaire centré à droite (carte `420 px`) |

```
Desktop (split)
┌───────────────────────┬───────────────────────┐
│                       │   ┌───────────────┐    │
│   🏪 ShiloMarket      │   │  Bon retour 👋 │    │
│   « Publiez, louez    │   │  [ champs ]    │    │
│     et discutez en    │   │  [ Se conn. ] │    │
│     toute confiance »  │   └───────────────┘    │
│   (fond vert dégradé) │                        │
└───────────────────────┴───────────────────────┘
```

---

## 5. Notes d'accessibilité
- Labels visibles au-dessus de chaque champ (pas seulement placeholder).
- Messages d'erreur sous le champ, en rouge `#E03131`.
- Focus visible (contour vert) sur tous les champs et boutons.
- Cibles tactiles ≥ 44 px.

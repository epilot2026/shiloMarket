import type { User } from '../types'

// Utilisateur de démonstration (authentification simulée).
export const demoUser: User = {
  id: 'u1',
  fullName: 'Jean Kouassi',
  phone: '+242 06 000 0000',
  accountType: 'client',
  avatarUrl: 'https://i.pravatar.cc/150?img=68',
  bio: 'À la recherche de la maison idéale à Brazzaville.',
  location: 'Brazzaville',
  verified: false,
}

import type { Page } from '../types'

export const pages: Page[] = [
  {
    id: 'p1',
    name: 'Shilo Immobilier',
    type: 'agence',
    description:
      "Agence immobilière de référence à Brazzaville. Locations et ventes certifiées.",
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    coverUrl: 'https://picsum.photos/seed/shiloimmo/800/400',
    verified: true,
    followers: 4820,
    location: 'Brazzaville',
  },
  {
    id: 'p2',
    name: 'Congo Auto Location',
    type: 'entreprise',
    description: 'Location de véhicules 4x4 et berlines pour toutes vos missions.',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    coverUrl: 'https://picsum.photos/seed/congoauto/800/400',
    verified: true,
    followers: 2640,
    location: 'Moungali, Brazzaville',
  },
  {
    id: 'p3',
    name: 'Agence Plateau',
    type: 'agence',
    description: 'Biens immobiliers haut de gamme au Plateau des 15 ans.',
    avatarUrl: 'https://i.pravatar.cc/150?img=32',
    coverUrl: 'https://picsum.photos/seed/plateau/800/400',
    verified: true,
    followers: 1980,
    location: 'Plateau, Brazzaville',
  },
]

export function getPageById(id: string): Page | undefined {
  return pages.find((p) => p.id === id)
}

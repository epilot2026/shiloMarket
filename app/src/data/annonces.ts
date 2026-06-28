import type { Annonce } from '../types'
import { pages } from './pages'

export const annonces: Annonce[] = [
  {
    id: 'a1',
    title: 'Maison meublée 4 pièces à louer',
    description:
      "Belle maison moderne de 4 pièces entièrement meublée, située dans un quartier calme et sécurisé. Eau et électricité disponibles, parking privé et cour spacieuse.",
    category: 'maisons',
    transaction: 'louer',
    price: 350000,
    priceSuffix: 'mois',
    location: 'Moungali, Brazzaville',
    images: [
      'https://picsum.photos/seed/maison1a/800/600',
      'https://picsum.photos/seed/maison1b/800/600',
      'https://picsum.photos/seed/maison1c/800/600',
    ],
    certified: true,
    available: true,
    status: 'active',
    createdAt: '5 h',
    page: pages[0],
    reactions: 86,
    comments: 12,
    shares: 8,
  },
  {
    id: 'a2',
    title: 'Appartement meublé Moungali',
    description:
      'Appartement moderne 2 chambres, salon spacieux, cuisine équipée. Idéal pour jeune couple ou professionnel.',
    category: 'immobilier',
    transaction: 'louer',
    price: 180000,
    priceSuffix: 'mois',
    location: 'Moungali, Brazzaville',
    images: [
      'https://picsum.photos/seed/appart2a/800/600',
      'https://picsum.photos/seed/appart2b/800/600',
    ],
    certified: true,
    available: true,
    status: 'active',
    createdAt: '8 h',
    page: pages[2],
    reactions: 54,
    comments: 7,
    shares: 3,
  },
  {
    id: 'a3',
    title: 'Toyota Land Cruiser 4x4 - Location',
    description:
      'Flotte de 4x4 prête pour vos missions. Chauffeur disponible sur demande. Tarifs dégressifs à la semaine.',
    category: 'vehicules',
    transaction: 'louer',
    price: 75000,
    priceSuffix: 'jour',
    location: 'Moungali, Brazzaville',
    images: [
      'https://picsum.photos/seed/voiture3a/800/600',
      'https://picsum.photos/seed/voiture3b/800/600',
    ],
    certified: true,
    available: true,
    status: 'active',
    createdAt: '1 j',
    page: pages[1],
    reactions: 120,
    comments: 18,
    shares: 14,
  },
  {
    id: 'a4',
    title: 'Terrain 500m² titré à vendre',
    description:
      'Terrain titré de 500m² dans une zone en plein développement. Documents en règle, accès facile.',
    category: 'terrains',
    transaction: 'vendre',
    price: 12000000,
    location: 'Kintélé, Brazzaville',
    images: ['https://picsum.photos/seed/terrain4a/800/600'],
    certified: false,
    available: true,
    status: 'active',
    createdAt: '2 j',
    page: pages[0],
    reactions: 33,
    comments: 5,
    shares: 2,
  },
  {
    id: 'a5',
    title: 'Villa moderne avec piscine',
    description:
      'Superbe villa 5 pièces avec piscine, jardin paysager et garage double. Quartier résidentiel sécurisé.',
    category: 'maisons',
    transaction: 'louer',
    price: 850000,
    priceSuffix: 'mois',
    location: 'Plateau des 15 ans, Brazzaville',
    images: [
      'https://picsum.photos/seed/villa5a/800/600',
      'https://picsum.photos/seed/villa5b/800/600',
      'https://picsum.photos/seed/villa5c/800/600',
    ],
    certified: true,
    available: true,
    status: 'active',
    createdAt: '3 j',
    page: pages[2],
    reactions: 210,
    comments: 32,
    shares: 25,
  },
]

export function getAnnonceById(id: string): Annonce | undefined {
  return annonces.find((a) => a.id === id)
}

export const certifiedAnnonces = annonces.filter((a) => a.certified)

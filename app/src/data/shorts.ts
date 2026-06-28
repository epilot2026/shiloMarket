import type { Short } from '../types'
import { pages } from './pages'

export const shorts: Short[] = [
  {
    id: 's1',
    videoPoster: 'https://picsum.photos/seed/short1/600/1000',
    caption: 'Visite express de cette villa moderne 🏡✨ #immobilier',
    tags: ['Maisons', 'Brazzaville'],
    likes: 1240,
    comments: 86,
    shares: 45,
    page: pages[0],
    annonceId: 'a5',
  },
  {
    id: 's2',
    videoPoster: 'https://picsum.photos/seed/short2/600/1000',
    caption: 'Notre flotte de 4x4 prête pour vos missions 🚙',
    tags: ['Véhicules', 'Moungali'],
    likes: 3120,
    comments: 210,
    shares: 178,
    page: pages[1],
    annonceId: 'a3',
  },
  {
    id: 's3',
    videoPoster: 'https://picsum.photos/seed/short3/600/1000',
    caption: 'Appartement disponible immédiatement au Plateau 🔑',
    tags: ['Immobilier', 'Plateau'],
    likes: 870,
    comments: 54,
    shares: 22,
    page: pages[2],
    annonceId: 'a2',
  },
]

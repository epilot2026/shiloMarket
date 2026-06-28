import type { ChatMessage, Conversation } from '../types'
import { pages } from './pages'

export const conversations: Conversation[] = [
  {
    id: 'c1',
    page: pages[0],
    lastPreview: 'Oui, la maison est disponible immédiatement !',
    lastKind: 'text',
    time: '14:32',
    unread: 2,
    online: true,
    annonceTitle: 'Maison meublée 4 pièces · 350 000 FCFA/mois',
  },
  {
    id: 'c2',
    page: pages[1],
    lastPreview: 'Message vocal (0:12)',
    lastKind: 'voice',
    time: 'Hier',
    unread: 0,
    annonceTitle: 'Toyota Land Cruiser 4x4 · 75 000 FCFA/jour',
  },
  {
    id: 'c3',
    page: pages[2],
    lastPreview: 'Photo',
    lastKind: 'image',
    time: 'Lun',
    unread: 0,
    annonceTitle: 'Appartement meublé Moungali',
  },
]

export const sampleMessages: Record<string, ChatMessage[]> = {
  c1: [
    { id: 'm1', fromMe: false, type: 'text', content: 'Bonjour, la maison est-elle disponible ?', time: '14:20' },
    { id: 'm2', fromMe: true, type: 'text', content: 'Oui, disponible immédiatement !', time: '14:22', read: true },
    { id: 'm3', fromMe: false, type: 'voice', content: '0:12', time: '14:25' },
    { id: 'm4', fromMe: true, type: 'text', content: 'Parfait, je peux passer demain matin.', time: '14:28', read: true },
  ],
}

export function getConversationById(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id)
}

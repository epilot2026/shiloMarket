export type AccountType =
  | 'client'
  | 'proprietaire'
  | 'prestataire'
  | 'agence'
  | 'entreprise'

export type Category =
  | 'maisons'
  | 'vehicules'
  | 'services'
  | 'immobilier'
  | 'terrains'

export type Transaction = 'louer' | 'vendre'

export type AnnonceStatus = 'active' | 'louee' | 'vendue' | 'en_attente'

export interface User {
  id: string
  fullName: string
  phone: string
  accountType: AccountType
  avatarUrl: string
  bio?: string
  location?: string
  verified?: boolean
}

export interface Page {
  id: string
  name: string
  type: 'agence' | 'entreprise' | 'proprietaire'
  description?: string
  avatarUrl: string
  coverUrl: string
  verified: boolean
  followers: number
  location?: string
}

export interface Annonce {
  id: string
  title: string
  description: string
  category: Category
  transaction: Transaction
  price: number
  priceSuffix?: string // ex. "mois"
  location: string
  images: string[]
  video?: string // URL ou object URL (démo)
  certified: boolean
  available: boolean
  status: AnnonceStatus
  createdAt: string // libellé relatif, ex. "5 h"
  page: Page
  reactions: number
  comments: number
  shares: number
}

export interface Short {
  id: string
  videoPoster: string
  caption: string
  tags: string[]
  likes: number
  comments: number
  shares: number
  page: Page
  annonceId?: string
}

export type MessagePreviewKind = 'text' | 'voice' | 'image'

export interface Conversation {
  id: string
  page: Page
  lastPreview: string
  lastKind: MessagePreviewKind
  time: string
  unread: number
  online?: boolean
  annonceTitle?: string
}

export type ChatMessageType = 'text' | 'voice' | 'image'

export interface ChatMessage {
  id: string
  fromMe: boolean
  type: ChatMessageType
  content: string // texte, ou durée pour voice, ou url pour image
  time: string
  read?: boolean
}

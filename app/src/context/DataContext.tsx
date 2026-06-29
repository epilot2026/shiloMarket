import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Annonce, AnnonceMedia, Category, Page, Transaction } from '../types'
import { annonces as seedAnnonces } from '../data/annonces'
import type { Comment } from '../components/ui/CommentsSection'
import { useAuth } from './AuthContext'

export interface NewAnnonceInput {
  title: string
  description: string
  category: Category
  transaction: Transaction
  price: number
  priceSuffix?: string
  location: string
  images?: string[]
  videos?: string[]
  documents?: AnnonceMedia[]
  page: Page
}

interface DataContextValue {
  annonces: Annonce[]
  certified: Annonce[]
  addAnnonce: (input: NewAnnonceInput) => Annonce
  isLiked: (id: string) => boolean
  toggleLike: (id: string) => void
  likeCount: (annonce: Annonce) => number
  isSaved: (id: string) => boolean
  toggleSave: (id: string) => void
  savedCount: number
  isFollowing: (pageId: string) => boolean
  toggleFollow: (pageId: string) => void
  followedCount: number
  comments: Record<string, Comment[]>
  addComment: (annonceId: string, text: string) => void
  getComments: (annonceId: string) => Comment[]
  commentCount: (annonceId: string) => number
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

const FALLBACK_IMAGE = 'https://picsum.photos/seed/shilonew/800/600'

export function DataProvider({ children }: { children: ReactNode }) {
  // Données démo en mémoire. Réinitialisées au rechargement (aucun backend).
  const [annonces, setAnnonces] = useState<Annonce[]>(seedAnnonces)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [followed, setFollowed] = useState<Set<string>>(new Set())
  const [comments, setComments] = useState<Record<string, Comment[]>>({})

  const addComment = useCallback((annonceId: string, text: string) => {
    const comment: Comment = {
      id: `c-${Date.now()}`,
      userId: 'demo',
      userName: 'Utilisateur',
      userAvatar: 'https://via.placeholder.com/40',
      text,
      likes: 0,
      createdAt: "à l'instant",
    }
    setComments((prev) => ({
      ...prev,
      [annonceId]: [...(prev[annonceId] || []), comment],
    }))
  }, [])

  const getComments = useCallback((annonceId: string): Comment[] => {
    return comments[annonceId] || []
  }, [comments])

  const commentCount = useCallback((annonceId: string): number => {
    return (comments[annonceId] || []).length
  }, [comments])

  const addAnnonce = useCallback((input: NewAnnonceInput): Annonce => {
    const annonce: Annonce = {
      id: `a-${Date.now()}`,
      title: input.title,
      description: input.description,
      category: input.category,
      transaction: input.transaction,
      price: input.price,
      priceSuffix: input.priceSuffix,
      location: input.location,
      images: input.images && input.images.length > 0 ? input.images : [FALLBACK_IMAGE],
      videos: input.videos ?? [],
      documents: input.documents ?? [],
      certified: false,
      available: true,
      status: 'active',
      createdAt: "à l'instant",
      page: input.page,
      reactions: 0,
      comments: 0,
      shares: 0,
    }
    setAnnonces((prev) => [annonce, ...prev])
    return annonce
  }, [])

  const toggleLike = useCallback((id: string) => {
    setLiked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const toggleSave = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const toggleFollow = useCallback((pageId: string) => {
    setFollowed((prev) => {
      const next = new Set(prev)
      next.has(pageId) ? next.delete(pageId) : next.add(pageId)
      return next
    })
  }, [])

  const value = useMemo<DataContextValue>(
    () => ({
      annonces,
      certified: annonces.filter((a) => a.certified),
      addAnnonce,
      isLiked: (id) => liked.has(id),
      toggleLike,
      likeCount: (a) => a.reactions + (liked.has(a.id) ? 1 : 0),
      isSaved: (id) => saved.has(id),
      toggleSave,
      savedCount: saved.size,
      isFollowing: (pageId) => followed.has(pageId),
      toggleFollow,
      followedCount: followed.size,
      comments,
      addComment,
      getComments,
      commentCount,
    }),
    [annonces, liked, saved, followed, comments, addAnnonce, toggleLike, toggleSave, toggleFollow, addComment, getComments, commentCount],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData doit être utilisé dans DataProvider')
  return ctx
}

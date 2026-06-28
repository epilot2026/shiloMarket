import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Annonce, Category, Page, Transaction } from '../types'
import { annonces as seedAnnonces } from '../data/annonces'

export interface NewAnnonceInput {
  title: string
  description: string
  category: Category
  transaction: Transaction
  price: number
  priceSuffix?: string
  location: string
  images?: string[]
  video?: string
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
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

const FALLBACK_IMAGE = 'https://picsum.photos/seed/shilonew/800/600'

export function DataProvider({ children }: { children: ReactNode }) {
  // Données démo en mémoire. Réinitialisées au rechargement (aucun backend).
  const [annonces, setAnnonces] = useState<Annonce[]>(seedAnnonces)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<Set<string>>(new Set())

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
      video: input.video,
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
    }),
    [annonces, liked, saved, addAnnonce, toggleLike, toggleSave],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData doit être utilisé dans DataProvider')
  return ctx
}

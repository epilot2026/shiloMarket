import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Annonce, Category, Transaction } from '../types'
import { annoncesService, type NewAnnonceInput as ServiceNewAnnonceInput } from '../services/annonces.service'
import { interactionsService, type Comment } from '../services/interactions.service'
import { pagesService } from '../services/pages.service'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

export interface NewAnnonceInput extends ServiceNewAnnonceInput {
  category: Category
  transaction: Transaction
}

interface DataContextValue {
  annonces: Annonce[]
  certified: Annonce[]
  isLoading: boolean
  refresh: () => Promise<void>
  addAnnonce: (input: NewAnnonceInput) => Promise<Annonce>
  isLiked: (id: string) => boolean
  toggleLike: (id: string) => Promise<void>
  likeCount: (annonce: Annonce) => number
  isSaved: (id: string) => boolean
  toggleSave: (id: string) => Promise<void>
  savedCount: number
  isFollowing: (pageId: string) => boolean
  toggleFollow: (pageId: string) => Promise<void>
  followedCount: number
  comments: Record<string, Comment[]>
  addComment: (annonceId: string, text: string) => Promise<void>
  getComments: (annonceId: string) => Promise<Comment[]>
  commentCount: (annonceId: string) => number
  userPages: Awaited<ReturnType<typeof pagesService.getByOwner>>
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [followed, setFollowed] = useState<Set<string>>(new Set())
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [userPages, setUserPages] = useState<Awaited<ReturnType<typeof pagesService.getByOwner>>>([])

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const [all, cert] = await Promise.all([
        annoncesService.list({}),
        annoncesService.certified(),
      ])
      setAnnonces([...cert, ...all.filter((a) => !a.certified)])

      if (isAuthenticated && user) {
        const pages = await pagesService.getByOwner(user.id)
        setUserPages(pages)
      }
    } catch (err) {
      console.error('Erreur chargement données', err)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLiked(new Set())
      setSaved(new Set())
      setFollowed(new Set())
      return
    }

    let mounted = true
    Promise.all([
      interactionsService.getUserLikes(),
      interactionsService.getUserSaves(),
      interactionsService.getUserFollows(),
    ]).then(([likes, saves, follows]) => {
      if (!mounted) return
      setLiked(new Set(likes))
      setSaved(new Set(saves))
      setFollowed(new Set(follows))
    })

    return () => {
      mounted = false
    }
  }, [isAuthenticated, user])

  const addAnnonce = useCallback(async (input: NewAnnonceInput): Promise<Annonce> => {
    const created = await annoncesService.create(input)
    setAnnonces((prev) => [created, ...prev])
    return created
  }, [])

  const toggleLike = useCallback(
    async (id: string) => {
      if (!isAuthenticated) return
      const likedNow = await interactionsService.toggleLike(id, 'annonce')
      setLiked((prev) => {
        const next = new Set(prev)
        likedNow ? next.add(id) : next.delete(id)
        return next
      })
    },
    [isAuthenticated],
  )

  const toggleSave = useCallback(
    async (id: string) => {
      if (!isAuthenticated) return
      const savedNow = await interactionsService.toggleSave(id)
      setSaved((prev) => {
        const next = new Set(prev)
        savedNow ? next.add(id) : next.delete(id)
        return next
      })
    },
    [isAuthenticated],
  )

  const toggleFollow = useCallback(
    async (pageId: string) => {
      if (!isAuthenticated) return
      const followingNow = await interactionsService.toggleFollow(pageId)
      setFollowed((prev) => {
        const next = new Set(prev)
        followingNow ? next.add(pageId) : next.delete(pageId)
        return next
      })
      setAnnonces((prev) =>
        prev.map((a) =>
          a.page?.id === pageId
            ? { ...a, page: { ...a.page, followers: a.page.followers + (followingNow ? 1 : -1) } }
            : a,
        ),
      )
    },
    [isAuthenticated],
  )

  const addComment = useCallback(
    async (annonceId: string, text: string) => {
      if (!isAuthenticated) return
      const comment = await interactionsService.addComment(annonceId, 'annonce', text)
      setComments((prev) => ({
        ...prev,
        [annonceId]: [...(prev[annonceId] || []), comment],
      }))
    },
    [isAuthenticated],
  )

  const getComments = useCallback(
    async (annonceId: string): Promise<Comment[]> => {
      if (!comments[annonceId]) {
        const list = await interactionsService.getComments(annonceId, 'annonce')
        setComments((prev) => ({ ...prev, [annonceId]: list }))
        return list
      }
      return comments[annonceId]
    },
    [comments],
  )

  const commentCount = useCallback(
    (annonceId: string): number => {
      return (comments[annonceId] || []).length
    },
    [comments],
  )

  useEffect(() => {
    const channel = supabase
      .channel('public:comments')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          const newComment = payload.new as Record<string, unknown>
          const targetId = newComment.target_id as string
          const targetType = newComment.target_type as string
          if (targetType !== 'annonce') return
          interactionsService.getComments(targetId, 'annonce').then((list) => {
            setComments((prev) => ({ ...prev, [targetId]: list }))
          })
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const value = useMemo<DataContextValue>(
    () => ({
      annonces,
      certified: annonces.filter((a) => a.certified),
      isLoading,
      refresh: load,
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
      userPages,
    }),
    [
      annonces,
      isLoading,
      load,
      addAnnonce,
      liked,
      saved,
      followed,
      comments,
      userPages,
      toggleLike,
      toggleSave,
      toggleFollow,
      addComment,
      getComments,
      commentCount,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData doit être utilisé dans DataProvider')
  return ctx
}

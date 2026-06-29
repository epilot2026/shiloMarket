import { supabase } from '../lib/supabase'
import type { Annonce, Category, Page } from '../types'

export interface AnnonceFilters {
  category?: Category | 'all'
  query?: string
  transaction?: 'louer' | 'vendre'
  certified?: boolean
  available?: boolean
}

export interface NewAnnonceInput {
  title: string
  description: string
  category: Category
  transaction: 'louer' | 'vendre' | 'devis'
  price: number
  priceSuffix?: string
  location: string
  images?: string[]
  videos?: string[]
  documents?: { name: string; url: string; type: 'pdf' | 'doc' | 'file' }[]
  pageId?: string
}

function mapPage(row: Record<string, unknown>): Page {
  return {
    id: row.id as string,
    name: row.name as string,
    type: row.type as 'agence' | 'entreprise' | 'proprietaire',
    description: (row.description as string) || undefined,
    avatarUrl: (row.avatar_url as string) || '',
    coverUrl: (row.cover_url as string) || '',
    verified: (row.verified as boolean) || false,
    followers: (row.followers_count as number) || 0,
    location: (row.location as string) || undefined,
  }
}

function mapAnnonce(row: Record<string, unknown>, medias: Record<string, unknown>[] = [], pageRow?: Record<string, unknown>): Annonce {
  const images = medias
    .filter((m) => m.type === 'image')
    .sort((a, b) => (a.position as number) - (b.position as number))
    .map((m) => m.url as string)
  const videos = medias.filter((m) => m.type === 'video').map((m) => m.url as string)
  const documents = medias
    .filter((m) => m.type === 'document')
    .map((m) => ({ name: (m.name as string) || 'Document', url: m.url as string, type: 'pdf' as const }))

  const page = pageRow ? mapPage(pageRow) : (row.page as Page)

  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    category: row.category as Category,
    transaction: row.transaction as 'louer' | 'vendre' | 'devis',
    price: row.price as number,
    priceSuffix: (row.price_suffix as string) || undefined,
    location: row.location as string,
    images: images.length > 0 ? images : ((row.images as string[]) || []),
    videos: videos.length > 0 ? videos : ((row.videos as string[]) || []),
    documents: documents.length > 0 ? documents : ((row.documents as Annonce['documents']) || []),
    certified: (row.certified as boolean) || false,
    available: (row.available as boolean) !== false,
    status: (row.status as Annonce['status']) || 'active',
    createdAt: formatDate(row.created_at as string),
    page,
    reactions: (row.reactions_count as number) || 0,
    comments: (row.comments_count as number) || 0,
    shares: (row.shares_count as number) || 0,
  }
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return "à l'instant"
  if (diff < 3600) return `${Math.floor(diff / 60)} min`
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`
  if (diff < 604800) return `${Math.floor(diff / 86400)} j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export const annoncesService = {
  async list(filters: AnnonceFilters = {}): Promise<Annonce[]> {
    let query = supabase
      .from('annonces')
      .select('*, page:pages(*), medias:annonce_medias(*)')
      .order('created_at', { ascending: false })

    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }
    if (filters.transaction) {
      query = query.eq('transaction', filters.transaction)
    }
    if (filters.certified) {
      query = query.eq('certified', true)
    }
    if (filters.available) {
      query = query.eq('available', true)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)

    let result = (data || []).map((row) => mapAnnonce(row, row.medias || [], row.page))

    if (filters.query) {
      const q = filters.query.toLowerCase()
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q),
      )
    }

    return result
  },

  async certified(): Promise<Annonce[]> {
    const { data, error } = await supabase
      .from('annonces')
      .select('*, page:pages(*), medias:annonce_medias(*)')
      .eq('certified', true)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data || []).map((row) => mapAnnonce(row, row.medias || [], row.page))
  },

  async getById(id: string): Promise<Annonce | null> {
    const { data, error } = await supabase
      .from('annonces')
      .select('*, page:pages(*), medias:annonce_medias(*)')
      .eq('id', id)
      .single()

    if (error) return null
    return mapAnnonce(data, data.medias || [], data.page)
  },

  async create(input: NewAnnonceInput): Promise<Annonce> {
    const { data: session } = await supabase.auth.getSession()
    if (!session.session?.user) throw new Error('Authentification requise')

    const authorId = session.session.user.id

    const { data, error } = await supabase
      .from('annonces')
      .insert({
        author_id: authorId,
        page_id: input.pageId || null,
        title: input.title,
        description: input.description,
        category: input.category,
        transaction: input.transaction,
        price: input.price,
        price_suffix: input.priceSuffix,
        location: input.location,
      })
      .select('*, page:pages(*)')
      .single()

    if (error || !data) throw new Error(error?.message || 'Échec de création')

    const mediaRows: { annonce_id: string; url: string; type: string; position: number }[] = []
    input.images?.forEach((url, i) => mediaRows.push({ annonce_id: data.id, url, type: 'image', position: i }))
    input.videos?.forEach((url, i) => mediaRows.push({ annonce_id: data.id, url, type: 'video', position: i }))
    input.documents?.forEach((doc, i) =>
      mediaRows.push({ annonce_id: data.id, url: doc.url, type: 'document', position: i }),
    )

    if (mediaRows.length > 0) {
      const { error: mediaError } = await supabase.from('annonce_medias').insert(mediaRows)
      if (mediaError) throw new Error(mediaError.message)
    }

    const { data: medias } = await supabase
      .from('annonce_medias')
      .select('*')
      .eq('annonce_id', data.id)

    return mapAnnonce(data, medias || [], data.page)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('annonces').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },
}

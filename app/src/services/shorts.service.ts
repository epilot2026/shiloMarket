import { supabase } from '../lib/supabase'
import type { Short, Page } from '../types'

export interface NewShortInput {
  videoUrl: string
  caption?: string
  annonceId?: string
  pageId?: string
  tags?: string[]
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

function mapShort(row: Record<string, unknown>): Short {
  const page = row.page ? mapPage(row.page as Record<string, unknown>) : ({} as Page)
  return {
    id: row.id as string,
    videoPoster: (row.video_poster as string) || (row.video_url as string) || '',
    caption: (row.caption as string) || '',
    tags: (row.tags as string[]) || [],
    likes: (row.likes_count as number) || 0,
    comments: (row.comments_count as number) || 0,
    shares: (row.shares_count as number) || 0,
    page,
    annonceId: (row.annonce_id as string) || undefined,
  }
}

async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  if (!data.session?.user) throw new Error('Authentification requise')
  return data.session.user.id
}

export interface ShortFilters {
  pageId?: string
}

export const shortsService = {
  async list(filters: ShortFilters = {}): Promise<Short[]> {
    let query = supabase
      .from('shorts')
      .select('*, page:pages(*)')
      .order('created_at', { ascending: false })

    if (filters.pageId) {
      query = query.eq('page_id', filters.pageId)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    return (data || []).map(mapShort)
  },

  async getById(id: string): Promise<Short | null> {
    const { data, error } = await supabase.from('shorts').select('*, page:pages(*)').eq('id', id).single()
    if (error) return null
    return data ? mapShort(data) : null
  },

  async create(input: NewShortInput): Promise<Short> {
    const userId = await currentUserId()
    const { data, error } = await supabase
      .from('shorts')
      .insert({
        author_id: userId,
        page_id: input.pageId || null,
        video_url: input.videoUrl,
        video_poster: input.videoUrl,
        caption: input.caption,
        annonce_id: input.annonceId,
        tags: input.tags,
      })
      .select('*, page:pages(*)')
      .single()

    if (error || !data) throw new Error(error?.message || 'Échec de création du short')
    return mapShort(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('shorts').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },
}

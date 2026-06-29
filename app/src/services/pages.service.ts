import { supabase } from '../lib/supabase'
import type { Page } from '../types'

export interface NewPageInput {
  name: string
  type: 'agence' | 'entreprise' | 'proprietaire'
  description?: string
  avatarUrl?: string
  coverUrl?: string
  location?: string
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

async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  if (!data.session?.user) throw new Error('Authentification requise')
  return data.session.user.id
}

export const pagesService = {
  async list(): Promise<Page[]> {
    const { data, error } = await supabase.from('pages').select('*').order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data || []).map(mapPage)
  },

  async getById(id: string): Promise<Page | null> {
    const { data, error } = await supabase.from('pages').select('*').eq('id', id).single()
    if (error) return null
    return data ? mapPage(data) : null
  },

  async create(input: NewPageInput): Promise<Page> {
    const userId = await currentUserId()
    const { data, error } = await supabase
      .from('pages')
      .insert({
        owner_id: userId,
        name: input.name,
        type: input.type,
        description: input.description,
        avatar_url: input.avatarUrl,
        cover_url: input.coverUrl,
        location: input.location,
      })
      .select()
      .single()

    if (error || !data) throw new Error(error?.message || 'Échec de création de page')
    return mapPage(data)
  },

  async update(id: string, input: Partial<NewPageInput>): Promise<Page> {
    const { data, error } = await supabase
      .from('pages')
      .update({
        name: input.name,
        description: input.description,
        avatar_url: input.avatarUrl,
        cover_url: input.coverUrl,
        location: input.location,
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) throw new Error(error?.message || 'Échec de mise à jour')
    return mapPage(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('pages').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },

  async getByOwner(userId: string): Promise<Page[]> {
    const { data, error } = await supabase.from('pages').select('*').eq('owner_id', userId)
    if (error) throw new Error(error.message)
    return (data || []).map(mapPage)
  },
}

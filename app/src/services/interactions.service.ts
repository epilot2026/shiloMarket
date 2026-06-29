import { supabase } from '../lib/supabase'

export type ReactionTarget = 'annonce' | 'short' | 'comment'
export type CommentTarget = 'annonce' | 'short'

export interface Reaction {
  id: string
  userId: string
  targetType: ReactionTarget
  targetId: string
  type: 'like' | 'love' | 'wow'
}

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  targetType: CommentTarget
  targetId: string
  text: string
  likes: number
  createdAt: string
}

async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  if (!data.session?.user) throw new Error('Authentification requise')
  return data.session.user.id
}

async function getProfileName(userId: string): Promise<string> {
  const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', userId).single()
  return (data?.full_name as string) || 'Utilisateur'
}

async function getProfileAvatar(userId: string): Promise<string> {
  const { data } = await supabase.from('profiles').select('avatar_url').eq('id', userId).single()
  return (data?.avatar_url as string) || 'https://i.pravatar.cc/150?img=1'
}

function mapComment(row: Record<string, unknown>): Comment {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    userName: (row.user_name as string) || 'Utilisateur',
    userAvatar: (row.user_avatar as string) || 'https://i.pravatar.cc/150?img=1',
    targetType: row.target_type as CommentTarget,
    targetId: row.target_id as string,
    text: row.content as string,
    likes: (row.likes_count as number) || 0,
    createdAt: formatDate(row.created_at as string),
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

export const interactionsService = {
  async getUserLikes(): Promise<string[]> {
    const userId = await currentUserId()
    const { data, error } = await supabase
      .from('reactions')
      .select('target_id')
      .eq('user_id', userId)
      .eq('target_type', 'annonce')

    if (error) throw new Error(error.message)
    return (data || []).map((row) => row.target_id as string)
  },

  async getUserSaves(): Promise<string[]> {
    const userId = await currentUserId()
    const { data, error } = await supabase.from('bookmarks').select('annonce_id').eq('user_id', userId)
    if (error) throw new Error(error.message)
    return (data || []).map((row) => row.annonce_id as string)
  },

  async getUserFollows(): Promise<string[]> {
    const userId = await currentUserId()
    const { data, error } = await supabase.from('follows').select('page_id').eq('follower_id', userId)
    if (error) throw new Error(error.message)
    return (data || []).map((row) => row.page_id as string)
  },

  async isLiked(targetId: string, targetType: ReactionTarget = 'annonce'): Promise<boolean> {
    const userId = await currentUserId()
    const { data } = await supabase
      .from('reactions')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .single()
    return !!data
  },

  async toggleLike(targetId: string, targetType: ReactionTarget = 'annonce'): Promise<boolean> {
    const userId = await currentUserId()

    const { data: existing } = await supabase
      .from('reactions')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .single()

    if (existing) {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('id', existing.id)
      if (error) throw new Error(error.message)
      return false
    }

    const { error } = await supabase.from('reactions').insert({
      user_id: userId,
      target_type: targetType,
      target_id: targetId,
      type: 'like',
    })
    if (error) throw new Error(error.message)
    return true
  },

  async isSaved(annonceId: string): Promise<boolean> {
    const userId = await currentUserId()
    const { data } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('annonce_id', annonceId)
      .single()
    return !!data
  },

  async toggleSave(annonceId: string): Promise<boolean> {
    const userId = await currentUserId()

    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('annonce_id', annonceId)
      .single()

    if (existing) {
      const { error } = await supabase.from('bookmarks').delete().eq('id', existing.id)
      if (error) throw new Error(error.message)
      return false
    }

    const { error } = await supabase.from('bookmarks').insert({ user_id: userId, annonce_id: annonceId })
    if (error) throw new Error(error.message)
    return true
  },

  async isFollowing(pageId: string): Promise<boolean> {
    const userId = await currentUserId()
    const { data } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', userId)
      .eq('page_id', pageId)
      .single()
    return !!data
  },

  async toggleFollow(pageId: string): Promise<boolean> {
    const userId = await currentUserId()

    const { data: existing } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', userId)
      .eq('page_id', pageId)
      .single()

    if (existing) {
      const { error } = await supabase.from('follows').delete().eq('id', existing.id)
      if (error) throw new Error(error.message)
      return false
    }

    const { error } = await supabase.from('follows').insert({ follower_id: userId, page_id: pageId })
    if (error) throw new Error(error.message)
    return true
  },

  async getComments(targetId: string, targetType: CommentTarget = 'annonce'): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(full_name, avatar_url)')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)

    return (data || []).map((row) => ({
      ...mapComment(row),
      userName: (row.profiles?.full_name as string) || 'Utilisateur',
      userAvatar: (row.profiles?.avatar_url as string) || 'https://i.pravatar.cc/150?img=1',
    }))
  },

  async addComment(targetId: string, targetType: CommentTarget, content: string): Promise<Comment> {
    const userId = await currentUserId()
    const [userName, userAvatar] = await Promise.all([getProfileName(userId), getProfileAvatar(userId)])

    const { data, error } = await supabase
      .from('comments')
      .insert({ user_id: userId, target_type: targetType, target_id: targetId, content })
      .select()
      .single()

    if (error || !data) throw new Error(error?.message || 'Échec du commentaire')

    return { ...mapComment(data), userName, userAvatar }
  },
}

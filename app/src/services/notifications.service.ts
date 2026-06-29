import { supabase } from '../lib/supabase'

export type NotificationType = 'reaction' | 'comment' | 'message' | 'follow' | 'new_annonce' | 'certification' | 'system'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  payload: Record<string, unknown>
  read: boolean
  createdAt: string
}

function mapNotification(row: Record<string, unknown>): Notification {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    type: row.type as NotificationType,
    payload: (row.payload as Record<string, unknown>) || {},
    read: (row.read as boolean) || false,
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

async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  if (!data.session?.user) throw new Error('Authentification requise')
  return data.session.user.id
}

export const notificationsService = {
  async list(): Promise<Notification[]> {
    const userId = await currentUserId()
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw new Error(error.message)
    return (data || []).map(mapNotification)
  },

  async countUnread(): Promise<number> {
    const userId = await currentUserId()
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw new Error(error.message)
    return count || 0
  },

  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id)
    if (error) throw new Error(error.message)
  },

  async markAllAsRead(): Promise<void> {
    const userId = await currentUserId()
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
    if (error) throw new Error(error.message)
  },

  subscribe(callback: (notification: Notification) => void) {
    return supabase
      .channel('notifications:user')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        async (payload) => {
          const { data } = await supabase.auth.getSession()
          const userId = data.session?.user?.id
          if (userId && payload.new.user_id === userId) {
            callback(mapNotification(payload.new as Record<string, unknown>))
          }
        },
      )
      .subscribe()
  },
}

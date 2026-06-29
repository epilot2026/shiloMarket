import { supabase } from '../lib/supabase'
import type { Conversation as AppConversation, ChatMessage } from '../types'

export type MessageType = 'text' | 'voice' | 'image' | 'location' | 'document'

export interface Conversation extends AppConversation {}

export interface MessageInput {
  conversationId: string
  content: string
  type?: MessageType
  mediaUrl?: string
}

export interface NewConversationInput {
  participantId: string
  annonceId?: string
  initialMessage?: string
}

function currentUserId(): Promise<string> {
  return supabase.auth.getSession().then(({ data }) => {
    if (!data.session?.user) throw new Error('Authentification requise')
    return data.session.user.id
  })
}

function mapConversation(row: Record<string, unknown>, page: Record<string, unknown>, annonceTitle?: string): Conversation {
  return {
    id: row.id as string,
    page: {
      id: page.id as string,
      name: page.name as string,
      type: page.type as 'agence' | 'entreprise' | 'proprietaire',
      description: (page.description as string) || undefined,
      avatarUrl: (page.avatar_url as string) || '',
      coverUrl: (page.cover_url as string) || '',
      verified: (page.verified as boolean) || false,
      followers: (page.followers_count as number) || 0,
      location: (page.location as string) || undefined,
    },
    lastPreview: (row.last_preview as string) || '',
    lastKind: (row.last_kind as AppConversation['lastKind']) || 'text',
    time: formatDate(row.updated_at as string),
    unread: (row.unread_count as number) || 0,
    online: false,
    annonceTitle,
  }
}

function mapMessage(row: Record<string, unknown>, currentUserId: string): ChatMessage {
  return {
    id: row.id as string,
    fromMe: row.sender_id === currentUserId,
    type: (row.type as ChatMessage['type']) || 'text',
    content: row.content as string,
    time: formatTime(row.created_at as string),
    read: (row.read_at as string) != null,
  }
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 86400) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  if (diff < 604800) return date.toLocaleDateString('fr-FR', { weekday: 'short' })
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export const messagesService = {
  async listConversations(): Promise<Conversation[]> {
    const userId = await currentUserId()

    const { data, error } = await supabase.rpc('get_conversations', { p_user_id: userId })

    if (error) throw new Error(error.message)

    return (data || []).map((row: Record<string, unknown>) =>
      mapConversation(row, row.page as Record<string, unknown>, row.annonce_title as string),
    )
  },

  async getConversation(id: string): Promise<Conversation | null> {
    const userId = await currentUserId()

    const { data, error } = await supabase
      .from('conversations')
      .select('*, annonces(title), participants:conversation_participants(user_id, profiles(*))')
      .eq('id', id)
      .single()

    if (error) return null

    const participants = (data.participants || []) as Record<string, unknown>[]
    const other = participants.find((p) => p.user_id !== userId)
    if (!other) return null

    return mapConversation(data, other.profiles as Record<string, unknown>, data.annonces?.title as string)
  },

  async createConversation(input: NewConversationInput): Promise<Conversation> {
    const userId = await currentUserId()

    const { data: commonConversations } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', input.participantId)

    const commonIds = (commonConversations || []).map((row) => row.conversation_id as string)
    let existingConversationId: string | null = null

    if (commonIds.length > 0) {
      const { data: mine } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId)
        .in('conversation_id', commonIds)
        .maybeSingle()

      existingConversationId = (mine?.conversation_id as string) || null
    }

    if (existingConversationId) {
      const conversation = await this.getConversation(existingConversationId)
      if (conversation) {
        if (input.initialMessage) {
          await this.sendMessage({ conversationId: conversation.id, content: input.initialMessage })
        }
        return conversation
      }
    }

    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({ annonce_id: input.annonceId || null })
      .select()
      .single()

    if (error || !conversation) throw new Error(error?.message || 'Échec de création de conversation')

    const { error: participantsError } = await supabase.from('conversation_participants').insert([
      { conversation_id: conversation.id, user_id: userId },
      { conversation_id: conversation.id, user_id: input.participantId },
    ])

    if (participantsError) throw new Error(participantsError.message)

    if (input.initialMessage) {
      await this.sendMessage({ conversationId: conversation.id, content: input.initialMessage })
    }

    const result = await this.getConversation(conversation.id)
    if (!result) throw new Error('Conversation introuvable après création')
    return result
  },

  async listMessages(conversationId: string): Promise<ChatMessage[]> {
    const userId = await currentUserId()

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return (data || []).map((row) => mapMessage(row, userId))
  },

  async sendMessage(input: MessageInput): Promise<ChatMessage> {
    const userId = await currentUserId()

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: input.conversationId,
        sender_id: userId,
        type: input.type || 'text',
        content: input.content,
        media_url: input.mediaUrl || null,
      })
      .select()
      .single()

    if (error || !data) throw new Error(error?.message || 'Échec d\'envoi du message')
    return mapMessage(data, userId)
  },

  async markAsRead(conversationId: string): Promise<void> {
    const userId = await currentUserId()
    const now = new Date().toISOString()

    await supabase
      .from('conversation_participants')
      .update({ last_read_at: now })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)

    await supabase
      .from('messages')
      .update({ read_at: now })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .is('read_at', null)
  },

  subscribeToMessages(conversationId: string, callback: (message: ChatMessage) => void) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const { data } = await supabase.auth.getSession()
          const userId = data.session?.user?.id
          if (userId) {
            callback(mapMessage(payload.new as Record<string, unknown>, userId))
          }
        },
      )
      .subscribe()
  },

  subscribeToConversations(callback: (conversation: Conversation) => void) {
    return supabase
      .channel('conversations:user')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'conversation_participants' },
        async (payload) => {
          const { data } = await supabase.auth.getSession()
          const userId = data.session?.user?.id
          if (userId && payload.new.user_id === userId) {
            const conversation = await this.getConversation(payload.new.conversation_id as string)
            if (conversation) callback(conversation)
          }
        },
      )
      .subscribe()
  },
}

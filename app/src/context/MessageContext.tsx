import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ChatMessage, Conversation, Page } from '../types'
import { messagesService } from '../services/messages.service'
import { useAuth } from './AuthContext'

interface MessageContextValue {
  conversations: Conversation[]
  isLoading: boolean
  getConversation: (id: string) => Conversation | undefined
  getMessages: (conversationId: string) => ChatMessage[]
  sendMessage: (conversationId: string, content: string, type?: ChatMessage['type'], mediaUrl?: string) => Promise<void>
  createConversation: (page: Page, initialMessage?: string) => Promise<string>
  markAsRead: (conversationId: string) => Promise<void>
  loadMessages: (conversationId: string) => Promise<void>
}

const MessageContext = createContext<MessageContextValue | undefined>(undefined)

export function MessageProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messagesByConvo, setMessagesByConvo] = useState<Record<string, ChatMessage[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  const loadConversations = useCallback(async () => {
    if (!isAuthenticated) {
      setConversations([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      const list = await messagesService.listConversations()
      setConversations(list)
    } catch (err) {
      console.error('Erreur chargement conversations', err)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  useEffect(() => {
    if (!isAuthenticated) return

    const subscription = messagesService.subscribeToConversations((conversation) => {
      setConversations((prev) => {
        const existing = prev.find((c) => c.id === conversation.id)
        if (existing) return prev
        return [conversation, ...prev]
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [isAuthenticated])

  const getConversation = useCallback(
    (id: string) => conversations.find((c) => c.id === id),
    [conversations],
  )

  const getMessages = useCallback(
    (conversationId: string) => messagesByConvo[conversationId] ?? [],
    [messagesByConvo],
  )

  const loadMessages = useCallback(async (conversationId: string) => {
    const list = await messagesService.listMessages(conversationId)
    setMessagesByConvo((prev) => ({ ...prev, [conversationId]: list }))
  }, [])

  const sendMessage = useCallback(
    async (conversationId: string, content: string, type: ChatMessage['type'] = 'text', mediaUrl?: string) => {
      const sent = await messagesService.sendMessage({ conversationId, content, type, mediaUrl })
      setMessagesByConvo((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] ?? []), sent],
      }))
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                lastPreview: content,
                lastKind: type,
                time: sent.time,
              }
            : c,
        ),
      )
    },
    [],
  )

  const createConversation = useCallback(
    async (page: Page, initialMessage?: string): Promise<string> => {
      const existing = conversations.find((c) => c.page.id === page.id)
      if (existing) {
        if (initialMessage) {
          await sendMessage(existing.id, initialMessage)
        }
        return existing.id
      }

      const conversation = await messagesService.createConversation({
        participantId: page.id,
        initialMessage,
      })

      setConversations((prev) => [conversation, ...prev])
      return conversation.id
    },
    [conversations, sendMessage],
  )

  const markAsRead = useCallback(async (conversationId: string) => {
    await messagesService.markAsRead(conversationId)
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c)),
    )
  }, [])

  useEffect(() => {
    const subs: Array<{ unsubscribe: () => void }> = []

    conversations.forEach((conversation) => {
      const sub = messagesService.subscribeToMessages(conversation.id, (message) => {
        setMessagesByConvo((prev) => {
          const existing = prev[conversation.id]?.find((m) => m.id === message.id)
          if (existing) return prev
          return {
            ...prev,
            [conversation.id]: [...(prev[conversation.id] ?? []), message],
          }
        })

        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversation.id
              ? {
                  ...c,
                  lastPreview: message.content,
                  lastKind: message.type,
                  time: message.time,
                  unread: message.fromMe ? c.unread : c.unread + 1,
                }
              : c,
          ),
        )
      })
      subs.push(sub)
    })

    return () => {
      subs.forEach((sub) => sub.unsubscribe())
    }
  }, [conversations])

  const value = useMemo<MessageContextValue>(
    () => ({
      conversations,
      isLoading,
      getConversation,
      getMessages,
      sendMessage,
      createConversation,
      markAsRead,
      loadMessages,
    }),
    [conversations, isLoading, getConversation, getMessages, sendMessage, createConversation, markAsRead, loadMessages],
  )

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}

export function useMessages(): MessageContextValue {
  const ctx = useContext(MessageContext)
  if (!ctx) throw new Error('useMessages doit être utilisé dans MessageProvider')
  return ctx
}

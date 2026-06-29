import { useState, useMemo, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useMessages } from '../context/MessageContext'
import { useToast } from '../context/ToastContext'
import { ChatHeader } from '../components/messages/ChatHeader'
import { ChatMessageBubble } from '../components/messages/ChatMessageBubble'
import { ChatInput } from '../components/messages/ChatInput'
import { TypingIndicator } from '../components/messages/TypingIndicator'
import { DateSeparator } from '../components/messages/DateSeparator'
import type { ChatMessage, Conversation } from '../types'

export default function Conversation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { annonces } = useData()
  const { show } = useToast()
  const { getConversation, getMessages, sendMessage, deleteMessage, createConversation, markAsRead } = useMessages()

  const convo = useMemo<Conversation | undefined>(() => {
    if (!id) return undefined
    const existing = getConversation(id)
    if (existing) return existing
    const annonce = annonces.find((a) => a.id === id)
    if (annonce) {
      const newId = createConversation(annonce.page, annonce.title)
      return getConversation(newId)
    }
    return undefined
  }, [id, annonces, getConversation, createConversation])

  const conversationId = convo?.id ?? id ?? ''
  const [messages, setMessages] = useState<ChatMessage[]>(
    getMessages(conversationId),
  )
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMessages(getMessages(conversationId))
    if (conversationId) markAsRead(conversationId)
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    return () => {
      if (replyTimer.current) clearTimeout(replyTimer.current)
    }
  }, [])

  function nowTime() {
    const d = new Date()
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  function simulateReply() {
    setTyping(true)
    replyTimer.current = setTimeout(() => {
      setTyping(false)
      const replyMsg: ChatMessage = {
        id: `m${Date.now()}-r`,
        fromMe: false,
        type: 'text',
        content: 'Merci pour votre message, je reviens vers vous très vite !',
        time: nowTime(),
      }
      setMessages((m) => [...m, replyMsg])
      sendMessage(conversationId, replyMsg)
    }, 2000)
  }

  function handleSendText(text: string) {
    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      fromMe: true,
      type: 'text',
      content: text,
      time: nowTime(),
      read: false,
    }
    setMessages((m) => [...m, msg])
    sendMessage(conversationId, msg)
    simulateReply()
  }

  function handleSendVoice(durationSec: number) {
    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      fromMe: true,
      type: 'voice',
      content: `0:${String(durationSec).padStart(2, '0')}`,
      time: nowTime(),
      read: false,
    }
    setMessages((m) => [...m, msg])
    sendMessage(conversationId, msg)
    simulateReply()
  }

  function handleAttach(kind: string) {
    if (kind === 'photo') {
      const seed = `chat${Date.now()}`
      const msg: ChatMessage = {
        id: `m${Date.now()}`,
        fromMe: true,
        type: 'image',
        content: `https://picsum.photos/seed/${seed}/600/400`,
        time: nowTime(),
        read: false,
      }
      setMessages((m) => [...m, msg])
      sendMessage(conversationId, msg)
      show('Photo envoyée')
      simulateReply()
    } else if (kind === 'location') {
      const msg: ChatMessage = {
        id: `m${Date.now()}`,
        fromMe: true,
        type: 'location',
        content: 'Brazzaville, Congo',
        time: nowTime(),
        read: false,
      }
      setMessages((m) => [...m, msg])
      sendMessage(conversationId, msg)
      show('Localisation partagée')
      simulateReply()
    } else if (kind === 'document') {
      const msg: ChatMessage = {
        id: `m${Date.now()}`,
        fromMe: true,
        type: 'document',
        content: 'Contrat_de_location.pdf',
        time: nowTime(),
        read: false,
      }
      setMessages((m) => [...m, msg])
      sendMessage(conversationId, msg)
      show('Document envoyé')
      simulateReply()
    }
  }

  function handleDeleteMessage(msgId: string) {
    setMessages((m) => m.filter((msg) => msg.id !== msgId))
    deleteMessage(conversationId, msgId)
    show('Message supprimé')
  }

  if (!convo) {
    return (
      <div className="flex h-full items-center justify-center bg-white p-6 text-center text-muted">
        <div>
          <p>Conversation introuvable.</p>
          <button onClick={() => navigate('/messages')} className="btn-outline mt-4">
            Retour aux messages
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-white">
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          convo={convo}
          onCallAudio={() => show('Appel audio en cours… (démo)')}
          onCallVideo={() => show('Appel vidéo en cours… (démo)')}
        />

        {convo.annonceTitle && (
          <div className="border-b border-line bg-primary-light/50 px-4 py-2 text-sm text-ink">
            Annonce : <span className="font-semibold">{convo.annonceTitle}</span>
          </div>
        )}

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-soft px-4 py-4 pb-6">
          <DateSeparator label="Aujourd'hui" />
          {messages.map((m) => (
            <ChatMessageBubble key={m.id} message={m} onDelete={handleDeleteMessage} />
          ))}
          {typing && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          onSendText={handleSendText}
          onSendVoice={handleSendVoice}
          onAttach={handleAttach}
        />
      </div>
    </div>
  )
}

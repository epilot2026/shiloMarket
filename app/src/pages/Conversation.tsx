import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
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
  const { getConversation, getMessages, sendMessage, createConversation, markAsRead, loadMessages } = useMessages()

  const [convo, setConvo] = useState<Conversation | undefined>(undefined)

  useEffect(() => {
    if (!id) {
      setConvo(undefined)
      return
    }
    const existing = getConversation(id)
    if (existing) {
      setConvo(existing)
      return
    }
    const annonce = annonces.find((a) => a.id === id)
    if (annonce) {
      createConversation(annonce.page, annonce.title).then((newId) => {
        setConvo(getConversation(newId))
      })
    } else {
      setConvo(undefined)
    }
  }, [id, annonces, getConversation, createConversation])

  const conversationId = convo?.id ?? id ?? ''
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!conversationId) return
    loadMessages(conversationId).then(() => {
      setMessages(getMessages(conversationId))
    })
    markAsRead(conversationId)
  }, [conversationId, loadMessages, getMessages, markAsRead])

  useEffect(() => {
    setMessages(getMessages(conversationId))
  }, [conversationId, getMessages])

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

  const simulateReply = useCallback(() => {
    setTyping(true)
    replyTimer.current = setTimeout(() => {
      setTyping(false)
      const text = 'Merci pour votre message, je reviens vers vous très vite !'
      setMessages((m) => [...m, { id: `m${Date.now()}-r`, fromMe: false, type: 'text', content: text, time: nowTime() }])
      if (conversationId) sendMessage(conversationId, text)
    }, 2000)
  }, [conversationId, sendMessage])

  async function handleSendText(text: string) {
    setMessages((m) => [...m, { id: `m${Date.now()}`, fromMe: true, type: 'text', content: text, time: nowTime(), read: false }])
    await sendMessage(conversationId, text)
    simulateReply()
  }

  async function handleSendVoice(durationSec: number) {
    const content = `0:${String(durationSec).padStart(2, '0')}`
    setMessages((m) => [...m, { id: `m${Date.now()}`, fromMe: true, type: 'voice', content, time: nowTime(), read: false }])
    await sendMessage(conversationId, content, 'voice')
    simulateReply()
  }

  async function handleAttach(kind: string) {
    if (kind === 'photo') {
      const seed = `chat${Date.now()}`
      const content = `https://picsum.photos/seed/${seed}/600/400`
      setMessages((m) => [...m, { id: `m${Date.now()}`, fromMe: true, type: 'image', content, time: nowTime(), read: false }])
      await sendMessage(conversationId, content, 'image')
      show('Photo envoyée')
      simulateReply()
    } else if (kind === 'location') {
      const content = 'Brazzaville, Congo'
      setMessages((m) => [...m, { id: `m${Date.now()}`, fromMe: true, type: 'location', content, time: nowTime(), read: false }])
      await sendMessage(conversationId, content, 'location')
      show('Localisation partagée')
      simulateReply()
    } else if (kind === 'document') {
      const content = 'Contrat_de_location.pdf'
      setMessages((m) => [...m, { id: `m${Date.now()}`, fromMe: true, type: 'document', content, time: nowTime(), read: false }])
      await sendMessage(conversationId, content, 'document')
      show('Document envoyé')
      simulateReply()
    }
  }

  function handleDeleteMessage(msgId: string) {
    setMessages((m) => m.filter((msg) => msg.id !== msgId))
    show('Message supprimé (côté client uniquement)')
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

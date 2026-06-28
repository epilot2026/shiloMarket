import { useState, useMemo, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Video, Plus, Mic, Send, Play, Trash2 } from 'lucide-react'
import { getConversationById, sampleMessages } from '../data/messages'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import { EmojiPicker } from '../components/messages/EmojiPicker'
import type { ChatMessage, Conversation } from '../types'
import { VerifiedBadge } from '../components/ui/Badges'

export default function Conversation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { annonces } = useData()
  const { show } = useToast()

  const convo = useMemo<Conversation | undefined>(() => {
    if (!id) return undefined
    const existing = getConversationById(id)
    if (existing) return existing
    const annonce = annonces.find((a) => a.id === id)
    if (annonce) {
      return {
        id: `conv-${annonce.id}`,
        page: annonce.page,
        lastPreview: '',
        lastKind: 'text',
        time: 'maintenant',
        unread: 0,
        online: false,
        annonceTitle: annonce.title,
      }
    }
    return undefined
  }, [id, annonces])

  const [messages, setMessages] = useState<ChatMessage[]>(
    (id && sampleMessages[id]) || [],
  )
  const [draft, setDraft] = useState('')
  const [recording, setRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const recordTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function startRecording() {
    setRecording(true)
    setRecordSeconds(0)
    recordTimer.current = setInterval(() => {
      setRecordSeconds((s) => s + 1)
    }, 1000)
  }

  function cancelRecording() {
    if (recordTimer.current) clearInterval(recordTimer.current)
    setRecording(false)
    setRecordSeconds(0)
  }

  function sendVoiceMessage() {
    if (recordTimer.current) clearInterval(recordTimer.current)
    const duration = recordSeconds
    setRecording(false)
    setRecordSeconds(0)
    if (duration === 0) return
    setMessages((m) => [
      ...m,
      {
        id: `m${m.length + 1}`,
        fromMe: true,
        type: 'voice',
        content: `0:${String(duration).padStart(2, '0')}`,
        time: 'maintenant',
        read: false,
      },
    ])
  }

  function addEmoji(emoji: string) {
    setDraft((d) => d + emoji)
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

  function send() {
    if (!draft.trim()) return
    setMessages((m) => [
      ...m,
      {
        id: `m${m.length + 1}`,
        fromMe: true,
        type: 'text',
        content: draft.trim(),
        time: 'maintenant',
        read: false,
      },
    ])
    setDraft('')
  }

  return (
    <div className="flex h-full bg-white">
      <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex items-center gap-2 border-b border-line bg-white px-3 py-2">
        <button onClick={() => navigate('/messages')} className="btn-ghost text-ink">
          <ArrowLeft size={22} />
        </button>
        <img src={convo.page.avatarUrl} alt={convo.page.name} className="h-9 w-9 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-1 font-semibold leading-tight">
            {convo.page.name}
            {convo.page.verified && <VerifiedBadge size={15} />}
          </div>
          <div className="text-xs text-primary">{convo.online ? 'En ligne' : 'Hors ligne'}</div>
        </div>
        <button onClick={() => show('Appel audio en cours… (démo)')} className="grid h-10 w-10 place-items-center rounded-full bg-soft"><Phone size={18} /></button>
        <button onClick={() => show('Appel vidéo en cours… (démo)')} className="grid h-10 w-10 place-items-center rounded-full bg-soft"><Video size={18} /></button>
      </header>

      {convo.annonceTitle && (
        <div className="border-b border-line bg-primary-light/50 px-4 py-2 text-sm text-ink">
          Annonce : <span className="font-semibold">{convo.annonceTitle}</span>
        </div>
      )}

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-soft px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[15px] ${
                m.fromMe ? 'bg-primary text-white' : 'bg-white text-ink'
              }`}
            >
              {m.type === 'voice' ? (
                <span className="flex items-center gap-2">
                  <Play size={16} /> Message vocal · {m.content}
                </span>
              ) : (
                m.content
              )}
              <div className={`mt-0.5 text-[10px] ${m.fromMe ? 'text-white/70' : 'text-muted'}`}>
                {m.time} {m.fromMe && (m.read ? '✓✓' : '✓')}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {recording ? (
        <div className="flex items-center gap-3 border-t border-line bg-white p-2 safe-bottom">
          <button
            onClick={cancelRecording}
            className="grid h-10 w-10 place-items-center rounded-full bg-soft text-live"
            aria-label="Annuler"
          >
            <Trash2 size={20} />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-full bg-soft px-4 py-2.5">
            <span className="h-3 w-3 animate-pulse rounded-full bg-live" />
            <span className="text-sm font-medium text-ink">Enregistrement… 0:{String(recordSeconds).padStart(2, '0')}</span>
          </div>
          <button
            onClick={sendVoiceMessage}
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white"
            aria-label="Envoyer le vocal"
          >
            <Send size={18} />
          </button>
        </div>
      ) : (
      <div className="flex items-center gap-2 border-t border-line bg-white p-2 safe-bottom">
        <button className="grid h-10 w-10 place-items-center rounded-full bg-soft" aria-label="Joindre"><Plus size={20} /></button>
        <EmojiPicker onPick={addEmoji} />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Écrire un message…"
          className="flex-1 rounded-full bg-soft px-4 py-2.5 outline-none"
        />
        {draft.trim() ? (
          <button onClick={send} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white" aria-label="Envoyer">
            <Send size={18} />
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="grid h-10 w-10 place-items-center rounded-full bg-soft transition hover:bg-line/50"
            aria-label="Message vocal"
          >
            <Mic size={20} />
          </button>
        )}
      </div>
      )}
      </div>
    </div>
  )
}

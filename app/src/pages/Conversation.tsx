import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Video, Plus, Mic, Send, Play } from 'lucide-react'
import { getConversationById, sampleMessages } from '../data/messages'
import type { ChatMessage } from '../types'
import { VerifiedBadge } from '../components/ui/Badges'
import { Sidebar } from '../components/layout/Sidebar'
import { BottomNav } from '../components/layout/BottomNav'

export default function Conversation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const convo = id ? getConversationById(id) : undefined
  const [messages, setMessages] = useState<ChatMessage[]>(
    (id && sampleMessages[id]) || [],
  )
  const [draft, setDraft] = useState('')

  if (!convo) {
    return <div className="p-6 text-center text-muted">Conversation introuvable.</div>
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
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex items-center gap-2 border-b border-line bg-white px-3 py-2">
        <button onClick={() => navigate('/messages')} className="btn-ghost text-ink">
          <ArrowLeft size={22} />
        </button>
        <img src={convo.page.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-1 font-semibold leading-tight">
            {convo.page.name}
            {convo.page.verified && <VerifiedBadge size={15} />}
          </div>
          <div className="text-xs text-primary">{convo.online ? 'En ligne' : 'Hors ligne'}</div>
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full bg-soft"><Phone size={18} /></button>
        <button className="grid h-10 w-10 place-items-center rounded-full bg-soft"><Video size={18} /></button>
      </header>

      {convo.annonceTitle && (
        <div className="border-b border-line bg-primary-light/50 px-4 py-2 text-sm text-ink">
          Annonce : <span className="font-semibold">{convo.annonceTitle}</span>
        </div>
      )}

      <div className="flex-1 space-y-2 overflow-y-auto bg-soft px-4 py-4">
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
      </div>

      <div className="flex items-center gap-2 border-t border-line bg-white p-2 safe-bottom">
        <button className="grid h-10 w-10 place-items-center rounded-full bg-soft"><Plus size={20} /></button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Écrire un message…"
          className="flex-1 rounded-full bg-soft px-4 py-2.5 outline-none"
        />
        {draft.trim() ? (
          <button onClick={send} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white">
            <Send size={18} />
          </button>
        ) : (
          <button className="grid h-10 w-10 place-items-center rounded-full bg-soft"><Mic size={20} /></button>
        )}
      </div>
      </div>
      <BottomNav />
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { MessageCircle, Search, Mic, Image as ImageIcon } from 'lucide-react'
import { conversations } from '../data/messages'
import { useAuth } from '../context/AuthContext'
import { VerifiedBadge } from '../components/ui/Badges'

export default function Messages() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
        <MessageCircle size={56} className="text-primary" />
        <h1 className="mt-4 text-xl font-bold">Connectez-vous pour discuter</h1>
        <p className="mt-2 text-muted">
          Envoyez des messages, vocaux et lancez des appels vidéo avec les propriétaires et prestataires.
        </p>
        <button onClick={() => navigate('/connexion')} className="btn-primary mt-6 px-8">
          Se connecter
        </button>
      </div>
    )
  }

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-line bg-white px-4 py-3">
        <h1 className="text-2xl font-extrabold text-primary">Messages</h1>
        <div className="field mt-3 h-12">
          <Search size={20} className="text-muted" />
          <input placeholder="Rechercher une conversation" />
        </div>
      </header>

      <ul className="divide-y divide-line">
        {conversations.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => navigate(`/messages/${c.id}`)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-soft"
            >
              <img src={c.page.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 font-semibold">
                    {c.page.name}
                    {c.page.verified && <VerifiedBadge size={15} />}
                  </span>
                  <span className="text-xs text-muted">{c.time}</span>
                </div>
                <div className={`flex items-center gap-1 text-sm ${c.unread ? 'font-semibold text-ink' : 'text-muted'}`}>
                  {c.lastKind === 'voice' && <Mic size={14} />}
                  {c.lastKind === 'image' && <ImageIcon size={14} />}
                  <span className="truncate">{c.lastPreview}</span>
                </div>
              </div>
              {c.unread > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs font-bold text-white">
                  {c.unread}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

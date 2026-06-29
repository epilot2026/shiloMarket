import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone } from 'lucide-react'
import { VerifiedBadge } from '../ui/Badges'
import type { Conversation } from '../../types'

interface Props {
  convo: Conversation
  onCallAudio: () => void
}

export function ChatHeader({ convo, onCallAudio }: Props) {
  const navigate = useNavigate()

  return (
    <header className="safe-top flex items-center gap-2 border-b border-line bg-white px-3 py-2">
      <button onClick={() => navigate('/messages')} className="btn-ghost text-ink">
        <ArrowLeft size={22} />
      </button>
      <img src={convo.page.avatarUrl} alt={convo.page.name} className="h-9 w-9 rounded-full object-cover" />
      <div className="flex-1">
        <div className="flex items-center gap-1 font-semibold leading-tight">
          {convo.page.name}
          {convo.page.verified && <VerifiedBadge size={15} />}
        </div>
        <div className="text-xs text-primary">
          {convo.online ? 'En ligne' : 'Vu récemment'}
        </div>
      </div>
      <button onClick={onCallAudio} className="grid h-10 w-10 place-items-center rounded-full bg-soft" aria-label="Appel audio">
        <Phone size={18} />
      </button>
    </header>
  )
}

import { useNavigate } from 'react-router-dom'
import { Image, Video, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { demoUser } from '../../data/users'
import { handleImageError } from '../../lib/format'

export function Composer() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const go = () => navigate('/publier')
  return (
    <div className="border-b border-line px-4 py-3">
      <div className="flex items-center gap-3">
        <img
          src={user?.avatarUrl ?? demoUser.avatarUrl}
          alt={user?.fullName ?? demoUser.fullName}
          loading="lazy"
          onError={handleImageError}
          className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
        />
        <button
          onClick={go}
          className="min-w-0 flex-1 truncate whitespace-nowrap rounded-lg border border-line px-4 py-2.5 text-left text-sm text-muted transition active:scale-[0.98]"
        >
          Publier…
        </button>
      </div>
      <div className="mt-2.5 flex items-center gap-2 text-sm font-medium">
        <button onClick={go} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-2 py-2 text-ink shadow-sm transition hover:shadow-md active:scale-95">
          <Image size={18} className="text-primary" /> <span className="whitespace-nowrap">Photos</span>
        </button>
        <button onClick={go} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-2 py-2 text-ink shadow-sm transition hover:shadow-md active:scale-95">
          <Video size={18} className="text-live" /> <span className="whitespace-nowrap">Vidéo</span>
        </button>
        <button onClick={go} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-2 py-2 text-ink shadow-sm transition hover:shadow-md active:scale-95">
          <MapPin size={18} className="text-loc" /> <span className="whitespace-nowrap">Lieu</span>
        </button>
      </div>
    </div>
  )
}

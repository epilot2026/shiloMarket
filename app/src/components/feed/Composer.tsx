import { useNavigate } from 'react-router-dom'
import { Image, Video, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { demoUser } from '../../data/users'

export function Composer() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const go = () => navigate('/publier')
  return (
    <div className="card mx-4 mt-3 p-4">
      <div className="flex items-center gap-3">
        <img src={user?.avatarUrl ?? demoUser.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
        <button onClick={go} className="flex-1 rounded-full bg-soft px-4 py-2.5 text-left text-muted">
          Publiez une annonce ou un service…
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm font-medium">
        <button onClick={go} className="flex items-center gap-1.5 text-ink">
          <Image size={18} className="text-primary" /> Photos
        </button>
        <button onClick={go} className="flex items-center gap-1.5 text-ink">
          <Video size={18} className="text-live" /> Vidéo
        </button>
        <button onClick={go} className="flex items-center gap-1.5 text-ink">
          <MapPin size={18} className="text-loc" /> Localisation
        </button>
      </div>
    </div>
  )
}

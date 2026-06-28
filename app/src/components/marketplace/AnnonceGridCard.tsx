import { useNavigate } from 'react-router-dom'
import { MapPin, Bookmark, Video } from 'lucide-react'
import type { Annonce } from '../../types'
import { formatPrice } from '../../lib/format'
import { CertifiedTag } from '../ui/Badges'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'

export function AnnonceGridCard({ annonce }: { annonce: Annonce }) {
  const navigate = useNavigate()
  const { isSaved, toggleSave } = useData()
  const { show } = useToast()
  const saved = isSaved(annonce.id)
  return (
    <div
      onClick={() => navigate(`/annonce/${annonce.id}`)}
      className="card cursor-pointer overflow-hidden text-left"
    >
      <div className="relative">
        <img
          src={annonce.images[0]}
          alt={annonce.title}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
        {annonce.certified && (
          <div className="absolute left-2 top-2">
            <CertifiedTag />
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleSave(annonce.id)
            show(saved ? 'Retiré des enregistrements' : 'Annonce enregistrée')
          }}
          aria-label="Enregistrer"
          aria-pressed={saved}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink"
        >
          <Bookmark size={16} className={saved ? 'fill-primary text-primary' : ''} />
        </button>
        {annonce.videos.length > 0 && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            <Video size={12} /> Vidéo
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="font-extrabold text-primary">
          {formatPrice(annonce.price, annonce.priceSuffix)}
        </div>
        <div className="mt-0.5 line-clamp-2 text-sm font-semibold">{annonce.title}</div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted">
          <MapPin size={12} /> {annonce.location}
        </div>
      </div>
    </div>
  )
}

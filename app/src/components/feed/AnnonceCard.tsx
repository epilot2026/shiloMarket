import { useNavigate } from 'react-router-dom'
import { MapPin, ThumbsUp, MessageSquare, Bookmark, Share2, MessageCircle, Phone, Video, Heart } from 'lucide-react'
import type { Annonce } from '../../types'
import { formatPrice } from '../../lib/format'
import { VerifiedBadge, CertifiedAnnonceTag, AvailableTag } from '../ui/Badges'
import { ImageCarousel } from '../ui/ImageCarousel'
import { CATEGORIES } from '../../constants'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'

export function AnnonceCard({ annonce }: { annonce: Annonce }) {
  const navigate = useNavigate()
  const cat = CATEGORIES.find((c) => c.key === annonce.category)
  const { isLiked, toggleLike, likeCount, isSaved, toggleSave } = useData()
  const { show } = useToast()
  const liked = isLiked(annonce.id)
  const saved = isSaved(annonce.id)

  function shareAnnonce() {
    const url = `${window.location.origin}/annonce/${annonce.id}`
    if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {})
    show('Lien copié dans le presse-papier')
  }

  return (
    <article className="card mx-4 mt-3 overflow-hidden">
      {/* En-tête */}
      <div className="flex items-start gap-3 p-4 pb-2">
        <button
          onClick={() => navigate('/profil')}
          aria-label={`Voir la page ${annonce.page.name}`}
        >
          <img
            src={annonce.page.avatarUrl}
            alt={annonce.page.name}
            loading="lazy"
            className="h-11 w-11 rounded-full object-cover"
          />
        </button>
        <div className="min-w-0 flex-1">
          <button
            onClick={() => navigate('/profil')}
            className="flex items-center gap-1 font-semibold"
          >
            {annonce.page.name}
            {annonce.page.verified && <VerifiedBadge />}
          </button>
          <div className="flex items-center gap-1 text-xs text-muted">
            <MapPin size={13} /> {annonce.location} · {annonce.createdAt}
          </div>
          {cat && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
              <cat.icon size={12} /> {cat.label}
            </span>
          )}
        </div>
      </div>

      {/* Contenu */}
      <button onClick={() => navigate(`/annonce/${annonce.id}`)} className="block w-full px-4 text-left">
        <h3 className="text-lg font-bold leading-snug">{annonce.title}</h3>
        <p className="mt-1 line-clamp-3 text-[15px] text-ink/80">{annonce.description}</p>
      </button>

      <div className="relative mt-3 px-4">
        <ImageCarousel images={annonce.images} alt={annonce.title} />
        {annonce.videos.length > 0 && (
          <span className="absolute bottom-2 left-6 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
            <Video size={14} /> Vidéo
          </span>
        )}
      </div>

      {/* Prix */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <span className="text-xl font-extrabold text-primary">
          {formatPrice(annonce.price, annonce.priceSuffix)}
        </span>
        {annonce.available && <AvailableTag />}
      </div>
      {annonce.certified && (
        <div className="px-4 pt-2">
          <CertifiedAnnonceTag />
        </div>
      )}

      {/* Compteurs */}
      <div className="flex items-center justify-between px-4 py-2.5 text-sm text-muted">
        <span className="flex items-center gap-1">
          <Heart size={14} className="fill-live text-live" /> {likeCount(annonce)}
        </span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1"><MessageSquare size={14} /> {annonce.comments}</span>
          <span className="flex items-center gap-1"><Share2 size={14} /> {annonce.shares}</span>
        </span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-4 border-t border-line text-sm font-medium text-ink">
        <button
          onClick={() => toggleLike(annonce.id)}
          aria-pressed={liked}
          className={`flex items-center justify-center gap-1.5 py-2.5 hover:bg-soft ${liked ? 'text-primary' : ''}`}
        >
          <ThumbsUp size={18} className={liked ? 'fill-primary' : ''} /> J'aime
        </button>
        <button
          onClick={() => navigate(`/annonce/${annonce.id}`)}
          className="flex items-center justify-center gap-1.5 py-2.5 hover:bg-soft"
        >
          <MessageSquare size={18} /> Comm.
        </button>
        <button
          onClick={() => {
            toggleSave(annonce.id)
            show(saved ? 'Retiré des enregistrements' : 'Annonce enregistrée')
          }}
          aria-pressed={saved}
          className={`flex items-center justify-center gap-1.5 py-2.5 hover:bg-soft ${saved ? 'text-primary' : ''}`}
        >
          <Bookmark size={18} className={saved ? 'fill-primary' : ''} /> Enreg.
        </button>
        <button
          onClick={shareAnnonce}
          className="flex items-center justify-center gap-1.5 py-2.5 hover:bg-soft"
        >
          <Share2 size={18} /> Partager
        </button>
      </div>

      {/* Contacter */}
      <div className="flex items-center gap-2 border-t border-line p-3">
        <button
          onClick={() => navigate(`/messages/${annonce.id}`)}
          className="btn-primary h-11 flex-1"
        >
          <MessageCircle size={18} /> Discuter
        </button>
        <button
          onClick={() => show('Appel audio en cours… (démo)')}
          aria-label="Appel audio"
          className="grid h-11 w-12 place-items-center rounded-xl bg-primary-light text-primary"
        >
          <Phone size={18} />
        </button>
        <button
          onClick={() => show('Appel vidéo en cours… (démo)')}
          aria-label="Appel vidéo"
          className="grid h-11 w-12 place-items-center rounded-xl bg-primary-light text-primary"
        >
          <Video size={18} />
        </button>
      </div>
    </article>
  )
}

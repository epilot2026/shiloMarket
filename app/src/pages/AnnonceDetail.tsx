import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bookmark, Share2, MapPin, MessageCircle, Phone, Video, ThumbsUp, MessageSquare } from 'lucide-react'
import { getAnnonceById } from '../data/annonces'
import { formatPrice, formatCount } from '../lib/format'
import { ImageCarousel } from '../components/ui/ImageCarousel'
import { VerifiedBadge, CertifiedTag, AvailableTag } from '../components/ui/Badges'

export default function AnnonceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const annonce = id ? getAnnonceById(id) : undefined

  if (!annonce) {
    return (
      <div className="p-6 text-center text-muted">
        Annonce introuvable.
        <button onClick={() => navigate('/marketplace')} className="btn-outline mt-4">
          Retour au marketplace
        </button>
      </div>
    )
  }

  return (
    <div className="pb-24 lg:pb-8">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/95 px-3 py-2 backdrop-blur">
        <button onClick={() => navigate(-1)} className="btn-ghost text-ink">
          <ArrowLeft size={22} />
        </button>
        <div className="flex gap-1">
          <button className="grid h-10 w-10 place-items-center rounded-full bg-soft"><Bookmark size={18} /></button>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-soft"><Share2 size={18} /></button>
        </div>
      </header>

      <div className="px-4">
        <ImageCarousel images={annonce.images} alt={annonce.title} />
        {annonce.video && (
          <video
            src={annonce.video}
            controls
            className="mt-3 w-full rounded-xl bg-black"
          />
        )}
      </div>

      <div className="px-4 pt-3 lg:grid lg:grid-cols-[1fr_320px] lg:gap-6">
        <div>
          {annonce.certified && <CertifiedTag />}
          <h1 className="mt-2 text-2xl font-extrabold">{annonce.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-xl font-extrabold text-primary">
              {formatPrice(annonce.price, annonce.priceSuffix)}
            </span>
            {annonce.available && <AvailableTag />}
          </div>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted">
            <MapPin size={14} /> {annonce.location}
          </div>

          <hr className="my-4 border-line" />
          <h2 className="mb-1 font-bold">Description</h2>
          <p className="text-[15px] leading-relaxed text-ink/80">{annonce.description}</p>

          <hr className="my-4 border-line" />
          <h2 className="mb-2 font-bold">Publié par</h2>
          <div className="flex items-center gap-3">
            <img src={annonce.page.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-1 font-semibold">
                {annonce.page.name}
                {annonce.page.verified && <VerifiedBadge />}
              </div>
              <div className="text-xs text-muted">{formatCount(annonce.page.followers)} abonnés</div>
            </div>
            <button className="btn-outline h-9 text-sm">Voir la page</button>
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-line pt-3 text-sm text-muted">
            <span className="flex items-center gap-1"><ThumbsUp size={16} /> {annonce.reactions}</span>
            <span className="flex items-center gap-1"><MessageSquare size={16} /> {annonce.comments}</span>
          </div>
        </div>

        {/* Actions desktop */}
        <aside className="hidden lg:block">
          <div className="card sticky top-20 space-y-2 p-4">
            <button onClick={() => navigate('/messages/c1')} className="btn-primary w-full">
              <MessageCircle size={18} /> Discuter
            </button>
            <button className="btn-outline w-full"><Phone size={18} /> Appeler</button>
            <button className="btn-outline w-full"><Video size={18} /> Appel vidéo</button>
          </div>
        </aside>
      </div>

      {/* Barre d'action collée (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-line bg-white p-3 safe-bottom lg:hidden">
        <button onClick={() => navigate('/messages/c1')} className="btn-primary h-12 flex-1">
          <MessageCircle size={18} /> Discuter
        </button>
        <button className="grid h-12 w-14 place-items-center rounded-xl bg-primary-light text-primary"><Phone size={20} /></button>
        <button className="grid h-12 w-14 place-items-center rounded-xl bg-primary-light text-primary"><Video size={20} /></button>
      </div>
    </div>
  )
}

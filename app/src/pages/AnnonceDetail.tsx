import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Bookmark, Share2, MapPin, MessageCircle, Phone, ThumbsUp, MessageSquare, FileText, Download } from 'lucide-react'
import { formatPrice, formatCount } from '../lib/format'
import { ImageCarousel } from '../components/ui/ImageCarousel'
import { VerifiedBadge, CertifiedTag, AvailableTag } from '../components/ui/Badges'
import { CommentsSection } from '../components/ui/CommentsSection'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import type { Comment } from '../services/interactions.service'

export default function AnnonceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { annonces, isSaved, toggleSave, getComments, addComment, commentCount } = useData()
  const { show } = useToast()
  const annonce = annonces.find((a) => a.id === id)
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    if (!id) return
    let cancelled = false
    getComments(id).then((list) => {
      if (!cancelled) setComments(list)
    })
    return () => {
      cancelled = true
    }
  }, [id, getComments])

  if (!annonce) {
    return (
      <div className="p-6 text-center text-muted">
        Annonce introuvable.
        <button onClick={() => navigate('/marketplace')} className="btn-outline mt-4">
          Retour
        </button>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto pb-16 xl:pb-8">
      <header className="safe-top sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-4 py-3">
        <button onClick={() => navigate(-1)} className="btn-ghost -ml-2 text-ink" aria-label="Retour">
          <ArrowLeft size={22} />
        </button>
        <span className="text-xs font-semibold text-muted">Détail</span>
        <div className="flex gap-1">
          <button
            onClick={() => { toggleSave(annonce.id); show(isSaved(annonce.id) ? 'Retiré des enregistrements' : 'Annonce enregistrée') }}
            aria-label="Enregistrer"
            aria-pressed={isSaved(annonce.id)}
            className="grid h-10 w-10 place-items-center rounded-full bg-soft"
          >
            <Bookmark size={18} className={isSaved(annonce.id) ? 'fill-primary text-primary' : ''} />
          </button>
          <button
            onClick={() => {
              const url = `${window.location.origin}/annonce/${annonce.id}`
              navigator.clipboard?.writeText(url).catch(() => {})
              show('Lien copié')
            }}
            aria-label="Partager"
            className="grid h-10 w-10 place-items-center rounded-full bg-soft"
          >
            <Share2 size={18} />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-4 lg:grid lg:grid-cols-[1fr_300px] lg:gap-6">
        {/* Colonne principale */}
        <div className="min-w-0">
          <div className="overflow-hidden rounded-xl">
            <ImageCarousel images={annonce.images} alt={annonce.title} />
          </div>
          {annonce.videos.map((v, i) => (
            <video
              key={`video-${i}`}
              src={v}
              controls
              className="mt-3 w-full rounded-xl bg-black"
            />
          ))}
          {annonce.documents.length > 0 && (
            <div className="mt-3 space-y-2">
              <h3 className="text-sm font-bold">Documents</h3>
              {annonce.documents.map((doc, i) => (
                <a
                  key={`doc-${i}`}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 transition hover:bg-soft"
                >
                  <FileText size={20} className="shrink-0 text-primary" />
                  <span className="flex-1 truncate text-sm font-medium">{doc.name}</span>
                  <Download size={18} className="shrink-0 text-muted" />
                </a>
              ))}
            </div>
          )}

          {annonce.certified && <div className="mt-3"><CertifiedTag /></div>}
          <h1 className="mt-2 text-xl font-extrabold">{annonce.title}</h1>
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
            <button onClick={() => navigate(`/page/${annonce.page.id}`)} aria-label={`Voir la page ${annonce.page.name}`}>
              <img src={annonce.page.avatarUrl} alt={annonce.page.name} loading="lazy" className="h-12 w-12 rounded-full object-cover" />
            </button>
            <div className="flex-1">
              <button onClick={() => navigate(`/page/${annonce.page.id}`)} className="flex items-center gap-1 font-semibold">
                {annonce.page.name}
                {annonce.page.verified && <VerifiedBadge />}
              </button>
              <div className="text-xs text-muted">{formatCount(annonce.page.followers)} abonnés</div>
            </div>
            <button onClick={() => navigate(`/page/${annonce.page.id}`)} className="btn-outline h-9 text-sm">Voir</button>
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-line pt-3 text-sm text-muted">
            <span className="flex items-center gap-1"><ThumbsUp size={16} /> {annonce.reactions}</span>
            <span className="flex items-center gap-1"><MessageSquare size={16} /> {commentCount(annonce.id)}</span>
          </div>

          <CommentsSection
            comments={comments}
            onAddComment={(text) => addComment(annonce.id, text)}
          />
        </div>

        {/* Sidebar droite desktop */}
        <aside className="hidden lg:block">
          <div className="card sticky top-20 space-y-2 p-4">
            <button onClick={() => navigate(`/messages/${annonce.id}`)} className="btn-primary w-full">
              <MessageCircle size={18} /> Discuter
            </button>
            <button onClick={() => show('Appel audio en cours… (démo)')} className="btn-outline w-full"><Phone size={18} /> Appeler</button>
          </div>
        </aside>
      </div>

      {/* Barre d'action collée (mobile) */}
      <div className="fixed inset-x-0 bottom-16 z-30 flex items-center gap-2 border-t border-line bg-white p-3 safe-bottom xl:hidden">
        <button onClick={() => navigate(`/messages/${annonce.id}`)} className="btn-primary h-12 flex-1">
          <MessageCircle size={18} /> Discuter
        </button>
        <button onClick={() => show('Appel audio en cours… (démo)')} aria-label="Appel audio" className="grid h-12 w-14 place-items-center rounded-xl bg-primary-light text-primary"><Phone size={20} /></button>
      </div>
    </div>
  )
}

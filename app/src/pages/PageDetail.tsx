import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, MessageCircle, Share2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import { VerifiedBadge } from '../components/ui/Badges'
import { AnnonceGridCard } from '../components/marketplace/AnnonceGridCard'
import { formatCount } from '../lib/format'
import { pagesService } from '../services/pages.service'
import { shortsService } from '../services/shorts.service'
import type { Page, Short } from '../types'

const TABS = ['Annonces', 'Shorts', 'À propos'] as const
type Tab = (typeof TABS)[number]

export default function PageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { annonces, isFollowing, toggleFollow } = useData()
  const { show } = useToast()
  const [tab, setTab] = useState<Tab>('Annonces')
  const [page, setPage] = useState<Page | undefined>(undefined)
  const [pageShorts, setPageShorts] = useState<Short[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setPage(undefined)
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all([
      pagesService.getById(id),
      shortsService.list({ pageId: id }),
    ]).then(([p, s]) => {
      setPage(p || undefined)
      setPageShorts(s)
      setLoading(false)
    }).catch(() => {
      setPage(undefined)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-muted">
        <p>Chargement…</p>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="p-6 text-center text-muted">
        Page introuvable.
        <button onClick={() => navigate(-1)} className="btn-outline mt-4">Retour</button>
      </div>
    )
  }

  const pageAnnonces = annonces.filter((a) => a.page.id === page.id)
  const following = isFollowing(page.id)

  return (
    <div className="h-full overflow-y-auto pb-16 xl:pb-4">
      <header className="safe-top sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white px-4 py-3">
        <button onClick={() => navigate(-1)} className="btn-ghost -ml-2 text-ink" aria-label="Retour">
          <ArrowLeft size={22} />
        </button>
        <span className="flex-1 truncate text-sm font-semibold">{page.name}</span>
        <button
          onClick={() => { navigator.clipboard?.writeText(window.location.href).catch(() => {}); show('Lien copié') }}
          aria-label="Partager"
          className="grid h-10 w-10 place-items-center rounded-full bg-soft"
        >
          <Share2 size={18} />
        </button>
      </header>

      {/* Cover + avatar */}
      <div className="relative">
        <img src={page.coverUrl} alt={`Couverture ${page.name}`} loading="lazy" className="h-40 w-full object-cover" />
        <div className="absolute -bottom-10 left-4">
          <img src={page.avatarUrl} alt={page.name} loading="lazy" className="h-20 w-20 rounded-full border-4 border-white object-cover" />
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-12">
        <div className="flex items-center gap-1">
          <h1 className="text-xl font-extrabold">{page.name}</h1>
          {page.verified && <VerifiedBadge />}
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted">
          <MapPin size={14} /> {page.location}
        </p>
        <p className="mt-1 text-sm text-muted">
          {formatCount(page.followers)} abonnés · {pageAnnonces.length} annonces
        </p>
        {page.description && <p className="mt-2 text-sm text-ink/80">{page.description}</p>}

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => { toggleFollow(page.id); show(following ? `Vous ne suivez plus ${page.name}` : `Vous suivez ${page.name}`) }}
            className={following ? 'btn-outline flex-1' : 'btn-primary flex-1'}
          >
            {following ? 'Abonné' : 'S\'abonner'}
          </button>
          <button
            onClick={() => navigate('/messages')}
            className="btn-outline flex-1"
          >
            <MessageCircle size={18} /> Contacter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold transition ${
              tab === t ? 'border-b-2 border-primary text-primary' : 'text-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-4 py-4">
        {tab === 'Annonces' && (
          pageAnnonces.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {pageAnnonces.map((a) => (
                <AnnonceGridCard key={a.id} annonce={a} />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted">Aucune annonce publiée.</p>
          )
        )}
        {tab === 'Shorts' && (
          pageShorts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {pageShorts.map((s) => (
                <button
                  key={s.id}
                  onClick={() => navigate('/shorts')}
                  className="relative overflow-hidden rounded-xl text-left"
                >
                  <img src={s.videoPoster} alt={s.caption} className="aspect-[9/16] w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-2 left-2 right-2 line-clamp-2 text-xs font-medium text-white">{s.caption}</p>
                  <span className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {formatCount(s.likes)} ❤
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted">Aucun Short publié.</p>
          )
        )}
        {tab === 'À propos' && (
          <div className="space-y-3 text-sm">
            {page.description && <p className="text-ink/80">{page.description}</p>}
            <div className="flex items-center gap-2 text-muted">
              <MapPin size={16} /> {page.location}
            </div>
            {page.verified && (
              <p className="font-medium text-success">Page certifiée</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

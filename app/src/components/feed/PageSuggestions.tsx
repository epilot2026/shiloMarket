import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCount, handleImageError } from '../../lib/format'
import { VerifiedBadge } from '../ui/Badges'
import { pagesService } from '../../services/pages.service'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import type { Page } from '../../types'

export function PageSuggestions() {
  const navigate = useNavigate()
  const { isFollowing, toggleFollow } = useData()
  const { show } = useToast()
  const [pages, setPages] = useState<Page[]>([])

  useEffect(() => {
    pagesService.list().then(setPages).catch(() => setPages([]))
  }, [])

  return (
    <section className="px-4 py-3">
      <h2 className="mb-2 text-base font-bold">Pages suggérées</h2>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {pages.map((p) => {
          const following = isFollowing(p.id)
          return (
            <article
              key={p.id}
              className="w-36 flex-shrink-0 overflow-hidden rounded-lg bg-black/80 backdrop-blur-sm"
            >
              <button
                onClick={() => navigate(`/page/${p.id}`)}
                className="relative block h-28 w-full"
                aria-label={`Voir la page ${p.name}`}
              >
                <img
                  src={p.coverUrl}
                  alt={`Couverture de ${p.name}`}
                  loading="lazy"
                  onError={handleImageError}
                  className="h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
              </button>
              <div className="-mt-8 relative flex flex-col items-center px-2 pb-2 text-center">
                <button
                  onClick={() => navigate(`/page/${p.id}`)}
                  aria-label={`Voir la page ${p.name}`}
                >
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    loading="lazy"
                    onError={handleImageError}
                    className="h-10 w-10 rounded-full border border-white/30 object-cover"
                  />
                </button>
                <button
                  onClick={() => navigate(`/page/${p.id}`)}
                  className="mt-1 flex items-center gap-0.5 text-xs font-semibold text-white"
                >
                  <span className="truncate max-w-[100px]">{p.name}</span>
                  {p.verified && <VerifiedBadge />}
                </button>
                <div className="text-[10px] text-white/60">{formatCount(p.followers)} abonnés</div>
                <button
                  onClick={() => {
                    toggleFollow(p.id)
                    show(following ? `Vous ne suivez plus ${p.name}` : `Vous suivez ${p.name}`)
                  }}
                  aria-pressed={following}
                  className={`mt-1.5 w-full rounded-lg py-1 text-[11px] font-semibold backdrop-blur-sm transition ${
                    following
                      ? 'bg-white/10 text-white/70 border border-white/20'
                      : 'bg-white/15 text-white border border-white/30 hover:bg-white/25'
                  }`}
                >
                  {following ? 'Suivi' : 'Suivre'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

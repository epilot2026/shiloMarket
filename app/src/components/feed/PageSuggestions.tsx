import { useNavigate } from 'react-router-dom'
import { formatCount } from '../../lib/format'
import { VerifiedBadge } from '../ui/Badges'
import { pages } from '../../data/pages'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'

export function PageSuggestions() {
  const navigate = useNavigate()
  const { isFollowing, toggleFollow } = useData()
  const { show } = useToast()

  return (
    <section className="mt-4 px-4">
      <h2 className="mb-2 text-lg font-bold">Pages suggérées</h2>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {pages.map((p) => {
          const following = isFollowing(p.id)
          return (
            <article key={p.id} className="card w-56 flex-shrink-0 overflow-hidden">
              <button
                onClick={() => navigate('/profil')}
                className="block h-24 w-full bg-soft"
                aria-label={`Voir la page ${p.name}`}
              >
                <img
                  src={p.coverUrl}
                  alt={`Couverture de ${p.name}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
              <div className="-mt-6 flex flex-col items-center px-3 pb-3 text-center">
                <button
                  onClick={() => navigate('/profil')}
                  aria-label={`Voir la page ${p.name}`}
                >
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-full border-2 border-white object-cover"
                  />
                </button>
                <button
                  onClick={() => navigate('/profil')}
                  className="mt-1 flex items-center gap-1 font-semibold"
                >
                  {p.name}
                  {p.verified && <VerifiedBadge />}
                </button>
                <div className="text-xs text-muted">{formatCount(p.followers)} abonnés</div>
                <div className="mt-2 flex w-full gap-2">
                  <button
                    onClick={() => {
                      toggleFollow(p.id)
                      show(following ? `Vous ne suivez plus ${p.name}` : `Vous suivez ${p.name}`)
                    }}
                    aria-pressed={following}
                    className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
                      following
                        ? 'bg-soft text-ink'
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    {following ? 'Suivi' : 'Suivre'}
                  </button>
                  <button
                    onClick={() => navigate('/profil')}
                    className="flex-1 rounded-xl border border-line py-2 text-sm font-semibold text-ink hover:bg-soft"
                  >
                    Voir
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

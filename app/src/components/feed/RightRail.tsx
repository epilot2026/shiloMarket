import { useNavigate } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { formatCount } from '../../lib/format'
import { VerifiedBadge } from '../ui/Badges'
import { pages } from '../../data/pages'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'

const TRENDS = [
  { tag: '#immobilier', count: 1240 },
  { tag: '#location', count: 860 },
  { tag: '#vehicules', count: 540 },
  { tag: '#terrains', count: 320 },
  { tag: '#solutions-it', count: 210 },
]

export function RightRail() {
  const navigate = useNavigate()
  const { isFollowing, toggleFollow } = useData()
  const { show } = useToast()

  return (
    <aside className="hidden h-full w-[300px] shrink-0 overflow-y-auto border-l border-line bg-white px-4 py-5 xl:block">
      {/* Pages suggérées */}
      <section>
        <h2 className="mb-3 text-base font-bold">Pages suggérées</h2>
        <ul className="space-y-3">
          {pages.map((p) => {
            const following = isFollowing(p.id)
            return (
              <li key={p.id} className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/profil')}
                  aria-label={`Voir la page ${p.name}`}
                >
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    loading="lazy"
                    className="h-11 w-11 rounded-full object-cover"
                  />
                </button>
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => navigate('/profil')}
                    className="flex items-center gap-1 text-sm font-semibold"
                  >
                    <span className="truncate">{p.name}</span>
                    {p.verified && <VerifiedBadge size={14} />}
                  </button>
                  <p className="text-xs text-muted">{formatCount(p.followers)} abonnés</p>
                </div>
                <button
                  onClick={() => {
                    toggleFollow(p.id)
                    show(following ? `Vous ne suivez plus ${p.name}` : `Vous suivez ${p.name}`)
                  }}
                  aria-pressed={following}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    following
                      ? 'bg-soft text-ink'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {following ? 'Suivi' : 'Suivre'}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Tendances */}
      <section className="mt-6">
        <h2 className="mb-3 flex items-center gap-1.5 text-base font-bold">
          <TrendingUp size={18} className="text-primary" />
          Tendances
        </h2>
        <ul className="space-y-2">
          {TRENDS.map(({ tag, count }) => (
            <li key={tag}>
              <button
                onClick={() => navigate(`/marketplace?q=${tag.slice(1)}`)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-soft"
              >
                <span className="text-sm font-medium text-loc">{tag}</span>
                <span className="text-xs text-muted">{formatCount(count)} publications</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Espace promotionnel */}
      <section className="mt-6">
        <div className="rounded-xl bg-primary-light p-4 text-center">
          <p className="text-sm font-semibold text-primary">Vous avez une page ?</p>
          <p className="mt-1 text-xs text-ink/70">
            Faites-la certifier pour gagner en visibilité et en confiance.
          </p>
          <button
            onClick={() => navigate('/parametres')}
            className="btn-primary mt-3 h-9 px-4 text-sm"
          >
            Demander la certification
          </button>
        </div>
      </section>
    </aside>
  )
}

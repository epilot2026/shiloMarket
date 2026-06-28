import { formatCount } from '../../lib/format'
import { VerifiedBadge } from '../ui/Badges'
import { pages } from '../../data/pages'

export function PageSuggestions() {
  return (
    <section className="mt-4 px-4">
      <h2 className="mb-2 text-lg font-bold">Pages suggérées</h2>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {pages.map((p) => (
          <article key={p.id} className="card w-56 flex-shrink-0 overflow-hidden">
            <div className="h-24 w-full bg-soft">
              <img src={p.coverUrl} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="-mt-6 flex flex-col items-center px-3 pb-3 text-center">
              <img src={p.avatarUrl} alt="" className="h-12 w-12 rounded-full border-2 border-white object-cover" />
              <div className="mt-1 flex items-center gap-1 font-semibold">
                {p.name}
                {p.verified && <VerifiedBadge />}
              </div>
              <div className="text-xs text-muted">{formatCount(p.followers)} abonnés</div>
              <button className="btn-outline mt-2 h-9 w-full text-sm">Voir la page</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

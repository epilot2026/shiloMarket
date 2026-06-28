import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, TrendingUp, Clock, MapPin } from 'lucide-react'
import { CATEGORIES } from '../constants'
import { useData } from '../context/DataContext'
import { formatPrice } from '../lib/format'
import type { Category } from '../types'

const TRENDING_SEARCHES = ['Maison Brazzaville', 'Toyota', 'Site web', 'Climatisation', 'Terrain']

export default function SearchPage() {
  const navigate = useNavigate()
  const { annonces } = useData()
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<Category | 'all'>('all')
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recent-searches')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('recent-searches', JSON.stringify(recentSearches))
    } catch {
      // ignore
    }
  }, [recentSearches])

  const results = useMemo(() => {
    return annonces.filter((a) => {
      const okCat = activeCat === 'all' || a.category === activeCat
      const okQuery =
        !query ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.location.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase())
      return okCat && okQuery
    })
  }, [annonces, query, activeCat])

  function submitSearch(q: string) {
    setQuery(q)
    if (q.trim()) {
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s.toLowerCase() !== q.toLowerCase())
        return [q, ...filtered].slice(0, 8)
      })
    }
  }

  function clearRecent() {
    setRecentSearches([])
    try {
      localStorage.removeItem('recent-searches')
    } catch {
      // ignore
    }
  }

  const showSuggestions = !query && recentSearches.length > 0
  const showTrending = !query && recentSearches.length === 0

  return (
    <div className="mx-auto h-full w-full max-w-content overflow-y-auto pb-20 xl:pb-4">
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="field h-12 flex-1">
            <Search size={20} className="text-muted" />
            <input
              autoFocus
              placeholder="Rechercher une annonce, un service, un lieu…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitSearch(query)
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="Effacer" className="text-muted">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCat('all')}
            className={`chip ${activeCat === 'all' ? 'chip-active' : ''}`}
          >
            Tout
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              className={`chip ${activeCat === c.key ? 'chip-active' : ''}`}
            >
              <c.icon size={15} /> {c.label}
            </button>
          ))}
        </div>
      </header>

      {/* Suggestions quand pas de query */}
      {showTrending && (
        <div className="px-4 py-4">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-muted">
            <TrendingUp size={16} /> Recherches populaires
          </h2>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map((s) => (
              <button
                key={s}
                onClick={() => submitSearch(s)}
                className="chip hover:chip-active"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {showSuggestions && (
        <div className="px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-bold text-muted">
              <Clock size={16} /> Recherches récentes
            </h2>
            <button onClick={clearRecent} className="text-xs font-semibold text-muted hover:text-ink">
              Effacer
            </button>
          </div>
          <ul className="space-y-1">
            {recentSearches.map((s) => (
              <li key={s}>
                <button
                  onClick={() => submitSearch(s)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-soft"
                >
                  <Clock size={16} className="text-muted" />
                  <span className="flex-1 text-[15px]">{s}</span>
                  <X
                    size={16}
                    className="text-muted"
                    onClick={(e) => {
                      e.stopPropagation()
                      setRecentSearches((prev) => prev.filter((x) => x !== s))
                    }}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Résultats */}
      {query && (
        <div className="px-4 py-4">
          <p className="mb-3 text-sm text-muted">
            {results.length} résultat{results.length > 1 ? 's' : ''} pour « {query} »
          </p>
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-soft">
                <Search size={36} className="text-muted" />
              </span>
              <p className="mt-4 font-semibold">Aucun résultat trouvé</p>
              <p className="mt-1 text-sm text-muted">Essayez d'autres mots-clés ou catégories.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {results.map((a) => {
                const cat = CATEGORIES.find((c) => c.key === a.category)
                return (
                  <li key={a.id}>
                    <button
                      onClick={() => navigate(`/annonce/${a.id}`)}
                      className="card flex w-full items-center gap-3 p-3 text-left transition hover:shadow-card"
                    >
                      <img
                        src={a.images[0]}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold">{a.title}</h3>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                          <MapPin size={12} /> {a.location}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-extrabold text-primary">
                            {formatPrice(a.price, a.priceSuffix)}
                          </span>
                          {cat && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-primary-light px-1.5 py-0.5 text-[11px] font-medium text-primary">
                              <cat.icon size={10} /> {cat.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

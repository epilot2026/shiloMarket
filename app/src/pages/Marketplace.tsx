import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Star, PenSquare } from 'lucide-react'
import { MARKETPLACE_FILTERS } from '../constants'
import { AnnonceGridCard } from '../components/marketplace/AnnonceGridCard'
import { GridCardSkeleton } from '../components/ui/Skeleton'
import { useData } from '../context/DataContext'
import type { Category } from '../types'

type FilterKey = (typeof MARKETPLACE_FILTERS)[number]['key']

export default function Marketplace() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { annonces, certified } = useData()
  const initialCat = (params.get('cat') as FilterKey) || 'all'
  const [filter, setFilter] = useState<FilterKey>(initialCat)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    return annonces.filter((a) => {
      const okCat = filter === 'all' || a.category === (filter as Category)
      const okQuery =
        !query ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.location.toLowerCase().includes(query.toLowerCase())
      return okCat && okQuery
    })
  }, [annonces, filter, query])

  return (
    <div className="px-0">
      <header className="sticky top-0 z-30 border-b border-line bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-primary">Marketplace</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/publier')}
              className="btn-primary h-10 px-4 text-sm"
            >
              <PenSquare size={16} /> Publier
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-soft" aria-label="Filtres">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>
        <div className="field mt-3 h-12">
          <Search size={20} className="text-muted" />
          <input
            placeholder="Rechercher une maison, un véhicule…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {MARKETPLACE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`chip ${filter === f.key ? 'chip-active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {/* Annonces certifiées */}
      <section className="px-4 pt-4">
        <h2 className="mb-2 flex items-center gap-1.5 text-lg font-bold">
          <Star size={18} className="text-primary" /> Annonces certifiées
        </h2>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {certified.map((a) => (
            <div key={a.id} className="w-52 flex-shrink-0">
              <AnnonceGridCard annonce={a} />
            </div>
          ))}
        </div>
      </section>

      {/* Toutes les annonces */}
      <section className="px-4 pt-5">
        <h2 className="mb-2 text-lg font-bold">Toutes les annonces</h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <GridCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-muted">
            Aucune annonce ne correspond. Modifiez vos filtres.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((a) => (
              <AnnonceGridCard key={a.id} annonce={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

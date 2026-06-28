import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Star, PenSquare, Check } from 'lucide-react'
import { MARKETPLACE_FILTERS } from '../constants'
import { AnnonceGridCard } from '../components/marketplace/AnnonceGridCard'
import { GridCardSkeleton } from '../components/ui/Skeleton'
import { FilterPanel, emptyFilters, type FilterState } from '../components/marketplace/FilterPanel'
import { SortMenu, type SortKey } from '../components/marketplace/SortMenu'
import { useData } from '../context/DataContext'
import type { Category } from '../types'

type FilterKey = (typeof MARKETPLACE_FILTERS)[number]['key']

export default function Marketplace() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { annonces, certified } = useData()

  const initialCat = (params.get('cat') as FilterKey) || 'all'
  const initialQuery = params.get('q') || ''

  const [chipFilter, setChipFilter] = useState<FilterKey>(initialCat)
  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const [sort, setSort] = useState<SortKey>('recent')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    let result = annonces.filter((a) => {
      const okCat = chipFilter === 'all' || a.category === (chipFilter as Category)
      const okQuery =
        !query ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.location.toLowerCase().includes(query.toLowerCase())

      const okAdvCat = filters.categories.size === 0 || filters.categories.has(a.category)
      const okTransaction = filters.transaction === 'all' || a.transaction === filters.transaction
      const okLocation = !filters.location || a.location.toLowerCase().includes(filters.location.toLowerCase())
      const min = filters.minPrice ? Number(filters.minPrice) : 0
      const max = filters.maxPrice ? Number(filters.maxPrice) : Infinity
      const okPrice = a.price >= min && a.price <= max
      const okCertified = !filters.certifiedOnly || a.certified
      const okAvailable = !filters.availableOnly || a.available

      return okCat && okQuery && okAdvCat && okTransaction && okLocation && okPrice && okCertified && okAvailable
    })

    const sorted = [...result]
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        sorted.sort((a, b) => b.reactions + b.comments - (a.reactions + a.comments))
        break
      case 'recent':
      default:
        break
    }
    return sorted
  }, [annonces, chipFilter, query, filters, sort])

  const filteredCertified = useMemo(() => {
    return certified.filter((a) => {
      const okCat = chipFilter === 'all' || a.category === (chipFilter as Category)
      const okQuery =
        !query ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.location.toLowerCase().includes(query.toLowerCase())
      const okAdvCat = filters.categories.size === 0 || filters.categories.has(a.category)
      const okTransaction = filters.transaction === 'all' || a.transaction === filters.transaction
      const okLocation = !filters.location || a.location.toLowerCase().includes(filters.location.toLowerCase())
      const min = filters.minPrice ? Number(filters.minPrice) : 0
      const max = filters.maxPrice ? Number(filters.maxPrice) : Infinity
      const okPrice = a.price >= min && a.price <= max
      const okAvailable = !filters.availableOnly || a.available
      return okCat && okQuery && okAdvCat && okTransaction && okLocation && okPrice && okAvailable
    })
  }, [certified, chipFilter, query, filters])

  const activeFilterCount =
    filters.categories.size +
    (filters.transaction !== 'all' ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.certifiedOnly ? 1 : 0) +
    (filters.availableOnly ? 1 : 0)

  return (
    <div className="flex h-full overflow-hidden">
      <div className="h-full flex-1 overflow-y-auto pb-20 xl:pb-4">
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
              <button
                onClick={() => setShowFilters(true)}
                className="relative grid h-10 w-10 place-items-center rounded-full bg-soft"
                aria-label="Filtres avancés"
              >
                <SlidersHorizontal size={20} />
                {activeFilterCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
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
                onClick={() => setChipFilter(f.key)}
                className={`chip ${chipFilter === f.key ? 'chip-active' : ''}`}
              >
                {chipFilter === f.key && <Check size={14} />}
                {f.label}
              </button>
            ))}
          </div>
        </header>

        <div className="flex items-center justify-between px-4 pt-4">
          <p className="text-sm text-muted">
            {loading ? 'Chargement…' : `${filtered.length} annonce${filtered.length > 1 ? 's' : ''} trouvée${filtered.length > 1 ? 's' : ''}`}
          </p>
          <SortMenu value={sort} onChange={setSort} />
        </div>

        {!loading && filteredCertified.length > 0 && (
          <section className="px-4 pt-3">
            <h2 className="mb-2 flex items-center gap-1.5 text-lg font-bold">
              <Star size={18} className="text-primary" /> Annonces certifiées
            </h2>
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {filteredCertified.map((a) => (
                <div key={a.id} className="w-52 flex-shrink-0">
                  <AnnonceGridCard annonce={a} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="px-4 pt-5">
          <h2 className="mb-2 text-lg font-bold">Toutes les annonces</h2>
          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <GridCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-soft">
                <Search size={36} className="text-muted" />
              </span>
              <p className="mt-4 font-semibold">Aucune annonce ne correspond</p>
              <p className="mt-1 text-sm text-muted">Modifiez vos filtres ou votre recherche.</p>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => setFilters({ ...emptyFilters, categories: new Set() })}
                  className="btn-outline mt-4"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((a) => (
                <AnnonceGridCard key={a.id} annonce={a} />
              ))}
            </div>
          )}
        </section>
      </div>

      <FilterPanel
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onChange={setFilters}
        resultCount={filtered.length}
      />
    </div>
  )
}

import { CATEGORIES } from '../../constants'
import type { Category, Transaction } from '../../types'
import { ArrowLeft, MapPin, Check, RotateCcw } from 'lucide-react'

export interface FilterState {
  categories: Set<Category>
  transaction: Transaction | 'all'
  location: string
  minPrice: string
  maxPrice: string
  certifiedOnly: boolean
  availableOnly: boolean
}

export const emptyFilters: FilterState = {
  categories: new Set(),
  transaction: 'all',
  location: '',
  minPrice: '',
  maxPrice: '',
  certifiedOnly: false,
  availableOnly: false,
}

interface Props {
  open: boolean
  onClose: () => void
  filters: FilterState
  onChange: (next: FilterState) => void
  resultCount: number
}

export function FilterPanel({ open, onClose, filters, onChange, resultCount }: Props) {
  function update(patch: Partial<FilterState>) {
    onChange({ ...filters, ...patch })
  }

  function toggleCategory(cat: Category) {
    const next = new Set(filters.categories)
    next.has(cat) ? next.delete(cat) : next.add(cat)
    update({ categories: next })
  }

  function reset() {
    onChange({ ...emptyFilters, categories: new Set() })
  }

  const activeCount =
    filters.categories.size +
    (filters.transaction !== 'all' ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.certifiedOnly ? 1 : 0) +
    (filters.availableOnly ? 1 : 0)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 xl:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 right-0 z-[60] flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 xl:static xl:z-auto xl:w-64 xl:translate-x-0 xl:shadow-none ${
          open ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-4 py-3 xl:hidden">
          <div className="flex items-center gap-2">
            <button onClick={onClose} aria-label="Fermer" className="btn-ghost -ml-2 text-ink">
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-lg font-bold">Filtres</h2>
          </div>
          {activeCount > 0 && (
            <button onClick={reset} className="flex items-center gap-1 text-sm font-semibold text-primary">
              <RotateCcw size={14} /> Réinit.
            </button>
          )}
        </header>

        <div className="hidden items-center justify-between px-4 pb-2 pt-4 xl:flex">
          <h2 className="text-base font-bold">Filtres</h2>
          {activeCount > 0 && (
            <button onClick={reset} className="flex items-center gap-1 text-xs font-semibold text-primary">
              <RotateCcw size={12} /> Réinitialiser
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <fieldset className="mb-5">
            <legend className="mb-2 text-sm font-bold">Catégorie</legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => toggleCategory(key)}
                  className={`chip ${filters.categories.has(key) ? 'chip-active' : ''}`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mb-5">
            <legend className="mb-2 text-sm font-bold">Transaction</legend>
            <div className="inline-flex flex-wrap rounded-xl bg-soft p-1">
              {(['all', 'louer', 'vendre', 'devis'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update({ transaction: t })}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${
                    filters.transaction === t ? 'bg-primary text-white' : 'text-ink'
                  }`}
                >
                  {t === 'all' ? 'Tout' : t === 'louer' ? 'À louer' : t === 'vendre' ? 'À vendre' : 'Sur devis'}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mb-5">
            <legend className="mb-2 text-sm font-bold">Localisation</legend>
            <div className="field h-12">
              <MapPin size={18} className="text-muted" />
              <input
                placeholder="Brazzaville, quartier…"
                value={filters.location}
                onChange={(e) => update({ location: e.target.value })}
              />
            </div>
          </fieldset>

          <fieldset className="mb-5">
            <legend className="mb-2 text-sm font-bold">Budget (FCFA)</legend>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => update({ minPrice: e.target.value })}
                className="w-full rounded-xl bg-soft px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <span className="text-muted">—</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => update({ maxPrice: e.target.value })}
                className="w-full rounded-xl bg-soft px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </fieldset>

          <fieldset className="mb-5 space-y-3">
            <legend className="mb-2 text-sm font-bold">Options</legend>
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={filters.certifiedOnly}
                onChange={(e) => update({ certifiedOnly: e.target.checked })}
                className="h-5 w-5 rounded accent-primary"
              />
              <span className="text-sm">Annonces certifiées uniquement</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={filters.availableOnly}
                onChange={(e) => update({ availableOnly: e.target.checked })}
                className="h-5 w-5 rounded accent-primary"
              />
              <span className="text-sm">Disponible immédiatement</span>
            </label>
          </fieldset>
        </div>

        <div className="border-t border-line p-4 xl:hidden">
          <button onClick={onClose} className="btn-primary w-full">
            <Check size={18} /> Afficher {resultCount} résultat{resultCount > 1 ? 's' : ''}
          </button>
        </div>
      </aside>
    </>
  )
}

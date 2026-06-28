import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ArrowDownWideNarrow, ArrowUpWideNarrow, Clock, Flame } from 'lucide-react'

export type SortKey = 'recent' | 'price-asc' | 'price-desc' | 'popular'

interface SortOption {
  key: SortKey
  label: string
  icon: typeof Clock
}

const OPTIONS: SortOption[] = [
  { key: 'recent', label: 'Plus récents', icon: Clock },
  { key: 'price-asc', label: 'Prix croissant', icon: ArrowUpWideNarrow },
  { key: 'price-desc', label: 'Prix décroissant', icon: ArrowDownWideNarrow },
  { key: 'popular', label: 'Plus populaires', icon: Flame },
]

export function SortMenu({ value, onChange }: { value: SortKey; onChange: (key: SortKey) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = OPTIONS.find((o) => o.key === value)!

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-xl bg-soft px-3 py-2 text-sm font-medium text-ink transition hover:bg-line/50"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <current.icon size={16} className="text-primary" />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-30 mt-1 w-52 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-card"
        >
          {OPTIONS.map((opt) => (
            <li key={opt.key}>
              <button
                onClick={() => { onChange(opt.key); setOpen(false) }}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition hover:bg-soft ${
                  value === opt.key ? 'font-bold text-primary' : 'text-ink'
                }`}
              >
                <opt.icon size={16} className={value === opt.key ? 'text-primary' : 'text-muted'} />
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

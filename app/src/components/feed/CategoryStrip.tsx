import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../../constants'

export function CategoryStrip() {
  const navigate = useNavigate()
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 py-3">
      {CATEGORIES.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => navigate(`/marketplace?cat=${key}`)}
          className="flex w-16 flex-shrink-0 flex-col items-center gap-1.5"
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-light text-primary">
            <Icon size={24} />
          </span>
          <span className="text-xs font-medium text-ink">{label}</span>
        </button>
      ))}
    </div>
  )
}

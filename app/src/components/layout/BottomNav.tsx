import { NavLink } from 'react-router-dom'
import { Home, Store, PlayCircle, MessageCircle, User } from 'lucide-react'

const items = [
  { to: '/', label: 'Accueil', icon: Home, end: true },
  { to: '/marketplace', label: 'Marketplace', icon: Store },
  { to: '/shorts', label: 'Shorts', icon: PlayCircle },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
  { to: '/profil', label: 'Profil', icon: User },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white safe-bottom lg:hidden">
      <ul className="mx-auto flex max-w-content items-center justify-around">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition ${
                  isActive ? 'text-primary' : 'text-muted'
                }`
              }
            >
              <Icon size={24} />
              <span className="truncate">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

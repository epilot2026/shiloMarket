import { NavLink } from 'react-router-dom'
import { Home, Store, PlayCircle, MessageCircle, User } from 'lucide-react'
import { LogoMark, LogoText } from '../ui/Logo'

const items = [
  { to: '/', label: 'Accueil', icon: Home, end: true },
  { to: '/marketplace', label: 'Marché', icon: Store },
  { to: '/shorts', label: 'Shorts', icon: PlayCircle },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
  { to: '/profil', label: 'Profil', icon: User },
]

export function Sidebar() {
  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col overflow-y-auto border-r border-line bg-white px-4 py-5 xl:flex">
      <div className="flex items-center gap-2 px-2">
        <LogoMark size={36} />
        <LogoText />
      </div>
      <nav className="mt-6 flex-1">
        <ul className="space-y-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition ${
                    isActive ? 'bg-primary-light text-primary' : 'text-ink hover:bg-soft'
                  }`
                }
              >
                <Icon size={22} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

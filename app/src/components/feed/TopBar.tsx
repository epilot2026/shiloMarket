import { Search, Bell, Menu } from 'lucide-react'
import { LogoText } from '../ui/Logo'

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <LogoText />
      <div className="flex items-center gap-2">
        <button className="grid h-10 w-10 place-items-center rounded-full bg-soft" aria-label="Rechercher">
          <Search size={20} />
        </button>
        <button className="relative grid h-10 w-10 place-items-center rounded-full bg-soft" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-live" />
        </button>
        <button className="grid h-10 w-10 place-items-center rounded-full bg-soft" aria-label="Menu">
          <Menu size={20} />
        </button>
      </div>
    </header>
  )
}

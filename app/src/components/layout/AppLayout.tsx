import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

// Coquille responsive : sidebar sur desktop (lg+), barre basse sur mobile/tablette.
export function AppLayout() {
  return (
    <div className="flex h-full bg-soft">
      <Sidebar />
      <div className="min-w-0 flex-1 overflow-y-auto pb-20 lg:pb-0">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}

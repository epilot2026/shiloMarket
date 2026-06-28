import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../components/feed/TopBar'
import { Composer } from '../components/feed/Composer'
import { CategoryStrip } from '../components/feed/CategoryStrip'
import { PageSuggestions } from '../components/feed/PageSuggestions'
import { RightRail } from '../components/feed/RightRail'
import { Search, Bell, Menu } from 'lucide-react'
import { AnnonceCard } from '../components/feed/AnnonceCard'
import { Fab } from '../components/ui/Fab'
import { FeedCardSkeleton } from '../components/ui/Skeleton'
import { useData } from '../context/DataContext'

const UNREAD_NOTIF_COUNT = 3

export default function Feed() {
  const navigate = useNavigate()
  const { annonces } = useData()
  const [loading, setLoading] = useState(true)

  // Simulation d'un chargement initial (démo) pour illustrer l'état de chargement.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const hasUnread = UNREAD_NOTIF_COUNT > 0

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Colonne centrale — feed */}
      <div className="flex h-full w-full flex-col overflow-y-auto">
        <TopBar />
        {/* En-tête desktop (la TopBar est réservée au mobile) */}
        <header className="sticky top-0 z-20 hidden items-center gap-3 border-b border-line bg-white/95 px-6 py-3 backdrop-blur xl:flex">
          <h1 className="shrink-0 text-xl font-extrabold text-primary">Accueil</h1>
          <div className="ml-auto flex w-full max-w-sm items-center gap-3 rounded-xl bg-soft px-4 py-2.5 text-muted">
            <Search size={18} className="shrink-0 text-muted" />
            <button onClick={() => navigate('/recherche')} className="text-left text-muted">
              Rechercher sur ShiloMarket
            </button>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="relative grid h-11 w-11 place-items-center rounded-full bg-soft"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {hasUnread && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-live" />}
          </button>
          <button
            onClick={() => navigate('/parametres')}
            className="grid h-11 w-11 place-items-center rounded-full bg-soft"
            aria-label="Paramètres"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Contenu du feed centré en 680px */}
        <main className="mx-auto w-full max-w-feed" aria-label="Fil d'annonces">
          <Composer />
          <CategoryStrip />
          {/* Pages suggérées en ligne sur mobile/tablette uniquement */}
          <div className="xl:hidden">
            <PageSuggestions />
          </div>
          <section className="pb-4">
            <h2 className="px-4 pt-4 text-lg font-bold">Annonces récentes</h2>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <FeedCardSkeleton key={i} />)
              : annonces.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
                    <span className="grid h-20 w-20 place-items-center rounded-full bg-soft">
                      <Search size={36} className="text-muted" />
                    </span>
                    <p className="mt-4 font-semibold">Aucune annonce pour le moment</p>
                    <p className="mt-1 text-sm text-muted">Soyez le premier à publier !</p>
                  </div>
                )
                : annonces.map((a) => <AnnonceCard key={a.id} annonce={a} />)}
          </section>
        </main>
      </div>

      {/* Panneau droit — desktop uniquement */}
      <RightRail />

      {/* FAB flottant — tous breakpoints */}
      <Fab onClick={() => navigate('/publier')} />
    </div>
  )
}

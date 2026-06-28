import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../components/feed/TopBar'
import { Composer } from '../components/feed/Composer'
import { CategoryStrip } from '../components/feed/CategoryStrip'
import { PageSuggestions } from '../components/feed/PageSuggestions'
import { Search, Bell } from 'lucide-react'
import { AnnonceCard } from '../components/feed/AnnonceCard'
import { Fab } from '../components/ui/Fab'
import { FeedCardSkeleton } from '../components/ui/Skeleton'
import { useData } from '../context/DataContext'

export default function Feed() {
  const navigate = useNavigate()
  const { annonces } = useData()
  const [loading, setLoading] = useState(true)

  // Simulation d'un chargement initial (démo) pour illustrer l'état de chargement.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="mx-auto w-full max-w-content">
      <TopBar />
      {/* En-tête desktop (la TopBar est réservée au mobile) */}
      <header className="sticky top-0 z-20 hidden items-center gap-3 border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:flex">
        <h1 className="text-xl font-extrabold text-primary">Accueil</h1>
        <div className="field ml-auto h-11 w-full max-w-sm">
          <Search size={18} className="text-muted" />
          <input placeholder="Rechercher sur ShiloMarket" />
        </div>
        <button className="relative grid h-11 w-11 place-items-center rounded-full bg-soft" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-live" />
        </button>
      </header>
      <Composer />
      <CategoryStrip />
      <PageSuggestions />
      <section className="pb-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <FeedCardSkeleton key={i} />)
          : annonces.map((a) => <AnnonceCard key={a.id} annonce={a} />)}
      </section>
      <Fab onClick={() => navigate('/publier')} />
    </div>
  )
}

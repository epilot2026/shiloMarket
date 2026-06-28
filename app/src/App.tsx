import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { SplashScreen } from './components/ui/SplashScreen'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Feed from './pages/Feed'
import Marketplace from './pages/Marketplace'
import AnnonceDetail from './pages/AnnonceDetail'
import Shorts from './pages/Shorts'
import Messages from './pages/Messages'
import Conversation from './pages/Conversation'
import Profile from './pages/Profile'
import Publish from './pages/Publish'
import Notifications from './pages/Notifications'
import SearchPage from './pages/SearchPage'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import DemoBanner from './components/ui/DemoBanner'
import { ErrorBoundary } from './components/ErrorBoundary'
import { InstallPrompt } from './components/ui/InstallPrompt'

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <ErrorBoundary>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      {/* Coquille à hauteur fixe : la fenêtre ne scrolle pas, seules les zones
          internes (contenu, messages) défilent. Évite tout chevauchement avec
          le bandeau démo et les barres collantes. */}
      <div className="flex h-[100dvh] flex-col bg-soft">
        <DemoBanner />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Feed />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/annonce/:id" element={<AnnonceDetail />} />
              <Route path="/publier" element={<Publish />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/recherche" element={<SearchPage />} />
              <Route path="/parametres" element={<Settings />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/messages/:id" element={<Conversation />} />
            <Route path="/shorts" element={<Shorts />} />
          </Routes>
        </div>
        <InstallPrompt />
      </div>
    </ErrorBoundary>
  )
}

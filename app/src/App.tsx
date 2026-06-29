import { useState, Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { SplashScreen } from './components/ui/SplashScreen'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Feed from './pages/Feed'
import DemoBanner from './components/ui/DemoBanner'
import { ErrorBoundary } from './components/ErrorBoundary'
import { InstallPrompt } from './components/ui/InstallPrompt'

const Marketplace = lazy(() => import('./pages/Marketplace'))
const AnnonceDetail = lazy(() => import('./pages/AnnonceDetail'))
const Shorts = lazy(() => import('./pages/Shorts'))
const Messages = lazy(() => import('./pages/Messages'))
const Conversation = lazy(() => import('./pages/Conversation'))
const Profile = lazy(() => import('./pages/Profile'))
const Publish = lazy(() => import('./pages/Publish'))
const Notifications = lazy(() => import('./pages/Notifications'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const Settings = lazy(() => import('./pages/Settings'))
const PageDetail = lazy(() => import('./pages/PageDetail'))
const EditProfile = lazy(() => import('./pages/EditProfile'))
const MyAnnonces = lazy(() => import('./pages/MyAnnonces'))
const SavedItems = lazy(() => import('./pages/SavedItems'))
const HelpPage = lazy(() => import('./pages/HelpPage'))
const PaymentsPage = lazy(() => import('./pages/PaymentsPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-primary" />
    </div>
  )
}

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
        <div className="min-h-0 flex-1 overflow-hidden">
          <Routes>
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Feed />} />
              <Route path="/marketplace" element={<Suspense fallback={<PageLoader />}><Marketplace /></Suspense>} />
              <Route path="/annonce/:id" element={<Suspense fallback={<PageLoader />}><AnnonceDetail /></Suspense>} />
              <Route path="/publier" element={<Suspense fallback={<PageLoader />}><Publish /></Suspense>} />
              <Route path="/notifications" element={<Suspense fallback={<PageLoader />}><Notifications /></Suspense>} />
              <Route path="/recherche" element={<Suspense fallback={<PageLoader />}><SearchPage /></Suspense>} />
              <Route path="/parametres" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
              <Route path="/messages" element={<Suspense fallback={<PageLoader />}><Messages /></Suspense>} />
              <Route path="/messages/:id" element={<Suspense fallback={<PageLoader />}><Conversation /></Suspense>} />
              <Route path="/profil" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
              <Route path="/profil/modifier" element={<Suspense fallback={<PageLoader />}><EditProfile /></Suspense>} />
              <Route path="/page/:id" element={<Suspense fallback={<PageLoader />}><PageDetail /></Suspense>} />
              <Route path="/mes-annonces" element={<Suspense fallback={<PageLoader />}><MyAnnonces /></Suspense>} />
              <Route path="/enregistres" element={<Suspense fallback={<PageLoader />}><SavedItems /></Suspense>} />
              <Route path="/aide" element={<Suspense fallback={<PageLoader />}><HelpPage /></Suspense>} />
              <Route path="/paiements" element={<Suspense fallback={<PageLoader />}><PaymentsPage /></Suspense>} />
              <Route path="/shorts" element={<Suspense fallback={<PageLoader />}><Shorts /></Suspense>} />
              <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
              <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
            </Route>
          </Routes>
        </div>
        <InstallPrompt />
      </div>
    </ErrorBoundary>
  )
}

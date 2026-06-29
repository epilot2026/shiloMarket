import { useNavigate } from 'react-router-dom'
import {
  User as UserIcon,
  Package,
  Building2,
  Bookmark,
  PlayCircle,
  Bell,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { ACCOUNT_TYPE_LABEL } from '../constants'
import { useToast } from '../context/ToastContext'

const MENU = [
  { icon: Package, label: 'Mes annonces', link: '/mes-annonces' },
  { icon: Bookmark, label: 'Enregistrés', link: '/enregistres' },
  { icon: PlayCircle, label: 'Mes Shorts', link: '/shorts' },
  { icon: Bell, label: 'Notifications', link: '/notifications' },
  { icon: CreditCard, label: 'Paiements & abonnements', link: '/paiements' },
  { icon: Settings, label: 'Paramètres', link: '/parametres' },
  { icon: HelpCircle, label: 'Aide & support', link: '/aide' },
]

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const { annonces, savedCount, followedCount } = useData()
  const { show } = useToast()

  if (!isAuthenticated || !user) {
    return (
      <div className="safe-top flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
        <span className="grid h-24 w-24 place-items-center rounded-full bg-primary-light text-primary">
          <UserIcon size={44} />
        </span>
        <h1 className="mt-4 text-xl font-bold">Bienvenue sur ShiloMarket</h1>
        <p className="mt-2 text-muted">
          Connectez-vous pour gérer votre profil, vos annonces et vos pages.
        </p>
        <button onClick={() => navigate('/connexion')} className="btn-primary mt-6 px-8">
          Se connecter
        </button>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto pb-16 xl:pb-4">
      <header className="safe-top border-b border-line bg-white px-4 py-3">
        <h1 className="text-2xl font-extrabold text-ink">Profil</h1>
      </header>

      <div className="flex flex-col items-center px-4 py-6 text-center">
        <img src={user.avatarUrl} alt={user.fullName} className="h-24 w-24 rounded-full object-cover" />
        <h2 className="mt-3 text-xl font-bold">{user.fullName}</h2>
        <p className="text-sm text-muted">
          {ACCOUNT_TYPE_LABEL[user.accountType]} · {user.phone}
        </p>
        <button onClick={() => navigate('/profil/modifier')} className="btn-outline mt-3 h-10">Modifier</button>
      </div>

      <div className="mx-4 grid grid-cols-3 divide-x divide-line rounded-2xl bg-white py-3 text-center shadow-card">
        <div><div className="text-lg font-bold">{annonces.length}</div><div className="text-xs text-muted">Annonces</div></div>
        <div><div className="text-lg font-bold">{followedCount}</div><div className="text-xs text-muted">Pages</div></div>
        <div><div className="text-lg font-bold">{savedCount}</div><div className="text-xs text-muted">Enregistrés</div></div>
      </div>

      <ul className="mt-4">
        {MENU.map(({ icon: Icon, label, link }) => (
          <li key={label}>
            <button
              onClick={() => link && navigate(link)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:scale-[0.98] hover:bg-soft"
            >
              <Icon size={20} className="text-ink" />
              <span className="flex-1 font-medium">{label}</span>
              <ChevronRight size={18} className="text-muted" />
            </button>
          </li>
        ))}
        <li className="border-t border-line">
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-live transition active:scale-[0.98] hover:bg-soft"
          >
            <LogOut size={20} />
            <span className="flex-1 font-medium">Déconnexion</span>
          </button>
        </li>
      </ul>
    </div>
  )
}

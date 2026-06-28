import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bell,
  Heart,
  MessageCircle,
  Bookmark,
  UserPlus,
  BadgeCheck,
  TrendingUp,
} from 'lucide-react'
import { VerifiedBadge } from '../components/ui/Badges'

type NotifType = 'like' | 'comment' | 'save' | 'follow' | 'certified' | 'trending'

interface Notif {
  id: string
  type: NotifType
  actor: { name: string; avatar: string; verified?: boolean }
  text: string
  time: string
  link: string
  read: boolean
  thumbnail?: string
}

const ICONS: Record<NotifType, { icon: typeof Heart; color: string }> = {
  like: { icon: Heart, color: 'text-live' },
  comment: { icon: MessageCircle, color: 'text-loc' },
  save: { icon: Bookmark, color: 'text-primary' },
  follow: { icon: UserPlus, color: 'text-certified' },
  certified: { icon: BadgeCheck, color: 'text-certified' },
  trending: { icon: TrendingUp, color: 'text-primary' },
}

const MOCK_NOTIFS: Notif[] = [
  {
    id: 'n1',
    type: 'like',
    actor: { name: 'Shilo Immobilier', avatar: 'https://i.pravatar.cc/150?img=47', verified: true },
    text: 'a aimé votre annonce « Maison meublée 4 pièces »',
    time: '5 min',
    link: '/annonce/a1',
    read: false,
    thumbnail: 'https://picsum.photos/seed/maison1a/120/120',
  },
  {
    id: 'n2',
    type: 'comment',
    actor: { name: 'Congo Auto Location', avatar: 'https://i.pravatar.cc/150?img=12', verified: true },
    text: 'a commenté : « Disponible ce weekend ? »',
    time: '20 min',
    link: '/annonce/a2',
    read: false,
    thumbnail: 'https://picsum.photos/seed/toyota1/120/120',
  },
  {
    id: 'n3',
    type: 'follow',
    actor: { name: 'Agence Plateau', avatar: 'https://i.pravatar.cc/150?img=32', verified: true },
    text: 'a commencé à suivre votre page',
    time: '1 h',
    link: '/profil',
    read: false,
  },
  {
    id: 'n4',
    type: 'certified',
    actor: { name: 'ShiloMarket', avatar: 'https://i.pravatar.cc/150?img=60' },
    text: 'Félicitations ! Votre annonce a été certifiée par notre équipe.',
    time: '3 h',
    link: '/annonce/a5',
    read: true,
    thumbnail: 'https://picsum.photos/seed/villa5a/120/120',
  },
  {
    id: 'n5',
    type: 'save',
    actor: { name: 'ShiloTech Solutions', avatar: 'https://i.pravatar.cc/150?img=60', verified: true },
    text: 'a enregistré votre annonce « Terrain 600 m² Bacongo »',
    time: '5 h',
    link: '/annonce/a4',
    read: true,
    thumbnail: 'https://picsum.photos/seed/terrain1/120/120',
  },
  {
    id: 'n6',
    type: 'trending',
    actor: { name: 'ShiloMarket', avatar: 'https://i.pravatar.cc/150?img=5' },
    text: 'Votre annonce « Villa moderne avec piscine » fait partie des plus populaires cette semaine !',
    time: '1 j',
    link: '/annonce/a5',
    read: true,
    thumbnail: 'https://picsum.photos/seed/villa5a/120/120',
  },
  {
    id: 'n7',
    type: 'like',
    actor: { name: 'Moungali Services', avatar: 'https://i.pravatar.cc/150?img=22' },
    text: 'et 12 autres personnes ont aimé votre annonce',
    time: '2 j',
    link: '/annonce/a3',
    read: true,
    thumbnail: 'https://picsum.photos/seed/clim1/120/120',
  },
]

const TABS = [
  { key: 'all', label: 'Toutes' },
  { key: 'unread', label: 'Non lues' },
  { key: 'mentions', label: 'Mentions' },
] as const

export default function Notifications() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('all')
  const [notifs, setNotifs] = useState(MOCK_NOTIFS)

  const filtered = notifs.filter((n) => {
    if (tab === 'unread') return !n.read
    if (tab === 'mentions') return n.type === 'comment'
    return true
  })

  const unreadCount = notifs.filter((n) => !n.read).length

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function handleClick(n: Notif) {
    setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
    navigate(n.link)
  }

  return (
    <div className="mx-auto h-full w-full max-w-content overflow-y-auto pb-20 xl:pb-4">
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="btn-ghost -ml-2 text-ink" aria-label="Retour">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-2xl font-extrabold text-primary">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-sm font-semibold text-primary">
              Tout marquer lu
            </button>
          )}
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`chip ${tab === t.key ? 'chip-active' : ''}`}
            >
              {t.label}
              {t.key === 'unread' && unreadCount > 0 && (
                <span className="ml-1.5 rounded-full bg-live px-1.5 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-soft">
            <Bell size={36} className="text-muted" />
          </span>
          <p className="mt-4 text-muted">Aucune notification pour le moment.</p>
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {filtered.map((n) => {
            const { icon: Icon, color } = ICONS[n.type]
            return (
              <li key={n.id}>
                <button
                  onClick={() => handleClick(n)}
                  className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:bg-soft ${
                    !n.read ? 'bg-primary-light/40' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={n.actor.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                    <span className={`absolute -bottom-0.5 -right-0.5 grid h-6 w-6 place-items-center rounded-full bg-white shadow-sm ${color}`}>
                      <Icon size={14} className={color} />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] leading-snug">
                      <span className="inline-flex items-center gap-1 font-semibold">
                        {n.actor.name}
                        {n.actor.verified && <VerifiedBadge size={14} />}
                      </span>{' '}
                      <span className="text-ink/80">{n.text}</span>
                    </p>
                    <span className="mt-0.5 block text-xs text-muted">{n.time}</span>
                  </div>
                  {n.thumbnail ? (
                    <img src={n.thumbnail} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                  ) : (
                    !n.read && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

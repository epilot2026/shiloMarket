import { useEffect, useState } from 'react'
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
import { notificationsService, type Notification as DbNotification } from '../services/notifications.service'

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

function mapType(type: DbNotification['type']): NotifType {
  switch (type) {
    case 'reaction':
      return 'like'
    case 'comment':
      return 'comment'
    case 'message':
      return 'comment'
    case 'follow':
      return 'follow'
    case 'certification':
      return 'certified'
    case 'new_annonce':
    case 'system':
    default:
      return 'trending'
  }
}

function mapNotification(n: DbNotification): Notif {
  const payload = n.payload || {}
  const actorName = (payload.actor_name as string) || 'ShiloMarket'
  const actorAvatar = (payload.actor_avatar as string) || 'https://i.pravatar.cc/150?img=1'
  const actorVerified = (payload.actor_verified as boolean) || false
  const targetId = (payload.target_id as string) || ''
  const targetTitle = (payload.target_title as string) || ''
  const type = mapType(n.type)

  let text = ''
  let link = '/'
  let thumbnail = payload.target_thumbnail as string | undefined

  switch (type) {
    case 'like':
      text = `a aimé votre annonce ${targetTitle ? `« ${targetTitle} »` : ''}`
      link = targetId ? `/annonce/${targetId}` : '/'
      break
    case 'comment':
      text = `a commenté : « ${payload.comment_text || targetTitle} »`
      link = targetId ? `/annonce/${targetId}` : '/'
      break
    case 'save':
      text = `a enregistré votre annonce ${targetTitle ? `« ${targetTitle} »` : ''}`
      link = targetId ? `/annonce/${targetId}` : '/'
      break
    case 'follow':
      text = 'a commencé à suivre votre page'
      link = '/profil'
      thumbnail = undefined
      break
    case 'certified':
      text = '🎉 Votre annonce a été certifiée !'
      link = targetId ? `/annonce/${targetId}` : '/'
      break
    case 'trending':
    default:
      text = '🔥 Nouvelle activité sur votre annonce'
      link = targetId ? `/annonce/${targetId}` : '/'
  }

  return {
    id: n.id,
    type,
    actor: { name: actorName, avatar: actorAvatar, verified: actorVerified },
    text,
    time: n.createdAt,
    link,
    read: n.read,
    thumbnail,
  }
}

const TABS = [
  { key: 'all', label: 'Toutes' },
  { key: 'unread', label: 'Non lues' },
  { key: 'mentions', label: 'Mentions' },
] as const

export default function Notifications() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('all')
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = async () => {
    try {
      const list = await notificationsService.list()
      setNotifs(list.map(mapNotification))
    } catch (err) {
      console.error('Erreur chargement notifications', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
    const sub = notificationsService.subscribe((n) => {
      setNotifs((prev) => [mapNotification(n), ...prev])
    })
    return () => {
      sub.unsubscribe()
    }
  }, [])

  const filtered = notifs.filter((n) => {
    if (tab === 'unread') return !n.read
    if (tab === 'mentions') return n.type === 'comment'
    return true
  })

  const unreadCount = notifs.filter((n) => !n.read).length

  async function markAllRead() {
    await notificationsService.markAllAsRead()
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  async function handleClick(n: Notif) {
    await notificationsService.markAsRead(n.id)
    setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
    navigate(n.link)
  }

  return (
    <div className="mx-auto h-full w-full max-w-content overflow-y-auto pb-16 xl:pb-4">
      <header className="safe-top sticky top-0 z-30 border-b border-line bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="btn-ghost -ml-2 text-ink" aria-label="Retour">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-xl font-extrabold text-ink">Notifications</h1>
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
                    <img src={n.actor.avatar} alt="" loading="lazy" className="h-12 w-12 rounded-full object-cover" />
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
                    <img src={n.thumbnail} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
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

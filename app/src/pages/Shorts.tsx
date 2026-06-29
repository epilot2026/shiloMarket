import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Share2, Plus, MessageSquare, MapPin, ChevronUp, ChevronDown } from 'lucide-react'
import { shorts } from '../data/shorts'
import { formatCount } from '../lib/format'
import { VerifiedBadge } from '../components/ui/Badges'
import { useData } from '../context/DataContext'
import { useMessages } from '../context/MessageContext'
import { useToast } from '../context/ToastContext'

function ShortItem({
  short,
  index,
  total,
  isActive,
  liked,
  isLiking,
  onLike,
  following,
  onFollow,
  onNavigate,
  onShow,
  onContact,
}: {
  short: (typeof shorts)[number]
  index: number
  total: number
  isActive: boolean
  liked: boolean
  isLiking: boolean
  onLike: () => void
  following: boolean
  onFollow: () => void
  onNavigate: (path: string) => void
  onShow: (msg: string) => void
  onContact: () => void
}) {
  const likeCount = short.likes + (liked ? 1 : 0)

  return (
    <section
      className="relative flex h-full w-full snap-start snap-always items-center justify-center bg-black"
      aria-roledescription="short"
      aria-label={`Short ${index + 1} sur ${total}`}
    >
      <img
        src={short.videoPoster}
        alt={short.caption}
        className="h-full w-full object-cover opacity-90"
        loading={index < 2 ? 'eager' : 'lazy'}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

      {isActive && (
        <span className="safe-top absolute top-4 left-1/2 -translate-x-1/2 text-sm font-bold text-white">Shorts</span>
      )}

      {isActive && (
        <span className="safe-top absolute top-4 left-4 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white">
          {index + 1} / {total}
        </span>
      )}

      <div className="absolute bottom-20 right-3 flex flex-col items-center gap-4 text-white safe-bottom">
        <button className="flex flex-col items-center" onClick={onLike} aria-label="J'aime" aria-pressed={liked}>
          <Heart
            size={30}
            className={`transition-transform duration-300 ${isLiking ? 'scale-125' : 'scale-100'} ${liked ? 'fill-live text-live' : 'text-white'}`}
          />
          <span className="text-xs">{formatCount(likeCount)}</span>
        </button>
        <button className="flex flex-col items-center" onClick={() => onShow('Commentaires bientôt disponibles')}>
          <MessageCircle size={30} />
          <span className="text-xs">{formatCount(short.comments)}</span>
        </button>
        <button
          className="flex flex-col items-center"
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href).catch(() => {})
            onShow('Lien copié')
          }}
        >
          <Share2 size={30} />
          <span className="text-xs">{formatCount(short.shares)}</span>
        </button>
        <button
          className="flex flex-col items-center"
          onClick={onFollow}
          aria-pressed={following}
        >
          <span className={`grid h-11 w-11 place-items-center rounded-full ${following ? 'bg-white/10' : 'bg-white/20'}`}>
            <Plus size={24} className={`transition-transform duration-300 ${following ? 'rotate-45' : ''}`} />
          </span>
          <span className="mt-1 text-xs">{following ? 'Suivi' : 'Suivre'}</span>
        </button>
        <button
          className="flex flex-col items-center"
          onClick={onContact}
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/20">
            <MessageSquare size={22} />
          </span>
          <span className="mt-1 text-xs">Contacter</span>
        </button>
      </div>

      <div className="absolute bottom-20 left-4 right-20 text-white safe-bottom">
        <button
          onClick={() => onNavigate('/profil')}
          className="flex items-center gap-2"
          aria-label={`Voir la page ${short.page.name}`}
        >
          <img src={short.page.avatarUrl} alt={short.page.name} className="h-9 w-9 rounded-full border border-white object-cover" />
          <span className="flex items-center gap-1 font-semibold">
            {short.page.name}
            {short.page.verified && <VerifiedBadge />}
          </span>
        </button>
        <p className="mt-2 text-sm leading-snug">{short.caption}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {short.tags.map((t, i) => (
            <button
              key={t}
              onClick={() => onNavigate(`/marketplace?q=${t}`)}
              className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs transition hover:bg-white/30"
            >
              {i === 1 ? <MapPin size={12} /> : null}
              {t}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Shorts() {
  const navigate = useNavigate()
  const { isFollowing, toggleFollow } = useData()
  const { createConversation } = useMessages()
  const { show } = useToast()
  const [active, setActive] = useState(0)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [isLiking, setIsLiking] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const short = shorts[active]

  const scrollToIndex = useCallback((i: number) => {
    const el = itemRefs.current[i]
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const next = useCallback(() => {
    const i = Math.min(active + 1, shorts.length - 1)
    scrollToIndex(i)
  }, [active, scrollToIndex])

  const prev = useCallback(() => {
    const i = Math.max(active - 1, 0)
    scrollToIndex(i)
  }, [active, scrollToIndex])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); next() }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); prev() }
  }

  function toggleLike() {
    setLiked((prev) => {
      const next = new Set(prev)
      next.has(short.id) ? next.delete(short.id) : next.add(short.id)
      return next
    })
    setIsLiking(true)
    setTimeout(() => setIsLiking(false), 400)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = Number((entry.target as HTMLElement).dataset.index)
            setActive(idx)
          }
        })
      },
      { root: container, threshold: [0.6] },
    )

    itemRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const isLiked = liked.has(short.id)
  const following = isFollowing(short.page.id)

  return (
    <div className="flex h-full bg-black">
      <div className="relative flex flex-1 justify-center overflow-hidden">
        <div
          ref={containerRef}
          className="h-full w-full max-w-[480px] snap-y snap-mandatory overflow-y-auto scroll-smooth bg-black focus:outline-none"
          role="region"
          aria-roledescription="carrousel de vidéos"
          aria-label="Shorts"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {shorts.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => { itemRefs.current[i] = el }}
              data-index={i}
              className="h-full w-full flex-shrink-0"
            >
              <ShortItem
                short={s}
                index={i}
                total={shorts.length}
                isActive={i === active}
                liked={liked.has(s.id)}
                isLiking={i === active && isLiking}
                onLike={i === active ? toggleLike : () => {}}
                following={isFollowing(s.page.id)}
                onFollow={i === active
                  ? () => {
                      toggleFollow(s.page.id)
                      show(isFollowing(s.page.id) ? `Vous ne suivez plus ${s.page.name}` : `Vous suivez ${s.page.name}`)
                    }
                  : () => {}}
                onNavigate={navigate}
                onShow={show}
                onContact={
                  i === active
                    ? () => {
                        const convoId = createConversation(s.page)
                        navigate(`/messages/${convoId}`)
                      }
                    : () => {}
                }
              />
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          aria-label="Short précédent"
          disabled={active === 0}
          className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25 disabled:opacity-30 xl:block"
        >
          <ChevronUp size={22} />
        </button>
        <button
          onClick={next}
          aria-label="Short suivant"
          disabled={active === shorts.length - 1}
          className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25 disabled:opacity-30 xl:block"
        >
          <ChevronDown size={22} />
        </button>
      </div>
    </div>
  )
}

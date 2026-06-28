import { useState } from 'react'
import { Heart, MessageCircle, Share2, Plus, MessageSquare, MapPin, ChevronUp, ChevronDown } from 'lucide-react'
import { shorts } from '../data/shorts'
import { formatCount } from '../lib/format'
import { VerifiedBadge } from '../components/ui/Badges'
import { BottomNav } from '../components/layout/BottomNav'
import { Sidebar } from '../components/layout/Sidebar'

export default function Shorts() {
  const [active, setActive] = useState(0)
  const short = shorts[active]

  function next() {
    setActive((i) => (i + 1) % shorts.length)
  }

  function prev() {
    setActive((i) => (i - 1 + shorts.length) % shorts.length)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next()
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') prev()
  }

  return (
    <div className="flex h-full bg-black">
      <Sidebar />
      <div className="flex flex-1 justify-center overflow-hidden">
      <div
        className="relative flex h-full w-full max-w-[480px] items-center justify-center bg-black focus:outline-none"
        role="region"
        aria-roledescription="carrousel de vidéos"
        aria-label={`Short ${active + 1} sur ${shorts.length}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* Média (poster) */}
        <img src={short.videoPoster} alt={short.caption} className="h-full w-full object-cover opacity-90" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        <span className="absolute top-4 left-1/2 -translate-x-1/2 font-bold text-white">Shorts</span>

        {/* Navigation accessible */}
        <button
          onClick={prev}
          aria-label="Short précédent"
          className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 text-white hover:bg-white/25 lg:block"
        >
          <ChevronUp size={22} />
        </button>
        <button
          onClick={next}
          aria-label="Short suivant"
          className="absolute right-1/2 top-1/2 hidden translate-x-[140px] -translate-y-1/2 rounded-full bg-white/15 p-2 text-white hover:bg-white/25 lg:block"
        >
          <ChevronDown size={22} />
        </button>

        {/* Rail d'actions */}
        <div className="absolute bottom-28 right-3 flex flex-col items-center gap-5 text-white">
          <button className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <Heart size={30} />
            <span className="text-xs">{formatCount(short.likes)}</span>
          </button>
          <button className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <MessageCircle size={30} />
            <span className="text-xs">{formatCount(short.comments)}</span>
          </button>
          <button className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <Share2 size={30} />
            <span className="text-xs">{formatCount(short.shares)}</span>
          </button>
          <button className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white/20"><Plus size={24} /></span>
            <span className="mt-1 text-xs">Suivre</span>
          </button>
          <button className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white/20"><MessageSquare size={22} /></span>
            <span className="mt-1 text-xs">Contacter</span>
          </button>
        </div>

        {/* Auteur + description */}
        <div className="absolute bottom-24 left-4 right-20 text-white">
          <div className="flex items-center gap-2">
            <img src={short.page.avatarUrl} alt="" className="h-9 w-9 rounded-full border border-white object-cover" />
            <span className="flex items-center gap-1 font-semibold">
              {short.page.name}
              {short.page.verified && <VerifiedBadge />}
            </span>
          </div>
          <p className="mt-2 text-sm">{short.caption}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {short.tags.map((t, i) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs">
                {i === 1 ? <MapPin size={12} /> : null}
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      </div>
      <BottomNav />
    </div>
  )
}

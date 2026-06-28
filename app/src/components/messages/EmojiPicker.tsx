import { useState, useRef, useEffect } from 'react'
import { Smile } from 'lucide-react'

const EMOJIS = [
  '😀', '😂', '😍', '🥰', '😎', '🤔', '😴', '😭',
  '😡', '👍', '👎', '👏', '🙌', '🙏', '💪', '🤝',
  '❤️', '🔥', '✨', '⭐', '🎉', '🎊', '💯', '✅',
  '🏠', '🚗', '🔑', '💰', '📐', '🌳', '📱', '💻',
  '📍', '📞', '🎬', '📸', '🎁', '🏆', '💼', '👋',
]

export function EmojiPicker({ onPick }: { onPick: (emoji: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid h-10 w-10 place-items-center rounded-full bg-soft transition hover:bg-line/50"
        aria-label="Emojis"
        aria-expanded={open}
      >
        <Smile size={20} />
      </button>
      {open && (
        <div className="absolute bottom-12 left-0 z-30 grid w-72 grid-cols-8 gap-1 rounded-2xl border border-line bg-white p-2 shadow-card">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => { onPick(e); setOpen(false) }}
              className="grid h-8 w-8 place-items-center rounded-lg text-lg transition hover:bg-soft"
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

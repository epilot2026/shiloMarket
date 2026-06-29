import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, X, Users } from 'lucide-react'
import { VerifiedBadge } from '../ui/Badges'
import { SuggestedPages } from './SuggestedPages'
import type { Conversation, Page } from '../../types'

interface Props {
  open: boolean
  onClose: () => void
  onCreate: (page: Page) => void
  pages: Page[]
  conversations: Conversation[]
}

export function NewMessageModal({ open, onClose, onCreate, pages, conversations }: Props) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const availablePages = useMemo(() => {
    const existingIds = new Set(conversations.map((c) => c.page.id))
    let list = pages.filter((p) => !existingIds.has(p.id))
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false),
      )
    }
    return list
  }, [query, pages, conversations])

  if (!open) return null

  async function handleSelect(page: Page) {
    const convoId = await onCreate(page)
    setQuery('')
    onClose()
    navigate(`/messages/${convoId}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white xl:items-center xl:justify-center xl:bg-black/40">
      {/* Header style WhatsApp */}
      <header className="safe-top bg-primary text-white xl:max-w-md xl:w-full xl:rounded-t-2xl">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => {
              setQuery('')
              onClose()
            }}
            className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/15"
            aria-label="Retour"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-bold leading-tight">Nouveau message</h2>
            <p className="text-xs text-white/70">{availablePages.length} contacts disponibles</p>
          </div>
        </div>

        {/* Barre de recherche intégrée au header */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
            <Search size={18} className="text-white/60" />
            <input
              placeholder="Rechercher un contact ou une page…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/50 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="grid h-5 w-5 place-items-center rounded-full text-white/60"
                aria-label="Effacer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Corps — liste des contacts */}
      <div className="no-scrollbar flex-1 overflow-y-auto bg-white xl:max-h-[60vh] xl:w-full xl:max-w-md xl:rounded-b-2xl">
        {/* Pages suggérées — cartes TikTok style */}
        {!query && availablePages.length > 0 && (
          <SuggestedPages pages={availablePages} onStartChat={handleSelect} />
        )}

        {/* Séparateur */}
        <div className="flex items-center gap-2 px-4 py-2">
          <Users size={14} className="text-muted" />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Contacts
          </span>
        </div>

        {/* Liste des contacts style WhatsApp */}
        {availablePages.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-8 py-12 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-soft">
              <Search size={28} className="text-muted" />
            </span>
            <p className="mt-3 text-sm text-muted">Aucun contact trouvé.</p>
          </div>
        ) : (
          <ul>
            {availablePages.map((page) => (
              <li key={page.id}>
                <button
                  onClick={() => handleSelect(page)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-soft active:bg-soft"
                >
                  <div className="relative">
                    <img
                      src={page.avatarUrl}
                      alt={page.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-success" />
                  </div>
                  <div className="min-w-0 flex-1 border-b border-line/50 pb-2.5">
                    <div className="flex items-center gap-1 font-semibold text-ink">
                      <span className="truncate">{page.name}</span>
                      {page.verified && <VerifiedBadge size={15} />}
                    </div>
                    <p className="truncate text-sm text-muted">{page.description}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

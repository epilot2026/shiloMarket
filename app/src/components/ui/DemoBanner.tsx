import { useState } from 'react'
import { Info, X } from 'lucide-react'
import { DEMO_MODE } from '../../lib/config'

// Bandeau informatif : rappelle que l'application tourne en mode démo (sans Supabase).
export default function DemoBanner() {
  const [open, setOpen] = useState(true)
  if (!DEMO_MODE || !open) return null
  return (
    <div className="relative z-50 flex items-center justify-center gap-2 bg-certified px-8 py-1.5 text-center text-xs font-medium text-white">
      <Info size={14} />
      <span>Mode démo — données fictives, Supabase non connecté.</span>
      <button
        onClick={() => setOpen(false)}
        className="absolute right-2 rounded p-0.5 hover:bg-white/20"
        aria-label="Fermer"
      >
        <X size={14} />
      </button>
    </div>
  )
}

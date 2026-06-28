import { BadgeCheck, ShieldCheck } from 'lucide-react'

export function VerifiedBadge({ size = 16 }: { size?: number }) {
  return <BadgeCheck size={size} className="text-certified" aria-label="Vérifié" />
}

export function CertifiedTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-certified/10 px-2 py-0.5 text-xs font-semibold text-certified">
      <BadgeCheck size={13} />
      Certifié
    </span>
  )
}

export function CertifiedAnnonceTag() {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
      <ShieldCheck size={16} />
      Annonce certifiée
    </span>
  )
}

export function AvailableTag() {
  return (
    <span className="inline-flex items-center rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
      Disponible immédiatement
    </span>
  )
}

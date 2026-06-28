import {
  Home,
  Car,
  Briefcase,
  Building2,
  Mountain,
  User as UserIcon,
  KeyRound,
  Wrench,
  Store,
  Monitor,
  type LucideIcon,
} from 'lucide-react'
import type { AccountType, Category } from './types'

export interface CategoryMeta {
  key: Category
  label: string
  icon: LucideIcon
  color: string
  bg: string
}

export const CATEGORIES: CategoryMeta[] = [
  { key: 'maisons', label: 'Maisons', icon: Home, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  { key: 'vehicules', label: 'Véhicules', icon: Car, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { key: 'services', label: 'Services', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { key: 'immobilier', label: 'Immobilier', icon: Building2, color: 'text-violet-600', bg: 'bg-violet-500/10' },
  { key: 'terrains', label: 'Terrains', icon: Mountain, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { key: 'solutions-it', label: 'Solutions IT', icon: Monitor, color: 'text-cyan-600', bg: 'bg-cyan-500/10' },
]

export interface AccountTypeMeta {
  key: AccountType
  label: string
  icon: LucideIcon
}

export const ACCOUNT_TYPES: AccountTypeMeta[] = [
  { key: 'client', label: 'Client', icon: UserIcon },
  { key: 'proprietaire', label: 'Propriétaire', icon: KeyRound },
  { key: 'prestataire', label: 'Prestataire', icon: Wrench },
  { key: 'agence', label: 'Agence', icon: Building2 },
  { key: 'entreprise', label: 'Entreprise', icon: Store },
]

export const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
  client: 'Client',
  proprietaire: 'Propriétaire',
  prestataire: 'Prestataire',
  agence: 'Agence',
  entreprise: 'Entreprise',
}

export const MARKETPLACE_FILTERS = [
  { key: 'all', label: 'Tout' },
  { key: 'maisons', label: 'Maisons' },
  { key: 'vehicules', label: 'Véhicules' },
  { key: 'services', label: 'Services' },
  { key: 'immobilier', label: 'Immobilier' },
  { key: 'terrains', label: 'Terrains' },
  { key: 'solutions-it', label: 'Solutions IT' },
] as const

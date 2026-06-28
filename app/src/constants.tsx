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
  type LucideIcon,
} from 'lucide-react'
import type { AccountType, Category } from './types'

export interface CategoryMeta {
  key: Category
  label: string
  icon: LucideIcon
}

export const CATEGORIES: CategoryMeta[] = [
  { key: 'maisons', label: 'Maisons', icon: Home },
  { key: 'vehicules', label: 'Véhicules', icon: Car },
  { key: 'services', label: 'Services', icon: Briefcase },
  { key: 'immobilier', label: 'Immobilier', icon: Building2 },
  { key: 'terrains', label: 'Terrains', icon: Mountain },
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
] as const

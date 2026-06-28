import type { Annonce, Category } from '../types'
import { annonces, certifiedAnnonces, getAnnonceById } from '../data/annonces'
import { DEMO_MODE } from '../lib/config'

export interface AnnonceFilters {
  category?: Category | 'all'
  query?: string
  transaction?: 'louer' | 'vendre'
}

// Contrat unique consommé par les écrans.
// En démo (DEMO_MODE), on lit les données mock. En P1, on branchera Supabase ici
// sans modifier les écrans.
export const annoncesService = {
  async list(filters: AnnonceFilters = {}): Promise<Annonce[]> {
    if (!DEMO_MODE) {
      // TODO P1: supabase.from('annonces').select(...)
    }
    let result = [...annonces]
    if (filters.category && filters.category !== 'all') {
      result = result.filter((a) => a.category === filters.category)
    }
    if (filters.transaction) {
      result = result.filter((a) => a.transaction === filters.transaction)
    }
    if (filters.query) {
      const q = filters.query.toLowerCase()
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q),
      )
    }
    return result
  },

  async certified(): Promise<Annonce[]> {
    return certifiedAnnonces
  },

  async getById(id: string): Promise<Annonce | null> {
    return getAnnonceById(id) ?? null
  },
}

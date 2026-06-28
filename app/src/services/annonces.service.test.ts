import { describe, it, expect } from 'vitest'
import { annoncesService } from './annonces.service'

describe('annoncesService.list', () => {
  it('retourne toutes les annonces sans filtre', async () => {
    const all = await annoncesService.list()
    expect(all.length).toBeGreaterThan(0)
  })

  it('filtre par catégorie', async () => {
    const maisons = await annoncesService.list({ category: 'maisons' })
    expect(maisons.every((a) => a.category === 'maisons')).toBe(true)
  })

  it('filtre par recherche texte (titre ou localisation)', async () => {
    const results = await annoncesService.list({ query: 'brazzaville' })
    expect(
      results.every((a) =>
        `${a.title} ${a.location}`.toLowerCase().includes('brazzaville'),
      ),
    ).toBe(true)
  })

  it('ne renvoie que des annonces certifiées via certified()', async () => {
    const certified = await annoncesService.certified()
    expect(certified.every((a) => a.certified)).toBe(true)
  })
})

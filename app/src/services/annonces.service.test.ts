import { describe, it, expect } from 'vitest'
import { annoncesService } from './annonces.service'

describe('annoncesService.list', () => {
  it('retourne un tableau (même vide sur une base fraîche)', async () => {
    const all = await annoncesService.list()
    expect(Array.isArray(all)).toBe(true)
  })

  it('filtre par catégorie quand des données existent', async () => {
    const maisons = await annoncesService.list({ category: 'maisons' })
    expect(maisons.every((a) => a.category === 'maisons')).toBe(true)
  })

  it('filtre par recherche texte (titre ou localisation)', async () => {
    const results = await annoncesService.list({ query: 'brazzaville' })
    expect(
      results.every((a) =>
        `${a.title} ${a.location} ${a.description}`.toLowerCase().includes('brazzaville'),
      ),
    ).toBe(true)
  })

  it('ne renvoie que des annonces certifiées via certified()', async () => {
    const certified = await annoncesService.certified()
    expect(certified.every((a) => a.certified)).toBe(true)
  })
})

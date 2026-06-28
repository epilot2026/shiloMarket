import { describe, it, expect } from 'vitest'
import { formatPrice, formatCount } from './format'

// Normalise les espaces insécables (Intl peut utiliser U+202F / U+00A0).
const norm = (s: string) => s.replace(/[\u202f\u00a0]/g, ' ')

describe('formatPrice', () => {
  it('formate un prix avec séparateur de milliers et devise', () => {
    expect(norm(formatPrice(350000))).toBe('350 000 FCFA')
  })

  it('ajoute un suffixe de périodicité', () => {
    expect(norm(formatPrice(75000, 'jour'))).toBe('75 000 FCFA / jour')
  })
})

describe('formatCount', () => {
  it('laisse les petits nombres inchangés', () => {
    expect(formatCount(86)).toBe('86')
  })

  it('abrège les milliers', () => {
    expect(formatCount(1240)).toBe('1.2k')
    expect(formatCount(3000)).toBe('3k')
  })
})

import { CURRENCY } from './config'

export function formatPrice(value: number, suffix?: string): string {
  if (value === 0 && suffix === 'devis') return 'Sur devis'
  const formatted = new Intl.NumberFormat('fr-FR').format(value)
  return `${formatted} ${CURRENCY}${suffix ? ` / ${suffix}` : ''}`
}

export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}k`
  return String(n)
}

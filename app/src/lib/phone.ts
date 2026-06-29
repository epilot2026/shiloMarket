import { COUNTRY_CODE } from './config'

const PHONE_DOMAIN = 'shilomarket.com'

/**
 * Normalise un numéro de téléphone congolais en format international.
 * Exemples : 069865360 -> +242 06 986 53 60
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')

  // Si le numéro commence déjà par l'indicatif pays complet (242...)
  if (digits.length >= 9 && digits.startsWith('242')) {
    const local = digits.slice(3)
    return formatLocal(local)
  }

  // Si le numéro commence par 06 et fait 9 chiffres (Congo)
  if (digits.length === 9 && digits.startsWith('0')) {
    return formatLocal(digits)
  }

  // Fallback : retourne le numéro brut mais nettoyé
  return raw.trim()
}

function formatLocal(local: string): string {
  if (local.length !== 9) {
    return `${COUNTRY_CODE} ${local}`
  }
  const parts = [local.slice(0, 2), local.slice(2, 5), local.slice(5, 7), local.slice(7, 9)]
  return `${COUNTRY_CODE} ${parts.join(' ')}`
}

/**
 * Convertit un numéro de téléphone en adresse email dérivée.
 * Exemple : +242 06 986 53 60 -> 069865360@shilomarket.com
 */
export function phoneToEmail(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '')
  const local = digits.startsWith('242') ? digits.slice(3) : digits
  return `${local}@${PHONE_DOMAIN}`
}

/**
 * Extrait le numéro local depuis une email dérivée.
 */
export function emailToPhone(email: string): string {
  const local = email.split('@')[0]
  return local ? normalizePhone(local) : ''
}

/**
 * Vérifie si un numéro est plausible (9 chiffres commençant par 06 en Congo).
 */
export function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '')
  return /^0?6\d{8}$/.test(digits) || /^2426\d{8}$/.test(digits)
}

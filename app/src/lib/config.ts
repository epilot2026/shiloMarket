// Drapeau global de la phase de démo.
// true  => les services renvoient les données mock (en mémoire).
// false => les services appellent Supabase (phase P1, non actif ici).
export const DEMO_MODE =
  (import.meta.env.VITE_DEMO_MODE ?? 'false').toLowerCase() === 'true'

export const APP_NAME = 'ShiloMarket'
export const CURRENCY = 'FCFA'
export const COUNTRY_CODE = '+242'

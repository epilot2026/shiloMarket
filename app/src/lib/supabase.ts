import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Client Supabase PLACEHOLDER.
// En mode démo, VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY sont vides :
// le client n'est pas instancié et `supabase` vaut null.
// Aucun appel réseau n'est effectué tant que la phase P1 n'est pas activée.
const url = import.meta.env.VITE_SUPABASE_URL ?? ''
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null

export const isSupabaseConfigured = Boolean(url && key)

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { WebSocketLikeConstructor } from '@supabase/realtime-js'
import type WebSocket from 'ws'

const url = import.meta.env.VITE_SUPABASE_URL ?? ''
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

if (!url || !key) {
  throw new Error(
    'VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requis. Vérifiez votre fichier .env.',
  )
}

const realtimeOptions: { params: { eventsPerSecond: number }; transport?: WebSocketLikeConstructor } = {
  params: {
    eventsPerSecond: 10,
  },
}

if (typeof window === 'undefined') {
  const { default: ws } = await import('ws')
  realtimeOptions.transport = ws as unknown as WebSocketLikeConstructor
}

export const supabase: SupabaseClient = createClient(url, key, {
  realtime: realtimeOptions,
})

export const isSupabaseConfigured = true

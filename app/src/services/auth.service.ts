import { supabase } from '../lib/supabase'
import { normalizePhone, phoneToEmail } from '../lib/phone'
import type { AccountType, User, UserRole } from '../types'

export interface RegisterInput {
  fullName: string
  phone: string
  password: string
  accountType: AccountType
}

export interface LoginInput {
  phone: string
  password: string
}

export interface AuthError {
  message: string
}

function mapProfileToUser(profile: Record<string, unknown>): User {
  return {
    id: profile.id as string,
    fullName: profile.full_name as string,
    phone: profile.phone as string,
    accountType: profile.account_type as AccountType,
    role: (profile.role as UserRole) || 'user',
    avatarUrl: (profile.avatar_url as string) || '',
    bio: (profile.bio as string) || undefined,
    location: (profile.location as string) || undefined,
    verified: (profile.verified as boolean) || false,
  }
}

export async function signUp(input: RegisterInput): Promise<{ user: User | null; error: AuthError | null }> {
  const phone = normalizePhone(input.phone)
  const email = phoneToEmail(phone)

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName.trim(),
        phone,
        account_type: input.accountType,
      },
    },
  })

  if (error) {
    return { user: null, error: { message: error.message } }
  }

  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return { user: profile ? mapProfileToUser(profile) : null, error: null }
  }

  return { user: null, error: null }
}

export async function signIn(input: LoginInput): Promise<{ user: User | null; error: AuthError | null }> {
  const phone = normalizePhone(input.phone)
  const email = phoneToEmail(phone)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  })

  if (error) {
    return { user: null, error: { message: error.message } }
  }

  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return { user: profile ? mapProfileToUser(profile) : null, error: null }
  }

  return { user: null, error: null }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut()
  return { error: error ? { message: error.message } : null }
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session?.user) return null

  const userId = sessionData.session.user.id
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return profile ? mapProfileToUser(profile) : null
}

export async function updateCurrentUser(patch: Partial<User>): Promise<{ user: User | null; error: AuthError | null }> {
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session?.user) {
    return { user: null, error: { message: 'Non authentifié' } }
  }

  const userId = sessionData.session.user.id
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: patch.fullName,
      bio: patch.bio,
      location: patch.location,
      avatar_url: patch.avatarUrl,
      account_type: patch.accountType,
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    return { user: null, error: { message: error.message } }
  }

  return { user: data ? mapProfileToUser(data) : null, error: null }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
      callback(null)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    callback(profile ? mapProfileToUser(profile) : null)
  })

  return data.subscription
}

export async function resetPassword(phone: string): Promise<{ error: AuthError | null }> {
  const email = phoneToEmail(normalizePhone(phone))
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  return { error: error ? { message: error.message } : null }
}

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AccountType, User } from '../types'
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  updateCurrentUser,
  onAuthStateChange,
  type RegisterInput as AuthRegisterInput,
} from '../services/auth.service'

export interface RegisterInput extends AuthRegisterInput {}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (phone: string, password: string) => Promise<{ error?: string }>
  register: (input: RegisterInput) => Promise<{ error?: string }>
  updateUser: (patch: Partial<User>) => Promise<{ error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    getCurrentUser().then((current) => {
      if (mounted) {
        setUser(current)
        setIsLoading(false)
      }
    })

    const subscription = onAuthStateChange((next) => {
      if (mounted) setUser(next)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function login(phone: string, password: string) {
    const { user: next, error } = await signIn({ phone, password })
    if (error) return { error: error.message }
    setUser(next)
    return {}
  }

  async function register(input: RegisterInput) {
    const { user: next, error } = await signUp(input)
    if (error) return { error: error.message }
    setUser(next)
    return {}
  }

  async function updateUser(patch: Partial<User>) {
    const { user: next, error } = await updateCurrentUser(patch)
    if (error) return { error: error.message }
    if (next) setUser(next)
    return {}
  }

  async function logout() {
    await signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'super_admin',
        isLoading,
        login,
        register,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}

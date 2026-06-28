import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AccountType, User } from '../types'
import { demoUser } from '../data/users'

interface RegisterInput {
  fullName: string
  phone: string
  accountType: AccountType
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  // Authentification SIMULÉE (démo). Aucune requête réseau.
  login: (phone: string, _password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'shilomarket_demo_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setUser(JSON.parse(raw))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  function persist(next: User | null) {
    setUser(next)
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
  }

  async function login(phone: string, _password: string) {
    // Démo : on connecte l'utilisateur fictif quelles que soient les valeurs valides.
    persist({ ...demoUser, phone: phone || demoUser.phone })
  }

  async function register(input: RegisterInput) {
    persist({
      ...demoUser,
      fullName: input.fullName || demoUser.fullName,
      phone: input.phone || demoUser.phone,
      accountType: input.accountType,
    })
  }

  function logout() {
    persist(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: Boolean(user), login, register, logout }}
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

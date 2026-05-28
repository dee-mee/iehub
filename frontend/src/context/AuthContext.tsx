import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { login as loginApi, me as meApi, register as registerApi, updateMe as updateMeApi } from '@/api/auth'
import type { AuthTokens, AuthUser } from '@/api/auth'

type RegisterPayload = {
  email: string
  username: string
  password: string
  firstName: string
  lastName: string
  organization: string
  organizationType: string
  professionalTitle: string
  bio: string
  howHeard: string
  country: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  updateProfile: (payload: Partial<AuthUser>) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const TOKEN_KEY = 'iehub_tokens'

function loadTokens(): AuthTokens | null {
  const raw = localStorage.getItem(TOKEN_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthTokens
  } catch {
    return null
  }
}

function saveTokens(tokens: AuthTokens | null) {
  if (!tokens) {
    localStorage.removeItem(TOKEN_KEY)
    return
  }
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<AuthTokens | null>(loadTokens())
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const bootstrap = async () => {
      if (!tokens?.access) {
        setLoading(false)
        return
      }
      try {
        const me = await meApi(tokens.access)
        if (mounted) setUser(me)
      } catch {
        if (mounted) {
          setUser(null)
          setTokens(null)
          saveTokens(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void bootstrap()
    return () => {
      mounted = false
    }
  }, [tokens])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login: async (email: string, password: string) => {
        const newTokens = await loginApi(email, password)
        setTokens(newTokens)
        saveTokens(newTokens)
        const me = await meApi(newTokens.access)
        setUser(me)
      },
      register: async (payload: RegisterPayload) => {
        await registerApi({
          email: payload.email,
          username: payload.username,
          password: payload.password,
          first_name: payload.firstName,
          last_name: payload.lastName,
          organization: payload.organization,
          organization_type: payload.organizationType,
          professional_title: payload.professionalTitle,
          bio: payload.bio,
          how_heard: payload.howHeard,
          country: payload.country,
        })
      },
      updateProfile: async (payload: Partial<AuthUser>) => {
        if (!tokens?.access) return
        const updatedUser = await updateMeApi(tokens.access, payload)
        setUser(updatedUser)
      },
      logout: () => {
        setUser(null)
        setTokens(null)
        saveTokens(null)
      },
    }),
    [loading, user, tokens],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

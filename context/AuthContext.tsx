'use client'

/**
 * ChadWallet — AuthContext
 *
 * Google/Apple login uses Privy's built-in modal with loginMethods filtered
 * to a single provider. This avoids the redirect_uri_mismatch error caused
 * by the headless initOAuth() approach which requires allowed_domains to be
 * configured in the Privy dashboard.
 *
 * The Privy modal handles the OAuth redirect internally and always works as
 * long as Google/Apple are enabled in the Privy dashboard → Login Methods.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { usePrivy, useLogout, useLogin } from '@privy-io/react-auth'
import {
  buildAuthUser,
  syncUserToSupabase,
  persistSession,
  restoreSession,
  clearSession,
} from '@/lib/auth'
import type { AuthContextValue, AuthUser } from '@/types/auth'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, user: privyUser } = usePrivy()

  const { login: openPrivyModal } = useLogin({
    onComplete: ({ user }) => {
      if (user) {
        const authUser = buildAuthUser(user as unknown as Record<string, unknown>)
        persistSession(authUser)
        setUser(authUser)
        syncUserToSupabase(authUser).catch(console.error)
      }
    },
    onError: (err) => console.error('[ChadWallet] Login error:', err),
  })

  const { logout: privyLogout } = useLogout({
    onSuccess: () => clearSession(),
  })

  const [user, setUser]       = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore cached session on mount so UI doesn't flash unauthenticated
  useEffect(() => {
    const cached = restoreSession()
    if (cached) setUser(cached)
  }, [])

  // Keep local state in sync with Privy
  useEffect(() => {
    if (!ready) return
    if (authenticated && privyUser) {
      const authUser = buildAuthUser(privyUser as unknown as Record<string, unknown>)
      setUser(authUser)
      persistSession(authUser)
      syncUserToSupabase(authUser).catch(console.error)
    } else if (!authenticated) {
      setUser(null)
      clearSession()
    }
    setLoading(false)
  }, [ready, authenticated, privyUser])

  /**
   * Opens Privy's modal pre-filtered to Google only.
   * Works without allowed_domains — Privy's modal handles the OAuth redirect.
   */
  const loginWithGoogle = useCallback(() => {
    openPrivyModal({ loginMethods: ['google'] })
  }, [openPrivyModal])

  /**
   * Opens Privy's modal pre-filtered to Apple only.
   */
  const loginWithApple = useCallback(() => {
    openPrivyModal({ loginMethods: ['apple'] })
  }, [openPrivyModal])

  /** Opens the full Privy modal (all methods). */
  const openLoginModal = useCallback(() => {
    openPrivyModal()
  }, [openPrivyModal])

  const logout = useCallback(async () => {
    setUser(null)
    clearSession()
    await privyLogout()
  }, [privyLogout])

  return (
    <AuthContext.Provider value={{
      user,
      loading: !ready || loading,
      ready,
      authenticated: !!user && authenticated,
      loginWithGoogle,
      loginWithApple,
      openLoginModal,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>')
  return ctx
}

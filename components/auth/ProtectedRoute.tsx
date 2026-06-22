'use client'

/**
 * ChadWallet — ProtectedRoute
 *
 * Wraps any page/component that requires authentication.
 * - While Privy is loading, shows a full-screen skeleton.
 * - If unauthenticated, shows the LoginModal and optionally redirects.
 * - If authenticated, renders children.
 *
 * Usage:
 *   <ProtectedRoute>
 *     <DashboardPage />
 *   </ProtectedRoute>
 */

import { useState, useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { LoginModal } from './LoginModal'

interface ProtectedRouteProps {
  children: ReactNode
  /**
   * If provided, unauthenticated users are sent here instead of
   * seeing the inline modal (e.g. '/login').
   * Leave undefined to show the modal overlay.
   */
  redirectTo?: string
  /** Custom loading UI */
  fallback?: ReactNode
}

export function ProtectedRoute({
  children,
  redirectTo,
  fallback,
}: ProtectedRouteProps) {
  const { ready, authenticated } = useAuthContext()
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!ready) return

    if (!authenticated) {
      if (redirectTo) {
        router.replace(redirectTo)
      } else {
        setModalOpen(true)
      }
    }
  }, [ready, authenticated, redirectTo, router])

  // Loading state
  if (!ready) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#9945FF] animate-spin" />
          <p className="text-sm text-white/40">Loading your wallet…</p>
        </div>
      </div>
    )
  }

  // Unauthenticated — show modal overlay (not redirect)
  if (!authenticated && !redirectTo) {
    return (
      <>
        <div className="min-h-screen bg-[#050510] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-[#9945FF] animate-spin" />
            <p className="text-sm text-white/40">Checking authentication…</p>
          </div>
        </div>
        <LoginModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </>
    )
  }

  // Authenticated
  return <>{children}</>
}

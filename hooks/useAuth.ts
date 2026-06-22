'use client'

/**
 * ChadWallet — useAuth hook
 *
 * Thin re-export of useAuthContext so existing callsites that do
 * `import { useAuth } from '@/hooks/useAuth'` continue to work unchanged.
 */

export { useAuthContext as useAuth } from '@/context/AuthContext'
export type { AuthContextValue as UseAuthReturn } from '@/types/auth'

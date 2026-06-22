/**
 * ChadWallet — Auth Utilities
 * Pure helpers used by the AuthContext provider.
 * No React hooks here — keeps this file importable on the server too.
 */

import { createClient } from '@supabase/supabase-js'
import type { AuthUser } from '@/types/auth'

// ─── Supabase client (public key only — safe for the browser) ─────────────────
const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''

export const authSupabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
  : null

// ─── Supabase sync ────────────────────────────────────────────────────────────

// Track whether we've already warned about missing tables so we don't spam
let _schemaWarned = false

/** Upserts the authenticated user into the `users` table (fire-and-forget). */
export async function syncUserToSupabase(user: AuthUser): Promise<void> {
  if (!authSupabase || !user.id) return

  try {
    const { error } = await authSupabase.from('users').upsert(
      {
        id: user.id,
        email: user.email ?? null,
        wallet_address: user.walletAddress ?? null,
        avatar_url: user.avatarUrl ?? null,
      },
      { onConflict: 'id' }
    )

    if (error) {
      // Schema cache error means the `users` table doesn't exist yet.
      // This is a one-time setup issue — silently skip after warning once.
      const isSchemaError =
        error.message.includes('schema cache') ||
        error.message.includes("Could not find the table") ||
        error.code === 'PGRST204'

      if (isSchemaError) {
        if (!_schemaWarned) {
          _schemaWarned = true
          console.warn(
            '[ChadWallet] Database tables are not set up yet.\n' +
            '  → Visit http://localhost:3000/api/setup to get the SQL to run.\n' +
            '  → Or run supabase/migrations/001_initial_schema.sql in your Supabase SQL Editor.\n' +
            '  → User sessions still work — this only affects Supabase persistence.'
          )
        }
        return
      }

      console.error('[ChadWallet] Supabase upsert error:', error.message)
    }
  } catch (err) {
    console.error('[ChadWallet] syncUserToSupabase failed:', err)
  }
}

// ─── Privy → AuthUser mapping ─────────────────────────────────────────────────

/** Builds a normalised AuthUser from the raw Privy user object. */
export function buildAuthUser(privyUser: Record<string, unknown>): AuthUser {
  const linkedAccounts =
    (privyUser.linkedAccounts as Array<Record<string, unknown>>) ?? []

  const google = linkedAccounts.find((a) => a.type === 'google_oauth') as
    | Record<string, string>
    | undefined
  const apple = linkedAccounts.find((a) => a.type === 'apple_oauth') as
    | Record<string, string>
    | undefined
  const emailAcc = linkedAccounts.find((a) => a.type === 'email') as
    | Record<string, string>
    | undefined
  const solanaWallet = linkedAccounts.find(
    (a) => a.type === 'wallet' && a.chainType === 'solana'
  ) as Record<string, string> | undefined

  return {
    id: privyUser.id as string,
    email:
      google?.email ??
      apple?.email ??
      emailAcc?.address ??
      null,
    name:
      google?.name ??
      apple?.name ??
      null,
    avatarUrl:
      google?.picture ??
      apple?.picture ??
      null,
    walletAddress:
      solanaWallet?.address ??
      (privyUser.wallet as Record<string, string> | undefined)?.address ??
      null,
  }
}

// ─── Session persistence (sessionStorage) ────────────────────────────────────

const SESSION_KEY = 'chadwallet_user'

export function persistSession(user: AuthUser): void {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(user)) } catch { /* SSR / private */ }
}

export function restoreSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function clearSession(): void {
  try { sessionStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
}

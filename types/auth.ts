// ─── Auth Types ──────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string | null
  name: string | null
  avatarUrl: string | null
  walletAddress: string | null
}

export interface AuthContextValue {
  /** Resolved AuthUser, or null if unauthenticated */
  user: AuthUser | null
  /** True while Privy SDK is initialising or an auth op is in-flight */
  loading: boolean
  /** True once Privy is ready (but user may not be logged in) */
  ready: boolean
  /** True when the user has an active session */
  authenticated: boolean
  /** Headless Google OAuth — opens Privy modal filtered to Google */
  loginWithGoogle: () => void
  /** Headless Apple OAuth — opens Privy modal filtered to Apple */
  loginWithApple: () => void
  /** Opens the Privy modal (fallback / email login) */
  openLoginModal: () => void
  /** Clear session and log out */
  logout: () => Promise<void>
}

'use client'

/**
 * ChadWallet — Root Providers
 *
 * Tree:  PrivyProvider → AuthProvider → ToastContainer → {children}
 *
 * PrivyProvider must be the outermost wrapper so all auth hooks have
 * access to the Privy context.  AuthProvider sits inside it and builds
 * the app-level AuthContext on top.
 */

import type { ReactNode } from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { AuthProvider } from '@/context/AuthContext'
import { ToastContainer } from '@/components/ui/toast'

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ''
const isPrivyConfigured =
  !!PRIVY_APP_ID && PRIVY_APP_ID !== 'placeholder-privy-id'

// ─── Fallback wrapper when Privy is not configured ────────────────────────────
function NoAuthProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}

// ─── Full provider tree with Privy ────────────────────────────────────────────
function PrivyProviders({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#9945FF',
          logo: 'https://ui-avatars.com/api/?name=CW&background=9945FF&color=fff&size=64',
          landingHeader: 'Sign in to ChadWallet',
          loginMessage: 'Sign in to access your wallet and trading dashboard.',
        },
        loginMethods: ['google', 'apple', 'email'],
        embeddedWallets: {
          solana: { createOnLogin: 'off' },
          ethereum: { createOnLogin: 'off' },
        },
      }}
    >
      <AuthProvider>
        {children}
        <ToastContainer />
      </AuthProvider>
    </PrivyProvider>
  )
}

// ─── Exported root wrapper ────────────────────────────────────────────────────
export function Providers({ children }: { children: ReactNode }) {
  if (!isPrivyConfigured) {
    return <NoAuthProviders>{children}</NoAuthProviders>
  }
  return <PrivyProviders>{children}</PrivyProviders>
}

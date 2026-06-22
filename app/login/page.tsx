'use client'

/**
 * ChadWallet — /login page
 *
 * Standalone login page.  Uses the same design as the modal but lives at
 * its own route so direct links and redirects work correctly.
 *
 * After successful auth the user is sent to the dashboard ('/').
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Wallet, Mail } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import { AppleLoginButton } from '@/components/auth/AppleLoginButton'
import { showToast } from '@/components/ui/toast'

export default function LoginPage() {
  const router = useRouter()
  const { authenticated, ready, openLoginModal } = useAuthContext()

  // Redirect authenticated users away from this page
  useEffect(() => {
    if (ready && authenticated) {
      showToast('You are already signed in.', 'success')
      router.replace('/')
    }
  }, [ready, authenticated, router])

  return (
    <main className="relative min-h-screen bg-[#050510] flex items-center justify-center px-4 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#9945FF]/10 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#14F195]/5  blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-sm"
      >
        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <div className="relative glass-strong rounded-2xl border border-white/10 shadow-2xl shadow-black/60 overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[#9945FF] to-transparent" />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center shadow-lg shadow-[#9945FF]/30">
                    <Wallet className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#9945FF] to-[#14F195] blur-xl opacity-40 pointer-events-none" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Welcome to{' '}
                <span className="text-gradient">ChadWallet</span>
              </h1>
              <p className="text-sm text-white/50 leading-relaxed">
                Sign in to access your wallet and trading dashboard.
              </p>
            </div>

            {/* OAuth buttons — wired to AuthContext */}
            <div className="space-y-3 mb-5">
              <GoogleLoginButton onSuccess={() => router.replace('/')} />
              <AppleLoginButton  onSuccess={() => router.replace('/')} />
            </div>

            {/* Email login via Privy modal */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-xs text-white/20">or</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <button
              onClick={openLoginModal}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
            >
              <Mail className="w-4 h-4" />
              Continue with Email
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-white/20 mt-6">
              By continuing you agree to our{' '}
              <a href="#" className="underline hover:text-white/40 transition-colors">Terms</a>
              {' '}&amp;{' '}
              <a href="#" className="underline hover:text-white/40 transition-colors">Privacy Policy</a>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  )
}

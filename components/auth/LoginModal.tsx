'use client'

/**
 * ChadWallet — LoginModal
 *
 * Full-screen modal that handles Google / Apple OAuth and email login.
 * Accepts `open` + `onClose` so the parent controls visibility.
 */

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wallet, Sparkles, Shield, Mail } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { showToast } from '@/components/ui/toast'
import { GoogleLoginButton } from './GoogleLoginButton'
import { AppleLoginButton } from './AppleLoginButton'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

const FEATURES = [
  { icon: Sparkles, label: 'AI-powered token insights' },
  { icon: Shield,   label: 'Non-custodial & secure' },
  { icon: Wallet,   label: 'Solana wallet integration' },
]

export function LoginModal({ open, onClose }: LoginModalProps) {
  const { authenticated, openLoginModal } = useAuthContext()

  // Auto-close if the user authenticates while the modal is open
  useEffect(() => {
    if (authenticated && open) {
      showToast('Signed in successfully! Welcome to ChadWallet.', 'success')
      onClose()
    }
  }, [authenticated, open, onClose])

  // Trap focus / prevent body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal panel */}
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Sign in to ChadWallet"
          >
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative glass-strong rounded-2xl border border-white/10 shadow-2xl shadow-black/60 overflow-hidden">
                {/* Top purple accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[#9945FF] to-transparent" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50"
                  aria-label="Close sign-in modal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="p-8">
                  {/* ── Header ── */}
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center shadow-lg shadow-[#9945FF]/30">
                          <Wallet className="w-7 h-7 text-white" />
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#9945FF] to-[#14F195] blur-xl opacity-40 pointer-events-none" />
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1">
                      Welcome to{' '}
                      <span className="text-gradient">ChadWallet</span>
                    </h2>
                    <p className="text-sm text-white/50 leading-relaxed px-2">
                      Sign in to access your wallet and trading dashboard.
                    </p>
                  </div>

                  {/* ── OAuth Buttons ── */}
                  <div className="space-y-3 mb-5">
                    <GoogleLoginButton />
                    <AppleLoginButton />
                  </div>

                  {/* ── Divider + Email fallback ── */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-xs text-white/20">or</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>

                  <button
                    onClick={() => { onClose(); openLoginModal() }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    Continue with Email
                  </button>

                  {/* ── Why ChadWallet ── */}
                  <div className="flex items-center gap-3 mt-6 mb-4">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-xs text-white/20">why ChadWallet</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>

                  <div className="space-y-2.5">
                    {FEATURES.map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#9945FF]/10 border border-[#9945FF]/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-[#9945FF]" />
                        </div>
                        <span className="text-xs text-white/40">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* ── Footer ── */}
                  <p className="text-center text-xs text-white/20 mt-6">
                    By continuing you agree to our{' '}
                    <a href="#" className="underline hover:text-white/40 transition-colors">Terms</a>
                    {' '}&amp;{' '}
                    <a href="#" className="underline hover:text-white/40 transition-colors">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

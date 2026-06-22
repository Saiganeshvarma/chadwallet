'use client'

import { motion } from 'framer-motion'
import { useAuthContext } from '@/context/AuthContext'
import { AppleIcon } from './OAuthIcons'

interface AppleLoginButtonProps {
  disabled?: boolean
  onSuccess?: () => void
}

export function AppleLoginButton({ disabled }: AppleLoginButtonProps) {
  const { loginWithApple } = useAuthContext()

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.015 }}
      whileTap={{ scale: disabled ? 1 : 0.985 }}
      onClick={loginWithApple}
      disabled={disabled}
      aria-label="Continue with Apple"
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white font-semibold text-sm hover:bg-[#222] hover:border-white/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-black/30"
    >
      <AppleIcon className="w-4 h-4 flex-shrink-0" />
      <span>Continue with Apple</span>
    </motion.button>
  )
}

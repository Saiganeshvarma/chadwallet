'use client'

import { motion } from 'framer-motion'
import { useAuthContext } from '@/context/AuthContext'
import { GoogleIcon } from './OAuthIcons'

interface GoogleLoginButtonProps {
  disabled?: boolean
  onSuccess?: () => void  // kept for API compat; modal handles redirect internally
}

export function GoogleLoginButton({ disabled }: GoogleLoginButtonProps) {
  const { loginWithGoogle } = useAuthContext()

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.015 }}
      whileTap={{ scale: disabled ? 1 : 0.985 }}
      onClick={loginWithGoogle}
      disabled={disabled}
      aria-label="Continue with Google"
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-black/20"
    >
      <GoogleIcon className="w-4 h-4 flex-shrink-0" />
      <span>Continue with Google</span>
    </motion.button>
  )
}

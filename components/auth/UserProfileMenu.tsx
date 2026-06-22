'use client'

/**
 * ChadWallet — UserProfileMenu
 *
 * Avatar dropdown shown in the Navbar when the user is authenticated.
 * Displays user info and provides access to logout.
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Copy, ExternalLink, Check, User } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { LogoutButton } from './LogoutButton'
import { formatAddress } from '@/lib/utils'
import type { AuthUser } from '@/types/auth'

function Avatar({ user, size = 8 }: { user: AuthUser; size?: number }) {
  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user.email?.[0] ?? 'C').toUpperCase()

  if (user.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt={user.name ?? 'User avatar'}
        className={`w-${size} h-${size} rounded-full object-cover ring-2 ring-[#9945FF]/40`}
      />
    )
  }

  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center text-xs font-bold text-white ring-2 ring-[#9945FF]/40`}
    >
      {initials}
    </div>
  )
}

export function UserProfileMenu() {
  const { user } = useAuthContext()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!user) return null

  const displayName = user.name ?? user.email ?? 'ChadWallet User'
  const shortEmail = user.email
    ? user.email.length > 22
      ? user.email.slice(0, 10) + '…' + user.email.slice(-8)
      : user.email
    : null

  const handleCopy = () => {
    if (!user.walletAddress) return
    navigator.clipboard.writeText(user.walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
        aria-label="Open profile menu"
        aria-expanded={open}
      >
        <Avatar user={user} size={7} />
        <span className="hidden sm:block text-sm text-white/70 max-w-[100px] truncate">
          {displayName.split(' ')[0]}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 glass-strong rounded-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            {/* User info header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Avatar user={user} size={10} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{displayName}</div>
                  {shortEmail && (
                    <div className="text-xs text-white/40 truncate">{shortEmail}</div>
                  )}
                </div>
              </div>

              {/* Wallet address */}
              {user.walletAddress && (
                <div className="mt-3 p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-white/30 mb-0.5">Wallet</div>
                    <div className="text-xs font-mono text-white/70">
                      {formatAddress(user.walletAddress, 5)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCopy}
                      className="p-1 rounded text-white/30 hover:text-white/70 transition-colors"
                      aria-label="Copy wallet address"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`https://solscan.io/account/${user.walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded text-white/30 hover:text-white/70 transition-colors"
                      aria-label="View on Solscan"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                <User className="w-4 h-4" />
                View Profile
              </button>
              <LogoutButton onLogout={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check } from 'lucide-react'
import { Button } from './ui/button'
import { formatAddress } from '@/lib/utils'
import { useAuthContext } from '@/context/AuthContext'

export function WalletButton() {
  const { user, authenticated, openLoginModal, logout } = useAuthContext()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [solBalance, setSolBalance] = useState<number | null>(null)
  const [solPrice, setSolPrice] = useState<number>(0)

  const address = user?.walletAddress ?? null

  // Fetch live SOL balance + price when wallet is available
  useEffect(() => {
    if (!address) {
      setSolBalance(null)
      return
    }

    const fetchWalletData = async () => {
      try {
        const res = await fetch(`/api/wallet?address=${address}`)
        if (!res.ok) return
        const data = await res.json()
        setSolBalance(data.solBalance ?? 0)
        setSolPrice(data.solPrice ?? 0)
      } catch {
        // Silently fail — balance stays null
      }
    }

    fetchWalletData()
    const interval = setInterval(fetchWalletData, 60_000)
    return () => clearInterval(interval)
  }, [address])

  const handleCopy = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDisconnect = async () => {
    setDropdownOpen(false)
    await logout()
  }

  // Not authenticated — show connect/login button
  if (!authenticated || !user) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={openLoginModal}
        className="flex items-center gap-2"
      >
        <Wallet className="w-3.5 h-3.5" />
        Connect Wallet
      </Button>
    )
  }

  const displayAddress = address ?? user.email ?? 'User'
  const shortDisplay = address
    ? formatAddress(address, 4)
    : (user.email?.split('@')[0]?.slice(0, 10) ?? 'User')

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg glass neon-border hover:border-[#9945FF]/50 transition-all duration-200 text-sm"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center text-xs font-bold text-white">
          {user.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? 'C'}
        </div>
        <div className="hidden sm:block">
          <div className="text-white text-xs font-medium">{shortDisplay}</div>
          <div className="text-white/40 text-xs">
            {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : 'Loading…'}
          </div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 glass-strong rounded-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center font-bold text-white">
                  {user.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? 'C'}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {address ? formatAddress(address, 6) : (user.name ?? user.email ?? 'User')}
                  </div>
                  <div className="text-xs text-white/40">Solana Mainnet</div>
                </div>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="text-xs text-white/40">SOL Balance</div>
                <div className="text-lg font-bold text-gradient">
                  {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : '—'}
                </div>
                {solBalance !== null && solPrice > 0 && (
                  <div className="text-xs text-white/30">
                    ${(solBalance * solPrice).toFixed(2)} USD
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              {address && (
                <>
                  <button
                    onClick={handleCopy}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Address'}
                  </button>
                  <a
                    href={`https://solscan.io/account/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Solscan
                  </a>
                </>
              )}
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

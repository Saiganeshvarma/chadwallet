'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, TrendingUp, BarChart3, Sparkles, Wallet } from 'lucide-react'
import { Button } from './ui/button'
import { WalletButton } from './WalletButton'
import { LoginModal, UserProfileMenu } from './auth'
import { useAuthContext } from '@/context/AuthContext'

const navLinks = [
  { href: '/#discover',  label: 'Discover',    icon: Zap },
  { href: '/#trending',  label: 'Trending',    icon: TrendingUp },
  { href: '/trade/So11111111111111111111111111111111111111112', label: 'Trade', icon: BarChart3 },
  { href: '/#ai-insights', label: 'AI Insights', icon: Sparkles },
]

export function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [loginOpen,   setLoginOpen]   = useState(false)

  const { authenticated, ready } = useAuthContext()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openLogin  = () => setLoginOpen(true)
  const closeLogin = () => setLoginOpen(false)

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#050510]/90 backdrop-blur-xl border-b border-white/5 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(153,69,255,0.5)] transition-all duration-300">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#9945FF] to-[#14F195] blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
              </div>
              <span className="text-xl font-bold text-gradient">ChadWallet</span>
            </Link>

            {/* Center nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                >
                  <Icon className="w-3.5 h-3.5 group-hover:text-[#9945FF] transition-colors" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Right — auth controls */}
            <div className="hidden md:flex items-center gap-3">
              {ready && authenticated ? (
                <UserProfileMenu />
              ) : (
                <Button variant="ghost" size="sm" onClick={openLogin}>
                  Login
                </Button>
              )}
              <WalletButton />
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#080818]/95 backdrop-blur-xl border-b border-white/5 md:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}

              <div className="pt-2 flex gap-3">
                {ready && authenticated ? (
                  <div className="flex-1">
                    <UserProfileMenu />
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => { openLogin(); setMobileOpen(false) }}
                  >
                    Login
                  </Button>
                )}
                <WalletButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login modal */}
      <LoginModal open={loginOpen} onClose={closeLogin} />
    </>
  )
}

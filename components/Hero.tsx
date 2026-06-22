'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight, Zap, Shield, Brain, TrendingUp, Users, Star, Download } from 'lucide-react'
import { Button } from './ui/button'

// Rotating FOMO headlines
const HEADLINES = [
  'While you slept, BONK did +47%',
  '3 whales just bought $2.4M of WIF',
  'SOL trending #1 on 4 exchanges right now',
  'New memecoin 10x in the last hour',
  'Smart money is accumulating JUP quietly',
]

const stats = [
  { label: 'Daily Volume', value: '$2.4B+', change: '+18%', icon: TrendingUp },
  { label: 'Active Traders', value: '84K+', change: '+32%', icon: Users },
  { label: 'Tokens Listed', value: '12,000+', change: '+5%', icon: Star },
  { label: 'AI Analyses', value: '500K+', change: '+127%', icon: Brain },
]

const features = [
  {
    icon: Zap,
    title: 'Instant Swaps',
    desc: 'Sub-second execution via Jupiter aggregator — best price, every time',
    color: 'text-[#9945FF]',
    bg: 'from-[#9945FF]/20 to-[#9945FF]/5',
    border: 'border-[#9945FF]/20',
  },
  {
    icon: Brain,
    title: 'AI Edge',
    desc: 'GPT-4 powered analysis catches whale moves before they go public',
    color: 'text-[#14F195]',
    bg: 'from-[#14F195]/20 to-[#14F195]/5',
    border: 'border-[#14F195]/20',
  },
  {
    icon: Shield,
    title: 'Non-Custodial',
    desc: 'Your keys, your coins — secured by Privy with Google & Apple login',
    color: 'text-[#00D1FF]',
    bg: 'from-[#00D1FF]/20 to-[#00D1FF]/5',
    border: 'border-[#00D1FF]/20',
  },
]

// App store badge SVGs inline
function AppStoreBadge({ store }: { store: 'apple' | 'google' }) {
  if (store === 'apple') {
    return (
      <a
        href="https://apps.apple.com/us/app/chadwallet/id6757367474"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all group min-w-[160px]"
      >
        <svg className="w-7 h-7 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.3-2.18 3.87.03 3.02 2.65 4.03 2.68 4.04l-.05.11zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
        <div>
          <div className="text-[10px] text-white/50 leading-none">Download on the</div>
          <div className="text-sm font-bold text-white leading-tight group-hover:text-[#14F195] transition-colors">App Store</div>
        </div>
      </a>
    )
  }
  return (
    <a
      href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all group min-w-[160px]"
    >
      <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M3.18 23.76a2.54 2.54 0 0 1-1.29-2.25V2.49A2.54 2.54 0 0 1 3.18.24L14.13 12 3.18 23.76z" fill="#EA4335"/>
        <path d="M17.84 15.69l-3.71-3.69 3.71-3.69 1.53.87A2.54 2.54 0 0 1 20.7 12a2.54 2.54 0 0 1-1.33 2.82l-1.53.87z" fill="#FBBC04"/>
        <path d="M14.13 12 3.18 23.76c.38.14.8.1 1.15-.12L17.84 15.7l-3.71-3.7z" fill="#34A853"/>
        <path d="M14.13 12l3.71-3.69L4.33.36A1.47 1.47 0 0 0 3.18.24L14.13 12z" fill="#4285F4"/>
      </svg>
      <div>
        <div className="text-[10px] text-white/50 leading-none">Get it on</div>
        <div className="text-sm font-bold text-white leading-tight group-hover:text-[#14F195] transition-colors">Google Play</div>
      </div>
    </a>
  )
}

export function Hero() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -60])
  const [headlineIdx, setHeadlineIdx] = useState(0)

  // Rotate FOMO headlines
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIdx((i) => (i + 1) % HEADLINES.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-mesh">
      {/* Background — subtle parallax */}
      <motion.div style={{ y }} className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full bg-[#9945FF]/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#14F195]/8 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/3 w-[350px] h-[350px] rounded-full bg-[#00D1FF]/6 blur-2xl"
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(153,69,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(153,69,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </motion.div>

      <div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16"
      >
        {/* FOMO Live Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass neon-border text-sm overflow-hidden max-w-sm sm:max-w-none">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14F195] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#14F195]" />
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={headlineIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-white/70 text-xs sm:text-sm"
              >
                {HEADLINES[headlineIdx]}
              </motion.span>
            </AnimatePresence>
            <span className="text-[#14F195] font-semibold text-xs whitespace-nowrap">Live</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-5"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.05] tracking-tight">
            Don't miss the
            <br />
            <span className="text-gradient">next 100x</span>
            <br />
            on Solana
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10"
        >
          Real-time data, AI-powered analysis, and instant Jupiter swaps — all in one terminal. The pros already use it.
        </motion.p>

        {/* Primary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <Button
            size="lg"
            onClick={() => router.push('/trade/So11111111111111111111111111111111111111112')}
            className="group h-14 px-8 text-base font-bold shadow-lg shadow-[#9945FF]/30 hover:shadow-[#9945FF]/50 transition-shadow"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Trading Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/#trending')}
            className="h-14 px-8 text-base font-semibold"
          >
            Explore Trending Tokens
          </Button>
        </motion.div>

        {/* Mobile App Download */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center gap-3 mb-14"
        >
          <p className="text-xs text-white/30 flex items-center gap-2">
            <Download className="w-3.5 h-3.5" />
            Also available on mobile — trade anywhere
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <AppStoreBadge store="apple" />
            <AppStoreBadge store="google" />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-14"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                className="glass neon-border rounded-2xl p-4 sm:p-5 text-center card-hover"
              >
                <div className="flex justify-center mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[#9945FF]/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#9945FF]" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gradient mb-0.5">{stat.value}</div>
                <div className="text-xs text-white/40 mb-1">{stat.label}</div>
                <div className="text-xs text-[#14F195] font-medium">{stat.change} this month</div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.1 }}
                className={`rounded-2xl p-6 border ${feature.border} bg-gradient-to-b ${feature.bg} card-hover cursor-default`}
              >
                <div className="w-11 h-11 rounded-xl bg-black/30 flex items-center justify-center mb-4">
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

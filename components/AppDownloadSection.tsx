'use client'

import { motion } from 'framer-motion'
import { Smartphone, Check } from 'lucide-react'

const PERKS = [
  'Real-time price alerts & notifications',
  'One-tap swaps on the go',
  'Full AI analysis in your pocket',
  'Biometric login — Face ID & fingerprint',
  'Track your portfolio anywhere, anytime',
]

function AppleBadge() {
  return (
    <a
      href="https://apps.apple.com/us/app/chadwallet/id6757367474"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#9945FF]/40 hover:bg-white/10 transition-all group"
    >
      <svg className="w-8 h-8 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.3-2.18 3.87.03 3.02 2.65 4.03 2.68 4.04l-.05.11zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <div>
        <div className="text-xs text-white/40 leading-none">Download on the</div>
        <div className="text-base font-bold text-white leading-snug group-hover:text-gradient">App Store</div>
        <div className="text-xs text-white/30 mt-0.5">iPhone & iPad</div>
      </div>
    </a>
  )
}

function GoogleBadge() {
  return (
    <a
      href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#14F195]/40 hover:bg-white/10 transition-all group"
    >
      <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M3.18 23.76a2.54 2.54 0 0 1-1.29-2.25V2.49A2.54 2.54 0 0 1 3.18.24L14.13 12 3.18 23.76z" fill="#EA4335"/>
        <path d="M17.84 15.69l-3.71-3.69 3.71-3.69 1.53.87A2.54 2.54 0 0 1 20.7 12a2.54 2.54 0 0 1-1.33 2.82l-1.53.87z" fill="#FBBC04"/>
        <path d="M14.13 12 3.18 23.76c.38.14.8.1 1.15-.12L17.84 15.7l-3.71-3.7z" fill="#34A853"/>
        <path d="M14.13 12l3.71-3.69L4.33.36A1.47 1.47 0 0 0 3.18.24L14.13 12z" fill="#4285F4"/>
      </svg>
      <div>
        <div className="text-xs text-white/40 leading-none">Get it on</div>
        <div className="text-base font-bold text-white leading-snug group-hover:text-gradient">Google Play</div>
        <div className="text-xs text-white/30 mt-0.5">Android</div>
      </div>
    </a>
  )
}

export function AppDownloadSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#9945FF]/8 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#14F195]/6 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-[#9945FF]" />
              <span className="text-xs font-semibold text-[#9945FF] uppercase tracking-widest">Mobile App</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
              Trade Solana
              <br />
              <span className="text-gradient">from anywhere</span>
            </h2>

            <p className="text-white/50 text-lg mb-8 leading-relaxed">
              The ChadWallet mobile app brings the full trading terminal to your phone. 
              Never miss a pump again.
            </p>

            <ul className="space-y-3 mb-10">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#14F195]/15 border border-[#14F195]/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#14F195]" />
                  </div>
                  <span className="text-sm text-white/60">{perk}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <AppleBadge />
              <GoogleBadge />
            </div>
          </motion.div>

          {/* Right — phone mockup (pure CSS/SVG, no image needed) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Glow rings */}
              <div className="absolute inset-[-40px] rounded-[60px] bg-gradient-to-b from-[#9945FF]/20 to-[#14F195]/10 blur-2xl" />

              {/* Phone frame */}
              <div className="relative w-[280px] bg-[#0d0d2b] rounded-[44px] border-[6px] border-white/10 shadow-2xl shadow-[#9945FF]/20 overflow-hidden">
                {/* Notch */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-24 h-6 bg-black rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#9945FF]/60" />
                  </div>
                </div>

                {/* App screen content */}
                <div className="px-4 pb-8 space-y-3">
                  {/* Status bar */}
                  <div className="flex justify-between text-[9px] text-white/30 mb-2">
                    <span>9:41</span>
                    <span>●●●</span>
                  </div>

                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gradient">ChadWallet</span>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195]" />
                  </div>

                  {/* Portfolio value */}
                  <div className="glass rounded-2xl p-4 text-center neon-border">
                    <div className="text-xs text-white/40 mb-1">Portfolio Value</div>
                    <div className="text-2xl font-black text-gradient">$3,428.50</div>
                    <div className="text-xs text-[#14F195] mt-1">+$284.20 (9.1%) today</div>
                  </div>

                  {/* Mini token list */}
                  <div className="space-y-2">
                    {[
                      { sym: 'SOL', chg: '+3.2%', pos: true },
                      { sym: 'BONK', chg: '+47.1%', pos: true },
                      { sym: 'WIF', chg: '-5.6%', pos: false },
                    ].map((t) => (
                      <div key={t.sym} className="flex items-center justify-between glass rounded-xl px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195]" />
                          <span className="text-xs font-bold text-white">{t.sym}</span>
                        </div>
                        <span className={`text-xs font-bold ${t.pos ? 'text-[#14F195]' : 'text-red-400'}`}>
                          {t.chg}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA button */}
                  <div className="mt-2 h-10 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center">
                    <span className="text-xs font-bold text-white">Start Trading</span>
                  </div>
                </div>

                {/* Home indicator */}
                <div className="flex justify-center pb-3">
                  <div className="w-20 h-1 rounded-full bg-white/20" />
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-4 top-24 glass neon-border rounded-2xl px-4 py-2.5 shadow-lg"
              >
                <div className="text-[10px] text-white/40">Live alert</div>
                <div className="text-xs font-bold text-[#14F195]">BONK +47% 🚀</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -left-6 bottom-32 glass neon-green-border rounded-2xl px-4 py-2.5 shadow-lg"
              >
                <div className="text-[10px] text-white/40">Whale alert</div>
                <div className="text-xs font-bold text-white">$2.4M WIF buy 🐳</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

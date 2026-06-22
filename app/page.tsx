import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { TokenTicker } from '@/components/TokenTicker'
import { AIChat } from '@/components/AIChat'
import { TrendingSection } from '@/components/TrendingSection'
import { AIInsightsSection } from '@/components/AIInsightsSection'
import { AppDownloadSection } from '@/components/AppDownloadSection'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050510]">
      <Navbar />

      {/* Top rotating ticker */}
      <div className="pt-16">
        <TokenTicker position="top" />
      </div>

      {/* Hero */}
      <Hero />

      {/* Trending tokens */}
      <TrendingSection />

      {/* Mobile app download CTA */}
      <AppDownloadSection />

      {/* AI Insights */}
      <AIInsightsSection />

      {/* Bottom ticker */}
      <TokenTicker position="bottom" />

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Brand + App badges row */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 mb-12">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gradient">ChadWallet</span>
              </div>
              <p className="text-sm text-white/30 leading-relaxed mb-5">
                The most advanced Solana trading terminal with AI-powered insights. Don&apos;t miss the next 100x.
              </p>
              {/* Footer app store badges */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://apps.apple.com/us/app/chadwallet/id6757367474"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <svg className="w-5 h-5 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.3-2.18 3.87.03 3.02 2.65 4.03 2.68 4.04l-.05.11zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div>
                    <div className="text-[9px] text-white/40 leading-none">Download on</div>
                    <div className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">App Store</div>
                  </div>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M3.18 23.76a2.54 2.54 0 0 1-1.29-2.25V2.49A2.54 2.54 0 0 1 3.18.24L14.13 12 3.18 23.76z" fill="#EA4335"/>
                    <path d="M17.84 15.69l-3.71-3.69 3.71-3.69 1.53.87A2.54 2.54 0 0 1 20.7 12a2.54 2.54 0 0 1-1.33 2.82l-1.53.87z" fill="#FBBC04"/>
                    <path d="M14.13 12 3.18 23.76c.38.14.8.1 1.15-.12L17.84 15.7l-3.71-3.7z" fill="#34A853"/>
                    <path d="M14.13 12l3.71-3.69L4.33.36A1.47 1.47 0 0 0 3.18.24L14.13 12z" fill="#4285F4"/>
                  </svg>
                  <div>
                    <div className="text-[9px] text-white/40 leading-none">Get it on</div>
                    <div className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Links grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-bold text-white mb-4">Product</h3>
                <ul className="space-y-2.5 text-sm text-white/30">
                  <li><a href="/#trending" className="hover:text-white transition-colors">Trending Tokens</a></li>
                  <li><a href="/trade/So11111111111111111111111111111111111111112" className="hover:text-white transition-colors">Trading Terminal</a></li>
                  <li><a href="/#ai-insights" className="hover:text-white transition-colors">AI Insights</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Portfolio</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-4">Resources</h3>
                <ul className="space-y-2.5 text-sm text-white/30">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-4">Community</h3>
                <ul className="space-y-2.5 text-sm text-white/30">
                  <li>
                    <a href="https://twitter.com/chadwallet" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter / X</a>
                  </li>
                  <li>
                    <a href="https://discord.gg/chadwallet" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a>
                  </li>
                  <li>
                    <a href="https://t.me/chadwallet" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/20">© 2024 ChadWallet. All rights reserved.</p>
            <p className="text-xs text-white/20">Not financial advice. Trade responsibly.</p>
          </div>
        </div>
      </footer>

      {/* Floating AI Chat */}
      <AIChat />
    </main>
  )
}

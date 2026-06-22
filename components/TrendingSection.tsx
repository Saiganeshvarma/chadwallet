'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { TokenCard } from './TokenCard'
import { Token } from '@/types/token'
import { KNOWN_TOKENS, TOP_TOKENS } from '@/lib/birdeye'

// Lightweight skeleton list shown while the real API call is in-flight
const SKELETON_TOKENS: Token[] = TOP_TOKENS.map((addr) => ({
  address: addr,
  symbol: KNOWN_TOKENS[addr]?.symbol ?? 'UNKNOWN',
  name: KNOWN_TOKENS[addr]?.name ?? 'Unknown',
  decimals: 9,
  logoURI: KNOWN_TOKENS[addr]?.logoURI ?? '',
  price: 0,
  priceChange24h: 0,
  volume24h: 0,
  liquidity: 0,
  marketCap: 0,
  holders: undefined,
  isTrending: false,
}))

export function TrendingSection() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true)
      try {
        // Try the trending endpoint first to get more real tokens
        const res = await fetch('/api/birdeye/trending?limit=12')
        if (res.ok) {
          const data = await res.json()
          if (data.tokens?.length) {
            const trending: Token[] = data.tokens.map(
              (t: {
                address: string
                symbol: string
                name: string
                logoURI?: string
                price: number
                priceChange24h: number
                volume24h?: number
                liquidity?: number
                marketCap?: number
                rank?: number
              }, i: number) => ({
                address: t.address,
                symbol: t.symbol,
                name: t.name,
                decimals: 9,
                logoURI: t.logoURI ?? '',
                price: t.price ?? 0,
                priceChange24h: t.priceChange24h ?? 0,
                volume24h: t.volume24h ?? 0,
                liquidity: t.liquidity ?? 0,
                marketCap: t.marketCap ?? 0,
                isTrending: (t.rank ?? i + 1) <= 3,
              })
            )
            setTokens(trending)
            return
          }
        }
        // Fallback: prices endpoint (no volume/liquidity/marketCap — show zeros)
        const fallback = await fetch('/api/prices')
        const data = await fallback.json()
        if (data.prices?.length) {
          setTokens(
            data.prices.map(
              (p: { address: string; symbol: string; name: string; logoURI?: string; price: number; priceChange24h: number }, i: number) => ({
                address: p.address,
                symbol: p.symbol,
                name: p.name,
                decimals: 9,
                logoURI: p.logoURI ?? '',
                price: p.price,
                priceChange24h: p.priceChange24h,
                volume24h: 0,
                liquidity: 0,
                marketCap: 0,
                isTrending: i < 3,
              })
            )
          )
        }
      } catch {
        // Keep empty — let the UI show the skeleton tokens
        setTokens(SKELETON_TOKENS)
      } finally {
        setLoading(false)
      }
    }
    fetchTokens()
  }, [])

  const toggleWatchlist = (address: string) => {
    setWatchlist((prev) =>
      prev.includes(address) ? prev.filter((a) => a !== address) : [...prev, address]
    )
  }

  return (
    <section id="trending" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-start justify-between mb-8 gap-4 flex-wrap"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-xs font-semibold text-orange-400 uppercase tracking-widest">Trending Now</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Top Solana Tokens</h2>
            <p className="text-white/40 mt-1 text-sm">Real-time market data powered by BirdEye</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-white/30">
              <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
              Live data
            </div>
            <button
              onClick={() => router.push('/trade/So11111111111111111111111111111111111111112')}
              className="flex items-center gap-1.5 text-sm text-[#9945FF] hover:text-[#14F195] transition-colors font-medium"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tokens.slice(0, 12).map((token, i) => (
            <TokenCard
              key={token.address}
              token={token}
              index={i}
              onWatchlist={toggleWatchlist}
              inWatchlist={watchlist.includes(token.address)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

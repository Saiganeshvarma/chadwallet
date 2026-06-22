'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatPrice, formatPercent, getChangeColor } from '@/lib/utils'
import { KNOWN_TOKENS, TOP_TOKENS } from '@/lib/birdeye'

interface TickerToken {
  address: string
  symbol: string
  price: number
  priceChange24h: number
  logoURI?: string
}

// Lightweight seed list — all prices are 0, real data loads immediately after mount
const SEED_TICKER_DATA: TickerToken[] = TOP_TOKENS.map((addr) => ({
  address: addr,
  symbol: KNOWN_TOKENS[addr]?.symbol ?? 'UNKNOWN',
  logoURI: KNOWN_TOKENS[addr]?.logoURI ?? '',
  price: 0,
  priceChange24h: 0,
}))

function TickerItem({ token, onClick }: { token: TickerToken; onClick: () => void }) {
  const isPositive = token.priceChange24h >= 0
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-1.5 mx-1.5 rounded-full glass border border-white/5 hover:border-[#9945FF]/30 hover:bg-white/5 transition-all duration-200 cursor-pointer group flex-shrink-0"
    >
      {token.logoURI && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={token.logoURI}
          alt={token.symbol}
          className="w-4 h-4 rounded-full"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      )}
      <span className="text-xs font-bold text-white group-hover:text-[#9945FF] transition-colors">
        {token.symbol}
      </span>
      <span className="text-xs text-white/60">{formatPrice(token.price)}</span>
      <span className={`text-xs flex items-center gap-0.5 ${getChangeColor(token.priceChange24h)}`}>
        {isPositive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        {formatPercent(token.priceChange24h)}
      </span>
    </button>
  )
}

interface TokenTickerProps {
  position?: 'top' | 'bottom'
}

export function TokenTicker({ position = 'top' }: TokenTickerProps) {
  const [tokens, setTokens] = useState<TickerToken[]>(SEED_TICKER_DATA)
  const router = useRouter()

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        // Use the trending endpoint to get more tokens (up to 20)
        const res = await fetch('/api/birdeye/trending?limit=20')
        if (!res.ok) throw new Error('trending fetch failed')
        const data = await res.json()
        const list: TickerToken[] = (data.tokens ?? [])
          .filter((t: { price: number }) => t.price > 0)
          .map((t: { address: string; symbol: string; price: number; priceChange24h: number; logoURI?: string }) => ({
            address: t.address,
            symbol: t.symbol,
            price: t.price,
            priceChange24h: t.priceChange24h ?? 0,
            logoURI: t.logoURI ?? '',
          }))
        if (list.length > 0) setTokens(list)
      } catch {
        // Fallback: try prices endpoint
        try {
          const res = await fetch('/api/prices')
          if (!res.ok) return
          const data = await res.json()
          if (data.prices?.length) {
            setTokens(
              data.prices.map((p: { address: string; symbol: string; price: number; priceChange24h: number; logoURI?: string }) => ({
                address: p.address,
                symbol: p.symbol,
                price: p.price,
                priceChange24h: p.priceChange24h,
                logoURI: p.logoURI,
              }))
            )
          }
        } catch {
          // Keep seed data
        }
      }
    }

    fetchTokens()
    const interval = setInterval(fetchTokens, 30_000)
    return () => clearInterval(interval)
  }, [])

  const handleTokenClick = (address: string) => {
    router.push(`/trade/${address}`)
  }

  // Duplicate enough for a seamless loop
  const tickerItems = [...tokens, ...tokens, ...tokens, ...tokens]

  return (
    <div
      className={`w-full border-white/5 bg-[#080818]/80 backdrop-blur-sm py-2 overflow-hidden ${
        position === 'top' ? 'border-b' : 'border-t'
      }`}
    >
      <div
        className={`flex ${position === 'top' ? 'animate-ticker' : 'animate-ticker-reverse'}`}
        style={{ width: 'max-content' }}
      >
        {tickerItems.map((token, i) => (
          <TickerItem
            key={`${token.address}-${i}`}
            token={token}
            onClick={() => handleTokenClick(token.address)}
          />
        ))}
      </div>
    </div>
  )
}

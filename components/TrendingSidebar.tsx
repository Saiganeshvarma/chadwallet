'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { TrendingUp, Flame, Star, Search } from 'lucide-react'
import { formatPrice, formatPercent, getChangeColor } from '@/lib/utils'
import { TrendingToken } from '@/types/token'
import { KNOWN_TOKENS, TOP_TOKENS } from '@/lib/birdeye'
import { Skeleton } from './ui/skeleton'

export function TrendingSidebar() {
  const [tokens, setTokens] = useState<TrendingToken[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [tab, setTab] = useState<'trending' | 'favorites'>('trending')
  const router = useRouter()

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true)
      try {
        // Use the trending endpoint for richer data (price, volume, marketCap)
        const res = await fetch('/api/birdeye/trending?limit=20')
        if (!res.ok) throw new Error('trending fetch failed')
        const data = await res.json()
        if (data.tokens?.length) {
          setTokens(
            data.tokens.map((t: { address: string; symbol: string; name: string; logoURI?: string; price: number; priceChange24h: number; volume24h?: number; rank?: number }, i: number) => ({
              address: t.address,
              symbol: t.symbol,
              name: t.name,
              logoURI: t.logoURI ?? '',
              price: t.price ?? 0,
              priceChange24h: t.priceChange24h ?? 0,
              volume24h: t.volume24h ?? 0,
              rank: t.rank ?? i + 1,
            }))
          )
        }
      } catch {
        // Fallback to prices endpoint
        try {
          const res = await fetch('/api/prices')
          const data = await res.json()
          if (data.prices) {
            setTokens(
              data.prices.map((p: { address: string; symbol: string; name: string; logoURI?: string; price: number; priceChange24h: number }, i: number) => ({
                address: p.address,
                symbol: p.symbol,
                name: p.name,
                logoURI: p.logoURI ?? '',
                price: p.price,
                priceChange24h: p.priceChange24h,
                volume24h: 0,
                rank: i + 1,
              }))
            )
          }
        } catch {
          setTokens(
            TOP_TOKENS.map((addr, i) => ({
              address: addr,
              symbol: KNOWN_TOKENS[addr]?.symbol ?? 'UNKNOWN',
              name: KNOWN_TOKENS[addr]?.name ?? 'Unknown',
              logoURI: KNOWN_TOKENS[addr]?.logoURI ?? '',
              price: 0,
              priceChange24h: 0,
              volume24h: 0,
              rank: i + 1,
            }))
          )
        }
      } finally {
        setLoading(false)
      }
    }
    fetchTrending()
  }, [])

  const toggleFavorite = (address: string) => {
    setFavorites((prev) =>
      prev.includes(address) ? prev.filter((a) => a !== address) : [...prev, address]
    )
  }

  const displayTokens =
    tab === 'favorites'
      ? tokens.filter((t) => favorites.includes(t.address))
      : tokens.filter(
          (t) =>
            search === '' ||
            t.symbol.toLowerCase().includes(search.toLowerCase()) ||
            t.name.toLowerCase().includes(search.toLowerCase())
        )

  return (
    <div className="flex flex-col h-full glass rounded-xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-semibold text-white">Markets</span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tokens..."
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-white/20 outline-none focus:border-[#9945FF]/40 transition-colors"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          <button
            onClick={() => setTab('trending')}
            className={`flex-1 py-1.5 text-xs rounded-lg transition-all ${
              tab === 'trending'
                ? 'bg-[#9945FF]/20 text-[#9945FF]'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Trending
            </div>
          </button>
          <button
            onClick={() => setTab('favorites')}
            className={`flex-1 py-1.5 text-xs rounded-lg transition-all ${
              tab === 'favorites'
                ? 'bg-amber-400/20 text-amber-400'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <Star className="w-3 h-3" />
              Watchlist
            </div>
          </button>
        </div>
      </div>

      {/* Token list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-0.5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))
            : displayTokens.length === 0
            ? (
              <div className="text-center py-8 text-white/30 text-sm">
                {tab === 'favorites' ? 'No favorites yet' : 'No tokens found'}
              </div>
            )
            : displayTokens.map((token, i) => (
              <motion.div
                key={token.address}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => router.push(`/trade/${token.address}`)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all group"
              >
                {token.logoURI ? (
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${token.symbol}&background=9945FF&color=fff&size=32`
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {token.symbol.slice(0, 2)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{token.symbol}</div>
                  <div className="text-xs text-white/30 truncate">{token.name}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-medium text-white">{formatPrice(token.price)}</div>
                  <div className={`text-xs ${getChangeColor(token.priceChange24h)}`}>
                    {formatPercent(token.priceChange24h)}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(token.address) }}
                  className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                    favorites.includes(token.address) ? 'opacity-100 text-amber-400' : 'text-white/30'
                  }`}
                  aria-label="Toggle favorite"
                >
                  <Star className="w-3 h-3" fill={favorites.includes(token.address) ? 'currentColor' : 'none'} />
                </button>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}

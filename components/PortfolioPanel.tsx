'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { formatPrice, formatVolume, formatPercent, getChangeColor } from '@/lib/utils'
import { useAuthContext } from '@/context/AuthContext'
import { Skeleton } from './ui/skeleton'

interface PortfolioItem {
  mint: string
  symbol: string
  name: string
  logoURI: string
  amount: number
  usdValue: number
  priceChange24h: number
  percentage: number
}

const COLORS = ['bg-[#9945FF]', 'bg-[#14F195]', 'bg-[#00D1FF]', 'bg-[#FF6B9D]', 'bg-[#FFB347]', 'bg-[#7FDBFF]']

export function PortfolioPanel() {
  const { user, authenticated } = useAuthContext()
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [totalUsdValue, setTotalUsdValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const walletAddress = user?.walletAddress

  const fetchPortfolio = async () => {
    if (!walletAddress) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/wallet?address=${walletAddress}`)
      if (!res.ok) throw new Error('Failed to fetch wallet data')
      const data = await res.json()
      setPortfolio(data.portfolio ?? [])
      setTotalUsdValue(data.totalUsdValue ?? 0)
    } catch {
      setError('Could not load portfolio')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authenticated && walletAddress) {
      fetchPortfolio()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, walletAddress])

  const totalChange = portfolio.reduce(
    (sum, item) => sum + (item.usdValue * item.priceChange24h) / 100,
    0
  )
  const totalChangePct = totalUsdValue > 0 ? (totalChange / totalUsdValue) * 100 : 0

  // Not connected — show prompt
  if (!authenticated || !walletAddress) {
    return (
      <div className="glass rounded-xl border border-white/5 p-4 text-center">
        <Wallet className="w-8 h-8 text-white/20 mx-auto mb-2" />
        <div className="text-xs text-white/30 mb-1">No wallet connected</div>
        <div className="text-xs text-white/20">Sign in to view your portfolio</div>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#9945FF]" />
            <span className="text-sm font-semibold text-white">Portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchPortfolio}
              disabled={loading}
              className="p-1 rounded text-white/30 hover:text-white/60 transition-colors"
              aria-label="Refresh portfolio"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>

        {loading && portfolio.length === 0 ? (
          <div className="space-y-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        ) : error ? (
          <div className="text-xs text-red-400/70">{error}</div>
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gradient">{formatVolume(totalUsdValue)}</div>
            <div className={`text-sm flex items-center gap-1 ${getChangeColor(totalChangePct)}`}>
              {totalChangePct >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {formatPercent(totalChangePct)} (${Math.abs(totalChange).toFixed(2)}) today
            </div>
          </div>
        )}
      </div>

      {/* Allocation bar */}
      {portfolio.length > 0 && (
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-1 h-2 rounded-full overflow-hidden">
            {portfolio.map((item, i) => (
              <div
                key={item.mint}
                style={{ width: `${item.percentage}%` }}
                className={`h-full ${COLORS[i % COLORS.length]}`}
              />
            ))}
          </div>
          <div className="flex gap-3 mt-2 flex-wrap">
            {portfolio.slice(0, 4).map((item, i) => (
              <div key={item.mint} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${COLORS[i % COLORS.length]}`} />
                <span className="text-xs text-white/30">{item.symbol}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Token list */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-96' : 'max-h-48'
        } overflow-y-auto`}
      >
        <div className="p-2 space-y-1">
          {loading && portfolio.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <div className="space-y-1 text-right">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
              ))
            : portfolio.map((item, i) => (
                <motion.div
                  key={item.mint}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {item.logoURI ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.logoURI}
                      alt={item.symbol}
                      className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.symbol}&background=9945FF&color=fff&size=32`
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {item.symbol.slice(0, 2)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white">{item.symbol}</div>
                    <div className="text-xs text-white/30">
                      {item.amount > 1e6
                        ? `${(item.amount / 1e6).toFixed(2)}M`
                        : item.amount >= 100
                        ? item.amount.toFixed(0)
                        : item.amount.toFixed(4)}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-medium text-white">
                      {item.usdValue >= 0.01 ? `$${item.usdValue.toFixed(2)}` : formatPrice(item.usdValue)}
                    </div>
                    <div className={`text-xs ${getChangeColor(item.priceChange24h)}`}>
                      {formatPercent(item.priceChange24h)}
                    </div>
                  </div>
                </motion.div>
              ))}

          {!loading && portfolio.length === 0 && !error && (
            <div className="text-center py-6 text-white/30 text-xs">
              No tokens found in this wallet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

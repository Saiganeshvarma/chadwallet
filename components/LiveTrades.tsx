'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { formatPrice, formatAddress, formatTimeAgo } from '@/lib/utils'
import { Skeleton } from './ui/skeleton'
import { getTokenTrades } from '@/lib/birdeye'
import type { BirdeyeTradeItem } from '@/types/birdeye'

interface Trade {
  txHash: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  wallet: string
  timestamp: number
}

interface LiveTradesProps {
  tokenAddress: string
  symbol: string
}

export function LiveTrades({ tokenAddress, symbol }: LiveTradesProps) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  const fetchTrades = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const data = await getTokenTrades(tokenAddress)
      const items = (data.data?.items ?? []).map(
        (t: BirdeyeTradeItem) => ({
          txHash: t.txHash ?? t.signature ?? `${t.blockUnixTime}-${t.owner}`,
          type: t.side === 'buy' ? 'buy' : 'sell',
          amount: Number(t.volumeUSD) || 0,
          price: Number(t.price) || 0,
          wallet: t.owner || 'Unknown',
          timestamp: t.blockUnixTime || Date.now() / 1000,
        })
      )
      setTrades(items)
      setLastUpdate(Date.now())
    } catch {
      setTrades([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [tokenAddress])

  useEffect(() => {
    fetchTrades()
    const interval = setInterval(() => fetchTrades(true), 15000)
    return () => clearInterval(interval)
  }, [fetchTrades])

  return (
    <div className="glass rounded-xl border border-white/5 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#14F195]" />
          <span className="text-sm font-semibold text-white">Live Trades</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-pulse" />
            <span className="text-xs text-white/30">Live</span>
          </span>
        </div>
        <button
          onClick={() => fetchTrades(true)}
          disabled={refreshing}
          className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
          aria-label="Refresh trades"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-5 gap-2 px-4 py-2 text-xs text-white/30 border-b border-white/5">
        <span>Type</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Price</span>
        <span className="text-right">Wallet</span>
        <span className="text-right">Time</span>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 px-4 py-2.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            ))
          : (
            <AnimatePresence initial={false}>
              {trades.map((trade, i) => (
                <motion.div
                  key={trade.txHash}
                  initial={{ opacity: 0, x: -10, backgroundColor: trade.type === 'buy' ? 'rgba(20,241,149,0.1)' : 'rgba(239,68,68,0.1)' }}
                  animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(255,255,255,0)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-5 gap-2 px-4 py-2.5 hover:bg-white/3 transition-colors border-b border-white/3 last:border-0"
                >
                  <div className="flex items-center gap-1.5">
                    {trade.type === 'buy' ? (
                      <div className="flex items-center gap-1 text-emerald-400">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-xs font-medium">BUY</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-400">
                        <TrendingDown className="w-3 h-3" />
                        <span className="text-xs font-medium">SELL</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right text-xs text-white/70 font-mono">
                    {trade.amount > 1e6
                      ? `$${(trade.amount / 1e6).toFixed(2)}M`
                      : trade.amount > 1e3
                      ? `$${(trade.amount / 1e3).toFixed(2)}K`
                      : `$${trade.amount.toFixed(2)}`}
                  </div>
                  <div className="text-right text-xs text-white/50 font-mono">
                    {trade.price > 0 ? formatPrice(trade.price) : '-'}
                  </div>
                  <div className="text-right">
                    <a
                      href={`https://solscan.io/account/${trade.wallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-white/40 hover:text-[#9945FF] transition-colors"
                    >
                      {formatAddress(trade.wallet, 3)}
                    </a>
                  </div>
                  <div className="text-right text-xs text-white/30">
                    {formatTimeAgo(trade.timestamp)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

        {!loading && trades.length === 0 && (
          <div className="text-center py-8 text-white/30 text-sm">
            No recent trades
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-white/5 text-xs text-white/20">
        Updated {formatTimeAgo(lastUpdate / 1000)} • Auto-refreshes every 15s
      </div>
    </div>
  )
}

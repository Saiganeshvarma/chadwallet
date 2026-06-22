'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink, Star, TrendingUp, TrendingDown, Copy, Check, Share2
} from 'lucide-react'
import { TradingChart } from './TradingChart'
import { MarketStats } from './MarketStats'
import { HolderList } from './HolderList'
import { LiveTrades } from './LiveTrades'
import { BuySellPanel } from './BuySellPanel'
import { AIInsightCard } from './AIInsightCard'
import { TrendingSidebar } from './TrendingSidebar'
import { PortfolioPanel } from './PortfolioPanel'
import { Skeleton } from './ui/skeleton'
import { formatPrice, formatPercent, formatAddress, getChangeColor, getChangeBg } from '@/lib/utils'
import { KNOWN_TOKENS } from '@/lib/birdeye'
import { TokenStats, AIInsight } from '@/types/token'
import { useAuthContext } from '@/context/AuthContext'

interface TokenOverview {
  address: string
  symbol: string
  name: string
  logoURI?: string
  price: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
  holders?: number
}

interface TradePageClientProps {
  tokenAddress: string
}

export function TradePageClient({ tokenAddress }: TradePageClientProps) {
  const [token, setToken] = useState<TokenOverview | null>(null)
  const [stats, setStats] = useState<TokenStats | null>(null)
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null)
  const [loadingToken, setLoadingToken] = useState(true)
  const [loadingAI, setLoadingAI] = useState(false)
  const [inWatchlist, setInWatchlist] = useState(false)
  const [copied, setCopied] = useState(false)
  const [solBalance, setSolBalance] = useState(0)

  const { user, authenticated } = useAuthContext()
  const walletAddress = user?.walletAddress
  const knownInfo = KNOWN_TOKENS[tokenAddress]

  // Fetch live SOL balance for the connected wallet
  useEffect(() => {
    if (!walletAddress) { setSolBalance(0); return }
    const fetchBalance = async () => {
      try {
        const res = await fetch(`/api/wallet?address=${walletAddress}`)
        if (!res.ok) return
        const data = await res.json()
        setSolBalance(data.solBalance ?? 0)
      } catch { /* ignore */ }
    }
    fetchBalance()
  }, [walletAddress])

  const fetchTokenData = useCallback(async () => {
    setLoadingToken(true)
    try {
      const res = await fetch(`/api/tokens?type=overview&address=${tokenAddress}`)
      const data = await res.json()

      const tokenData: TokenOverview = {
        address: tokenAddress,
        symbol: data.symbol ?? knownInfo?.symbol ?? tokenAddress.slice(0, 6),
        name: data.name ?? knownInfo?.name ?? 'Unknown Token',
        logoURI: data.logoURI ?? data.logo ?? knownInfo?.logoURI,
        price: data.price ?? data.v24h ?? 0,
        priceChange24h: data.priceChange24h ?? data.v24hChangePercent ?? 0,
        volume24h: data.v24h ?? data.volume24h ?? 0,
        liquidity: data.liquidity ?? 0,
        marketCap: data.mc ?? data.marketCap ?? 0,
        holders: data.holder ?? data.holders,
      }

      setToken(tokenData)
      setStats({
        price: tokenData.price,
        priceChange1h: data.priceChange1h ?? 0,
        priceChange24h: tokenData.priceChange24h,
        priceChange7d: data.priceChange7d ?? 0,
        volume1h: data.v1h ?? tokenData.volume24h / 24,
        volume24h: tokenData.volume24h,
        volume7d: data.v7d ?? tokenData.volume24h * 7,
        liquidity: tokenData.liquidity,
        marketCap: tokenData.marketCap,
        supply: data.supply ?? 0,
        holders: tokenData.holders ?? 0,
        txCount24h: data.trade24h ?? 0,
      })
    } catch (err) {
      console.error('Error fetching token:', err)
      // Fallback to known info
      if (knownInfo) {
        setToken({
          address: tokenAddress,
          symbol: knownInfo.symbol,
          name: knownInfo.name,
          logoURI: knownInfo.logoURI,
          price: 0,
          priceChange24h: 0,
          volume24h: 0,
          liquidity: 0,
          marketCap: 0,
        })
      }
    } finally {
      setLoadingToken(false)
    }
  }, [tokenAddress, knownInfo])

  const fetchAIInsight = useCallback(async () => {
    setLoadingAI(true)
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenAddress,
          symbol: token?.symbol,
          name: token?.name,
        }),
      })
      const data = await res.json()
      if (!data.error) {
        setAiInsight({
          id: tokenAddress,
          token: tokenAddress,
          createdAt: new Date().toISOString(),
          ...data,
        })
      }
    } catch (err) {
      console.error('AI insight error:', err)
    } finally {
      setLoadingAI(false)
    }
  }, [tokenAddress, token?.symbol, token?.name])

  useEffect(() => {
    fetchTokenData()
  }, [fetchTokenData])

  useEffect(() => {
    if (token && !aiInsight) {
      fetchAIInsight()
    }
  }, [token])

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(tokenAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isPositive = (token?.priceChange24h ?? 0) >= 0

  return (
    <div className="min-h-screen bg-[#050510]">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        {/* Token Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-6 flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            {loadingToken ? (
              <>
                <Skeleton className="w-14 h-14 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </>
            ) : (
              <>
                {token?.logoURI ? (
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-14 h-14 rounded-full bg-white/5"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${token.symbol}&background=9945FF&color=fff&size=56`
                    }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center text-xl font-bold text-white">
                    {token?.symbol?.slice(0, 2) ?? '??'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-white">{token?.name}</h1>
                    <span className="text-sm text-white/40 font-mono px-2 py-0.5 rounded-md bg-white/5">
                      {token?.symbol}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <button
                      onClick={handleCopyAddress}
                      className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors font-mono"
                    >
                      {formatAddress(tokenAddress, 8)}
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <a
                      href={`https://solscan.io/token/${tokenAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/30 hover:text-[#9945FF] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Price info */}
          <div className="flex items-center gap-4 flex-wrap">
            {loadingToken ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            ) : (
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {formatPrice(token?.price ?? 0)}
                </div>
                <div className={`flex items-center gap-1 justify-end mt-1 ${getChangeColor(token?.priceChange24h ?? 0)}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-medium">{formatPercent(token?.priceChange24h ?? 0)} (24h)</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInWatchlist(!inWatchlist)}
                className={`p-2 rounded-xl transition-all ${
                  inWatchlist
                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                    : 'bg-white/5 text-white/30 border border-white/5 hover:text-white/60'
                }`}
                aria-label="Toggle watchlist"
              >
                <Star className="w-4 h-4" fill={inWatchlist ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: `Trade ${token?.symbol}`, url: window.location.href })
                  }
                }}
                className="p-2 rounded-xl bg-white/5 text-white/30 border border-white/5 hover:text-white/60 transition-all"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-4">
          {/* Left Sidebar — Trending */}
          <div className="hidden lg:block">
            <TrendingSidebar />
          </div>

          {/* Center — Chart + Data */}
          <div className="space-y-4 min-w-0">
            {/* TradingView Chart */}
            <TradingChart
              symbol={token?.symbol ?? knownInfo?.symbol ?? 'SOL'}
              tokenAddress={tokenAddress}
            />

            {/* Market Stats */}
            <MarketStats stats={stats} loading={loadingToken} />

            {/* Holder Distribution */}
            <HolderList tokenAddress={tokenAddress} />

            {/* Live Trades */}
            <LiveTrades
              tokenAddress={tokenAddress}
              symbol={token?.symbol ?? 'TOKEN'}
            />

            {/* AI Analysis */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-gradient-to-b from-[#9945FF] to-[#14F195] rounded-full" />
                <span className="text-sm font-semibold text-white">AI Analysis</span>
              </div>
              <AIInsightCard
                insight={aiInsight}
                loading={loadingAI}
                onRefresh={fetchAIInsight}
              />
            </div>
          </div>

          {/* Right Sidebar — Trade + Portfolio */}
          <div className="space-y-4">
            {/* Wallet Info */}
            <div className="glass rounded-xl border border-white/5 p-4">
              <div className="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">Wallet</div>
              {authenticated && walletAddress ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center text-xs font-bold text-white">
                    {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'C'}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-white/60">{formatAddress(walletAddress, 4)}</div>
                    <div className="text-xs text-white/30">
                      {solBalance > 0 ? `${solBalance.toFixed(4)} SOL` : 'Loading…'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-white/30">Not connected</div>
              )}
            </div>

            {/* Buy/Sell Panel */}
            <BuySellPanel
              tokenAddress={tokenAddress}
              tokenSymbol={token?.symbol ?? knownInfo?.symbol ?? 'TOKEN'}
              tokenPrice={token?.price ?? 0}
              solBalance={solBalance}
            />

            {/* Portfolio */}
            <PortfolioPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

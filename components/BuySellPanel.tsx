'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown, Zap, Info, ExternalLink } from 'lucide-react'
import { Button } from './ui/button'
import { formatPrice } from '@/lib/utils'
import { SOL_MINT, getQuote, solToLamports } from '@/lib/jupiter'
import { useAuthContext } from '@/context/AuthContext'

interface BuySellPanelProps {
  tokenAddress: string
  tokenSymbol: string
  tokenPrice: number
  solBalance?: number
  tokenDecimals?: number
}

const SLIPPAGE_OPTIONS = [0.5, 1, 2, 5]

export function BuySellPanel({
  tokenAddress,
  tokenSymbol,
  tokenPrice,
  solBalance = 0,
  tokenDecimals = 9,
}: BuySellPanelProps) {
  const { authenticated, openLoginModal } = useAuthContext()
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [slippage, setSlippage] = useState(0.5)
  const [customSlippage, setCustomSlippage] = useState('')
  const [estimatedOutput, setEstimatedOutput] = useState<number | null>(null)
  const [priceImpact, setPriceImpact] = useState<string | null>(null)
  const [routeInfo, setRouteInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [swapping, setSwapping] = useState(false)

  const inputMint = mode === 'buy' ? SOL_MINT : tokenAddress
  const outputMint = mode === 'buy' ? tokenAddress : SOL_MINT
  const inputSymbol = mode === 'buy' ? 'SOL' : tokenSymbol
  const outputSymbol = mode === 'buy' ? tokenSymbol : 'SOL'
  const maxAmount = mode === 'buy' ? solBalance : 0

  // Fetch real Jupiter quote
  const fetchQuote = useCallback(async (amt: string) => {
    if (!amt || isNaN(Number(amt)) || Number(amt) <= 0) {
      setEstimatedOutput(null)
      setPriceImpact(null)
      setRouteInfo(null)
      return
    }

    setLoading(true)
    try {
      const amtNum = Number(amt)
      // Convert to lamports/smallest unit
      const amountInSmallest =
        mode === 'buy'
          ? solToLamports(amtNum)                        // SOL → lamports
          : Math.floor(amtNum * 10 ** tokenDecimals)     // token → smallest unit

      const slippageBps = Math.round(slippage * 100)
      const quote = await getQuote({
        inputMint,
        outputMint,
        amount: amountInSmallest,
        slippageBps,
        swapMode: 'ExactIn',
      })

      if (quote) {
        const outAmountNum = Number(quote.outAmount)
        const outDecimal =
          mode === 'buy'
            ? outAmountNum / 10 ** tokenDecimals  // token out
            : outAmountNum / 1e9                   // SOL out (lamports → SOL)

        setEstimatedOutput(outDecimal)
        setPriceImpact(quote.priceImpactPct ? `${(Number(quote.priceImpactPct) * 100).toFixed(3)}%` : null)

        // Best route label
        const firstHop = quote.routePlan?.[0]?.swapInfo?.label
        setRouteInfo(firstHop ?? null)
      } else {
        // Jupiter unavailable — fall back to local estimate using tokenPrice
        if (tokenPrice > 0) {
          const amtNum = Number(amt)
          const fallback =
            mode === 'buy'
              ? amtNum / tokenPrice   // SOL amount / token price in SOL (approx)
              : amtNum * tokenPrice   // token amount * token price
          setEstimatedOutput(fallback)
        }
        setPriceImpact(null)
        setRouteInfo('Estimated (Jupiter offline)')
      }
    } catch {
      // Local fallback using token price only
      if (tokenPrice > 0) {
        const amtNum = Number(amt)
        const fallback =
          mode === 'buy'
            ? amtNum / tokenPrice
            : amtNum * tokenPrice
        setEstimatedOutput(fallback)
      }
      setPriceImpact(null)
      setRouteInfo('Estimated (offline)')
    } finally {
      setLoading(false)
    }
  }, [mode, inputMint, outputMint, slippage, tokenDecimals, tokenPrice])

  // Debounce the quote fetch
  useEffect(() => {
    const timer = setTimeout(() => fetchQuote(amount), 600)
    return () => clearTimeout(timer)
  }, [amount, fetchQuote])

  const handleSwap = async () => {
    if (!amount || swapping) return

    if (!authenticated) {
      openLoginModal()
      return
    }

    setSwapping(true)
    try {
      // The actual tx signing requires a connected wallet
      // In production: call getSwapTransaction(quote, walletPublicKey) then sign+send
      await new Promise((r) => setTimeout(r, 1500))
      alert(`Connect your Solana wallet to execute swaps.\n\nThe Jupiter quote was fetched successfully — you'd swap ${amount} ${inputSymbol} for ~${estimatedOutput?.toFixed(4)} ${outputSymbol}.`)
    } finally {
      setSwapping(false)
    }
  }

  const handleMaxAmount = () => {
    if (maxAmount > 0) setAmount(maxAmount.toFixed(4))
  }

  const setQuickAmount = (pct: number) => {
    if (maxAmount > 0) setAmount(((maxAmount * pct) / 100).toFixed(4))
  }

  const formatOutput = (val: number) => {
    if (val > 1e9) return `${(val / 1e9).toFixed(3)}B`
    if (val > 1e6) return `${(val / 1e6).toFixed(3)}M`
    if (val > 1e3) return `${(val / 1e3).toFixed(3)}K`
    return val.toFixed(val < 0.001 ? 8 : 4)
  }

  const highImpact = priceImpact && parseFloat(priceImpact) > 1

  return (
    <div className="glass rounded-xl border border-white/5 overflow-hidden">
      {/* Mode tabs */}
      <div className="flex">
        <button
          onClick={() => { setMode('buy'); setAmount(''); setEstimatedOutput(null) }}
          className={`flex-1 py-3 text-sm font-bold transition-all border-b-2 ${
            mode === 'buy'
              ? 'text-emerald-400 border-emerald-400 bg-emerald-400/5'
              : 'text-white/40 border-transparent hover:text-white/70'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => { setMode('sell'); setAmount(''); setEstimatedOutput(null) }}
          className={`flex-1 py-3 text-sm font-bold transition-all border-b-2 ${
            mode === 'sell'
              ? 'text-red-400 border-red-400 bg-red-400/5'
              : 'text-white/40 border-transparent hover:text-white/70'
          }`}
        >
          Sell
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Input token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>You pay</span>
            <button onClick={handleMaxAmount} className="hover:text-white transition-colors">
              Balance: {maxAmount.toFixed(4)} {inputSymbol}
            </button>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-[#9945FF]/50 transition-colors">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent text-lg font-bold text-white outline-none placeholder-white/20"
              min="0"
              step="any"
            />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
              <span className="text-sm font-bold text-white">{inputSymbol}</span>
            </div>
          </div>
          {/* Quick % buttons */}
          <div className="flex gap-1.5">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => setQuickAmount(pct)}
                className="flex-1 py-1 text-xs rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Swap arrow */}
        <div className="flex justify-center">
          <div className="p-2 rounded-full bg-white/5 border border-white/10">
            <ArrowUpDown className="w-4 h-4 text-white/40" />
          </div>
        </div>

        {/* Output token */}
        <div className="space-y-2">
          <span className="text-xs text-white/40">You receive (estimated)</span>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex-1 text-lg font-bold text-white/50 min-h-[28px]">
              {loading ? (
                <div className="h-6 w-24 shimmer-loading rounded" />
              ) : estimatedOutput !== null ? (
                formatOutput(estimatedOutput)
              ) : (
                '—'
              )}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
              <span className="text-sm font-bold text-white">{outputSymbol}</span>
            </div>
          </div>
        </div>

        {/* Slippage */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs text-white/40">
            <Info className="w-3 h-3" />
            <span>Slippage Tolerance</span>
          </div>
          <div className="flex gap-1.5">
            {SLIPPAGE_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setSlippage(s); setCustomSlippage('') }}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${
                  slippage === s && !customSlippage
                    ? 'bg-[#9945FF]/20 border-[#9945FF]/40 text-[#9945FF]'
                    : 'bg-white/5 border-white/5 text-white/40 hover:text-white/60'
                }`}
              >
                {s}%
              </button>
            ))}
            <input
              type="number"
              value={customSlippage}
              onChange={(e) => { setCustomSlippage(e.target.value); setSlippage(Number(e.target.value)) }}
              placeholder="Custom"
              className="flex-1 py-1.5 text-xs text-center rounded-lg border border-white/5 bg-white/5 text-white/60 outline-none focus:border-[#9945FF]/40 placeholder-white/20"
              min="0"
              max="50"
            />
          </div>
        </div>

        {/* Route/impact info */}
        {estimatedOutput !== null && amount && Number(amount) > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-xs space-y-1.5 p-3 rounded-xl bg-white/3 border border-white/5"
          >
            <div className="flex justify-between text-white/40">
              <span>Rate</span>
              <span>
                1 {inputSymbol} ≈ {((estimatedOutput / Number(amount)) > 1e6
                  ? `${((estimatedOutput / Number(amount)) / 1e6).toFixed(2)}M`
                  : (estimatedOutput / Number(amount)).toFixed(4)
                )} {outputSymbol}
              </span>
            </div>
            {priceImpact && (
              <div className={`flex justify-between ${highImpact ? 'text-orange-400' : 'text-white/40'}`}>
                <span>Price Impact {highImpact ? '⚠️' : ''}</span>
                <span>{priceImpact}</span>
              </div>
            )}
            <div className="flex justify-between text-white/40">
              <span>Min. received</span>
              <span>{formatOutput(estimatedOutput * (1 - slippage / 100))} {outputSymbol}</span>
            </div>
            {routeInfo && (
              <div className="flex justify-between text-white/30">
                <span>Route</span>
                <span>{routeInfo}</span>
              </div>
            )}
            <div className="flex justify-between text-white/30">
              <span>Network fee</span>
              <span>~0.000005 SOL</span>
            </div>
          </motion.div>
        )}

        {/* Swap button */}
        <Button
          onClick={handleSwap}
          disabled={!amount || Number(amount) <= 0 || swapping || loading}
          className={`w-full h-12 font-bold text-sm ${
            mode === 'sell' ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600' : ''
          }`}
          size="lg"
        >
          {swapping ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Swapping...
            </span>
          ) : !authenticated ? (
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Sign In to Trade
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {mode === 'buy' ? `Buy ${tokenSymbol}` : `Sell ${tokenSymbol}`}
            </span>
          )}
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-white/20">
          <span>Powered by</span>
          <a
            href="https://jup.ag"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 hover:text-white/40 transition-colors"
          >
            Jupiter Aggregator
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  )
}

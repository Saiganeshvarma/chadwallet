'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { TrendingUp, TrendingDown, Star, Flame } from 'lucide-react'
import { formatPrice, formatVolume, formatPercent, getChangeColor, getChangeBg } from '@/lib/utils'
import { Token } from '@/types/token'

interface TokenCardProps {
  token: Token
  index?: number
  onWatchlist?: (address: string) => void
  inWatchlist?: boolean
}

export function TokenCard({ token, index = 0, onWatchlist, inWatchlist }: TokenCardProps) {
  const router = useRouter()
  const isPositive = token.priceChange24h >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => router.push(`/trade/${token.address}`)}
      className="glass rounded-xl p-4 border border-white/5 card-hover cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {token.logoURI ? (
            <img
              src={token.logoURI}
              alt={token.symbol}
              className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${token.symbol}&background=9945FF&color=fff&size=40`
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {token.symbol.slice(0, 2)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{token.symbol}</span>
              {token.isTrending && (
                <Flame className="w-3 h-3 text-orange-400" />
              )}
            </div>
            <span className="text-xs text-white/40 truncate max-w-[100px] block">{token.name}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onWatchlist?.(token.address)
          }}
          className={`p-1.5 rounded-lg transition-all ${
            inWatchlist
              ? 'text-amber-400 bg-amber-400/10'
              : 'text-white/20 hover:text-white/60 hover:bg-white/5'
          }`}
          aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Star className="w-3.5 h-3.5" fill={inWatchlist ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-white">{formatPrice(token.price)}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${getChangeBg(token.priceChange24h)}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {formatPercent(token.priceChange24h)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
          <div>
            <div className="text-xs text-white/30">Volume 24h</div>
            <div className="text-xs font-medium text-white/70">{formatVolume(token.volume24h)}</div>
          </div>
          <div>
            <div className="text-xs text-white/30">Market Cap</div>
            <div className="text-xs font-medium text-white/70">{formatVolume(token.marketCap)}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

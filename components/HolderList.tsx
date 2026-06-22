'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Crown, AlertTriangle } from 'lucide-react'
import { formatAddress } from '@/lib/utils'
import { Skeleton } from './ui/skeleton'
import { getTokenHolders } from '@/lib/birdeye'

interface Holder {
  owner: string
  amount: number
  percentage: number
  rank: number
}

interface HolderListProps {
  tokenAddress: string
}

export function HolderList({ tokenAddress }: HolderListProps) {
  const [holders, setHolders] = useState<Holder[]>([])
  const [loading, setLoading] = useState(true)
  const [concentrationScore, setConcentrationScore] = useState(0)

  useEffect(() => {
    const fetchHolders = async () => {
      setLoading(true)
      try {
        const data = await getTokenHolders(tokenAddress)
        const items = data.data?.items ?? []
        setHolders(items)
        // Calculate concentration (sum of top 5 holders)
        const top5 = items.slice(0, 5).reduce((sum: number, h: Holder) => sum + (h.percentage ?? 0), 0)
        setConcentrationScore(Math.round(top5))
      } catch {
        setHolders([])
      } finally {
        setLoading(false)
      }
    }
    fetchHolders()
  }, [tokenAddress])

  const concentrationColor =
    concentrationScore < 30 ? 'text-emerald-400' :
    concentrationScore < 60 ? 'text-amber-400' : 'text-red-400'

  const concentrationLabel =
    concentrationScore < 30 ? 'Healthy' :
    concentrationScore < 60 ? 'Moderate' : 'Concentrated'

  return (
    <div className="glass rounded-xl border border-white/5 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#9945FF]" />
          <span className="text-sm font-semibold text-white">Top Holders</span>
        </div>
        {!loading && (
          <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
            concentrationScore < 30 ? 'bg-emerald-400/10' :
            concentrationScore < 60 ? 'bg-amber-400/10' : 'bg-red-400/10'
          }`}>
            {concentrationScore >= 60 && <AlertTriangle className="w-3 h-3" />}
            <span className={concentrationColor}>
              {concentrationLabel} — Top 5: {concentrationScore}%
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-6 h-4" />
                <Skeleton className="flex-1 h-4" />
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-12 h-4" />
              </div>
            ))
          : holders.slice(0, 10).map((holder, i) => (
              <motion.div
                key={holder.owner ?? i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div className="w-5 text-xs text-white/30 text-center flex-shrink-0">
                  {i === 0 ? <Crown className="w-3.5 h-3.5 text-amber-400" /> : i + 1}
                </div>
                <a
                  href={`https://solscan.io/account/${holder.owner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 text-xs font-mono text-white/60 hover:text-[#9945FF] transition-colors truncate"
                >
                  {formatAddress(holder.owner ?? '', 6)}
                </a>
                <div className="text-xs text-white/50 text-right w-24 flex-shrink-0">
                  {holder.amount > 1e9
                    ? `${(holder.amount / 1e9).toFixed(2)}B`
                    : holder.amount > 1e6
                    ? `${(holder.amount / 1e6).toFixed(2)}M`
                    : holder.amount?.toLocaleString()}
                </div>
                <div className="w-12 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, holder.percentage ?? 0)}%` }}
                        transition={{ delay: i * 0.05 + 0.3, duration: 0.5 }}
                        className={`h-full rounded-full ${
                          i === 0 ? 'bg-amber-400' : i < 3 ? 'bg-[#9945FF]' : 'bg-[#14F195]'
                        }`}
                      />
                    </div>
                    <span className="text-xs text-white/40 w-8 text-right">
                      {holder.percentage?.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

        {!loading && holders.length === 0 && (
          <div className="text-center py-8 text-white/30 text-sm">
            No holder data available
          </div>
        )}
      </div>
    </div>
  )
}

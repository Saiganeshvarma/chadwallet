'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, Users, DollarSign, BarChart3 } from 'lucide-react'
import { formatPrice, formatVolume, formatPercent, getChangeColor } from '@/lib/utils'
import { TokenStats } from '@/types/token'
import { Skeleton } from './ui/skeleton'

interface MarketStatsProps {
  stats: TokenStats | null
  loading?: boolean
}

export function MarketStats({ stats, loading }: MarketStatsProps) {
  if (loading || !stats) {
    return (
      <div className="glass rounded-xl p-4 border border-white/5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const statItems = [
    {
      label: 'Price',
      value: formatPrice(stats.price),
      change: stats.priceChange24h,
      icon: DollarSign,
    },
    {
      label: '1h Change',
      value: formatPercent(stats.priceChange1h),
      change: stats.priceChange1h,
      icon: Activity,
    },
    {
      label: '24h Change',
      value: formatPercent(stats.priceChange24h),
      change: stats.priceChange24h,
      icon: TrendingUp,
    },
    {
      label: '7d Change',
      value: formatPercent(stats.priceChange7d),
      change: stats.priceChange7d,
      icon: BarChart3,
    },
    {
      label: '24h Volume',
      value: formatVolume(stats.volume24h),
      change: null,
      icon: Activity,
    },
    {
      label: 'Liquidity',
      value: formatVolume(stats.liquidity),
      change: null,
      icon: DollarSign,
    },
    {
      label: 'Market Cap',
      value: formatVolume(stats.marketCap),
      change: null,
      icon: BarChart3,
    },
    {
      label: 'Holders',
      value: stats.holders.toLocaleString(),
      change: null,
      icon: Users,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 border border-white/5"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statItems.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="space-y-1"
            >
              <div className="flex items-center gap-1.5 text-xs text-white/40">
                <Icon className="w-3 h-3" />
                {item.label}
              </div>
              <div className={`text-sm font-bold ${item.change !== null ? getChangeColor(item.change) : 'text-white'}`}>
                {item.value}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

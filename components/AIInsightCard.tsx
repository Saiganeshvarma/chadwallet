'use client'

import { motion } from 'framer-motion'
import { Brain, TrendingUp, TrendingDown, Minus, AlertTriangle, Flame, BarChart3, Users } from 'lucide-react'
import { Badge } from './ui/badge'
import { AIInsight } from '@/types/token'
import { Skeleton } from './ui/skeleton'

interface AIInsightCardProps {
  insight: AIInsight | null
  loading?: boolean
  onRefresh?: () => void
}

const TAG_STYLES: Record<string, string> = {
  trending: 'bg-orange-400/10 text-orange-400',
  'high-volume': 'bg-blue-400/10 text-blue-400',
  'whale-accumulation': 'bg-purple-400/10 text-purple-400',
  momentum: 'bg-emerald-400/10 text-emerald-400',
  'high-risk': 'bg-red-400/10 text-red-400',
  'moderate-risk': 'bg-amber-400/10 text-amber-400',
  'bearish-pressure': 'bg-red-400/10 text-red-400',
  'low-volume': 'bg-gray-400/10 text-gray-400',
}

function RiskMeter({ score }: { score: number }) {
  const color = score <= 3 ? '#14F195' : score <= 6 ? '#FF8C00' : '#ef4444'
  const label = score <= 3 ? 'Low Risk' : score <= 6 ? 'Medium Risk' : 'High Risk'
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/40">Risk Score</span>
        <span style={{ color }} className="font-semibold">{label} ({score}/10)</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ backgroundColor: color }}
          className="h-full rounded-full"
        />
      </div>
    </div>
  )
}

export function AIInsightCard({ insight, loading, onRefresh }: AIInsightCardProps) {
  if (loading) {
    return (
      <div className="glass rounded-xl border border-white/5 p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-6 w-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    )
  }

  if (!insight) {
    return (
      <div className="glass rounded-xl border border-white/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-[#9945FF]/20 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-[#9945FF]" />
          </div>
          <span className="text-sm font-semibold text-white">AI Analysis</span>
        </div>
        <div className="text-center py-6">
          <Brain className="w-8 h-8 text-white/20 mx-auto mb-2" />
          <p className="text-white/40 text-sm">No analysis available</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-3 text-xs text-[#9945FF] hover:underline"
            >
              Generate Analysis
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl border border-white/5 p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#9945FF]/20 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-[#9945FF]" />
          </div>
          <span className="text-sm font-semibold text-white">AI Analysis</span>
          {insight.whaleActivity && (
            <Badge variant="warning" className="text-xs">🐋 Whale Activity</Badge>
          )}
        </div>
        <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
          insight.trend === 'bullish' ? 'bg-emerald-400/10 text-emerald-400' :
          insight.trend === 'bearish' ? 'bg-red-400/10 text-red-400' :
          'bg-gray-400/10 text-gray-400'
        }`}>
          {insight.trend === 'bullish' ? <TrendingUp className="w-3 h-3" /> :
           insight.trend === 'bearish' ? <TrendingDown className="w-3 h-3" /> :
           <Minus className="w-3 h-3" />}
          {insight.trend.charAt(0).toUpperCase() + insight.trend.slice(1)}
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-white/70 leading-relaxed">{insight.summary}</p>

      {/* Risk Meter */}
      <RiskMeter score={insight.riskScore} />

      {/* Analysis cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-white/3 border border-white/5">
          <div className="flex items-center gap-1.5 mb-2">
            <BarChart3 className="w-3 h-3 text-blue-400" />
            <span className="text-xs font-medium text-white/60">Volume</span>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">{insight.volumeAnalysis}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/3 border border-white/5">
          <div className="flex items-center gap-1.5 mb-2">
            <Users className="w-3 h-3 text-purple-400" />
            <span className="text-xs font-medium text-white/60">Holders</span>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">{insight.holderAnalysis}</p>
        </div>
      </div>

      {/* Tags */}
      {insight.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {insight.tags.map((tag) => (
            <span
              key={tag}
              className={`text-xs px-2.5 py-0.5 rounded-full ${TAG_STYLES[tag] ?? 'bg-white/5 text-white/40'}`}
            >
              {tag.replace(/-/g, ' ')}
            </span>
          ))}
        </div>
      )}

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="w-full text-xs text-center text-white/30 hover:text-[#9945FF] transition-colors py-1"
        >
          Refresh Analysis
        </button>
      )}
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Brain, TrendingUp, AlertTriangle, BarChart3, Zap, Shield } from 'lucide-react'

const INSIGHT_CARDS = [
  {
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    tag: 'Bullish Signal',
    tagColor: 'bg-emerald-400/10 text-emerald-400',
    title: 'Trending Upward',
    desc: 'SOL showing strong momentum with 3.2% gain. Volume 40% above 7-day average signals sustained buying pressure.',
    token: 'SOL',
    change: '+3.2%',
  },
  {
    icon: BarChart3,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    tag: 'Whale Activity',
    tagColor: 'bg-blue-400/10 text-blue-400',
    title: 'Whale Accumulation Detected',
    desc: 'Large wallets have accumulated 2.8M JUP in the last 4 hours. On-chain signals point to institutional interest.',
    token: 'JUP',
    change: '+12.4%',
  },
  {
    icon: Zap,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    tag: 'Volume Surge',
    tagColor: 'bg-purple-400/10 text-purple-400',
    title: 'Volume Surge Detected',
    desc: 'BONK volume surged 180% in the last hour. Social sentiment extremely positive. Watch for potential breakout.',
    token: 'BONK',
    change: '-1.8%',
  },
  {
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    tag: 'Momentum',
    tagColor: 'bg-emerald-400/10 text-emerald-400',
    title: 'Momentum Increasing',
    desc: 'WIF RSI at 68, approaching overbought. Strong buy pressure from retail traders. Key resistance at $2.40.',
    token: 'WIF',
    change: '-5.6%',
  },
  {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    tag: 'Bearish Warning',
    tagColor: 'bg-amber-400/10 text-amber-400',
    title: 'Bearish Divergence',
    desc: 'PYTH showing bearish RSI divergence on 4H chart. Volume declining while price consolidates. Watch carefully.',
    token: 'PYTH',
    change: '+7.8%',
  },
  {
    icon: Shield,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
    tag: 'High Risk',
    tagColor: 'bg-red-400/10 text-red-400',
    title: 'High Risk Volatility',
    desc: 'JTO showing extreme volatility with 15%+ swings in 24h. Low liquidity amplifying price movements. Risk management critical.',
    token: 'JTO',
    change: '+2.1%',
  },
]

export function AIInsightsSection() {
  return (
    <section id="ai-insights" className="py-20 px-4 sm:px-6 lg:px-8 bg-mesh">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-[#9945FF]" />
            <span className="text-xs font-medium text-[#9945FF] uppercase tracking-wider">Powered by GPT-4</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            AI-Powered Token Insights
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto">
            Real-time analysis of market conditions, whale activity, and momentum signals — so you trade with data, not guesses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INSIGHT_CARDS.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass rounded-2xl p-5 border ${card.border} card-hover`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${card.color}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${card.tagColor}`}>
                      {card.tag}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-white/50">{card.token}</span>
                  <span className={`text-xs ${card.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {card.change}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2">{card.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{card.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

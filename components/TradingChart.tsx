'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Skeleton } from './ui/skeleton'

interface TradingChartProps {
  symbol: string
  tokenAddress: string
}

const TIMEFRAMES = ['1m', '5m', '15m', '1H', '4H', '1D', '1W']

export function TradingChart({ symbol, tokenAddress }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [timeframe, setTimeframe] = useState('1H')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [symbol, timeframe])

  useEffect(() => {
    if (loading || !containerRef.current) return

    // Clear previous content
    containerRef.current.innerHTML = ''

    // Check if TradingView is available
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
      script.async = true
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: `BINANCE:${symbol}USDT`,
        interval: timeframe === '1m' ? '1' : timeframe === '5m' ? '5' : timeframe === '15m' ? '15' : timeframe === '1H' ? '60' : timeframe === '4H' ? '240' : timeframe === '1D' ? 'D' : 'W',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        backgroundColor: 'rgba(5, 5, 16, 0)',
        gridColor: 'rgba(255, 255, 255, 0.03)',
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        calendar: false,
        hide_volume: false,
        support_host: 'https://www.tradingview.com',
      })

      const widgetContainer = document.createElement('div')
      widgetContainer.className = 'tradingview-widget-container'
      widgetContainer.style.height = '100%'
      widgetContainer.style.width = '100%'

      const widgetDiv = document.createElement('div')
      widgetDiv.className = 'tradingview-widget-container__widget'
      widgetDiv.style.height = 'calc(100% - 32px)'
      widgetDiv.style.width = '100%'

      widgetContainer.appendChild(widgetDiv)
      widgetContainer.appendChild(script)
      containerRef.current.appendChild(widgetContainer)
    }
  }, [symbol, timeframe, loading])

  return (
    <div className="glass rounded-xl border border-white/5 overflow-hidden">
      {/* Timeframe selector */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                timeframe === tf
                  ? 'bg-[#9945FF]/20 text-[#9945FF] border border-[#9945FF]/30'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="text-xs text-white/30">Powered by TradingView</div>
      </div>

      {/* Chart area */}
      <div className="relative" style={{ height: '420px' }}>
        {loading ? (
          <div className="absolute inset-0 flex flex-col gap-3 p-4">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            ref={containerRef}
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  )
}

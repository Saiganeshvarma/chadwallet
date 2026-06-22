'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

export interface TradeItem {
  txHash: string
  type: 'buy' | 'sell'
  price: number
  volumeUSD: number
  wallet: string
  timestamp: number
  source: string
}

interface UseBirdeyeTradesOptions {
  address: string
  limit?: number
  /** Poll interval ms, 0 to disable. Default 15 000 */
  pollInterval?: number
}

interface UseBirdeyeTradesReturn {
  trades: TradeItem[]
  loading: boolean
  refreshing: boolean
  error: string | null
  lastUpdate: number
  refresh: () => void
}

export function useBirdeyeTrades({
  address,
  limit = 20,
  pollInterval = 15_000,
}: UseBirdeyeTradesOptions): UseBirdeyeTradesReturn {
  const [trades, setTrades]       = useState<TradeItem[]>([])
  const [loading, setLoading]     = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetch_ = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const res  = await fetch(`/api/birdeye/trades?address=${address}&limit=${limit}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setTrades(data.trades ?? [])
      setLastUpdate(Date.now())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trades')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [address, limit])

  useEffect(() => {
    setLoading(true)
    fetch_()
    if (pollInterval > 0) {
      timerRef.current = setInterval(() => fetch_(true), pollInterval)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [fetch_, pollInterval])

  return { trades, loading, refreshing, error, lastUpdate, refresh: () => fetch_(true) }
}

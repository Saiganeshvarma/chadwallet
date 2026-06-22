'use client'

import { useEffect, useState, useCallback } from 'react'
import type { OHLCVTimeframe, NormalizedOHLCV } from '@/types/birdeye'

interface UseBirdeyeOHLCVOptions {
  address: string
  type?: OHLCVTimeframe
  /** seconds — defaults to 7 days */
  from?: number
  to?: number
}

interface UseBirdeyeOHLCVReturn {
  candles: NormalizedOHLCV[]
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useBirdeyeOHLCV({
  address,
  type = '1H',
  from,
  to,
}: UseBirdeyeOHLCVOptions): UseBirdeyeOHLCVReturn {
  const [candles, setCandles] = useState<NormalizedOHLCV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const now_   = Math.floor(Date.now() / 1000)
  const from_  = from ?? now_ - 7 * 24 * 3600
  const to_    = to   ?? now_

  const fetch_ = useCallback(async () => {
    if (!address) return
    setLoading(true)
    try {
      const params = new URLSearchParams({
        address,
        type,
        from: String(from_),
        to:   String(to_),
      })
      const res  = await fetch(`/api/birdeye/ohlcv?${params}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setCandles(data.candles ?? [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch OHLCV')
    } finally {
      setLoading(false)
    }
  }, [address, type, from_, to_])

  useEffect(() => {
    fetch_()
  }, [fetch_])

  return { candles, loading, error, refresh: fetch_ }
}

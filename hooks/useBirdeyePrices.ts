'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

export interface PriceItem {
  address: string
  symbol: string
  name: string
  logoURI: string
  price: number
  priceChange24h: number
  updatedAt: number
}

interface UseBirdeyePricesOptions {
  addresses?: string[]
  /** Poll interval in ms — 0 to disable. Default 30 000 */
  pollInterval?: number
}

interface UseBirdeyePricesReturn {
  prices: PriceItem[]
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useBirdeyePrices({
  addresses,
  pollInterval = 30_000,
}: UseBirdeyePricesOptions = {}): UseBirdeyePricesReturn {
  const [prices, setPrices]   = useState<PriceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const timerRef              = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetch_ = useCallback(async () => {
    try {
      const query = addresses?.length
        ? `/api/birdeye/prices?addresses=${addresses.join(',')}`
        : '/api/birdeye/prices'
      const res  = await fetch(query)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setPrices(data.prices ?? [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices')
    } finally {
      setLoading(false)
    }
  }, [addresses?.join(',')])   // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setLoading(true)
    fetch_()
    if (pollInterval > 0) {
      timerRef.current = setInterval(fetch_, pollInterval)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [fetch_, pollInterval])

  return { prices, loading, error, refresh: fetch_ }
}

/** Single-token price hook */
export function useBirdeyePrice(address: string, pollInterval = 30_000) {
  const [price, setPrice]     = useState<number | null>(null)
  const [change, setChange]   = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    try {
      const res  = await fetch(`/api/birdeye/prices?address=${address}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setPrice(data.price ?? null)
      setChange(data.priceChange24h ?? 0)
    } catch {
      // keep previous value on error
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    setLoading(true)
    fetch_()
    if (pollInterval > 0) {
      const id = setInterval(fetch_, pollInterval)
      return () => clearInterval(id)
    }
  }, [fetch_, pollInterval])

  return { price, priceChange24h: change, loading, refresh: fetch_ }
}

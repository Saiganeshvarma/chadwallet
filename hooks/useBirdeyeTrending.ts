'use client'

import { useEffect, useState, useCallback } from 'react'

export interface TrendingTokenItem {
  address: string
  symbol: string
  name: string
  logoURI: string
  decimals: number
  price: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
  rank: number
  listingTime?: number
}

interface UseBirdeyeTrendingOptions {
  type?: 'trending' | 'new'
  limit?: number
}

interface UseBirdeyeTrendingReturn {
  tokens: TrendingTokenItem[]
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useBirdeyeTrending({
  type = 'trending',
  limit = 20,
}: UseBirdeyeTrendingOptions = {}): UseBirdeyeTrendingReturn {
  const [tokens, setTokens]   = useState<TrendingTokenItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch(`/api/birdeye/trending?type=${type}&limit=${limit}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setTokens(data.tokens ?? [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trending tokens')
    } finally {
      setLoading(false)
    }
  }, [type, limit])

  useEffect(() => {
    fetch_()
  }, [fetch_])

  return { tokens, loading, error, refresh: fetch_ }
}

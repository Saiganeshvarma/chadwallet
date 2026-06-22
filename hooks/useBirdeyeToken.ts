'use client'

import { useEffect, useState, useCallback } from 'react'
import type { NormalizedToken } from '@/types/birdeye'

interface UseBirdeyeTokenReturn {
  token: NormalizedToken | null
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useBirdeyeToken(address: string): UseBirdeyeTokenReturn {
  const [token, setToken]     = useState<NormalizedToken | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    if (!address) return
    setLoading(true)
    try {
      const res = await fetch(`/api/birdeye/overview?address=${address}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setToken(data as NormalizedToken)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch token')
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    fetch_()
  }, [fetch_])

  return { token, loading, error, refresh: fetch_ }
}

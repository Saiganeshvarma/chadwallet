'use client'

import { useEffect, useState, useCallback } from 'react'

export interface HolderItem {
  owner: string
  amount: number
  percentage: number
  rank: number
}

interface UseBirdeyeHoldersReturn {
  holders: HolderItem[]
  total: number
  loading: boolean
  error: string | null
  concentrationTop5: number
  refresh: () => void
}

export function useBirdeyeHolders(address: string, limit = 10): UseBirdeyeHoldersReturn {
  const [holders, setHolders] = useState<HolderItem[]>([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    if (!address) return
    setLoading(true)
    try {
      const res  = await fetch(`/api/birdeye/holders?address=${address}&limit=${limit}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setHolders(data.holders ?? [])
      setTotal(data.total ?? 0)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch holders')
    } finally {
      setLoading(false)
    }
  }, [address, limit])

  useEffect(() => {
    fetch_()
  }, [fetch_])

  const concentrationTop5 = holders
    .slice(0, 5)
    .reduce((sum, h) => sum + (h.percentage ?? 0), 0)

  return { holders, total, loading, error, concentrationTop5: Math.round(concentrationTop5), refresh: fetch_ }
}

'use client'

import { useState, useCallback, useRef } from 'react'

export interface SearchResult {
  address: string
  symbol: string
  name: string
  logoURI?: string
  price?: number
  priceChange24h?: number
  volume24h?: number
  marketCap?: number
  liquidity?: number
}

interface UseBirdeyeSearchReturn {
  results: SearchResult[]
  loading: boolean
  error: string | null
  search: (query: string) => void
  clear: () => void
}

export function useBirdeyeSearch(limit = 20): UseBirdeyeSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const debounceRef           = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) { setResults([]); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res  = await fetch(`/api/birdeye/search?q=${encodeURIComponent(query)}&limit=${limit}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setResults(data.tokens ?? [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)   // 350 ms debounce
  }, [limit])

  const clear = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setResults([])
    setError(null)
  }, [])

  return { results, loading, error, search, clear }
}

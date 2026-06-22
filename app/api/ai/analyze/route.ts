import { NextRequest, NextResponse } from 'next/server'
import { analyzeToken } from '@/lib/ai'
import { getTokenOverview } from '@/lib/birdeye'
import { getAIInsight, saveAIInsight } from '@/lib/supabase'

// Cache TTL: 5 minutes
const ANALYSIS_CACHE_TTL = 5 * 60 * 1000
const memCache = new Map<string, { data: unknown; timestamp: number }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, symbol, name, forceRefresh } = body

    if (!token) {
      return NextResponse.json({ error: 'Token address required' }, { status: 400 })
    }

    // Check memory cache
    const cacheKey = `analysis:${token}`
    const memCached = memCache.get(cacheKey)
    if (!forceRefresh && memCached && Date.now() - memCached.timestamp < ANALYSIS_CACHE_TTL) {
      return NextResponse.json(memCached.data)
    }

    // Check Supabase cache
    if (!forceRefresh) {
      const { data: cached } = await getAIInsight(token)
      if (cached) {
        const age = Date.now() - new Date(cached.created_at).getTime()
        if (age < ANALYSIS_CACHE_TTL * 6) {
          // 30 min Supabase cache
          const analysis = JSON.parse(cached.analysis)
          memCache.set(cacheKey, { data: analysis, timestamp: Date.now() })
          return NextResponse.json(analysis)
        }
      }
    }

    // Fetch live data from BirdEye
    const overviewData = await getTokenOverview(token)
    const overview = overviewData.data

    // Build analysis input
    const analysisInput = {
      symbol: symbol ?? overview?.symbol ?? 'UNKNOWN',
      name: name ?? overview?.name ?? 'Unknown Token',
      price: overview?.price ?? 0,
      priceChange24h: overview?.priceChange24h ?? overview?.v24hChangePercent ?? 0,
      volume24h: overview?.v24h ?? 0,
      liquidity: overview?.liquidity ?? 0,
      marketCap: overview?.mc ?? 0,
      holders: overview?.holder ?? undefined,
      topHolderConcentration: undefined as number | undefined,
    }

    // Run AI analysis
    const analysis = await analyzeToken(analysisInput)

    // Cache in memory and Supabase
    memCache.set(cacheKey, { data: analysis, timestamp: Date.now() })
    await saveAIInsight(token, JSON.stringify(analysis))

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('AI analyze error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token address required' }, { status: 400 })
  }

  const { data, error } = await getAIInsight(token)
  if (error || !data) {
    return NextResponse.json({ error: 'No cached analysis found' }, { status: 404 })
  }

  return NextResponse.json(JSON.parse(data.analysis))
}

import { NextRequest, NextResponse } from 'next/server'
import { searchTokens } from '@/lib/birdeye'

/**
 * GET /api/birdeye/search?q=<query>&limit=20
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') ?? ''
  const limit = parseInt(searchParams.get('limit') ?? '20', 10)

  if (!query.trim()) {
    return NextResponse.json({ tokens: [] })
  }

  try {
    const { data } = await searchTokens(query, limit)
    // The API returns items grouped by type; we only care about 'token'
    const tokens = (data?.items ?? [])
      .flatMap((group) => group.result ?? [])
      .slice(0, limit)

    return NextResponse.json({ tokens })
  } catch (err) {
    console.error('[API] /api/birdeye/search error:', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

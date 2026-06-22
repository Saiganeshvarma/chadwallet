import { NextRequest, NextResponse } from 'next/server'
import { getTokenHolders } from '@/lib/birdeye'

/**
 * GET /api/birdeye/holders?address=<tokenAddress>&limit=10
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const limit   = parseInt(searchParams.get('limit') ?? '10', 10)

  if (!address) {
    return NextResponse.json({ error: 'address is required' }, { status: 400 })
  }

  try {
    const { data } = await getTokenHolders(address, limit)
    return NextResponse.json({
      holders: data?.items ?? [],
      total:   data?.total ?? 0,
    })
  } catch (err) {
    console.error('[API] /api/birdeye/holders error:', err)
    return NextResponse.json({ error: 'Failed to fetch holders' }, { status: 500 })
  }
}

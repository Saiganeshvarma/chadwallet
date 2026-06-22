import { NextRequest, NextResponse } from 'next/server'
import { getTokenTrades } from '@/lib/birdeye'

/**
 * GET /api/birdeye/trades?address=<tokenAddress>&limit=20
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const limit   = parseInt(searchParams.get('limit') ?? '20', 10)

  if (!address) {
    return NextResponse.json({ error: 'address is required' }, { status: 400 })
  }

  try {
    const { data } = await getTokenTrades(address, limit)
    const trades = (data?.items ?? []).map((t) => ({
      txHash:    t.txHash ?? t.signature ?? '',
      type:      t.side === 'buy' ? 'buy' : 'sell',
      price:     t.price ?? 0,
      volumeUSD: t.volumeUSD ?? 0,
      wallet:    t.owner ?? '',
      timestamp: t.blockUnixTime,
      source:    t.source ?? '',
    }))
    return NextResponse.json({ trades, total: data?.total ?? 0 })
  } catch (err) {
    console.error('[API] /api/birdeye/trades error:', err)
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 })
  }
}

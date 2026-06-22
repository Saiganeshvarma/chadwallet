import { NextRequest, NextResponse } from 'next/server'
import { getOHLCV } from '@/lib/birdeye'
import type { OHLCVTimeframe } from '@/types/birdeye'

/**
 * GET /api/birdeye/ohlcv
 *   ?address=<tokenAddress>
 *   &type=1H          (timeframe, default 1H)
 *   &from=<unixSecs>  (default: 7 days ago)
 *   &to=<unixSecs>    (default: now)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const type    = (searchParams.get('type') ?? '1H') as OHLCVTimeframe
  const now     = Math.floor(Date.now() / 1000)
  const from    = parseInt(searchParams.get('from') ?? String(now - 7 * 24 * 3600), 10)
  const to      = parseInt(searchParams.get('to')   ?? String(now), 10)

  if (!address) {
    return NextResponse.json({ error: 'address is required' }, { status: 400 })
  }

  try {
    const { data } = await getOHLCV(address, type, from, to)
    const candles = (data?.items ?? []).map((c) => ({
      time:   c.unixTime,
      open:   c.o,
      high:   c.h,
      low:    c.l,
      close:  c.c,
      volume: c.v,
    }))
    return NextResponse.json({ candles, type })
  } catch (err) {
    console.error('[API] /api/birdeye/ohlcv error:', err)
    return NextResponse.json({ error: 'Failed to fetch OHLCV' }, { status: 500 })
  }
}

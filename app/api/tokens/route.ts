import { NextRequest, NextResponse } from 'next/server'
import { getTrendingTokens, getTokenOverview, TOP_TOKENS, KNOWN_TOKENS } from '@/lib/birdeye'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') ?? 'trending'
  const address = searchParams.get('address')

  try {
    if (type === 'overview' && address) {
      const data = await getTokenOverview(address)
      const info = KNOWN_TOKENS[address]
      return NextResponse.json({
        ...data.data,
        symbol: data.data?.symbol ?? info?.symbol,
        name: data.data?.name ?? info?.name,
        logoURI: data.data?.logoURI ?? info?.logoURI,
      })
    }

    if (type === 'trending') {
      const data = await getTrendingTokens()
      const tokens = (data.data?.tokens ?? []).slice(0, 20).map(
        (t, i) => ({
          ...t,
          rank: i + 1,
        })
      )

      // Enrich with known token info if missing
      const enriched = tokens.map((t) => {
        const addr = t.address
        const info = KNOWN_TOKENS[addr]
        return {
          ...t,
          symbol: t.symbol ?? info?.symbol ?? 'UNKNOWN',
          name: t.name ?? info?.name ?? 'Unknown Token',
          logoURI: t.logoURI ?? info?.logoURI ?? '',
        }
      })

      return NextResponse.json({ tokens: enriched })
    }

    if (type === 'top') {
      return NextResponse.json({
        tokens: TOP_TOKENS.map((addr) => ({
          address: addr,
          ...KNOWN_TOKENS[addr],
        })),
      })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Tokens API error:', error)
    return NextResponse.json({ error: 'Failed to fetch token data' }, { status: 500 })
  }
}

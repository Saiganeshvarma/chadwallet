import { NextRequest, NextResponse } from 'next/server'
import { getTrendingTokens, getNewListings, KNOWN_TOKENS } from '@/lib/birdeye'

/**
 * GET /api/birdeye/trending
 *   ?type=trending   (default) → top trending tokens
 *   ?type=new        → newly listed tokens
 *   ?limit=20
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type  = searchParams.get('type') ?? 'trending'
  const limit = parseInt(searchParams.get('limit') ?? '20', 10)

  try {
    if (type === 'new') {
      const { data } = await getNewListings(limit)
      const tokens = (data?.items ?? []).map((t) => {
        const known = KNOWN_TOKENS[t.address]
        return {
          address:    t.address,
          symbol:     t.symbol     ?? known?.symbol  ?? 'UNKNOWN',
          name:       t.name       ?? known?.name    ?? 'Unknown',
          logoURI:    t.logoURI    ?? known?.logoURI ?? '',
          decimals:   t.decimals   ?? 9,
          price:      t.price      ?? 0,
          priceChange24h: 0,
          volume24h:  0,
          liquidity:  t.liquidity  ?? 0,
          marketCap:  t.marketCap  ?? 0,
          listingTime: t.listingTime,
          rank: 0,
        }
      })
      return NextResponse.json({ tokens, total: data?.total ?? tokens.length })
    }

    // default: trending
    const { data } = await getTrendingTokens(limit)
    const tokens = (data?.tokens ?? []).map((t) => {
      const known = KNOWN_TOKENS[t.address]
      return {
        address:    t.address,
        symbol:     t.symbol   ?? known?.symbol  ?? 'UNKNOWN',
        name:       t.name     ?? known?.name    ?? 'Unknown',
        logoURI:    t.logoURI  ?? known?.logoURI ?? '',
        decimals:   t.decimals ?? 9,
        price:      t.price,
        priceChange24h: t.price24hChangePercent ?? 0,
        volume24h:  t.volume24h ?? 0,
        liquidity:  t.liquidity ?? 0,
        marketCap:  t.marketCap ?? 0,
        rank:       t.rank,
      }
    })

    return NextResponse.json({ tokens, total: data?.total ?? tokens.length })
  } catch (err) {
    console.error('[API] /api/birdeye/trending error:', err)
    return NextResponse.json({ error: 'Failed to fetch trending tokens' }, { status: 500 })
  }
}

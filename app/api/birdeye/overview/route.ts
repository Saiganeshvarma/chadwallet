import { NextRequest, NextResponse } from 'next/server'
import { getTokenOverview, KNOWN_TOKENS } from '@/lib/birdeye'
import type { NormalizedToken } from '@/types/birdeye'

/**
 * GET /api/birdeye/overview?address=<tokenAddress>
 * Returns a fully normalised NormalizedToken object.
 */
export async function GET(request: NextRequest) {
  const address = new URL(request.url).searchParams.get('address')
  if (!address) {
    return NextResponse.json({ error: 'address is required' }, { status: 400 })
  }

  try {
    const { data, success } = await getTokenOverview(address)
    const known = KNOWN_TOKENS[address]

    const normalized: NormalizedToken = {
      address,
      symbol:       data?.symbol    ?? known?.symbol  ?? address.slice(0, 6),
      name:         data?.name      ?? known?.name    ?? 'Unknown Token',
      logoURI:      data?.logoURI   ?? known?.logoURI ?? '',
      decimals:     data?.decimals  ?? 9,
      price:        data?.price     ?? 0,
      priceChange24h: data?.priceChange24h  ?? data?.v24hChangePercent  ?? 0,
      priceChange1h:  data?.priceChange1h   ?? 0,
      volume24h:    data?.v24h      ?? 0,
      liquidity:    data?.liquidity ?? 0,
      marketCap:    data?.mc        ?? 0,
      holders:      data?.holder    ?? 0,
      supply:       data?.supply    ?? 0,
      buy24h:       data?.buy24h    ?? 0,
      sell24h:      data?.sell24h   ?? 0,
      txCount24h:   data?.trade24h  ?? 0,
      extensions:   data?.extensions,
    }

    return NextResponse.json({ ...normalized, success })
  } catch (err) {
    console.error('[API] /api/birdeye/overview error:', err)
    return NextResponse.json({ error: 'Failed to fetch token overview' }, { status: 500 })
  }
}

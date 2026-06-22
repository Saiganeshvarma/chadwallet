import { NextRequest, NextResponse } from 'next/server'
import { getTokenPrice, getMultipleTokenPrices, TOP_TOKENS, KNOWN_TOKENS } from '@/lib/birdeye'

// Simple in-memory cache (per serverless invocation)
const cache = new Map<string, { data: unknown; ts: number }>()
const TTL   = 30_000 // 30 s

function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key)
  if (hit && Date.now() - hit.ts < TTL) return Promise.resolve(hit.data as T)
  return fn().then((data) => { cache.set(key, { data, ts: Date.now() }); return data })
}

/**
 * GET /api/birdeye/prices
 *   ?address=<single>          → single price
 *   ?addresses=a,b,c           → multi price
 *   (no params)                → multi price for all TOP_TOKENS
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address   = searchParams.get('address')
  const addresses = searchParams.get('addresses')

  try {
    // ── Single price ──────────────────────────────────────────────────────────
    if (address) {
      const result = await cached(`price:${address}`, () => getTokenPrice(address))
      return NextResponse.json({
        address,
        price: result.data?.value ?? 0,
        priceChange24h: result.data?.priceChange24h ?? 0,
        updatedAt: result.data?.updateUnixTime ?? Date.now() / 1000,
      })
    }

    // ── Multi price ───────────────────────────────────────────────────────────
    const addrs = addresses ? addresses.split(',').filter(Boolean) : TOP_TOKENS
    const key   = `multi:${addrs.join(',')}`
    const result = await cached(key, () => getMultipleTokenPrices(addrs))

    const prices = addrs.map((addr) => {
      const item = result.data?.[addr]
      return {
        address: addr,
        symbol:       KNOWN_TOKENS[addr]?.symbol  ?? 'UNKNOWN',
        name:         KNOWN_TOKENS[addr]?.name    ?? 'Unknown',
        logoURI:      KNOWN_TOKENS[addr]?.logoURI ?? '',
        price:        item?.value          ?? 0,
        priceChange24h: item?.priceChange24h ?? 0,
        updatedAt:    item?.updateUnixTime ?? Date.now() / 1000,
      }
    })

    return NextResponse.json({ prices })
  } catch (err) {
    console.error('[API] /api/birdeye/prices error:', err)
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 })
  }
}

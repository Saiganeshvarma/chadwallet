/**
 * ChadWallet — Birdeye API Service
 *
 * All calls are server-only (no BIRDEYE_API_KEY in the browser).
 * Client components call the Next.js API routes in app/api/birdeye/.
 *
 * Endpoints covered:
 *   GET /defi/price
 *   GET /defi/multi_price
 *   GET /defi/token_overview
 *   GET /defi/v3/search
 *   GET /defi/token_trending
 *   GET /defi/v2/tokens/new_listing
 *   GET /defi/history_price
 *   GET /defi/ohlcv
 *   GET /defi/token_holder
 *   GET /defi/txs/token
 */

import type {
  BirdeyePriceResponse,
  BirdeyeMultiPriceResponse,
  BirdeyeTokenOverviewResponse,
  BirdeyeSearchResponse,
  BirdeyeTrendingResponse,
  BirdeyeNewListingResponse,
  BirdeyePriceHistoryResponse,
  BirdeyeOHLCVResponse,
  BirdeyeHolderResponse,
  BirdeyeTradesResponse,
  OHLCVTimeframe,
} from '@/types/birdeye'

// ─── Config ───────────────────────────────────────────────────────────────────

const BIRDEYE_BASE_URL = 'https://public-api.birdeye.so'
const BIRDEYE_API_KEY  = process.env.BIRDEYE_API_KEY ?? ''

function getHeaders(): HeadersInit {
  return {
    'X-API-KEY': BIRDEYE_API_KEY,
    'Content-Type': 'application/json',
    accept: 'application/json',
    'x-chain': 'solana',
  }
}

// ─── Well-known Solana tokens ─────────────────────────────────────────────────

export const KNOWN_TOKENS: Record<string, { symbol: string; name: string; logoURI: string }> = {
  So11111111111111111111111111111111111111112: {
    symbol: 'SOL',
    name: 'Solana',
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  },
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: {
    symbol: 'BONK',
    name: 'Bonk',
    logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
  },
  JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN: {
    symbol: 'JUP',
    name: 'Jupiter',
    logoURI: 'https://static.jup.ag/jup/icon.png',
  },
  EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm: {
    symbol: 'WIF',
    name: 'dogwifhat',
    logoURI: 'https://bafkreibk3covs5ltyqxa272uodhculbgn2nflcdv3qz4l4jftqphzo4mqe.ipfs.nftstorage.link/',
  },
  HZ1JovNiVvGqNLPHQN5EiDgku7E9B5XHbQKvMrFmkBoj: {
    symbol: 'PYTH',
    name: 'Pyth Network',
    logoURI: 'https://pyth.network/token.svg',
  },
  jtojtomepa8bdaxotmi6aJDEcm9WoJAoNiLiBm3ZeST: {
    symbol: 'JTO',
    name: 'Jito',
    logoURI: 'https://metadata.jito.network/token/jto/image',
  },
}

export const TOP_TOKENS = Object.keys(KNOWN_TOKENS)

// ─── Mock helpers (used when BIRDEYE_API_KEY is not set) ──────────────────────

const MOCK_PRICES: Record<string, number> = {
  So11111111111111111111111111111111111111112: 185.42,
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: 0.0000285,
  JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN: 0.782,
  EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm: 2.14,
  HZ1JovNiVvGqNLPHQN5EiDgku7E9B5XHbQKvMrFmkBoj: 0.312,
  jtojtomepa8bdaxotmi6aJDEcm9WoJAoNiLiBm3ZeST: 3.85,
}
const MOCK_CHANGES: Record<string, number> = {
  So11111111111111111111111111111111111111112: 3.2,
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: -1.8,
  JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN: 12.4,
  EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm: -5.6,
  HZ1JovNiVvGqNLPHQN5EiDgku7E9B5XHbQKvMrFmkBoj: 7.8,
  jtojtomepa8bdaxotmi6aJDEcm9WoJAoNiLiBm3ZeST: 2.1,
}

function mockPrice(address: string): number {
  return MOCK_PRICES[address] ?? 1.0
}

function mockTokenData(address: string) {
  const price  = mockPrice(address)
  const info   = KNOWN_TOKENS[address] ?? { symbol: 'UNK', name: 'Unknown Token', logoURI: '' }
  const change = MOCK_CHANGES[address] ?? 0
  return {
    address,
    decimals: 9,
    symbol: info.symbol,
    name: info.name,
    logoURI: info.logoURI,
    price,
    priceChange24h: change,
    v24hChangePercent: change,
    v24h: price * 1_200_000,
    volume24h: price * 1_200_000,
    liquidity: price * 5_000_000,
    mc: price * 500_000_000,
    holder: 150_000,
    supply: 1_000_000_000,
    trade24h: 12_000,
    buy24h: 6_500,
    sell24h: 5_500,
    priceChange1h: change * 0.2,
    priceChange4h: change * 0.5,
    priceChange7d: change * 3,
  }
}

// ─── Generic fetch with error handling ────────────────────────────────────────

async function birdeyeFetch<T>(
  path: string,
  options: RequestInit & { next?: { revalidate?: number } } = {}
): Promise<T> {
  const url = `${BIRDEYE_BASE_URL}${path}`
  const res = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers ?? {}) },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Birdeye ${path} → ${res.status} ${res.statusText}: ${body}`)
  }
  return res.json() as Promise<T>
}

// ─── GET /defi/price ──────────────────────────────────────────────────────────

export async function getTokenPrice(address: string): Promise<BirdeyePriceResponse> {
  if (!BIRDEYE_API_KEY) {
    const p = mockPrice(address)
    return {
      data: { value: p, updateUnixTime: Date.now() / 1000, updateHumanTime: '', priceChange24h: MOCK_CHANGES[address] ?? 0 },
      success: true,
    }
  }
  try {
    return await birdeyeFetch<BirdeyePriceResponse>(`/defi/price?address=${address}`, {
      next: { revalidate: 30 },
    })
  } catch (err) {
    console.error('[Birdeye] getTokenPrice error:', err)
    const p = mockPrice(address)
    return {
      data: { value: p, updateUnixTime: Date.now() / 1000, updateHumanTime: '', priceChange24h: 0 },
      success: false,
    }
  }
}

// ─── GET /defi/multi_price ────────────────────────────────────────────────────

export async function getMultipleTokenPrices(addresses: string[]): Promise<BirdeyeMultiPriceResponse> {
  if (!BIRDEYE_API_KEY) {
    const data: BirdeyeMultiPriceResponse['data'] = {}
    addresses.forEach((addr) => {
      data[addr] = {
        value: mockPrice(addr),
        updateUnixTime: Date.now() / 1000,
        updateHumanTime: '',
        priceChange24h: MOCK_CHANGES[addr] ?? 0,
      }
    })
    return { data, success: true }
  }
  try {
    return await birdeyeFetch<BirdeyeMultiPriceResponse>(
      `/defi/multi_price?list_address=${addresses.join(',')}`,
      { next: { revalidate: 30 } }
    )
  } catch (err) {
    console.error('[Birdeye] getMultipleTokenPrices error:', err)
    const data: BirdeyeMultiPriceResponse['data'] = {}
    addresses.forEach((addr) => {
      data[addr] = { value: mockPrice(addr), updateUnixTime: Date.now() / 1000, updateHumanTime: '', priceChange24h: 0 }
    })
    return { data, success: false }
  }
}

// ─── GET /defi/token_overview ─────────────────────────────────────────────────

export async function getTokenOverview(address: string): Promise<BirdeyeTokenOverviewResponse> {
  if (!BIRDEYE_API_KEY) {
    return { data: mockTokenData(address) as BirdeyeTokenOverviewResponse['data'], success: true }
  }
  try {
    return await birdeyeFetch<BirdeyeTokenOverviewResponse>(
      `/defi/token_overview?address=${address}`,
      { next: { revalidate: 60 } }
    )
  } catch (err) {
    console.error('[Birdeye] getTokenOverview error:', err)
    return { data: mockTokenData(address) as BirdeyeTokenOverviewResponse['data'], success: false }
  }
}

// ─── GET /defi/v3/search ──────────────────────────────────────────────────────

export async function searchTokens(
  query: string,
  limit = 20
): Promise<BirdeyeSearchResponse> {
  if (!BIRDEYE_API_KEY) {
    const filtered = TOP_TOKENS
      .filter((addr) => {
        const t = KNOWN_TOKENS[addr]
        return (
          t.symbol.toLowerCase().includes(query.toLowerCase()) ||
          t.name.toLowerCase().includes(query.toLowerCase())
        )
      })
      .slice(0, limit)
      .map((addr) => ({
        address: addr,
        decimals: 9,
        ...KNOWN_TOKENS[addr],
        price: mockPrice(addr),
        priceChange24h: MOCK_CHANGES[addr] ?? 0,
        volume24h: mockPrice(addr) * 1_200_000,
        marketCap: mockPrice(addr) * 500_000_000,
        liquidity: mockPrice(addr) * 5_000_000,
      }))
    return {
      data: { items: [{ type: 'token', result: filtered }] },
      success: true,
    }
  }
  try {
    const params = new URLSearchParams({
      keyword: query,
      target: 'token',
      sort_by: 'volume_24h_usd',
      sort_type: 'desc',
      offset: '0',
      limit: String(limit),
    })
    return await birdeyeFetch<BirdeyeSearchResponse>(`/defi/v3/search?${params}`)
  } catch (err) {
    console.error('[Birdeye] searchTokens error:', err)
    return { data: { items: [] }, success: false }
  }
}

// ─── GET /defi/token_trending ─────────────────────────────────────────────────

export async function getTrendingTokens(limit = 20): Promise<BirdeyeTrendingResponse> {
  if (!BIRDEYE_API_KEY) {
    const tokens = TOP_TOKENS.map((addr, i) => ({
      ...mockTokenData(addr),
      decimals: 9,
      volume24h: mockPrice(addr) * 1_200_000,
      price24hChangePercent: MOCK_CHANGES[addr] ?? 0,
      rank: i + 1,
    }))
    return { data: { updateUnixTime: Date.now() / 1000, updateTime: '', tokens, total: tokens.length }, success: true }
  }
  try {
    const params = new URLSearchParams({
      sort_by: 'rank',
      sort_type: 'asc',
      offset: '0',
      limit: String(limit),
    })
    return await birdeyeFetch<BirdeyeTrendingResponse>(
      `/defi/token_trending?${params}`,
      { next: { revalidate: 120 } }
    )
  } catch (err) {
    console.error('[Birdeye] getTrendingTokens error:', err)
    const tokens = TOP_TOKENS.map((addr, i) => ({
      ...mockTokenData(addr),
      decimals: 9,
      volume24h: mockPrice(addr) * 1_200_000,
      price24hChangePercent: MOCK_CHANGES[addr] ?? 0,
      rank: i + 1,
    }))
    return { data: { updateUnixTime: Date.now() / 1000, updateTime: '', tokens, total: tokens.length }, success: false }
  }
}

// ─── GET /defi/v2/tokens/new_listing ─────────────────────────────────────────

export async function getNewListings(limit = 20): Promise<BirdeyeNewListingResponse> {
  if (!BIRDEYE_API_KEY) {
    const items = TOP_TOKENS.slice(0, 4).map((addr, i) => ({
      address: addr,
      symbol: KNOWN_TOKENS[addr].symbol,
      name: KNOWN_TOKENS[addr].name,
      decimals: 9,
      logoURI: KNOWN_TOKENS[addr].logoURI,
      listingTime: Math.floor(Date.now() / 1000) - i * 3600,
      price: mockPrice(addr),
      liquidity: mockPrice(addr) * 5_000_000,
      marketCap: mockPrice(addr) * 500_000_000,
    }))
    return { data: { items, total: items.length }, success: true }
  }
  try {
    const params = new URLSearchParams({
      sort_by: 'listing_time',
      sort_type: 'desc',
      offset: '0',
      limit: String(limit),
    })
    return await birdeyeFetch<BirdeyeNewListingResponse>(
      `/defi/v2/tokens/new_listing?${params}`,
      { next: { revalidate: 60 } }
    )
  } catch (err) {
    console.error('[Birdeye] getNewListings error:', err)
    return { data: { items: [], total: 0 }, success: false }
  }
}

// ─── GET /defi/history_price ──────────────────────────────────────────────────

export async function getPriceHistory(
  address: string,
  addressType: 'token' | 'pair' = 'token',
  type: OHLCVTimeframe = '1D',
  timeFrom: number = Math.floor(Date.now() / 1000) - 30 * 24 * 3600,
  timeTo: number = Math.floor(Date.now() / 1000)
): Promise<BirdeyePriceHistoryResponse> {
  if (!BIRDEYE_API_KEY) {
    const basePrice = mockPrice(address)
    const items = Array.from({ length: 30 }, (_, i) => ({
      unixTime: timeFrom + i * Math.floor((timeTo - timeFrom) / 30),
      value: basePrice * (0.85 + Math.random() * 0.3),
    }))
    return { data: { items }, success: true }
  }
  try {
    const params = new URLSearchParams({
      address,
      address_type: addressType,
      type,
      time_from: String(timeFrom),
      time_to: String(timeTo),
    })
    return await birdeyeFetch<BirdeyePriceHistoryResponse>(`/defi/history_price?${params}`)
  } catch (err) {
    console.error('[Birdeye] getPriceHistory error:', err)
    return { data: { items: [] }, success: false }
  }
}

// ─── GET /defi/ohlcv ──────────────────────────────────────────────────────────

export async function getOHLCV(
  address: string,
  type: OHLCVTimeframe = '1H',
  timeFrom: number = Math.floor(Date.now() / 1000) - 7 * 24 * 3600,
  timeTo: number = Math.floor(Date.now() / 1000)
): Promise<BirdeyeOHLCVResponse> {
  if (!BIRDEYE_API_KEY) {
    const basePrice = mockPrice(address)
    const count = 48
    const step = Math.floor((timeTo - timeFrom) / count)
    const items = Array.from({ length: count }, (_, i) => {
      const o = basePrice * (0.9 + Math.random() * 0.2)
      const c = basePrice * (0.9 + Math.random() * 0.2)
      return {
        unixTime: timeFrom + i * step,
        o,
        h: Math.max(o, c) * (1 + Math.random() * 0.05),
        l: Math.min(o, c) * (1 - Math.random() * 0.05),
        c,
        v: basePrice * (Math.random() * 1_000_000 + 100_000),
        type,
      }
    })
    return { data: { items }, success: true }
  }
  try {
    const params = new URLSearchParams({
      address,
      type,
      time_from: String(timeFrom),
      time_to: String(timeTo),
    })
    return await birdeyeFetch<BirdeyeOHLCVResponse>(`/defi/ohlcv?${params}`)
  } catch (err) {
    console.error('[Birdeye] getOHLCV error:', err)
    return { data: { items: [] }, success: false }
  }
}

// ─── GET /defi/token_holder ───────────────────────────────────────────────────

export async function getTokenHolders(address: string, limit = 10): Promise<BirdeyeHolderResponse> {
  if (!BIRDEYE_API_KEY) {
    const items = Array.from({ length: limit }, (_, i) => ({
      owner: `${Math.random().toString(36).slice(2, 8)}...${Math.random().toString(36).slice(2, 6)}`,
      amount: Math.floor(1_000_000 * (limit - i) * Math.random()),
      percentage: Math.max(0.1, (20 - i * 1.5) * Math.random()),
      rank: i + 1,
    }))
    return { data: { items, total: 50_000 }, success: true }
  }
  try {
    const params = new URLSearchParams({
      address,
      offset: '0',
      limit: String(limit),
    })
    return await birdeyeFetch<BirdeyeHolderResponse>(`/defi/token_holder?${params}`, {
      next: { revalidate: 120 },
    })
  } catch (err) {
    console.error('[Birdeye] getTokenHolders error:', err)
    return { data: { items: [], total: 0 }, success: false }
  }
}

// ─── GET /defi/txs/token ──────────────────────────────────────────────────────

export async function getTokenTrades(address: string, limit = 20): Promise<BirdeyeTradesResponse> {
  if (!BIRDEYE_API_KEY) {
    const symbol = KNOWN_TOKENS[address]?.symbol ?? 'TOKEN'
    const price  = mockPrice(address)
    const items = Array.from({ length: limit }, (_, i) => ({
      txHash: Math.random().toString(36).slice(2, 12),
      signature: Math.random().toString(36).slice(2, 12),
      blockUnixTime: Math.floor(Date.now() / 1000) - i * 45,
      side: (Math.random() > 0.5 ? 'buy' : 'sell') as 'buy' | 'sell',
      price,
      volumeUSD: Math.random() * 50_000 + 100,
      from: { address: 'So111...', amount: Math.random() * 10, symbol: 'SOL' },
      to:   { address, amount: Math.random() * 10_000, symbol },
      owner: `${Math.random().toString(36).slice(2, 6)}...${Math.random().toString(36).slice(2, 6)}`,
      source: 'raydium',
    }))
    return { data: { items, total: 10_000 }, success: true }
  }
  try {
    const params = new URLSearchParams({
      address,
      offset: '0',
      limit: String(limit),
      tx_type: 'swap',
    })
    return await birdeyeFetch<BirdeyeTradesResponse>(`/defi/txs/token?${params}`)
  } catch (err) {
    console.error('[Birdeye] getTokenTrades error:', err)
    return { data: { items: [], total: 0 }, success: false }
  }
}

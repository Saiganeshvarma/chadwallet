// ─── Birdeye API Response Types ───────────────────────────────────────────────

// GET /defi/price
export interface BirdeyePriceResponse {
  data: {
    value: number
    updateUnixTime: number
    updateHumanTime: string
    priceChange24h: number
  }
  success: boolean
}

// GET /defi/multi_price
export interface BirdeyeMultiPriceItem {
  value: number
  updateUnixTime: number
  updateHumanTime: string
  priceChange24h: number
}
export interface BirdeyeMultiPriceResponse {
  data: Record<string, BirdeyeMultiPriceItem>
  success: boolean
}

// GET /defi/token_overview
export interface BirdeyeTokenOverview {
  address: string
  decimals: number
  symbol: string
  name: string
  logoURI?: string
  extensions?: {
    website?: string
    twitter?: string
    telegram?: string
    discord?: string
    description?: string
    coingeckoId?: string
  }
  mc?: number           // market cap
  fdv?: number          // fully diluted valuation
  supply?: number
  holder?: number
  price?: number
  v24h?: number         // volume 24h USD
  v24hChangePercent?: number
  v1h?: number
  v2h?: number
  v4h?: number
  v6h?: number
  v8h?: number
  v12h?: number
  v7d?: number
  v30d?: number
  liquidity?: number
  trade24h?: number
  trade24hChangePercent?: number
  buy24h?: number
  sell24h?: number
  priceChange1h?: number
  priceChange4h?: number
  priceChange12h?: number
  priceChange24h?: number
}
export interface BirdeyeTokenOverviewResponse {
  data: BirdeyeTokenOverview
  success: boolean
}

// GET /defi/v3/search
export interface BirdeyeSearchToken {
  address: string
  decimals: number
  symbol: string
  name: string
  logoURI?: string
  price?: number
  priceChange24h?: number
  volume24h?: number
  marketCap?: number
  liquidity?: number
}
export interface BirdeyeSearchResponse {
  data: {
    items: {
      type: string
      result: BirdeyeSearchToken[]
    }[]
  }
  success: boolean
}

// GET /defi/token_trending
export interface BirdeyeTrendingToken {
  address: string
  decimals: number
  symbol: string
  name: string
  logoURI?: string
  price: number
  price24hChangePercent: number
  volume24h: number
  marketCap?: number
  liquidity?: number
  rank: number
}
export interface BirdeyeTrendingResponse {
  data: {
    updateUnixTime: number
    updateTime: string
    tokens: BirdeyeTrendingToken[]
    total: number
  }
  success: boolean
}

// GET /defi/v2/tokens/new_listing
export interface BirdeyeNewListingToken {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  listingTime: number
  price?: number
  liquidity?: number
  marketCap?: number
}
export interface BirdeyeNewListingResponse {
  data: {
    items: BirdeyeNewListingToken[]
    total: number
  }
  success: boolean
}

// GET /defi/history_price
export interface BirdeyePriceHistoryItem {
  unixTime: number
  value: number
}
export interface BirdeyePriceHistoryResponse {
  data: {
    items: BirdeyePriceHistoryItem[]
  }
  success: boolean
}

// GET /defi/ohlcv
export interface BirdeyeOHLCVItem {
  unixTime: number
  o: number   // open
  h: number   // high
  l: number   // low
  c: number   // close
  v: number   // volume
  type: string
}
export interface BirdeyeOHLCVResponse {
  data: {
    items: BirdeyeOHLCVItem[]
  }
  success: boolean
}

// GET /defi/token_holder
export interface BirdeyeHolderItem {
  owner: string
  amount: number
  percentage: number
  rank: number
}
export interface BirdeyeHolderResponse {
  data: {
    items: BirdeyeHolderItem[]
    total: number
  }
  success: boolean
}

// GET /defi/txs/token (live trades)
export interface BirdeyeTradeItem {
  txHash?: string
  signature?: string
  blockUnixTime: number
  side: 'buy' | 'sell'
  price: number
  volumeUSD: number
  from: { address: string; amount: number; symbol: string }
  to: { address: string; amount: number; symbol: string }
  owner: string
  source: string
}
export interface BirdeyeTradesResponse {
  data: {
    items: BirdeyeTradeItem[]
    total: number
  }
  success: boolean
}

// ─── Normalised app-level types (used by hooks and components) ─────────────────

export type OHLCVTimeframe = '1m' | '3m' | '5m' | '15m' | '30m' | '1H' | '2H' | '4H' | '6H' | '8H' | '12H' | '1D' | '3D' | '1W' | '1M'

export interface NormalizedOHLCV {
  time: number   // unix seconds
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface NormalizedToken {
  address: string
  symbol: string
  name: string
  logoURI: string
  decimals: number
  price: number
  priceChange24h: number
  priceChange1h: number
  volume24h: number
  liquidity: number
  marketCap: number
  holders: number
  supply: number
  buy24h: number
  sell24h: number
  txCount24h: number
  extensions?: BirdeyeTokenOverview['extensions']
}

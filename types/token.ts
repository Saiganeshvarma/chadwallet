export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  price: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
  holders?: number
  isTrending?: boolean
}

export interface TokenPrice {
  address: string
  price: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
  updatedAt: number
}

export interface TokenHolder {
  wallet: string
  amount: number
  percentage: number
  rank: number
}

export interface LiveTrade {
  id: string
  type: 'buy' | 'sell'
  tokenIn: string
  tokenOut: string
  amountIn: number
  amountOut: number
  wallet: string
  timestamp: number
  txHash: string
}

export interface TokenStats {
  price: number
  priceChange1h: number
  priceChange24h: number
  priceChange7d: number
  volume1h: number
  volume24h: number
  volume7d: number
  liquidity: number
  marketCap: number
  supply: number
  holders: number
  txCount24h: number
}

export interface AIInsight {
  id: string
  token: string
  summary: string
  riskScore: number
  trend: 'bullish' | 'bearish' | 'neutral'
  sentiment: 'positive' | 'negative' | 'neutral'
  volumeAnalysis: string
  holderAnalysis: string
  whaleActivity: boolean
  tags: string[]
  createdAt: string
}

export interface TrendingToken {
  address: string
  symbol: string
  name: string
  logoURI?: string
  price: number
  priceChange24h: number
  volume24h: number
  rank: number
}

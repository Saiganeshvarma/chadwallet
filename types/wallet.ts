export interface Wallet {
  id: string
  userId: string
  address: string
  balance: number
  createdAt: string
}

export interface WalletBalance {
  sol: number
  tokens: TokenBalance[]
  totalUsdValue: number
}

export interface TokenBalance {
  mint: string
  symbol: string
  name: string
  amount: number
  decimals: number
  usdValue: number
  logoURI?: string
  price: number
  priceChange24h: number
}

export interface Transaction {
  id: string
  userId: string
  token: string
  amount: number
  type: 'buy' | 'sell' | 'transfer'
  timestamp: string
  txHash?: string
  status: 'pending' | 'confirmed' | 'failed'
}

export interface SwapQuote {
  inputMint: string
  outputMint: string
  inAmount: number
  outAmount: number
  priceImpactPct: number
  routePlan: RoutePlan[]
  swapMode: string
  slippageBps: number
  otherAmountThreshold: number
  contextSlot: number
  timeTaken: number
}

export interface RoutePlan {
  swapInfo: {
    ammKey: string
    label: string
    inputMint: string
    outputMint: string
    inAmount: number
    outAmount: number
    feeAmount: number
    feeMint: string
  }
  percent: number
}

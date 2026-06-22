const JUPITER_API_URL = process.env.NEXT_PUBLIC_JUPITER_API_URL || 'https://quote-api.jup.ag'

export interface QuoteParams {
  inputMint: string
  outputMint: string
  amount: number
  slippageBps?: number
  swapMode?: 'ExactIn' | 'ExactOut'
}

export interface QuoteResponse {
  inputMint: string
  inAmount: string
  outputMint: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: string
  slippageBps: number
  platformFee: null
  priceImpactPct: string
  routePlan: Array<{
    swapInfo: {
      ammKey: string
      label: string
      inputMint: string
      outputMint: string
      inAmount: string
      outAmount: string
      feeAmount: string
      feeMint: string
    }
    percent: number
  }>
  contextSlot: number
  timeTaken: number
}

export async function getQuote(params: QuoteParams): Promise<QuoteResponse | null> {
  try {
    const queryParams = new URLSearchParams({
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: params.amount.toString(),
      slippageBps: (params.slippageBps ?? 50).toString(),
      swapMode: params.swapMode ?? 'ExactIn',
    })

    const res = await fetch(`${JUPITER_API_URL}/v6/quote?${queryParams}`)
    if (!res.ok) throw new Error(`Jupiter API error: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('Jupiter getQuote error:', err)
    return null
  }
}

export async function getSwapTransaction(
  quoteResponse: QuoteResponse,
  userPublicKey: string
) {
  try {
    const res = await fetch(`${JUPITER_API_URL}/v6/swap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey,
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: 'auto',
      }),
    })
    if (!res.ok) throw new Error(`Jupiter swap error: ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('Jupiter getSwapTransaction error:', err)
    return null
  }
}

// Token addresses
export const SOL_MINT = 'So11111111111111111111111111111111111111112'
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

export function lamportsToSol(lamports: number): number {
  return lamports / 1e9
}

export function solToLamports(sol: number): number {
  return Math.floor(sol * 1e9)
}

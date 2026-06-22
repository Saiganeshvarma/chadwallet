import { NextRequest, NextResponse } from 'next/server'
import { getSolBalance, getTokenAccounts } from '@/lib/solana'
import { getMultipleTokenPrices, KNOWN_TOKENS } from '@/lib/birdeye'

/**
 * GET /api/wallet?address=<walletAddress>
 *
 * Returns SOL balance + SPL token balances with live USD prices.
 * Uses Alchemy RPC for on-chain data and BirdEye for prices.
 */
export async function GET(request: NextRequest) {
  const address = new URL(request.url).searchParams.get('address')
  if (!address) {
    return NextResponse.json({ error: 'address is required' }, { status: 400 })
  }

  try {
    // Fetch SOL balance and SPL token accounts in parallel
    const [solBalance, tokenAccounts] = await Promise.all([
      getSolBalance(address),
      getTokenAccounts(address),
    ])

    // Build list of token mints with non-zero balances
    const holdings: Array<{ mint: string; amount: number; decimals: number }> = []

    for (const acct of tokenAccounts) {
      const parsed = acct.account.data.parsed?.info
      if (!parsed) continue
      const mint = parsed.mint as string
      const decimals = (parsed.tokenAmount?.decimals as number) ?? 9
      const uiAmount = (parsed.tokenAmount?.uiAmount as number) ?? 0
      if (uiAmount > 0) {
        holdings.push({ mint, amount: uiAmount, decimals })
      }
    }

    // Fetch prices for all held tokens + SOL in one call
    const SOL_MINT = 'So11111111111111111111111111111111111111112'
    const allMints = [SOL_MINT, ...holdings.map((h) => h.mint)]
    const priceRes = await getMultipleTokenPrices(allMints)

    const solPrice = priceRes.data?.[SOL_MINT]?.value ?? 0
    const solUsdValue = solBalance * solPrice
    const solChange = priceRes.data?.[SOL_MINT]?.priceChange24h ?? 0

    // Build portfolio items — include SOL first, then known SPL tokens
    const portfolio = [
      {
        mint: SOL_MINT,
        symbol: 'SOL',
        name: 'Solana',
        logoURI: KNOWN_TOKENS[SOL_MINT]?.logoURI ?? '',
        amount: solBalance,
        decimals: 9,
        price: solPrice,
        usdValue: solUsdValue,
        priceChange24h: solChange,
      },
      ...holdings
        .filter((h) => {
          // Only include tokens where we have a price or they're well-known
          const price = priceRes.data?.[h.mint]?.value ?? 0
          const known = KNOWN_TOKENS[h.mint]
          return price > 0 || known
        })
        .map((h) => {
          const priceItem = priceRes.data?.[h.mint]
          const price = priceItem?.value ?? 0
          const known = KNOWN_TOKENS[h.mint]
          return {
            mint: h.mint,
            symbol: known?.symbol ?? h.mint.slice(0, 6),
            name: known?.name ?? 'Unknown Token',
            logoURI: known?.logoURI ?? '',
            amount: h.amount,
            decimals: h.decimals,
            price,
            usdValue: h.amount * price,
            priceChange24h: priceItem?.priceChange24h ?? 0,
          }
        })
        .sort((a, b) => b.usdValue - a.usdValue),
    ].filter((item) => item.usdValue > 0 || item.symbol === 'SOL')

    const totalUsdValue = portfolio.reduce((sum, item) => sum + item.usdValue, 0)

    // Add allocation percentages
    const portfolioWithPct = portfolio.map((item) => ({
      ...item,
      percentage: totalUsdValue > 0 ? (item.usdValue / totalUsdValue) * 100 : 0,
    }))

    return NextResponse.json({
      address,
      solBalance,
      solPrice,
      totalUsdValue,
      portfolio: portfolioWithPct,
    })
  } catch (err) {
    console.error('[API] /api/wallet error:', err)
    return NextResponse.json({ error: 'Failed to fetch wallet data' }, { status: 500 })
  }
}

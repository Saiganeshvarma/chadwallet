import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder',
})

export interface TokenAnalysisInput {
  symbol: string
  name: string
  price: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
  holders?: number
  topHolderConcentration?: number
}

export interface TokenAnalysisResult {
  summary: string
  riskScore: number
  trend: 'bullish' | 'bearish' | 'neutral'
  sentiment: 'positive' | 'negative' | 'neutral'
  volumeAnalysis: string
  holderAnalysis: string
  whaleActivity: boolean
  tags: string[]
}

export async function analyzeToken(data: TokenAnalysisInput): Promise<TokenAnalysisResult> {
  const prompt = `You are an expert crypto analyst. Analyze the following Solana token data and provide a detailed analysis.

Token: ${data.name} (${data.symbol})
Price: $${data.price.toFixed(6)}
24h Price Change: ${data.priceChange24h.toFixed(2)}%
24h Volume: $${(data.volume24h / 1e6).toFixed(2)}M
Liquidity: $${(data.liquidity / 1e6).toFixed(2)}M
Market Cap: $${(data.marketCap / 1e6).toFixed(2)}M
Holders: ${data.holders?.toLocaleString() ?? 'Unknown'}
Top Holder Concentration: ${data.topHolderConcentration?.toFixed(1) ?? 'Unknown'}%

Respond with a JSON object containing:
{
  "summary": "2-3 sentence market summary",
  "riskScore": <number 1-10, 10 being highest risk>,
  "trend": "<bullish|bearish|neutral>",
  "sentiment": "<positive|negative|neutral>",
  "volumeAnalysis": "1-2 sentence volume analysis",
  "holderAnalysis": "1-2 sentence holder distribution analysis",
  "whaleActivity": <true|false>,
  "tags": ["tag1", "tag2", ...]
}

Tags can include: "trending", "high-volume", "whale-accumulation", "retail-driven", "bearish-divergence", "momentum", "oversold", "overbought", "high-risk", "low-liquidity"`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional crypto market analyst specializing in Solana tokens. Always respond with valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 600,
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from AI')

    return JSON.parse(content) as TokenAnalysisResult
  } catch (err) {
    console.error('AI analyzeToken error:', err)
    // Return mock analysis for demo
    return getMockAnalysis(data)
  }
}

export async function chatWithAI(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  context?: string
): Promise<string> {
  const systemPrompt = `You are ChadWallet's AI assistant — a knowledgeable, friendly crypto analyst specializing in Solana. 
You provide data-driven insights about tokens, market trends, and trading strategies. 
Keep responses concise (2-4 sentences) and actionable. Use emojis sparingly for emphasis.
${context ? `Current market context: ${context}` : ''}`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 300,
      temperature: 0.8,
    })

    return response.choices[0]?.message?.content ?? getMockChatResponse(messages[messages.length - 1]?.content ?? '')
  } catch (err) {
    console.error('AI chat error:', err)
    return getMockChatResponse(messages[messages.length - 1]?.content ?? '')
  }
}

function getMockAnalysis(data: TokenAnalysisInput): TokenAnalysisResult {
  const isPositive = data.priceChange24h > 0
  const isHighVolume = data.volume24h > data.marketCap * 0.1
  const riskScore = Math.min(10, Math.max(1, 5 + (data.priceChange24h > 0 ? -1 : 1) + (isHighVolume ? -1 : 1)))

  return {
    summary: `${data.name} is showing ${isPositive ? 'positive' : 'negative'} momentum with a ${Math.abs(data.priceChange24h).toFixed(2)}% ${isPositive ? 'gain' : 'loss'} in the last 24 hours. ${isHighVolume ? 'Trading volume is elevated, indicating strong market interest.' : 'Volume remains moderate as the market consolidates.'}`,
    riskScore,
    trend: data.priceChange24h > 5 ? 'bullish' : data.priceChange24h < -5 ? 'bearish' : 'neutral',
    sentiment: isPositive ? 'positive' : 'negative',
    volumeAnalysis: isHighVolume
      ? `Volume is ${((data.volume24h / data.marketCap) * 100).toFixed(1)}% of market cap, suggesting active trading and strong liquidity.`
      : 'Volume is within normal ranges. Watch for breakout signals with increased volume.',
    holderAnalysis: data.holders && data.holders > 10000
      ? `Strong holder base with ${data.holders.toLocaleString()} wallets. Distribution appears healthy.`
      : 'Holder count is relatively low, indicating early-stage adoption or potential concentration risk.',
    whaleActivity: data.priceChange24h > 10 || data.volume24h > data.marketCap * 0.2,
    tags: [
      isPositive ? 'trending' : 'bearish-pressure',
      isHighVolume ? 'high-volume' : 'low-volume',
      riskScore > 7 ? 'high-risk' : 'moderate-risk',
      data.priceChange24h > 10 ? 'momentum' : '',
    ].filter(Boolean),
  }
}

function getMockChatResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase()
  if (lower.includes('sol') || lower.includes('solana')) {
    return "SOL is the native token of the Solana blockchain. It's currently trading with strong fundamentals — high TPS, growing DeFi ecosystem, and increasing institutional interest. Watch the $180-190 support zone for potential entry points. 📊"
  }
  if (lower.includes('buy') || lower.includes('trade')) {
    return "I can't give financial advice, but based on current market data, look for tokens with high volume relative to market cap and strong holder growth. Always check liquidity depth before entering a position. 🎯"
  }
  if (lower.includes('risk')) {
    return "Risk management is key in crypto. Consider position sizing (never more than 5-10% in a single token), set stop losses, and watch for whale movements. High concentration in top holders is a red flag. ⚠️"
  }
  return "Great question! Based on current Solana market data, the ecosystem is showing resilience. DeFi TVL is growing, NFT volumes are stabilizing, and developer activity remains strong. Always DYOR before making any trading decisions. 🚀"
}

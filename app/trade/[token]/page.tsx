import { Navbar } from '@/components/Navbar'
import { TradePageClient } from '@/components/TradePageClient'
import { AIChat } from '@/components/AIChat'

interface TradePageProps {
  params: Promise<{ token: string }>
}

export default async function TradePage({ params }: TradePageProps) {
  const { token } = await params

  return (
    <main className="min-h-screen bg-[#050510]">
      <Navbar />
      <div className="pt-16">
        <TradePageClient tokenAddress={token} />
      </div>
      <AIChat />
    </main>
  )
}

export async function generateMetadata({ params }: TradePageProps) {
  const { token } = await params
  return {
    title: `Trade ${token.slice(0, 8)}... — ChadWallet`,
    description: `Trade and analyze Solana token ${token} with AI-powered insights`,
  }
}

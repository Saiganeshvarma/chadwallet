import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ChadWallet — Trade Solana Smarter',
  description:
    'ChadWallet combines real-time crypto data, AI insights, and instant trading for the Solana ecosystem. Discover, analyze, and trade Solana tokens smarter.',
  keywords: ['Solana', 'trading', 'DeFi', 'crypto', 'AI', 'wallet', 'Jupiter', 'tokens'],
  authors: [{ name: 'ChadWallet' }],
  openGraph: {
    title: 'ChadWallet — Trade Solana Smarter',
    description: 'Real-time Solana trading with AI-powered insights',
    type: 'website',
    url: 'https://chadwallet.xyz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChadWallet',
    description: 'Real-time Solana trading with AI-powered insights',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#050510]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

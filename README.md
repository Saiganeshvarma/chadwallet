# ChadWallet 🚀

> The most advanced Solana trading terminal with AI-powered insights.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://typescriptlang.org)
[![Solana](https://img.shields.io/badge/Solana-Mainnet-9945FF?logo=solana)](https://solana.com)

## Overview

ChadWallet is a full-stack Solana trading platform that combines real-time on-chain data, AI-powered token analysis, and Jupiter swap execution into a single premium trading terminal.

**Core Features:**
- Real-time token prices, trending tokens, and market data via BirdEye API
- Live OHLCV charts embedded via TradingView
- Live trade feed with auto-refresh every 15 seconds
- Holder distribution and whale concentration analysis
- AI-powered token analysis and floating chat assistant via OpenAI GPT-4o-mini
- Instant token swaps via Jupiter Aggregator with real quote fetching
- Real wallet portfolio tracking — live SOL + SPL token balances via Alchemy RPC
- Privy authentication (Google, Apple, email)
- Supabase persistence for watchlists, AI insight cache, and user profiles
- Animated token price ticker with 20+ trending tokens
- Token search across the entire Solana ecosystem

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Auth | Privy (Google, Apple, email login) |
| Database | Supabase (PostgreSQL) |
| Blockchain | Solana Web3.js, Alchemy RPC |
| Market Data | BirdEye API |
| Trading | Jupiter Aggregator v6 |
| Charts | TradingView Widget |
| AI | OpenAI GPT-4o-mini |
| Deployment | Vercel |

---

## Project Structure

```
chadwallet/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout + metadata
│   ├── globals.css                 # Global styles, glassmorphism
│   ├── providers.tsx               # App providers (Privy, AuthContext)
│   ├── login/
│   │   └── page.tsx                # Login page
│   ├── trade/
│   │   └── [token]/
│   │       └── page.tsx            # Token trade page (dynamic route)
│   ├── debug/
│   │   └── auth/
│   │       └── page.tsx            # Auth debug page
│   └── api/
│       ├── tokens/route.ts         # Token data (trending, overview, top)
│       ├── prices/route.ts         # Price data with 30s in-memory cache
│       ├── wallet/route.ts         # Live SOL + SPL token portfolio
│       ├── birdeye/
│       │   ├── trending/route.ts   # Trending & new listing tokens
│       │   ├── prices/route.ts     # Single & multi token prices
│       │   ├── overview/route.ts   # Full token overview (NormalizedToken)
│       │   ├── ohlcv/route.ts      # OHLCV candle data
│       │   ├── trades/route.ts     # Live trade feed
│       │   ├── holders/route.ts    # Top token holders
│       │   └── search/route.ts     # Token search
│       └── ai/
│           ├── analyze/route.ts    # AI token analysis (cached in Supabase)
│           └── chat/route.ts       # Streaming AI chat endpoint
├── components/
│   ├── Navbar.tsx                  # Sticky nav with auth controls
│   ├── Hero.tsx                    # Landing hero section
│   ├── TokenTicker.tsx             # Animated price ticker (20+ tokens)
│   ├── TokenCard.tsx               # Token display card
│   ├── TrendingSection.tsx         # Landing trending grid (live BirdEye data)
│   ├── AIInsightsSection.tsx       # Landing AI insights section
│   ├── AppDownloadSection.tsx      # App download CTA
│   ├── TradePageClient.tsx         # Main trade page layout + data orchestrator
│   ├── TradingChart.tsx            # TradingView chart embed
│   ├── MarketStats.tsx             # Token market statistics grid
│   ├── HolderList.tsx              # Token holder distribution
│   ├── LiveTrades.tsx              # Live trade feed (15s auto-refresh)
│   ├── BuySellPanel.tsx            # Jupiter swap interface with real quotes
│   ├── AIInsightCard.tsx           # AI analysis display card
│   ├── AIChat.tsx                  # Floating AI chat assistant
│   ├── TrendingSidebar.tsx         # Left sidebar with live markets
│   ├── PortfolioPanel.tsx          # Real wallet portfolio (Alchemy RPC)
│   ├── WalletButton.tsx            # Connect wallet dropdown (Privy)
│   ├── MarketStats.tsx             # Token stats display
│   └── auth/
│       ├── GoogleLoginButton.tsx   # Google OAuth button
│       ├── AppleLoginButton.tsx    # Apple OAuth button
│       ├── LoginModal.tsx          # Auth modal
│       ├── LogoutButton.tsx        # Logout button
│       ├── OAuthIcons.tsx          # OAuth provider icons
│       ├── ProtectedRoute.tsx      # Auth guard component
│       └── UserProfileMenu.tsx     # Avatar + profile dropdown
├── context/
│   └── AuthContext.tsx             # Privy-backed auth context + hooks
├── lib/
│   ├── auth.ts                     # Privy → AuthUser mapping, Supabase sync
│   ├── birdeye.ts                  # BirdEye API client (all endpoints)
│   ├── jupiter.ts                  # Jupiter v6 quote + swap transaction
│   ├── solana.ts                   # Solana Web3.js helpers (balance, accounts)
│   ├── supabase.ts                 # Typed Supabase client
│   ├── ai.ts                       # OpenAI GPT-4o-mini integration
│   └── utils.ts                    # formatPrice, formatVolume, formatPercent, etc.
├── types/
│   ├── token.ts                    # Token, TokenStats, LiveTrade, AIInsight, etc.
│   ├── birdeye.ts                  # BirdEye API response types + NormalizedToken
│   ├── wallet.ts                   # Wallet, TokenBalance, SwapQuote types
│   ├── user.ts                     # User, UserProfile, WatchlistItem types
│   └── auth.ts                     # AuthUser, AuthContextValue types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema (users, watchlists, ai_insights)
└── .env.example                    # Environment variable template
```

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/your-org/chadwallet.git
cd chadwallet
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in your keys in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id

# Market Data
BIRDEYE_API_KEY=your-birdeye-api-key

# Solana RPC
ALCHEMY_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/your-key

# AI
OPENAI_API_KEY=your-openai-key

# Jupiter (default works without a key)
NEXT_PUBLIC_JUPITER_API_URL=https://quote-api.jup.ag
```

### 3. Set up the database

Run the SQL in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL Editor.

### 4. Start development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Keys Setup

### BirdEye API
Powers all market data: prices, trending tokens, OHLCV candles, trade feed, holder list, token search.
1. Go to [birdeye.so/developer](https://birdeye.so/developer)
2. Create an account and generate an API key
3. Add to `BIRDEYE_API_KEY`

### Alchemy RPC
Powers real wallet portfolio fetching (SOL balance + SPL token accounts).
1. Go to [alchemy.com](https://alchemy.com)
2. Create a Solana Mainnet app
3. Copy the RPC URL to `ALCHEMY_SOLANA_RPC_URL`

Without this key the app falls back to the public Solana RPC (`api.mainnet-beta.solana.com`), which is rate-limited.

### Privy Authentication
Handles Google, Apple, and email login. Also provides the connected Solana wallet address used for portfolio and swap execution.
1. Go to [privy.io](https://privy.io)
2. Create an app → get App ID
3. Enable Google, Apple, and email login methods in the Privy dashboard
4. Add `NEXT_PUBLIC_PRIVY_APP_ID`

### OpenAI
Powers AI token analysis (cached 30 min in Supabase) and the floating chat assistant.
1. Go to [platform.openai.com](https://platform.openai.com)
2. Generate an API key
3. Add to `OPENAI_API_KEY`

### Supabase
Persists user profiles, watchlists, and AI insight cache.
1. Go to [supabase.com](https://supabase.com)
2. Create a project
3. Run `supabase/migrations/001_initial_schema.sql` in the SQL editor
4. Copy URL and keys to the `NEXT_PUBLIC_SUPABASE_*` variables

---

## API Routes Reference

| Route | Method | Description |
|-------|--------|-------------|
| `/api/birdeye/trending` | GET | Trending tokens (`?type=trending\|new`, `?limit=N`) |
| `/api/birdeye/prices` | GET | Single (`?address=`) or multi (`?addresses=a,b`) prices with 30s cache |
| `/api/birdeye/overview` | GET | Full token overview (`?address=`) → `NormalizedToken` |
| `/api/birdeye/ohlcv` | GET | OHLCV candles (`?address=`, `?type=1H`, `?from=`, `?to=`) |
| `/api/birdeye/trades` | GET | Live trade feed (`?address=`, `?limit=`) |
| `/api/birdeye/holders` | GET | Top token holders (`?address=`, `?limit=`) |
| `/api/birdeye/search` | GET | Token search (`?q=`, `?limit=`) |
| `/api/tokens` | GET | `?type=trending\|overview\|top` — token data aggregator |
| `/api/prices` | GET | Alias for `/api/birdeye/prices` |
| `/api/wallet` | GET | Live SOL + SPL portfolio (`?address=<pubkey>`) via Alchemy + BirdEye |
| `/api/ai/analyze` | POST | AI token analysis (mem cache 5 min → Supabase cache 30 min → OpenAI) |
| `/api/ai/chat` | POST | Streaming AI chat (max 20 messages) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                       ChadWallet                        │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Next.js 16  │  │  API Routes  │  │   Supabase   │  │
│  │   Frontend   │──│  (app/api/)  │──│  PostgreSQL  │  │
│  └──────────────┘  └──────┬───────┘  └──────────────┘  │
│                           │                             │
│         ┌─────────────────┼──────────────┐              │
│         ▼                 ▼              ▼              │
│    ┌─────────┐      ┌─────────┐    ┌─────────┐         │
│    │ BirdEye │      │ OpenAI  │    │ Jupiter │         │
│    │  API    │      │ GPT-4o  │    │  v6 API │         │
│    └─────────┘      └─────────┘    └─────────┘         │
│                                                         │
│    ┌─────────┐  ┌─────────────┐                        │
│    │  Privy  │  │ Alchemy RPC │                        │
│    │  Auth   │  │  (Solana)   │                        │
│    └─────────┘  └─────────────┘                        │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

- **Prices & Market Data** — Client components call Next.js API routes → routes call `lib/birdeye.ts` server-side (API key never exposed to the browser)
- **Wallet Portfolio** — `GET /api/wallet` fetches SOL balance + SPL accounts via Alchemy, then prices via BirdEye multi-price in one request
- **Swaps** — `BuySellPanel` calls Jupiter v6 `/quote` directly from the browser (no API key needed), swap execution requires a connected Privy wallet
- **AI Analysis** — `POST /api/ai/analyze` checks a 5-min in-memory cache, then a 30-min Supabase cache, then calls OpenAI — saves cost significantly on repeat visits
- **Auth** — Privy handles OAuth, `AuthContext` builds a normalised `AuthUser` and syncs to Supabase `users` table

---

## Key Components

| Component | Data Source | Refresh |
|-----------|-------------|---------|
| `TokenTicker` | `/api/birdeye/trending` | Every 30s |
| `TrendingSection` | `/api/birdeye/trending` | On mount |
| `TrendingSidebar` | `/api/birdeye/trending` | On mount |
| `TradePageClient` | `/api/tokens?type=overview` | On mount |
| `MarketStats` | Passed from `TradePageClient` | — |
| `TradingChart` | TradingView widget embed | Live |
| `LiveTrades` | `lib/birdeye.getTokenTrades()` | Every 15s |
| `HolderList` | `lib/birdeye.getTokenHolders()` | On mount |
| `BuySellPanel` | Jupiter v6 `/quote` | On input change (600ms debounce) |
| `PortfolioPanel` | `/api/wallet` | On mount + manual refresh |
| `WalletButton` | `/api/wallet` | On mount, every 60s |
| `AIInsightCard` | `/api/ai/analyze` | On demand |
| `AIChat` | `/api/ai/chat` (streaming) | On send |

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Add all environment variables in **Vercel dashboard → Project → Settings → Environment Variables**.

Required for production:
- `BIRDEYE_API_KEY`
- `NEXT_PUBLIC_PRIVY_APP_ID`
- `ALCHEMY_SOLANA_RPC_URL`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

---

## Development Notes

- **No mock data in production** — all market data comes from live BirdEye API calls. The app requires `BIRDEYE_API_KEY` to be set.
- **Graceful degradation** — if BirdEye is unreachable, components show empty/zero states rather than stale mock values.
- **AI caching** — analysis results are cached in memory (5 min) and Supabase (30 min) to reduce OpenAI costs on repeat page views.
- **Price caching** — BirdEye prices are cached in-memory for 30 seconds per API route invocation to avoid rate limiting.
- **Wallet data** — `PortfolioPanel` and `WalletButton` only fetch real data when a user is authenticated with a connected Solana wallet address. Unauthenticated users see a connect prompt.
- **Swap execution** — Jupiter quotes are fetched in real-time but actual swap transaction signing requires the user's Privy-connected wallet. The current `handleSwap` flow is prepared for wallet signing integration.

---

## License

MIT © ChadWallet 2024

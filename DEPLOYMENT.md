# ChadWallet Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
- Vercel account
- GitHub repository with the ChadWallet code

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial ChadWallet commit"
   git remote add origin https://github.com/your-org/chadwallet.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Framework: Next.js (auto-detected)
   - Root directory: `./` (default)

3. **Configure Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://unqrawganuhurkezmydd.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
   BIRDEYE_API_KEY=your-birdeye-key
   ALCHEMY_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/your-key
   OPENAI_API_KEY=your-openai-key
   ANTHROPIC_API_KEY=your-anthropic-key
   NEXT_PUBLIC_JUPITER_API_URL=https://quote-api.jup.ag
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Custom Domain
In Vercel dashboard → Domains → Add `chadwallet.xyz`

---

## Supabase Setup

1. Go to your Supabase project: https://unqrawganuhurkezmydd.supabase.co
2. Open SQL Editor
3. Run `supabase/migrations/001_initial_schema.sql`
4. Verify tables in Table Editor:
   - users
   - wallets
   - transactions
   - watchlist
   - ai_insights

---

## Cloudflare Configuration (Optional CDN)

1. Add Cloudflare in front of Vercel for CDN/DDoS protection
2. Configure DNS: `chadwallet.xyz → cname-ssl.vercel-dns.com`
3. Enable: Full (strict) SSL, Always Use HTTPS
4. Page Rules:
   - `/api/*` → Cache Level: Bypass
   - `/*` → Cache Level: Standard

---

## Performance Checklist

- [ ] Enable ISR for static pages
- [ ] Configure Vercel Edge Network
- [ ] Set up error monitoring (Sentry)
- [ ] Configure analytics (Vercel Analytics)
- [ ] Enable Cloudflare caching for static assets
- [ ] Set up uptime monitoring

---

## Security Checklist

- [ ] Never commit `.env.local` to git
- [ ] Rotate API keys regularly
- [ ] Enable Supabase RLS (included in migration)
- [ ] Set CORS headers appropriately
- [ ] Rate limit API routes (recommended: Upstash Redis)
- [ ] Monitor API usage and costs

---

## Post-Deployment Verification

1. Visit your deployment URL
2. Check the token ticker is scrolling
3. Navigate to `/trade/So11111111111111111111111111111111111111112` (SOL)
4. Verify TradingView chart loads
5. Check AI analysis endpoint: `/api/ai/analyze` (POST)
6. Verify prices API: `/api/prices`

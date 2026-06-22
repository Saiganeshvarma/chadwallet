'use client'

/**
 * ChadWallet — /debug/auth
 *
 * Diagnostic page for OAuth configuration.
 * Shows environment variables (no secrets), Privy config,
 * and the exact redirect URI Privy uses.
 *
 * REMOVE THIS ROUTE BEFORE PRODUCTION DEPLOYMENT.
 */

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Copy, Check, RefreshCw } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DiagRow {
  label: string
  value: string
  status: 'ok' | 'error' | 'warn' | 'info'
  hint?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusIcon({ s }: { s: DiagRow['status'] }) {
  if (s === 'ok')   return <CheckCircle  className="w-4 h-4 text-emerald-400 flex-shrink-0" />
  if (s === 'error') return <XCircle      className="w-4 h-4 text-red-400     flex-shrink-0" />
  if (s === 'warn')  return <AlertTriangle className="w-4 h-4 text-amber-400  flex-shrink-0" />
  return               <div className="w-4 h-4 rounded-full bg-blue-400/50 flex-shrink-0" />
}

function Row({ row }: { row: DiagRow }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(row.value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className={`flex gap-3 p-3 rounded-lg border ${
      row.status === 'error' ? 'bg-red-500/5 border-red-500/20' :
      row.status === 'warn'  ? 'bg-amber-500/5 border-amber-500/20' :
      row.status === 'ok'    ? 'bg-emerald-500/5 border-emerald-500/20' :
      'bg-white/3 border-white/8'
    }`}>
      <StatusIcon s={row.status} />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-white/40 mb-0.5">{row.label}</div>
        <div className="text-sm font-mono text-white break-all">{row.value}</div>
        {row.hint && <div className="text-xs text-white/30 mt-1">{row.hint}</div>}
      </div>
      <button onClick={copy} className="p-1 text-white/20 hover:text-white/60 flex-shrink-0">
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DebugAuthPage() {
  const [rows, setRows] = useState<DiagRow[]>([])
  const [privyStatus, setPrivyStatus] = useState<string>('Checking…')
  const [appId, setAppId] = useState<string>('')
  const [origin, setOrigin] = useState<string>('')

  useEffect(() => {
    const id     = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ''
    const org    = window.location.origin
    const isConfigured = !!id && id !== 'placeholder-privy-id'

    setAppId(id)
    setOrigin(org)

    // ── Privy config check ────────────────────────────────────────────────
    const privyCallbackUrl = 'https://auth.privy.io/api/v1/oauth/callback'

    const built: DiagRow[] = [
      // ── Auth provider ─────────────────────────────────────────────────
      {
        label: 'Auth Provider',
        value: 'Privy (@privy-io/react-auth v3)',
        status: 'info',
      },
      {
        label: 'Privy App ID',
        value: id || '(not set)',
        status: id ? 'ok' : 'error',
        hint: id ? 'Set via NEXT_PUBLIC_PRIVY_APP_ID' : 'Missing — add to .env.local',
      },
      {
        label: 'Privy Configured',
        value: isConfigured ? 'Yes' : 'No',
        status: isConfigured ? 'ok' : 'error',
      },

      // ── How Privy OAuth works ─────────────────────────────────────────
      {
        label: 'OAuth Flow Type',
        value: 'Headless redirect via initOAuth({ provider: "google" })',
        status: 'info',
        hint: 'Privy redirects to Google then handles the callback on its own server.',
      },
      {
        label: 'Privy OAuth Callback URL (redirect_uri)',
        value: privyCallbackUrl,
        status: 'info',
        hint: '⚠️  THIS is the redirect_uri Google sees. You do NOT register your app URL with Google — Privy manages Google OAuth on its servers using YOUR App ID.',
      },

      // ── App origin ────────────────────────────────────────────────────
      {
        label: 'App Origin (current)',
        value: org,
        status: 'info',
        hint: 'Must be added to "Allowed Origins" in the Privy dashboard → Settings.',
      },
      {
        label: 'Privy Allowed Origin (localhost dev)',
        value: 'http://localhost:3000',
        status: org.includes('localhost') ? 'ok' : 'warn',
        hint: 'Add this in Privy dashboard → App → Settings → Allowed Origins.',
      },
      {
        label: 'Privy Allowed Origin (production)',
        value: 'https://your-domain.com  ← replace with real domain',
        status: 'warn',
        hint: 'Add your production URL in Privy dashboard before deploying.',
      },

      // ── Environment variables ─────────────────────────────────────────
      {
        label: 'NEXT_PUBLIC_PRIVY_APP_ID',
        value: id ? `${id.slice(0, 8)}…${id.slice(-4)} (${id.length} chars)` : '(empty)',
        status: id ? 'ok' : 'error',
      },
      {
        label: 'NEXT_PUBLIC_SUPABASE_URL',
        value: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✓' : '(not set)',
        status: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'ok' : 'warn',
      },
      {
        label: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
        value: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? 'Set ✓' : '(not set)',
        status: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? 'ok' : 'warn',
      },
      {
        label: 'BIRDEYE_API_KEY',
        value: process.env.BIRDEYE_API_KEY ? 'Set ✓' : '(not set — mock data used)',
        status: process.env.BIRDEYE_API_KEY ? 'ok' : 'warn',
      },
      {
        label: 'OPENAI_API_KEY',
        value: process.env.OPENAI_API_KEY ? 'Set ✓' : '(not set — mock AI used)',
        status: process.env.OPENAI_API_KEY ? 'ok' : 'warn',
      },
      {
        label: 'ANTHROPIC_API_KEY',
        value: process.env.ANTHROPIC_API_KEY ? 'Set ✓' : '(not set)',
        status: process.env.ANTHROPIC_API_KEY ? 'ok' : 'info',
      },
    ]

    setRows(built)

    // ── Live Privy API check ───────────────────────────────────────────
    if (!id) {
      setPrivyStatus('❌ App ID missing — cannot check')
      return
    }

    fetch(`https://auth.privy.io/api/v1/apps/${id}`, {
      headers: { 'privy-app-id': id },
    })
      .then(async (r) => {
        if (r.status === 200) {
          const data = await r.json()
          const loginMethods: string[] = data?.login_methods ?? []
          const hasGoogle = loginMethods.includes('google') || loginMethods.includes('google_oauth')
          const hasApple  = loginMethods.includes('apple')  || loginMethods.includes('apple_oauth')
          setPrivyStatus(
            `✅ App reachable | Login methods: [${loginMethods.join(', ') || 'none'}]` +
            (hasGoogle ? '' : ' ⚠️  Google not enabled') +
            (hasApple  ? '' : ' ⚠️  Apple not enabled')
          )
        } else if (r.status === 401 || r.status === 403) {
          setPrivyStatus(`⚠️  Privy API returned ${r.status} — App ID may be wrong or app not activated`)
        } else {
          setPrivyStatus(`⚠️  Privy API returned ${r.status}`)
        }
      })
      .catch(() => setPrivyStatus('⚠️  Could not reach Privy API (CORS expected from browser)'))
  }, [])

  return (
    <main className="min-h-screen bg-[#050510] px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            Development only — remove before production
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Auth Diagnostics</h1>
          <p className="text-sm text-white/40">
            Inspect the OAuth configuration and identify what&apos;s causing{' '}
            <code className="text-red-400 bg-red-400/10 px-1 rounded">redirect_uri_mismatch</code>{' '}
            or{' '}
            <code className="text-red-400 bg-red-400/10 px-1 rounded">Login with Google not allowed</code>.
          </p>
        </div>

        {/* Root cause box */}
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-red-300 mb-1">Root Cause Analysis</div>
              <p className="text-xs text-white/60 leading-relaxed">
                Both <strong className="text-white">&quot;redirect_uri_mismatch&quot;</strong> and{' '}
                <strong className="text-white">&quot;Login with Google not allowed&quot;</strong> mean the same
                thing: <strong className="text-white">Google OAuth is not enabled in your Privy dashboard</strong>{' '}
                for App ID <code className="text-[#9945FF] bg-[#9945FF]/10 px-1 rounded">{appId || '(not set)'}</code>.
              </p>
              <p className="text-xs text-white/60 leading-relaxed mt-2">
                Privy manages the Google OAuth application and redirect_uri on its own servers —
                you only need to enable Google as a login method in the Privy dashboard. You do{' '}
                <strong className="text-white">not</strong> configure anything in Google Cloud Console.
              </p>
            </div>
          </div>
        </div>

        {/* Fix steps */}
        <div className="mb-6 p-4 rounded-xl bg-[#9945FF]/10 border border-[#9945FF]/30">
          <div className="text-sm font-bold text-[#9945FF] mb-3">How to Fix (3 steps)</div>
          <ol className="space-y-2.5 text-xs text-white/70 leading-relaxed list-none">
            {[
              <>Go to <a href="https://dashboard.privy.io" target="_blank" rel="noopener" className="text-[#9945FF] underline">dashboard.privy.io</a> → select your app (<code className="text-white bg-white/10 px-1 rounded">{appId.slice(0,12) || '…'}</code>)</>,
              <>Navigate to <strong className="text-white">Login Methods</strong> → enable <strong className="text-white">Google</strong> and <strong className="text-white">Apple</strong></>,
              <>Navigate to <strong className="text-white">Settings → Allowed Origins</strong> → add <code className="text-white bg-white/10 px-1 rounded">{origin || 'http://localhost:3000'}</code></>,
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#9945FF]/30 text-[#9945FF] text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Live Privy status */}
        <div className="mb-6 p-3 rounded-xl bg-white/3 border border-white/8">
          <div className="flex items-center gap-2 mb-1">
            <RefreshCw className="w-3.5 h-3.5 text-white/40" />
            <span className="text-xs text-white/40">Live Privy API status</span>
          </div>
          <p className="text-sm text-white/80 font-mono">{privyStatus}</p>
        </div>

        {/* Diagnostic rows */}
        <div className="space-y-2">
          {rows.map((row) => <Row key={row.label} row={row} />)}
        </div>

        {/* What Privy redirect URI looks like */}
        <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
          <div className="text-xs font-bold text-blue-400 mb-2">OAuth Redirect URI (for reference)</div>
          <p className="text-xs text-white/50 leading-relaxed">
            When <code className="text-blue-300 bg-blue-400/10 px-1 rounded">initOAuth(&#123; provider: &apos;google&apos; &#125;)</code> is called,
            Privy redirects the browser to Google with:
          </p>
          <code className="block mt-2 text-xs bg-white/5 border border-white/10 rounded p-2 text-emerald-300 break-all">
            redirect_uri=https://auth.privy.io/api/v1/oauth/callback
          </code>
          <p className="text-xs text-white/40 mt-2">
            This URI is registered by Privy with Google — you cannot change it. Any
            mismatch is resolved by enabling Google OAuth inside the Privy dashboard,
            not in Google Cloud Console.
          </p>
        </div>

        <p className="text-center text-xs text-white/20 mt-8">
          <strong className="text-white/30">⚠️ Remove</strong> this route before deploying to production.
        </p>
      </div>
    </main>
  )
}

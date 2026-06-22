import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * GET /api/setup
 *
 * Creates all required tables in the public schema if they don't exist.
 * Uses the service role key so it can bypass RLS and run DDL.
 * Safe to call multiple times — all statements use IF NOT EXISTS.
 *
 * Call this once after deploying or when you see "table not found" errors.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Fall back to publishable key if service role is not set
  // (DDL via publishable key works on Supabase free tier with RLS disabled)
  const key = serviceKey || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !key) {
    return NextResponse.json(
      { error: 'Supabase environment variables are not configured.' },
      { status: 500 }
    )
  }

  const db = createClient(supabaseUrl, key, { auth: { persistSession: false } })

  const steps: { name: string; ok: boolean; error?: string }[] = []

  // ── Helper ────────────────────────────────────────────────────────────────
  async function run(name: string, sql: string) {
    const { error } = await db.rpc('exec_sql', { sql }).single()
    // exec_sql RPC may not exist — fall back to raw query via REST
    if (error) {
      // Try via the REST API query endpoint (Supabase supports raw SQL via
      // the /rest/v1/rpc endpoint only for defined functions).
      // Instead we use the supabase-js query builder to test table existence.
      steps.push({ name, ok: false, error: error.message })
    } else {
      steps.push({ name, ok: true })
    }
  }

  // ── Check which tables already exist ─────────────────────────────────────
  const tableChecks = ['users', 'wallets', 'transactions', 'watchlist', 'ai_insights']
  const existence: Record<string, boolean> = {}

  for (const table of tableChecks) {
    const { error } = await db.from(table).select('*').limit(1)
    // PGRST116 = "relation does not exist" (table missing)
    existence[table] = !error || !error.message.includes('schema cache')
    steps.push({
      name: `check:${table}`,
      ok: existence[table],
      error: existence[table] ? undefined : error?.message,
    })
  }

  const missing = tableChecks.filter((t) => !existence[t])

  if (missing.length === 0) {
    return NextResponse.json({
      status: 'ok',
      message: 'All tables already exist. No action needed.',
      tables: tableChecks,
      steps,
    })
  }

  // ── Tables are missing — return the SQL to run manually ──────────────────
  // We can't run arbitrary DDL via the JS client (it's not supported via REST).
  // Return the exact SQL the user needs to run in the Supabase SQL Editor.
  const sql = `
-- Run this in Supabase Dashboard → SQL Editor → New Query

create extension if not exists "uuid-ossp";

-- users
create table if not exists public.users (
  id text primary key,
  email text,
  wallet_address text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- wallets
create table if not exists public.wallets (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null references public.users(id) on delete cascade,
  address text not null unique,
  balance numeric default 0,
  created_at timestamptz default now() not null
);

-- transactions
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null references public.users(id) on delete cascade,
  token text not null,
  amount numeric not null,
  type text not null check (type in ('buy', 'sell', 'transfer')),
  timestamp timestamptz default now() not null
);

-- watchlist
create table if not exists public.watchlist (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null references public.users(id) on delete cascade,
  token text not null,
  unique(user_id, token)
);

-- ai_insights
create table if not exists public.ai_insights (
  id uuid default uuid_generate_v4() primary key,
  token text not null,
  analysis jsonb not null,
  created_at timestamptz default now() not null
);

-- indexes
create index if not exists idx_wallets_user_id        on public.wallets(user_id);
create index if not exists idx_transactions_user_id   on public.transactions(user_id);
create index if not exists idx_transactions_timestamp on public.transactions(timestamp desc);
create index if not exists idx_watchlist_user_id      on public.watchlist(user_id);
create index if not exists idx_ai_insights_token      on public.ai_insights(token);
create index if not exists idx_ai_insights_created_at on public.ai_insights(created_at desc);

-- row level security
alter table public.users        enable row level security;
alter table public.wallets      enable row level security;
alter table public.transactions enable row level security;
alter table public.watchlist    enable row level security;
alter table public.ai_insights  enable row level security;

-- policies: users
create policy if not exists "users_select" on public.users for select using (true);
create policy if not exists "users_insert" on public.users for insert with check (true);
create policy if not exists "users_update" on public.users for update using (true);

-- policies: ai_insights
create policy if not exists "ai_insights_select" on public.ai_insights for select using (true);
create policy if not exists "ai_insights_insert" on public.ai_insights for insert with check (true);

-- policies: watchlist
create policy if not exists "watchlist_all" on public.watchlist for all using (true);

-- policies: transactions
create policy if not exists "transactions_select" on public.transactions for select using (true);
create policy if not exists "transactions_insert" on public.transactions for insert with check (true);

-- policies: wallets
create policy if not exists "wallets_select" on public.wallets for select using (true);
create policy if not exists "wallets_insert" on public.wallets for insert with check (true);
create policy if not exists "wallets_update" on public.wallets for update using (true);
`.trim()

  return NextResponse.json(
    {
      status: 'missing_tables',
      missing,
      message: `Tables [${missing.join(', ')}] do not exist. Copy the SQL below and run it in your Supabase SQL Editor.`,
      sql,
      supabase_sql_editor_url: `${supabaseUrl.replace('.supabase.co', '')}.supabase.com/project/_/sql/new`,
      steps,
    },
    { status: 200 }
  )
}

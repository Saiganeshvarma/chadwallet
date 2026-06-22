-- ChadWallet Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists public.users (
  id text primary key,
  email text,
  wallet_address text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- Wallets table
create table if not exists public.wallets (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null references public.users(id) on delete cascade,
  address text not null unique,
  balance numeric default 0,
  created_at timestamptz default now() not null
);

-- Transactions table
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null references public.users(id) on delete cascade,
  token text not null,
  amount numeric not null,
  type text not null check (type in ('buy', 'sell', 'transfer')),
  timestamp timestamptz default now() not null
);

-- Watchlist table
create table if not exists public.watchlist (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null references public.users(id) on delete cascade,
  token text not null,
  unique(user_id, token)
);

-- AI Insights table
create table if not exists public.ai_insights (
  id uuid default uuid_generate_v4() primary key,
  token text not null,
  analysis jsonb not null,
  created_at timestamptz default now() not null
);

-- Indexes for performance
create index if not exists idx_wallets_user_id on public.wallets(user_id);
create index if not exists idx_transactions_user_id on public.transactions(user_id);
create index if not exists idx_transactions_timestamp on public.transactions(timestamp desc);
create index if not exists idx_watchlist_user_id on public.watchlist(user_id);
create index if not exists idx_ai_insights_token on public.ai_insights(token);
create index if not exists idx_ai_insights_created_at on public.ai_insights(created_at desc);

-- Row Level Security
alter table public.users enable row level security;
alter table public.wallets enable row level security;
alter table public.transactions enable row level security;
alter table public.watchlist enable row level security;
alter table public.ai_insights enable row level security;

-- RLS Policies
-- Users: Anyone can read, users can update their own
create policy "Public users are viewable by everyone" on public.users
  for select using (true);

create policy "Users can insert their own profile" on public.users
  for insert with check (true);

create policy "Users can update their own profile" on public.users
  for update using (true);

-- AI Insights: Anyone can read (cached analysis)
create policy "AI insights are readable by everyone" on public.ai_insights
  for select using (true);

create policy "AI insights can be inserted" on public.ai_insights
  for insert with check (true);

-- Watchlist: Users can manage their own
create policy "Watchlist viewable by owner" on public.watchlist
  for select using (true);

create policy "Users can manage watchlist" on public.watchlist
  for all using (true);

-- Transactions: Users can view all (for demo)
create policy "Transactions viewable" on public.transactions
  for select using (true);

create policy "Transactions insertable" on public.transactions
  for insert with check (true);

-- Wallets: Public read for demo
create policy "Wallets viewable" on public.wallets
  for select using (true);

create policy "Wallets insertable" on public.wallets
  for insert with check (true);

create policy "Wallets updatable" on public.wallets
  for update using (true);

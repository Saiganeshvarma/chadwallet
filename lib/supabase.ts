import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          wallet_address: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          wallet_address?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          wallet_address?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          address: string
          balance: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          address: string
          balance?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          address?: string
          balance?: number
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          token: string
          amount: number
          type: string
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          amount: number
          type: string
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          amount?: number
          type?: string
          timestamp?: string
        }
      }
      watchlist: {
        Row: {
          id: string
          user_id: string
          token: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
        }
      }
      ai_insights: {
        Row: {
          id: string
          token: string
          analysis: string
          created_at: string
        }
        Insert: {
          id?: string
          token: string
          analysis: string
          created_at?: string
        }
        Update: {
          id?: string
          token?: string
          analysis?: string
          created_at?: string
        }
      }
    }
  }
}

// Helper functions
export async function upsertUser(userData: {
  id: string
  email?: string
  walletAddress?: string
  avatarUrl?: string
}) {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: userData.id,
      email: userData.email ?? null,
      wallet_address: userData.walletAddress ?? null,
      avatar_url: userData.avatarUrl ?? null,
    })
    .select()
    .single()

  if (error) console.error('Error upserting user:', error)
  return { data, error }
}

export async function getAIInsight(token: string) {
  try {
    const { data, error } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('token', token)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error?.message?.includes('schema cache') || error?.message?.includes('Could not find')) {
      return { data: null, error: null } // table not set up yet — treat as cache miss
    }
    return { data, error }
  } catch {
    return { data: null, error: null }
  }
}

export async function saveAIInsight(token: string, analysis: string) {
  try {
    const { data, error } = await supabase
      .from('ai_insights')
      .insert({ token, analysis })
      .select()
      .single()

    if (error?.message?.includes('schema cache') || error?.message?.includes('Could not find')) {
      return { data: null, error: null } // table not set up yet — skip silently
    }
    return { data, error }
  } catch {
    return { data: null, error: null }
  }
}

export async function getWatchlist(userId: string) {
  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', userId)

  return { data, error }
}

export async function addToWatchlist(userId: string, token: string) {
  const { data, error } = await supabase
    .from('watchlist')
    .insert({ user_id: userId, token })
    .select()
    .single()

  return { data, error }
}

export async function removeFromWatchlist(userId: string, token: string) {
  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('user_id', userId)
    .eq('token', token)

  return { error }
}

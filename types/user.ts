export interface User {
  id: string
  email?: string
  walletAddress?: string
  avatarUrl?: string
  createdAt: string
}

export interface UserProfile {
  id: string
  email?: string
  walletAddress?: string
  avatarUrl?: string
  watchlist: string[]
  createdAt: string
}

export interface WatchlistItem {
  id: string
  userId: string
  token: string
  addedAt: string
}

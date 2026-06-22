import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

const RPC_URL = process.env.ALCHEMY_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'

let connection: Connection | null = null

export function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(RPC_URL, {
      commitment: 'confirmed',
      wsEndpoint: RPC_URL.replace('https://', 'wss://').replace('http://', 'ws://'),
    })
  }
  return connection
}

export async function getSolBalance(address: string): Promise<number> {
  try {
    const conn = getConnection()
    const pubkey = new PublicKey(address)
    const balance = await conn.getBalance(pubkey)
    return balance / LAMPORTS_PER_SOL
  } catch (err) {
    console.error('getSolBalance error:', err)
    return 0
  }
}

export async function getTokenAccounts(address: string) {
  try {
    const conn = getConnection()
    const pubkey = new PublicKey(address)
    const accounts = await conn.getParsedTokenAccountsByOwner(pubkey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    })
    return accounts.value
  } catch (err) {
    console.error('getTokenAccounts error:', err)
    return []
  }
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch {
    return false
  }
}

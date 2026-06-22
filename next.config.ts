import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),

  // Declare an empty turbopack config so Next.js 16 doesn't error when it
  // also finds a webpack() function (used only during `next dev --webpack`).
  turbopack: {},

  webpack(config: { plugins: { push: (arg: unknown) => void } }) {
    // Suppress missing optional peer deps from @privy-io/react-auth
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const wp = require('webpack')
    config.plugins.push(
      new wp.IgnorePlugin({
        resourceRegExp: /^(@stripe\/crypto|@farcaster\/mini-app-solana)$/,
      })
    )
    return config
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'arweave.net' },
      { protocol: 'https', hostname: 'static.jup.ag' },
      { protocol: 'https', hostname: 'pyth.network' },
      { protocol: 'https', hostname: 'metadata.jito.network' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'bafkreibk3covs5ltyqxa272uodhculbgn2nflcdv3qz4l4jftqphzo4mqe.ipfs.nftstorage.link' },
      { protocol: 'https', hostname: '*.ipfs.nftstorage.link' },
      { protocol: 'https', hostname: 'cdn.birdeye.so' },
    ],
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin',  value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

export default nextConfig

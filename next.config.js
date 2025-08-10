// next.config.js
const { webpackFallback } = require('@txnlab/use-wallet-react')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['http://localhost:3000', 'http://192.168.86.24'], // Add your development origin here
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...webpackFallback,
      }
    }
    return config
  },
}

module.exports = nextConfig

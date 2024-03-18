/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: false
  },
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack: config => {
    config.snapshot = {
      ...(config.snapshot ?? {}),
      managedPaths: [/^(.+?[\\/]node_modules[\\/])(?!@next)/]
    }
    return config
  },
  typescript: {
    ignoreBuildErrors: true
  },
  // cleanDistDir: true,
  distDir: 'dist',
  images: {
    domains: []
  },
  env: {
    STORAGE_ENCRYPTION_KEY: 'adZkiAToken331',
    ENCRYPTION_PREF_KEY: 'prefadZkiAToken331'
  },
  async rewrites() {
    return {}
  }
}

module.exports = nextConfig

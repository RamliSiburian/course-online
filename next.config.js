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
    ENCRYPTION_PREF_KEY: 'prefadZkiAToken331',
    BASEURL: 'https://api.personna.id/',
    GOOGLE_ID:
      'http://530827057986-4df87ihc1cgh0l5kknl22k61d72958ib.apps.googleusercontent.com',
    GOOGLE_SECRET: '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'
  },
  async rewrites() {
    return {}
  }
}

module.exports = nextConfig

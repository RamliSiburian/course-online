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
      '813611852387-i3o453rpqp4trjvicn2ua5l2redrha1m.apps.googleusercontent.com',
    GOOGLE_SECRET: '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',
    X_USER_KEY:
      'Y29tLmtsaWsud2ViLmlkLCQyeSQxMCRDUkFucmRlRmJ6dmwxVURMYW5GQXouamV0OFlGYVRkRTR1dm55bUROYXNDYW4ybmhMN1lNNg=='
  },
  async rewrites() {
    return {}
  }
}

module.exports = nextConfig

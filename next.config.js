/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['jogxouotwtbjhoioyofa.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jogxouotwtbjhoioyofa.supabase.co',
        pathname: '/storage/v1/object/public/experiences/**',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
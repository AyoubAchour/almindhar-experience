import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable strict mode for better security
  /* config options here */
  images: {
    domains: ['jogxouotwtbjhoioyofa.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jogxouotwtbjhoioyofa.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://jogxouotwtbjhoioyofa.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://jogxouotwtbjhoioyofa.supabase.co blob:; font-src 'self'; connect-src 'self' https://jogxouotwtbjhoioyofa.supabase.co wss://jogxouotwtbjhoioyofa.supabase.co; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

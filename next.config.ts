import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;

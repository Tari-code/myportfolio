import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.replit.dev", "*.replit.app"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.replit.dev',
      },
      {
        protocol: 'https',
        hostname: '*.replit.app',
      },
    ],
  },
};

export default nextConfig;

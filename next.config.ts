import type { NextConfig } from "next";

const devOrigins = process.env.REPLIT_DEV_DOMAIN
  ? [process.env.REPLIT_DEV_DOMAIN]
  : [];

const nextConfig: NextConfig = {
  allowedDevOrigins: devOrigins,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;

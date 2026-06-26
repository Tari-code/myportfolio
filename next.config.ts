import type { NextConfig } from "next";

const replitDomain = process.env.REPLIT_DEV_DOMAIN || "";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    replitDomain,
    `*.${replitDomain.split(".").slice(1).join(".")}`,
    "*.replit.dev",
    "*.replit.app",
    "*.janeway.replit.dev",
    "*.picard.replit.dev",
  ].filter(Boolean),
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.replit.dev" },
      { protocol: "https", hostname: "*.replit.app" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
  poweredByHeader: false,
};

export default nextConfig;

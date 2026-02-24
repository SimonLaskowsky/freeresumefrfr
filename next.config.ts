import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack (default in Next.js 16) handles react-pdf fine without special config
  turbopack: {},
};

export default nextConfig;

import type { NextConfig } from "next";
import "dotenv/config";
const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  allowedDevOrigins: [process.env.HOST as string]

};

export default nextConfig;

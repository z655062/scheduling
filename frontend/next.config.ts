import type { NextConfig } from "next";
import "dotenv/config";
const BACKEND_URL = `${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}`;
console.log("🚀 ~ BACKEND_URL:", BACKEND_URL)

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // 將所有 /api/ 開頭的請求代理到後端 Port
        destination: `http://127.0.0.1:1746/api/:path*`,
      },
      {
        source: '/api/auth/login',
        // 將所有 /api/ 開頭的請求代理到後端 Port
        destination: `http://127.0.0.1:1746/api/auth/login`,
      },
    ];
  },
  /* config options here */
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  allowedDevOrigins: [BACKEND_URL]

};

export default nextConfig;

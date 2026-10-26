import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

// NEXT_PUBLIC_API_URL is the documented name. API_URL (the name used before the Next.js
// migration) is still honored so existing .env files keep working.
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  (isProduction ? '' : 'http://localhost:3000/api');

const nextConfig: NextConfig = {
  // The Docker image sets BUILD_STANDALONE=true for a self-contained server bundle.
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_API_URL: apiUrl
  },
  // Pin the workspace root: the repository root also contains a package-lock.json.
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: [
      // Product images are uploaded to S3 by the API (server/utils/storage.js).
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' }
    ]
  }
};

export default nextConfig;

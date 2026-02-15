import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname),
  transpilePackages: ['three', 'lit', '@lit/context'],
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;

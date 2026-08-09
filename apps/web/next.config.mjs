/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@cari-finance/db', '@cari-finance/domain'],
};

export default nextConfig;

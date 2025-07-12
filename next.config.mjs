/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Enable env var access inside middleware on Vercel
  middleware: {
    env: ['JWT_ACCESS_SECRET'],
  },
  bundlePagesRouterDependencies: true,
};

export default nextConfig;

import type { NextConfig } from 'next';

/**
 * Remote image hosts.
 *
 * R2 buckets are exposed through a per-network CDN hostname so that a new town
 * never requires a config change here — it only needs a folder inside the bucket.
 */
const remoteHostnames = [
  process.env.NEXT_PUBLIC_R2_PUBLIC_HOST, // e.g. cdn.lokaly.my
  'images.unsplash.com', // placeholder imagery for seed content only
].filter((host): host is string => Boolean(host));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    // AVIF first, WebP fallback. Both are dramatically smaller than the
    // large travel photography this platform leans on.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [64, 96, 128, 200, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: remoteHostnames.map((hostname) => ({
      protocol: 'https' as const,
      hostname,
    })),
  },

  experimental: {
    // Keeps icon/util barrel imports from pulling their whole package into
    // every route's client bundle.
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

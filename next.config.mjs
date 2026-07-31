// @ts-check

/**
 * Plain JS, deliberately not next.config.ts.
 *
 * Next.js loads this file at server boot, not just at build time, and doing
 * so for a `.ts` config requires `typescript` present at runtime. Since
 * production installs run `npm ci --omit=dev` (typescript is a devDependency,
 * and installing it should never happen automatically on a live server),
 * this file has to be plain JS so no dev toolchain is needed to boot.
 *
 * @type {() => Promise<import('next').NextConfig>}
 */

/**
 * Remote image hosts.
 *
 * R2 buckets are exposed through a per-network CDN hostname so that a new town
 * never requires a config change here — it only needs a folder inside the bucket.
 */
const remoteHostnames = [
  process.env.NEXT_PUBLIC_R2_PUBLIC_HOST, // e.g. cdn.lokaly.my
  'images.unsplash.com', // placeholder imagery for seed content only
].filter((host) => Boolean(host));

/** @type {import('next').NextConfig} */
const nextConfig = {
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
      protocol: 'https',
      hostname,
    })),
    // The bundled seed imagery (src/data/seed, public/images/placeholders) is
    // SVG, and next/image refuses to optimize SVGs by default — they can embed
    // <script>, which is a real risk for user-uploaded images. Ours are all
    // generated locally by scripts/generate-placeholders.mjs, not uploads, so
    // the risk doesn't apply; the CSP below is defense in depth regardless.
    // Once Stage C replaces these with real photography (JPG/WebP), this
    // block stops mattering for that imagery but is harmless to leave.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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

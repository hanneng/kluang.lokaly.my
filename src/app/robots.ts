import type { MetadataRoute } from 'next';
import { getTown, getTownOrigin } from '@/lib/town/context';

/**
 * Per-town robots.txt, resolved from the request hostname.
 *
 * Towns with `status: 'planned'` are blocked entirely — a half-populated town
 * indexed early is worse than one indexed late.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const town = await getTown();
  const origin = await getTownOrigin();

  if (town.status === 'planned' || process.env.NEXT_PUBLIC_BLOCK_INDEXING === '1') {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/admin/',
          // Search results and filtered views carry no index value.
          '/search',
          '/*?q=',
          '/*?page=',
          '/*?facilities=',
          '/*?price=',
        ],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}

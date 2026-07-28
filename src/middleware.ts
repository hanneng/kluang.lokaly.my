import { NextResponse, type NextRequest } from 'next/server';
import { resolveTownByHost } from '@/config/towns';

/**
 * Multi-tenant request routing.
 *
 * Resolves the active town from the request hostname once and forwards it on
 * `x-town-slug`, which `getTown()` reads in server components. Doing it here
 * rather than per-page keeps the resolution in exactly one place and lets the
 * `?town=` override work uniformly across every route during development.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host');

  // Dev/QA affordance: `?town=kluang` previews any town on any hostname.
  const preview = request.nextUrl.searchParams.get('town');
  const town =
    preview && process.env.NODE_ENV !== 'production'
      ? resolveTownByHost(`${preview}.localhost`)
      : resolveTownByHost(host);

  const headers = new Headers(request.headers);
  headers.set('x-town-slug', town.slug);
  headers.set('x-town-domain', town.domain);
  // Used to build absolute URLs (canonicals, OG images) without another lookup.
  headers.set('x-request-host', host ?? town.domain);

  const response = NextResponse.next({ request: { headers } });

  // Vary on host so a shared CDN never serves Kluang's HTML on Muar's domain.
  response.headers.set('Vary', 'Host');
  response.headers.set('x-town-slug', town.slug);

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image optimisation, which never need
     * town context and shouldn't pay for the middleware hop.
     */
    '/((?!_next/static|_next/image|images/|fonts/|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

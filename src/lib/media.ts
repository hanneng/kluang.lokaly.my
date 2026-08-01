import type { MediaAsset } from '@/types/content';

/**
 * Media URL resolution.
 *
 * Images are stored as bare object *keys* (e.g. `kluang/attractions/lambak/
 * hero.jpg`), never as absolute URLs, so the serving host is a deployment
 * concern rather than baked into every database row. Moving from direct-S3 to
 * a CloudFront/`cdn.lokaly.my` distribution later is then a one-variable change
 * (`NEXT_PUBLIC_MEDIA_BASE_URL`), not a data migration.
 *
 * The function is idempotent and safe to apply anywhere:
 *   - absolute URLs (`https:`, `data:`, `blob:`) pass through untouched;
 *   - app-local public assets (`/images/...`) pass through untouched — this is
 *     what the bundled seed placeholders use, so nothing changes for them;
 *   - anything else is treated as a storage key and prefixed with the base URL.
 */

const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? '').replace(/\/+$/, '');

export function resolveMediaUrl(src: string | undefined): string {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith('/')) return src;

  // Bare storage key.
  if (!MEDIA_BASE) {
    // No media host configured but a key was stored — surface it as a
    // root-relative path so it 404s visibly rather than crashing SSR. In
    // practice this only happens if content references S3 before the env var
    // is set; all seed content uses local `/images/...` paths.
    return `/${src.replace(/^\/+/, '')}`;
  }
  return `${MEDIA_BASE}/${src.replace(/^\/+/, '')}`;
}

/** Returns a copy of the asset with its `src` (and nothing else) resolved. */
export function resolveMediaAsset(asset: MediaAsset): MediaAsset {
  const resolved = resolveMediaUrl(asset.src);
  return resolved === asset.src ? asset : { ...asset, src: resolved };
}

/** Resolve an optional asset (featured images, avatars, logos, OG images). */
export function resolveOptionalMediaAsset(asset: MediaAsset | undefined): MediaAsset | undefined {
  return asset ? resolveMediaAsset(asset) : undefined;
}

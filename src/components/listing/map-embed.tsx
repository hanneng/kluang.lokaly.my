import { osmEmbedUrl } from '@/lib/geo';
import type { GeoPoint } from '@/types/town';

/**
 * Static map for a single place.
 *
 * An OpenStreetMap iframe: no API key, no billing, no third-party JS bundle,
 * and `loading="lazy"` keeps it off the critical path. The full interactive
 * map (MapLibre) is only loaded on `/map`, where it is the point of the page.
 */
export function MapEmbed({ point, title }: { point: GeoPoint; title: string }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line">
      <iframe
        src={osmEmbedUrl(point)}
        title={`Map showing the location of ${title}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-[16/10] w-full border-0 bg-surface-3"
      />
    </div>
  );
}

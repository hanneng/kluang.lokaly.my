import type { GeoPoint } from '@/types/town';

const EARTH_RADIUS_KM = 6371;

const toRad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Great-circle distance in kilometres.
 *
 * Used for the "Nearby" rails. At district scale the error versus driving
 * distance is acceptable, and it avoids a routing API call on every page.
 */
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** Human-readable distance: "450 m", "2.3 km", "12 km". */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

/** Google Maps directions link — works on both mobile apps and the web. */
export function directionsUrl(point: GeoPoint, label?: string): string {
  const destination = label
    ? `${encodeURIComponent(label)}&destination_place_id=`
    : `${point.lat},${point.lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${
    label ? encodeURIComponent(`${label}, ${point.lat},${point.lng}`) : destination
  }`;
}

/** Google Maps place link, falling back to a coordinate search. */
export function mapsUrl(point: GeoPoint | undefined, label?: string): string | undefined {
  if (!point) return undefined;
  const query = label ? `${label} ${point.lat},${point.lng}` : `${point.lat},${point.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Static embed URL for the map iframe on detail pages (no API key required). */
export function osmEmbedUrl(point: GeoPoint, zoomDelta = 0.008): string {
  const bbox = [
    point.lng - zoomDelta,
    point.lat - zoomDelta / 1.6,
    point.lng + zoomDelta,
    point.lat + zoomDelta / 1.6,
  ].join('%2C');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${point.lat}%2C${point.lng}`;
}

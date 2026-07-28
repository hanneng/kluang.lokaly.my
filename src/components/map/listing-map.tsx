'use client';

// Bundled with this component only — no page without a map pays for it.
import 'maplibre-gl/dist/maplibre-gl.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Map as MapLibreMap, GeoJSONSource } from 'maplibre-gl';
import { DIRECTORY_TYPES, allDirectories } from '@/config/directories';
import { listingHref } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { DirectorySlug } from '@/types/content';
import type { GeoBounds, GeoPoint } from '@/types/town';

/** Minimal shape the map needs — avoids shipping full listing bodies to the client. */
export interface MapPin {
  id: string;
  title: string;
  summary: string;
  directory: DirectorySlug;
  slug: string;
  lat: number;
  lng: number;
  tier: string;
}

/**
 * Interactive map with marker clustering.
 *
 * MapLibre is imported dynamically on mount, so the ~200 KB library and its CSS
 * never enter the bundle of any page that does not render a map. Clustering is
 * done by the GeoJSON source rather than in JS, which keeps thousands of pins
 * smooth on a mid-range phone.
 *
 * Tiles: set `NEXT_PUBLIC_MAP_STYLE_URL` to a vector style (MapTiler, Protomaps,
 * self-hosted). The raster OSM fallback is for development only — the public
 * OSM tile servers are not intended to serve production traffic.
 */
export function ListingMap({
  pins,
  center,
  bounds,
  zoom,
  townName,
}: {
  pins: MapPin[];
  center: GeoPoint;
  bounds: GeoBounds;
  zoom: number;
  townName: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const [active, setActive] = useState<Set<DirectorySlug>>(new Set());
  const [selected, setSelected] = useState<MapPin | null>(null);
  const [ready, setReady] = useState(false);

  const visible = useMemo(
    () => (active.size === 0 ? pins : pins.filter((pin) => active.has(pin.directory))),
    [pins, active],
  );

  const geojson = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: visible.map((pin) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [pin.lng, pin.lat] },
        properties: { ...pin },
      })),
    }),
    [visible],
  );

  // Initialise once.
  useEffect(() => {
    let disposed = false;

    (async () => {
      const maplibre = await import('maplibre-gl');
      if (disposed || !container.current || map.current) return;

      const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL;

      const instance = new maplibre.Map({
        container: container.current,
        style: styleUrl ?? {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
            },
          },
          layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
        },
        center: [center.lng, center.lat],
        zoom,
        maxBounds: [
          [bounds.southWest.lng - 0.4, bounds.southWest.lat - 0.4],
          [bounds.northEast.lng + 0.4, bounds.northEast.lat + 0.4],
        ],
        attributionControl: { compact: true },
      });

      instance.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-right');
      instance.addControl(new maplibre.GeolocateControl({ trackUserLocation: false }), 'top-right');

      instance.on('load', () => {
        instance.addSource('listings', {
          type: 'geojson',
          data: geojson,
          cluster: true,
          clusterRadius: 50,
          clusterMaxZoom: 14,
        });

        const brand =
          getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#1f5c43';

        instance.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'listings',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': brand,
            'circle-opacity': 0.9,
            'circle-radius': ['step', ['get', 'point_count'], 18, 10, 24, 30, 32],
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff',
          },
        });

        instance.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'listings',
          filter: ['has', 'point_count'],
          layout: { 'text-field': '{point_count_abbreviated}', 'text-size': 13 },
          paint: { 'text-color': '#ffffff' },
        });

        instance.addLayer({
          id: 'pin',
          type: 'circle',
          source: 'listings',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': brand,
            'circle-radius': 8,
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff',
          },
        });

        instance.on('click', 'clusters', async (event) => {
          const feature = event.features?.[0];
          if (!feature) return;
          const source = instance.getSource('listings') as GeoJSONSource;
          const expansion = await source.getClusterExpansionZoom(feature.properties.cluster_id);
          instance.easeTo({
            center: (feature.geometry as GeoJSON.Point).coordinates as [number, number],
            zoom: expansion,
          });
        });

        instance.on('click', 'pin', (event) => {
          const properties = event.features?.[0]?.properties;
          if (properties) setSelected(properties as unknown as MapPin);
        });

        for (const layer of ['clusters', 'pin']) {
          instance.on('mouseenter', layer, () => {
            instance.getCanvas().style.cursor = 'pointer';
          });
          instance.on('mouseleave', layer, () => {
            instance.getCanvas().style.cursor = '';
          });
        }

        setReady(true);
      });

      map.current = instance;
    })();

    return () => {
      disposed = true;
      map.current?.remove();
      map.current = null;
    };
    // Deliberately runs once: subsequent data changes go through the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push filtered data into the existing source rather than rebuilding the map.
  useEffect(() => {
    if (!ready || !map.current) return;
    const source = map.current.getSource('listings') as GeoJSONSource | undefined;
    source?.setData(geojson);
  }, [geojson, ready]);

  const toggle = (slug: DirectorySlug) =>
    setActive((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  return (
    <div className="relative">
      <div className="mb-4 flex flex-wrap gap-2">
        {allDirectories().map((directory) => {
          const count = pins.filter((pin) => pin.directory === directory.slug).length;
          if (count === 0) return null;
          const on = active.has(directory.slug);
          return (
            <button
              key={directory.slug}
              type="button"
              onClick={() => toggle(directory.slug)}
              aria-pressed={on}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                on ? 'border-brand bg-brand text-brand-fg' : 'border-line hover:bg-surface-3',
              )}
            >
              {directory.label}
              <span className="ml-1.5 text-xs opacity-70">{count}</span>
            </button>
          );
        })}
        {active.size > 0 ? (
          <button
            type="button"
            onClick={() => setActive(new Set())}
            className="rounded-full px-3 py-1.5 text-sm text-brand hover:underline"
          >
            Show all
          </button>
        ) : null}
      </div>

      <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-line">
        <div
          ref={container}
          className="h-[60vh] min-h-[26rem] w-full bg-surface-3"
          role="application"
          aria-label={`Map of listings in ${townName}`}
        />

        {selected ? (
          <div className="absolute bottom-4 left-4 right-4 z-10 rounded-[var(--radius-card)] border border-line bg-surface-2 p-4 shadow-[var(--shadow-lift)] sm:max-w-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-brand">
              {DIRECTORY_TYPES[selected.directory]?.singular ?? ''}
            </p>
            <h2 className="mt-1 font-semibold">{selected.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{selected.summary}</p>
            <div className="mt-3 flex items-center gap-3">
              <Link
                href={listingHref({ directory: selected.directory, slug: selected.slug })}
                className="text-sm font-medium text-brand hover:underline"
              >
                View details
              </Link>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-sm text-ink-subtle hover:text-ink"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <p className="mt-3 text-xs text-ink-subtle">
        Showing {visible.length} of {pins.length} mapped listings.
      </p>
    </div>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/section';
import { ListingMap, type MapPin } from '@/components/map/listing-map';
import { JsonLd } from '@/components/seo/json-ld';

import { getRepository } from '@/lib/data';
import { routes } from '@/lib/routes';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getTown, getTownOrigin } from '@/lib/town/context';

// ISR window: 6 hours.
// Must be a literal — Next statically analyses this export. Keep in sync
// with the REVALIDATE reference table in src/config/site.ts.
export const revalidate = 21600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Map of {{town}} — Attractions, Food, Hotels & More',
    description:
      'An interactive map of {{town}}, {{state}}. Every attraction, restaurant, cafe, hotel and shop we have listed, filterable by category.',
    path: routes.map(),
  });
}

export default async function MapPage() {
  const town = await getTown();
  if (!town.features.map) notFound();

  const origin = await getTownOrigin();

  // Only mapped listings, projected down to what the map component needs —
  // sending full bodies to the client would be tens of KB of dead weight.
  const { items } = await getRepository().getListings({
    townSlug: town.slug,
    withCoordinatesOnly: true,
    pageSize: 500,
  });

  const pins: MapPin[] = items
    .filter((listing) => listing.coordinates)
    .map((listing) => ({
      id: listing.id,
      title: listing.title,
      summary: listing.summary,
      directory: listing.directory,
      slug: listing.slug,
      lat: listing.coordinates!.lat,
      lng: listing.coordinates!.lng,
      tier: listing.tier,
    }));

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'Map', href: routes.map() },
  ];

  return (
    <>
      <PageHeader
        title={`Map of ${town.name}`}
        description={`Everything we have listed across ${town.name} district, plotted. Filter by category, tap a pin for details.`}
      >
        <Breadcrumbs items={crumbs} />
      </PageHeader>

      <div className="container-page py-8">
        <ListingMap
          pins={pins}
          center={town.coordinates}
          bounds={town.bounds}
          zoom={town.mapZoom}
          townName={town.name}
        />
      </div>

      <JsonLd data={breadcrumbJsonLd(crumbs, origin)} />
    </>
  );
}

import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CalendarDays, MapPin, Ticket, User } from 'lucide-react';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { Section } from '@/components/ui/section';
import { TierBadge } from '@/components/ui/badge';
import { Prose } from '@/components/content/prose';
import { EventCard } from '@/components/content/event-card';
import { ListingCard } from '@/components/content/listing-card';
import { Gallery } from '@/components/listing/gallery';
import { MapEmbed } from '@/components/listing/map-embed';
import { ShareButtons } from '@/components/listing/share-buttons';
import { ExternalButtonLink } from '@/components/ui/button';
import { AdvertiseCta } from '@/components/marketing/advertise-cta';
import { JsonLd } from '@/components/seo/json-ld';

import { getRepository } from '@/lib/data';
import { formatDistance, mapsUrl } from '@/lib/geo';
import { formatEventDate } from '@/lib/datetime';
import { routes } from '@/lib/routes';
import { breadcrumbJsonLd, eventJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getTown, getTownOrigin } from '@/lib/town/context';

// ISR window: 30 minutes — events go stale fast near their start date.
// Must be a literal — Next statically analyses this export. Keep in sync
// with the REVALIDATE reference table in src/config/site.ts.
export const revalidate = 1800;

interface PageProps {
  params: Promise<{ slug: string }>;
}

/* Dynamic by design — see src/lib/data/cached.ts for the caching strategy. */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const town = await getTown();
  const event = await getRepository().getEventBySlug(town.slug, slug);
  if (!event) return {};

  return buildMetadata({
    title: event.seo.metaTitle ?? `${event.title} — ${town.name}`,
    description: event.seo.metaDescription ?? event.summary,
    path: routes.event(slug),
    image: event.seo.ogImage ?? event.featuredImage,
    type: 'article',
    noindex: event.seo.noindex,
  });
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const town = await getTown();
  if (!town.features.events) notFound();

  const repo = getRepository();
  const event = await repo.getEventBySlug(town.slug, slug);
  if (!event) notFound();

  const origin = await getTownOrigin();
  const path = routes.event(slug);

  const [venue, nearby, otherEvents] = await Promise.all([
    event.venueListingId
      ? repo.getListingsByIds(town.slug, [event.venueListingId])
      : Promise.resolve([]),
    event.coordinates
      ? repo.getNearbyListings({
          townSlug: town.slug,
          origin: event.coordinates,
          directory: ['food', 'cafes', 'hotels'],
          radiusKm: 15,
          limit: 4,
        })
      : Promise.resolve([]),
    repo.getEvents({ townSlug: town.slug, window: 'upcoming', excludeId: event.id, pageSize: 3 }),
  ]);

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'Events', href: routes.events() },
    { label: event.title, href: path },
  ];

  const finished = new Date(event.endsAt ?? event.startsAt).getTime() < Date.now();

  return (
    <>
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
        <Image
          src={event.featuredImage.src}
          alt={event.featuredImage.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="container-page relative -mt-24 sm:-mt-28">
        <div className="rounded-[var(--radius-card)] border border-line bg-surface-2 p-6 shadow-[var(--shadow-lift)] sm:p-8">
          <Breadcrumbs items={crumbs} />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <TierBadge tier={event.tier} />
            {finished ? (
              <span className="rounded-full bg-surface-3 px-2.5 py-1 text-xs text-ink-muted">
                This event has finished
              </span>
            ) : null}
          </div>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">{event.title}</h1>
          <p className="mt-3 max-w-3xl text-lg text-ink-muted">{event.summary}</p>

          <div className="mt-5 flex justify-end">
            <ShareButtons url={`${origin}${path}`} title={event.title} />
          </div>
        </div>
      </div>

      <div className="container-page py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <Prose body={event.body} />

            {event.gallery.length > 0 ? (
              <section>
                <h2 className="mb-4 text-2xl font-bold">Photos</h2>
                <Gallery images={event.gallery} title={event.title} />
              </section>
            ) : null}

            {event.coordinates ? (
              <section>
                <h2 className="mb-4 text-2xl font-bold">Getting there</h2>
                <MapEmbed point={event.coordinates} title={event.venueName} />
                <p className="mt-3 text-sm text-ink-muted">{event.address}</p>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-[var(--radius-card)] border border-line bg-surface-2 p-5">
              <h2 className="mb-4 text-base font-semibold">Details</h2>

              <dl className="space-y-4 text-sm">
                <div className="flex gap-2.5">
                  <dt className="sr-only">When</dt>
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                  <dd>
                    {formatEventDate(event.startsAt, event.endsAt, event.allDay, town.locale)}
                    {event.recurrence ? (
                      <span className="block text-ink-subtle">{event.recurrence}</span>
                    ) : null}
                  </dd>
                </div>

                <div className="flex gap-2.5">
                  <dt className="sr-only">Where</dt>
                  <MapPin className="mt-0.5 size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                  <dd>
                    <span className="block font-medium">{event.venueName}</span>
                    <span className="block text-ink-muted">{event.address}</span>
                  </dd>
                </div>

                {event.organiser ? (
                  <div className="flex gap-2.5">
                    <dt className="sr-only">Organiser</dt>
                    <User className="mt-0.5 size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                    <dd className="text-ink-muted">{event.organiser}</dd>
                  </div>
                ) : null}

                {event.priceNote ? (
                  <div className="flex gap-2.5">
                    <dt className="sr-only">Price</dt>
                    <Ticket className="mt-0.5 size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
                    <dd className="text-ink-muted">{event.priceNote}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-5 space-y-2.5">
                {event.ticketUrl && !finished ? (
                  <ExternalButtonLink href={event.ticketUrl} sponsored size="lg" className="w-full">
                    Get tickets
                  </ExternalButtonLink>
                ) : null}
                {event.coordinates ? (
                  <ExternalButtonLink
                    href={mapsUrl(event.coordinates, event.venueName)!}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Directions
                  </ExternalButtonLink>
                ) : null}
              </div>
            </section>

            {venue.length > 0 && venue[0] ? (
              <section>
                <h2 className="mb-3 text-base font-semibold">Venue</h2>
                <ListingCard listing={venue[0]} variant="compact" />
              </section>
            ) : null}
          </aside>
        </div>
      </div>

      {nearby.length > 0 ? (
        <Section
          title="Eat and stay nearby"
          description="Places within a short distance of the venue."
          className="border-t border-line"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {nearby.map(({ item, distanceKm }) => (
              <ListingCard
                key={item.id}
                listing={item}
                showDirectory
                meta={`${formatDistance(distanceKm)} away`}
              />
            ))}
          </div>
        </Section>
      ) : null}

      {otherEvents.items.length > 0 ? (
        <Section title={`More events in ${town.name}`} href={routes.events()} className="bg-surface-2">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otherEvents.items.map((entry) => (
              <EventCard key={entry.id} event={entry} />
            ))}
          </div>
        </Section>
      ) : null}

      <AdvertiseCta town={town} />

      <JsonLd data={[eventJsonLd(event, town, origin, path), breadcrumbJsonLd(crumbs, origin)]} />
    </>
  );
}

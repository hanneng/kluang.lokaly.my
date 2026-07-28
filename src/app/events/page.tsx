import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { EmptyState, PageHeader } from '@/components/ui/section';
import { EventGrid } from '@/components/content/event-card';
import { Pagination } from '@/components/directory/pagination';
import { AdvertiseCta } from '@/components/marketing/advertise-cta';
import { ButtonLink } from '@/components/ui/button';
import { JsonLd } from '@/components/seo/json-ld';

import { PAGE_SIZE } from '@/config/site';
import { getRepository } from '@/lib/data';
import { parseFilters, type SearchParams } from '@/lib/query-params';
import { eventHref, routes } from '@/lib/routes';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getTown, getTownOrigin } from '@/lib/town/context';
import { cn } from '@/lib/utils';

// ISR window: 30 minutes — events go stale fast near their start date.
// Must be a literal — Next statically analyses this export. Keep in sync
// with the REVALIDATE reference table in src/config/site.ts.
export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Events in {{town}} — What’s On',
    description:
      'Upcoming events in {{town}}, {{state}}: night markets, festivals, community runs and things to do this weekend.',
    path: routes.events(),
  });
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const town = await getTown();
  if (!town.features.events) notFound();

  const origin = await getTownOrigin();
  const resolved = await searchParams;
  const filters = parseFilters(resolved);
  const window = resolved.window === 'past' ? 'past' : 'upcoming';

  const results = await getRepository().getEvents({
    townSlug: town.slug,
    window,
    page: filters.page,
    pageSize: PAGE_SIZE.events,
  });

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'Events', href: routes.events() },
  ];

  const tabs = [
    { key: 'upcoming', label: 'Upcoming', href: routes.events() },
    { key: 'past', label: 'Past events', href: `${routes.events()}?window=past` },
  ];

  return (
    <>
      <PageHeader
        title={`What’s On in ${town.name}`}
        description={`Markets, festivals, runs and community events across ${town.name} district. Organising something? Tell us and we will list it.`}
      >
        <Breadcrumbs items={crumbs} />
      </PageHeader>

      <div className="container-page py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Event period">
            <ul className="flex gap-2">
              {tabs.map((tab) => (
                <li key={tab.key}>
                  <Link
                    href={tab.href}
                    aria-current={window === tab.key ? 'page' : undefined}
                    className={cn(
                      'inline-flex rounded-full px-4 py-2 text-sm font-medium',
                      window === tab.key
                        ? 'bg-brand text-brand-fg'
                        : 'border border-line hover:bg-surface-3',
                    )}
                  >
                    {tab.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ButtonLink href={routes.contact()} variant="outline" size="sm">
            Submit an event
          </ButtonLink>
        </div>

        {results.items.length > 0 ? (
          <EventGrid events={results.items} />
        ) : (
          <EmptyState
            title={window === 'past' ? 'No past events recorded' : 'Nothing listed right now'}
            description={
              window === 'past'
                ? 'We have not archived any events yet.'
                : `We have not got anything on the calendar for ${town.name} at the moment. If you are running something, send it over and we will list it free.`
            }
            action={
              <ButtonLink href={routes.contact()} variant="outline">
                Submit an event
              </ButtonLink>
            }
          />
        )}

        <Pagination
          page={results.page}
          pageSize={results.pageSize}
          total={results.total}
          basePath={routes.events()}
          searchParams={new URLSearchParams(window === 'past' ? { window: 'past' } : {})}
        />
      </div>

      <AdvertiseCta town={town} />

      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs, origin),
          itemListJsonLd(
            results.items.map((event) => ({ name: event.title, url: eventHref(event) })),
            origin,
            `Events in ${town.name}`,
          ),
        ]}
      />
    </>
  );
}

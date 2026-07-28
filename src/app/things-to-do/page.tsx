import type { Metadata } from 'next';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { PageHeader, Section } from '@/components/ui/section';
import { ListingGrid, ListingRail } from '@/components/content/listing-card';
import { EventRail } from '@/components/content/event-card';
import { ArticleCard } from '@/components/content/article-card';
import { AdvertiseCta } from '@/components/marketing/advertise-cta';
import { JsonLd } from '@/components/seo/json-ld';

import { getRepository } from '@/lib/data';
import { routes } from '@/lib/routes';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getTown, getTownOrigin } from '@/lib/town/context';

// ISR window: 6 hours.
// Must be a literal — Next statically analyses this export. Keep in sync
// with the REVALIDATE reference table in src/config/site.ts.
export const revalidate = 21600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Things To Do in {{town}}, {{state}}',
    description:
      'The complete list of things to do in {{town}} — attractions, hikes, markets, events, shopping and the guides that put them in order.',
    path: routes.thingsToDo(),
  });
}

/**
 * Hub page.
 *
 * Targets the highest-volume query pattern for any Malaysian town ("things to
 * do in X") and funnels it into the directories, events and guides. It is a
 * navigational page by design — its job is internal linking, not depth.
 */
export default async function ThingsToDoPage() {
  const town = await getTown();
  const origin = await getTownOrigin();
  const repo = getRepository();

  const [attractions, shopping, events, hiddenGems, guides] = await Promise.all([
    repo.getListings({ townSlug: town.slug, directory: 'attractions', pageSize: 8 }),
    repo.getListings({ townSlug: town.slug, directory: 'shopping', pageSize: 6 }),
    town.features.events
      ? repo.getEvents({ townSlug: town.slug, window: 'upcoming', pageSize: 6 })
      : Promise.resolve(null),
    repo.getListings({ townSlug: town.slug, hiddenGemOnly: true, pageSize: 4 }),
    repo.getArticles({ townSlug: town.slug, kind: ['guide', 'itinerary'], pageSize: 3 }),
  ]);

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'Things To Do', href: routes.thingsToDo() },
  ];

  return (
    <>
      <PageHeader
        title={`Things To Do in ${town.name}`}
        description={`Everything worth your time in ${town.name} district, grouped so you can pick by mood rather than scrolling a single long list.`}
      >
        <Breadcrumbs items={crumbs} />
      </PageHeader>

      {attractions.items.length > 0 ? (
        <Section
          title="Attractions"
          description="Hills, heritage sites, farms and viewpoints."
          href={routes.directory('attractions')}
        >
          <ListingRail listings={attractions.items} />
        </Section>
      ) : null}

      {events && events.items.length > 0 ? (
        <Section
          title="On this month"
          description="Markets, festivals and one-off events."
          href={routes.events()}
          className="bg-surface-2"
        >
          <EventRail events={events.items} />
        </Section>
      ) : null}

      {shopping.items.length > 0 ? (
        <Section
          title="Shopping & markets"
          description="Malls, morning markets and what to take home."
          href={routes.directory('shopping')}
        >
          <ListingRail listings={shopping.items} />
        </Section>
      ) : null}

      {hiddenGems.items.length > 0 ? (
        <Section
          title="Hidden gems"
          description="Worth the detour, usually missed."
          href={routes.hiddenGems()}
          className="bg-surface-2"
        >
          <ListingGrid listings={hiddenGems.items} showDirectory priorityCount={0} />
        </Section>
      ) : null}

      {guides.items.length > 0 ? (
        <Section
          title="Plan it properly"
          description="Our itineraries, with timings and driving distances."
          href={routes.guides()}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.items.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </Section>
      ) : null}

      <AdvertiseCta town={town} />

      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs, origin),
          itemListJsonLd(
            attractions.items.map((listing) => ({
              name: listing.title,
              url: routes.listing(listing.directory, listing.slug),
            })),
            origin,
            `Things to do in ${town.name}`,
          ),
        ]}
      />
    </>
  );
}

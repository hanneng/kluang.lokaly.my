import type { Metadata } from 'next';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { EmptyState, PageHeader } from '@/components/ui/section';
import { ListingGrid } from '@/components/content/listing-card';
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
    title: 'Hidden Gems in {{town}}',
    description:
      'The places in {{town}}, {{state}} that most visitors drive straight past — quiet spots, local favourites and things worth the detour.',
    path: routes.hiddenGems(),
  });
}

/**
 * Hidden gems.
 *
 * Backed by the `hiddenGem` flag on listings rather than a separate content
 * type, so an editor promotes a place into this page with one checkbox.
 */
export default async function HiddenGemsPage() {
  const town = await getTown();
  const origin = await getTownOrigin();
  const repo = getRepository();

  const [gems, guide] = await Promise.all([
    repo.getListings({ townSlug: town.slug, hiddenGemOnly: true, pageSize: 48 }),
    repo.getArticleBySlug(town.slug, 'hidden-gems'),
  ]);

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'Hidden Gems', href: routes.hiddenGems() },
  ];

  return (
    <>
      <PageHeader
        title={`Hidden Gems in ${town.name}`}
        description={`Not secrets exactly — just the parts of ${town.name} that never make it onto a day-trip list. Most of them need you to be awake earlier than you would like.`}
      >
        <Breadcrumbs items={crumbs} />
      </PageHeader>

      <div className="container-page py-10">
        {gems.items.length > 0 ? (
          <ListingGrid listings={gems.items} showDirectory />
        ) : (
          <EmptyState
            title="Nothing flagged yet"
            description={`We have not marked any hidden gems in ${town.name}. Know one?`}
          />
        )}

        {guide ? (
          <div className="mt-12 border-t border-line pt-10">
            <h2 className="mb-5 text-2xl font-bold">The full write-up</h2>
            <ArticleCard article={guide} variant="feature" />
          </div>
        ) : null}
      </div>

      <AdvertiseCta town={town} />

      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs, origin),
          itemListJsonLd(
            gems.items.map((listing) => ({
              name: listing.title,
              url: routes.listing(listing.directory, listing.slug),
            })),
            origin,
            `Hidden gems in ${town.name}`,
          ),
        ]}
      />
    </>
  );
}

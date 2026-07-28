import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { EmptyState, PageHeader } from '@/components/ui/section';
import { ArticleCard, ArticleGrid } from '@/components/content/article-card';
import { Pagination } from '@/components/directory/pagination';
import { AdvertiseCta } from '@/components/marketing/advertise-cta';
import { JsonLd } from '@/components/seo/json-ld';

import { PAGE_SIZE } from '@/config/site';
import { getRepository } from '@/lib/data';
import { parseFilters, type SearchParams } from '@/lib/query-params';
import { articleHref, routes } from '@/lib/routes';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getTown, getTownOrigin } from '@/lib/town/context';

// ISR window: 12 hours.
// Must be a literal — Next statically analyses this export. Keep in sync
// with the REVALIDATE reference table in src/config/site.ts.
export const revalidate = 43200;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Travel Guides to {{town}}',
    description:
      'Long-form travel guides to {{town}}, {{state}} — itineraries, hidden gems, food guides and everything you need to plan a visit.',
    path: routes.guides(),
  });
}

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const town = await getTown();
  if (!town.features.guides) notFound();

  const origin = await getTownOrigin();
  const filters = parseFilters(await searchParams);

  const results = await getRepository().getArticles({
    townSlug: town.slug,
    // Blog posts have their own index; this page is evergreen guides only.
    kind: ['guide', 'itinerary', 'sponsored'],
    page: filters.page,
    pageSize: PAGE_SIZE.articles,
  });

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'Travel Guides', href: routes.guides() },
  ];

  const [lead, ...rest] = results.items;

  return (
    <>
      <PageHeader
        title={`Travel Guides to ${town.name}`}
        description={`Everything we know about ${town.name}, written up properly — itineraries, food guides, and the places worth going out of your way for.`}
      >
        <Breadcrumbs items={crumbs} />
      </PageHeader>

      <div className="container-page py-10">
        {lead ? (
          <div className="space-y-8">
            <ArticleCard article={lead} variant="feature" priority />
            {rest.length > 0 ? <ArticleGrid articles={rest} /> : null}
          </div>
        ) : (
          <EmptyState
            title="No guides published yet"
            description={`We are still writing up ${town.name}. Check back shortly.`}
          />
        )}

        <Pagination
          page={results.page}
          pageSize={results.pageSize}
          total={results.total}
          basePath={routes.guides()}
          searchParams={new URLSearchParams()}
        />
      </div>

      <AdvertiseCta town={town} />

      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs, origin),
          itemListJsonLd(
            results.items.map((article) => ({ name: article.title, url: articleHref(article) })),
            origin,
            `Travel guides to ${town.name}`,
          ),
        ]}
      />
    </>
  );
}

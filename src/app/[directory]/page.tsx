import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { EmptyState, PageHeader } from '@/components/ui/section';
import { FilterBar } from '@/components/directory/filter-bar';
import { Pagination } from '@/components/directory/pagination';
import { ListingGrid } from '@/components/content/listing-card';
import { AdvertiseCta } from '@/components/marketing/advertise-cta';
import { ButtonLink } from '@/components/ui/button';
import { JsonLd } from '@/components/seo/json-ld';

import { getDirectory, isDirectorySlug } from '@/config/directories';
import { PAGE_SIZE } from '@/config/site';
import { getRepository } from '@/lib/data';
import { parseFilters, shouldNoindex, toListingQuery, type SearchParams } from '@/lib/query-params';
import { routes } from '@/lib/routes';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { t } from '@/lib/template';
import { getTown, getTownOrigin } from '@/lib/town/context';

// ISR window: 6 hours.
// Must be a literal — Next statically analyses this export. Keep in sync
// with the REVALIDATE reference table in src/config/site.ts.
export const revalidate = 21600;

interface PageProps {
  params: Promise<{ directory: string }>;
  searchParams: Promise<SearchParams>;
}

/*
 * No `generateStaticParams` here, deliberately.
 *
 * This route's content depends on the request hostname (which town?), so
 * prerendering it would bake one town's listings into HTML served on every
 * domain. Rendering is dynamic; the data underneath is cached per town.
 * @see src/lib/data/cached.ts
 */

const SORT_OPTIONS = [
  { value: 'featured', label: 'Recommended' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'newest', label: 'Recently added' },
  { value: 'alphabetical', label: 'A–Z' },
];

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { directory: slug } = await params;
  if (!isDirectorySlug(slug)) return {};

  const town = await getTown();
  const directory = getDirectory(slug);
  const filters = parseFilters(await searchParams);

  return buildMetadata({
    title: t(directory.seoTitle, town),
    description: t(directory.seoDescription, town),
    path: directory.path,
    noindex: shouldNoindex(filters),
  });
}

export default async function DirectoryIndexPage({ params, searchParams }: PageProps) {
  const { directory: slug } = await params;
  if (!isDirectorySlug(slug)) notFound();

  const town = await getTown();
  const directory = getDirectory(slug);

  // A directory gated behind a disabled feature flag does not exist for this town.
  if (directory.featureFlag && !town.features[directory.featureFlag]) notFound();

  const origin = await getTownOrigin();
  const repo = getRepository();
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);

  const [results, facets] = await Promise.all([
    repo.getListings(
      toListingQuery(town.slug, filters, {
        directory: slug,
        pageSize: PAGE_SIZE.directory,
        sort: filters.sort ?? directory.defaultSort,
      }),
    ),
    repo.getFacets(town.slug, slug),
  ]);

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: directory.label, href: directory.path },
  ];

  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (key === 'page' || value === undefined) continue;
    urlParams.set(key, Array.isArray(value) ? value.join(',') : value);
  }

  const totalLabel =
    results.total === 0
      ? 'No results'
      : `${results.total} ${results.total === 1 ? directory.singular.toLowerCase() : directory.label.toLowerCase()}`;

  return (
    <>
      <PageHeader
        title={t(directory.headline, town)}
        description={t(directory.intro, town)}
      >
        <Breadcrumbs items={crumbs} />
      </PageHeader>

      <div className="container-page py-8">
        <FilterBar
          facets={facets}
          enabled={directory.facets}
          sortOptions={SORT_OPTIONS}
          totalLabel={totalLabel}
        />

        <div className="mt-8">
          {results.items.length > 0 ? (
            <ListingGrid listings={results.items} />
          ) : (
            <EmptyState
              title="Nothing matches those filters"
              description={`We have not listed a ${directory.singular.toLowerCase()} in ${town.name} matching that combination yet. Try removing a filter, or tell us what we are missing.`}
              action={
                <ButtonLink href={directory.path} variant="outline">
                  Clear filters
                </ButtonLink>
              }
            />
          )}
        </div>

        <Pagination
          page={results.page}
          pageSize={results.pageSize}
          total={results.total}
          basePath={directory.path}
          searchParams={urlParams}
        />

        {/* Category links: internal-linking surface and a crawl path to the
            category landing pages, which carry unique indexable copy. */}
        {directory.categories.length > 0 ? (
          <nav aria-label={`${directory.label} categories`} className="mt-12 border-t border-line pt-8">
            <h2 className="mb-4 text-lg font-semibold">
              {t('Browse {{directory}} in {{town}} by category', town, {
                directory: directory.label.toLowerCase(),
              })}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {directory.categories.map((category) => (
                <li key={category.slug}>
                  <a
                    href={routes.directoryCategory(slug, category.slug)}
                    className="inline-flex rounded-full border border-line px-4 py-2 text-sm hover:bg-surface-3"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>

      <AdvertiseCta town={town} />

      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs, origin),
          itemListJsonLd(
            results.items.map((listing) => ({
              name: listing.title,
              url: routes.listing(listing.directory, listing.slug),
            })),
            origin,
            t(directory.headline, town),
          ),
        ]}
      />
    </>
  );
}

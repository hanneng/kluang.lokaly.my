import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { EmptyState, PageHeader } from '@/components/ui/section';
import { ListingGrid } from '@/components/content/listing-card';
import { Pagination } from '@/components/directory/pagination';
import { AdvertiseCta } from '@/components/marketing/advertise-cta';
import { ButtonLink } from '@/components/ui/button';
import { JsonLd } from '@/components/seo/json-ld';

import { getDirectory, isDirectorySlug } from '@/config/directories';
import { PAGE_SIZE } from '@/config/site';
import { getRepository } from '@/lib/data';
import { parseFilters, type SearchParams } from '@/lib/query-params';
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
  params: Promise<{ directory: string; category: string }>;
  searchParams: Promise<SearchParams>;
}

/*
 * Category landing pages.
 *
 * These carry the long-tail SEO load ("budget hotels in Kluang", "halal
 * restaurants in Kluang"). Each has its own H1 and its own descriptive copy
 * from the registry — unlike filtered views, which are noindex.
 *
 * Rendered dynamically and cached at the data layer: the page is town-specific,
 * so a prerendered version would be wrong on every other domain.
 */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { directory: directorySlug, category: categorySlug } = await params;
  if (!isDirectorySlug(directorySlug)) return {};

  const directory = getDirectory(directorySlug);
  const category = directory.categories.find((entry) => entry.slug === categorySlug);
  if (!category) return {};

  const town = await getTown();

  return buildMetadata({
    title: `${category.name} in ${town.name}, ${town.state}`,
    description: `${t(category.description, town)} Compare ${category.name.toLowerCase()} in ${town.name} with photos, locations, prices and contact details.`,
    path: routes.directoryCategory(directorySlug, categorySlug),
  });
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { directory: directorySlug, category: categorySlug } = await params;
  if (!isDirectorySlug(directorySlug)) notFound();

  const directory = getDirectory(directorySlug);
  const category = directory.categories.find((entry) => entry.slug === categorySlug);
  if (!category) notFound();

  const town = await getTown();
  if (directory.featureFlag && !town.features[directory.featureFlag]) notFound();

  const origin = await getTownOrigin();
  const filters = parseFilters(await searchParams);

  const results = await getRepository().getListings({
    townSlug: town.slug,
    directory: directorySlug,
    categorySlug,
    page: filters.page,
    pageSize: PAGE_SIZE.directory,
    sort: filters.sort ?? directory.defaultSort,
  });

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: directory.label, href: directory.path },
    { label: category.name, href: routes.directoryCategory(directorySlug, categorySlug) },
  ];

  const siblings = directory.categories.filter((entry) => entry.slug !== categorySlug);

  return (
    <>
      <PageHeader
        eyebrow={directory.label}
        title={`${category.name} in ${town.name}`}
        description={t(category.description, town)}
      >
        <Breadcrumbs items={crumbs} />
      </PageHeader>

      <div className="container-page py-8">
        {results.items.length > 0 ? (
          <ListingGrid listings={results.items} />
        ) : (
          <EmptyState
            title={`No ${category.name.toLowerCase()} listed yet`}
            description={`We have not covered this category in ${town.name} yet. If you know somewhere that belongs here, tell us.`}
            action={
              <ButtonLink href={routes.contact()} variant="outline">
                Suggest a listing
              </ButtonLink>
            }
          />
        )}

        <Pagination
          page={results.page}
          pageSize={results.pageSize}
          total={results.total}
          basePath={routes.directoryCategory(directorySlug, categorySlug)}
          searchParams={new URLSearchParams()}
        />

        {siblings.length > 0 ? (
          <nav aria-label="Related categories" className="mt-12 border-t border-line pt-8">
            <h2 className="mb-4 text-lg font-semibold">
              Other {directory.label.toLowerCase()} categories
            </h2>
            <ul className="flex flex-wrap gap-2">
              {siblings.map((sibling) => (
                <li key={sibling.slug}>
                  <a
                    href={routes.directoryCategory(directorySlug, sibling.slug)}
                    className="inline-flex rounded-full border border-line px-4 py-2 text-sm hover:bg-surface-3"
                  >
                    {sibling.name}
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
            `${category.name} in ${town.name}`,
          ),
        ]}
      />
    </>
  );
}

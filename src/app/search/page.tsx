import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { EmptyState, PageHeader } from '@/components/ui/section';
import { SearchBox } from '@/components/search/search-box';
import { Badge } from '@/components/ui/badge';
import { JsonLd } from '@/components/seo/json-ld';

import { PAGE_SIZE } from '@/config/site';
import { allDirectories } from '@/config/directories';
import { getRepository } from '@/lib/data';
import type { SearchParams } from '@/lib/query-params';
import { routes } from '@/lib/routes';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getTown, getTownOrigin } from '@/lib/town/context';

/**
 * Search results.
 *
 * Always `noindex`: search-result pages are the canonical example of
 * low-value crawlable surface area, and Google's own guidance is to keep them
 * out of the index. Links from here are still followed.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';

  return buildMetadata({
    title: q ? `Search results for “${q}”` : 'Search {{town}}',
    description: 'Search attractions, food, hotels, events and guides across {{town}}.',
    path: routes.search(),
    noindex: true,
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const town = await getTown();
  const origin = await getTownOrigin();
  const params = await searchParams;
  const term = (typeof params.q === 'string' ? params.q : '').trim();

  const hits = term ? await getRepository().search(town.slug, term, PAGE_SIZE.search) : [];

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'Search', href: routes.search() },
  ];

  return (
    <>
      <PageHeader
        title={term ? `Results for “${term}”` : `Search ${town.name}`}
        description={
          term
            ? `${hits.length} ${hits.length === 1 ? 'result' : 'results'} across listings, guides and events.`
            : 'Find a place to eat, somewhere to stay, or something to do.'
        }
      >
        <div className="space-y-5">
          <Breadcrumbs items={crumbs} />
          <div className="max-w-xl">
            <Suspense fallback={<div className="h-14 rounded-full bg-surface-3" />}>
              <SearchBox size="lg" autoFocus={!term} placeholder={`Search ${town.name}…`} />
            </Suspense>
          </div>
        </div>
      </PageHeader>

      <div className="container-page py-10">
        {term && hits.length === 0 ? (
          <EmptyState
            title={`Nothing found for “${term}”`}
            description="Try a shorter phrase, or browse a category instead."
          />
        ) : null}

        {hits.length > 0 ? (
          <ul className="divide-y divide-[var(--line)] overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-2">
            {hits.map((hit) => (
              <li key={`${hit.kind}-${hit.id}`}>
                <Link href={hit.href} className="flex gap-4 p-4 transition-colors hover:bg-surface-3">
                  {hit.image ? (
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-3">
                      <Image
                        src={hit.image}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge>{hit.badge}</Badge>
                    </div>
                    <p className="font-semibold">{hit.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-ink-muted">{hit.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {!term ? (
          <nav aria-label="Browse categories">
            <h2 className="mb-4 text-lg font-semibold">Or browse by category</h2>
            <ul className="flex flex-wrap gap-2">
              {allDirectories()
                .filter((directory) => !directory.featureFlag || town.features[directory.featureFlag])
                .map((directory) => (
                  <li key={directory.slug}>
                    <Link
                      href={directory.path}
                      className="inline-flex rounded-full border border-line px-4 py-2 text-sm hover:bg-surface-3"
                    >
                      {directory.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        ) : null}
      </div>

      <JsonLd data={breadcrumbJsonLd(crumbs, origin)} />
    </>
  );
}

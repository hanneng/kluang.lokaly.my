import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { EmptyState, PageHeader } from '@/components/ui/section';
import { ArticleGrid } from '@/components/content/article-card';
import { Pagination } from '@/components/directory/pagination';
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
    title: '{{town}} Blog — News, Stories & Local Life',
    description:
      'Stories, news and local knowledge from {{town}}, {{state}} — history, food culture and what is changing around town.',
    path: routes.blog(),
  });
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const town = await getTown();
  if (!town.features.blog) notFound();

  const origin = await getTownOrigin();
  const filters = parseFilters(await searchParams);

  const results = await getRepository().getArticles({
    townSlug: town.slug,
    kind: 'blog',
    page: filters.page,
    pageSize: PAGE_SIZE.articles,
  });

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'Blog', href: routes.blog() },
  ];

  return (
    <>
      <PageHeader
        title={`${town.name} Blog`}
        description={`Stories and local knowledge from ${town.name} — history, food culture and the things residents already know.`}
      >
        <Breadcrumbs items={crumbs} />
      </PageHeader>

      <div className="container-page py-10">
        {results.items.length > 0 ? (
          <ArticleGrid articles={results.items} />
        ) : (
          <EmptyState title="No posts yet" description="Check back shortly." />
        )}

        <Pagination
          page={results.page}
          pageSize={results.pageSize}
          total={results.total}
          basePath={routes.blog()}
          searchParams={new URLSearchParams()}
        />
      </div>

      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs, origin),
          itemListJsonLd(
            results.items.map((article) => ({ name: article.title, url: articleHref(article) })),
            origin,
            `${town.name} blog`,
          ),
        ]}
      />
    </>
  );
}

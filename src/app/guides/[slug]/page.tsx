import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ArticleDetail } from '@/components/content/article-detail';
import { AdvertiseCta } from '@/components/marketing/advertise-cta';
import { JsonLd } from '@/components/seo/json-ld';
import type { Crumb } from '@/components/ui/breadcrumbs';

import { getRepository } from '@/lib/data';
import { routes } from '@/lib/routes';
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getTown, getTownOrigin } from '@/lib/town/context';

// ISR window: 12 hours.
// Must be a literal — Next statically analyses this export. Keep in sync
// with the REVALIDATE reference table in src/config/site.ts.
export const revalidate = 43200;

interface PageProps {
  params: Promise<{ slug: string }>;
}

/*
 * Dynamic by design — the article for a given slug differs per town, so this
 * route cannot be prerendered from a single town's content.
 */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const town = await getTown();
  const article = await getRepository().getArticleBySlug(town.slug, slug);
  if (!article) return {};

  return buildMetadata({
    title: article.seo.metaTitle ?? article.title,
    description: article.seo.metaDescription ?? article.summary,
    path: routes.guide(slug),
    image: article.seo.ogImage ?? article.featuredImage,
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    noindex: article.seo.noindex,
    keywords: article.tags,
  });
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const town = await getTown();
  if (!town.features.guides) notFound();

  const repo = getRepository();
  const article = await repo.getArticleBySlug(town.slug, slug);
  // Blog posts live under /blog — refuse to serve them from two URLs.
  if (!article || article.kind === 'blog') notFound();

  const origin = await getTownOrigin();
  const path = routes.guide(slug);

  const [featuredListings, more] = await Promise.all([
    repo.getListingsByIds(town.slug, article.relatedListingIds),
    repo.getArticles({
      townSlug: town.slug,
      kind: ['guide', 'itinerary'],
      excludeId: article.id,
      pageSize: 3,
    }),
  ]);

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'Travel Guides', href: routes.guides() },
    { label: article.title, href: path },
  ];

  return (
    <>
      <ArticleDetail
        article={article}
        crumbs={crumbs}
        canonical={`${origin}${path}`}
        featuredListings={featuredListings}
        moreArticles={more.items}
      />

      <AdvertiseCta town={town} />

      <JsonLd
        data={[
          articleJsonLd(article, town, origin, path),
          breadcrumbJsonLd(crumbs, origin),
          faqJsonLd(article.faqs),
        ]}
      />
    </>
  );
}

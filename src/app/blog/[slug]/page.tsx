import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ArticleDetail } from '@/components/content/article-detail';
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

/* Dynamic by design — see src/lib/data/cached.ts for the caching strategy. */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const town = await getTown();
  const article = await getRepository().getArticleBySlug(town.slug, slug);
  if (!article) return {};

  return buildMetadata({
    title: article.seo.metaTitle ?? article.title,
    description: article.seo.metaDescription ?? article.summary,
    path: routes.post(slug),
    image: article.seo.ogImage ?? article.featuredImage,
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    noindex: article.seo.noindex,
    keywords: article.tags,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const town = await getTown();
  if (!town.features.blog) notFound();

  const repo = getRepository();
  const article = await repo.getArticleBySlug(town.slug, slug);
  if (!article || article.kind !== 'blog') notFound();

  const origin = await getTownOrigin();
  const path = routes.post(slug);

  const [featuredListings, more] = await Promise.all([
    repo.getListingsByIds(town.slug, article.relatedListingIds),
    repo.getArticles({ townSlug: town.slug, kind: 'blog', excludeId: article.id, pageSize: 3 }),
  ]);

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'Blog', href: routes.blog() },
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

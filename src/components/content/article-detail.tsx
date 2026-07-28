import Image from 'next/image';
import { Clock } from 'lucide-react';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Section } from '@/components/ui/section';
import { Prose } from '@/components/content/prose';
import { FaqSection } from '@/components/content/faq-section';
import { ListingCard } from '@/components/content/listing-card';
import { ArticleCard } from '@/components/content/article-card';
import { ShareButtons } from '@/components/listing/share-buttons';
import { Gallery } from '@/components/listing/gallery';
import { formatDate } from '@/lib/datetime';
import type { Article, Listing } from '@/types/content';

/**
 * Shared article template for /blog/[slug] and /guides/[slug].
 *
 * Both routes exist because blog posts and evergreen guides deserve different
 * URLs and different index pages, but the reading experience is identical, so
 * there is exactly one implementation of it.
 */
export function ArticleDetail({
  article,
  crumbs,
  canonical,
  featuredListings,
  moreArticles,
}: {
  article: Article;
  crumbs: Crumb[];
  canonical: string;
  featuredListings: Listing[];
  moreArticles: Article[];
}) {
  return (
    <>
      <article>
        <header className="border-b border-line bg-surface-2">
          <div className="container-prose py-10">
            <Breadcrumbs items={crumbs} />

            {article.sponsor ? (
              /*
               * Sponsorship disclosure, above the headline rather than buried
               * at the foot. Required by advertising standards and by any
               * reasonable definition of not misleading the reader.
               */
              <div className="mt-4 rounded-[var(--radius-card)] border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
                <strong className="font-semibold">Sponsored content.</strong> This article was paid
                for by{' '}
                {article.sponsor.url ? (
                  <a
                    href={article.sponsor.url}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="underline"
                  >
                    {article.sponsor.name}
                  </a>
                ) : (
                  article.sponsor.name
                )}
                . It was written by our editorial team.
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge tone={article.kind === 'sponsored' ? 'accent' : 'neutral'}>
                {article.kind === 'itinerary'
                  ? 'Itinerary'
                  : article.kind === 'guide'
                    ? 'Guide'
                    : article.kind === 'sponsored'
                      ? 'Sponsored'
                      : 'Article'}
              </Badge>
              <span className="inline-flex items-center gap-1 text-sm text-ink-subtle">
                <Clock className="size-3.5" aria-hidden="true" />
                {article.readingMinutes} min read
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
              {article.title}
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{article.summary}</p>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 text-sm">
              <p className="text-ink-muted">
                <span className="font-medium text-ink">{article.author.name}</span>
                {article.author.role ? ` · ${article.author.role}` : ''}
                <br />
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                {article.updatedAt !== article.publishedAt ? (
                  <>
                    {' · Updated '}
                    <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                  </>
                ) : null}
              </p>
              <ShareButtons url={canonical} title={article.title} />
            </div>
          </div>
        </header>

        <div className="container-prose">
          <figure className="-mt-0 pt-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-surface-3">
              <Image
                src={article.featuredImage.src}
                alt={article.featuredImage.alt}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, 46rem"
                className="object-cover"
              />
            </div>
            {article.featuredImage.credit ? (
              <figcaption className="mt-2 text-xs text-ink-subtle">
                {article.featuredImage.credit}
              </figcaption>
            ) : null}
          </figure>

          <div className="py-10">
            <Prose body={article.body} />
          </div>

          {article.gallery.length > 0 ? (
            <div className="pb-10">
              <h2 className="mb-4 text-2xl font-bold">Photos</h2>
              <Gallery images={article.gallery} title={article.title} />
            </div>
          ) : null}

          {article.faqs.length > 0 ? (
            <div className="pb-12">
              <FaqSection faqs={article.faqs} />
            </div>
          ) : null}

          {article.tags.length > 0 ? (
            <div className="border-t border-line py-8">
              <h2 className="sr-only">Tags</h2>
              <ul className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <li key={tag}>
                    <span className="inline-flex rounded-full bg-surface-3 px-3 py-1 text-xs text-ink-muted">
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </article>

      {/* Places mentioned: the two-way link between editorial and directory. */}
      {featuredListings.length > 0 ? (
        <Section
          title="Places mentioned in this guide"
          description="Everything above, with maps, hours and contact details."
          className="border-t border-line bg-surface-2"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} showDirectory />
            ))}
          </div>
        </Section>
      ) : null}

      {moreArticles.length > 0 ? (
        <Section title="Keep reading">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {moreArticles.map((entry) => (
              <ArticleCard key={entry.id} article={entry} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}

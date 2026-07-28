import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { articleHref } from '@/lib/routes';
import { formatDate } from '@/lib/datetime';
import { cn } from '@/lib/utils';
import type { Article } from '@/types/content';
import { Badge } from '@/components/ui/badge';

const KIND_LABEL: Record<Article['kind'], string> = {
  blog: 'Article',
  guide: 'Guide',
  itinerary: 'Itinerary',
  sponsored: 'Sponsored',
};

export function ArticleCard({
  article,
  variant = 'grid',
  priority = false,
  className,
}: {
  article: Article;
  variant?: 'grid' | 'rail' | 'feature';
  priority?: boolean;
  className?: string;
}) {
  const href = articleHref(article);
  const isFeature = variant === 'feature';

  return (
    <article
      className={cn(
        'group relative flex overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-2 transition-shadow hover:shadow-[var(--shadow-lift)]',
        isFeature ? 'flex-col md:flex-row' : 'h-full flex-col',
        className,
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-surface-3',
          isFeature ? 'aspect-[16/10] md:aspect-auto md:w-1/2' : 'aspect-[16/10]',
        )}
      >
        <Image
          src={article.featuredImage.src}
          alt={article.featuredImage.alt}
          fill
          sizes={isFeature ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, 33vw'}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className={cn('flex flex-1 flex-col p-5', isFeature && 'md:justify-center md:p-8')}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge tone={article.kind === 'sponsored' ? 'accent' : 'neutral'}>
            {KIND_LABEL[article.kind]}
          </Badge>
          <span className="inline-flex items-center gap-1 text-xs text-ink-subtle">
            <Clock className="size-3.5" aria-hidden="true" />
            {article.readingMinutes} min read
          </span>
        </div>

        <h3
          className={cn(
            'font-semibold leading-snug',
            isFeature ? 'text-2xl sm:text-3xl' : 'text-lg',
          )}
        >
          <Link href={href} className="after:absolute after:inset-0 group-hover:text-brand">
            {article.title}
          </Link>
        </h3>

        <p
          className={cn(
            'mt-2 flex-1 text-sm leading-relaxed text-ink-muted',
            isFeature ? 'line-clamp-4 sm:text-base' : 'line-clamp-3',
          )}
        >
          {article.summary}
        </p>

        <p className="mt-4 text-xs text-ink-subtle">
          {article.author.name} · {formatDate(article.publishedAt)}
        </p>
      </div>
    </article>
  );
}

export function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        <ArticleCard key={article.id} article={article} priority={index < 3} />
      ))}
    </div>
  );
}

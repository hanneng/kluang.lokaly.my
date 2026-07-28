import { Star } from 'lucide-react';
import type { Rating } from '@/types/content';
import { cn } from '@/lib/utils';

/**
 * Rating display.
 *
 * The `source` is always shown. An "editorial" score is our own assessment, not
 * an aggregate of user reviews, and presenting it as the latter would be
 * misleading — which is also why editorial scores are excluded from
 * `aggregateRating` structured data.
 */
export function RatingStars({
  rating,
  showCount = true,
  className,
}: {
  rating: Rating | undefined;
  showCount?: boolean;
  className?: string;
}) {
  if (!rating) return null;

  const rounded = Math.round(rating.value * 2) / 2;

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm', className)}>
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((step) => (
          <Star
            key={step}
            className={cn(
              'size-3.5',
              step <= rounded
                ? 'fill-accent text-accent'
                : 'text-line',
            )}
          />
        ))}
      </span>
      <span className="font-medium">{rating.value.toFixed(1)}</span>
      {showCount ? (
        <span className="text-ink-subtle">
          ({rating.count}
          {rating.source === 'editorial' ? ' editorial' : ''})
        </span>
      ) : null}
      <span className="sr-only">
        Rated {rating.value} out of 5 from {rating.count}{' '}
        {rating.source === 'editorial' ? 'editorial assessments' : 'reviews'}
      </span>
    </span>
  );
}

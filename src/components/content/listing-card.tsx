import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { DIRECTORY_TYPES } from '@/config/directories';
import { listingHref } from '@/lib/routes';
import { cn, priceBand } from '@/lib/utils';
import type { Listing } from '@/types/content';
import { TierBadge } from '@/components/ui/badge';
import { RatingStars } from '@/components/ui/rating';

interface ListingCardProps {
  listing: Listing;
  /** `rail` is the fixed-width horizontal-scroll variant. */
  variant?: 'grid' | 'rail' | 'compact';
  /** Shows the directory name — useful on mixed result sets. */
  showDirectory?: boolean;
  /** Rendered under the title, e.g. "1.2 km away". */
  meta?: string;
  /** Only the first screenful of images should be eager. */
  priority?: boolean;
  className?: string;
}

export function ListingCard({
  listing,
  variant = 'grid',
  showDirectory = false,
  meta,
  priority = false,
  className,
}: ListingCardProps) {
  const href = listingHref(listing);
  const directory = DIRECTORY_TYPES[listing.directory];

  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className={cn(
          'group flex gap-3 rounded-[var(--radius-card)] border border-line bg-surface-2 p-3 transition-shadow hover:shadow-[var(--shadow-soft)]',
          className,
        )}
      >
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-3">
          <Image
            src={listing.featuredImage.src}
            alt={listing.featuredImage.alt}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold group-hover:text-brand">{listing.title}</p>
          {meta ? <p className="mt-0.5 text-xs text-ink-subtle">{meta}</p> : null}
          <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{listing.summary}</p>
        </div>
      </Link>
    );
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-2 transition-shadow hover:shadow-[var(--shadow-lift)]',
        variant === 'rail' && 'h-full',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-3">
        <Image
          src={listing.featuredImage.src}
          alt={listing.featuredImage.alt}
          fill
          sizes={
            variant === 'rail'
              ? '(max-width: 640px) 70vw, 18rem'
              : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
          }
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {listing.tier !== 'free' ? (
          <div className="absolute left-3 top-3">
            <TierBadge tier={listing.tier} />
          </div>
        ) : null}

        {listing.hiddenGem ? (
          <div className="absolute right-3 top-3 rounded-full bg-surface-2/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
            Hidden gem
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {showDirectory ? (
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-brand">
            {directory.singular}
          </p>
        ) : null}

        <h3 className="text-lg font-semibold leading-snug">
          {/* Stretched link keeps the whole card clickable without nesting anchors. */}
          <Link href={href} className="after:absolute after:inset-0 group-hover:text-brand">
            {listing.title}
          </Link>
        </h3>

        {meta ? <p className="mt-1 text-xs text-ink-subtle">{meta}</p> : null}

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-muted">
          {listing.summary}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-ink-subtle">
          {listing.rating ? <RatingStars rating={listing.rating} showCount={false} /> : null}
          {listing.priceRange ? (
            <span className="font-medium text-ink-muted">{priceBand(listing.priceRange)}</span>
          ) : null}
          {listing.area ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden="true" />
              {listing.area}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/** Responsive grid used by every directory index. */
export function ListingGrid({
  listings,
  showDirectory,
  priorityCount = 4,
}: {
  listings: Listing[];
  showDirectory?: boolean;
  priorityCount?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing, index) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          showDirectory={showDirectory}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}

/** Horizontal snap rail used on the homepage. */
export function ListingRail({ listings }: { listings: Listing[] }) {
  return (
    <div className="snap-rail">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} variant="rail" />
      ))}
    </div>
  );
}

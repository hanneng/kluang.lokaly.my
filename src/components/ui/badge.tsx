import { Crown, Sparkles, Star } from 'lucide-react';
import type { ListingTier } from '@/types/content';
import { cn } from '@/lib/utils';

export function Badge({
  children,
  className,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'neutral' | 'brand' | 'accent' | 'warn';
}) {
  const tones = {
    neutral: 'bg-surface-3 text-ink-muted',
    brand: 'bg-brand text-brand-fg',
    accent: 'bg-accent text-accent-fg',
    warn: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Commercial tier badge.
 *
 * Paid placements are always visually labelled — a "Featured" card that looks
 * identical to an editorial one is a dark pattern, and it breaks trust with the
 * audience the advertisers are paying to reach.
 */
export function TierBadge({ tier, className }: { tier: ListingTier; className?: string }) {
  if (tier === 'free') return null;

  if (tier === 'sponsored') {
    return (
      <Badge tone="accent" className={className}>
        <Sparkles className="size-3" aria-hidden="true" />
        Sponsored
      </Badge>
    );
  }

  if (tier === 'premium') {
    return (
      <Badge tone="brand" className={className}>
        <Crown className="size-3" aria-hidden="true" />
        Premium
      </Badge>
    );
  }

  return (
    <Badge tone="accent" className={className}>
      <Star className="size-3" aria-hidden="true" />
      Featured
    </Badge>
  );
}

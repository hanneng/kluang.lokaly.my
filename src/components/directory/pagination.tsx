import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Server-rendered pagination.
 *
 * Real `<a>` elements, so pages are crawlable and the browser handles
 * prefetching. `rel="prev"/"next"` is emitted for the same reason.
 */
export function Pagination({
  page,
  pageSize,
  total,
  basePath,
  searchParams,
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  /** Current params, minus `page` — merged into each link. */
  searchParams: URLSearchParams;
}) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return null;

  const hrefFor = (target: number): string => {
    const params = new URLSearchParams(searchParams);
    if (target > 1) params.set('page', String(target));
    else params.delete('page');
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  // Windowed page numbers: 1 … 4 5 [6] 7 8 … 20
  const window = new Set<number>([1, pageCount, page]);
  for (let offset = 1; offset <= 2; offset += 1) {
    if (page - offset > 0) window.add(page - offset);
    if (page + offset <= pageCount) window.add(page + offset);
  }
  const pages = Array.from(window).sort((a, b) => a - b);

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          rel="prev"
          aria-label="Previous page"
          className="inline-flex size-10 items-center justify-center rounded-full border border-line hover:bg-surface-3"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Link>
      ) : null}

      {pages.map((target, index) => {
        const previous = pages[index - 1];
        const gap = previous !== undefined && target - previous > 1;
        return (
          <span key={target} className="flex items-center gap-1.5">
            {gap ? <span className="px-1 text-ink-subtle">…</span> : null}
            <Link
              href={hrefFor(target)}
              aria-current={target === page ? 'page' : undefined}
              className={cn(
                'inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium',
                target === page
                  ? 'bg-brand text-brand-fg'
                  : 'border border-line hover:bg-surface-3',
              )}
            >
              {target}
            </Link>
          </span>
        );
      })}

      {page < pageCount ? (
        <Link
          href={hrefFor(page + 1)}
          rel="next"
          aria-label="Next page"
          className="inline-flex size-10 items-center justify-center rounded-full border border-line hover:bg-surface-3"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}

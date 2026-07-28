'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn, priceBand } from '@/lib/utils';
import type { DirectoryFacets } from '@/lib/data';
import type { FacetId } from '@/config/directories';

/**
 * Directory filter UI.
 *
 * Every control writes to the URL and lets the server re-render. There is no
 * client-side filtering, so results, pagination and SEO stay consistent, and
 * the list works on a slow connection before JS has hydrated.
 */
export function FilterBar({
  facets,
  enabled,
  sortOptions,
  totalLabel,
}: {
  facets: DirectoryFacets;
  enabled: FacetId[];
  sortOptions: Array<{ value: string; label: string }>;
  totalLabel: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const has = (facet: FacetId) => enabled.includes(facet);

  const push = useCallback(
    (mutate: (next: URLSearchParams) => void) => {
      const next = new URLSearchParams(params.toString());
      mutate(next);
      // Any filter change resets pagination — page 3 of a different result set
      // is meaningless.
      next.delete('page');
      const qs = next.toString();
      startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    },
    [params, pathname, router],
  );

  const setSingle = (key: string, value: string | undefined) =>
    push((next) => (value ? next.set(key, value) : next.delete(key)));

  const toggleInList = (key: string, value: string) =>
    push((next) => {
      const current = (next.get(key) ?? '').split(',').filter(Boolean);
      const updated = current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value];
      if (updated.length > 0) next.set(key, updated.join(','));
      else next.delete(key);
    });

  const inList = (key: string, value: string) =>
    (params.get(key) ?? '').split(',').filter(Boolean).includes(value);

  const activeCount = ['category', 'area', 'price', 'rating', 'facilities', 'featured'].filter(
    (key) => params.get(key),
  ).length;

  const clearAll = () =>
    push((next) => {
      for (const key of ['category', 'area', 'price', 'rating', 'facilities', 'featured']) {
        next.delete(key);
      }
    });

  return (
    <div className={cn('space-y-4', pending && 'opacity-60 transition-opacity')}>
      {/* Always-visible row: category pills + sort. */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:bg-surface-3"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filters
          {activeCount > 0 ? (
            <span className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full bg-brand text-xs text-brand-fg">
              {activeCount}
            </span>
          ) : null}
        </button>

        {has('featured') ? (
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line px-4 text-sm hover:bg-surface-3">
            <input
              type="checkbox"
              checked={params.get('featured') === '1'}
              onChange={(event) => setSingle('featured', event.target.checked ? '1' : undefined)}
              className="size-4 accent-[var(--brand)]"
            />
            Featured only
          </label>
        ) : null}

        <div className="flex-1" />

        <p aria-live="polite" className="text-sm text-ink-muted">
          {totalLabel}
        </p>

        <label className="inline-flex items-center gap-2 text-sm">
          <span className="text-ink-subtle">Sort</span>
          <select
            value={params.get('sort') ?? sortOptions[0]?.value ?? 'featured'}
            onChange={(event) => setSingle('sort', event.target.value)}
            className="h-10 rounded-full border border-line bg-surface-2 px-3 text-sm focus:border-brand focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {has('category') && facets.categories.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {facets.categories.map((category) => {
            const active = params.get('category') === category.value;
            return (
              <li key={category.value}>
                <button
                  type="button"
                  onClick={() => setSingle('category', active ? undefined : category.value)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                    active
                      ? 'border-brand bg-brand text-brand-fg'
                      : 'border-line hover:bg-surface-3',
                  )}
                >
                  {category.label}
                  <span className="ml-1.5 text-xs opacity-60">{category.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {/* Expanded panel */}
      {open ? (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface-2 p-5">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {has('area') && facets.areas.length > 0 ? (
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">Area</legend>
                <select
                  value={params.get('area') ?? ''}
                  onChange={(event) => setSingle('area', event.target.value || undefined)}
                  className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-brand focus:outline-none"
                >
                  <option value="">All areas</option>
                  {facets.areas.map((area) => (
                    <option key={area.value} value={area.value}>
                      {area.value} ({area.count})
                    </option>
                  ))}
                </select>
              </fieldset>
            ) : null}

            {has('price') && facets.priceRanges.length > 0 ? (
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">Price</legend>
                <div className="flex flex-wrap gap-2">
                  {facets.priceRanges.map((entry) => (
                    <button
                      key={entry.value}
                      type="button"
                      onClick={() => toggleInList('price', String(entry.value))}
                      aria-pressed={inList('price', String(entry.value))}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-sm',
                        inList('price', String(entry.value))
                          ? 'border-brand bg-brand text-brand-fg'
                          : 'border-line hover:bg-surface-3',
                      )}
                    >
                      {priceBand(entry.value)}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}

            {has('rating') ? (
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">Minimum rating</legend>
                <select
                  value={params.get('rating') ?? ''}
                  onChange={(event) => setSingle('rating', event.target.value || undefined)}
                  className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm focus:border-brand focus:outline-none"
                >
                  <option value="">Any rating</option>
                  <option value="4.5">4.5 and above</option>
                  <option value="4">4.0 and above</option>
                  <option value="3.5">3.5 and above</option>
                </select>
              </fieldset>
            ) : null}

            {has('facilities') && facets.facilities.length > 0 ? (
              <fieldset className="sm:col-span-2 lg:col-span-1">
                <legend className="mb-2 text-sm font-semibold">Facilities</legend>
                <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
                  {facets.facilities.slice(0, 20).map((facility) => (
                    <label key={facility.value} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={inList('facilities', facility.value)}
                        onChange={() => toggleInList('facilities', facility.value)}
                        className="size-4 accent-[var(--brand)]"
                      />
                      <span className="flex-1">{facility.value}</span>
                      <span className="text-xs text-ink-subtle">{facility.count}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </div>

          {activeCount > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            >
              <X className="size-3.5" aria-hidden="true" />
              Clear all filters
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

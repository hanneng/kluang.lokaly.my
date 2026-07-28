'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';

/**
 * Site search entry point.
 *
 * Submits to `/search` as a real navigation rather than fetching inline: the
 * results page is server-rendered, indexable and shareable, and it works
 * without JavaScript because this is a genuine `<form>`.
 */
export function SearchBox({
  placeholder = 'Search…',
  size = 'md',
  autoFocus = false,
  className,
}: {
  placeholder?: string;
  size?: 'md' | 'lg';
  autoFocus?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get('q') ?? '');

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = value.trim();
    router.push(term ? routes.search({ q: term }) : routes.search());
  }

  return (
    <form
      role="search"
      action={routes.search()}
      onSubmit={onSubmit}
      className={cn('relative w-full', className)}
    >
      <label htmlFor="site-search" className="sr-only">
        Search
      </label>
      <Search
        className={cn(
          'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle',
          size === 'lg' ? 'size-5' : 'size-4',
        )}
        aria-hidden="true"
      />
      <input
        id="site-search"
        name="q"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        className={cn(
          'w-full rounded-full border border-line bg-surface-2 pr-28 text-ink placeholder:text-ink-subtle',
          'focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25',
          size === 'lg' ? 'h-14 pl-12 text-base' : 'h-11 pl-10 text-sm',
        )}
      />
      <button
        type="submit"
        className={cn(
          'absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-brand font-medium text-brand-fg transition-opacity hover:opacity-90',
          size === 'lg' ? 'h-11 px-6' : 'h-8 px-4 text-sm',
        )}
      >
        Search
      </button>
    </form>
  );
}

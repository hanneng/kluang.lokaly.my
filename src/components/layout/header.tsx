import Link from 'next/link';
import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { getTown } from '@/lib/town/context';
import { routes } from '@/lib/routes';
import { buildNav } from './nav-data';
import { DesktopNav, MobileNav } from './site-nav';
import { ThemeToggle } from './theme-toggle';
import { SearchBox } from '@/components/search/search-box';

/**
 * Sticky site header.
 *
 * Server component: navigation is derived from the town config at render time,
 * and only the interactive pieces (menus, theme toggle, search input) cross the
 * client boundary.
 */
export async function SiteHeader() {
  const town = await getTown();
  const groups = buildNav(town);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/85 backdrop-blur-md">
      <div className="container-page">
        <div className="flex h-16 items-center gap-3">
          <Link
            href={routes.home()}
            className="flex shrink-0 items-center gap-2 font-bold tracking-tight"
          >
            <span aria-hidden="true" className="text-xl">
              {town.logo.mark}
            </span>
            <span className="text-lg">
              {town.name}
              <span className="ml-1 hidden font-normal text-ink-subtle sm:inline">Guide</span>
            </span>
          </Link>

          <div className="flex-1" />

          <DesktopNav groups={groups} />

          <div className="hidden w-64 xl:block">
            <Suspense fallback={<div className="h-11 rounded-full bg-surface-3" />}>
              <SearchBox placeholder={`Search ${town.name}…`} />
            </Suspense>
          </div>

          <Link
            href={routes.search()}
            aria-label={`Search ${town.name}`}
            className="inline-flex size-10 items-center justify-center rounded-full text-ink-muted hover:bg-surface-3 hover:text-ink xl:hidden"
          >
            <Search className="size-4.5" aria-hidden="true" />
          </Link>

          <ThemeToggle />

          {town.features.advertise ? (
            <Link
              href={routes.advertise()}
              className="hidden h-10 items-center rounded-full bg-brand px-4 text-sm font-medium text-brand-fg transition-opacity hover:opacity-90 lg:inline-flex"
            >
              Advertise
            </Link>
          ) : null}

          <MobileNav
            groups={groups}
            townName={town.name}
            advertiseEnabled={town.features.advertise}
          />
        </div>
      </div>
    </header>
  );
}

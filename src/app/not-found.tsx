import Link from 'next/link';
import { Suspense } from 'react';
import { allDirectories } from '@/config/directories';
import { routes } from '@/lib/routes';
import { getTown } from '@/lib/town/context';
import { ButtonLink } from '@/components/ui/button';
import { SearchBox } from '@/components/search/search-box';

export default async function NotFound() {
  const town = await getTown();

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl" aria-hidden="true">
        {town.logo.mark}
      </p>
      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">This page does not exist</h1>
      <p className="mt-3 max-w-md text-ink-muted">
        It may have moved, or the link may be wrong. Try searching {town.name}, or start from one of
        these.
      </p>

      <div className="mt-8 w-full max-w-md">
        <Suspense fallback={<div className="h-14 rounded-full bg-surface-3" />}>
          <SearchBox size="lg" placeholder={`Search ${town.name}…`} />
        </Suspense>
      </div>

      <nav aria-label="Popular sections" className="mt-8">
        <ul className="flex flex-wrap justify-center gap-2">
          {allDirectories()
            .filter((directory) => !directory.featureFlag || town.features[directory.featureFlag])
            .map((directory) => (
              <li key={directory.slug}>
                <Link
                  href={directory.path}
                  className="inline-flex rounded-full border border-line px-4 py-2 text-sm hover:bg-surface-3"
                >
                  {directory.label}
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      <ButtonLink href={routes.home()} className="mt-8">
        Back to the homepage
      </ButtonLink>
    </div>
  );
}

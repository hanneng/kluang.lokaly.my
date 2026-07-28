'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Route-level error boundary.
 *
 * Shows a plain, honest message rather than pretending nothing went wrong.
 * The digest is surfaced so a reader can quote it when reporting the problem.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[route error]', error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-3xl font-bold sm:text-4xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-ink-muted">
        This page failed to load. It is our problem, not yours — trying again often works.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset} size="lg">
          Try again
        </Button>
        <a
          href="/"
          className="inline-flex h-13 items-center justify-center rounded-full border border-line px-7 font-medium hover:bg-surface-3"
        >
          Back to the homepage
        </a>
      </div>

      {error.digest ? (
        <p className="mt-6 text-xs text-ink-subtle">Reference: {error.digest}</p>
      ) : null}
    </div>
  );
}

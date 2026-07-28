'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { isOpenNow, summariseOpeningHours } from '@/lib/datetime';
import { cn } from '@/lib/utils';
import type { OpeningHours } from '@/types/content';

/**
 * Opening hours with a live open/closed indicator.
 *
 * Client-side and mounted-gated: "open now" depends on the current time, which
 * differs between the build, the server and the visitor's device. Rendering it
 * during SSR would either poison the ISR cache or mismatch on hydration.
 */
export function OpeningHoursPanel({
  hours,
  verified,
}: {
  hours: OpeningHours | undefined;
  verified: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!hours) return null;

  const rows = summariseOpeningHours(hours);
  const open = mounted ? isOpenNow(hours) : undefined;

  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-surface-2 p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold">
          <Clock className="size-4 text-ink-subtle" aria-hidden="true" />
          Opening hours
        </h2>

        {open !== undefined ? (
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-medium',
              open
                ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                : 'bg-surface-3 text-ink-muted',
            )}
          >
            {open ? 'Open now' : 'Closed now'}
          </span>
        ) : null}
      </div>

      <dl className="space-y-1.5 text-sm">
        {rows.map((row) => {
          const [label, ...rest] = row.split(': ');
          return (
            <div key={row} className="flex justify-between gap-4">
              <dt className="text-ink-muted">{label}</dt>
              <dd className="text-right">{rest.join(': ')}</dd>
            </div>
          );
        })}
      </dl>

      {!verified ? (
        <p className="mt-3 text-xs text-ink-subtle">
          Hours are indicative and have not been confirmed with the business. Call ahead if it
          matters.
        </p>
      ) : null}
    </section>
  );
}

import { Info } from 'lucide-react';

/**
 * Shown on listings a human has not yet checked.
 *
 * Sample and imported data can be wrong in ways that waste a reader's evening —
 * a closed restaurant, a wrong address. Saying so plainly is both honest and
 * the thing that makes the verified listings worth trusting.
 */
export function UnverifiedNotice({ townName }: { townName: string }) {
  return (
    <aside className="flex gap-3 rounded-[var(--radius-card)] border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        <strong className="font-semibold">Not yet verified.</strong> We have not confirmed the
        opening hours, contact details or prices on this page with the business. Please check before
        travelling.{' '}
        <a href="/contact" className="underline">
          Spotted something wrong in {townName}?
        </a>
      </p>
    </aside>
  );
}

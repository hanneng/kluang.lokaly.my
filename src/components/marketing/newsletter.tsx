'use client';

import { useActionState } from 'react';
import { Mail } from 'lucide-react';
import { subscribeToNewsletter, type NewsletterState } from '@/app/actions/newsletter';
import { Button } from '@/components/ui/button';

const INITIAL: NewsletterState = { status: 'idle' };

/**
 * Newsletter signup.
 *
 * Uses a server action, so it degrades to a normal form post without JS.
 * The action only records the address — nothing is sent from here.
 */
export function NewsletterSignup({ townName }: { townName: string }) {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, INITIAL);

  return (
    <section className="py-12">
      <div className="container-page">
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-2 px-6 py-10 sm:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Mail className="size-5" aria-hidden="true" />
            </span>

            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
              What&rsquo;s on in {townName}, once a month
            </h2>
            <p className="mt-3 text-ink-muted">
              New places, upcoming events and the occasional thing we think you&rsquo;d otherwise
              miss. No more than one email a month, and easy to leave.
            </p>

            {state.status === 'success' ? (
              <p className="mt-6 rounded-full bg-brand/10 px-5 py-3 text-sm font-medium text-brand">
                {state.message}
              </p>
            ) : (
              <form action={formAction} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-12 flex-1 rounded-full border border-line bg-surface px-5 text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
                />
                {/* Honeypot — bots fill it, humans never see it. */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />
                <Button type="submit" size="lg" disabled={pending}>
                  {pending ? 'Subscribing…' : 'Subscribe'}
                </Button>
              </form>
            )}

            {state.status === 'error' ? (
              <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
                {state.message}
              </p>
            ) : null}

            <p className="mt-4 text-xs text-ink-subtle">
              We only use your address for this newsletter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

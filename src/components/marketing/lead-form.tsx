'use client';

import { useActionState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { submitLead, type LeadState } from '@/app/actions/leads';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const INITIAL: LeadState = { status: 'idle' };

const FIELD =
  'h-12 w-full rounded-xl border border-line bg-surface px-4 text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25';

/**
 * Enquiry form, shared by /advertise and /contact.
 *
 * Progressive enhancement: it is a real `<form>` bound to a server action, so
 * it submits without JavaScript. With JS, `useActionState` gives inline
 * validation and a pending state.
 */
export function LeadForm({
  kind,
  packages,
  submitLabel = 'Send enquiry',
  defaultPackage,
}: {
  kind: 'advertise' | 'contact';
  packages?: Array<{ id: string; name: string }>;
  submitLabel?: string;
  defaultPackage?: string;
}) {
  const [state, formAction, pending] = useActionState(submitLead, INITIAL);

  if (state.status === 'success') {
    return (
      <div className="rounded-[var(--radius-card)] border border-brand/30 bg-brand/5 p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-brand" aria-hidden="true" />
        <h3 className="mt-4 text-xl font-semibold">Message sent</h3>
        <p className="mt-2 text-ink-muted">{state.message}</p>
      </div>
    );
  }

  const error = (field: string) => state.errors?.[field];

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="kind" value={kind} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className="mb-1.5 block text-sm font-medium">
            Your name <span className="text-ink-subtle">*</span>
          </label>
          <input
            id="lead-name"
            name="name"
            required
            autoComplete="name"
            aria-invalid={Boolean(error('name'))}
            aria-describedby={error('name') ? 'lead-name-error' : undefined}
            className={cn(FIELD, error('name') && 'border-red-500')}
          />
          {error('name') ? (
            <p id="lead-name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error('name')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lead-email" className="mb-1.5 block text-sm font-medium">
            Email <span className="text-ink-subtle">*</span>
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(error('email'))}
            aria-describedby={error('email') ? 'lead-email-error' : undefined}
            className={cn(FIELD, error('email') && 'border-red-500')}
          />
          {error('email') ? (
            <p id="lead-email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error('email')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lead-phone" className="mb-1.5 block text-sm font-medium">
            Phone / WhatsApp
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={FIELD}
          />
        </div>

        {kind === 'advertise' ? (
          <div>
            <label htmlFor="lead-business" className="mb-1.5 block text-sm font-medium">
              Business name
            </label>
            <input id="lead-business" name="business" autoComplete="organization" className={FIELD} />
          </div>
        ) : null}
      </div>

      {packages && packages.length > 0 ? (
        <div>
          <label htmlFor="lead-package" className="mb-1.5 block text-sm font-medium">
            Interested in
          </label>
          <select
            id="lead-package"
            name="packageId"
            defaultValue={defaultPackage ?? ''}
            className={FIELD}
          >
            <option value="">Not sure yet — advise me</option>
            {packages.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
            <option value="other">Something else</option>
          </select>
        </div>
      ) : null}

      <div>
        <label htmlFor="lead-message" className="mb-1.5 block text-sm font-medium">
          Message <span className="text-ink-subtle">*</span>
        </label>
        <textarea
          id="lead-message"
          name="message"
          required
          rows={5}
          aria-invalid={Boolean(error('message'))}
          aria-describedby={error('message') ? 'lead-message-error' : undefined}
          placeholder={
            kind === 'advertise'
              ? 'Tell us about your business and what you are hoping to achieve.'
              : 'How can we help?'
          }
          className={cn(
            'w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25',
            error('message') && 'border-red-500',
          )}
        />
        {error('message') ? (
          <p id="lead-message-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error('message')}
          </p>
        ) : null}
      </div>

      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {state.status === 'error' && !state.errors ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? 'Sending…' : submitLabel}
        </Button>
        <p className="text-xs text-ink-subtle">
          We reply within two working days. Your details are used only to answer this enquiry.
        </p>
      </div>
    </form>
  );
}

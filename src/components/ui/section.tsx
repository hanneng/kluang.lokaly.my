import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Section wrapper used by every homepage rail and index page block.
 * Keeps vertical rhythm and heading hierarchy consistent site-wide.
 */
export function Section({
  title,
  description,
  href,
  linkLabel = 'See all',
  children,
  className,
  headingLevel = 'h2',
  id,
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  children: ReactNode;
  className?: string;
  headingLevel?: 'h2' | 'h3';
  id?: string;
}) {
  const Heading = headingLevel;

  return (
    <section className={cn('py-10 sm:py-14', className)} id={id}>
      <div className="container-page">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-2xl">
            <Heading className="text-2xl font-bold sm:text-3xl">{title}</Heading>
            {description ? (
              <p className="mt-2 text-ink-muted">{description}</p>
            ) : null}
          </div>

          {href ? (
            <Link
              href={href}
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            >
              {linkLabel}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          ) : null}
        </div>

        {children}
      </div>
    </section>
  );
}

/** Page-level heading block used at the top of index and detail pages. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line bg-surface-2">
      <div className="container-page py-10 sm:py-14">
        {eyebrow ? (
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-brand">{eyebrow}</p>
        ) : null}
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-muted">{description}</p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </header>
  );
}

/** Empty state shown when a filter combination returns nothing. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-surface-2 px-6 py-16 text-center">
      <p className="text-lg font-semibold">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-colors ' +
  'disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-brand-fg hover:opacity-90',
  accent: 'bg-accent text-accent-fg hover:opacity-90',
  secondary: 'bg-surface-3 text-ink hover:bg-line',
  outline: 'border border-line text-ink hover:bg-surface-3',
  ghost: 'text-ink-muted hover:text-ink hover:bg-surface-3',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-13 px-7 text-base',
};

export interface ButtonStyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function buttonClass({ variant = 'primary', size = 'md', className }: ButtonStyleProps = {}) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export function Button({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonStyleProps & ComponentProps<'button'>) {
  return (
    <button className={buttonClass({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}

/** Internal navigation styled as a button. */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: ButtonStyleProps & ComponentProps<typeof Link> & { children: ReactNode }) {
  return (
    <Link href={href} className={buttonClass({ variant, size, className })} {...props}>
      {children}
    </Link>
  );
}

/** External link styled as a button — always gets rel="noopener". */
export function ExternalButtonLink({
  href,
  variant,
  size,
  className,
  children,
  sponsored = false,
  ...props
}: ButtonStyleProps &
  ComponentProps<'a'> & { href: string; children: ReactNode; sponsored?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      // Affiliate and paid-placement links must be marked, both for Google and
      // for honesty about the commercial relationship.
      rel={sponsored ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}
      className={buttonClass({ variant, size, className })}
      {...props}
    >
      {children}
    </a>
  );
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind-aware class merge. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    // Strip combining marks left behind by decomposition (é -> e).
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Truncate on a word boundary — used for generated meta descriptions. */
export function truncate(input: string, max: number): string {
  const clean = input.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}

/** `RM` price band rendering, e.g. 2 → "RM RM". */
export function priceBand(range: number | undefined): string {
  if (!range) return '';
  return 'RM'.repeat(Math.max(1, Math.min(4, range)));
}

export function formatMoney(amount: number, currency = 'MYR', locale = 'en-MY'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Deterministic pick from a list — keeps placeholder imagery stable per slug. */
export function pickDeterministic<T>(items: readonly T[], seed: string): T {
  if (items.length === 0) throw new Error('pickDeterministic requires a non-empty list');
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return items[hash % items.length] as T;
}

/** Build a `wa.me` deep link with a pre-filled message. */
export function whatsappLink(number: string, message?: string): string {
  const digits = number.replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

/** Chunk an array — used for masonry-ish column layouts. */
export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

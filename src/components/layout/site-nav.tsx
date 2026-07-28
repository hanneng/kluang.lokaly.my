'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routes';
import type { NavGroup } from './nav-data';

/* -------------------------------------------------------------------------- */
/* Desktop                                                                     */
/* -------------------------------------------------------------------------- */

function DesktopGroup({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapper = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on route change and on outside interaction.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const isActive = group.items.some((item) => pathname.startsWith(item.href));

  return (
    <div
      ref={wrapper}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors',
          isActive ? 'text-brand' : 'text-ink-muted hover:text-ink',
        )}
      >
        {group.label}
        <ChevronDown
          className={cn('size-3.5 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      <div
        id={menuId}
        className={cn(
          'absolute left-0 top-full z-50 w-72 pt-2 transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <ul className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-2 p-2 shadow-[var(--shadow-lift)]">
          {group.items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-surface-3"
              >
                {item.icon ? (
                  <span className="mt-0.5 text-brand">
                    <Icon name={item.icon} className="size-4" />
                  </span>
                ) : null}
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{item.label}</span>
                  {item.description ? (
                    <span className="mt-0.5 block truncate text-xs text-ink-subtle">
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function DesktopNav({ groups }: { groups: NavGroup[] }) {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
      {groups.map((group) => (
        <DesktopGroup key={group.id} group={group} />
      ))}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile                                                                      */
/* -------------------------------------------------------------------------- */

export function MobileNav({
  groups,
  townName,
  advertiseEnabled,
}: {
  groups: NavGroup[];
  townName: string;
  advertiseEnabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  // Prevent the page behind the sheet from scrolling.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-surface-3 lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${townName} navigation`}
            className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="font-semibold">{townName}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex size-10 items-center justify-center rounded-full hover:bg-surface-3"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Primary" className="flex-1 overflow-y-auto px-4 py-4">
              <Link
                href={routes.search()}
                className="mb-4 flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-ink-muted"
              >
                <Search className="size-4" aria-hidden="true" />
                Search {townName}
              </Link>

              {groups.map((group) => (
                <div key={group.id} className="mb-5">
                  <p className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                    {group.label}
                  </p>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] hover:bg-surface-3"
                        >
                          {item.icon ? (
                            <span className="text-brand">
                              <Icon name={item.icon} className="size-4" />
                            </span>
                          ) : null}
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            {advertiseEnabled ? (
              <div className="border-t border-line p-4">
                <Link
                  href={routes.advertise()}
                  className="flex h-11 w-full items-center justify-center rounded-full bg-brand font-medium text-brand-fg"
                >
                  Advertise with us
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

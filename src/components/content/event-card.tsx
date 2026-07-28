import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, MapPin, Repeat } from 'lucide-react';
import { eventHref } from '@/lib/routes';
import { formatEventDate } from '@/lib/datetime';
import { cn } from '@/lib/utils';
import type { TownEvent } from '@/types/content';
import { TierBadge } from '@/components/ui/badge';

export function EventCard({
  event,
  variant = 'grid',
  priority = false,
  className,
}: {
  event: TownEvent;
  variant?: 'grid' | 'rail';
  priority?: boolean;
  className?: string;
}) {
  const start = new Date(event.startsAt);
  const day = new Intl.DateTimeFormat('en-MY', { day: 'numeric', timeZone: 'Asia/Kuala_Lumpur' }).format(start);
  const month = new Intl.DateTimeFormat('en-MY', { month: 'short', timeZone: 'Asia/Kuala_Lumpur' }).format(start);

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-2 transition-shadow hover:shadow-[var(--shadow-lift)]',
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-3">
        <Image
          src={event.featuredImage.src}
          alt={event.featuredImage.alt}
          fill
          sizes={variant === 'rail' ? '(max-width: 640px) 70vw, 18rem' : '(max-width: 640px) 100vw, 33vw'}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Date chip — the primary scanning affordance on an events list. */}
        <div className="absolute left-3 top-3 flex flex-col items-center rounded-xl bg-surface-2/95 px-3 py-1.5 text-center shadow-[var(--shadow-soft)] backdrop-blur">
          <span className="text-lg font-bold leading-none">{day}</span>
          <span className="text-[0.65rem] font-medium uppercase tracking-wide text-ink-subtle">
            {month}
          </span>
        </div>

        {event.tier !== 'free' ? (
          <div className="absolute right-3 top-3">
            <TierBadge tier={event.tier} />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold leading-snug">
          <Link href={eventHref(event)} className="after:absolute after:inset-0 group-hover:text-brand">
            {event.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-muted">
          {event.summary}
        </p>

        <dl className="mt-3 space-y-1.5 text-sm text-ink-subtle">
          <div className="flex items-start gap-1.5">
            <dt className="sr-only">Date</dt>
            <CalendarDays className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <dd>{formatEventDate(event.startsAt, event.endsAt, event.allDay)}</dd>
          </div>
          <div className="flex items-start gap-1.5">
            <dt className="sr-only">Venue</dt>
            <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <dd className="line-clamp-1">{event.venueName}</dd>
          </div>
          {event.recurrence ? (
            <div className="flex items-start gap-1.5">
              <dt className="sr-only">Recurrence</dt>
              <Repeat className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              <dd>{event.recurrence}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </article>
  );
}

export function EventGrid({ events }: { events: TownEvent[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} priority={index < 3} />
      ))}
    </div>
  );
}

export function EventRail({ events }: { events: TownEvent[] }) {
  return (
    <div className="snap-rail">
      {events.map((event) => (
        <EventCard key={event.id} event={event} variant="rail" />
      ))}
    </div>
  );
}

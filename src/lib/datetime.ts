import type { OpeningHours, Weekday } from '@/types/content';

export const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

/** schema.org day names, required by the `OpeningHoursSpecification` type. */
export const SCHEMA_DAYS: Record<Weekday, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export function formatTime(time: string): string {
  const [hourRaw, minute = '00'] = time.split(':');
  const hour = Number(hourRaw);
  if (Number.isNaN(hour)) return time;
  const suffix = hour >= 12 ? 'pm' : 'am';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return minute === '00' ? `${display}${suffix}` : `${display}.${minute}${suffix}`;
}

/**
 * Collapse consecutive days with identical hours into ranges, the way a
 * signboard would write them: "Mon–Fri 8am–5pm", "Sat 8am–1pm", "Sun Closed".
 */
export function summariseOpeningHours(hours: OpeningHours | undefined): string[] {
  if (!hours) return [];

  const describe = (day: Weekday): string => {
    const slots = hours[day];
    if (slots === undefined) return 'Not stated';
    if (slots === null || slots.length === 0) return 'Closed';
    return slots.map((slot) => `${formatTime(slot.opens)}–${formatTime(slot.closes)}`).join(', ');
  };

  const rows: string[] = [];
  let rangeStart = 0;

  for (let i = 0; i < WEEKDAYS.length; i += 1) {
    const current = WEEKDAYS[i]!;
    const next = WEEKDAYS[i + 1];
    const sameAsNext = next !== undefined && describe(current) === describe(next);
    if (sameAsNext) continue;

    const startDay = WEEKDAYS[rangeStart]!;
    const label =
      rangeStart === i
        ? WEEKDAY_LABELS[startDay].slice(0, 3)
        : `${WEEKDAY_LABELS[startDay].slice(0, 3)}–${WEEKDAY_LABELS[current].slice(0, 3)}`;
    rows.push(`${label}: ${describe(current)}`);
    rangeStart = i + 1;
  }

  return rows;
}

/**
 * Is the place open at `reference`?
 *
 * Returns `undefined` when hours are unknown, so the UI can distinguish
 * "closed" from "we don't know" — important while seed data is unverified.
 */
export function isOpenNow(
  hours: OpeningHours | undefined,
  reference: Date = new Date(),
): boolean | undefined {
  if (!hours) return undefined;

  // JS weeks start on Sunday; our vocabulary starts on Monday.
  const day = WEEKDAYS[(reference.getDay() + 6) % 7]!;
  const slots = hours[day];
  if (slots === undefined) return undefined;
  if (slots === null) return false;

  const minutes = reference.getHours() * 60 + reference.getMinutes();
  return slots.some((slot) => {
    const [oh = '0', om = '0'] = slot.opens.split(':');
    const [ch = '0', cm = '0'] = slot.closes.split(':');
    const open = Number(oh) * 60 + Number(om);
    let close = Number(ch) * 60 + Number(cm);
    // Past-midnight closing, e.g. supper stalls open until 02:00.
    if (close <= open) close += 24 * 60;
    return minutes >= open && minutes < close;
  });
}

export function formatEventDate(
  startsAt: string,
  endsAt: string | undefined,
  allDay: boolean,
  locale = 'en-MY',
  timeZone = 'Asia/Kuala_Lumpur',
): string {
  const start = new Date(startsAt);
  const end = endsAt ? new Date(endsAt) : undefined;

  const dateFmt = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone,
  });
  const timeFmt = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  });

  const sameDay = end ? dateFmt.format(start) === dateFmt.format(end) : true;

  if (allDay) {
    return sameDay || !end
      ? dateFmt.format(start)
      : `${dateFmt.format(start)} – ${dateFmt.format(end)}`;
  }

  if (!end) return `${dateFmt.format(start)}, ${timeFmt.format(start)}`;
  if (sameDay) {
    return `${dateFmt.format(start)}, ${timeFmt.format(start)}–${timeFmt.format(end)}`;
  }
  return `${dateFmt.format(start)} ${timeFmt.format(start)} – ${dateFmt.format(end)} ${timeFmt.format(end)}`;
}

export function formatDate(iso: string, locale = 'en-MY', timeZone = 'Asia/Kuala_Lumpur'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(new Date(iso));
}

/** Rough reading time, at ~220 words per minute. */
export function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

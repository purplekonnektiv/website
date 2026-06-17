import type { NostrEvent } from '@nostrify/nostrify';

export interface CalendarEventView {
  id: string;
  event: NostrEvent;
  title: string;
  summary?: string;
  imageUrl?: string;
  locations: string[];
  references: string[];
  startDate: Date;
  endDate?: Date;
  startLabel: string;
  endLabel?: string;
  timezone?: string;
  isAllDay: boolean;
  isPast: boolean;
}

const IMAGE_EXTENSIONS = /\.(?:avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i;
const URL_PATTERN = /https?:\/\/[^\s<>"'`]+/gi;

export function sanitizeUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:') return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function shortPubkey(pubkey: string): string {
  return `${pubkey.slice(0, 8)}:${pubkey.slice(-6)}`;
}

export function getTagValues(event: NostrEvent, tagName: string): string[] {
  return event.tags
    .filter(([name, value]) => name === tagName && Boolean(value))
    .map(([, value]) => value);
}

export function getFirstTagValue(event: NostrEvent, tagName: string): string | undefined {
  return getTagValues(event, tagName)[0];
}

export function extractImageUrls(event: NostrEvent): string[] {
  const candidates = new Set<string>();

  for (const match of event.content.matchAll(URL_PATTERN)) {
    const safeUrl = sanitizeUrl(match[0]);
    if (safeUrl && IMAGE_EXTENSIONS.test(safeUrl)) {
      candidates.add(safeUrl);
    }
  }

  for (const tag of event.tags) {
    const [name, ...values] = tag;
    if (name === 'image' || name === 'url') {
      const safeUrl = sanitizeUrl(values[0]);
      if (safeUrl) candidates.add(safeUrl);
    }

    if (name === 'imeta') {
      for (const value of values) {
        const [key, ...rest] = value.split(' ');
        if (key === 'url') {
          const safeUrl = sanitizeUrl(rest.join(' '));
          if (safeUrl) candidates.add(safeUrl);
        }
      }
    }
  }

  return [...candidates].slice(0, 4);
}

export function stripImageUrls(content: string): string {
  return content.replace(URL_PATTERN, (value) => (
    IMAGE_EXTENSIONS.test(value) ? '' : value
  )).trim();
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const eventTime = timestamp * 1000;
  const diffSeconds = Math.round((eventTime - now) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  for (const [unit, secondsPerUnit] of units) {
    if (absSeconds >= secondsPerUnit) {
      return formatter.format(Math.round(diffSeconds / secondsPerUnit), unit);
    }
  }

  return 'just now';
}

export function normalizeCalendarEvent(event: NostrEvent, now = new Date()): CalendarEventView | undefined {
  if (event.kind !== 31922 && event.kind !== 31923) return undefined;

  const d = getFirstTagValue(event, 'd');
  const title = getFirstTagValue(event, 'title');
  const start = getFirstTagValue(event, 'start');

  if (!d || !title || !start) return undefined;

  if (event.kind === 31923 && !getFirstTagValue(event, 'D')) {
    return undefined;
  }

  const isAllDay = event.kind === 31922;
  const startDate = isAllDay ? parseDateOnly(start) : parseUnixSeconds(start);
  if (!startDate) return undefined;

  const endValue = getFirstTagValue(event, 'end');
  const endDate = endValue
    ? (isAllDay ? parseDateOnly(endValue) : parseUnixSeconds(endValue))
    : undefined;

  const summary = (getFirstTagValue(event, 'summary') ?? event.content.trim()) || undefined;
  const imageUrl = sanitizeUrl(getFirstTagValue(event, 'image'));
  const locations = getTagValues(event, 'location');
  const references = getTagValues(event, 'r').map(sanitizeUrl).filter((value): value is string => Boolean(value));
  const startTimezone = getFirstTagValue(event, 'start_tzid');
  const endTimezone = getFirstTagValue(event, 'end_tzid');
  const timezone = startTimezone ?? endTimezone;
  const isPast = (endDate ?? startDate).getTime() < now.getTime();

  return {
    id: `${event.kind}:${event.pubkey}:${d}`,
    event,
    title,
    summary,
    imageUrl,
    locations,
    references,
    startDate,
    endDate,
    startLabel: formatCalendarDate(startDate, isAllDay, timezone),
    endLabel: endDate ? formatCalendarDate(endDate, isAllDay, timezone) : undefined,
    timezone,
    isAllDay,
    isPast,
  };
}

function parseDateOnly(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseUnixSeconds(value: string): Date | undefined {
  if (!/^\d+$/.test(value)) return undefined;
  const date = new Date(Number(value) * 1000);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatCalendarDate(date: Date, isAllDay: boolean, timezone: string | undefined): string {
  const formatter = new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: isAllDay ? undefined : 'short',
    timeZone: timezone,
  });

  return formatter.format(date);
}

import type { NostrEvent } from '@nostrify/nostrify';
import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';

import { normalizeCalendarEvent, type CalendarEventView } from '@/lib/nostrContent';

const PURPLE_TAG = 'purplekonnektiv';

export function usePurpleKonnektivFeed() {
  const { nostr } = useNostr();

  return useQuery<NostrEvent[]>({
    queryKey: ['nostr', 'purplekonnektiv', 'feed'],
    queryFn: async (context) => {
      const events = await nostr.query(
        [{ kinds: [1, 20], '#t': [PURPLE_TAG], limit: 30 }],
        { signal: context.signal },
      );

      return events
        .filter((event) => event.kind === 1 || event.kind === 20)
        .sort((a, b) => b.created_at - a.created_at);
    },
  });
}

export function usePurpleKonnektivCalendar() {
  const { nostr } = useNostr();

  return useQuery<CalendarEventView[]>({
    queryKey: ['nostr', 'purplekonnektiv', 'calendar'],
    queryFn: async (context) => {
      const events = await nostr.query(
        [{ kinds: [31922, 31923], '#t': [PURPLE_TAG], limit: 50 }],
        { signal: context.signal },
      );

      return events
        .map((event) => normalizeCalendarEvent(event))
        .filter((event): event is CalendarEventView => Boolean(event))
        .sort((a, b) => {
          if (a.isPast !== b.isPast) return a.isPast ? 1 : -1;
          return a.startDate.getTime() - b.startDate.getTime();
        });
    },
  });
}

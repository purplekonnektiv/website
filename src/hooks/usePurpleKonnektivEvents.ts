import type { NostrEvent } from '@nostrify/nostrify';
import { useNostr } from '@nostrify/react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

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

export function usePurpleKonnektivFeedPages(pageSize = 12) {
  const { nostr } = useNostr();

  return useInfiniteQuery<NostrEvent[]>({
    queryKey: ['nostr', 'purplekonnektiv', 'feed', 'pages', pageSize],
    initialPageParam: undefined,
    queryFn: async ({ pageParam, signal }) => {
      const until = typeof pageParam === 'number' ? pageParam : undefined;
      const events = await nostr.query(
        [{
          kinds: [1, 20],
          '#t': [PURPLE_TAG],
          limit: pageSize,
          ...(until ? { until } : {}),
        }],
        { signal },
      );

      return events
        .filter((event) => event.kind === 1 || event.kind === 20)
        .sort((a, b) => b.created_at - a.created_at);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.length < pageSize) return undefined;
      return Math.min(...lastPage.map((event) => event.created_at)) - 1;
    },
  });
}

export function usePurpleKonnektivPost(id: string | undefined) {
  const { nostr } = useNostr();

  return useQuery<NostrEvent | undefined>({
    queryKey: ['nostr', 'purplekonnektiv', 'post', id],
    enabled: Boolean(id),
    queryFn: async (context) => {
      if (!id) return undefined;

      const events = await nostr.query(
        [{ ids: [id], kinds: [1, 20], limit: 1 }],
        { signal: context.signal },
      );

      return events.find((event) => event.kind === 1 || event.kind === 20);
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

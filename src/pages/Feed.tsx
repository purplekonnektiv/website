import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';

import { FeedCard, FeedSkeleton, StateCard } from '@/components/PurpleKonnektivHome';
import { Button } from '@/components/ui/button';
import { usePurpleKonnektivFeedPages } from '@/hooks/usePurpleKonnektivEvents';

export default function Feed() {
  const feed = usePurpleKonnektivFeedPages(12);
  const events = feed.data?.pages.flat() ?? [];

  useSeoMeta({
    title: 'Feed - PurpleKonnektiv',
    description: 'Meetup notes, gathering photos, event recaps, and community context from PurpleKonnektiv.',
  });

  return (
    <main className="min-h-screen bg-[#241232] text-[#fffdf7] dark:bg-[#0f0a14]">
      <section className="border-b-2 border-[#fffdf7] bg-[#241232] dark:border-[#a855f7] dark:bg-[#151019]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <Button asChild variant="outline" className="mb-8 rounded-[4px] border-2 border-[#fffdf7] !bg-[#fffdf7] !text-[#241232] shadow-[3px_3px_0_#a855f7] dark:!border-[#e879f9] dark:!bg-[#241232] dark:!text-[#fffdf7]">
            <Link to="/">
              <ArrowLeft className="mr-2 size-4" />
              Back home
            </Link>
          </Button>
          <p className="font-mono text-sm font-bold uppercase text-[#e879f9]">Community feed</p>
          <h1 className="mt-3 text-5xl font-black leading-none sm:text-7xl">Meetup notes and recaps</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#d8c4ea]">
            A longer stream of PurpleKonnektiv gathering notes, images, recaps, and follow-up context.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {feed.isLoading ? (
          <FeedSkeleton />
        ) : feed.isError ? (
          <StateCard title="The feed is quiet right now" text="Try refreshing, or check your connections if the stream stays empty." inverted />
        ) : events.length === 0 ? (
          <StateCard title="No meetup notes yet" text="Posts connected to PurpleKonnektiv meetups and events will appear here." inverted />
        ) : (
          <>
            <div className="grid gap-5 lg:grid-cols-3">
              {events.map((event) => (
                <FeedCard key={event.id} event={event} />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Button
                type="button"
                onClick={() => feed.fetchNextPage()}
                disabled={!feed.hasNextPage || feed.isFetchingNextPage}
                className="h-12 rounded-[4px] border-2 border-[#fffdf7] !bg-[#6d28d9] px-6 font-bold !text-white shadow-[4px_4px_0_#e879f9] hover:!bg-[#5b21b6] disabled:opacity-60"
              >
                {feed.isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Loading
                  </>
                ) : feed.hasNextPage ? 'Load more' : 'All caught up'}
              </Button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

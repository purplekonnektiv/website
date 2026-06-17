import { useSeoMeta } from '@unhead/react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { FeedCard, StateCard } from '@/components/PurpleKonnektivHome';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePurpleKonnektivPost } from '@/hooks/usePurpleKonnektivEvents';

const EVENT_ID_PATTERN = /^[0-9a-f]{64}$/i;

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const normalizedId = id?.toLowerCase();
  const isValidId = Boolean(normalizedId && EVENT_ID_PATTERN.test(normalizedId));
  const post = usePurpleKonnektivPost(isValidId ? normalizedId : undefined);

  useSeoMeta({
    title: 'Post - PurpleKonnektiv',
    description: 'A PurpleKonnektiv meetup note, image, or recap from Nostr.',
  });

  return (
    <main className="min-h-screen bg-[#241232] text-[#fffdf7] dark:bg-[#0f0a14]">
      <section className="border-b-2 border-[#fffdf7] bg-[#241232] dark:border-[#a855f7] dark:bg-[#151019]">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
          <Button asChild variant="outline" className="mb-8 rounded-[4px] border-2 border-[#fffdf7] !bg-[#fffdf7] !text-[#241232] shadow-[3px_3px_0_#a855f7] dark:!border-[#e879f9] dark:!bg-[#241232] dark:!text-[#fffdf7]">
            <Link to="/feed">
              <ArrowLeft className="mr-2 size-4" />
              Back to feed
            </Link>
          </Button>
          <p className="font-mono text-sm font-bold uppercase text-[#e879f9]">Community post</p>
          <h1 className="mt-3 text-5xl font-black leading-none sm:text-7xl">PurpleKonnektiv note</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#d8c4ea]">
            A single post from the PurpleKonnektiv stream.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        {!isValidId ? (
          <StateCard title="This post link looks incomplete" text="Open a post from the feed so the website can fetch the right Nostr event." inverted />
        ) : post.isLoading ? (
          <PostSkeleton />
        ) : post.isError ? (
          <StateCard title="This post needs another moment" text="Try refreshing, or check your relay connections if it does not appear." inverted />
        ) : post.data ? (
          <FeedCard event={post.data} linkToPost={false} />
        ) : (
          <StateCard title="Post not found" text="Your connected relays did not return this kind 1 or kind 20 post." inverted />
        )}
      </section>
    </main>
  );
}

function PostSkeleton() {
  return (
    <div className="border-2 border-[#fffdf7] bg-[#fffdf7] p-4 dark:border-[#a855f7] dark:bg-[#241232]">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full bg-[#d8c4ea]" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-4 w-32 bg-[#d8c4ea]" />
          <Skeleton className="h-3 w-20 bg-[#d8c4ea]" />
        </div>
      </div>
      <Skeleton className="mt-5 h-40 bg-[#d8c4ea]" />
      <Skeleton className="mt-4 h-64 bg-[#d8c4ea]" />
    </div>
  );
}

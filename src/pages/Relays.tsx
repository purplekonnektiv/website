import { ArrowLeft, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';

import { RelayListManager } from '@/components/RelayListManager';
import { Button } from '@/components/ui/button';

export default function Relays() {
  useSeoMeta({
    title: 'Connections - PurpleKonnektiv',
    description: 'View and edit where PurpleKonnektiv connects for social activity.',
  });

  return (
    <main className="min-h-screen bg-[#f7f2ff] text-[#151019] dark:bg-[#151019] dark:text-[#fffdf7]">
      <section className="border-b-2 border-[#241232] bg-[#fffdf7] dark:border-[#a855f7] dark:bg-[#1c1027]">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
          <Button asChild variant="outline" className="mb-8 rounded-[4px] border-2 border-[#241232] !bg-[#fffdf7] !text-[#241232] shadow-[3px_3px_0_#a855f7] dark:!border-[#a855f7] dark:!bg-[#241232] dark:!text-[#fffdf7]">
            <Link to="/">
              <ArrowLeft className="mr-2 size-4" />
              Back home
            </Link>
          </Button>

          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center border-2 border-[#241232] bg-[#f7c948] text-[#241232] shadow-[4px_4px_0_#241232] dark:border-[#a855f7] dark:shadow-[4px_4px_0_#6d28d9]">
              <Wifi className="size-6" />
            </span>
            <p className="font-mono text-sm font-bold uppercase text-[#6d28d9] dark:text-[#e879f9]">Connections</p>
          </div>
          <h1 className="mt-5 text-5xl font-black leading-none text-[#241232] dark:text-[#fffdf7] sm:text-7xl">
            Your connections
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#3b234f] dark:text-[#d8c4ea]">
            Choose where PurpleKonnektiv listens for community posts, profiles, and events. You can add, remove, or adjust each connection.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <div className="border-2 border-[#241232] bg-[#fffdf7] p-5 shadow-[8px_8px_0_#6d28d9] dark:border-[#a855f7] dark:bg-[#241232] dark:shadow-[8px_8px_0_#6d28d9] sm:p-8">
          <RelayListManager />
        </div>
      </section>
    </main>
  );
}

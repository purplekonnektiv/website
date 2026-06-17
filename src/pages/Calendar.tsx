import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, ExternalLink, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';

import { StateCard } from '@/components/PurpleKonnektivHome';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePurpleKonnektivCalendar } from '@/hooks/usePurpleKonnektivEvents';
import type { CalendarEventView } from '@/lib/nostrContent';
import { cn } from '@/lib/utils';

export default function Calendar() {
  const calendar = usePurpleKonnektivCalendar();
  const events = calendar.data ?? [];
  const firstEventDate = events.find((event) => !event.isPast)?.startDate ?? events[0]?.startDate ?? new Date();
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1));

  useSeoMeta({
    title: 'Calendar - PurpleKonnektiv',
    description: 'A dedicated calendar for PurpleKonnektiv meetups, calls, workshops, and gatherings.',
  });

  const monthDays = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth]);
  const monthLabel = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(visibleMonth);

  const goToMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  return (
    <main className="min-h-screen bg-[#f7f2ff] text-[#151019] dark:bg-[#151019] dark:text-[#fffdf7]">
      <section className="border-b-2 border-[#241232] bg-[#fffdf7] dark:border-[#a855f7] dark:bg-[#1c1027]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <Button asChild variant="outline" className="mb-8 rounded-[4px] border-2 border-[#241232] !bg-[#fffdf7] !text-[#241232] shadow-[3px_3px_0_#a855f7] dark:!border-[#a855f7] dark:!bg-[#241232] dark:!text-[#fffdf7]">
            <Link to="/">
              <ArrowLeft className="mr-2 size-4" />
              Back home
            </Link>
          </Button>
          <p className="font-mono text-sm font-bold uppercase text-[#6d28d9] dark:text-[#e879f9]">Community calendar</p>
          <h1 className="mt-3 text-5xl font-black leading-none text-[#241232] dark:text-[#fffdf7] sm:text-7xl">
            PurpleKonnektiv gatherings
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#3b234f] dark:text-[#d8c4ea]">
            Meetups, calls, workshops, and local hangouts in a dedicated calendar view.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {calendar.isLoading ? (
          <CalendarPageSkeleton />
        ) : calendar.isError ? (
          <StateCard title="The calendar needs a moment" text="Try refreshing, or check your connections if events do not appear." />
        ) : events.length === 0 ? (
          <StateCard title="No events yet" text="Upcoming PurpleKonnektiv gatherings will appear here when the community shares them." />
        ) : (
          <div className="border-2 border-[#241232] bg-[#fffdf7] shadow-[8px_8px_0_#6d28d9] dark:border-[#a855f7] dark:bg-[#241232]">
            <div className="flex flex-col gap-4 border-b-2 border-[#241232] p-5 dark:border-[#a855f7] md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center border-2 border-[#241232] bg-[#f7c948] text-[#241232] shadow-[3px_3px_0_#241232] dark:border-[#a855f7]">
                  <CalendarDays className="size-5" />
                </span>
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-[#6d28d9] dark:text-[#e879f9]">Month view</p>
                  <h2 className="text-3xl font-black text-[#241232] dark:text-[#fffdf7]">{monthLabel}</h2>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="icon" onClick={() => goToMonth(-1)} aria-label="Previous month" className="rounded-[4px] border-2 border-[#241232] !bg-[#fffdf7] !text-[#241232] dark:!border-[#a855f7] dark:!bg-[#151019] dark:!text-[#fffdf7]">
                  <ChevronLeft className="size-4" />
                </Button>
                <Button type="button" variant="outline" onClick={() => setVisibleMonth(new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1))} className="rounded-[4px] border-2 border-[#241232] !bg-[#fffdf7] !text-[#241232] dark:!border-[#a855f7] dark:!bg-[#151019] dark:!text-[#fffdf7]">
                  Jump to events
                </Button>
                <Button type="button" variant="outline" size="icon" onClick={() => goToMonth(1)} aria-label="Next month" className="rounded-[4px] border-2 border-[#241232] !bg-[#fffdf7] !text-[#241232] dark:!border-[#a855f7] dark:!bg-[#151019] dark:!text-[#fffdf7]">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b-2 border-[#241232] bg-[#f7f2ff] dark:border-[#a855f7] dark:bg-[#1c1027]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center font-mono text-xs font-bold uppercase text-[#6d28d9] dark:text-[#e879f9]">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-7">
              {monthDays.map((day) => {
                const dayEvents = events.filter((event) => isSameCalendarDay(event.startDate, day));
                const inMonth = day.getMonth() === visibleMonth.getMonth();

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'min-h-40 border-b border-r border-[#d9c7e7] p-3 dark:border-[#6d28d9]/60',
                      !inMonth && 'bg-[#f7f2ff]/60 text-[#7b638b] dark:bg-[#151019]/50 dark:text-[#8f78a0]',
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className={cn('font-mono text-sm font-bold', inMonth ? 'text-[#241232] dark:text-[#fffdf7]' : 'text-[#7b638b] dark:text-[#8f78a0]')}>
                        {day.getDate()}
                      </span>
                      {dayEvents.length > 0 ? <span className="rounded-full bg-[#17a673] px-2 py-0.5 text-xs font-bold text-white">{dayEvents.length}</span> : null}
                    </div>
                    <div className="grid gap-2">
                      {dayEvents.map((event) => (
                        <CalendarEventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function CalendarEventCard({ event }: { event: CalendarEventView }) {
  return (
    <article className="border border-[#a855f7] bg-[#f7f2ff] p-2 shadow-[2px_2px_0_#a855f7] dark:bg-[#151019]">
      <h3 className="line-clamp-2 text-sm font-black leading-tight text-[#241232] dark:text-[#fffdf7]">{event.title}</h3>
      <p className="mt-1 text-xs font-semibold text-[#5f4a6f] dark:text-[#d8c4ea]">{event.isAllDay ? 'All day' : event.startLabel}</p>
      {event.locations[0] ? (
        <p className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs text-[#5f4a6f] dark:text-[#d8c4ea]">
          <MapPin className="size-3 shrink-0 text-[#6d28d9] dark:text-[#e879f9]" />
          {event.locations[0]}
        </p>
      ) : null}
      {event.references[0] ? (
        <a href={event.references[0]} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#6d28d9] underline-offset-4 hover:underline dark:text-[#e879f9]">
          Details
          <ExternalLink className="size-3" />
        </a>
      ) : null}
    </article>
  );
}

function CalendarPageSkeleton() {
  return (
    <div className="border-2 border-[#241232] bg-[#fffdf7] p-5 dark:border-[#a855f7] dark:bg-[#241232]">
      <Skeleton className="h-12 w-64 bg-[#d8c4ea]" />
      <div className="mt-6 grid gap-2 sm:grid-cols-7">
        {Array.from({ length: 21 }, (_, index) => (
          <Skeleton key={index} className="h-32 bg-[#d8c4ea]" />
        ))}
      </div>
    </div>
  );
}

function buildMonthDays(month: Date): Date[] {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const firstGridDate = new Date(monthStart);
  firstGridDate.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(firstGridDate);
    day.setDate(firstGridDate.getDate() + index);
    return day;
  });
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

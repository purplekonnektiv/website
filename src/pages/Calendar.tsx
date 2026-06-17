import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, ExternalLink, Loader2, MapPin, Plus } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { useQueryClient } from '@tanstack/react-query';

import { LoginArea } from '@/components/auth/LoginArea';
import { StateCard } from '@/components/PurpleKonnektivHome';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useToast } from '@/hooks/useToast';
import { usePurpleKonnektivCalendar } from '@/hooks/usePurpleKonnektivEvents';
import { sanitizeUrl, type CalendarEventView } from '@/lib/nostrContent';
import { cn } from '@/lib/utils';

export default function Calendar() {
  const calendar = usePurpleKonnektivCalendar();
  const { user } = useCurrentUser();
  const events = calendar.data ?? [];
  const firstEventDate = events.find((event) => !event.isPast)?.startDate ?? events[0]?.startDate ?? new Date();
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1));
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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
          <div className="mt-8">
            <CreateEventDialog
              open={createDialogOpen}
              onOpenChange={setCreateDialogOpen}
              onCreated={(date) => {
                setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
              }}
              isLoggedIn={Boolean(user)}
            />
          </div>
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

function CreateEventDialog({
  open,
  onOpenChange,
  onCreated,
  isLoggedIn,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (date: Date) => void;
  isLoggedIn: boolean;
}) {
  const publish = useNostrPublish();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAllDay, setIsAllDay] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [detailsUrl, setDetailsUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [formError, setFormError] = useState<string | undefined>();

  const resetForm = () => {
    setIsAllDay(false);
    setTitle('');
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setLocation('');
    setDetailsUrl('');
    setSummary('');
    setFormError(undefined);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(undefined);

    const cleanTitle = title.trim();
    const cleanLocation = location.trim();
    const cleanSummary = summary.trim();
    const cleanDetailsUrl = detailsUrl.trim();
    const safeDetailsUrl = cleanDetailsUrl ? sanitizeUrl(cleanDetailsUrl) : undefined;

    if (!cleanTitle) {
      setFormError('Please add a title.');
      return;
    }

    if (!startDate) {
      setFormError('Please choose a start date.');
      return;
    }

    if (!isAllDay && !startTime) {
      setFormError('Please choose a start time, or mark the event as all day.');
      return;
    }

    if (cleanDetailsUrl && !safeDetailsUrl) {
      setFormError('Please use an https:// details link.');
      return;
    }

    const start = isAllDay ? startDate : parseLocalDateTime(startDate, startTime);
    const end = endDate ? (isAllDay ? endDate : parseLocalDateTime(endDate, endTime || startTime)) : undefined;

    if (!start) {
      setFormError('Please choose a valid start date and time.');
      return;
    }

    if (typeof end === 'string' && typeof start === 'string' && end < start) {
      setFormError('Please choose an end date after the start.');
      return;
    }

    if (end instanceof Date && start instanceof Date && end.getTime() <= start.getTime()) {
      setFormError('Please choose an end time after the start.');
      return;
    }

    const kind = isAllDay ? 31922 : 31923;
    const startTagValue = typeof start === 'string' ? start : secondsFromDate(start).toString();
    const tags: string[][] = [
      ['d', createEventIdentifier(cleanTitle, startDate)],
      ['title', cleanTitle],
      ['start', startTagValue],
      ['t', 'purplekonnektiv'],
    ];

    if (!isAllDay) tags.push(['D', startDate]);
    if (end) tags.push(['end', typeof end === 'string' ? end : secondsFromDate(end).toString()]);
    if (cleanSummary) tags.push(['summary', cleanSummary]);
    if (cleanLocation) tags.push(['location', cleanLocation]);
    if (safeDetailsUrl) tags.push(['r', safeDetailsUrl]);

    try {
      await publish.mutateAsync({
        kind,
        content: cleanSummary,
        tags,
      });
      await queryClient.invalidateQueries({ queryKey: ['nostr', 'purplekonnektiv', 'calendar'] });
      toast({
        title: 'Event published',
        description: 'Your PurpleKonnektiv calendar event is on its way to the relays.',
      });
      onCreated(start instanceof Date ? start : new Date(`${start}T00:00:00`));
      resetForm();
      onOpenChange(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Publishing failed. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-12 rounded-[4px] border-2 border-[#241232] !bg-[#6d28d9] px-6 text-base font-bold !text-white shadow-[4px_4px_0_#241232] hover:!bg-[#5b21b6] dark:!border-[#e879f9] dark:shadow-[4px_4px_0_#e879f9]">
          <Plus className="mr-2 size-4" />
          Create event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[4px] border-2 border-[#241232] bg-[#fffdf7] text-[#241232] shadow-[8px_8px_0_#6d28d9] dark:border-[#a855f7] dark:bg-[#241232] dark:text-[#fffdf7]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-[#241232] dark:text-[#fffdf7]">Create calendar event</DialogTitle>
          <DialogDescription className="text-[#5f4a6f] dark:text-[#d8c4ea]">
            Add a meetup, call, workshop, or gathering to the PurpleKonnektiv calendar.
          </DialogDescription>
        </DialogHeader>

        {!isLoggedIn ? (
          <div className="border-2 border-dashed border-[#a855f7] bg-[#f7f2ff] p-5 dark:bg-[#151019]">
            <p className="mb-4 text-sm font-semibold leading-6 text-[#3b234f] dark:text-[#d8c4ea]">
              Sign in with your Nostr account to publish a calendar event.
            </p>
            <LoginArea className="max-w-64" />
          </div>
        ) : (
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="event-title" className="font-bold text-[#241232] dark:text-[#fffdf7]">Title</Label>
              <Input id="event-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="PurpleKonnektiv meetup" className="rounded-[4px] border-2 border-[#241232] bg-white dark:border-[#a855f7] dark:bg-[#151019]" />
            </div>

            <div className="flex items-center justify-between gap-4 border-2 border-[#a855f7] bg-[#f7f2ff] p-3 dark:bg-[#151019]">
              <Label htmlFor="event-all-day" className="font-bold text-[#241232] dark:text-[#fffdf7]">All day</Label>
              <Switch id="event-all-day" checked={isAllDay} onCheckedChange={setIsAllDay} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="event-start-date" className="font-bold text-[#241232] dark:text-[#fffdf7]">Start date</Label>
                <Input id="event-start-date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="rounded-[4px] border-2 border-[#241232] bg-white dark:border-[#a855f7] dark:bg-[#151019]" />
              </div>
              {!isAllDay ? (
                <div className="grid gap-2">
                  <Label htmlFor="event-start-time" className="font-bold text-[#241232] dark:text-[#fffdf7]">Start time</Label>
                  <Input id="event-start-time" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} className="rounded-[4px] border-2 border-[#241232] bg-white dark:border-[#a855f7] dark:bg-[#151019]" />
                </div>
              ) : null}
              <div className="grid gap-2">
                <Label htmlFor="event-end-date" className="font-bold text-[#241232] dark:text-[#fffdf7]">End date</Label>
                <Input id="event-end-date" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="rounded-[4px] border-2 border-[#241232] bg-white dark:border-[#a855f7] dark:bg-[#151019]" />
              </div>
              {!isAllDay ? (
                <div className="grid gap-2">
                  <Label htmlFor="event-end-time" className="font-bold text-[#241232] dark:text-[#fffdf7]">End time</Label>
                  <Input id="event-end-time" type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} className="rounded-[4px] border-2 border-[#241232] bg-white dark:border-[#a855f7] dark:bg-[#151019]" />
                </div>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event-location" className="font-bold text-[#241232] dark:text-[#fffdf7]">Location</Label>
              <Input id="event-location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Online, Berlin, local cafe..." className="rounded-[4px] border-2 border-[#241232] bg-white dark:border-[#a855f7] dark:bg-[#151019]" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event-details" className="font-bold text-[#241232] dark:text-[#fffdf7]">Details link</Label>
              <Input id="event-details" type="url" value={detailsUrl} onChange={(event) => setDetailsUrl(event.target.value)} placeholder="https://..." className="rounded-[4px] border-2 border-[#241232] bg-white dark:border-[#a855f7] dark:bg-[#151019]" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event-summary" className="font-bold text-[#241232] dark:text-[#fffdf7]">Summary</Label>
              <Textarea id="event-summary" value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="What should people know before they show up?" className="min-h-28 rounded-[4px] border-2 border-[#241232] bg-white dark:border-[#a855f7] dark:bg-[#151019]" />
            </div>

            {formError ? <p className="text-sm font-bold text-[#b42318] dark:text-[#fda29b]">{formError}</p> : null}

            <DialogFooter>
              <Button type="submit" disabled={publish.isPending} className="h-11 rounded-[4px] border-2 border-[#241232] !bg-[#6d28d9] px-5 font-bold !text-white shadow-[3px_3px_0_#241232] hover:!bg-[#5b21b6] disabled:opacity-60 dark:!border-[#e879f9] dark:shadow-[3px_3px_0_#e879f9]">
                {publish.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Publishing
                  </>
                ) : 'Publish event'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
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

function parseLocalDateTime(date: string, time: string): Date | undefined {
  const parsed = new Date(`${date}T${time}`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function secondsFromDate(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

function createEventIdentifier(title: string, date: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'purplekonnektiv-event';

  return `${slug}-${date}-${Date.now().toString(36)}`;
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

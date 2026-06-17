import type { NostrEvent, NostrMetadata } from '@nostrify/nostrify';
import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  MapPin,
  Monitor,
  Moon,
  Radio,
  Sparkles,
  Sun,
  Users,
  Wifi,
} from 'lucide-react';

import { LoginArea } from '@/components/auth/LoginArea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthor } from '@/hooks/useAuthor';
import { usePurpleKonnektivCalendar, usePurpleKonnektivFeed } from '@/hooks/usePurpleKonnektivEvents';
import { useTheme } from '@/hooks/useTheme';
import {
  type CalendarEventView,
  extractImageUrls,
  formatRelativeTime,
  sanitizeUrl,
  shortPubkey,
  stripImageUrls,
} from '@/lib/nostrContent';
import { cn } from '@/lib/utils';

const tickerItems = [
  '#purplekonnektiv',
  'Nostr native',
  'Dezentrale soziale Medien',
  'Open protocols',
  'Kind 1 + Kind 20',
  'NIP-52 events',
  'Relays over platforms',
];

const navItems = [
  { label: 'Mission', href: '#mission' },
  { label: 'Feed', href: '#feed' },
  { label: 'Calendar', href: '#calendar' },
  { label: 'Docs', href: '#docs' },
];

export function PurpleKonnektivHome() {
  const feed = usePurpleKonnektivFeed();
  const calendar = usePurpleKonnektivCalendar();
  const feedEvents = feed.data ?? [];
  const calendarEvents = calendar.data ?? [];
  const upcomingEvents = calendarEvents.filter((event) => !event.isPast);
  const pastEvents = calendarEvents.filter((event) => event.isPast).slice(0, 3);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f2ff] text-[#151019] selection:bg-[#e879f9] selection:text-[#241232] dark:bg-[#151019] dark:text-[#fffdf7] dark:selection:bg-[#a855f7] dark:selection:text-[#fffdf7]">
      <SiteNav />
      <Ticker />

      <main>
        <section className="relative isolate border-b-2 border-[#241232] dark:border-[#a855f7]">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(36,18,50,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(36,18,50,0.08)_1px,transparent_1px)] bg-[size:28px_28px] dark:bg-[linear-gradient(rgba(168,85,247,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.18)_1px,transparent_1px)]" />
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:py-24">
            <div className="space-y-8">
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-[4px] border-2 border-[#241232] bg-[#f7c948] px-3 py-1 font-mono text-[#241232] shadow-[3px_3px_0_#241232]">
                  <Radio className="mr-1 size-3.5" />
                  live from the relays
                </Badge>
                <Badge className="rounded-[4px] border-2 border-[#241232] bg-[#fffdf7] px-3 py-1 font-mono text-[#241232] shadow-[3px_3px_0_#6d28d9]">
                  #purplekonnektiv
                </Badge>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-5xl font-black uppercase leading-[0.86] tracking-normal text-[#241232] text-[3.25rem] dark:text-[#fffdf7] sm:text-[6rem] lg:text-[8.5rem]">
                  Purple
                  <span className="block text-[#6d28d9]">Konnektiv</span>
                </h1>
                <p className="max-w-3xl text-xl font-semibold leading-8 text-[#3b234f] dark:text-[#d8c4ea] sm:text-2xl sm:leading-9">
                  A Nostr-native signal for humans who think decentralized social media and open information protocols matter.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-12 rounded-[4px] border-2 border-[#241232] !bg-[#6d28d9] px-6 text-base font-bold !text-white shadow-[4px_4px_0_#241232] hover:!bg-[#5b21b6] dark:!border-[#e879f9] dark:shadow-[4px_4px_0_#e879f9]">
                  <a href="#feed">
                    Explore the feed
                    <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-12 rounded-[4px] border-2 border-[#241232] !bg-[#fffdf7] px-6 text-base font-bold !text-[#241232] shadow-[4px_4px_0_#a855f7] hover:!bg-[#f4e8ff] dark:!border-[#e879f9] dark:!bg-[#241232] dark:!text-[#fffdf7] dark:shadow-[4px_4px_0_#6d28d9] dark:hover:!bg-[#30183f]">
                  <a href="#calendar">
                    View calendar
                    <CalendarDays className="ml-2 size-4" />
                  </a>
                </Button>
              </div>
            </div>

            <aside className="self-end border-2 border-[#241232] bg-[#fffdf7] p-5 shadow-[8px_8px_0_#6d28d9] dark:border-[#a855f7] dark:bg-[#241232] dark:shadow-[8px_8px_0_#6d28d9]">
              <div className="mb-5 flex items-center justify-between gap-3 border-b-2 border-[#241232] pb-3 dark:border-[#a855f7]">
                <p className="font-mono text-sm font-bold uppercase text-[#6d28d9] dark:text-[#e879f9]">Protocol board</p>
                <Wifi className="size-5 text-[#17a673]" />
              </div>
              <div className="grid gap-3 font-mono text-sm">
                <SignalRow label="Feed" value="kind 1 + kind 20" />
                <SignalRow label="Events" value="NIP-52" />
                <SignalRow label="Tag" value="#purplekonnektiv" />
                <SignalRow label="Source" value="Nostr relays" />
              </div>
            </aside>
          </div>
        </section>

        <section id="mission" className="border-b-2 border-[#241232] bg-[#fffdf7] dark:border-[#a855f7] dark:bg-[#1c1027]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-mono text-sm font-bold uppercase text-[#6d28d9]">Mission</p>
              <h2 className="mt-3 max-w-md text-4xl font-black leading-none text-[#241232] dark:text-[#fffdf7] sm:text-5xl">
                Relays over platforms. People over feeds.
              </h2>
            </div>
            <div className="grid gap-5 text-lg leading-8 text-[#3b234f] dark:text-[#d8c4ea]">
              <p>
                PurpleKonnektiv is a collective space for decentralization-minded people to meet, publish, and coordinate through Nostr. The website does not own the conversation; it surfaces the shared signal.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <MissionCard icon={Users} title="Collective" text="Built around people, meetups, posts, and shared learning." />
                <MissionCard icon={Radio} title="Protocol first" text="Content appears through tags and NIP-compatible events." />
                <MissionCard icon={Sparkles} title="Open signal" text="Use #purplekonnektiv from a Nostr client to join the stream." />
              </div>
            </div>
          </div>
        </section>

        <section id="feed" className="border-b-2 border-[#241232] bg-[#241232] text-[#fffdf7] dark:border-[#a855f7] dark:bg-[#0f0a14]">
          <SectionHeader
            eyebrow="Live feed"
            title="Posts tagged #purplekonnektiv"
            description="Kind 1 notes and kind 20 image posts, queried directly from relays with the indexed t tag."
            inverted
          />
          <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
            {feed.isLoading ? (
              <FeedSkeleton />
            ) : feed.isError ? (
              <StateCard title="The feed did not answer" text="Check relay connectivity and try again in a moment." inverted />
            ) : feedEvents.length === 0 ? (
              <StateCard title="No relay signal yet" text="Posts tagged #purplekonnektiv will appear here once relays return matching events." inverted />
            ) : (
              <div className="grid gap-5 lg:grid-cols-3">
                {feedEvents.map((event) => (
                  <FeedCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="calendar" className="border-b-2 border-[#241232] bg-[#f7f2ff] dark:border-[#a855f7] dark:bg-[#151019]">
          <SectionHeader
            eyebrow="Calendar"
            title="NIP-52 PurpleKonnektiv events"
            description="Date-based and time-based calendar events tagged #purplekonnektiv, validated before they show up here."
          />
          <div className="mx-auto grid max-w-7xl gap-6 px-5 pb-16 sm:px-8 lg:grid-cols-[1fr_0.45fr]">
            {calendar.isLoading ? (
              <CalendarSkeleton />
            ) : calendar.isError ? (
              <StateCard title="Calendar query failed" text="The relay response did not arrive. Try refreshing or checking relay settings." />
            ) : calendarEvents.length === 0 ? (
              <StateCard title="No calendar events yet" text="NIP-52 events tagged #purplekonnektiv will appear here after relays return matching events." />
            ) : (
              <>
                <div className="grid gap-5">
                  {(upcomingEvents.length > 0 ? upcomingEvents : calendarEvents.slice(0, 6)).map((event) => (
                    <CalendarCard key={event.id} calendarEvent={event} />
                  ))}
                </div>
                <aside className="border-2 border-[#241232] bg-[#fffdf7] p-5 shadow-[6px_6px_0_#f7c948] dark:border-[#a855f7] dark:bg-[#241232] dark:shadow-[6px_6px_0_#6d28d9]">
                  <h3 className="font-mono text-sm font-bold uppercase text-[#6d28d9]">Past signal</h3>
                  <div className="mt-5 grid gap-4">
                    {pastEvents.length === 0 ? (
                      <p className="text-sm leading-6 text-[#5f4a6f] dark:text-[#d8c4ea]">Past events will collect here once the calendar has history.</p>
                    ) : pastEvents.map((event) => (
                      <div key={event.id} className="border-l-4 border-[#a855f7] pl-3">
                        <p className="text-sm font-bold text-[#241232] dark:text-[#fffdf7]">{event.title}</p>
                        <p className="mt-1 text-xs text-[#5f4a6f] dark:text-[#d8c4ea]">{event.startLabel}</p>
                      </div>
                    ))}
                  </div>
                </aside>
              </>
            )}
          </div>
        </section>

        <section id="docs" className="bg-[#fffdf7] dark:bg-[#1c1027]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-mono text-sm font-bold uppercase text-[#6d28d9]">Docs</p>
              <h2 className="mt-3 text-4xl font-black leading-none text-[#241232] dark:text-[#fffdf7] sm:text-5xl">Document the protocol surface.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <DocCard title="Design system" text="Colors, typography, spacing, and component rules live in docs." />
              <DocCard title="Nostr data" text="Feed kinds, NIP-52 calendar tags, relay filters, and validation rules." />
              <DocCard title="Contributing" text="How to publish posts and events that show up on the site." />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-[#241232] bg-[#241232] px-5 py-8 text-[#fffdf7] dark:border-[#a855f7] dark:bg-[#0f0a14] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono font-bold">PurpleKonnektiv</p>
          <p className="text-[#d8c4ea]">Posts and events from Nostr relays via #purplekonnektiv.</p>
        </div>
      </footer>
    </div>
  );
}

function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#241232] bg-[#fffdf7]/95 backdrop-blur dark:border-[#a855f7] dark:bg-[#151019]/95">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8" aria-label="Primary">
        <a href="#top" className="font-mono text-lg font-black uppercase text-[#241232] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6d28d9] dark:text-[#fffdf7]">
          PurpleKonnektiv
        </a>
        <div className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-bold text-[#3b234f] underline-offset-4 hover:text-[#6d28d9] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6d28d9] dark:text-[#d8c4ea] dark:hover:text-[#e879f9]">
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LoginArea className="max-w-48" />
        </div>
      </nav>
    </header>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
  const Icon = theme === 'dark' ? Moon : theme === 'system' ? Monitor : Sun;
  const label = `Theme: ${theme}. Switch to ${nextTheme}.`;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      title={label}
      onClick={() => setTheme(nextTheme)}
      className="size-10 shrink-0 rounded-[4px] border-2 border-[#241232] bg-[#fffdf7] text-[#241232] shadow-[3px_3px_0_#a855f7] hover:bg-[#f7f2ff] dark:border-[#a855f7] dark:bg-[#241232] dark:text-[#fffdf7] dark:shadow-[3px_3px_0_#6d28d9] dark:hover:bg-[#30183f]"
    >
      <Icon className="size-4" />
    </Button>
  );
}

function Ticker() {
  const repeatedItems = [...tickerItems, ...tickerItems];

  return (
    <div className="overflow-hidden border-b-2 border-[#241232] bg-[#6d28d9] py-2 text-[#fffdf7] dark:border-[#a855f7] dark:bg-[#241232]">
      <div className="motion-safe:animate-purple-ticker flex w-max gap-6 font-mono text-sm font-bold uppercase">
        {repeatedItems.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-6">
            {item}
            <span className="text-[#f7c948]">+++</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function SignalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#d9c7e7] pb-2 last:border-b-0 dark:border-[#6d28d9]">
      <span className="text-[#7b638b] dark:text-[#d8c4ea]">{label}</span>
      <span className="min-w-0 break-words text-right font-bold text-[#241232] dark:text-[#fffdf7]">{value}</span>
    </div>
  );
}

function MissionCard({ icon: Icon, title, text }: { icon: typeof Users; title: string; text: string }) {
  return (
    <div className="border-2 border-[#241232] bg-[#f7f2ff] p-4 shadow-[4px_4px_0_#a855f7] dark:border-[#a855f7] dark:bg-[#241232] dark:shadow-[4px_4px_0_#6d28d9]">
      <Icon className="mb-4 size-6 text-[#6d28d9] dark:text-[#e879f9]" />
      <h3 className="font-mono text-sm font-black uppercase text-[#241232] dark:text-[#fffdf7]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#5f4a6f] dark:text-[#d8c4ea]">{text}</p>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, inverted = false }: { eyebrow: string; title: string; description: string; inverted?: boolean }) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <p className={cn('font-mono text-sm font-bold uppercase', inverted ? 'text-[#e879f9]' : 'text-[#6d28d9] dark:text-[#e879f9]')}>{eyebrow}</p>
      <div className="mt-3 grid gap-4 lg:grid-cols-[0.75fr_1fr] lg:items-end">
        <h2 className={cn('text-4xl font-black leading-none sm:text-6xl', inverted ? 'text-[#fffdf7]' : 'text-[#241232] dark:text-[#fffdf7]')}>{title}</h2>
        <p className={cn('max-w-2xl text-lg leading-8', inverted ? 'text-[#d8c4ea]' : 'text-[#5f4a6f] dark:text-[#d8c4ea]')}>{description}</p>
      </div>
    </div>
  );
}

function FeedCard({ event }: { event: NostrEvent }) {
  const author = useAuthor(event.pubkey);
  const metadata: NostrMetadata | undefined = author.data?.metadata;
  const displayName = metadata?.display_name ?? metadata?.name ?? shortPubkey(event.pubkey);
  const avatarUrl = sanitizeUrl(metadata?.picture);
  const imageUrls = extractImageUrls(event);
  const text = event.kind === 1 ? stripImageUrls(event.content) : event.content.trim();

  return (
    <Card className="gap-0 rounded-[4px] border-2 border-[#fffdf7] bg-[#fffdf7] py-0 text-[#151019] shadow-[6px_6px_0_#a855f7] transition-transform dark:border-[#a855f7] dark:bg-[#241232] dark:text-[#fffdf7] dark:shadow-[6px_6px_0_#6d28d9] motion-safe:hover:-translate-y-1">
      <CardHeader className="gap-0 border-b-2 border-[#241232] p-4 dark:border-[#a855f7]">
        <div className="flex items-center gap-3">
          <Avatar className="border-2 border-[#241232]">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback className="bg-[#f7f2ff] font-mono text-xs font-bold text-[#6d28d9]">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="truncate text-base text-[#241232] dark:text-[#fffdf7]">{displayName}</CardTitle>
            <p className="font-mono text-xs text-[#7b638b] dark:text-[#d8c4ea]">{formatRelativeTime(event.created_at)}</p>
          </div>
          <Badge className="ml-auto rounded-[4px] bg-[#241232] font-mono text-[#fffdf7]">kind {event.kind}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {text ? <p className="whitespace-pre-wrap text-base leading-7 text-[#241232] dark:text-[#fffdf7]">{text}</p> : null}
        {imageUrls.length > 0 ? (
          <div className="grid gap-2">
            {imageUrls.map((url) => (
              <img key={url} src={url} alt="" loading="lazy" className="aspect-[4/3] w-full border-2 border-[#241232] object-cover" />
            ))}
          </div>
        ) : event.kind === 20 ? (
          <div className="flex aspect-[4/3] items-center justify-center border-2 border-dashed border-[#a855f7] bg-[#f7f2ff] text-[#6d28d9] dark:bg-[#1c1027] dark:text-[#e879f9]">
            <ImageIcon className="size-8" />
          </div>
        ) : null}
        <p className="font-mono text-xs font-bold uppercase text-[#6d28d9] dark:text-[#e879f9]">#purplekonnektiv</p>
      </CardContent>
    </Card>
  );
}

function CalendarCard({ calendarEvent }: { calendarEvent: CalendarEventView }) {
  return (
    <article className={cn('grid gap-0 border-2 border-[#241232] bg-[#fffdf7] shadow-[6px_6px_0_#6d28d9] dark:border-[#a855f7] dark:bg-[#241232] dark:shadow-[6px_6px_0_#6d28d9] md:grid-cols-[10rem_1fr]', calendarEvent.isPast && 'opacity-75')}>
      <div className="border-b-2 border-[#241232] bg-[#6d28d9] p-5 text-[#fffdf7] dark:border-[#a855f7] md:border-b-0 md:border-r-2">
        <p className="font-mono text-xs font-bold uppercase">{calendarEvent.isAllDay ? 'All day' : 'Timed'}</p>
        <p className="mt-4 text-2xl font-black leading-tight">{calendarEvent.startDate.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</p>
        <p className="mt-1 font-mono text-xs">{calendarEvent.startDate.getUTCFullYear()}</p>
      </div>
      <div className="grid gap-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black leading-tight text-[#241232] dark:text-[#fffdf7]">{calendarEvent.title}</h3>
            <p className="mt-2 text-sm font-semibold text-[#5f4a6f] dark:text-[#d8c4ea]">
              {calendarEvent.startLabel}
              {calendarEvent.endLabel ? ` - ${calendarEvent.endLabel}` : ''}
              {calendarEvent.timezone ? ` (${calendarEvent.timezone})` : ''}
            </p>
          </div>
          <Badge className={cn('rounded-[4px] font-mono', calendarEvent.isPast ? 'bg-[#7b638b]' : 'bg-[#17a673] text-white')}>
            {calendarEvent.isPast ? 'past' : 'upcoming'}
          </Badge>
        </div>
        {calendarEvent.summary ? <p className="text-base leading-7 text-[#3b234f] dark:text-[#f1e7fb]">{calendarEvent.summary}</p> : null}
        {calendarEvent.imageUrl ? <img src={calendarEvent.imageUrl} alt="" loading="lazy" className="aspect-[16/9] w-full border-2 border-[#241232] object-cover" /> : null}
        <div className="flex flex-wrap gap-3 text-sm text-[#5f4a6f] dark:text-[#d8c4ea]">
          {calendarEvent.locations.map((location) => (
            <span key={location} className="inline-flex items-center gap-1">
              <MapPin className="size-4 text-[#6d28d9]" />
              {location}
            </span>
          ))}
          {calendarEvent.references.map((reference) => (
            <a key={reference} href={reference} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-[#6d28d9] underline-offset-4 hover:underline dark:text-[#e879f9]">
              Reference
              <ExternalLink className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function DocCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-2 border-[#241232] bg-[#f7f2ff] p-5 shadow-[5px_5px_0_#e879f9] dark:border-[#a855f7] dark:bg-[#241232] dark:shadow-[5px_5px_0_#6d28d9]">
      <FileText className="mb-5 size-6 text-[#6d28d9] dark:text-[#e879f9]" />
      <h3 className="font-mono text-sm font-black uppercase text-[#241232] dark:text-[#fffdf7]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#5f4a6f] dark:text-[#d8c4ea]">{text}</p>
    </div>
  );
}

function StateCard({ title, text, inverted = false }: { title: string; text: string; inverted?: boolean }) {
  return (
    <div className={cn('border-2 border-dashed p-8 text-center', inverted ? 'border-[#fffdf7] text-[#fffdf7]' : 'border-[#241232] bg-[#fffdf7] text-[#241232] dark:border-[#a855f7] dark:bg-[#241232] dark:text-[#fffdf7]')}>
      <p className="text-xl font-black">{title}</p>
      <p className={cn('mx-auto mt-2 max-w-md leading-7', inverted ? 'text-[#d8c4ea]' : 'text-[#5f4a6f] dark:text-[#d8c4ea]')}>{text}</p>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="border-2 border-[#fffdf7] bg-[#fffdf7] p-4 dark:border-[#a855f7] dark:bg-[#241232]">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full bg-[#d8c4ea]" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-4 w-32 bg-[#d8c4ea]" />
              <Skeleton className="h-3 w-20 bg-[#d8c4ea]" />
            </div>
          </div>
          <Skeleton className="mt-5 h-24 bg-[#d8c4ea]" />
        </div>
      ))}
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="grid gap-5 lg:col-span-2">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="grid gap-0 border-2 border-[#241232] bg-[#fffdf7] dark:border-[#a855f7] dark:bg-[#241232] md:grid-cols-[10rem_1fr]">
          <Skeleton className="h-32 rounded-none bg-[#d8c4ea]" />
          <div className="space-y-4 p-5">
            <Skeleton className="h-6 w-2/3 bg-[#d8c4ea]" />
            <Skeleton className="h-4 w-1/2 bg-[#d8c4ea]" />
            <Skeleton className="h-16 w-full bg-[#d8c4ea]" />
          </div>
        </div>
      ))}
    </div>
  );
}

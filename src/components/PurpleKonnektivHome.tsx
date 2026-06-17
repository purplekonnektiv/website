import type { NostrEvent, NostrMetadata } from '@nostrify/nostrify';
import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  Heart,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  Monitor,
  Moon,
  Settings,
  Sparkles,
  Sun,
  Users,
} from 'lucide-react';
import { nip19 } from 'nostr-tools';
import { Link } from 'react-router-dom';

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

const NOSTR_NPUB_PATTERN = /nostr:(npub1[023456789acdefghjklmnpqrstuvwxyz]+)/g;

const tickerItems = [
  '#purplekonnektiv',
  'Meetup notes',
  'Meetups and calls',
  'Decentralized social media',
  'Gathering photos',
  'Open conversations',
  'People over platforms',
];

const navItems = [
  { label: 'Mission', href: '#mission' },
  { label: 'Feed', href: '/feed' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Join in', href: '#join' },
];

export function PurpleKonnektivHome() {
  const feed = usePurpleKonnektivFeed();
  const calendar = usePurpleKonnektivCalendar();
  const feedEvents = feed.data ?? [];
  const calendarEvents = calendar.data ?? [];
  const upcomingEvents = calendarEvents.filter((event) => !event.isPast);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f2ff] text-[#151019] selection:bg-[#e879f9] selection:text-[#241232] dark:bg-[#151019] dark:text-[#fffdf7] dark:selection:bg-[#a855f7] dark:selection:text-[#fffdf7]">
      <SiteNav />
      <Ticker />

      <main>
        <section className="relative isolate border-b-2 border-[#241232] dark:border-[#a855f7]">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(36,18,50,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(36,18,50,0.08)_1px,transparent_1px)] bg-[size:28px_28px] dark:bg-[linear-gradient(rgba(168,85,247,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.18)_1px,transparent_1px)]" />
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:py-24">
            <div className="space-y-8">
              <div className="space-y-5">
                <h1 className="max-w-5xl font-black uppercase leading-[0.86] tracking-normal text-[#241232] text-[3.25rem] dark:text-[#fffdf7] sm:text-[6rem] lg:text-[8.5rem]">
                  Purple
                  <span className="block text-[#6d28d9]">Konnektiv</span>
                </h1>
                <p className="max-w-3xl text-xl font-semibold leading-8 text-[#3b234f] dark:text-[#d8c4ea] sm:text-2xl sm:leading-9">
                  A social home for people who care about decentralized conversation, shared learning, and meeting beyond platform walls.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-12 rounded-[4px] border-2 border-[#241232] !bg-[#6d28d9] px-6 text-base font-bold !text-white shadow-[4px_4px_0_#241232] hover:!bg-[#5b21b6] dark:!border-[#e879f9] dark:shadow-[4px_4px_0_#e879f9]">
                  <Link to="/feed">
                    Explore the feed
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 rounded-[4px] border-2 border-[#241232] !bg-[#fffdf7] px-6 text-base font-bold !text-[#241232] shadow-[4px_4px_0_#a855f7] hover:!bg-[#f4e8ff] dark:!border-[#e879f9] dark:!bg-[#241232] dark:!text-[#fffdf7] dark:shadow-[4px_4px_0_#6d28d9] dark:hover:!bg-[#30183f]">
                  <Link to="/calendar">
                    View calendar
                    <CalendarDays className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <aside className="self-end border-2 border-[#241232] bg-[#fffdf7] p-5 shadow-[8px_8px_0_#6d28d9] dark:border-[#a855f7] dark:bg-[#241232] dark:shadow-[8px_8px_0_#6d28d9]">
              <div className="mb-5 flex items-center justify-between gap-3 border-b-2 border-[#241232] pb-3 dark:border-[#a855f7]">
                <p className="font-mono text-sm font-bold uppercase text-[#6d28d9] dark:text-[#e879f9]">What happens here</p>
                <Sparkles className="size-5 text-[#17a673]" />
              </div>
              <div className="grid gap-4">
                <SocialNote title="Meetup stories" text="Notes, photos, and reflections from PurpleKonnektiv gatherings and calls." />
                <SocialNote title="Gatherings in one place" text="Upcoming meetups, calls, workshops, and local hangouts collected into a shared calendar." />
              </div>
            </aside>
          </div>
        </section>

        <section id="mission" className="border-b-2 border-[#241232] bg-[#fffdf7] dark:border-[#a855f7] dark:bg-[#1c1027]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-mono text-sm font-bold uppercase text-[#6d28d9]">Mission</p>
              <h2 className="mt-3 max-w-md text-4xl font-black leading-none text-[#241232] dark:text-[#fffdf7] sm:text-5xl">
                People over platforms. Conversation over capture.
              </h2>
            </div>
            <div className="grid gap-5 text-lg leading-8 text-[#3b234f] dark:text-[#d8c4ea]">
              <p>
                PurpleKonnektiv is a collective space for decentralization-minded people to meet, publish, coordinate, and keep in touch. The website is a window into the community, not the owner of it.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <MissionCard icon={Users} title="Collective" text="Built around people, meetups, gatherings, and shared learning." />
                <MissionCard icon={MessageCircle} title="Social" text="A shared stream for meetup recaps, event notes, and community context." />
                <MissionCard icon={Sparkles} title="Open" text="Use #purplekonnektiv for PurpleKonnektiv meetups, events, and follow-up notes." />
              </div>
            </div>
          </div>
        </section>

        <section id="feed" className="border-b-2 border-[#241232] bg-[#241232] text-[#fffdf7] dark:border-[#a855f7] dark:bg-[#0f0a14]">
          <SectionHeader
            eyebrow="Live feed"
            title="Posts tagged #purplekonnektiv"
            description="Meetup notes, gathering photos, event recaps, and community context from PurpleKonnektiv."
            inverted
          />
          <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
            {feed.isLoading ? (
              <FeedSkeleton />
            ) : feed.isError ? (
              <StateCard title="The feed is quiet right now" text="Try refreshing, or check your connections if the stream stays empty." inverted />
            ) : feedEvents.length === 0 ? (
              <StateCard title="No meetup notes yet" text="Posts connected to PurpleKonnektiv meetups and events will appear here." inverted />
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
            title="Community calendar"
            description="Meetups, calls, workshops, and gatherings shared by the PurpleKonnektiv community."
          />
          <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
            {calendar.isLoading ? (
              <CalendarSkeleton />
            ) : calendar.isError ? (
              <StateCard title="The calendar needs a moment" text="Try refreshing, or check your connections if events do not appear." />
            ) : calendarEvents.length === 0 ? (
              <StateCard title="No events yet" text="Upcoming PurpleKonnektiv gatherings will appear here when the community shares them." />
            ) : (
              <CalendarMonth events={upcomingEvents.length > 0 ? upcomingEvents : calendarEvents} />
            )}
          </div>
        </section>

        <section id="join" className="bg-[#fffdf7] dark:bg-[#1c1027]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-mono text-sm font-bold uppercase text-[#6d28d9]">Join in</p>
              <h2 className="mt-3 text-4xl font-black leading-none text-[#241232] dark:text-[#fffdf7] sm:text-5xl">Bring your people and plans.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <SocialCard title="Host something" text="Create a meetup, call, or workshop so people know where to show up." />
              <SocialCard title="Share the recap" text="After a gathering, use #purplekonnektiv for notes, photos, links, and takeaways." />
              <SocialCard title="Keep it contextual" text="Reserve the tag for PurpleKonnektiv events, coordination, and community follow-up." />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-[#241232] bg-[#241232] px-5 py-8 text-[#fffdf7] dark:border-[#a855f7] dark:bg-[#0f0a14] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono font-bold">PurpleKonnektiv</p>
            <p className="mt-1 text-[#d8c4ea]">A shared stream for PurpleKonnektiv meetups and community follow-up.</p>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-[4px] border-2 border-[#fffdf7] !bg-transparent !text-[#fffdf7] hover:!bg-[#30183f] dark:!border-[#a855f7]">
            <Link to="/relays">
              Manage connections
              <Settings className="ml-2 size-4" />
            </Link>
          </Button>
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
            item.href.startsWith('/') ? (
              <Link key={item.href} to={item.href} className="text-sm font-bold text-[#3b234f] underline-offset-4 hover:text-[#6d28d9] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6d28d9] dark:text-[#d8c4ea] dark:hover:text-[#e879f9]">
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} className="text-sm font-bold text-[#3b234f] underline-offset-4 hover:text-[#6d28d9] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6d28d9] dark:text-[#d8c4ea] dark:hover:text-[#e879f9]">
                {item.label}
              </a>
            )
          ))}
          <Link to="/relays" className="text-sm font-bold text-[#3b234f] underline-offset-4 hover:text-[#6d28d9] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6d28d9] dark:text-[#d8c4ea] dark:hover:text-[#e879f9]">
            Connections
          </Link>
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

function SocialNote({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-l-4 border-[#a855f7] pl-4">
      <h3 className="font-mono text-sm font-black uppercase text-[#241232] dark:text-[#fffdf7]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#5f4a6f] dark:text-[#d8c4ea]">{text}</p>
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

export function FeedCard({ event }: { event: NostrEvent }) {
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
          <Badge className="ml-auto rounded-[4px] bg-[#241232] font-mono text-[#fffdf7]">post</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {text ? <FeedText content={text} /> : null}
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

function FeedText({ content }: { content: string }) {
  const segments = splitNostrMentions(content);

  return (
    <p className="whitespace-pre-wrap break-words text-base leading-7 text-[#241232] [overflow-wrap:anywhere] dark:text-[#fffdf7]">
      {segments.map((segment, index) => (
        segment.type === 'npub'
          ? <NpubMention key={`${segment.value}-${index}`} npub={segment.value} />
          : <span key={`${segment.value}-${index}`}>{segment.value}</span>
      ))}
    </p>
  );
}

function NpubMention({ npub }: { npub: string }) {
  const pubkey = decodeNpub(npub);
  const author = useAuthor(pubkey);
  const metadata: NostrMetadata | undefined = author.data?.metadata;
  const label = metadata?.display_name ?? metadata?.name ?? (pubkey ? shortPubkey(pubkey) : npub);

  return (
    <span className="inline font-bold text-[#6d28d9] [overflow-wrap:anywhere] dark:text-[#e879f9]">
      @{label}
    </span>
  );
}

function splitNostrMentions(content: string): Array<{ type: 'text' | 'npub'; value: string }> {
  const segments: Array<{ type: 'text' | 'npub'; value: string }> = [];
  let lastIndex = 0;

  for (const match of content.matchAll(NOSTR_NPUB_PATTERN)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      segments.push({ type: 'text', value: content.slice(lastIndex, matchIndex) });
    }

    segments.push({ type: 'npub', value: match[1] });
    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return segments;
}

function decodeNpub(npub: string): string | undefined {
  try {
    const decoded = nip19.decode(npub);
    return decoded.type === 'npub' ? decoded.data : undefined;
  } catch {
    return undefined;
  }
}

function CalendarMonth({ events }: { events: CalendarEventView[] }) {
  const anchorDate = events[0]?.startDate ?? new Date();
  const monthStart = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
  const firstGridDate = new Date(monthStart);
  firstGridDate.setDate(monthStart.getDate() - monthStart.getDay());

  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(firstGridDate);
    day.setDate(firstGridDate.getDate() + index);
    return day;
  });

  const monthLabel = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(anchorDate);

  return (
    <div className="border-2 border-[#241232] bg-[#fffdf7] shadow-[8px_8px_0_#6d28d9] dark:border-[#a855f7] dark:bg-[#241232]">
      <div className="flex flex-col gap-3 border-b-2 border-[#241232] p-5 dark:border-[#a855f7] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-sm font-bold uppercase text-[#6d28d9] dark:text-[#e879f9]">What is coming up</p>
          <h3 className="mt-1 text-3xl font-black text-[#241232] dark:text-[#fffdf7]">{monthLabel}</h3>
        </div>
        <p className="text-sm font-semibold text-[#5f4a6f] dark:text-[#d8c4ea]">{events.length} event{events.length === 1 ? '' : 's'}</p>
      </div>
      <div className="grid grid-cols-7 border-b-2 border-[#241232] bg-[#f7f2ff] dark:border-[#a855f7] dark:bg-[#1c1027]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center font-mono text-xs font-bold uppercase text-[#6d28d9] dark:text-[#e879f9]">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-7">
        {days.map((day) => {
          const dayEvents = events.filter((event) => isSameCalendarDay(event.startDate, day));
          const inMonth = day.getMonth() === anchorDate.getMonth();

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'min-h-32 border-b border-r border-[#d9c7e7] p-3 last:border-r-0 dark:border-[#6d28d9]/60 sm:last:border-r',
                !inMonth && 'bg-[#f7f2ff]/60 text-[#7b638b] dark:bg-[#151019]/50 dark:text-[#8f78a0]',
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className={cn('font-mono text-sm font-bold', inMonth ? 'text-[#241232] dark:text-[#fffdf7]' : 'text-[#7b638b] dark:text-[#8f78a0]')}>
                  {day.getDate()}
                </span>
                {dayEvents.length > 0 ? <span className="size-2 rounded-full bg-[#17a673]" /> : null}
              </div>
              <div className="grid gap-2">
                {dayEvents.map((event) => (
                  <CalendarEventChip key={event.id} calendarEvent={event} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarEventChip({ calendarEvent }: { calendarEvent: CalendarEventView }) {
  return (
    <article className="border border-[#a855f7] bg-[#f7f2ff] p-2 text-left shadow-[2px_2px_0_#a855f7] dark:bg-[#151019]">
      <h4 className="line-clamp-2 text-sm font-black leading-tight text-[#241232] dark:text-[#fffdf7]">{calendarEvent.title}</h4>
      <p className="mt-1 text-xs font-semibold text-[#5f4a6f] dark:text-[#d8c4ea]">{calendarEvent.isAllDay ? 'All day' : calendarEvent.startLabel}</p>
      {calendarEvent.locations[0] ? (
        <p className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs text-[#5f4a6f] dark:text-[#d8c4ea]">
          <MapPin className="size-3 shrink-0 text-[#6d28d9] dark:text-[#e879f9]" />
          {calendarEvent.locations[0]}
        </p>
      ) : null}
      {calendarEvent.references[0] ? (
        <a href={calendarEvent.references[0]} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#6d28d9] underline-offset-4 hover:underline dark:text-[#e879f9]">
          Details
          <ExternalLink className="size-3" />
        </a>
      ) : null}
    </article>
  );
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function SocialCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-2 border-[#241232] bg-[#f7f2ff] p-5 shadow-[5px_5px_0_#e879f9] dark:border-[#a855f7] dark:bg-[#241232] dark:shadow-[5px_5px_0_#6d28d9]">
      <Heart className="mb-5 size-6 text-[#6d28d9] dark:text-[#e879f9]" />
      <h3 className="font-mono text-sm font-black uppercase text-[#241232] dark:text-[#fffdf7]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#5f4a6f] dark:text-[#d8c4ea]">{text}</p>
    </div>
  );
}

export function StateCard({ title, text, inverted = false }: { title: string; text: string; inverted?: boolean }) {
  return (
    <div className={cn('border-2 border-dashed p-8 text-center', inverted ? 'border-[#fffdf7] text-[#fffdf7]' : 'border-[#241232] bg-[#fffdf7] text-[#241232] dark:border-[#a855f7] dark:bg-[#241232] dark:text-[#fffdf7]')}>
      <p className="text-xl font-black">{title}</p>
      <p className={cn('mx-auto mt-2 max-w-md leading-7', inverted ? 'text-[#d8c4ea]' : 'text-[#5f4a6f] dark:text-[#d8c4ea]')}>{text}</p>
    </div>
  );
}

export function FeedSkeleton() {
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

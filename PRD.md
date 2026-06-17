# PurpleKonnektiv Website PRD

## 1. Overview

PurpleKonnektiv is a Nostr-native website for a collective of people who believe decentralized social media and open information protocols matter. The site should act as a public home, discovery surface, and coordination layer for the PurpleKonnektiv community.

The product should be useful even without login: visitors can read community posts, view images, and discover upcoming events. Logged-in Nostr users can participate through their existing Nostr identity by publishing tagged posts and calendar events from any compatible client.

## 2. Goals

- Present PurpleKonnektiv as a human, values-driven collective centered on decentralized social media and information freedom.
- Display a live community feed of Nostr posts tagged with `#purplekonnektiv`.
- Display a calendar of NIP-52 calendar events tagged with `#purplekonnektiv`.
- Make Nostr the source of truth for community content instead of a centralized CMS.
- Keep the first version focused, readable, responsive, and easy to extend.

## 3. Non-Goals

- Building a full general-purpose Nostr client.
- Building moderation workflows for all of Nostr.
- Creating a custom Nostr event kind for PurpleKonnektiv content.
- Replacing external Nostr clients for post/event creation in the first version.
- Supporting recurring calendar events in version 1, since NIP-52 intentionally omits recurrence.

## 4. Target Audiences

- Curious visitors who want to understand what PurpleKonnektiv is.
- Nostr users who want to follow or participate in PurpleKonnektiv activity.
- Collective members who want a shared public surface for posts, images, and events.
- Event attendees looking for upcoming meetups, calls, workshops, or gatherings.

## 5. Core User Stories

- As a visitor, I can understand what PurpleKonnektiv stands for within the first viewport.
- As a visitor, I can browse recent posts tagged `#purplekonnektiv`.
- As a visitor, I can see text posts, image posts, and posts with both text and images in one feed.
- As a visitor, I can browse upcoming and past PurpleKonnektiv calendar events.
- As a visitor, I can open a Nostr event or profile through NIP-19 routes where appropriate.
- As a Nostr user, I can log in with the existing app authentication and see account controls.
- As a Nostr user, I can learn which tag to use to appear on the site: `#purplekonnektiv`.

## 6. Information Architecture

Version 1 should use a single primary homepage with anchored sections:

- Hero / identity
- Mission statement
- Community feed
- Calendar
- Participation callout

Future versions may split feed and calendar into dedicated routes if the content volume makes one page too dense.

## 7. Feature Requirements

### 7.1 Hero and Mission

The homepage must clearly communicate:

- Name: PurpleKonnektiv
- Purpose: a collective around decentralized social media and open information protocols
- Primary action: explore the feed or calendar
- Secondary action: join/login with Nostr

The copy should feel collective, human, and grounded. Avoid generic SaaS language.

### 7.2 Nostr Community Feed

The feed must query Nostr events tagged with `#purplekonnektiv`.

Included event kinds:

- `kind: 1` text notes, including notes with image URLs in content
- `kind: 20` image posts

Query requirements:

- Use relay-side tag filtering with the indexed `t` tag: `'#t': ['purplekonnektiv']`.
- Query kinds `1` and `20` together when possible.
- Sort newest first.
- Use a reasonable initial limit, such as 30 events.
- Avoid fetching broad public feeds and filtering in JavaScript.

Rendering requirements:

- Show author avatar/name when profile metadata is available.
- Show fallback identity when profile metadata is unavailable.
- Show post text for kind 1.
- Show image media from kind 20 according to its event schema.
- Detect and render safe image URLs from kind 1 content when present.
- Link hashtags and Nostr references where supported by the existing app.
- Show created time in a readable relative or absolute format.
- Provide loading skeletons, empty state, and error state.

Security requirements:

- Sanitize all event-sourced URLs before using them in `href`, `src`, or CSS.
- Never use `dangerouslySetInnerHTML`, `innerHTML`, or `document.write` for Nostr content.
- Keep content rendering plain and safe unless a dedicated safe renderer is introduced.

### 7.3 PurpleKonnektiv Calendar

The calendar must use NIP-52 calendar events tagged with `#purplekonnektiv`.

Included event kinds:

- `kind: 31922` date-based calendar events
- `kind: 31923` time-based calendar events

Query requirements:

- Use relay-side tag filtering with `'#t': ['purplekonnektiv']`.
- Query both calendar event kinds together when possible.
- Validate required NIP-52 fields before rendering.
- Prefer upcoming events first, with a way to view past events.

Validation requirements:

- For `kind: 31922`, require `d`, `title`, and `start`.
- For `kind: 31923`, require `d`, `title`, `start`, and `D`.
- For addressable events, treat `pubkey + kind + d` as the event identity.
- Ignore malformed events gracefully.

Rendering requirements:

- Show title, date/time, location, summary, and image when available.
- Support all-day/date-based events and time-based events.
- Display timezone information when `start_tzid` or `end_tzid` exists.
- Link external references from `r` tags after URL sanitization.
- Show participant pubkeys from `p` tags only where the UI can present them cleanly.
- Provide loading skeletons, empty state, and error state.

Version 1 does not need to implement:

- Calendar creation via `kind: 31924`
- RSVP publishing via `kind: 31925`
- Recurring event expansion
- Complex month/week calendar editing

### 7.4 Authentication

The site should reuse the existing `LoginArea` component.

Requirements:

- Show account controls in the main navigation.
- Do not hide `LoginArea` behind logged-in conditionals.
- The site must remain browsable when logged out.

### 7.5 NIP-19 Routing

The existing root-level NIP-19 route should remain the canonical route for Nostr identifiers:

- `npub1`
- `nprofile1`
- `note1`
- `nevent1`
- `naddr1`

The product should never introduce nested routes like `/note/:id` or `/profile/:id` for NIP-19 identifiers.

## 8. Design Requirements

- Responsive down to approximately 360px.
- WCAG 2.1 AA contrast for body text and controls.
- Mobile-first layout with comfortable reading and touch targets.
- Use the existing shadcn/ui component system.
- Keep the interface warm and community-oriented, not corporate.
- Use a distinctive PurpleKonnektiv visual identity without turning the whole UI into a single purple palette.
- Prefer cards for repeated feed/event items, not for every page section.
- Provide clear focus-visible states for keyboard users.

## 9. Documentation Requirements

The project must include good documentation in the `/docs` folder.

Documentation should cover:

- Product overview and PurpleKonnektiv mission.
- How the `#purplekonnektiv` hashtag powers feed and calendar discovery.
- Supported Nostr event kinds and relevant NIPs.
- Feed data model for kinds `1` and `20`.
- Calendar data model for NIP-52 kinds `31922` and `31923`.
- Relay assumptions and configuration notes.
- Content safety and URL sanitization expectations.
- Local development, testing, build, and deployment steps.
- Guidance for contributors who want their posts or events to appear on the site.

Documentation should be kept current with implementation changes and should favor practical examples over abstract protocol descriptions.

## 10. Data Model Notes

### Feed Filter

```ts
{
  kinds: [1, 20],
  '#t': ['purplekonnektiv'],
  limit: 30,
}
```

### Calendar Filter

```ts
{
  kinds: [31922, 31923],
  '#t': ['purplekonnektiv'],
  limit: 50,
}
```

### NIP-52 Tags Used

- `d`: addressable event identifier
- `title`: event title
- `summary`: short event summary
- `image`: event image URL
- `location`: physical or virtual location
- `g`: geohash
- `p`: participant pubkey
- `t`: hashtag/category
- `r`: reference URL
- `start`: date or unix timestamp
- `end`: date or unix timestamp
- `start_tzid`: IANA timezone for start
- `end_tzid`: IANA timezone for end
- `D`: day-granularity timestamp for time-based events

## 11. Success Metrics

- A visitor can understand the collective and find live community content without logging in.
- Feed and calendar content comes from Nostr events tagged `#purplekonnektiv`.
- The page works across mobile and desktop.
- Invalid or malicious Nostr content does not break rendering or create XSS risk.
- The `/docs` folder contains clear, useful documentation for users, contributors, and maintainers.
- Build, type-check, and tests pass before release.

## 12. Open Questions

- Should the first version include a compose flow for publishing `#purplekonnektiv` notes?
- Should trusted collective members be featured separately from the public hashtag feed?
- Should event discovery be fully open by hashtag, or should a curated `kind: 31924` calendar become canonical later?
- Which relays should be recommended for PurpleKonnektiv content beyond the app defaults?
- Should the site include a static manifesto/about page in addition to the Nostr-native feed?
- Should `/docs` be purely developer-facing, or should parts of it be rendered publicly on the website?

## 13. Release Plan

### Milestone 1: Public Homepage

- Build branded homepage structure.
- Add mission copy and visual identity.
- Add navigation with login/account controls.

### Milestone 2: Nostr Feed

- Query kind 1 and kind 20 events tagged `#purplekonnektiv`.
- Render safe feed items with author metadata.
- Add loading, empty, and error states.

### Milestone 3: NIP-52 Calendar

- Query kind 31922 and kind 31923 events tagged `#purplekonnektiv`.
- Validate and normalize event data.
- Render upcoming and past event views.

### Milestone 4: Polish and Validation

- Improve responsive behavior.
- Run accessibility checks.
- Add and review `/docs` documentation.
- Run type-check, lint, tests, and production build.
- Review security handling for event-sourced content.

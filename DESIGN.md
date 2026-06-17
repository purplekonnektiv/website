# PurpleKonnektiv Design Direction

## 1. Design Intent

PurpleKonnektiv should feel like a Nostr-native community signal: direct, collective, a little raw, and unmistakably alive. The visual direction should take inspiration from `einundzwanzig.space`: bold editorial structure, strong navigation, playful community voice, dense but readable sections, and a public-broadcast feeling.

This should not be a clone. PurpleKonnektiv needs its own identity: purple, protocol-native, decentralized, and social. The design should feel like a community hub built by people who care about resilient public conversation.

## 2. Reference Translation

Inspired by `einundzwanzig.space`:

- Strong top navigation with grouped links.
- Large typographic hero with direct messaging.
- Horizontal ticker / marquee energy for community phrases, relays, hashtags, or protocol slogans.
- Clear content bands for current activity.
- Editorial confidence instead of generic landing-page polish.
- Playful tone without losing credibility.

Translate for PurpleKonnektiv:

- Replace Bitcoin orange with a purple-led palette.
- Replace podcast/news hierarchy with Nostr feed and calendar hierarchy.
- Replace sponsor/content blocks with protocol, collective, feed, and event modules.
- Use `#purplekonnektiv` as a visible recurring design motif.
- Make live Nostr content feel like the center of the page, not an add-on.

## 3. Personality

The interface should be:

- Collective, not corporate.
- Bold, not glossy.
- Human, not sterile.
- Protocol-aware, not protocol-obscure.
- Playful in details, calm in structure.

Avoid:

- Generic purple gradient SaaS aesthetics.
- Overly soft pastel community branding.
- Crypto-bro visual language.
- Dense technical jargon in primary UI copy.
- Stock-photo hero sections.

## 4. Visual System

### Color Palette

Use purple as the identity anchor, but avoid a one-note all-purple interface.

Suggested palette:

- `Purple Core`: `#6D28D9` for primary actions and identity marks.
- `Deep Violet`: `#241232` for dark text, footer, and high-contrast surfaces.
- `Electric Lilac`: `#A855F7` for active states, links, and highlights.
- `Signal Pink`: `#E879F9` for small accents and hover details.
- `Ink`: `#151019` for body text.
- `Paper`: `#F7F2FF` for warm page background.
- `Chalk`: `#FFFDF7` for content surfaces.
- `Protocol Green`: `#17A673` as a secondary accent for live/verified states.
- `Relay Yellow`: `#F7C948` as a tertiary accent for ticker details or calendar highlights.

Usage rules:

- Purple should lead, not flood.
- Use off-white and ink-heavy contrast for readability.
- Use green/yellow sparingly to prevent the site from becoming monochrome.
- Feed and calendar cards should remain legible before they are decorative.

### Typography

The type system should feel editorial and independent.

Recommended direction:

- Display: a condensed, assertive grotesk or display face for hero and section titles.
- Body: a readable sans with warmth and strong numerals.
- Mono: a restrained monospace for Nostr identifiers, event kinds, relay URLs, and tags.

Implementation preference:

- Install selected fonts via `@fontsource` when finalizing implementation.
- Use CSS variables for font families.
- Keep body text at least `18px` on content-heavy sections.
- Keep hero type large and compact, but never allow it to overflow mobile widths.

Avoid defaulting to Inter, Arial, or plain system stacks unless no font installation is possible.

## 5. Layout

### Page Structure

The first version should be a single-page experience:

1. Sticky navigation
2. Community ticker
3. Hero / identity
4. Mission section
5. Live Nostr feed
6. PurpleKonnektiv calendar
7. Participation section
8. Footer

### Navigation

The nav should feel practical and slightly editorial:

- Left: PurpleKonnektiv wordmark.
- Center or grouped links: Mission, Feed, Calendar, Docs.
- Right: `LoginArea`.
- Mobile: compact menu with the same sections and visible login/account access.

Use strong text links and clear hover/focus treatment. Avoid oversized pill buttons for every nav item.

### Ticker

Add a horizontal ticker near the top of the page.

Potential ticker phrases:

- `#purplekonnektiv`
- `Nostr native`
- `Dezentrale soziale Medien`
- `Open protocols, open conversations`
- `Kind 1 + Kind 20`
- `NIP-52 events`
- `Relays over platforms`

Ticker behavior:

- Continuous motion on desktop.
- Slower or static fallback with `prefers-reduced-motion`.
- High contrast.
- No essential information should exist only in the ticker.

### Hero

The hero should be typographic and signal-heavy.

Content:

- Main title: `PurpleKonnektiv`
- Supporting line: a concise statement about decentralized social media and open information protocols.
- Primary CTA: jump to feed.
- Secondary CTA: jump to calendar or docs.

Visual treatment:

- Large editorial headline.
- Layered tag fragments or protocol chips.
- Subtle network/grid texture is acceptable if it does not reduce readability.
- Use real UI/data motifs rather than abstract decorative blobs.

## 6. Components

### Feed Cards

Feed cards should make Nostr posts feel like public dispatches.

Required elements:

- Author avatar and display name.
- Pubkey fallback when profile data is missing.
- Timestamp.
- Event kind label when useful.
- Text content.
- Safe image rendering.
- Visible `#purplekonnektiv` tag treatment.

Design:

- Rectangular cards with `8px` or less radius.
- Crisp border, subtle shadow, or layered offset border.
- Images should have stable aspect ratios and avoid layout shift.
- Long text should wrap cleanly.

### Calendar Cards

Calendar cards should be more structured than feed cards.

Required elements:

- Date block.
- Event title.
- Time or all-day label.
- Location if present.
- Summary if present.
- Reference link if present.
- Optional image.

Design:

- Use a strong date column or date badge.
- Upcoming events should feel active.
- Past events should be visually quieter but still readable.
- Timezone information should be visible when provided by NIP-52 tags.

### Empty States

Empty states should be minimalist and practical:

- Feed: explain that posts tagged `#purplekonnektiv` will appear here.
- Calendar: explain that NIP-52 events tagged `#purplekonnektiv` will appear here.
- Include a short hint about using the hashtag from any Nostr client.

### Loading States

Use skeletons for:

- Feed list items.
- Calendar cards.
- Author metadata.

Use spinners only inside buttons or short-lived actions.

## 7. Motion

Motion should feel like signal movement, not decoration.

Use:

- Ticker movement.
- Subtle hover shifts on cards.
- Soft reveal for page sections.
- Focus-visible rings with a quick transition.

Avoid:

- Heavy parallax.
- Decorative floating orbs.
- Motion that distracts from reading live content.

Respect `prefers-reduced-motion`.

## 8. Imagery and Texture

This site does not need stock photography.

Preferred visual motifs:

- Nostr event cards.
- Relay/network linework.
- Hashtag fragments.
- Calendar/date glyphs.
- Simple protocol diagrams.
- Community-sourced images from kind 1 / kind 20 posts.

Texture direction:

- Light paper/noise texture is acceptable.
- Grid or terminal-inspired background patterns are acceptable.
- Keep texture subtle enough that body text remains AA compliant.

## 9. Accessibility

Requirements:

- WCAG 2.1 AA contrast for text and controls.
- Keyboard-accessible navigation and controls.
- Visible focus states.
- Semantic headings.
- Descriptive alt text for static images.
- Empty `alt` for purely decorative images.
- Sanitized event-sourced image URLs.
- No content rendered through unsafe HTML injection.

## 10. Responsive Behavior

Mobile:

- Single-column flow.
- Sticky or compact nav.
- Ticker can become static or slower.
- Feed and calendar cards should fill width.
- Hero type must scale by breakpoint, not viewport-width formulas.

Tablet:

- Two-column section layouts where useful.
- Feed remains readable with generous spacing.

Desktop:

- Editorial grid with asymmetric section rhythm.
- Feed and calendar can sit in separate columns or alternating bands.
- Keep the primary content width controlled for readability.

## 11. Copy Tone

Tone should be direct and community-native.

Good:

- `A Nostr-native signal for decentralized social media.`
- `Posts tagged #purplekonnektiv, straight from the relays.`
- `Events from the protocol, not a platform calendar.`
- `Bring your own Nostr identity.`

Avoid:

- `Revolutionizing social engagement`
- `The ultimate decentralized ecosystem`
- `Next-generation community platform`
- `Seamless innovative experiences`

## 12. Implementation Notes

- Use existing shadcn/ui primitives.
- Keep cards at `8px` radius or less unless a local component requires otherwise.
- Use `cn()` for class composition.
- Use lucide icons where icons are needed.
- Define color and font tokens in CSS variables.
- Keep sections as full-width bands with constrained inner content.
- Do not nest UI cards inside UI cards.
- Do not add unsafe HTML rendering for Nostr content.
- Sanitize all event-sourced URLs before rendering.

## 13. Documentation Tie-In

The `/docs` folder should document the design system once implementation begins.

Recommended docs:

- `/docs/design-system.md`: colors, typography, spacing, components.
- `/docs/content-guidelines.md`: tone, hashtags, event posting guidance.
- `/docs/nostr-data.md`: feed and calendar event kinds, tags, and validation.

## 14. Design Acceptance Criteria

- The site clearly reads as PurpleKonnektiv in the first viewport.
- The visual direction feels inspired by `einundzwanzig.space` but has its own purple Nostr identity.
- The feed and calendar are visually central, not secondary widgets.
- The interface remains readable and usable at 360px width.
- Motion respects `prefers-reduced-motion`.
- UI contrast meets WCAG 2.1 AA.
- The design avoids generic purple SaaS styling.

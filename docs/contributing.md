# Contributing Content

PurpleKonnektiv content appears through Nostr. You can use any Nostr client that can publish the supported event kinds and tags.

## Posts

To appear in the community feed, publish either:

- a kind 1 text note tagged `#purplekonnektiv`
- a kind 20 image post tagged `#purplekonnektiv`

## Events

To appear in the calendar, publish a NIP-52 calendar event tagged `#purplekonnektiv`.

Use:

- `kind: 31922` for all-day or date-based events
- `kind: 31923` for time-based events

Include at least:

- `d`
- `title`
- `start`
- `D` for time-based events

Optional but useful tags include `summary`, `image`, `location`, `r`, and timezone tags.

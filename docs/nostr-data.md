# PurpleKonnektiv Nostr Data

The site discovers content through the indexed `t` tag:

```ts
'#t': ['purplekonnektiv']
```

## Feed

The feed queries:

- `kind: 1` text notes
- `kind: 20` image posts

The initial query limit is 30 events. Events are sorted newest first after relay results arrive.

## Calendar

The calendar follows NIP-52 and queries:

- `kind: 31922` date-based calendar events
- `kind: 31923` time-based calendar events

Validation rules:

- `kind: 31922` requires `d`, `title`, and `start`.
- `kind: 31923` requires `d`, `title`, `start`, and `D`.
- Addressable event identity is `kind:pubkey:d`.

Malformed events are ignored instead of rendered.

## Safety

All event-sourced URLs must be sanitized before use. The implementation only allows HTTPS URLs for rendered links and images.

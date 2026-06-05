# F02 — Adapter framework + routing

> Phase 1. See [F00 overview](./F00-notesmem-overview.md).

## Motivation

The whole product is the fan-out. F02 turns a stored note into reliable delivery
across many **named** destinations, with per-note routing control and a delivery
log the user can trust ("did my note actually reach cardmem?").

## Scope (in)

- Adapter abstraction in `packages/adapters`: a generic adapter =
  `{name, type, url, token, method, field_mapping, in_default_fanout}`.
- Generic **URL+token** adapter (covers any token-auth REST receiver).
- **Fan-out engine**: on ingest, deliver to every adapter in the default fan-out
  set — OR to a single named adapter when the note carries a `target`.
- **Inline addressing**: a leading `@adaptername` in the note text routes to ONLY
  that adapter (stripped from the delivered body).
- **Delivery log**: per `(note, adapter)` status (pending/sent/failed), attempts,
  last_error, delivered_at. Retry with backoff on failure.
- **Attachment forwarding**: pass `image_url(s)` through per each adapter's contract.

## Scope (out / non-goals)

- Concrete adapters beyond the generic one (cardmem = F03, defaults = F04).
- Inbound push (Phase 2).

## Architecture notes

- Each adapter type maps `{text, tags, image_url, source}` → destination payload
  via a small declarative, Zod-validated mapping.
- Idempotency: support a per-delivery key so retries never duplicate (e.g. adopt
  cardmem's fingerprint param).
- Routing precedence: explicit `target` / `@addressing` > default fan-out set.

## Dependencies

- F01 (note model, delivery-log schema, storage).

## Acceptance criteria

- A note with no target is delivered to ALL default-fanout adapters; each logged.
- A note with `target="cardmem"` (or `@cardmem ...`) is delivered to ONLY that adapter.
- A failing adapter is retried with backoff; the log shows attempts + last_error;
  other adapters are unaffected.
- `image_url` is forwarded to adapters that accept attachments.

## Rollout

First real adapter wired is cardmem (F03). Generic adapter tested against a
throw-away webhook sink.

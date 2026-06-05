# F04 — Default outbound adapters

> Phase 1. See [F00 overview](./F00-notesmem-overview.md).

## Motivation

Ship the pre-built set of cloud/REST receivers so notesmem is valuable on day one
beyond cardmem. Each is an adapter **template** (type + URL pattern + field-mapping
+ auth style), so adding one = pick the template + paste a token.

## Scope (in)

- **trail**: `POST {TRAIL_CLOUD_API}/api/v1/queue/candidates`, `Authorization:
  Bearer <trail_ key>` + `X-Trail-Tenant`, body
  `{kind:"external-feed", path:"/neurons/sources/notesmem/", title, content, metadata:{connector:"notesmem"}}`. Register `notesmem` as a connector id.
- **Notion** (DB append, OAuth connect), **Slack** (incoming webhook), **Todoist**
  (REST), **Telegram** (bot API), **Readwise**, **Linear**, **Discord** (webhook),
  **Airtable**, **generic webhook**, **email** (send endpoint), **Zapier/Make**
  (catch-hook → anything).

## Scope (out / non-goals)

- Obsidian, Apple Notes — no cloud/REST API (local-first). Possible later
  device-side Shortcuts bridge, never a cloud adapter.

## Architecture notes

- Adapter templates in `packages/adapters`; per-template field-mapping.
- OAuth adapters (Notion) connect via the dashboard's connect-flow (F05), not a
  pasted token.

## Dependencies

- F02 (framework). F05 (dashboard, for OAuth connect-flows).

## Acceptance criteria

- Each default adapter delivers a test note to a live sandbox of that service.
- Token-only setup works for webhook/REST adapters; Notion OAuth connect works.
- trail notes land as candidates with `connector:notesmem` attribution.

## Rollout

trail + Notion + Slack first (highest value), then the long tail.

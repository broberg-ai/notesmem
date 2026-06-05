# F01 — Cloud core: ingest, storage & backup

> Phase 1 foundation. See [F00 overview](./F00-notesmem-overview.md) for the full vision.

## Motivation

The cloud is the brain. Before any adapter can fan out, notes/ideas must be
received, validated, stored (with their image attachments), and durably backed up.
F01 is the spine every other epic hangs off — the app only ever talks to this.

## Scope (in)

- Bun + Hono service (`apps/cloud`), deployed Fly.io region `arn`, TLS.
- `POST /ingest` — accept a note: `{text, tags[], image_url[]?, source, target?, device_id}`. Zod-validated (from `packages/shared`).
- Note + Attachment data model in bun:sqlite (Drizzle). Delivery-log table (per-adapter status) — schema only here; the fan-out engine is F02.
- **Tigris** (S3-compatible) blob storage for image attachments; the cloud hosts the canonical blob and mints the `image_url`.
- Note **backup store** — every ingested note retained as the user's own backup, independent of adapter delivery.
- Health/readiness endpoint.

## Scope (out / non-goals)

- Adapter fan-out + retry (F02).
- Login/OAuth (F05 dashboard; `/ingest` uses a device token).
- Inbound push gateway (Phase 2).

## Architecture notes

- Single source of config via Fly secrets; no hardcoded URLs.
- Device-token auth on `/ingest` (the app is accountless). Token is issued at QR pairing (F05).
- Attachments: app uploads image → Tigris (pre-signed PUT) → passes `image_url` in `/ingest`. Cloud validates mime-allowlist + size cap.

## Dependencies

- Tigris bucket (`tigris` skill).
- `packages/shared` Zod schemas (Note, Attachment, Delivery).

## Acceptance criteria

- `POST /ingest` with text+tags persists a note + returns an id; retrievable from the backup store.
- Image attachment round-trips: pre-signed upload → `image_url` stored → fetchable.
- Invalid payload → 400 with a Zod error.
- Deployed to Fly `arn` over TLS; health endpoint returns 200.

## Rollout

Internal only. First consumer is the cardmem adapter (F03), whose contract is
already live-verified.

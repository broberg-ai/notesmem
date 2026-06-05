# F10 — Fleet / AI integrations

> Phase 1. See [F00 overview](./F00-notesmem-overview.md).

## Motivation

Wire notesmem into the fleet's telemetry and (optionally) enrich notes with AI
before they fan out — without violating fleet policy or hitting the dual-key trap.

## Scope (in)

- **upmetrics error tracking**: cloud inits `@upmetrics/sdk` with a **DSN** (public).
- **AI-cost telemetry**: ai-sdk's `upmetricsSink` with the **`uk_` COST key**
  (secret). DSN ≠ cost key — the dual-key trap that cost cms/sa time.
- **Note→idea enrichment** (auto title / tags / summary before Inbox) via
  `mistral-small-latest` (~$0.0005/call), **EU/Paris** (GDPR — notes are personal
  data).
- All LLM via `@broberg/ai-sdk` (fleet policy). Never headless `claude -p`
  (metered from 2026-06-15) — small paid ai-sdk calls only.

## Scope (out / non-goals)

- Provider-direct calls; home-rolled cost/failover.

## Architecture notes

- Enrichment runs in the cloud layer (never in Swift/Kotlin), before adapter
  delivery. `labels:{noteId}` for per-note cost attribution.
- Needs an upmetrics "notesmem" project provisioned (DSN + `uk_`).

## Dependencies

- F01 (cloud), F02/F03 (enrichment precedes delivery). upmetrics project.

## Acceptance criteria

- Cloud errors appear in upmetrics.
- An enrichment call's cost lands in upmetrics with `labels{noteId}`.
- Enrichment adds a title + tags to a note; Mistral (EU) used for personal data.

## Rollout

Behind a flag; enrichment is opt-in per adapter.

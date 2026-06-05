# F05 — Config API + Preact dashboard

> Phase 1. See [F00 overview](./F00-notesmem-overview.md).

## Motivation

The "simple cloud service" where you configure your receivers. Login lives HERE
(web), not in the app — so the app stays accountless and dodges the Sign-in-with-
Apple requirement.

## Scope (in)

- Preact dashboard (`apps/dashboard`) + the config REST API behind it.
- **Login: Sign in with Apple + Google OAuth** (web only).
- **Adapter CRUD**: add/edit/remove, set name, toggle default-fanout membership.
- **QR / deep-link device pairing**: issues the device token the app uses for
  `/ingest`. One scan links a phone to the cloud account.
- **Delete cloud data / unlink device** control (honest, App-Store-safe).

## Scope (out / non-goals)

- MCP config surface (F06). Inbound (Phase 2).

## Architecture notes

- OAuth on the WEB only — the app never shows login → no SiwA trigger on the app.
- House rules: NO native dialogs/selects — custom UI components only. Every
  interactive element carries a kebab-case `data-testid` (Lens).
- Buttons give feedback (:active/:hover/loading/confirm) per house rules.

## Dependencies

- F01 (core), F02 (adapters to manage).

## Acceptance criteria

- Log in with Apple; log in with Google.
- Add / edit / remove an adapter; toggle its default-fanout membership.
- Pair a phone via QR → a device token is issued and the app can ingest.
- Delete-cloud-data / unlink-device works.

## Rollout

Internal; deploy Fly `arn`. data-testid sweep before any Lens baseline.

# F07 — iOS app (Swift)

> Phase 1. See [F00 overview](./F00-notesmem-overview.md).

## Motivation

The capture client — the fastest way to get a thought out of your head. One screen,
zero friction, useful offline. Share-sheet (incl. images) is a core capture path,
not a nice-to-have.

## Scope (in)

- Swift / SwiftUI app (`apps/ios`); single capture screen (text + dictation).
- **Share Extension** accepting text AND images from Photos / any app.
- **Offline queue**: persist captures, flush on connectivity.
- **Local backup** of notes on-device.
- **Face ID / Touch ID** app-lock.
- Target quick-picker + inline `@adapter` addressing.
- Talks ONLY to the notesmem cloud `/ingest` with the device token from QR pairing.

## Scope (out / non-goals)

- Push / inbound (Phase 2 + Watch). No account/login in the app (device token only).

## Architecture notes

- Image via Share Sheet / PHPicker → pre-signed upload to Tigris → `image_url` in
  `/ingest`. **No Photos permission needed** for share/PHPicker (App-Store-friendly).
- Mic purpose string (dictation) WHAT+EXAMPLE. Privacy Manifest (handled in F09).

## Dependencies

- F01 (ingest), F05 (QR pairing / device token).

## Acceptance criteria

- Capture + send a note online; it appears in the cloud backup.
- Offline capture is queued and flushes when back online.
- Share a screenshot from Photos → it lands in the cloud (→ cardmem via F03).
- Face ID locks the app.
- Target-pick / `@adapter` sends to a single adapter only.

## Rollout

TestFlight first.

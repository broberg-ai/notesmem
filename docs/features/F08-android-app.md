# F08 — Android app (Kotlin)

> Phase 1. See [F00 overview](./F00-notesmem-overview.md).

## Motivation

The Android capture client — the same ultra-thin capture experience as iOS (F07).

## Scope (in)

- Kotlin app (`apps/android`); single capture screen (text + dictation).
- **Share target** accepting text AND images from any app / Photos.
- **Offline queue** (WorkManager): persist + flush on connectivity.
- **Local backup** on-device.
- **Biometric** app-lock.
- Target quick-picker + inline `@adapter` addressing.
- FCM token registration scaffold (readiness for Phase 2 inbound push).
- Talks ONLY to the notesmem cloud `/ingest` with the device token.

## Scope (out / non-goals)

- Inbound push delivery (Phase 2). No account/login (device token only).

## Architecture notes

- Image via share target / system picker → pre-signed upload to Tigris → `image_url`.
- Latest target API level (Play requirement).

## Dependencies

- F01 (ingest), F05 (QR pairing / device token).

## Acceptance criteria

- Capture + send online; appears in cloud backup.
- Offline capture queued + flushed.
- Share a screenshot → lands in the cloud (→ cardmem via F03).
- Biometric locks the app.
- Target-pick / `@adapter` sends to a single adapter only.

## Rollout

Play internal test first; latest target API level.

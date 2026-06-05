# F11 — Push gateway core (inbound)

> Phase 2 anchor. See [F00 overview](./F00-notesmem-overview.md).

## Motivation

The inbound half of notesmem. Any cloud service that lacks a push channel
registers with notesmem and pushes native notifications to the user's phone (and,
later, Apple Watch). The Pushover / ntfy / PagerDuty-lite category. This is what
turns notesmem from a capture app into a bidirectional signal hub — and what
closes the screenshot→cardmem→plan&build→push round-trip.

## Scope (in)

- **Per-source ingest endpoint + token**: a service registers and gets a URL +
  token to POST notifications (the inbound mirror of the URL+token adapter).
- **Device registry**: which devices belong to a user (reuses F05 QR pairing).
- **APN (iOS) + FCM (Android) relay**: cloud holds the push credentials.
- **Notification model**: `{title, body, image_url?, priority, source, data}`.
- Push delivery to all of a user's registered devices.
- Message-count accounting per source/user (tiering hook for later pricing).

## Scope (out / non-goals)

- ACK (F12), Apple Watch (F13), Critical/persistent alerts (F14), escalations (F15).

## Architecture notes

- Reuses the device registration from F05 — the QR pairing already knows the device.
- An inbound "source" is the mirror of an outbound adapter; same mental model.
- APN/FCM credentials in Fly secrets.

## Dependencies

- F05 (device registry / pairing), F01 (cloud).

## Acceptance criteria

- A registered service POSTs a notification with its token → it arrives as a native
  push on the user's iOS + Android devices.
- A note's `image_url` is carried as a rich-push attachment where supported.

## Rollout

Start of Phase 2. Dogfood with the cardmem→push leg of the flagship round-trip.

# F09 — Store readiness (App Store + Play)

> Phase 1. See [F00 overview](./F00-notesmem-overview.md). Distilled from fleet Q&R #3359.

## Motivation

Get both apps approved quickly and painlessly. The fleet was unanimous on the
failure modes that actually cost reviews — this epic bakes them in.

## Scope (in)

- **iOS purpose strings** (5.1.1ii): WHAT + EXAMPLE per permission. No vague text.
- **iOS Privacy Manifest** (`PrivacyInfo.xcprivacy`) + required-reason APIs.
- **App Privacy nutrition labels** (iOS) + **Play Data Safety** — honest: notes +
  adapter tokens leave the device to user-configured third parties.
- **ATS**: remove `NSAllowsArbitraryLoads`; all traffic HTTPS/TLS.
- **Privacy-policy URL** (required both stores).
- **In-app delete-cloud-data / unlink-device** (covers 5.1.1v even though app is
  accountless).
- **4.2 minimum functionality**: capture is genuinely useful + offline-usable on
  its own; adapters are advanced config, not the whole point.
- App icons, onboarding, empty states, button feedback.

## Scope (out / non-goals)

- The submission/review iteration itself (process, not a build artifact).

## Dependencies

- F07 (iOS), F08 (Android).

## Acceptance criteria

- Pre-submit checklist passes: no `NSAllowsArbitraryLoads`; specific purpose
  strings; Privacy Manifest present; Data Safety drafted; privacy-policy live;
  delete-data reachable in-app; offline capture works with zero adapters.

## Rollout

TestFlight + Play internal track → submit.

# F13 — Apple Watch app (watchOS)

> Phase 2. See [F00 overview](./F00-notesmem-overview.md).

## Motivation

Alerts on the wrist are the highest-value surface for inbound notifications — the
closing leg of the screenshot→plan&build→push round-trip lands here.

## Scope (in)

- watchOS target (in `apps/ios`); receive + display notifications.
- **ACK from the Watch** (updates F12 receipt state).
- Optional complication / quick-glance for recent alerts.

## Scope (out / non-goals)

- Critical Alerts entitlement (F14).

## Architecture notes

- Extra build target — real incremental work, but high value for alerting.

## Dependencies

- F11 (push), F12 (ACK).

## Acceptance criteria

- A pushed alert appears on the Apple Watch.
- ACK from the Watch updates the receipt/ack status.

## Rollout

Phase 2, after F11/F12.

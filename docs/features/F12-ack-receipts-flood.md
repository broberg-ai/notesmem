# F12 — Acknowledgement (ACK) + receipts + flood protection

> Phase 2. See [F00 overview](./F00-notesmem-overview.md).

## Motivation

An alert is only useful if you know a human saw it — and the system must survive a
storm of events without burying the user.

## Scope (in)

- **ACK**: recipient taps to acknowledge; the sender can query / receive ack status.
- **Delivery receipts**: per-notification state (sent / delivered / seen / acked).
- **Flood protection**: throttle when many events fire from one source in a short
  window; the alert is still shown in-app, just coalesced from the push storm.

## Scope (out / non-goals)

- Persistent/critical nagging (F14), escalations (F15).

## Dependencies

- F11 (push gateway core).

## Acceptance criteria

- A pushed alert can be acknowledged from the device; the sender sees ack status.
- Receipts transition sent→delivered→seen→acked correctly.
- A burst from one source is throttled but remains visible in-app.

## Rollout

Phase 2, after F11.

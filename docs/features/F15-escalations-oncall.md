# F15 — Escalations + on-call

> Phase 3 (Enterprise tier). See [F00 overview](./F00-notesmem-overview.md).

## Motivation

Enterprise-grade alerting: if an alert isn't acknowledged within a response time,
escalate it to the next person / a manager. Plus the tiering hooks the pricing
model implies.

## Scope (in)

- **Response-time tracking** per alert.
- **Escalation policies**: escalate to the next recipient / manager after a timeout.
- **Basic on-call schedules**.
- **Message-limit tiering** enforcement (Standard / Business / Enterprise hooks).

## Scope (out / non-goals)

- Full PagerDuty parity (advanced rotations, overrides, analytics).

## Dependencies

- F11 (push), F12 (ACK / receipts — escalation triggers on no-ACK).

## Acceptance criteria

- An unacknowledged alert escalates to the configured next recipient after the
  timeout; the escalation is logged.
- Tier limits are enforced per source/user.

## Rollout

Phase 3, last. Pricing tiers wired here.

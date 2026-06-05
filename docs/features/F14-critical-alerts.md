# F14 — Critical/persistent alerts + geo + rich push

> Phase 3 (Business/Enterprise tier). See [F00 overview](./F00-notesmem-overview.md).

## Motivation

On-call grade alerting: an alert that nags until acknowledged and can break through
silent/Do-Not-Disturb, with location and image context.

## Scope (in)

- **Apple Critical Alerts entitlement** (request + justify with Apple).
- **Persistent/repeating ("nagging")** notifications until ACK.
- **DND bypass** (with the entitlement).
- **Geo-location & maps** in alerts.
- **Rich push with image** attachment (screenshot inside the notification).

## Scope (out / non-goals)

- Escalation routing (F15).

## Architecture notes / risks

- ⚠️ The Critical Alerts entitlement is granted by Apple on request — not
  automatic. v1 and Phase 2 must NOT depend on it. Standard push + ACK (F11/F12)
  need no entitlement.

## Dependencies

- F11, F12, F13 (Watch), F09 (entitlement/manifest handling). Apple entitlement
  approval (external gate).

## Acceptance criteria

- A critical alert repeats until acknowledged and bypasses silent/DND (entitlement granted).
- An alert renders a map + an image attachment.

## Rollout

Phase 3. Gate the persistent/DND-bypass behaviour on the entitlement landing.

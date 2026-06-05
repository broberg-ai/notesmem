# F03 — Cardmem Inbox adapter (reference + flagship)

> Phase 1. See [F00 overview](./F00-notesmem-overview.md).

## Motivation

cardmem Inbox is the first, reference adapter and the target of the flagship
dogfood: a phone screenshot of a bug → notesmem → cardmem Inbox → plan & build →
push back. **The contract is already live-verified** (2026-06-05: HTTP 200,
`idea_id` returned).

## Scope (in)

- Adapter type `cardmem`: `POST https://services.cardmem.com/api/board/idea`,
  `Authorization: Bearer $CARDMEM_INGEST_KEY`, body
  `{project_slug:"notesmem", text, source:"notesmem", tags}`.
- Title = first line of `text` (no dedicated title field today). Note vs idea via
  tag (`["note"]` / `["idea"]`).
- Carry `source:"notesmem"` → origin filter pill + 🗒 icon in the Inbox.
- Image: when cardmem ships its `image_urls` field, send the Tigris `image_url(s)`;
  until then, append the URL into `text` (renders as a clickable link).
- Document the screenshot→plan&build flagship flow end-to-end.

## Scope (out / non-goals)

- The cardmem-side `image_urls` field (cardmem owns it — tracked as a dependency).

## Architecture notes

- Idempotency: cardmem has a 30s same-(user,text) dedup window; for batch sync,
  adopt cardmem's `fingerprint` param when it lands.
- Key from `CARDMEM_INGEST_KEY` in `.env` (provisioned by cardmem, gitignored).

## Dependencies

- F02 (adapter framework). cardmem `image_urls` field (full image flow only).

## Acceptance criteria

- A notesmem note delivers to cardmem Inbox and returns `idea_id`. ✅ live-verified.
- `source:"notesmem"` shows the origin pill; tags carried.
- A note tagged `["idea"]` vs `["note"]` both land; the distinction is visible.
- A note with an image: the Tigris URL reaches cardmem (in `text` now; `image_urls`
  when the field is live).

## Rollout

Already smoke-tested end-to-end. Ships as the first wired adapter.

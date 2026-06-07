# F00 — notesmem: a bidirectional signal hub (overview)

> Master plan-doc. Each epic F01–F15 has its own plan-doc; this is the vision they
> hang off. Written 2026-06-05 after a fleet Q&R (Q&R #3359) and a verified live
> integration test against cardmem Inbox.

## What notesmem is

The fastest possible "capture a thought" app — and its mirror image, the fastest
way for any service to reach your phone. One ultra-thin native client (Swift on
iOS, Kotlin on Android), one thin cloud, two directions:

- **Outbound (capture → fan-out):** type/dictate/share a note or idea → it lands
  wherever it should live (cardmem Inbox, trail, Notion, Slack, …). The phone is
  dumb-fast; the cloud is the brain that fans out to configurable adapters.
- **Inbound (push gateway):** any cloud service that lacks a push channel registers
  with notesmem and pushes native notifications to your phone + Apple Watch
  (Pushover / ntfy / PagerDuty-lite category).

The two halves share ~90% of the architecture — the app shell, the device
registration (the QR pairing built for outbound is exactly what inbound needs to
know *where* to push), the cloud relay, and the URL+token "adapter" model. Bundling
them is cheaper than two apps, and it unlocks **round-trip workflows**:

```
📸 iPhone screenshot of a bug
   → share to notesmem
   → cardmem Inbox (idea, source:notesmem, with the image)
   → cardmem/buddy turns it into plan & build
   → 🔔 push back to your Apple Watch: "Fix shipped ✅"
```

That round-trip is the flagship dogfood and the demo that sells the whole product.

## Architecture

**Repo:** pnpm-workspaces + Turbo monorepo.

```
notesmem/
├─ apps/
│  ├─ cloud/      Bun + Hono — ingest API, fan-out engine, push gateway (APN/FCM)
│  ├─ dashboard/  Preact — config UI (Apple+Google OAuth, adapters, QR pairing)
│  ├─ mcp/        @modelcontextprotocol/sdk — configure the cloud via MCP tools
│  ├─ ios/        Swift (Xcode)  — capture + share-sheet + push + Watch   *colocated
│  └─ android/    Kotlin (Gradle) — same                                  *colocated
├─ packages/
│  ├─ shared/     Zod schemas: Note, Adapter, Delivery, Attachment + types
│  └─ adapters/   adapter implementations (cardmem, trail, notion, …)
└─ docs/features/ F-plan-docs
```

\*The native apps live in the same git repo (shared docs/CI/dogfood story) but are
**not** pnpm workspaces — Swift/Kotlin build with Xcode/Gradle. pnpm+Turbo manage
the TS side only.

**Three config surfaces over one core** — REST API (apps/scripts/CI), Preact
dashboard (human, browser), MCP server (cc sessions / Claude Desktop). All three
read/write the same cloud state.

**Delivery path:** app → cloud → fan-out. The cloud owns the note backup, the
delivery log, and retry — so the app only ever knows ONE address, and you can add
or reconfigure adapters without shipping an app update.

**Storage:** bun:sqlite for metadata + delivery log; **Cloudflare R2** (EU/EEUR,
S3-compatible object storage) for image/attachment blobs (notesmem hosts the
canonical blob and passes an `image_url` to adapters).

**Deploy:** Fly.io, region `arn` (Stockholm).

## The adapter model (the heart)

Every adapter has a **name**. A note carries `text + tags + image_url(s)`.

- **Default fan-out:** you choose which named adapters are in the default broadcast.
- **Target-override:** send a note to ONLY one named adapter — via a quick-picker in
  the app or inline addressing (`@cardmem buy milk`).
- **Generic adapter:** URL + token + method + a small field-mapping, so any service
  with a token-auth REST endpoint becomes a receiver.

## Roadmap — 3 phases

**Phase 1 — Outbound capture & fan-out + config surfaces**

| F | Epic |
|---|---|
| F01 | Cloud core — ingest API, note/attachment model, R2 blobs, SQLite, backup |
| F02 | Adapter framework + routing — named adapters, default fan-out, `@target`, delivery log + retry, attachment forwarding |
| F03 | Cardmem Inbox adapter — reference adapter, the screenshot→plan&build flagship (✅ contract live-verified) |
| F04 | Default outbound adapters — trail, Notion, Slack, Todoist, Telegram, Readwise, Linear, Discord, Airtable, generic webhook, email, Zapier/Make |
| F05 | Config API + Preact dashboard — Apple+Google OAuth, adapter CRUD, QR pairing |
| F06 | MCP server — configure the cloud via MCP tools, auth, `.mcp.json` distribution |
| F07 | iOS app — Swift: capture, share-sheet (incl. images), offline queue, backup, Face ID lock |
| F08 | Android app — Kotlin: same |
| F09 | Store readiness — purpose strings, Privacy Manifest, ATS, Data Safety, delete-cloud-data |
| F10 | Fleet/AI — upmetrics cost+errors (dual-key), ai-sdk Mistral note→idea enrichment (EU/GDPR) |

**Phase 2 — Inbound push gateway**

| F | Epic |
|---|---|
| F11 | Push gateway core — per-app ingest endpoint + token, device registry, APN+FCM relay, push to iOS/Android |
| F12 | Acknowledgement (ACK) + delivery receipts + flood protection |
| F13 | Apple Watch app (watchOS) |

**Phase 3 — Advanced alerting (Business/Enterprise tier)**

| F | Epic |
|---|---|
| F14 | Critical/persistent alerts (Apple Critical Alerts entitlement) + geo & maps + rich push with image |
| F15 | Escalations + on-call (response-time tracking, escalate to manager) |

## Locked integration contracts

- **cardmem Inbox (F03):** `POST https://services.cardmem.com/api/board/idea`,
  `Authorization: Bearer $CARDMEM_INGEST_KEY`, body
  `{project_slug:"notesmem", text, source:"notesmem", tags}` → `{idea_id}`.
  Note vs idea = a tag (`["note"]` / `["idea"]`). Title = first line of `text`
  (no dedicated title field today). 30s same-(user,text) dedup; fingerprint param
  available later for batch sync. **Live-verified 2026-06-05** (idea_id returned,
  HTTP 200). Key delivered to `.env` by cardmem (gitignored).
- **trail (F04):** `POST {TRAIL_CLOUD_API}/api/v1/queue/candidates`,
  `Authorization: Bearer <trail_ key>` + `X-Trail-Tenant`, body
  `{kind:"external-feed", path:"/neurons/sources/notesmem/", title, content, metadata:{connector:"notesmem"}}`.
  Register `notesmem` as a connector id. Cost auto-attributed.
- **upmetrics (F10):** two keys — DSN (public, error capture via `@upmetrics/sdk`)
  and `uk_` cost key (secret, via ai-sdk's upmetricsSink). **DSN ≠ cost key**
  (the dual-key trap that cost cms/sa time). upmetrics can provision a "notesmem"
  project and deliver both securely.
- **ai-sdk (F10):** LLM lives in the cloud layer, never in Swift/Kotlin. Note→idea
  enrichment (auto-title/tags/summary before Inbox): `mistral-small-latest`
  ~$0.0005/call, EU/Paris (GDPR — notes are personal data). All LLM via
  `@broberg/ai-sdk` (fleet policy); headless `claude -p` is metered from
  2026-06-15, so use small paid ai-sdk calls, not headless.
- **cms (backlog):** `POST /api/cms/{collection}/{slug}` + `X-CMS-Service-Token`
  if notes should become CMS content later.
- **buddy (backlog):** if notesmem runs as a cc session — fleet bus, notify_mobile
  (push to Christian's iPhone), schedule_job (cron). Candidate for a daily digest.

## App Store / Play strategy (fleet consensus, Q&R #3359)

- **Purpose strings (5.1.1ii)** — WHAT + EXAMPLE per permission. Vague = instant reject.
- **Minimum permissions** — ideally network-only in v1. Receiving an image via Share
  Sheet / PHPicker needs NO Photos permission; only camera or full-library access does.
- **4.2 minimum functionality** — a thin URL+token app risks "too simple". Mitigation:
  capture must be genuinely useful + offline-usable on its own; the inbound push
  gateway further removes this risk (clearly substantial app).
- **Privacy labels + Data Safety must be honest** — declare that notes leave the
  device to user-configured adapters (third-party sharing) + a reachable
  privacy-policy URL. Mismatch = reject.
- **In-app account deletion (5.1.1v)** — only required if the app has an account.
  notesmem app is accountless (device token) → likely exempt, but we still offer
  "unlink device / delete cloud data".
- **Sign in with Apple (4.8)** — only required if the app offers social login. Our
  token-only app avoids it; login lives on the web dashboard only.
- **iOS Privacy Manifest** (PrivacyInfo.xcprivacy) + required-reason APIs — builds
  rejected without.
- **ATS** — remove NSAllowsArbitraryLoads; all traffic over HTTPS/TLS.
- **Play** — honest Data Safety form, latest target API level, TestFlight/internal
  test first.

## Cross-project dependencies

- **cardmem image attachments** — the full image flow (F03) needs cardmem to ship
  an `image_urls` field on ideas + thumbnail render + a mime/size contract. Already
  an idea in Christian's cardmem inbox. Text+tags works today; images land when
  cardmem's field is live. (Hard dependency for the screenshot flagship.)
- **upmetrics "notesmem" project** — needed before F10 telemetry wiring.
- **Apple Critical Alerts entitlement** — request + justify with Apple; F14 must not
  block v1 on it.

## Non-goals (v1)

- No UGC / sharing / public notes (avoids content-moderation review).
- No background sync modes beyond a simple offline queue flush.
- No real `title` field on cardmem ideas (fold into text first line).
- No Obsidian / Apple Notes adapters — local-first, no cloud REST API; possible
  later device-side Shortcuts bridge, never a cloud adapter.
- Phase 2/3 features (push gateway, Watch, escalations) are planned, not built in
  Phase 1.

## Status / proof

- Q&R #3359 sent to the fleet; 8/9 sessions answered (App Store consensus +
  integration contracts).
- cardmem Inbox adapter contract **live-verified** 2026-06-05 (HTTP 200, idea_id
  returned, `source:notesmem` + tags accepted).
- `CARDMEM_INGEST_KEY` provisioned into `.env` by cardmem (gitignored).

# F06 — MCP server

> Phase 1. See [F00 overview](./F00-notesmem-overview.md).

## Motivation

Configure the notesmem cloud from cc / Claude Desktop — a third surface over the
same core (alongside REST API + dashboard). Makes notesmem a fleet citizen: a cc
session can add an adapter or fire a test note straight from the terminal.

## Scope (in)

- `apps/mcp` using `@modelcontextprotocol/sdk`.
- Tools: `notesmem_add_adapter`, `notesmem_list_adapters`,
  `notesmem_remove_adapter`, `notesmem_send_note({text, tags, image_url?, target?})`.
- Auth via a per-user scoped key.
- `.mcp.json` distribution snippet for the fleet.

## Scope (out / non-goals)

- Inbound push tools (Phase 2: `notesmem_register_source`, `notesmem_send_push`).

## Architecture notes

- The MCP server calls the SAME config API as the dashboard (F05) — one core,
  three surfaces. No business logic duplicated in the MCP layer.

## Dependencies

- F05 (config API + auth/token issuance).

## Acceptance criteria

- An MCP client can add / list / remove an adapter and send a test note.
- Auth is required; an unscoped/absent key is rejected.

## Rollout

Publish a `.mcp.json` snippet so any cc session can manage its own notesmem cloud.

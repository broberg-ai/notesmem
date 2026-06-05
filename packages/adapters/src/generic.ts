import type { Adapter } from "@notesmem/shared";
import type { AdapterDriver, DeliverableNote } from "./types";

/** Build the destination payload: a fieldMapping if configured, else the note as-is. */
function buildPayload(
  note: DeliverableNote,
  adapter: Adapter,
): Record<string, unknown> {
  const src: Record<string, unknown> = {
    text: note.text,
    tags: note.tags,
    source: note.source,
    imageUrls: note.imageUrls,
  };
  if (!adapter.fieldMapping) return src;
  const out: Record<string, unknown> = {};
  for (const [destKey, srcKey] of Object.entries(adapter.fieldMapping)) {
    out[destKey] = src[srcKey];
  }
  return out;
}

/** Generic URL+token adapter — covers any token-auth REST receiver. */
export const genericDriver: AdapterDriver = {
  type: "generic",
  async deliver(note, adapter) {
    if (!adapter.url) return { ok: false, error: "missing url" };
    try {
      const res = await fetch(adapter.url, {
        method: adapter.method ?? "POST",
        headers: {
          "content-type": "application/json",
          ...(adapter.token
            ? { authorization: `Bearer ${adapter.token}` }
            : {}),
        },
        body: JSON.stringify(buildPayload(note, adapter)),
      });
      if (!res.ok) return { ok: false, error: `http ${res.status}` };
      return { ok: true };
    } catch (e) {
      return { ok: false, error: `network: ${String(e)}` };
    }
  },
};

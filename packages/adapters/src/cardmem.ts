import type { AdapterDriver } from "./types";

const CARDMEM_URL = "https://services.cardmem.com/api/board/idea";

/** Cardmem Inbox adapter (reference). Contract live-verified 2026-06-05. */
export const cardmemDriver: AdapterDriver = {
  type: "cardmem",
  async deliver(note, adapter) {
    const token = adapter.token;
    if (!token) return { ok: false, error: "missing cardmem token" };
    const projectSlug = adapter.fieldMapping?.projectSlug ?? "notesmem";

    // Until cardmem ships an image_urls field (F03.3), append image URLs into text.
    const text =
      note.imageUrls.length > 0
        ? `${note.text}\n\n${note.imageUrls.join("\n")}`
        : note.text;

    try {
      const res = await fetch(CARDMEM_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_slug: projectSlug,
          text,
          source: "notesmem",
          tags: note.tags,
        }),
      });
      if (!res.ok) return { ok: false, error: `cardmem http ${res.status}` };
      const body = (await res.json()) as { idea_id?: string };
      return { ok: true, ref: body.idea_id };
    } catch (e) {
      return { ok: false, error: `network: ${String(e)}` };
    }
  },
};

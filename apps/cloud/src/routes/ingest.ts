import { Hono } from "hono";
import { IngestNoteSchema } from "@notesmem/shared";
import { db, schema } from "../db/index";
import { requireDeviceToken } from "../auth";

export const ingest = new Hono();

ingest.post("/", requireDeviceToken, async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "invalid_json" }, 400);
  }

  const parsed = IngestNoteSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid_note", issues: parsed.error.issues }, 400);
  }

  const note = parsed.data;
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  // Persist the note (this row IS the user's own backup, independent of delivery).
  db.insert(schema.notes)
    .values({
      id,
      text: note.text,
      tags: note.tags ?? [],
      source: note.source,
      target: note.target,
      deviceId: note.deviceId,
      createdAt,
    })
    .run();

  // imageUrls are stored as minimal attachment rows here; F01.5 (Tigris) refines
  // them with the real mime/size captured at upload time.
  for (const url of note.imageUrls ?? []) {
    db.insert(schema.attachments)
      .values({
        id: crypto.randomUUID(),
        noteId: id,
        url,
        mime: "application/octet-stream",
        sizeBytes: 0,
      })
      .run();
  }

  return c.json({ id, createdAt }, 201);
});

import { z } from "zod";

/** Where a captured note originated. */
export const NoteSource = z.enum([
  "manual",
  "dictation",
  "share-sheet",
  "mcp",
  "api",
]);
export type NoteSource = z.infer<typeof NoteSource>;

/** An image (or other) blob attached to a note, hosted on Cloudflare R2 (EU). */
export const AttachmentSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  mime: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
export type Attachment = z.infer<typeof AttachmentSchema>;

/** A stored note/idea. The first line of `text` doubles as the title. */
export const NoteSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  tags: z.array(z.string()).default([]),
  attachments: z.array(AttachmentSchema).default([]),
  source: NoteSource,
  /** Optional single-adapter target (name); absent = default fan-out. */
  target: z.string().optional(),
  deviceId: z.string(),
  createdAt: z.string().datetime(),
});
export type Note = z.infer<typeof NoteSchema>;

/** The body accepted by POST /ingest (the server fills id + createdAt). */
export const IngestNoteSchema = z.object({
  text: z.string().min(1),
  tags: z.array(z.string()).optional(),
  imageUrls: z.array(z.string().url()).optional(),
  source: NoteSource,
  target: z.string().optional(),
  deviceId: z.string(),
});
export type IngestNote = z.infer<typeof IngestNoteSchema>;

/** Per-(note, adapter) delivery state. */
export const DeliveryStatus = z.enum(["pending", "sent", "failed"]);
export type DeliveryStatus = z.infer<typeof DeliveryStatus>;

export const DeliverySchema = z.object({
  id: z.string(),
  noteId: z.string(),
  adapterName: z.string(),
  status: DeliveryStatus,
  attempts: z.number().int().nonnegative().default(0),
  lastError: z.string().optional(),
  deliveredAt: z.string().datetime().optional(),
});
export type Delivery = z.infer<typeof DeliverySchema>;

/** A configured outbound receiver. */
export const AdapterType = z.enum([
  "cardmem",
  "trail",
  "notion",
  "slack",
  "todoist",
  "telegram",
  "readwise",
  "linear",
  "discord",
  "airtable",
  "email",
  "webhook",
  "generic",
]);
export type AdapterType = z.infer<typeof AdapterType>;

export const AdapterSchema = z.object({
  name: z.string().min(1),
  type: AdapterType,
  url: z.string().url().optional(),
  token: z.string().optional(),
  method: z.enum(["POST", "PUT"]).default("POST"),
  /** Declarative note -> destination payload field mapping. */
  fieldMapping: z.record(z.string(), z.string()).optional(),
  inDefaultFanout: z.boolean().default(true),
});
export type Adapter = z.infer<typeof AdapterSchema>;

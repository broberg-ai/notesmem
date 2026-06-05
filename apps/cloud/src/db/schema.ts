import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/** Stored notes/ideas. First line of `text` doubles as the title. */
export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
  source: text("source").notNull(),
  target: text("target"),
  deviceId: text("device_id").notNull(),
  createdAt: text("created_at").notNull(),
});

/** Image (or other) blobs hosted on Tigris, linked to a note. */
export const attachments = sqliteTable("attachments", {
  id: text("id").primaryKey(),
  noteId: text("note_id")
    .notNull()
    .references(() => notes.id),
  url: text("url").notNull(),
  mime: text("mime").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  width: integer("width"),
  height: integer("height"),
});

/** Per-(note, adapter) delivery state for the fan-out log. */
export const deliveries = sqliteTable("deliveries", {
  id: text("id").primaryKey(),
  noteId: text("note_id")
    .notNull()
    .references(() => notes.id),
  adapterName: text("adapter_name").notNull(),
  status: text("status").notNull(),
  attempts: integer("attempts").notNull().default(0),
  lastError: text("last_error"),
  deliveredAt: text("delivered_at"),
});

import { eq } from "drizzle-orm";
import { driverFor, type DeliverableNote } from "@notesmem/adapters";
import type { Adapter } from "@notesmem/shared";
import { db, schema } from "./db/index";

export interface FanoutResult {
  adapter: string;
  status: "sent" | "failed";
  ref?: string;
  error?: string;
}

/**
 * Deliver a note to its destinations and log every attempt.
 * Routing: an explicit `target` (single named adapter) wins; otherwise the
 * default fan-out set. One adapter failing never blocks the others.
 */
export async function fanout(
  noteId: string,
  note: DeliverableNote,
  target?: string,
): Promise<FanoutResult[]> {
  const rows = target
    ? db.select().from(schema.adapters).where(eq(schema.adapters.name, target)).all()
    : db
        .select()
        .from(schema.adapters)
        .where(eq(schema.adapters.inDefaultFanout, true))
        .all();

  const results: FanoutResult[] = [];
  for (const row of rows) {
    const adapter: Adapter = {
      name: row.name,
      type: row.type as Adapter["type"],
      url: row.url ?? undefined,
      // Secrets are injected at the cloud layer, not stored in the adapters table.
      // F05 (dashboard) will manage per-adapter tokens; cardmem's key comes from env.
      token:
        row.token ??
        (row.type === "cardmem" ? process.env.CARDMEM_INGEST_KEY : undefined),
      method: row.method as "POST" | "PUT",
      fieldMapping: row.fieldMapping ?? undefined,
      inDefaultFanout: row.inDefaultFanout,
    };

    const deliveryId = crypto.randomUUID();
    db.insert(schema.deliveries)
      .values({
        id: deliveryId,
        noteId,
        adapterName: adapter.name,
        status: "pending",
        attempts: 0,
      })
      .run();

    let status: "sent" | "failed" = "failed";
    let ref: string | undefined;
    let error: string | undefined;
    try {
      const result = await driverFor(adapter.type).deliver(note, adapter);
      status = result.ok ? "sent" : "failed";
      ref = result.ref;
      error = result.error;
    } catch (e) {
      error = String(e);
    }

    db.update(schema.deliveries)
      .set({
        status,
        attempts: 1,
        lastError: error ?? null,
        deliveredAt: status === "sent" ? new Date().toISOString() : null,
      })
      .where(eq(schema.deliveries.id, deliveryId))
      .run();

    results.push({ adapter: adapter.name, status, ref, error });
  }
  return results;
}

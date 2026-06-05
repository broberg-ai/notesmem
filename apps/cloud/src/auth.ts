import type { MiddlewareHandler } from "hono";

/**
 * Minimal device-token gate. Placeholder until F05 issues per-device tokens via
 * QR pairing and stores them in a device registry. For now a single shared
 * INGEST_TOKEN env gates ingest; a missing header or a mismatch → 401.
 */
export const requireDeviceToken: MiddlewareHandler = async (c, next) => {
  const expected = process.env.INGEST_TOKEN;
  const header = c.req.header("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!expected || !token || token !== expected) {
    return c.json({ error: "unauthorized" }, 401);
  }
  await next();
};

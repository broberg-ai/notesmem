import { S3Client } from "bun";

/**
 * Cloudflare R2 (EU jurisdiction) via Bun's native S3 client.
 * Config from env (Fly secrets in prod, .env locally) — never hardcoded.
 */
export const r2 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  bucket: process.env.R2_BUCKET,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  region: "auto",
});

/** Multi-tenant object key: notesmem/tenants/<tenant>/<scopeId>/<filename>. */
export function attachmentKey(
  tenantId: string,
  scopeId: string,
  filename: string,
): string {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  return `notesmem/tenants/${tenantId}/${scopeId}/${safe}`;
}

/** Presigned PUT URL — the app uploads an attachment directly to R2. */
export function presignUpload(
  key: string,
  contentType: string,
  expiresIn = 1800,
): string {
  return r2.presign(key, { method: "PUT", expiresIn, type: contentType });
}

/** Presigned GET URL — read an attachment back (private bucket). */
export function presignDownload(key: string, expiresIn = 604800): string {
  return r2.presign(key, { method: "GET", expiresIn });
}

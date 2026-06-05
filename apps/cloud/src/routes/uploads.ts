import { Hono } from "hono";
import { requireDeviceToken } from "../auth";
import { attachmentKey, presignUpload, presignDownload } from "../storage";

export const uploads = new Hono();

const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/gif",
];

/**
 * Issue a presigned PUT so the app uploads an image straight to R2, plus a
 * presigned GET the note can carry as its image_url. Key is multi-tenant:
 * notesmem/tenants/<tenant>/<uploadId>/<filename>.
 */
uploads.post("/presign", requireDeviceToken, async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "invalid_json" }, 400);
  }

  const { filename, contentType, tenantId } = (body ?? {}) as {
    filename?: string;
    contentType?: string;
    tenantId?: string;
  };

  if (!filename || !contentType || !tenantId) {
    return c.json(
      { error: "filename, contentType and tenantId are required" },
      400,
    );
  }
  if (!ALLOWED_MIME.includes(contentType)) {
    return c.json({ error: "unsupported_content_type", allowed: ALLOWED_MIME }, 415);
  }

  const uploadId = crypto.randomUUID();
  const key = attachmentKey(tenantId, uploadId, filename);
  return c.json(
    {
      key,
      uploadUrl: presignUpload(key, contentType),
      getUrl: presignDownload(key),
    },
    200,
  );
});

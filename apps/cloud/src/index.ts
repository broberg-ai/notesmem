import { Hono } from "hono";
import { ingest } from "./routes/ingest";
import { uploads } from "./routes/uploads";

export const app = new Hono();

app.get("/health", (c) =>
  c.json({ status: "ok", service: "notesmem-cloud" }),
);

app.route("/ingest", ingest);
app.route("/uploads", uploads);

export default {
  port: Number(process.env.PORT ?? 3000),
  fetch: app.fetch,
};

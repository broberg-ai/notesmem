import { Hono } from "hono";
import { ingest } from "./routes/ingest";

export const app = new Hono();

app.get("/health", (c) =>
  c.json({ status: "ok", service: "notesmem-cloud" }),
);

app.route("/ingest", ingest);

export default {
  port: Number(process.env.PORT ?? 3000),
  fetch: app.fetch,
};

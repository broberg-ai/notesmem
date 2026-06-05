import { Hono } from "hono";

export const app = new Hono();

app.get("/health", (c) =>
  c.json({ status: "ok", service: "notesmem-cloud" }),
);

export default {
  port: Number(process.env.PORT ?? 3000),
  fetch: app.fetch,
};

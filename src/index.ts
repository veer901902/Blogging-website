import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const app = new Hono<{ Bindings: { DATABASE_URL: string } }>();

app.get("/", (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,   // in hono we can't access env variable globally
  }).$extends(withAccelerate());

  return c.text("Hello Hono!");
});

app.post("/api/v1/user/signup", (c) => {
  return c.text("Hello Hono!");
});

app.post("/api/v1/user/signin", (c) => {
  return c.text("Hello Hono!");
});

app.post("/api/v1/blog", (c) => {
  return c.text("Hello Hono!");
});

app.put("/api/v1/blog", (c) => {
  return c.text("Hello Hono!");
});

app.get("/api/v1/blog/:id", (c) => {
  return c.text("Hello Hono!");
});

app.get("/api/v1/blog/bulk", (c) => {
  return c.text("Hello Hono!");
});

export default app;

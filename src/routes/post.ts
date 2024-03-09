import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";

const postRouter = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
}>();

postRouter.post("/api/v1/blog", (c) => {
  return c.text("Hello Hono!");
});

postRouter.put("/api/v1/blog", (c) => {
  return c.text("Hello Hono!");
});

postRouter.get("/api/v1/blog/:id", (c) => {
  return c.text("Hello Hono!");
});

postRouter.get("/api/v1/blog/bulk", (c) => {
  return c.text("Hello Hono!");
});


export default postRouter;
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { decode, sign, verify } from "hono/jwt";

const userRouter = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // in hono we can't access env variable globally
  }).$extends(withAccelerate());

  const body = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: { name: body.name, email: body.email, password: body.password },
    });

    const jwt = await sign(user.id, c.env.JWT_SECRET);

    return c.json({ jwt });
  } catch (error) {
    c.status(403);
    console.log(error);
    return c.json({ error: "error while signing up" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // in hono we can't access env variable globally
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const user = await prisma.user.findFirst({
    where: { email: body.email, password: body.password },
  });

  if (!user) {
    c.status(403);
    return c.json({ error: "User not found" });
  }

  const jwt = await sign(user.id, c.env.JWT_SECRET);

  return c.json({ jwt });
});

export default userRouter;

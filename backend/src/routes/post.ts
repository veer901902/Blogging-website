import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createPostInput, updatePostInput } from "@veer901902/medium-common";

const postRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

postRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);
    console.log(user);
    if (user) {
      c.set("userId", user);
      await next();
    } else {
      c.status(403);
      return c.json({ message: "You are not logged in" });
    }
  } catch (err) {
    c.status(403);
    return c.json({ message: "You are not logged in" });
  }
});

postRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // in hono we can't access env variable globally
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = createPostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const authorId = c.get("userId");

  try {
    const post = await prisma.post.create({
      data: { title: body.title, content: body.content, authorId },
    });

    return c.json({ id: post.id });
  } catch (err) {
    return c.json({ message: "Can't create" });
  }
});

postRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // in hono we can't access env variable globally
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const { success } = updatePostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  try {
    const post = await prisma.post.update({
      where: { id: body.id },
      data: { title: body.title, content: body.content },
    });
    return c.text("Updated Post");
  } catch (err) {
    return c.json({ message: "Error while updating" });
  }
});

postRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // in hono we can't access env variable globally
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return c.json(posts);
  } catch (err) {
    return c.json({ message: "No posts" });
  }
});

postRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, // in hono we can't access env variable globally
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        author: { select: { name: true } },
      },
    });
    return c.json(post);
  } catch (err) {
    return c.json({ message: "Not found" });
  }
});

export default postRouter;

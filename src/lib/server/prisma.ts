import { env } from "$env/dynamic/private";
import { PrismaClient as PrismaClientEdgge } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClientEdgge({
  datasourceUrl: env.DATABASE_URL,
}).$extends(withAccelerate());

export { prisma };

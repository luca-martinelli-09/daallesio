import { env } from "$env/dynamic/private";
import { dev } from "$app/environment";
import { PrismaClient } from "@prisma/client/edge";
import { PrismaClient as PrismaClientEdgge } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = dev
  ? new PrismaClient({
      datasources: {
        db: {
          url: env.DIRECT_DATABASE_URL,
        },
      },
    })
  : new PrismaClientEdgge({
      datasourceUrl: env.DATABASE_URL,
    }).$extends(withAccelerate());

export { prisma };

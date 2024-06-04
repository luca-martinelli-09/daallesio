import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import crypto from "node:crypto";
import { Lucia } from "lucia";
import { prisma } from "./prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      username: attributes.username,
      name: attributes.name,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
  name: string;
}

export function hashPassword(password: string) {
  return crypto
    .createHash("sha256")
    .update(password + env.SALT)
    .digest("base64");
}

export function comparePassword(hashedPassword: string, password: string) {
  return hashPassword(password) === hashedPassword;
}

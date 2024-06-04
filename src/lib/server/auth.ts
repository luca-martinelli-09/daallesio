import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import type { Options } from "@node-rs/argon2";
import { hash } from "@node-rs/argon2";
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

export const hashOptions: Options = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export function saltedPassword(password: string) {
  return hash(password + env.SALT, hashOptions) + env.SALT;
}

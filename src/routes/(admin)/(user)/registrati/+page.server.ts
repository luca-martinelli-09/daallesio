import { env } from "$env/dynamic/private";
import { registerSchema } from "$lib/form/schema";
import { hashOptions, lucia, saltedPassword } from "$lib/server/auth";
import { prisma } from "$lib/server/prisma";
import { hash } from "@node-rs/argon2";
import { fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions } from "./$types";

export const load = async () => {
  const form = await superValidate(zod(registerSchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    const form = await superValidate(request, zod(registerSchema));
    if (!form.valid) return fail(400, { form });

    const formData = form.data;

    if (!env.ACCEPTED_USERNAMES.split(",").includes(formData.username)) {
      return setError(form, "username", "Username non accettato");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username: formData.username,
      },
    });

    if (existingUser) {
      return setError(form, "username", "Username già esistente");
    }

    const passwordHash = await hash(saltedPassword(formData.password), hashOptions);
    const user = await prisma.user.create({
      data: {
        name: formData.name,
        username: formData.username,
        hashedPassword: passwordHash,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });

    redirect(302, "/admin");
  },
};

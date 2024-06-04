import { loginSchema } from "$lib/form/schema";
import { comparePassword, lucia } from "$lib/server/auth";
import { prisma } from "$lib/server/prisma";
import { fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions } from "./$types";

export const load = async () => {
  const form = await superValidate(zod(loginSchema));

  return { form };
};

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    const form = await superValidate(request, zod(loginSchema));
    if (!form.valid) return fail(400, { form });

    const formData = form.data;

    const user = await prisma.user.findUnique({
      where: {
        username: formData.username,
      },
    });

    if (!user) {
      return setError(form, "password", "Username o password errata");
    }

    const validPassword = comparePassword(user.hashedPassword, formData.password);
    if (!validPassword) {
      return setError(form, "password", "Username o password errata");
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });

    redirect(302, "/admin");
  },
};

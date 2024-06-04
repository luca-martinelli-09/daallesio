import { env } from "$env/dynamic/private";
import { editUserSchema } from "$lib/form/schema";
import { hashOptions, saltedPassword } from "$lib/server/auth";
import { prisma } from "$lib/server/prisma";
import { hash } from "@node-rs/argon2";
import { fail } from "@sveltejs/kit";
import { message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const form = await superValidate(locals.user, zod(editUserSchema));

  return {
    form,
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, zod(editUserSchema));
    if (!form.valid || !locals.user) return fail(400, { form });

    const formData = form.data;

    if (!env.ACCEPTED_USERNAMES.split(",").includes(formData.username)) {
      return setError(form, "username", "Username non accettato");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username: formData.username,
        NOT: {
          id: locals.user.id,
        },
      },
    });

    if (existingUser) {
      return setError(form, "username", "Username già esistente");
    }

    let passwordHash;
    if (formData.password?.length) {
      passwordHash = {
        hashedPassword: await hash(saltedPassword(formData.password), hashOptions),
      };
    }

    await prisma.user.update({
      where: {
        id: locals.user.id,
      },
      data: {
        name: formData.name,
        username: formData.username,
        ...passwordHash,
      },
    });

    return message(form, "Account salvato");
  },
};

import { editImageSchema } from "$lib/form/schema";
import { prisma } from "$lib/server/prisma";
import { error, fail } from "@sveltejs/kit";
import _ from "lodash";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  let image;

  try {
    image = await prisma.image.findUnique({
      where: {
        id: params.id,
      },
    });
  } catch (error) {}

  if (!image) error(404);

  return {
    image,
    form: await superValidate(image, zod(editImageSchema)),
  };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const form = await superValidate(request, zod(editImageSchema));
    if (!form.valid) return fail(400, { form });

    const formData = form.data;

    await prisma.image.update({
      where: {
        id: params.id,
      },
      data: _.omit(formData, "fileId", "fileName"),
    });

    return message(form, "Modifiche salvate con successo");
  },
};

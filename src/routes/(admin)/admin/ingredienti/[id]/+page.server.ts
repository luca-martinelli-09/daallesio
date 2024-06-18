import { editIngredientSchema } from "$lib/form/schema";
import { prisma } from "$lib/server/prisma";
import { error, fail } from "@sveltejs/kit";
import _ from "lodash";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  let ingredient;

  try {
    ingredient = await prisma.ingredient.findUnique({
      where: {
        id: params.id,
      },
      include: {
        image: true,
      },
    });
  } catch (error) {}

  if (!ingredient) error(404);

  return {
    ingredient,
    form: await superValidate(ingredient, zod(editIngredientSchema)),
  };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const form = await superValidate(request, zod(editIngredientSchema));
    if (!form.valid) return fail(400, { form });

    const formData = form.data;

    await prisma.ingredient.update({
      where: {
        id: params.id,
      },
      data: _.omit(formData, ["slug", "image"]),
    });

    return message(form, "Modifiche salvate con successo");
  },
};

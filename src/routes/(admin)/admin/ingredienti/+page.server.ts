import { env } from "$env/dynamic/private";
import { createIngredientSchema, deleteSchema } from "$lib/form/schema";
import { prisma } from "$lib/server/prisma";
import { fail, redirect } from "@sveltejs/kit";
import { message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions } from "../$types";
import type { PageServerLoad } from "./$types";
import { getPage } from "$lib/utils";
import type { Pagination } from "$lib/types";

export const load: PageServerLoad = async ({ url }) => {
  let page = getPage(url);
  let perPage = Number(env.PER_PAGE);

  const form = await superValidate(zod(createIngredientSchema));

  const ingredients = await prisma.ingredient.findMany({
    take: perPage,
    skip: perPage * (page - 1),
    orderBy: {
      name: "asc",
    },
    include: {
      image: true,
    },
  });

  const count = await prisma.ingredient.count();

  return {
    ingredients,
    pagination: {
      count,
      page,
      perPage,
    } as Pagination,
    form,
  };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const form = await superValidate(request, zod(createIngredientSchema));
    if (!form.valid) return fail(400, { form });

    const formData = form.data;

    const existingIngredient = await prisma.ingredient.findUnique({
      where: {
        slug: formData.slug,
      },
    });

    if (existingIngredient) {
      return setError(form, "slug", "Ingrediente già esistente");
    }

    const ingredient = await prisma.ingredient.create({
      data: {
        name: formData.name,
        slug: formData.slug,
      },
    });

    return redirect(302, "/admin/ingredienti/" + ingredient.id);
  },
  delete: async ({ request }) => {
    const form = await superValidate(request, zod(deleteSchema));
    if (!form.valid) return fail(400, { form });

    const { id } = form.data;

    const deleted = await prisma.ingredient.delete({
      where: {
        id: id,
      },
    });

    if (!deleted) {
      return fail(404);
    }

    return message(form, "Ingrediente eliminato correttamente");
  },
};

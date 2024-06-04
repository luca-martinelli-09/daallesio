import { env } from "$env/dynamic/private";
import { createRecipeSchema, deleteSchema } from "$lib/form/schema";
import { prisma } from "$lib/server/prisma";
import type { Pagination } from "$lib/types";
import { getPage } from "$lib/utils";
import { fail, redirect } from "@sveltejs/kit";
import { message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions } from "../$types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  let page = getPage(url);
  let perPage = Number(env.PER_PAGE);

  const form = await superValidate(zod(createRecipeSchema));

  const recipes = await prisma.recipe.findMany({
    take: perPage,
    skip: perPage * (page - 1),
    orderBy: [{ date: "desc" }, { title: "asc" }],
  });

  const count = await prisma.recipe.count();

  return {
    recipes,
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
    const form = await superValidate(request, zod(createRecipeSchema));
    if (!form.valid) return fail(400, { form });

    const formData = form.data;

    const existingRecipe = await prisma.recipe.findUnique({
      where: {
        slug: formData.slug,
      },
    });

    if (existingRecipe) {
      return setError(form, "slug", "Ricetta già esistente");
    }

    const recipe = await prisma.recipe.create({
      data: formData,
    });

    return redirect(302, "/admin/ricette/" + recipe.id);
  },
  delete: async ({ request }) => {
    const form = await superValidate(request, zod(deleteSchema));
    if (!form.valid) return fail(400, { form });

    const { id } = form.data;

    const deleted = await prisma.recipe.delete({
      where: {
        id: id,
      },
    });

    if (!deleted) {
      return fail(404);
    }

    return message(form, "Ricetta eliminata correttamente");
  },
};

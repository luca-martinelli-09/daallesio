import { env } from "$env/dynamic/private";
import {
  createRecipeTypeSchema,
  deleteSchema,
  reorderSchema,
} from "$lib/form/schema";
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

  const form = await superValidate(zod(createRecipeTypeSchema));
  const reorderForm = await superValidate(zod(reorderSchema));

  const recipeTypes = await prisma.recipeType.findMany({
    take: perPage,
    skip: perPage * (page - 1),
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });

  const count = await prisma.recipeType.count();

  return {
    recipeTypes,
    pagination: {
      count,
      page,
      perPage,
    } as Pagination,
    form,
    reorderForm,
  };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const form = await superValidate(request, zod(createRecipeTypeSchema));
    if (!form.valid) return fail(400, { form });

    const formData = form.data;

    const existingRecipeType = await prisma.recipeType.findUnique({
      where: {
        slug: formData.slug,
      },
    });

    if (existingRecipeType) {
      return setError(form, "slug", "Tipo di ricetta già esistente");
    }

    const recipeType = await prisma.recipeType.create({
      data: {
        title: formData.title,
        slug: formData.slug,
      },
    });

    return redirect(302, "/admin/tipi-ricette/" + recipeType.id);
  },
  delete: async ({ request }) => {
    const form = await superValidate(request, zod(deleteSchema));
    if (!form.valid) return fail(400, { form });

    const { id } = form.data;

    const deleted = await prisma.recipeType.delete({
      where: {
        id: id,
      },
    });

    if (!deleted) {
      return fail(404);
    }

    return message(form, "Tipo di ricetta eliminata correttamente");
  },
  reorder: async ({ request }) => {
    const formData = (await request.formData()).get("data")?.toString();

    if (!formData) return fail(400);

    const { data } = JSON.parse(formData) as {
      data: { id: string }[];
    };

    for (let i = 0; i < data.length; i++) {
      await prisma.recipeType.update({
        where: {
          id: data[i].id,
        },
        data: {
          order: i,
        },
      });
    }

    return { success: true };
  },
};

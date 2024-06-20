import { env } from "$env/dynamic/private";
import { createCollectionSchema, deleteSchema } from "$lib/form/schema";
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

  const form = await superValidate(zod(createCollectionSchema));

  const collections = await prisma.collection.findMany({
    take: perPage,
    skip: perPage * (page - 1),
    orderBy: [{ order: "asc" }],
  });

  const count = await prisma.collection.count();

  return {
    collections,
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
    const form = await superValidate(request, zod(createCollectionSchema));
    if (!form.valid) return fail(400, { form });

    const formData = form.data;

    const existingCollection = await prisma.collection.findUnique({
      where: {
        slug: formData.slug,
      },
    });

    if (existingCollection) {
      return setError(form, "slug", "Raccolta già esistente");
    }

    const collection = await prisma.collection.create({
      data: formData,
    });

    return redirect(302, "/admin/raccolte/" + collection.id);
  },
  delete: async ({ request }) => {
    const form = await superValidate(request, zod(deleteSchema));
    if (!form.valid) return fail(400, { form });

    const { id } = form.data;

    const deleted = await prisma.collection.delete({
      where: {
        id: id,
      },
    });

    if (!deleted) {
      return fail(404);
    }

    return message(form, "Raccolta eliminata correttamente");
  },
};

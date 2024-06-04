import { env } from "$env/dynamic/private";
import { createRecipeSchema, deleteSchema, uploadImageSchema } from "$lib/form/schema";
import { prisma } from "$lib/server/prisma";
import type { Pagination } from "$lib/types";
import { getPage } from "$lib/utils";
import { fail, redirect } from "@sveltejs/kit";
import { message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions } from "../$types";
import type { PageServerLoad } from "./$types";
import { createId } from "@paralleldrive/cuid2";
import { deleteFromS3, uploadToS3 } from "$lib/server/storage";

export const load: PageServerLoad = async ({ url }) => {
  let page = getPage(url);
  let perPage = Number(env.PER_PAGE);

  const form = await superValidate(zod(uploadImageSchema));

  const images = await prisma.image.findMany({
    take: perPage,
    skip: perPage * (page - 1),
    orderBy: [{ id: "desc" }],
  });

  const count = await prisma.image.count();

  return {
    images,
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
    const form = await superValidate(request, zod(uploadImageSchema));
    if (!form.valid) return fail(400, { form });

    const formData = form.data;
    const fileId = createId();

    try {
      await uploadToS3(formData.image, fileId);
    } catch (error) {
      return setError(form, "image", "Impossibile caricare l'immagine");
    }

    const image = await prisma.image.create({
      data: {
        fileId: fileId,
        fileName: formData.image.name,
        base64: formData.base64,
      },
    });

    return redirect(302, "/admin/immagini/" + image.id);
  },
  delete: async ({ request }) => {
    const form = await superValidate(request, zod(deleteSchema));
    if (!form.valid) return fail(400, { form });

    const { id } = form.data;

    const deleted = await prisma.image.delete({
      where: {
        id: id,
      },
    });

    try {
      await deleteFromS3(deleted.fileId + "/" + deleted.fileName);
    } catch (error) {}

    if (!deleted) {
      return fail(404);
    }

    return message(form, "Immagine eliminata correttamente");
  },
};

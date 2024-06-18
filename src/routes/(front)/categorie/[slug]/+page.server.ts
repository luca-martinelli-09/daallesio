import { prisma } from "$lib/server/prisma";
import { listRecipes } from "$lib/server/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, params }) => {
  const category = await prisma.recipeType.findUnique({
    where: {
      slug: params.slug,
    },
  });

  if (!category) {
    return error(404);
  }

  const { recipes, pagination } = await listRecipes(url, {
    typeId: category?.id,
  });

  return {
    recipes,
    category,
    pagination,
  };
};

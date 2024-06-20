import { prisma } from "$lib/server/prisma";
import { listRecipes } from "$lib/server/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, params }) => {
  const collection = await prisma.collection.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      recipes: {
        orderBy: [{ order: "asc" }],
      },
    },
    cacheStrategy: { ttl: 180 },
  });

  if (!collection) return error(404);

  const { recipes, pagination } = await listRecipes(url, {
    id: {
      in: collection?.recipes.filter((r) => r.recipeId).map((r) => r.recipeId as string),
    },
  });

  return {
    collection,
    recipes,
    pagination,
  };
};

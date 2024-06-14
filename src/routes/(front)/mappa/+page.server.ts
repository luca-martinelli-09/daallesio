import { prisma } from "$lib/server/prisma";
import { publishedScope } from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({}) => {
  const recipes = await prisma.recipe.findMany({
    where: {
      ...publishedScope,
    },
    include: {
      image: true,
      type: true,
    },
    cacheStrategy: { ttl: 180 },
  });

  return {
    recipes,
  };
};

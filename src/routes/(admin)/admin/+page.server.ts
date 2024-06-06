import { prisma } from "$lib/server/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { user } = await parent();

  const lastRecipes = await prisma.recipe.findMany({
    take: 5,
    orderBy: [{ date: "desc" }],
    include: {
      image: true,
    },
  });

  return {
    lastRecipes,
    user,
  };
};

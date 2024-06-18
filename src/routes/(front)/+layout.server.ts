
import { prisma } from "$lib/server/prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
  const categories = await prisma.recipeType.findMany();

  return {
    categories: categories,
  };
};

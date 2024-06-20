import { prisma } from "$lib/server/prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
  const categories = await prisma.recipeType.findMany();
  const collections = await prisma.collection.findMany({
    take: 15,
    orderBy: [{ order: "asc" }],
  });

  return {
    categories,
    collections,
  };
};

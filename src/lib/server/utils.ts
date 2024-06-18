import { env } from "$env/dynamic/private";
import { getPage, publishedScope } from "$lib/utils";
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { Pagination } from "$lib/types";

export async function listRecipes(url: URL, searchQuery: Prisma.RecipeWhereInput = {}) {
  let page = getPage(url);
  let perPage = Number(env.PER_PAGE);

  const recipes = await prisma.recipe.findMany({
    take: perPage,
    skip: perPage * (page - 1),
    where: {
      ...publishedScope,
      ...searchQuery,
      OR: [
        {
          title: {
            contains: url.searchParams.get("q") || "",
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      image: true,
      type: true,
    },
    orderBy: [{ date: "desc" }, { title: "asc" }],
    cacheStrategy: { ttl: 180 },
  });

  const count = await prisma.recipe.count();

  return {
    recipes,
    pagination: {
      count,
      page,
      perPage,
    } as Pagination,
  };
}

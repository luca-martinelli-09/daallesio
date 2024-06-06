import { env } from "$env/dynamic/private";
import { prisma } from "$lib/server/prisma";
import type { Pagination } from "$lib/types";
import { getPage, publishedScope } from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  let page = getPage(url);
  let perPage = Number(env.PER_PAGE);

  const recipes = await prisma.recipe.findMany({
    take: perPage,
    skip: perPage * (page - 1),
    where: {
      ...publishedScope,
      OR: [
        {
          title: {
            contains: url.searchParams.get("q") || "",
            mode: "insensitive",
          },
        },
      ],
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
};

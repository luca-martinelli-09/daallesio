import { env } from "$env/dynamic/private";
import { prisma } from "$lib/server/prisma";
import type { Pagination } from "$lib/types";
import { getPage } from "$lib/utils";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ url }) => {
  let page = getPage(url);
  let perPage = Number(env.PER_PAGE);

  const collections = await prisma.collection.findMany({
    take: perPage,
    skip: perPage * (page - 1),
    orderBy: [{ order: "asc" }],
    include: { image: true },
  });

  const count = await prisma.collection.count();

  return {
    collections,
    pagination: {
      count,
      page,
      perPage,
    } as Pagination,
  };
};

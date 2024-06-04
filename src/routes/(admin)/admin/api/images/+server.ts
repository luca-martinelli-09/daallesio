import { env } from "$env/dynamic/private";
import { prisma } from "$lib/server/prisma";
import type { Pagination } from "$lib/types";
import { getPage } from "$lib/utils";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  let page = getPage(url);
  let perPage = Number(env.PER_PAGE);
  let query = url.searchParams.get("q") || "";

  const images = await prisma.image.findMany({
    take: perPage,
    skip: perPage * (page - 1),
    orderBy: [{ id: "desc" }],
    where: {
      OR: [
        {
          fileName: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          tags: {
            hasSome: [query],
          },
        },
      ],
    },
  });

  const count = await prisma.image.count();

  return json({
    data: images,
    pagination: {
      count,
      page,
      perPage,
    } as Pagination,
  });
};

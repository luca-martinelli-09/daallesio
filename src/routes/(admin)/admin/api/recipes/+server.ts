import { prisma } from "$lib/server/prisma";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  let query = url.searchParams.get("q") || null;

  const recipes = await prisma.recipe.findMany({
    orderBy: {
      title: "asc",
    },
    where: {
      title: {
        contains: query || "",
        mode: "insensitive",
      },
    },
  });

  return json(recipes, { status: 200 });
};

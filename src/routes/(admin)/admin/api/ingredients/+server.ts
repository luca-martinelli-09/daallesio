import { prisma } from "$lib/server/prisma";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  let query = url.searchParams.get("q") || null;

  const ingredients = await prisma.ingredient.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
      name: {
        contains: query || "",
        mode: "insensitive",
      },
    },
  });

  return json(ingredients, { status: 200 });
};

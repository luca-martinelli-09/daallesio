import { prisma } from "$lib/server/prisma";
import { publishedScope } from "$lib/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  let recipe;

  try {
    recipe = await prisma.recipe.findUnique({
      where: {
        slug: params.slug,
        ...publishedScope,
      },
      include: {
        ingredientGroups: {
          orderBy: [{ order: "asc" }],
          include: {
            ingredients: {
              orderBy: [{ order: "asc" }],
              include: {
                ingredient: true,
                recipe: { where: publishedScope },
              },
            },
          },
        },
        image: true,
        type: true,
        sources: true,
        recipeSteps: {
          orderBy: [{ number: "asc" }],
          include: {
            images: {
              include: { image: true },
            },
          },
        },
      },
      cacheStrategy: { ttl: 180 },
    });
  } catch (error) {}

  if (!recipe) error(404);

  return {
    recipe,
  };
};

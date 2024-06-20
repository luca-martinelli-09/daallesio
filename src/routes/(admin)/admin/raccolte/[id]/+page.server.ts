import { editCollectionSchema } from "$lib/form/schema";
import { prisma } from "$lib/server/prisma";
import { error, fail } from "@sveltejs/kit";
import _ from "lodash";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  let collection;

  try {
    collection = await prisma.collection.findUnique({
      where: {
        id: params.id,
      },
      include: {
        recipes: {
          orderBy: [{ order: "asc" }],
          include: {
            recipe: true,
          },
        },
        image: true,
      },
    });
  } catch (error) {}

  if (!collection) error(404);

  return {
    collection,
    form: await superValidate(collection, zod(editCollectionSchema)),
  };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const form = await superValidate(request, zod(editCollectionSchema));
    if (!form.valid) return fail(400, { form });

    const formData = form.data;

    await prisma.collection.update({
      where: {
        id: params.id,
      },
      data: _.omit(formData, ["slug", "image", "recipes"]),
    });

    // Update recipe list

    if (formData.recipes) {
      const existingRecipes = await prisma.recipeCollection.findMany({
        where: {
          collectionId: params.id,
        },
      });

      // Delete removed recipes
      existingRecipes.forEach(async (s) => {
        if (formData.recipes.find((ss) => ss.id === s.id)) return;

        await prisma.recipeCollection.delete({
          where: {
            id: s.id,
          },
        });
      });

      formData.recipes.forEach(async (s) => {
        // Create if not exists
        if (!s.id) {
          await prisma.recipeCollection.create({
            data: {
              ..._.omit(s, "id", "recipe"),
              collectionId: params.id,
            },
          });

          return;
        }

        // Update if exists
        await prisma.recipeCollection.update({
          where: {
            id: s.id,
          },
          data: _.omit(s, "id", "recipe"),
        });
      });
    }

    return message(form, "Modifiche salvate con successo");
  },
};

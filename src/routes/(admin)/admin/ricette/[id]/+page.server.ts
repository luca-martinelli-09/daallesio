import { editFullRecipeSchema } from "$lib/form/schema";
import { prisma } from "$lib/server/prisma";
import type { IngredientGroup, RecipeStep } from "@prisma/client";
import { error, fail } from "@sveltejs/kit";
import _ from "lodash";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  let recipe;

  try {
    recipe = await prisma.recipe.findUnique({
      where: {
        id: params.id,
      },
      include: {
        ingredientGroups: {
          orderBy: [{ order: "asc" }],
          include: {
            ingredients: {
              orderBy: [{ order: "asc" }],
              include: {
                ingredient: { include: { image: true } },
                recipe: { include: { image: true } },
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
    });
  } catch (error) {}

  if (!recipe) error(404);

  const recipeTypes = await prisma.recipeType.findMany({
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });

  return {
    recipe,
    recipeTypes,
    form: await superValidate(recipe, zod(editFullRecipeSchema)),
  };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const form = await superValidate(request, zod(editFullRecipeSchema));
    if (!form.valid) return fail(400, { form });

    const formData = form.data;

    await prisma.recipe.update({
      where: {
        id: params.id,
      },
      data: _.omit(formData, ["slug", "sources", "ingredientGroups", "recipeSteps", "image"]),
    });

    // Update ingredient groups

    if (formData.ingredientGroups) {
      const existingGroups = await prisma.ingredientGroup.findMany({
        where: {
          recipeId: params.id,
        },
      });

      // Delete removed groups
      existingGroups.forEach(async (s) => {
        if (formData.ingredientGroups.find((ss) => ss.id === s.id)) return;

        await prisma.ingredientGroup.delete({
          where: {
            id: s.id,
          },
        });
      });

      formData.ingredientGroups.forEach(async (g) => {
        let ingredientGroup: IngredientGroup;

        // Create if not exists
        if (!g.id) {
          ingredientGroup = await prisma.ingredientGroup.create({
            data: {
              ..._.omit(g, ["id", "ingredients"]),
              recipeId: params.id,
            },
          });
        } else {
          // Update if exists
          ingredientGroup = await prisma.ingredientGroup.update({
            where: {
              id: g.id,
            },
            data: _.omit(g, ["id", "ingredients"]),
          });
        }

        // Update ingredients

        const existingIngredients = await prisma.recipeIngredient.findMany({
          where: {
            ingredientGroupId: ingredientGroup.id,
          },
        });

        // Delete removed ingredients
        existingIngredients.forEach(async (s) => {
          if (g.ingredients.find((ss) => ss.id === s.id)) return;

          await prisma.recipeIngredient.delete({
            where: {
              id: s.id,
              ingredientGroupId: ingredientGroup.id,
            },
          });
        });

        g.ingredients.forEach(async (i) => {
          // Create if not exists
          if (!i.id) {
            await prisma.recipeIngredient.create({
              data: {
                ..._.omit(i, ["id", "ingredient", "recipe"]),
                ingredientGroupId: ingredientGroup.id,
              },
            });
          } else {
            // Update if exists
            await prisma.recipeIngredient.update({
              where: {
                id: i.id,
              },
              data: _.omit(i, ["id", "ingredient", "recipe"]),
            });
          }
        });
      });
      
      return message(form, JSON.stringify(formData.ingredientGroups));
    }


    // Update sources

    if (formData.sources) {
      const existingSources = await prisma.source.findMany({
        where: {
          recipeId: params.id,
        },
      });

      // Delete removed sources
      existingSources.forEach(async (s) => {
        if (formData.sources.find((ss) => ss.id === s.id)) return;

        await prisma.source.delete({
          where: {
            id: s.id,
          },
        });
      });

      formData.sources.forEach(async (s) => {
        // Create if not exists
        if (!s.id) {
          await prisma.source.create({
            data: {
              ..._.omit(s, "id"),
              recipeId: params.id,
            },
          });
          return;
        }

        // Update if exists
        await prisma.source.update({
          where: {
            id: s.id,
          },
          data: _.omit(s, "id"),
        });
      });
    }

    // Update steps

    if (formData.recipeSteps) {
      const existingSteps = await prisma.recipeStep.findMany({
        where: {
          recipeId: params.id,
        },
      });

      // Delete removed steps
      existingSteps.forEach(async (s) => {
        if (formData.recipeSteps.find((ss) => ss.id === s.id)) return;

        await prisma.recipeStep.delete({
          where: {
            id: s.id,
          },
        });
      });

      formData.recipeSteps.forEach(async (s) => {
        // Create if not exists
        if (!s.id) {
          await prisma.recipeStep.create({
            data: {
              ..._.omit(s, ["id"]),
              recipeId: params.id,
            },
          });
        } else {
          // Update if exists
          await prisma.recipeStep.update({
            where: {
              id: s.id,
            },
            data: _.omit(s, ["id"]),
          });
        }
      });
    }

    return message(form, "Modifiche salvate con successo");
  },
};

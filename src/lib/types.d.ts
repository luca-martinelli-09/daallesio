import type { Prisma } from "@prisma/client";

export type Pagination = {
  page: number;
  count: number;
  perPage: number;
};

export type DeleteModalData = {
  open: boolean;
  id: string | null;
};

const recipeIngredientWithRelations = Prisma.validator<Prisma.RecipeIngredientGetPayload>()({
  include: { ingredient: { include: { image: true } }, recipe: { include: { image: true } } },
});
export type RecipeIngredientWithRelations = Prisma.RecipeIngredientGetPayload<typeof recipeIngredientWithRelations>;

const partialRecipe = Prisma.validator<Prisma.RecipeGetPayload>()({
  include: {
    image: true,
    type: true,
  },
});
export type PartialRecipe = Prisma.RecipeGetPayload<typeof partialRecipe>;

const fullRecipe = Prisma.validator<Prisma.RecipeGetPayload>()({
  include: {
    ingredientGroups: {
      include: {
        ingredients: {
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
      include: {
        images: {
          include: { image: true },
        },
      },
    },
  },
});
export type FullRecipe = Prisma.RecipeGetPayload<typeof fullRecipe>;

const partialCollection = Prisma.validator<Prisma.CollectionGetPayload>()({
  include: {
    image: true,
  },
});
export type PartialCollection = Prisma.CollectionGetPayload<typeof partialCollection>;

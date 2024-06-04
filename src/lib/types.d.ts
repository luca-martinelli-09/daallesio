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
  include: { ingredient: true, recipe: true },
});
export type RecipeIngredientWithRelations = Prisma.RecipeIngredientGetPayload<typeof recipeIngredientWithRelations>;

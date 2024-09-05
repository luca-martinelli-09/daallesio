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

const recipeIngredientWithRelations =
  Prisma.validator<Prisma.RecipeIngredientGetPayload>()({
    include: {
      ingredient: true,
      recipe: true,
    },
  });

export type RecipeIngredientWithRelations = Prisma.RecipeIngredientGetPayload<
  typeof recipeIngredientWithRelations
>;

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
export type PartialCollection = Prisma.CollectionGetPayload<
  typeof partialCollection
>;

export type BaseEditorOption = {
  id: string;
  type: "toggle" | "multiple" | "color";
  icon: typeof HighlighterIcon;
  active: boolean;
  isActive: () => boolean | undefined;
};

export type ToggleEditorOption = BaseEditorOption & {
  type: "toggle";
  click?: () => void;
};

export type MultipleEditorOption = BaseEditorOption & {
  type: "multiple";
  useActiveIcon?: boolean;
  options: EditorOption[];
};

export type ColorEditorOption = BaseEditorOption & {
  type: "color";
  color: string;
  selectedColor: (color: string) => void;
  getColor: () => string | undefined;
};

export type EditorOption =
  | ToggleEditorOption
  | MultipleEditorOption
  | ColorEditorOption;

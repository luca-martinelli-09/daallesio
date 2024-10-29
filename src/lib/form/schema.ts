import { Allergen, Continent, CookMode, Difficulty, OriginArea, RecipeIngredientType, SourceType, UnitType } from "@prisma/client";
import { z } from "zod";

// Reusables

const slug = z
  .string()
  .min(2, "Il permalink deve avere almeno 2 caratteri")
  .regex(/^[a-z-]+$/, "Il permalink può contenere solo lettere e -");

const name = z.string().min(2, "Il nome deve avere almeno 2 caratteri");
const tags = z.string().min(2, "Il tag deve avere almeno 2 caratteri").array();
const unitType = z.nativeEnum(UnitType, { message: "Unità di misura non valida" }).nullable();
const allergens = z.nativeEnum(Allergen, { message: "Allergeni non validi" }).array();
const order = z.number().gte(0, "L'ordine deve essere positivo").default(0);

export const deleteSchema = z.object({
  id: z.string(),
});

export const reorderSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
    })
  ),
});

// User

export const registerSchema = z.object({
  name: name,
  username: z
    .string()
    .min(3, "Lo username deve avere almeno 3 caratteri")
    .max(31, "Lo username deve eavere meno di 31 caratteri")
    .regex(/^[a-z0-9_-]+$/, "Lo username può contenere solo numeri, lettere, _ e -"),
  password: z.string().min(6, "La password deve avere almeno 6 caratteri").max(255, "La password deve avere meno di 255 caratteri"),
});

export const editUserSchema = registerSchema.merge(
  z.object({
    password: registerSchema.shape.password.optional(),
  })
);

export const loginSchema = registerSchema.omit({ name: true });

// Images

export const uploadImageSchema = z.object({
  image: z.instanceof(File, { message: "Carica un file" }).refine((f) => f.type.startsWith("image/"), "Il file caricato non è un immagine"),
  base64: z.string().nullable(),
});

export const editImageSchema = z.object({
  fileId: z.string(),
  fileName: z.string(),
  base64: z.string().nullable(),
  caption: z.string().nullable(),
  alt: z.string().nullable(),
  tags: tags,
});

// Ingredient

export const createIngredientSchema = z.object({
  name: name,
  slug: slug,
});

export const editIngredientSchema = createIngredientSchema.merge(
  z.object({
    slug: slug.optional(),
    plural: z.string().nullable(),
    vegan: z.boolean().default(false),
    vegetarian: z.boolean().default(false),
    allergens: allergens,
    tags: tags,
    defaultUnit: unitType,

    imageId: z.string().nullable(),
    image: editImageSchema.nullable(),
  })
);

// Recipe types

export const createRecipeTypeSchema = z.object({
  title: name,
  slug: slug,
});

export const editRecipeTypeSchema = createRecipeTypeSchema.merge(
  z.object({
    slug: slug.optional(),
    plural: name.nullable(),
    order: order,
  })
);

// Recipe

export const createRecipeSchema = z.object({
  title: name,
  slug: slug,
  date: z.date().default(new Date()),
  originPlace: z
    .object({
      city: z.string().nullable(),
      region: z.string().nullable(),
      country: z.string().min(3).max(3).nullable(),
      area: z.nativeEnum(OriginArea, { message: "Area di origine non valida" }).nullable(),
      continent: z.nativeEnum(Continent, { message: "Continente non valido" }).nullable(),
      lat: z.number().nullable(),
      lng: z.number().nullable(),
    })
    .default({
      city: null,
      region: null,
      country: null,
      area: null,
      continent: null,
      lat: null,
      lng: null,
    }),
  difficulty: z.nativeEnum(Difficulty, { message: "Difficolità non valida" }).default("MEDIUM"),
  time: z
    .object({
      preparation: z.number().int().positive("Il tempo di preparazione deve essere positivo").nullable(),
      rest: z.number().int().positive("Il tempo di riposo deve essere positivo").nullable(),
      cook: z.number().int().positive("Il tempo di cottura deve essere positivo").nullable(),
      leavening: z.number().int().positive("Il tempo di lievitazione deve essere positivo").nullable(),
    })
    .default({
      preparation: null,
      rest: null,
      cook: null,
      leavening: null,
    }),
  units: z.number().int().positive("La quantità deve essere positiva").default(1),
});

export const editRecipeSchema = createRecipeSchema.merge(
  z.object({
    slug: slug.optional(),
    tags: tags,
    allergens: allergens,
    draft: z.boolean().default(true),
    vegan: z.boolean().default(false),
    vegetarian: z.boolean().default(false),
    summary: z.string().nullable(),
    introduction: z.string().nullable(),
    conclusion: z.string().nullable(),
    cookMode: z.nativeEnum(CookMode, { message: "Modalità di cottura non valida" }).array().default([]),

    typeId: z.string().nullable(),
    imageId: z.string().nullable(),
  })
);

export const editFullRecipeSchema = editRecipeSchema.merge(
  z.object({
    sources: z
      .object({
        id: z.string().nullable(),
        type: z.nativeEnum(SourceType).default("GENERAL"),
        url: z.string().url("L'URL non è valido"),
        title: name,
      })
      .array()
      .default([]),

    ingredientGroups: z
      .object({
        id: z.string().nullable(),
        title: name.nullable(),
        order: order,
        ingredients: z
          .object({
            id: z.string(),
            name: name.nullable(),
            plural: name.nullable(),
            amount: z.number().positive("La quantità deve essere positiva").nullable(),
            fixed: z.boolean().default(false),
            unit: z.nativeEnum(UnitType).nullable(),
            moreInfo: z.string().nullable(),
            ingredientType: z.nativeEnum(RecipeIngredientType).default("INGREDIENT"),
            recipeId: z.string().nullable(),
            ingredientId: z.string().nullable(),
            order: order,
            ingredient: editIngredientSchema
              .merge(z.object({ id: z.string(), slug: slug }))
              .omit({ image: true })
              .nullable(),
            recipe: editRecipeSchema
              .merge(
                z.object({
                  id: z.string(),
                  slug: slug,
                  date: editRecipeSchema.shape.date.nullable(),
                })
              )
              .nullable(),
          })
          .array()
          .default([]),
      })
      .array()
      .default([]),

    recipeSteps: z
      .object({
        id: z.string().nullable(),
        number: order,
        text: z.string().min(2, "Il testo deve essere superiore a 2 caratteri"),
      })
      .array()
      .default([]),

    image: editImageSchema.nullable(),
  })
);

// Collections

export const createCollectionSchema = z.object({
  title: name,
  slug: slug,
});

export const editCollectionSchema = createCollectionSchema.merge(
  z.object({
    slug: slug.optional(),
    summary: z.string().nullable(),
    tags: tags,
    order: order,
    imageId: z.string().nullable(),

    image: editImageSchema.nullable(),

    recipes: z
      .object({
        id: z.string().nullable(),
        recipeId: z.string().nullable(),
        collectionId: z.string(),
        order: order,

        recipe: editRecipeSchema
          .merge(
            z.object({
              id: z.string(),
              slug: slug,
              date: editRecipeSchema.shape.date.nullable(),
            })
          )
          .nullable(),
      })
      .array()
      .default([]),
  })
);

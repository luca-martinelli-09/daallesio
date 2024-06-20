import type { Allergen, Continent, CookMode, Difficulty, OriginArea, RecipeIngredientType, SourceType, UnitType } from "@prisma/client";

export const OriginAreaEnum: Record<OriginArea, string> = {
  NORTH_EUROPE: "Nord Europa",
  MEDITERRANEAN_EUROPE: "Europa mediterranea",
  EAST_EUROPE: "Est Europa",
  NORTH_AMERICA: "Nord America",
  CENTRAL_AMERICA: "Centro America",
  SOUTH_AMERICA: "Sud America",
  EAST_ASIA: "Asia orientale",
  NORTH_ASIA: "Asia settentrionale",
  SOUTH_ASIA: "Asia meridionale",
  WEST_ASIA: "Asia occidentale",
  NORTH_AFRICA: "Nord Africa",
  SOUTH_AFRICA: "Sud Africa",
  WEST_AFRICA: "Africa orientale",
  EAST_AFRICA: "Africa occidentale",
  OCEANIA: "Oceania",
};

export const ContinentEnum: Record<Continent, string> = {
  ASIA: "Asia",
  AFRICA: "Africa",
  EUROPE: "Europa",
  AMERICA: "America",
  AUSTRALIA: "Australia",
};

export const DifficultyEnum: Record<Difficulty, string> = {
  VERY_EASY: "Molto facile",
  EASY: "Facile",
  MEDIUM: "Medio",
  DIFFICULT: "Difficile",
  VERY_DIFFICULT: "Molto difficile",
};

export const AllergenEnum: Record<Allergen, string> = {
  PEANUTS: "Arachidi",
  CRUSTACEANS: "Crostacei",
  TREE_NUTS: "Frutta a guschio",
  GLUTEN: "Glutine",
  MILK: "Lattosio",
  LUPIN: "Lupini",
  MOLLUSCS: "Molluschi",
  FISH: "Pesce",
  CELERY: "Sedano",
  SESAME: "Semi di sesamo",
  MUSTARD: "Senape",
  SOYBEANS: "Soia",
  SULPHUR_DIOXIDE: "Solfiti",
  EGG: "Uova",
};

export const SourceTypeEnum: Record<SourceType, string> = {
  YOUTUBE: "YouTube",
  TIKTOK: "TikTok",
  INSTAGRAM: "Instagram",
  REDDIT: "Reddit",
  BLOG: "Blog",
  BOOK: "Libro",
  GENERAL: "Generico",
};

export const RecipeIngredientTypeEnum: Record<RecipeIngredientType, string> = {
  INGREDIENT: "Ingrediente",
  RECIPE: "Ricetta",
};

export const UnitTypeEnum: Record<UnitType, string> = {
  NONE: "nessuna",

  MILLIGRAMS: "mg",
  GRAMS: "g",
  KILOGRAMS: "kg",

  MILLILITERS: "ml",
  LITERS: "l",

  SPOONS: "cucchiaio",

  LEAVES: "foglia",

  SACHET: "bustina",

  CLOVE: "spicchio",

  STEM: "gambo",
};

export const UnitTypeEnumPlural: Record<UnitType, string> = {
  NONE: "nessuna",

  MILLIGRAMS: "mg",
  GRAMS: "g",
  KILOGRAMS: "kg",

  MILLILITERS: "ml",
  LITERS: "l",

  SPOONS: "cucchiai",

  LEAVES: "foglie",

  SACHET: "bustine",

  CLOVE: "spicchi",

  STEM: "gambi",
};

export const CookModeEnum: Record<CookMode, string> = {
  GRILLED: "Grigliata",
  BAKED: "In forno",
  FRIED: "Fritta",
  MICROWAVED: "In microonde",
  STEWED: "Stufata",
  BOILED: "Bollita",
  STEAMED: "Al vapore",
};

export function createEnumSelect<T extends string | number | symbol>(en: Record<T, string>) {
  return Object.entries(en).map(([value, label]) => ({ value, label: label as string }));
}

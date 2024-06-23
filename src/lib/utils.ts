import { env } from "$env/dynamic/public";
import type { Allergen, Image, Recipe } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { MilkOffIcon, VeganIcon, WheatOffIcon } from "lucide-svelte";
import { toast } from "svelte-sonner";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { superForm, type SuperValidated } from "sveltekit-superforms";
import { twMerge } from "tailwind-merge";
import Cashew from "./components/icons/Cashew.svelte";
import Celery from "./components/icons/Celery.svelte";
import Crab from "./components/icons/Crab.svelte";
import Eggs from "./components/icons/Eggs.svelte";
import Fish from "./components/icons/Fish.svelte";
import Gluten from "./components/icons/Gluten.svelte";
import Lupine from "./components/icons/Lupine.svelte";
import Milk from "./components/icons/Milk.svelte";
import Nuts from "./components/icons/Nuts.svelte";
import Sesame from "./components/icons/Sesame.svelte";
import Soya from "./components/icons/Soya.svelte";
import SoyBean from "./components/icons/SoyBean.svelte";
import Squid from "./components/icons/Squid.svelte";
import Sulphites from "./components/icons/Sulphites.svelte";
import Wheat from "./components/icons/Wheat.svelte";
import { AllergenEnum, UnitTypeEnum, UnitTypeEnumPlural } from "./form/enums";
import type { RecipeIngredientWithRelations } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (node: Element, params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;

  const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (style: Record<string, number | string | undefined>): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, "");
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t,
      });
    },
    easing: cubicOut,
  };
};

export function title(title?: string) {
  if (!title) return env.PUBLIC_APP_NAME;
  return title + " | " + env.PUBLIC_APP_NAME;
}

export function crudForm<T extends Record<string, unknown>>(form: SuperValidated<T>, useJson: boolean = false) {
  return superForm(form, {
    resetForm: false,
    onUpdate: ({ form }) => {
      if (form.valid) toast(form.message);
    },
    dataType: useJson ? "json" : "form",
  });
}

export function getPage(url: URL) {
  return Number(url.searchParams.get("page")) || 1;
}

export function dateWithoutTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getIngredientName(ingredient: RecipeIngredientWithRelations) {
  const name =
    ingredient.name || (ingredient.ingredientType === "INGREDIENT" && ingredient.ingredient?.name) || (ingredient.ingredientType === "RECIPE" && ingredient.recipe?.title) || "Ingrediente senza nome";

  const plural = ingredient.plural || (ingredient.ingredientType === "INGREDIENT" && ingredient.ingredient?.plural) || (ingredient.ingredientType === "RECIPE" && ingredient.recipe?.title) || name;

  return !ingredient.amount || ingredient.amount === 1 ? name : plural;
}

export function getIngredientAmount(ingredient: RecipeIngredientWithRelations) {
  let amountNum = ingredient.amount;

  if (amountNum) {
    amountNum = amountNum * 10;
    amountNum = Math.round(amountNum);
    amountNum = amountNum / 10;
  }

  const amount = amountNum || "q.b.";
  const unitType = ingredient.unit || (ingredient.ingredientType === "INGREDIENT" && ingredient.ingredient?.defaultUnit);
  const unitTypePluralName = unitType && amount !== 1 ? UnitTypeEnumPlural[unitType] : null;
  const unitTypeName = unitType && ingredient.amount && unitType !== "NONE" ? unitTypePluralName || UnitTypeEnum[unitType] : "";

  return `${amount}${unitTypeName}`;
}

export function getIngredientRowString(ingredient: RecipeIngredientWithRelations) {
  const name = getIngredientName(ingredient);
  const amount = getIngredientAmount(ingredient);

  let moreInfo = "";
  if (ingredient.moreInfo && ingredient.moreInfo.length) {
    moreInfo = `(${ingredient.moreInfo})`;
  }

  return `${amount} ${name} ${moreInfo}`.replace(/ {2,}/g, " ");
}

export function mergeIngredients(ingredients: RecipeIngredientWithRelations[]) {
  return ingredients.reduce((acc, ingredient) => {
    const existingIngredient = acc.find((i) => i.ingredientId === ingredient.ingredientId);
    if (existingIngredient && existingIngredient.amount && ingredient.amount && ingredient.unit === existingIngredient.unit && ingredient.moreInfo === existingIngredient.moreInfo) {
      existingIngredient.amount += ingredient.amount;
    } else {
      acc.push(ingredient);
    }
    return acc;
  }, [] as RecipeIngredientWithRelations[]);
}

export function calcAmountIngredients(ingredients: RecipeIngredientWithRelations[], defaultUnit: number, unit: number) {
  const multiplier = unit / defaultUnit;

  return ingredients.map((ingredient) => {
    return {
      ...ingredient,
      amount: ingredient.amount && !ingredient.fixed ? ingredient.amount * multiplier : ingredient.amount,
    };
  });
}

export function getImageUrl(image: Image) {
  if (!image) return "";

  return env.PUBLIC_S3_URL + image.fileId + "/" + image.fileName;
}

export const publishedScope = {
  date: {
    lt: new Date(),
  },
  draft: false,
};

export function getSrcSet(src: string) {
  return [
    "/cdn-cgi/image/width=320,format=webp/" + src + " 320w",
    "/cdn-cgi/image/width=480,format=webp/" + src + " 480w",
    "/cdn-cgi/image/width=640,format=webp/" + src + " 640w",
    "/cdn-cgi/image/width=720,format=webp/" + src + " 720w",
  ].join(", ");
}

export function formatTime(time: number) {
  const days = Math.floor(time / (60 * 24));
  const restMinutes = time - days * 60 * 24;
  const hours = Math.floor(restMinutes / 60);
  const minutes = restMinutes % 60;

  let dayString = days ? `${days} giorni` : "";
  let hourString = hours ? `${hours}h` : "";
  let minuteString = minutes ? `${minutes}m` : "";

  return `${dayString} ${hourString} ${minuteString}`.replace(/ +(?= )/g, "").trim();
}

export function getRecipeLabels(recipe: Recipe) {
  let recipeLabels: {
    icon: typeof VeganIcon;
    text: string;
    color: string;
  }[] = [];

  if (recipe.vegan || recipe.vegetarian) {
    recipeLabels.push({
      icon: VeganIcon,
      text: recipe.vegan ? "Vegana" : "Vegetariana",
      color: "bg-green-700 dark:bg-green-500 text-primary-foreground",
    });
  }

  if (recipe.allergens.indexOf("GLUTEN") < 0) {
    recipeLabels.push({
      icon: WheatOffIcon,
      text: "Senza glutine",
      color: "bg-yellow-300 dark:bg-yellow-700",
    });
  }

  if (recipe.allergens.indexOf("MILK") < 0) {
    recipeLabels.push({
      icon: MilkOffIcon,
      text: "Senza lattosio",
      color: "bg-blue-200 dark:bg-blue-800",
    });
  }

  return recipeLabels;
}

export function getRecipeAllergens(recipe: Recipe) {
  let allergenIcons: Record<Allergen, typeof Wheat> = {
    CELERY: Celery,
    CRUSTACEANS: Crab,
    EGG: Eggs,
    FISH: Fish,
    GLUTEN: Gluten,
    LUPIN: Lupine,
    MILK: Milk,
    MOLLUSCS: Squid,
    PEANUTS: Cashew,
    SESAME: Sesame,
    SOYBEANS: Soya,
    SULPHUR_DIOXIDE: Sulphites,
    TREE_NUTS: Nuts,
    MUSTARD: SoyBean,
  };

  let recipeAllergens = recipe.allergens.map((allergen) => {
    return {
      text: AllergenEnum[allergen],
      icon: allergenIcons[allergen],
    };
  });

  return recipeAllergens;
}

export function formatDuration(time: number | null) {
  return time ? "PT" + time.toString() + "M" : "PT0M";
}

export function removeTags(str: string) {
  if (str === null || str === "") return false;
  else str = str.toString();

  return str.replace(/(<([^>]+)>)/gi, "");
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

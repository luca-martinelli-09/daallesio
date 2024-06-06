import { env } from "$env/dynamic/public";
import { type ClassValue, clsx } from "clsx";
import { toast } from "svelte-sonner";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { superForm, type SuperValidated } from "sveltekit-superforms";
import { twMerge } from "tailwind-merge";
import { UnitTypeEnum } from "./form/enums";
import type { RecipeIngredientWithRelations } from "./types";
import type { Image } from "@prisma/client";

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

export function title(title: string) {
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

export function getIngredientRowString(ingredient: RecipeIngredientWithRelations) {
  const name =
    ingredient.name || (ingredient.ingredientType === "INGREDIENT" && ingredient.ingredient?.name) || (ingredient.ingredientType === "RECIPE" && ingredient.recipe?.title) || "Ingrediente senza nome";

  const plural = ingredient.plural || (ingredient.ingredientType === "INGREDIENT" && ingredient.ingredient?.plural) || (ingredient.ingredientType === "RECIPE" && ingredient.recipe?.title) || name;

  const amount = ingredient.amount || "q.b.";
  const unitType = ingredient.unit || (ingredient.ingredientType === "INGREDIENT" && ingredient.ingredient?.defaultUnit);

  const unitTypeName = unitType && ingredient.amount && unitType !== "NONE" ? UnitTypeEnum[unitType] : "";

  return `${amount}${unitTypeName} ${!amount || amount === 1 ? name : plural}`.replace(/ {2,}/g, " ");
}

export function getImageUrl(image: Image) {
  return env.PUBLIC_S3_URL + image.fileId + "/" + image.fileName;
}


export const publishedScope = {
  date: {
    lt: new Date(),
  },
  draft: false,
};
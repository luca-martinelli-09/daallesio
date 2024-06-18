import { OriginAreaEnum } from "$lib/form/enums";
import { listRecipes } from "$lib/server/utils";
import { slugify } from "$lib/utils";
import type { OriginArea } from "@prisma/client";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, params }) => {
  const area = (Object.keys(OriginAreaEnum) as OriginArea[]).find((k) => slugify(OriginAreaEnum[k]) === params.slug);

  if (!area) {
    return error(404);
  }

  const { recipes, pagination } = await listRecipes(url, {
    originPlace: {
      is: {
        area: area,
      },
    },
  });
  return {
    recipes,
    area,
    pagination,
  };
};

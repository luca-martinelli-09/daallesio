import { listRecipes } from "$lib/server/utils";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, params }) => {
  const { recipes, pagination } = await listRecipes(url, {
    tags: {
      has: params.slug,
    },
  });

  return {
    recipes,
    tag: params.slug,
    pagination,
  };
};

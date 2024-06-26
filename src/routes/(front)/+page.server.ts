import { listRecipes } from "$lib/server/utils";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, params }) => {
  const { recipes, pagination } = await listRecipes(url);

  return {
    recipes,
    pagination,
  };
};

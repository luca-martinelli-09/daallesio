import { fetchRecipes } from '$lib/utils';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, params }) => {
	const recipe = await import(`../../../res/recipes/${params.id}.md`);
	const info = await fetchRecipes(url, params.id);

	return {
		info,
		default: recipe.default
	};
};

import { fetchRecipes } from '$lib/utils';

export const load = async ({ params }: any) => {
	const recipe = await import(`../../../res/recipes/${params.id}.md`);
	const info = await fetchRecipes(params.id);

	return {
		info,
		default: recipe.default
	};
};

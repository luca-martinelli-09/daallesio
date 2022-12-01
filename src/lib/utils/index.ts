import type { Ingredient, Recipe } from './d';

export const fetchIngredients = async () => {
	const allIngredientsFiles = import.meta.glob('../../res/ingredients/*.md');
	const iterableIngredientsFiles = Object.entries(allIngredientsFiles);

	let allIngredients = await Promise.all(
		iterableIngredientsFiles.map(async ([_, resolver]) => {
			return <Ingredient>(<any>await resolver()).metadata;
		})
	);

	allIngredients = allIngredients.sort((a, b) =>
		a.id.localeCompare(b.id, 'en', { sensitivity: 'base' })
	);

	return allIngredients;
};

export const fetchRecipes = async (id: string | null = null) => {
	const allRecipesFiles = import.meta.glob('../../res/recipes/*.md');
	const iterableRecipesFiles = Object.entries(allRecipesFiles);

	const allIngredients = Object.fromEntries((await fetchIngredients()).map((x: any) => [x.id, x]));

	let allRecipes = await Promise.all(
		iterableRecipesFiles.map(async ([_, resolver]) => {
			const recipe = <Recipe>(<any>await resolver()).metadata;

			recipe.ingredients = recipe.ingredients.map((x) => ({
				...allIngredients[x.id],
				...x
			}));

			return recipe;
		})
	);

	allRecipes = allRecipes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	allRecipes = allRecipes.filter((a) => !a.draft);

	if (id) {
		return allRecipes.filter((a) => a.id === id).pop();
	}

	return allRecipes;
};

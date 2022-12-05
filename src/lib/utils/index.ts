import type { Ingredient, Recipe } from './utils';

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

			let vegetarian = recipe.ingredients.map((i) => i.vegetarian).reduce((a, b) => a && b);
			let vegan = recipe.ingredients.map((i) => i.vegan).reduce((a, b) => a && b);

			return { ...recipe, vegetarian, vegan };
		})
	);

	allRecipes = allRecipes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	allRecipes = allRecipes.filter((a) => !a.draft);

	if (id) {
		return allRecipes.filter((a) => a.id === id).pop();
	}

	return allRecipes;
};

export const toHours = (minutes: number | undefined) => {
	if (!minutes) return 'n.d.';

	const hours = Math.floor(minutes / 60);
	minutes = minutes % 60;

	const stack = [];

	if (hours) stack.push(hours + ' ore');

	if (minutes > 0) stack.push(minutes + ' minuti');

	return stack.join(' e ');
};

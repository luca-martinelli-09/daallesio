import type { Ingredient, Recipe, SearchOptions } from './utils';

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
			
			for (const ingredientsGroup of recipe.ingredients) {
				ingredientsGroup.ingredients = ingredientsGroup.ingredients.map((i) => ({
					...allIngredients[i.id],
					...i
				}));
			}

			const ingredients = recipe.ingredients.reduce(
				(pi, ci) => pi.concat(ci.ingredients),
				[] as Ingredient[]
			);

			let vegetarian = ingredients.map((i) => i.vegetarian).reduce((a, b) => a && b);
			let vegan = ingredients.map((i) => i.vegan).reduce((a, b) => a && b);

			return { ...recipe, vegetarian, vegan };
		})
	);

	allRecipes = allRecipes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	allRecipes = allRecipes.filter((a) => !a.draft);

	if (id) {
		allRecipes = allRecipes.map((r) => {
			let related: Recipe[] = [];
			for (let recipeID of r.related || []) {
				const relatedRecipe = allRecipes.filter((a) => a.id === recipeID).pop();
				if (relatedRecipe) related.push(relatedRecipe);
			}
			r.related = related;
			return r;
		});

		return allRecipes.filter((a) => a.id === id).pop();
	}

	return allRecipes;
};

export const queryRecipes = async (query: string = '', options: SearchOptions | null = null) => {
	const allRecipes = <Recipe[]>await fetchRecipes();
	query = query.toLowerCase();

	let searchResults = allRecipes?.filter((r: Recipe) => {
		return r.title.toLowerCase().includes(query);
	});

	if (options) {
		searchResults = searchResults.filter((r: Recipe) => {
			let res = true;
			if (options.type) res = res && r.type === options.type;
			if (options.difficulty) res = res && r.difficulty === options.difficulty;
			if (options.originPlace)
				res = res && r.originPlace?.continent === options.originPlace.continent;
			if (options.vegan) res = res && (r.vegan || false);
			if (options.vegetarian) res = res && (r.vegetarian || false);
			return res;
		});
	}

	return searchResults;
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

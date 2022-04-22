const allRecipes = import.meta.globEager('./recipes/*.md');
const allIngredients = import.meta.globEager('./ingredients/*.md');

const ingredients = {};
for (const path in allIngredients) {
  const ingredient = allIngredients[path];
  if (ingredient) {
    ingredients[ingredient.metadata.id] = { ...ingredient.metadata };
  }
}

const recipes = {};
for (const path in allRecipes) {
  const recipe = allRecipes[path];

  if (recipe && !recipe.metadata.draft) {
    const recipeIngredients = recipe.metadata.ingredients;
    for (const i in recipeIngredients) {
      const ingredient = recipeIngredients[i];
      const ingredientInfo = ingredients[ingredient.id];

      if (ingredientInfo)
        recipeIngredients[i] = {
          ...ingredient,
          ...ingredientInfo
        };
    }

    recipes[recipe.metadata.id] = {
      ...recipe.metadata,
      ...recipe.default.render(),
      ingredients: recipeIngredients
    };
  }
}

const orderedRecipes = Object.values(recipes)
  .sort((a, b) =>
    new Date(a.date).getTime() > new Date(b.date).getTime()
      ? -1
      : new Date(a.date).getTime() < new Date(b.date).getTime()
        ? 1
        : 0);

export { orderedRecipes, recipes };
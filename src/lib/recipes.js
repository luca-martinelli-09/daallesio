const allRecipes = import.meta.globEager('./recipes/*.md');

const recipes = [];
for (const path in allRecipes) {
  const recipe = allRecipes[path];
  if (recipe) {
    recipes.push({
      ...recipe.metadata,
      ...recipe.default.render()
    });
  }
}

const filteredRecipes = recipes
  .filter((recipe) => !recipe.hidden)
  .sort((a, b) =>
    new Date(a.date).getTime() > new Date(b.date).getTime()
      ? -1
      : new Date(a.date).getTime() < new Date(b.date).getTime()
        ? 1
        : 0
  )


export default filteredRecipes;